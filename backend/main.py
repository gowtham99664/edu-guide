from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Optional, List
import psycopg2
import psycopg2.extras
import secrets
import base64
import os
import json
from datetime import datetime, timedelta
import httpx
from dotenv import load_dotenv
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes
from jose import JWTError, jwt
from passlib.context import CryptContext

# ─── Load .env ─────────────────────────────────────────────────────────────────
load_dotenv()

# ─── Config ────────────────────────────────────────────────────────────────────
SECRET_KEY = os.environ.get("SECRET_KEY", "eduguide-super-secret-2024-change-in-prod")
MASTER_ENCRYPTION_KEY = os.environ.get("MASTER_KEY", "eduguide-master-aes-key-32bytesXX")
ALGORITHM = "HS256"
OLLAMA_URL = os.environ.get("OLLAMA_URL", "http://eduguide-ollama:11434")
OLLAMA_MODEL = "qwen2.5:1.5b"

DB_CONFIG = {
    "host": os.environ.get("DB_HOST", "eduguide-db"),
    "port": int(os.environ.get("DB_PORT", 5432)),
    "database": os.environ.get("DB_NAME", "eduguide_db"),
    "user": os.environ.get("DB_USER", "eduguide"),
    "password": os.environ.get("DB_PASS", "EduGuide2024Secure"),
}

# ─── AES-256-GCM Encryption ─────────────────────────────────────────────────────
def _derive_key(salt: bytes) -> bytes:
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=600_000,
    )
    return kdf.derive(MASTER_ENCRYPTION_KEY.encode())

def encrypt_field(plaintext: str) -> str:
    if not plaintext:
        return plaintext
    salt = secrets.token_bytes(16)
    nonce = secrets.token_bytes(12)
    key = _derive_key(salt)
    aesgcm = AESGCM(key)
    ciphertext = aesgcm.encrypt(nonce, plaintext.encode(), None)
    return base64.b64encode(salt + nonce + ciphertext).decode()

def decrypt_field(blob_b64: str) -> str:
    if not blob_b64:
        return blob_b64
    blob = base64.b64decode(blob_b64)
    salt, nonce, ciphertext = blob[:16], blob[16:28], blob[28:]
    key = _derive_key(salt)
    aesgcm = AESGCM(key)
    return aesgcm.decrypt(nonce, ciphertext, None).decode()

# ─── Password hashing ──────────────────────────────────────────────────────────
pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto", bcrypt__rounds=12)
def hash_password(pw: str) -> str:
    return pwd_ctx.hash(pw)
def verify_password(plain: str, hashed: str) -> bool:
    return pwd_ctx.verify(plain, hashed)

# ─── JWT ────────────────────────────────────────────────────────────────────────
def create_access_token(data: dict) -> str:
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)
def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

# ─── DB ─────────────────────────────────────────────────────────────────────────
def get_db():
    conn = psycopg2.connect(**DB_CONFIG)
    try:
        yield conn
    finally:
        conn.close()

def init_db():
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            dob TEXT NOT NULL,
            phone TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT NOW()
        );
        CREATE TABLE IF NOT EXISTS profiles (
            id SERIAL PRIMARY KEY,
            user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
            highest_qualification TEXT,
            goal TEXT,
            skills TEXT,
            updated_at TIMESTAMP DEFAULT NOW()
        );
        CREATE TABLE IF NOT EXISTS roadmaps (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            plan_text TEXT NOT NULL,
            ai_powered BOOLEAN DEFAULT FALSE,
            model TEXT,
            qualification TEXT,
            goal TEXT,
            skills TEXT,
            created_at TIMESTAMP DEFAULT NOW()
        );
        CREATE TABLE IF NOT EXISTS milestones (
            id SERIAL PRIMARY KEY,
            roadmap_id INTEGER REFERENCES roadmaps(id) ON DELETE CASCADE,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            section TEXT NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            milestone_type TEXT DEFAULT 'general',
            sort_order INTEGER DEFAULT 0,
            completed BOOLEAN DEFAULT FALSE,
            completed_at TIMESTAMP,
            checkin_data JSONB DEFAULT '{}',
            created_at TIMESTAMP DEFAULT NOW()
        );
        CREATE INDEX IF NOT EXISTS idx_roadmaps_user ON roadmaps(user_id);
        CREATE INDEX IF NOT EXISTS idx_milestones_roadmap ON milestones(roadmap_id);
        CREATE INDEX IF NOT EXISTS idx_milestones_user ON milestones(user_id);

        CREATE TABLE IF NOT EXISTS user_roles (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            role TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT NOW(),
            UNIQUE(user_id, role)
        );

        CREATE TABLE IF NOT EXISTS mentor_profiles (
            id SERIAL PRIMARY KEY,
            user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
            headline TEXT NOT NULL,
            bio TEXT NOT NULL,
            expertise JSONB DEFAULT '[]',
            languages JSONB DEFAULT '[]',
            experience_years INTEGER DEFAULT 0,
            verification_status TEXT DEFAULT 'pending',
            published BOOLEAN DEFAULT FALSE,
            is_accepting BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS mentorship_requests (
            id SERIAL PRIMARY KEY,
            mentee_user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            mentor_user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            topic TEXT NOT NULL,
            message TEXT NOT NULL,
            preferred_mode TEXT DEFAULT 'chat',
            scheduled_at TIMESTAMP,
            status TEXT DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS admin_audit_logs (
            id SERIAL PRIMARY KEY,
            admin_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
            action TEXT NOT NULL,
            target_type TEXT NOT NULL,
            target_id TEXT NOT NULL,
            note TEXT,
            created_at TIMESTAMP DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS idx_user_roles_user ON user_roles(user_id);
        CREATE INDEX IF NOT EXISTS idx_mentor_profiles_user ON mentor_profiles(user_id);
        CREATE INDEX IF NOT EXISTS idx_mentor_profiles_status ON mentor_profiles(verification_status, published);
        CREATE INDEX IF NOT EXISTS idx_mentorship_requests_mentee ON mentorship_requests(mentee_user_id);
        CREATE INDEX IF NOT EXISTS idx_mentorship_requests_mentor ON mentorship_requests(mentor_user_id);
        CREATE INDEX IF NOT EXISTS idx_admin_audit_admin ON admin_audit_logs(admin_user_id);
        CREATE INDEX IF NOT EXISTS idx_admin_audit_target ON admin_audit_logs(target_type, target_id);

        CREATE TABLE IF NOT EXISTS exam_calendar (
            id SERIAL PRIMARY KEY,
            exam_name TEXT NOT NULL,
            exam_category TEXT CHECK (exam_category IN ('Engineering','Medical','Law','Management','School','Other')),
            event_type TEXT CHECK (event_type IN ('application_start','application_end','exam_date','result_date','counselling')),
            event_date DATE NOT NULL,
            event_end_date DATE,
            description TEXT,
            website_url TEXT,
            is_tentative BOOLEAN DEFAULT FALSE,
            created_by INTEGER REFERENCES users(id),
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS subscriptions (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            exam_name TEXT NOT NULL,
            subscribe_type TEXT DEFAULT 'all',
            created_at TIMESTAMP DEFAULT NOW(),
            UNIQUE(user_id, exam_name)
        );

        CREATE INDEX IF NOT EXISTS idx_exam_calendar_date ON exam_calendar(event_date);
        CREATE INDEX IF NOT EXISTS idx_exam_calendar_category ON exam_calendar(exam_category);
        CREATE INDEX IF NOT EXISTS idx_exam_calendar_name ON exam_calendar(exam_name);
        CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);

    """)

    cur.execute("""
        INSERT INTO user_roles (user_id, role)
        SELECT id, 'mentee' FROM users
        ON CONFLICT (user_id, role) DO NOTHING
    """)
    conn.commit()
    cur.close()
    conn.close()

# ─── App ────────────────────────────────────────────────────────────────────────
app = FastAPI(title="Vidya Maarg API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    init_db()

bearer = HTTPBearer()

def get_current_user(creds: HTTPAuthorizationCredentials = Depends(bearer)):
    return decode_token(creds.credentials)

def _get_roles(user_id: int, db):
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    cur.execute("SELECT role FROM user_roles WHERE user_id = %s", (user_id,))
    return [r["role"] for r in cur.fetchall()]

def _require_role(user_id: int, role: str, db):
    roles = _get_roles(user_id, db)
    if role not in roles:
        raise HTTPException(status_code=403, detail=f"{role} role required")
    return roles

# ─── Schemas ────────────────────────────────────────────────────────────────────
class RegisterRequest(BaseModel):
    first_name: str
    last_name: str
    dob: str
    phone: str
    email: str
    password: str
    confirm_password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class ProfileRequest(BaseModel):
    highest_qualification: str
    goal: str
    skills: str

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str

class PlanRequest(BaseModel):
    highest_qualification: str
    goal: str
    skills: str

class MilestoneCheckinRequest(BaseModel):
    rank: Optional[str] = None
    score: Optional[str] = None
    percentile: Optional[str] = None
    category: Optional[str] = None
    notes: Optional[str] = None

class SaveRoadmapRequest(BaseModel):
    plan_text: str
    ai_powered: bool = False
    model: str = ""
    milestones: List[dict] = []

# ─── Mentor-Mentee Schemas ──────────────────────────────────────────────────────
class MentorApplyRequest(BaseModel):
    headline: str
    bio: str
    expertise: List[str] = []
    languages: List[str] = []
    experience_years: int = 0
    is_accepting: bool = True

class MentorshipRequestCreate(BaseModel):
    mentor_user_id: int
    topic: str
    message: str
    preferred_mode: str = "chat"
    scheduled_at: Optional[str] = None

class MentorshipRequestStatusUpdate(BaseModel):
    status: str

class AdminMentorReviewRequest(BaseModel):
    status: str
    published: Optional[bool] = None
    note: Optional[str] = None

class AdminMentorshipStatusRequest(BaseModel):
    status: str

# ─── Routes ─────────────────────────────────────────────────────────────────────
@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/api/register", status_code=201)
def register(req: RegisterRequest, db=Depends(get_db)):
    if req.password != req.confirm_password:
        raise HTTPException(400, "Passwords do not match")
    if len(req.password) < 8:
        raise HTTPException(400, "Password must be at least 8 characters")

    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)

    cur.execute("SELECT id FROM users WHERE email = %s", (req.email.lower(),))
    if cur.fetchone():
        raise HTTPException(409, "Email already registered")
    cur.execute("""
        INSERT INTO users (first_name, last_name, dob, phone, email, password_hash)
        VALUES (%s, %s, %s, %s, %s, %s) RETURNING id
    """, (
        encrypt_field(req.first_name),
        encrypt_field(req.last_name),
        encrypt_field(req.dob),
        encrypt_field(req.phone),
        req.email.lower(),
        hash_password(req.password)
    ))
    user_id = cur.fetchone()["id"]
    cur.execute("INSERT INTO user_roles (user_id, role) VALUES (%s, 'mentee') ON CONFLICT (user_id, role) DO NOTHING", (user_id,))
    db.commit()
    token = create_access_token({"sub": str(user_id), "email": req.email.lower()})
    return {"access_token": token, "token_type": "bearer", "user_id": user_id}

@app.post("/api/login")
def login(req: LoginRequest, db=Depends(get_db)):
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    cur.execute("SELECT * FROM users WHERE email = %s", (req.email.lower(),))
    user = cur.fetchone()
    if not user or not verify_password(req.password, user["password_hash"]):
        raise HTTPException(401, "Invalid email or password")
    token = create_access_token({"sub": str(user["id"]), "email": user["email"]})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "email": user["email"],
            "first_name": decrypt_field(user["first_name"]),
            "last_name": decrypt_field(user["last_name"]),
        }
    }

@app.get("/api/me")
def get_me(current=Depends(get_current_user), db=Depends(get_db)):
    user_id = int(current["sub"])
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    cur.execute("SELECT * FROM users WHERE id = %s", (user_id,))
    user = cur.fetchone()
    if not user:
        raise HTTPException(404, "User not found")
    cur.execute("SELECT * FROM profiles WHERE user_id = %s", (user_id,))
    profile = cur.fetchone()
    roles = _get_roles(user_id, db)
    return {
        "id": user["id"],
        "email": user["email"],
        "first_name": decrypt_field(user["first_name"]),
        "last_name": decrypt_field(user["last_name"]),
        "dob": decrypt_field(user["dob"]),
        "phone": decrypt_field(user["phone"]),
        "profile": dict(profile) if profile else None,
        "roles": roles,
    }

@app.get("/api/roles")
def get_roles(current=Depends(get_current_user), db=Depends(get_db)):
    user_id = int(current["sub"])
    return {"roles": _get_roles(user_id, db)}

# ─── Mentor-Mentee APIs (no payments) ───────────────────────────────────────────
@app.post("/api/mentor/apply")
def apply_mentor(req: MentorApplyRequest, current=Depends(get_current_user), db=Depends(get_db)):
    user_id = int(current["sub"])
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)

    cur.execute("INSERT INTO user_roles (user_id, role) VALUES (%s, 'mentee') ON CONFLICT (user_id, role) DO NOTHING", (user_id,))
    cur.execute("INSERT INTO user_roles (user_id, role) VALUES (%s, 'mentor') ON CONFLICT (user_id, role) DO NOTHING", (user_id,))

    cur.execute("""
        INSERT INTO mentor_profiles (user_id, headline, bio, expertise, languages, experience_years, verification_status, published, is_accepting, updated_at)
        VALUES (%s, %s, %s, %s::jsonb, %s::jsonb, %s, 'pending', FALSE, %s, NOW())
        ON CONFLICT (user_id) DO UPDATE
        SET headline = EXCLUDED.headline,
            bio = EXCLUDED.bio,
            expertise = EXCLUDED.expertise,
            languages = EXCLUDED.languages,
            experience_years = EXCLUDED.experience_years,
            is_accepting = EXCLUDED.is_accepting,
            verification_status = 'pending',
            published = FALSE,
            updated_at = NOW()
    """, (
        user_id,
        req.headline.strip(),
        req.bio.strip(),
        json.dumps(req.expertise or []),
        json.dumps(req.languages or []),
        max(0, req.experience_years),
        req.is_accepting,
    ))

    db.commit()
    return {"message": "Mentor application submitted", "status": "pending"}

@app.get("/api/mentors")
def list_mentors(q: Optional[str] = "", expertise: Optional[str] = "", db=Depends(get_db)):
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    params = []
    sql = """
        SELECT mp.*, u.first_name, u.last_name
        FROM mentor_profiles mp
        JOIN users u ON u.id = mp.user_id
        WHERE mp.published = TRUE
          AND mp.verification_status = 'approved'
          AND mp.is_accepting = TRUE
    """
    if q:
        sql += " AND (LOWER(mp.headline) LIKE %s OR LOWER(mp.bio) LIKE %s)"
        like = f"%{q.lower()}%"
        params.extend([like, like])
    if expertise:
        sql += " AND mp.expertise::text ILIKE %s"
        params.append(f"%{expertise}%")
    sql += " ORDER BY mp.updated_at DESC LIMIT 100"

    cur.execute(sql, tuple(params))
    rows = cur.fetchall()
    data = []
    for r in rows:
        data.append({
            "user_id": r["user_id"],
            "name": f"{decrypt_field(r['first_name'])} {decrypt_field(r['last_name'])}",
            "headline": r["headline"],
            "bio": r["bio"],
            "expertise": r["expertise"] or [],
            "languages": r["languages"] or [],
            "experience_years": r["experience_years"],
            "verification_status": r["verification_status"],
            "is_accepting": r["is_accepting"],
        })
    return {"mentors": data}

@app.get("/api/mentor/profile")
def my_mentor_profile(current=Depends(get_current_user), db=Depends(get_db)):
    user_id = int(current["sub"])
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    cur.execute("SELECT * FROM mentor_profiles WHERE user_id = %s", (user_id,))
    p = cur.fetchone()
    if not p:
        return {"profile": None}
    return {"profile": {
        "headline": p["headline"],
        "bio": p["bio"],
        "expertise": p["expertise"] or [],
        "languages": p["languages"] or [],
        "experience_years": p["experience_years"],
        "verification_status": p["verification_status"],
        "published": p["published"],
        "is_accepting": p["is_accepting"],
    }}

@app.post("/api/mentorship-requests")
def create_mentorship_request(req: MentorshipRequestCreate, current=Depends(get_current_user), db=Depends(get_db)):
    mentee_id = int(current["sub"])
    if req.mentor_user_id == mentee_id:
        raise HTTPException(400, "You cannot request mentorship from yourself")

    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    cur.execute("""
        SELECT user_id FROM mentor_profiles
        WHERE user_id = %s AND published = TRUE AND verification_status = 'approved' AND is_accepting = TRUE
    """, (req.mentor_user_id,))
    if not cur.fetchone():
        raise HTTPException(404, "Mentor not available")

    scheduled = None
    if req.scheduled_at:
        try:
            scheduled = datetime.fromisoformat(req.scheduled_at.replace("Z", "+00:00"))
        except Exception:
            raise HTTPException(400, "scheduled_at must be ISO datetime")

    cur.execute("""
        INSERT INTO mentorship_requests (mentee_user_id, mentor_user_id, topic, message, preferred_mode, scheduled_at, status, updated_at)
        VALUES (%s, %s, %s, %s, %s, %s, 'pending', NOW())
        RETURNING id
    """, (mentee_id, req.mentor_user_id, req.topic.strip(), req.message.strip(), req.preferred_mode, scheduled))
    req_id = cur.fetchone()["id"]
    db.commit()
    return {"request_id": req_id, "status": "pending", "message": "Mentorship request submitted"}

@app.get("/api/mentorship-requests/mine")
def my_mentorship_requests(current=Depends(get_current_user), db=Depends(get_db)):
    mentee_id = int(current["sub"])
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    cur.execute("""
        SELECT mr.*, u.first_name, u.last_name, mp.headline
        FROM mentorship_requests mr
        JOIN users u ON u.id = mr.mentor_user_id
        LEFT JOIN mentor_profiles mp ON mp.user_id = mr.mentor_user_id
        WHERE mr.mentee_user_id = %s
        ORDER BY mr.created_at DESC
    """, (mentee_id,))
    rows = cur.fetchall()
    items = []
    for r in rows:
        items.append({
            "id": r["id"],
            "mentor_user_id": r["mentor_user_id"],
            "mentor_name": f"{decrypt_field(r['first_name'])} {decrypt_field(r['last_name'])}",
            "mentor_headline": r["headline"],
            "topic": r["topic"],
            "message": r["message"],
            "preferred_mode": r["preferred_mode"],
            "scheduled_at": str(r["scheduled_at"]) if r["scheduled_at"] else None,
            "status": r["status"],
            "created_at": str(r["created_at"]),
            "updated_at": str(r["updated_at"]),
        })
    return {"requests": items}

@app.get("/api/mentor/requests")
def mentor_requests(current=Depends(get_current_user), db=Depends(get_db)):
    mentor_id = int(current["sub"])
    _require_role(mentor_id, "mentor", db)

    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    cur.execute("""
        SELECT mr.*, u.first_name, u.last_name, u.email
        FROM mentorship_requests mr
        JOIN users u ON u.id = mr.mentee_user_id
        WHERE mr.mentor_user_id = %s
        ORDER BY mr.created_at DESC
    """, (mentor_id,))
    rows = cur.fetchall()
    items = []
    for r in rows:
        items.append({
            "id": r["id"],
            "mentee_user_id": r["mentee_user_id"],
            "mentee_name": f"{decrypt_field(r['first_name'])} {decrypt_field(r['last_name'])}",
            "mentee_email": r["email"],
            "topic": r["topic"],
            "message": r["message"],
            "preferred_mode": r["preferred_mode"],
            "scheduled_at": str(r["scheduled_at"]) if r["scheduled_at"] else None,
            "status": r["status"],
            "created_at": str(r["created_at"]),
            "updated_at": str(r["updated_at"]),
        })
    return {"requests": items}

@app.post("/api/mentor/requests/{request_id}/status")
def update_mentor_request_status(request_id: int, req: MentorshipRequestStatusUpdate, current=Depends(get_current_user), db=Depends(get_db)):
    mentor_id = int(current["sub"])
    _require_role(mentor_id, "mentor", db)

    valid = {"accepted", "rejected", "completed", "cancelled"}
    if req.status not in valid:
        raise HTTPException(400, f"status must be one of: {', '.join(sorted(valid))}")

    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    cur.execute("SELECT id, status FROM mentorship_requests WHERE id = %s AND mentor_user_id = %s", (request_id, mentor_id))
    row = cur.fetchone()
    if not row:
        raise HTTPException(404, "Request not found")

    cur.execute("UPDATE mentorship_requests SET status = %s, updated_at = NOW() WHERE id = %s", (req.status, request_id))
    db.commit()
    return {"message": "Request updated", "request_id": request_id, "status": req.status}

# ─── Admin APIs ──────────────────────────────────────────────────────────────────
@app.get("/api/admin/mentors")
def admin_list_mentors(status: Optional[str] = "pending", q: Optional[str] = "", current=Depends(get_current_user), db=Depends(get_db)):
    admin_id = int(current["sub"])
    _require_role(admin_id, "admin", db)

    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    params = []
    sql = """
        SELECT mp.*, u.email, u.first_name, u.last_name
        FROM mentor_profiles mp
        JOIN users u ON u.id = mp.user_id
        WHERE 1=1
    """
    if status and status != "all":
        sql += " AND mp.verification_status = %s"
        params.append(status)
    if q:
        sql += " AND (LOWER(u.email) LIKE %s OR LOWER(mp.headline) LIKE %s OR LOWER(mp.bio) LIKE %s)"
        like = f"%{q.lower()}%"
        params.extend([like, like, like])
    sql += " ORDER BY mp.updated_at DESC"

    cur.execute(sql, tuple(params))
    rows = cur.fetchall()
    items = []
    for r in rows:
        items.append({
            "user_id": r["user_id"],
            "name": f"{decrypt_field(r['first_name'])} {decrypt_field(r['last_name'])}",
            "email": r["email"],
            "headline": r["headline"],
            "bio": r["bio"],
            "expertise": r["expertise"] or [],
            "languages": r["languages"] or [],
            "experience_years": r["experience_years"],
            "verification_status": r["verification_status"],
            "published": r["published"],
            "is_accepting": r["is_accepting"],
            "created_at": str(r["created_at"]),
            "updated_at": str(r["updated_at"]),
        })
    return {"mentors": items}

@app.post("/api/admin/mentors/{mentor_user_id}/review")
def admin_review_mentor(mentor_user_id: int, req: AdminMentorReviewRequest, current=Depends(get_current_user), db=Depends(get_db)):
    admin_id = int(current["sub"])
    _require_role(admin_id, "admin", db)

    allowed = {"pending", "approved", "rejected"}
    if req.status not in allowed:
        raise HTTPException(400, f"status must be one of: {', '.join(sorted(allowed))}")

    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    cur.execute("SELECT user_id, verification_status, published FROM mentor_profiles WHERE user_id = %s", (mentor_user_id,))
    row = cur.fetchone()
    if not row:
        raise HTTPException(404, "Mentor profile not found")

    published = req.published if req.published is not None else (True if req.status == "approved" else False)
    cur.execute("""
        UPDATE mentor_profiles
        SET verification_status = %s, published = %s, updated_at = NOW()
        WHERE user_id = %s
    """, (req.status, published, mentor_user_id))

    cur.execute("""
        INSERT INTO admin_audit_logs (admin_user_id, action, target_type, target_id, note)
        VALUES (%s, %s, 'mentor_profile', %s, %s)
    """, (admin_id, f"mentor_review:{req.status}", str(mentor_user_id), req.note or ""))

    db.commit()
    return {"message": "Mentor review updated", "mentor_user_id": mentor_user_id, "status": req.status, "published": published}

@app.get("/api/admin/mentorship-requests")
def admin_list_mentorship_requests(status: Optional[str] = "", current=Depends(get_current_user), db=Depends(get_db)):
    admin_id = int(current["sub"])
    _require_role(admin_id, "admin", db)

    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    params = []
    sql = """
        SELECT mr.*, 
               mu.first_name AS mentee_first_name, mu.last_name AS mentee_last_name, mu.email AS mentee_email,
               ru.first_name AS mentor_first_name, ru.last_name AS mentor_last_name, ru.email AS mentor_email
        FROM mentorship_requests mr
        JOIN users mu ON mu.id = mr.mentee_user_id
        JOIN users ru ON ru.id = mr.mentor_user_id
        WHERE 1=1
    """
    if status:
        sql += " AND mr.status = %s"
        params.append(status)
    sql += " ORDER BY mr.created_at DESC"

    cur.execute(sql, tuple(params))
    rows = cur.fetchall()
    items = []
    for r in rows:
        items.append({
            "id": r["id"],
            "topic": r["topic"],
            "message": r["message"],
            "preferred_mode": r["preferred_mode"],
            "status": r["status"],
            "scheduled_at": str(r["scheduled_at"]) if r["scheduled_at"] else None,
            "created_at": str(r["created_at"]),
            "updated_at": str(r["updated_at"]),
            "mentee": {
                "user_id": r["mentee_user_id"],
                "name": f"{decrypt_field(r['mentee_first_name'])} {decrypt_field(r['mentee_last_name'])}",
                "email": r["mentee_email"],
            },
            "mentor": {
                "user_id": r["mentor_user_id"],
                "name": f"{decrypt_field(r['mentor_first_name'])} {decrypt_field(r['mentor_last_name'])}",
                "email": r["mentor_email"],
            },
        })
    return {"requests": items}

@app.post("/api/admin/mentorship-requests/{request_id}/status")
def admin_update_mentorship_status(request_id: int, req: AdminMentorshipStatusRequest, current=Depends(get_current_user), db=Depends(get_db)):
    admin_id = int(current["sub"])
    _require_role(admin_id, "admin", db)

    allowed = {"pending", "accepted", "rejected", "completed", "cancelled"}
    if req.status not in allowed:
        raise HTTPException(400, f"status must be one of: {', '.join(sorted(allowed))}")

    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    cur.execute("SELECT id FROM mentorship_requests WHERE id = %s", (request_id,))
    if not cur.fetchone():
        raise HTTPException(404, "Mentorship request not found")

    cur.execute("UPDATE mentorship_requests SET status = %s, updated_at = NOW() WHERE id = %s", (req.status, request_id))
    cur.execute("""
        INSERT INTO admin_audit_logs (admin_user_id, action, target_type, target_id, note)
        VALUES (%s, %s, 'mentorship_request', %s, %s)
    """, (admin_id, f"mentorship_status:{req.status}", str(request_id), ""))
    db.commit()

    return {"message": "Mentorship request status updated", "request_id": request_id, "status": req.status}

@app.post("/api/change-password")
def change_password(req: ChangePasswordRequest, current=Depends(get_current_user), db=Depends(get_db)):
    if len(req.new_password) < 8:
        raise HTTPException(400, "New password must be at least 8 characters")
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    cur.execute("SELECT password_hash FROM users WHERE id = %s", (int(current["sub"]),))
    user = cur.fetchone()
    if not user or not verify_password(req.current_password, user["password_hash"]):
        raise HTTPException(401, "Current password is incorrect")
    cur.execute("UPDATE users SET password_hash = %s WHERE id = %s",
                (hash_password(req.new_password), int(current["sub"])))
    db.commit()
    return {"message": "Password changed successfully"}

@app.post("/api/profile")
def save_profile(req: ProfileRequest, current=Depends(get_current_user), db=Depends(get_db)):
    user_id = int(current["sub"])
    cur = db.cursor()
    cur.execute("""
        INSERT INTO profiles (user_id, highest_qualification, goal, skills, updated_at)
        VALUES (%s, %s, %s, %s, NOW())
        ON CONFLICT (user_id) DO UPDATE
        SET highest_qualification = EXCLUDED.highest_qualification,
            goal = EXCLUDED.goal,
            skills = EXCLUDED.skills,
            updated_at = NOW()
    """, (user_id, req.highest_qualification, req.goal, req.skills))
    db.commit()
    return {"message": "Profile saved successfully"}

@app.get("/api/profile")
def get_profile(current=Depends(get_current_user), db=Depends(get_db)):
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    cur.execute("SELECT * FROM profiles WHERE user_id = %s", (int(current["sub"]),))
    profile = cur.fetchone()
    return {"profile": dict(profile) if profile else None}

# ─── Indian Education Reference (injected into every AI prompt) ─────────────────

EDUCATION_REFERENCE = """
=== INDIAN EDUCATION SYSTEM — AUTHORITATIVE REFERENCE ===
=== THIS IS THE ONLY SOURCE OF TRUTH. DO NOT ADD ANYTHING NOT IN THIS DOCUMENT. ===

CRITICAL RULES:
1. A student CANNOT pursue a degree they ALREADY hold. B.Tech holder cannot do B.Tech again. MBBS holder cannot do MBBS again.
2. ONLY mention exams, colleges, and paths listed in this document. NEVER invent or guess.
3. Respect prerequisite chains strictly.
4. EACH EXAM LEADS TO SPECIFIC COLLEGES ONLY. Do NOT mix them up.

=================================================================
SECTION 1: EXAM → COLLEGE MAPPING (MOST IMPORTANT)
=================================================================

This is the EXACT mapping. An exam ONLY leads to the colleges listed next to it. No exceptions.

--- ENGINEERING (B.Tech / B.E.) ---

JEE ADVANCED:
  → ONLY leads to: 23 IITs (Indian Institutes of Technology)
  → IIT Bombay, IIT Delhi, IIT Madras, IIT Kanpur, IIT Kharagpur, IIT Roorkee, IIT Guwahati, IIT Hyderabad, IIT BHU Varanasi, IIT Indore, IIT Patna, IIT Gandhinagar, IIT Ropar, IIT Bhubaneswar, IIT Mandi, IIT Jodhpur, IIT Tirupati, IIT Palakkad, IIT Dhanbad (ISM), IIT Dharwad, IIT Jammu, IIT Goa, IIT Bhilai
  → Prerequisite: Must be in top 2,50,000 in JEE Main first
  → Counselling: JoSAA
  → DOES NOT lead to: NITs, IIITs, state colleges, private colleges

JEE MAIN:
  → Leads to: 31 NITs, 26 IIITs, 33+ GFTIs (Government Funded Technical Institutions)
  → NITs: NIT Trichy, NIT Warangal, NIT Surathkal, NIT Calicut, NIT Allahabad, NIT Jaipur, NIT Rourkela, NIT Kurukshetra, NIT Durgapur, NIT Nagpur, NIT Silchar, NIT Hamirpur, NIT Srinagar, NIT Agartala, NIT Patna, NIT Raipur, MNIT Jaipur, MNNIT Allahabad, VNIT Nagpur, SVNIT Surat, NIT Goa, NIT Delhi, NIT Sikkim, NIT Meghalaya, NIT Mizoram, NIT Arunachal Pradesh, NIT Manipur, NIT Nagaland, NIT Uttarakhand, NIT Andhra Pradesh, NIT Puducherry
  → IIITs: IIIT Hyderabad (separate exam too), IIIT Allahabad, IIIT Delhi, IIIT Bangalore, IIIT Gwalior, IIIT Jabalpur, IIIT Kota, IIIT Sri City, IIIT Lucknow, IIIT Dharwad, IIIT Kancheepuram, etc.
  → GFTIs: IIEST Shibpur, BIT Mesra, NIFFT Ranchi, SPA Delhi/Bhopal, etc.
  → Counselling: JoSAA (for NITs, IIITs, GFTIs) and CSAB (for leftover seats)
  → JEE Main is ALSO the qualifier for JEE Advanced (top 2,50,000)
  → DOES NOT lead to: IITs (that requires JEE Advanced), state engineering colleges, private colleges

BITSAT:
  → ONLY leads to: BITS Pilani, BITS Goa, BITS Hyderabad
  → Separate online exam conducted by BITS
  → DOES NOT lead to: IITs, NITs, any other college

STATE ENTRANCE EXAMS (these lead to STATE colleges ONLY, NOT to IITs/NITs/IIITs):
  AP EAPCET (Andhra Pradesh) → state engineering colleges in AP (JNTU Kakinada, JNTU Anantapur affiliated colleges)
  TS EAMCET (Telangana) → state engineering colleges in Telangana (JNTU Hyderabad, Osmania University affiliated colleges)
  MHT-CET (Maharashtra) → state engineering colleges in Maharashtra (COEP Pune, VJTI Mumbai, ICT Mumbai, state private colleges)
  KCET (Karnataka) → state engineering colleges in Karnataka (UVCE Bangalore, BMS CE, RVCE, MSRIT, SJCE Mysore via state quota)
  WBJEE (West Bengal) → state engineering colleges in WB (Jadavpur University, IIEST Shibpur state quota, Bengal Engineering colleges)
  COMEDK (Karnataka private) → private engineering colleges in Karnataka (RV, BMS, MSRIT, PES — management quota seats)
  KEAM (Kerala) → state engineering colleges in Kerala (CET Trivandrum, GEC Thrissur, TKM Kollam)
  TNEA (Tamil Nadu) → Anna University affiliated colleges (CEG, MIT, ACT, state private colleges) — based on Class 12 marks, no separate exam
  UPSEE/AKTU (Uttar Pradesh) → state engineering colleges in UP
  BCECE (Bihar) → state engineering colleges in Bihar
  GUJCET (Gujarat) → state engineering colleges in Gujarat (LD CE Ahmedabad, SVNIT Surat state quota)

  CRITICAL: EAMCET/EAPCET/MHT-CET/KCET/WBJEE/COMEDK/KEAM CANNOT get you into IIT or NIT. These are STATE exams for STATE colleges only.

--- MEDICAL (MBBS / BDS) ---

NEET-UG:
  → ONLY exam for ALL medical seats in India (government + private)
  → Government colleges: AIIMS Delhi, JIPMER Puducherry, AIIMS Jodhpur/Bhopal/Rishikesh/Patna/Raipur/Nagpur etc., CMC Vellore (separate internal process but NEET score required), Maulana Azad MC Delhi, Grant MC Mumbai, BHU IMS, King George's MU Lucknow, AFMC Pune (additional screening), all state government medical colleges
  → Private colleges: Manipal, Kasturba, SRM Medical, Amrita, KIMS, all deemed universities
  → Also for: BDS (dental), BAMS (Ayurveda), BHMS (Homeopathy), BUMS (Unani), BVSc (Veterinary), B.Sc Nursing (some states)
  → Counselling: MCC (All India Quota — 15%), State counselling (85% state quota)
  → Prerequisite: Class 12 with PCB (Physics, Chemistry, Biology), minimum 50% aggregate (40% for SC/ST/OBC)
  → NEET is the ONLY medical entrance. There is NO other exam for MBBS in India.

--- LAW ---

CLAT:
  → Leads to: 22+ NLUs (National Law Universities)
  → NLSIU Bangalore, NLU Delhi, NALSAR Hyderabad, WBNUJS Kolkata, NLU Jodhpur, GNLU Gandhinagar, RMLNLU Lucknow, CNLU Patna, NUALS Kochi, HNLU Raipur, NLU Odisha, DSNLU Visakhapatnam, TNNLU Tiruchirappalli, NLU Meghalaya, NLU Tripura, NLU Assam
  → For both 5-year integrated (after Class 12) and LLM (after LLB)
  → DOES NOT lead to: DU Law Faculty (separate exam), non-NLU law colleges

AILET:
  → ONLY for NLU Delhi
  → Separate exam from CLAT

LSAT India:
  → Accepted by: Jindal Global Law School, some private law colleges
  → NOT for NLUs (NLUs use CLAT)

DU LLB Entrance:
  → For Delhi University Faculty of Law ONLY (3-year LLB programme)

--- MANAGEMENT (MBA) ---

CAT:
  → Leads to: 20 IIMs + 1200+ other institutes that accept CAT score
  → IIM Ahmedabad, IIM Bangalore, IIM Calcutta, IIM Lucknow, IIM Kozhikode, IIM Indore, IIM Shillong, IIM Ranchi, IIM Raipur, IIM Rohtak, IIM Kashipur, IIM Trichy, IIM Udaipur, IIM Nagpur, IIM Bodh Gaya, IIM Visakhapatnam, IIM Amritsar, IIM Sambalpur, IIM Sirmaur, IIM Jammu
  → Also accepted by: FMS Delhi, MDI Gurgaon, SPJIMR Mumbai, IIT Bombay (SJMSOM), IIT Delhi (DMS), NITIE Mumbai, JBIMS Mumbai, IIFT (separate exam too)
  → Prerequisite: Any bachelor's degree with minimum 50% (varies by IIM)

XAT:
  → Primarily for XLRI Jamshedpur
  → Also accepted by: XIMB, TAPMI, Great Lakes, GIM Goa, IMT Ghaziabad (some programmes)

SNAP:
  → For Symbiosis institutes: SIBM Pune, SCMHRD, SIOM, SIMS

MAT:
  → For mid-tier B-schools across India

NMAT:
  → Primarily for NMIMS Mumbai (Narsee Monjee)

IIFT:
  → For Indian Institute of Foreign Trade Delhi/Kolkata/Kakinada ONLY

IPMAT:
  → For IIM Indore and IIM Rohtak ONLY (5-year integrated programme after Class 12)
  → NOT for regular MBA at IIMs

--- POSTGRADUATE ENGINEERING ---

GATE:
  → Leads to: M.Tech/M.E./MS at IITs, IISc Bangalore, NITs, IIITs
  → Also: PSU recruitment (NTPC, ONGC, IOCL, BHEL, SAIL, GAIL, BARC, ISRO, DRDO, HAL, BEL, BPCL, HPCL, Power Grid, THDC, NHPC)
  → Also: PhD admissions at IITs/IISc
  → Prerequisite: B.Tech/B.E. or equivalent
  → DOES NOT lead to: MBA programmes, medical PG, law PG

--- POSTGRADUATE MEDICAL ---

NEET-PG:
  → For MD/MS/DNB seats at ALL medical colleges
  → Prerequisite: MBBS degree (completed internship)
  → This is the ONLY exam for medical PG in India

--- POSTGRADUATE SCIENCE ---

IIT JAM:
  → For M.Sc at IITs and IISc Bangalore
  → Subjects: Physics, Chemistry, Mathematics, Biotechnology, Geology, Mathematical Statistics, Economics
  → DOES NOT lead to: M.Tech (that's GATE), medical, law

CSIR NET / UGC NET:
  → For PhD (JRF — Junior Research Fellowship) and Lectureship eligibility
  → CSIR NET: For science subjects (Life Sciences, Chemical Sciences, Physical Sciences, Mathematical Sciences, Earth Sciences)
  → UGC NET: For humanities, social sciences, commerce, education, etc.

--- COMPETITIVE / GOVERNMENT ---

UPSC CSE (Civil Services Examination):
  → For IAS, IPS, IFS, IRS and 20+ other civil services
  → Three stages: Prelims → Mains → Interview
  → Eligibility: Any bachelor's degree, age 21-32 (General), max 6 attempts (General)
  → Training: LBSNAA Mussoorie (IAS), SVPNPA Hyderabad (IPS), IFSRC (IFS)

NDA (National Defence Academy):
  → For Army, Navy, Air Force officer training
  → Conducted by UPSC, after Class 12
  → Age: 16.5 to 19.5 years
  → Training at NDA Khadakwasla (Pune), then IMA Dehradun / Naval Academy / Air Force Academy

CDS (Combined Defence Services):
  → For OTA Chennai, IMA Dehradun, Naval Academy, Air Force Academy
  → Requires bachelor's degree (for IMA/Naval/AFA) or any degree (for OTA)

SSC CGL:
  → For Group B & C central government posts
  → Requires bachelor's degree

IBPS PO / IBPS Clerk:
  → For public sector bank jobs
  → PO: bachelor's degree, Clerk: Class 12 pass

RBI Grade B:
  → For Reserve Bank of India officer posts
  → Requires bachelor's degree with 60% (varies)

--- PROFESSIONAL COURSES ---

CA (Chartered Accountancy):
  → Foundation: After Class 12 (or direct entry after graduation)
  → Intermediate → Final → 3-year articleship
  → Conducted by ICAI
  → NOT linked to any college — it's a professional certification

CS (Company Secretary):
  → Foundation → Executive → Professional
  → Conducted by ICSI

CMA (Cost and Management Accountant):
  → Foundation → Intermediate → Final
  → Conducted by ICMAI

--- DESIGN ---

UCEED:
  → For B.Des at IIT Bombay, IIT Delhi, IIT Guwahati, IIT Hyderabad, IIITDM Jabalpur
NID DAT:
  → For B.Des at NID Ahmedabad, NID Gandhinagar, NID Haryana, NID Madhya Pradesh, NID Assam
NIFT:
  → For fashion design at NIFT Delhi, NIFT Mumbai, NIFT Bangalore, NIFT Hyderabad, etc.
CEED:
  → For M.Des at IITs and NID (postgraduate level)

--- ARCHITECTURE ---

NATA:
  → For B.Arch at most architecture colleges in India (SPA Delhi, SPA Bhopal, CEPT Ahmedabad, JJ School Mumbai)
JEE Main Paper 2A:
  → For B.Arch at NITs, IITs (some), and other centrally funded institutes
  → Counselling via JoSAA

=================================================================
SECTION 2: QUALIFICATION → VALID NEXT STEPS
=================================================================

CLASS 10 (SSC/CBSE):
  VALID: Class 11-12 (choose stream: PCM, PCB, PCMB, Commerce, Arts)
  VALID: Diploma/Polytechnic (3 years → lateral entry B.Tech 2nd year)
  VALID: ITI (1-2 year vocational)
  INVALID: Any bachelor's degree directly, MBA, UPSC, GATE, CAT
  Exams at this level: NTSE, Olympiads, Navodaya/Sainik School entrance

CLASS 12 SCIENCE (PCM):
  VALID: B.Tech via JEE Main (NITs), JEE Advanced (IITs), BITSAT (BITS), state CETs (state colleges)
  VALID: B.Arch via NATA, JEE Main Paper 2A
  VALID: B.Sc via CUET or university entrance
  VALID: BCA, B.Des (via UCEED/NID DAT), NDA
  VALID: Integrated programmes at IISc, IISERs
  INVALID: MBBS/BDS (needs Biology in Class 12), MBA, GATE, CAT, UPSC

CLASS 12 SCIENCE (PCB):
  VALID: MBBS/BDS via NEET-UG only
  VALID: BAMS/BHMS/BUMS/BVSc via NEET-UG
  VALID: B.Pharma, B.Sc Nursing, Allied Health (BPT, BOT)
  VALID: B.Sc (Biology/Biotech/Microbiology)
  INVALID: B.Tech (needs Maths — except Biotech at some colleges), JEE Main, JEE Advanced

CLASS 12 SCIENCE (PCMB):
  VALID: Everything from PCM AND PCB — can attempt both JEE and NEET

CLASS 12 COMMERCE:
  VALID: B.Com via CUET/university entrance, BBA/BMS via CUET/IPMAT/SET/NPAT
  VALID: CA/CS/CMA Foundation
  VALID: BA LLB (5-year) via CLAT, AILET
  VALID: Economics Honours at DU/JNU/ISI
  INVALID: B.Tech (no PCM), MBBS (no PCB), JEE, NEET

CLASS 12 ARTS/HUMANITIES:
  VALID: BA via CUET/university entrance
  VALID: BA LLB (5-year) via CLAT, AILET
  VALID: BFA, Mass Communication, Hotel Management (NCHM JEE), NDA
  INVALID: B.Tech (no PCM), MBBS (no PCB), B.Com (no Commerce background)

DIPLOMA (POLYTECHNIC):
  VALID: B.Tech lateral entry (direct 2nd year) via ECET/state lateral entry exams
  VALID: Junior Engineer jobs via SSC JE
  INVALID: M.Tech (needs full B.Tech), MBA (needs bachelor's), GATE (needs bachelor's)

B.TECH / B.E. (BACHELOR'S):
  VALID: M.Tech/M.E. via GATE
  VALID: MBA via CAT/XAT/SNAP/MAT/CMAT/NMAT
  VALID: MS/PhD abroad via GRE + TOEFL/IELTS
  VALID: UPSC CSE (any bachelor's qualifies)
  VALID: PSU jobs via GATE score
  VALID: State PSC exams, SSC CGL, IBPS
  VALID: Direct industry career
  INVALID: B.Tech again, MBBS (would need NEET + new 5.5-year degree), NEET PG (needs MBBS)

B.SC (BACHELOR'S):
  VALID: M.Sc via IIT JAM / CUET PG / university entrance
  VALID: MBA via CAT/XAT etc.
  VALID: B.Ed for teaching
  VALID: UPSC CSE, GATE (some papers), PhD via CSIR NET/UGC NET
  INVALID: B.Sc again, NEET PG

B.COM (BACHELOR'S):
  VALID: M.Com via CUET PG, MBA via CAT, CA/CS/CMA, UPSC CSE
  INVALID: B.Com again, NEET PG, GATE (most papers)

B.A. (BACHELOR'S):
  VALID: M.A. via CUET PG/JNU/DU/BHU entrance, MBA via CAT, LLB (3-year), B.Ed, UPSC CSE, PhD via UGC NET
  INVALID: B.A. again, NEET PG, GATE

MBBS:
  VALID: MD/MS via NEET PG, DNB, MBA in Healthcare, USMLE (for USA), UPSC CSE
  INVALID: MBBS again, B.Tech, JEE, GATE

LLB:
  VALID: LLM via CLAT PG, Judicial Services exam, UPSC CSE, corporate law practice
  INVALID: LLB again, NEET PG

M.TECH / M.E.:
  VALID: PhD at IITs/IISc/NITs, Industry R&D, Faculty (after PhD), PSU if not already, UPSC
  INVALID: B.Tech again, M.Tech again in same field

M.SC:
  VALID: PhD via CSIR NET/UGC NET/GATE/institute entrance, Faculty (after PhD+NET)
  INVALID: M.Sc again in same field

MBA:
  VALID: PhD/FPM at IIMs, Executive leadership, Entrepreneurship
  INVALID: MBA again

PhD / DOCTORATE:
  VALID: Post-doctoral research, Faculty positions, Industry research leadership, Policy/think-tank
  This is the TERMINAL academic degree.

=================================================================
SECTION 3: GOAL-SPECIFIC EXACT PATHWAYS
=================================================================

GOAL: "Get into IIT / NIT (B.Tech)"
  Required qualification: Class 12 with PCM (or PCMB)
  FOR IIT: Must clear JEE Main (top 2,50,000) → then JEE Advanced → JoSAA counselling
  FOR NIT: Must clear JEE Main → JoSAA counselling (JEE Main score/rank used directly)
  FOR IIIT: Must clear JEE Main → JoSAA counselling
  IRRELEVANT EXAMS: EAMCET, MHT-CET, KCET, WBJEE, COMEDK, BITSAT — these CANNOT get you into IIT or NIT
  BITS Pilani: Separate exam BITSAT — NOT IIT/NIT but a top alternative
  Preparation: Focus 100% on JEE Main + JEE Advanced syllabus (Physics, Chemistry, Maths — Class 11+12 level)
  Coaching: Allen, FIITJEE, Resonance, Narayana, Sri Chaitanya, Physics Wallah, Unacademy

GOAL: "Become a Doctor (MBBS)"
  Required qualification: Class 12 with PCB, minimum 50% aggregate (40% for reserved)
  ONLY EXAM: NEET-UG — no other exam exists for MBBS in India
  Counselling: MCC (15% All India Quota) + State counselling (85% state quota)
  IRRELEVANT EXAMS: JEE, EAMCET, CAT, GATE — NONE of these lead to MBBS
  Top colleges by NEET rank: AIIMS Delhi (rank 1-50), JIPMER (rank 50-200), Maulana Azad MC (rank 200-500), top state GMCs (rank 500-10000)
  Coaching: Allen, Aakash, NEET-focused batches at Narayana/Sri Chaitanya

GOAL: "Pursue MBA from IIM"
  Required qualification: Any bachelor's degree (any stream)
  PRIMARY EXAM: CAT — conducted by IIMs, held in November
  Selection: CAT score + academic profile + work experience + WAT/GD/PI
  IIM Ahmedabad: Usually 99+ percentile + strong profile
  IIM Bangalore: 99+ percentile + strong academics
  IIM Calcutta: 99+ percentile
  IIM Lucknow/Kozhikode/Indore: 95-99 percentile
  New IIMs: 90-95 percentile
  ALSO APPLY: XAT (for XLRI), SNAP (for Symbiosis), NMAT (for NMIMS), IIFT (for IIFT), GMAT (for ISB, international)
  IRRELEVANT: JEE, NEET, GATE, CLAT

GOAL: "Crack UPSC / IAS / IPS"
  Required qualification: Any bachelor's degree (any stream, any university)
  ONLY EXAM: UPSC CSE — three stages: Prelims (June) → Mains (Sept) → Interview (Feb-May)
  Age: 21-32 for General (relaxation for OBC/SC/ST)
  Attempts: 6 for General, 9 for OBC, unlimited for SC/ST (within age limit)
  Preparation: 12-18 months minimum. NCERT foundation → optional subject → answer writing → current affairs
  Coaching: Vajiram & Ravi, Forum IAS, Vision IAS, Insights IAS, Drishti IAS
  Training: LBSNAA Mussoorie (IAS), SVPNPA Hyderabad (IPS)
  IRRELEVANT: JEE, NEET, CAT, GATE

GOAL: "Become a Data Scientist / AI Engineer"
  Path 1 (After Class 12): B.Tech in CSE/IT/AI via JEE Main/Advanced → industry/research
  Path 2 (After B.Tech): M.Tech in AI/ML/Data Science via GATE → IIT/IISc/IIIT Hyderabad
  Path 3 (After B.Tech): MS abroad via GRE → CMU, Stanford, MIT, Georgia Tech
  Path 4 (After any degree): Self-study + certifications + portfolio (Google, AWS, Coursera)
  Key colleges for AI/ML in India: IIT Bombay, IIT Delhi, IIT Madras, IISc, IIIT Hyderabad
  IRRELEVANT: NEET, CLAT, NATA

GOAL: "Pursue MS/PhD Abroad"
  Required: Bachelor's degree (for MS), Master's (preferred for PhD)
  Exams: GRE (for US/Canada/Europe), TOEFL or IELTS (English proficiency)
  For PhD: Many US universities waive GRE. Strong research profile + publications matter.
  Application: SOP, LORs, transcripts, GRE/TOEFL scores, research experience
  Top destinations: USA (MIT, Stanford, CMU, Berkeley, Georgia Tech), UK (Oxford, Cambridge, Imperial), Germany (TU Munich, ETH Zurich — tuition free), Canada (UofT, UBC, Waterloo)
  IRRELEVANT: GATE (India only), CAT, NEET

GOAL: "Get into National Law University (CLAT)"
  Required: Class 12 pass (for 5-year BA LLB) or LLB (for LLM)
  PRIMARY EXAM: CLAT — for 22+ NLUs
  ALSO: AILET (NLU Delhi only), LSAT India (Jindal, some private)
  Sections: English, Current Affairs/GK, Legal Reasoning, Logical Reasoning, Quantitative Techniques
  Top NLUs by CLAT rank: NLSIU Bangalore (rank 1-80), NLU Delhi (via AILET), NALSAR Hyderabad (rank 80-200), WBNUJS Kolkata (rank 200-400)
  IRRELEVANT: JEE, NEET, CAT, GATE

GOAL: "Become a Software Engineer"
  Path 1 (After Class 12): B.Tech CSE via JEE Main (NITs) / JEE Advanced (IITs) / BITSAT (BITS) / State CETs (state colleges)
  Path 2 (After Class 12): BCA (3-year, direct admission) → MCA → industry
  Path 3 (After any degree): Self-taught + bootcamp + portfolio + open source
  Key skills: DSA, System Design, Programming (Java/Python/C++), Web Dev, Databases
  Top recruiters: Google, Microsoft, Amazon, Flipkart, PhonePe, Razorpay, TCS, Infosys, Wipro
  For IIT/NIT: JEE is the ONLY path. State CETs lead to state colleges only.

GOAL: "Government Job (Banking / SSC / Railways)"
  Required: Bachelor's degree (for most), Class 12 (for some clerk/group D)
  Banking: IBPS PO (for 11 public sector banks), IBPS Clerk, SBI PO (separate), RBI Grade B
  SSC: SSC CGL (for Group B & C posts), SSC CHSL (for LDC/DEO), SSC MTS
  Railways: RRB NTPC (for non-technical posts), RRB Group D, RRB JE (Junior Engineer — needs engineering diploma/degree)
  Insurance: LIC AAO, NIACL AO
  These are NOT entrance exams for colleges — they are recruitment exams for government jobs.

GOAL: "Defence Services (NDA / CDS)"
  NDA: After Class 12, age 16.5-19.5, conducted by UPSC twice a year. Training at NDA Khadakwasla then service academy.
  CDS: After graduation, conducted by UPSC twice a year. For IMA, Naval Academy, Air Force Academy, OTA.
  AFCAT: For Indian Air Force officer entry (after graduation)
  Territorial Army: For civilian men (age 18-42) for part-time military service

GOAL: "Chartered Accountant (CA)"
  Path: CA Foundation (after Class 12) → CA Intermediate → CA Final + 3-year Articleship
  Direct entry: Graduates can skip Foundation, enter at Intermediate level
  Conducted by: ICAI (Institute of Chartered Accountants of India)
  NOT linked to any college. Self-study or coaching (VSI, Swapnil Patni, CA Monks)
  Minimum 4-5 years from Foundation to CA Final

GOAL: "Pursue Architecture (B.Arch)"
  Exams: NATA (for most colleges), JEE Main Paper 2A (for NITs, IITs)
  Top colleges: SPA Delhi, SPA Bhopal, CEPT Ahmedabad, IIT Kharagpur, IIT Roorkee, JJ School Mumbai, Chandigarh College of Architecture
  Duration: 5-year programme
  Required: Class 12 with Maths, minimum 50%

GOAL: "Become a Teacher / Professor"
  School teacher: Bachelor's degree + B.Ed (2 years) + TET/CTET
  College lecturer: Master's degree + UGC NET/CSIR NET (for lectureship eligibility)
  University professor: PhD required + publications + teaching experience
  TET: Teacher Eligibility Test (state-level, CTET for central schools)
  UGC NET: Conducted by NTA, twice a year (June + December)

GOAL: "Start My Own Business / Startup"
  No specific exam needed.
  Recommended: MBA (for business knowledge), B.Tech (for tech startups), or domain expertise
  Programmes: IIM incubators, IIT incubators, Startup India initiative, Y Combinator (US)
  Skills: Product development, marketing, finance, team building, fundraising

=================================================================
SECTION 4: SCHOLARSHIPS (REAL, VERIFIED)
=================================================================

- Central Sector Scholarship: For top 20 percentile of Class 12 board exam. ₹20,000/year for UG, ₹36,000/year for PG.
- NMMS: National Means-cum-Merit for Class 8 students. ₹12,000/year for Class 9-12.
- Pragati (AICTE): For girls in technical education. ₹50,000/year.
- Saksham (AICTE): For differently-abled students in technical education. ₹50,000/year.
- INSPIRE (DST): For science students. SHE scholarship ₹80,000/year for BSc/BS/IntMSc.
- Maulana Azad National Fellowship: For minority PhD students.
- MCM at IITs: Merit-cum-Means scholarship — full fee waiver for family income < ₹1 lakh, 2/3 waiver for < ₹5 lakh.
- GATE scholarship: MHRD stipend of ₹12,400/month during M.Tech at IITs/NITs.
- Institute merit scholarships at NITs, BITS, IIITs.
- State scholarships: AP ePass, TS ePASS, Maharashtra (MahaDBT), Karnataka (SSP), Tamil Nadu (various).
- Private: Tata Trusts, Reliance Foundation, Wipro (WGSHA), Infosys Foundation, Azim Premji Foundation, HDFC Bank Parivartan.

=================================================================
SECTION 5: VALIDATION RULES
=================================================================

1. B.Tech holder wanting B.Tech → INVALID. Suggest M.Tech (GATE), MBA (CAT), MS abroad (GRE), UPSC, PSU jobs.
2. MBBS holder wanting MBBS → INVALID. Suggest NEET PG for MD/MS.
3. MBA holder wanting MBA → INVALID. Suggest PhD/FPM.
4. PhD holder → Terminal degree. Suggest post-doc, faculty, research.
5. Class 12 Commerce wanting B.Tech → INVALID. No PCM. Suggest BCA, BBA.
6. Class 12 Arts wanting MBBS → INVALID. No PCB. Suggest paramedical, public health.
7. Class 12 wanting IIT → ONLY via JEE Main + JEE Advanced. NOT via EAMCET/MHT-CET/KCET or any state exam.
8. Class 12 wanting NIT → ONLY via JEE Main. NOT via state exams.
9. Class 12 wanting BITS → ONLY via BITSAT. Not JEE, not state exams.
10. Any bachelor's can attempt UPSC CSE.
11. GATE is ONLY for B.Tech/B.E. graduates (or equivalent). NOT for MBBS, LLB, BA, BCom.
12. CAT is for ANY bachelor's degree holder. Not restricted to commerce/management.
13. NEET PG is ONLY for MBBS graduates. Not for B.Tech, B.Sc, BA.
"""

# ─── Qualification-Goal Validation ──────────────────────────────────────────────

DEGREE_LEVEL = {
    "class 10": 1,
    "class 12": 2,
    "diploma": 2,
    "bachelor": 3,
    "master": 4,
    "phd": 5,
    "doctorate": 5,
}

def _get_level(text: str) -> int:
    t = text.lower()
    for key, lvl in DEGREE_LEVEL.items():
        if key in t:
            return lvl
    return 0

def _extract_field(text: str) -> str:
    t = text.lower()
    if any(k in t for k in ["b.tech", "b.e", "engineer"]):
        return "engineering"
    if any(k in t for k in ["mbbs", "doctor", "medical"]):
        return "medical"
    if any(k in t for k in ["mba", "management", "iim"]):
        return "management"
    if any(k in t for k in ["llb", "law", "clat"]):
        return "law"
    if any(k in t for k in ["b.sc", "science"]):
        return "science"
    if any(k in t for k in ["b.com", "commerce"]):
        return "commerce"
    if any(k in t for k in ["b.a", "arts", "humanities"]):
        return "arts"
    if any(k in t for k in ["m.tech", "m.e"]):
        return "engineering_pg"
    if any(k in t for k in ["m.sc"]):
        return "science_pg"
    return ""

def validate_qualification_goal(qualification: str, goal: str) -> Optional[str]:
    """Returns an error/redirect message if the combination is illogical, else None."""
    q = qualification.lower()
    g = goal.lower()
    q_level = _get_level(q)
    q_field = _extract_field(q)
    g_field = _extract_field(g)

    # Same degree repeated
    if q_field and g_field and q_field == g_field and q_level >= 3:
        return None  # Let the AI handle with the reference doc — it has rules for this

    # Check if goal is at same or lower level than qualification
    # e.g. B.Tech holder wanting B.Tech (IIT/NIT)
    if q_level >= 3 and g_field == "engineering" and q_field == "engineering":
        return (
            f"You already hold a {qualification}. You cannot pursue B.Tech again. "
            f"Your logical next steps are: M.Tech (via GATE), MBA (via CAT), MS/PhD abroad (via GRE), "
            f"UPSC CSE, PSU jobs (via GATE score), or direct industry career."
        )
    if q_level >= 3 and g_field == "medical" and q_field == "medical":
        return (
            f"You already hold {qualification}. You cannot pursue MBBS again. "
            f"Your next steps are: NEET PG for MD/MS specialization, DNB, super-speciality (DM/MCh), "
            f"MBA in Healthcare, or clinical practice."
        )
    if q_level >= 4 and g_field == "management" and q_field == "management":
        return (
            f"You already hold an {qualification}. You cannot pursue MBA again. "
            f"Your next steps are: PhD/FPM (Fellow Programme in Management at IIMs), "
            f"executive leadership roles, or entrepreneurship."
        )

    # Class 12 Commerce/Arts wanting B.Tech
    if "commerce" in q and g_field == "engineering":
        return (
            f"B.Tech requires Physics, Chemistry, and Mathematics at Class 12 level. "
            f"As a Commerce student, you cannot directly pursue B.Tech. "
            f"Alternatives: BCA (computer applications), BBA, CA/CS/CMA, or take a gap year with PCM coaching."
        )
    if "arts" in q and g_field == "engineering":
        return (
            f"B.Tech requires Physics, Chemistry, and Mathematics at Class 12 level. "
            f"As an Arts student, you cannot directly pursue B.Tech. "
            f"Alternatives: BCA, BA + career in desired field, or take a gap year with PCM coaching."
        )
    # Arts wanting MBBS
    if "arts" in q and g_field == "medical":
        return (
            f"MBBS requires Physics, Chemistry, and Biology at Class 12 level (NEET eligibility). "
            f"As an Arts student, you are NOT eligible for NEET-UG. "
            f"Alternatives: Paramedical courses, public health (BA/MA), healthcare administration."
        )
    if "commerce" in q and g_field == "medical":
        return (
            f"MBBS requires Physics, Chemistry, and Biology at Class 12 level (NEET eligibility). "
            f"As a Commerce student, you are NOT eligible for NEET-UG. "
            f"Alternatives: Healthcare management, pharmacy (some states), or take a gap year with PCB."
        )

    # PhD holder wanting any degree
    if q_level >= 5:
        return (
            f"You hold a {qualification}, which is the highest academic degree. "
            f"Next steps: Post-doctoral research, faculty positions at universities/IITs/IIMs, "
            f"industry research leadership, policy advisory roles, or think-tank positions."
        )

    return None


# ─── AI Plan Generation ────────────────────────────────────────────────────────
@app.post("/api/plan")
async def generate_plan(req: PlanRequest, current=Depends(get_current_user)):
    # Validate qualification-goal combination first
    validation_error = validate_qualification_goal(req.highest_qualification, req.goal)
    if validation_error:
        # Return a well-structured plan that redirects the student
        redirect_plan = f"""## Important Notice

**Your Profile:** {req.highest_qualification} → **Goal:** {req.goal}

---

## ⚠ Goal Mismatch Detected

{validation_error}

---

## Recommended Action

Please go back to **Build Profile** and update your goal to one of the suggested alternatives above. Then generate a new roadmap.

---

## Your Skills: {req.skills}

Your existing skills are valuable. Once you select the correct next step, we will create a detailed roadmap leveraging your skills.
"""
        return {"plan": redirect_plan, "model": "validation", "ai_powered": False}

    prompt = f"""{EDUCATION_REFERENCE}

=== STUDENT PROFILE ===
- Highest Qualification: {req.highest_qualification}
- Career Goal: {req.goal}
- Current Skills: {req.skills}

=== YOUR TASK ===
You are Vidya Maarg, an expert Indian education counselor. Using ONLY the reference document above, create a roadmap for this student.

STRICT RULES:
1. ONLY mention exams, colleges, and paths that are listed in the reference above.
2. If the student's qualification already matches their goal (e.g., B.Tech holder wanting B.Tech), tell them clearly and suggest the next logical step UP.
3. Do NOT invent or hallucinate any exam names, college names, or programmes.
4. Every exam you mention must exist in the reference. Every college must be real.
5. Be specific to Indian education system only.

Create the roadmap with these sections:

## 1. Current Status Assessment
(Analyze their qualification level and what it qualifies them for)

## 2. Recommended Entrance Exams
(List ONLY exams from the reference that apply to their qualification→goal path, with brief eligibility note)

## 3. Preparation Timeline
(Realistic month-by-month plan for 12 months)

## 4. Top Colleges to Target
(ONLY colleges from the reference that match their goal)

## 5. Skills to Develop
(Based on their current skills and goal gap)

## 6. Career Milestones
(1 year, 3 years, 5 years — realistic)

## 7. Scholarships & Financial Aid
(ONLY scholarships from the reference that apply)

Use bullet points. Be practical and factual. No fluff."""

    try:
        async with httpx.AsyncClient(timeout=120.0) as client:
            resp = await client.post(f"{OLLAMA_URL}/api/generate", json={
                "model": OLLAMA_MODEL,
                "prompt": prompt,
                "stream": False,
                "options": {"temperature": 0.3, "num_predict": 2000}
            })
            if resp.status_code == 200:
                data = resp.json()
                return {"plan": data.get("response", ""), "model": OLLAMA_MODEL, "ai_powered": True}
    except Exception:
        pass

    return {"plan": _fallback_plan(req), "model": "rule-based", "ai_powered": False}

# ─── Roadmap & Milestones APIs ──────────────────────────────────────────────────

@app.post("/api/roadmap")
def save_roadmap(req: SaveRoadmapRequest, current=Depends(get_current_user), db=Depends(get_db)):
    user_id = int(current["sub"])
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)

    cur.execute("SELECT * FROM profiles WHERE user_id = %s", (user_id,))
    profile = cur.fetchone()

    cur.execute("""
        INSERT INTO roadmaps (user_id, plan_text, ai_powered, model, qualification, goal, skills)
        VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING id
    """, (
        user_id, req.plan_text, req.ai_powered, req.model,
        profile["highest_qualification"] if profile else "",
        profile["goal"] if profile else "",
        profile["skills"] if profile else "",
    ))
    roadmap_id = cur.fetchone()["id"]

    for i, m in enumerate(req.milestones):
        cur.execute("""
            INSERT INTO milestones (roadmap_id, user_id, section, title, description, milestone_type, sort_order)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (
            roadmap_id, user_id,
            m.get("section", "General"),
            m.get("title", ""),
            m.get("description", ""),
            m.get("milestone_type", "general"),
            i,
        ))

    db.commit()
    return {"roadmap_id": roadmap_id, "message": "Roadmap saved"}

@app.get("/api/roadmap")
def get_roadmap(current=Depends(get_current_user), db=Depends(get_db)):
    user_id = int(current["sub"])
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)

    cur.execute("""
        SELECT * FROM roadmaps WHERE user_id = %s ORDER BY created_at DESC LIMIT 1
    """, (user_id,))
    roadmap = cur.fetchone()
    if not roadmap:
        return {"roadmap": None, "milestones": []}

    cur.execute("""
        SELECT * FROM milestones WHERE roadmap_id = %s ORDER BY sort_order
    """, (roadmap["id"],))
    milestones = cur.fetchall()

    return {
        "roadmap": {
            "id": roadmap["id"],
            "plan_text": roadmap["plan_text"],
            "ai_powered": roadmap["ai_powered"],
            "model": roadmap["model"],
            "qualification": roadmap["qualification"],
            "goal": roadmap["goal"],
            "skills": roadmap["skills"],
            "created_at": str(roadmap["created_at"]),
        },
        "milestones": [
            {
                "id": m["id"],
                "section": m["section"],
                "title": m["title"],
                "description": m["description"],
                "milestone_type": m["milestone_type"],
                "sort_order": m["sort_order"],
                "completed": m["completed"],
                "completed_at": str(m["completed_at"]) if m["completed_at"] else None,
                "checkin_data": m["checkin_data"] if m["checkin_data"] else {},
            }
            for m in milestones
        ]
    }

@app.post("/api/milestones/{milestone_id}/checkin")
def checkin_milestone(milestone_id: int, req: MilestoneCheckinRequest, current=Depends(get_current_user), db=Depends(get_db)):
    user_id = int(current["sub"])
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)

    cur.execute("SELECT * FROM milestones WHERE id = %s AND user_id = %s", (milestone_id, user_id))
    milestone = cur.fetchone()
    if not milestone:
        raise HTTPException(404, "Milestone not found")

    checkin = {}
    if req.rank: checkin["rank"] = req.rank
    if req.score: checkin["score"] = req.score
    if req.percentile: checkin["percentile"] = req.percentile
    if req.category: checkin["category"] = req.category
    if req.notes: checkin["notes"] = req.notes

    cur.execute("""
        UPDATE milestones SET completed = TRUE, completed_at = NOW(), checkin_data = %s
        WHERE id = %s AND user_id = %s
    """, (json.dumps(checkin), milestone_id, user_id))
    db.commit()

    return {"message": "Milestone checked in", "milestone_id": milestone_id, "checkin_data": checkin}

@app.post("/api/milestones/{milestone_id}/uncheckin")
def uncheckin_milestone(milestone_id: int, current=Depends(get_current_user), db=Depends(get_db)):
    user_id = int(current["sub"])
    cur = db.cursor()
    cur.execute("""
        UPDATE milestones SET completed = FALSE, completed_at = NULL, checkin_data = '{}'
        WHERE id = %s AND user_id = %s
    """, (milestone_id, user_id))
    db.commit()
    return {"message": "Milestone unchecked"}

@app.post("/api/milestones/{milestone_id}/recommendations")
async def get_recommendations(milestone_id: int, current=Depends(get_current_user), db=Depends(get_db)):
    user_id = int(current["sub"])
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)

    cur.execute("SELECT * FROM milestones WHERE id = %s AND user_id = %s", (milestone_id, user_id))
    milestone = cur.fetchone()
    if not milestone:
        raise HTTPException(404, "Milestone not found")
    if not milestone["completed"]:
        raise HTTPException(400, "Please check in this milestone first")

    cur.execute("SELECT * FROM roadmaps WHERE id = %s", (milestone["roadmap_id"],))
    roadmap = cur.fetchone()

    checkin = milestone["checkin_data"] if milestone["checkin_data"] else {}

    cur.execute("SELECT * FROM milestones WHERE roadmap_id = %s ORDER BY sort_order", (milestone["roadmap_id"],))
    all_milestones = cur.fetchall()
    completed_list = [m["title"] for m in all_milestones if m["completed"]]
    pending_list = [m["title"] for m in all_milestones if not m["completed"]]

    prompt = f"""{EDUCATION_REFERENCE}

=== CONTEXT ===
A student has completed a milestone in their education journey and needs guidance.

Student Profile:
- Qualification: {roadmap['qualification'] if roadmap else 'N/A'}
- Goal: {roadmap['goal'] if roadmap else 'N/A'}
- Skills: {roadmap['skills'] if roadmap else 'N/A'}

Milestone Completed: {milestone['title']}
Section: {milestone['section']}
Type: {milestone['milestone_type']}

Checkin Details:
- Rank: {checkin.get('rank', 'N/A')}
- Score: {checkin.get('score', 'N/A')}
- Percentile: {checkin.get('percentile', 'N/A')}
- Category: {checkin.get('category', 'N/A')}
- Notes: {checkin.get('notes', 'N/A')}

Other Completed Milestones: {', '.join(completed_list) if completed_list else 'None'}
Remaining Milestones: {', '.join(pending_list) if pending_list else 'None'}

=== YOUR TASK ===
Using ONLY the reference document above, provide guidance. Do NOT hallucinate any college names, exam names, or cutoff numbers you are not sure about.

## Congratulations & Assessment
(Brief factual assessment)

## Colleges/Opportunities You Can Target
(ONLY real colleges from the reference. If rank/score given, give realistic options.)

## Recommended Next Steps
(3-5 actionable steps based on Indian education system)

## Tips for the Next Phase
(Practical counseling advice)

Be factual. Only mention things from the reference."""

    try:
        async with httpx.AsyncClient(timeout=120.0) as client:
            resp = await client.post(f"{OLLAMA_URL}/api/generate", json={
                "model": OLLAMA_MODEL,
                "prompt": prompt,
                "stream": False,
                "options": {"temperature": 0.3, "num_predict": 2000}
            })
            if resp.status_code == 200:
                data = resp.json()
                return {
                    "recommendations": data.get("response", ""),
                    "ai_powered": True,
                    "model": OLLAMA_MODEL,
                    "milestone_id": milestone_id,
                }
    except Exception:
        pass

    return {
        "recommendations": _fallback_recommendations(milestone, checkin, roadmap),
        "ai_powered": False,
        "model": "rule-based",
        "milestone_id": milestone_id,
    }

def _fallback_recommendations(milestone, checkin, roadmap):
    title = milestone["title"].lower() if milestone["title"] else ""
    mtype = milestone["milestone_type"] or "general"
    rank = checkin.get("rank", "")
    goal = roadmap["goal"].lower() if roadmap and roadmap["goal"] else ""

    sections = []
    sections.append("## Congratulations & Assessment\n")

    if rank:
        sections.append(f"You've completed **{milestone['title']}** with rank **{rank}**. Great job on reaching this milestone!\n")
    else:
        sections.append(f"You've completed **{milestone['title']}**. Great job on reaching this milestone!\n")

    sections.append("---\n")
    sections.append("## Colleges/Opportunities You Can Target\n")

    if "jee" in title or ("engineer" in goal and mtype == "exam"):
        if rank:
            try:
                r = int(rank.replace(",", "").strip())
                if r <= 1000:
                    sections.append("- **IIT Bombay** - CSE, Electrical (Top choices)\n- **IIT Delhi** - CSE, Maths & Computing\n- **IIT Madras** - CSE, Data Science\n- **IIT Kanpur** - CSE, Electrical\n")
                elif r <= 5000:
                    sections.append("- **IIT Kharagpur** - CSE, Electronics\n- **IIT Roorkee** - CSE, ECE\n- **IIT Guwahati** - CSE, EEE\n- **IIT Hyderabad** - CSE, AI\n")
                elif r <= 15000:
                    sections.append("- **NIT Trichy** - CSE, ECE\n- **NIT Warangal** - CSE, ECE\n- **NIT Surathkal** - CSE, IT\n- **BITS Pilani** - Various branches\n")
                elif r <= 50000:
                    sections.append("- **NIT Calicut, Jaipur, Allahabad** - CSE, IT\n- **IIIT Hyderabad, Delhi, Bangalore**\n- **DTU Delhi, NSUT Delhi**\n- **State government colleges** via JoSAA counselling\n")
                else:
                    sections.append("- **State NITs** - Various branches\n- **IIITs** - IT, CSE branches\n- **Top private colleges** - VIT, Manipal, SRM, BITS\n- **State government engineering colleges**\n")
            except ValueError:
                sections.append("- Based on your rank, check JoSAA cutoffs at josaa.nic.in\n- Use college predictors on Shiksha, CollegeDekho\n")
        else:
            sections.append("- Check JoSAA counselling cutoffs based on your rank\n- Apply to NITs, IIITs and state colleges\n")

    elif "neet" in title or ("doctor" in goal and mtype == "exam"):
        if rank:
            try:
                r = int(rank.replace(",", "").strip())
                if r <= 100:
                    sections.append("- **AIIMS Delhi** - Top choice\n- **JIPMER Puducherry**\n- **Maulana Azad Medical College, Delhi**\n- **Grant Medical College, Mumbai**\n")
                elif r <= 5000:
                    sections.append("- **AIIMS Jodhpur, Bhopal, Rishikesh**\n- **Government Medical Colleges** in your state\n- **CMC Vellore** (if applied separately)\n- **King George's Medical University, Lucknow**\n")
                elif r <= 25000:
                    sections.append("- **State Government Medical Colleges** (top picks in your state)\n- **ESI Medical Colleges**\n- **BHU Medical College**\n- **Armed Forces Medical College (if eligible)**\n")
                else:
                    sections.append("- **State quota government colleges**\n- **Private medical colleges** (Manipal, Kasturba, SRM)\n- **Deemed universities** (if budget allows)\n- Consider BDS/BAMS as backup options\n")
            except ValueError:
                sections.append("- Check MCC counselling cutoffs at mcc.nic.in\n")
        else:
            sections.append("- Check MCC NEET counselling portal for cutoffs\n- Apply for state and all-India quota\n")

    elif "cat" in title or "mba" in goal:
        sections.append("- Based on your CAT percentile, check IIM shortlists\n- Apply to IIM A/B/C for 99+ percentile\n- IIM L/K/I for 95+ percentile\n- XLRI, FMS, MDI for 90+ percentile\n- Top private B-schools for 80+ percentile\n")

    elif "upsc" in title or "ias" in goal or "ips" in goal:
        sections.append("- If cleared Prelims: Focus entirely on Mains answer writing\n- If cleared Mains: Prepare for UPSC Interview (Personality Test)\n- If got final rank: Check service allocation based on rank and preference\n")

    else:
        sections.append("- Research institutions relevant to your field\n- Check admission portals and counselling schedules\n- Compare cutoffs from previous years\n")

    sections.append("\n---\n")
    sections.append("## Recommended Next Steps\n")
    sections.append("1. **Document your result** - Keep scorecards and certificates safe\n")
    sections.append("2. **Research counselling dates** - Don't miss registration deadlines\n")
    sections.append("3. **Shortlist colleges** - Make a preference list based on your rank\n")
    sections.append("4. **Prepare for counselling** - Gather all required documents\n")
    sections.append("5. **Continue skill building** - Don't stop learning during the wait\n")

    sections.append("\n---\n")
    sections.append("## Tips for the Next Phase\n")
    sections.append("- Stay focused on the process, not just the outcome\n")
    sections.append("- Connect with seniors/alumni from target colleges\n")
    sections.append("- Keep backup options ready\n")
    sections.append("- Use this time to build practical skills in your field\n")

    return "\n".join(sections)


def _fallback_plan(req: PlanRequest) -> str:
    qual = req.highest_qualification.lower()
    goal = req.goal.lower()

    # Check for same-degree situation in fallback too
    if "b.tech" in qual and ("b.tech" in goal or "iit" in goal or "nit" in goal):
        return f"""## Your Personalized Education Roadmap

**Profile Summary:** {req.highest_qualification} → **Goal:** {req.goal}
**Current Skills:** {req.skills}

---

## ⚠ Important: You Already Hold a B.Tech

Since you already have a B.Tech degree, pursuing another B.Tech is not possible or advisable. Here are your **actual next steps**:

---

## Recommended Paths Forward

### Option 1: M.Tech / M.E. (via GATE)
- **Exam:** GATE (Graduate Aptitude Test in Engineering) — conducted by IITs, held in February
- **Colleges:** IIT Bombay, IIT Delhi, IIT Madras, IIT Kanpur, IISc Bangalore, NIT Trichy, NIT Warangal
- **Timeline:** 6-8 months preparation, 2-year programme
- **Bonus:** GATE score also qualifies for PSU jobs (NTPC, ONGC, IOCL, BHEL, SAIL)

### Option 2: MBA (via CAT / XAT / SNAP)
- **Exam:** CAT (for IIMs) — held in November. XAT for XLRI. SNAP for Symbiosis.
- **Colleges:** IIM Ahmedabad, IIM Bangalore, IIM Calcutta, XLRI, FMS Delhi, MDI Gurgaon
- **Timeline:** 4-6 months preparation, 2-year programme
- **Good for:** Career switch to management, consulting, finance

### Option 3: MS / PhD Abroad (via GRE + TOEFL/IELTS)
- **Exams:** GRE (for US/Canada), IELTS/TOEFL (for English proficiency)
- **Universities:** MIT, Stanford, CMU, UC Berkeley, Georgia Tech, ETH Zurich
- **Timeline:** 6-12 months for applications + exams

### Option 4: UPSC Civil Services (IAS / IPS / IFS)
- **Exam:** UPSC CSE — Prelims (June), Mains (September), Interview (Feb-May)
- **Eligibility:** Any bachelor's degree (you qualify!)
- **Timeline:** 12-18 months serious preparation

### Option 5: Direct Industry Career
- Focus on upskilling: Data Science, Cloud (AWS/Azure), Full Stack Development
- Target product companies and startups
- Build a portfolio on GitHub, contribute to open source

---

## Scholarships
- GATE: MHRD stipend of ₹12,400/month during M.Tech
- IIM: Merit-cum-means scholarships available
- Abroad: University RA/TA positions, Fulbright, DAAD
- UPSC: Government pays for training at LBSNAA

---

**Action:** Update your goal in Build Profile to one of the options above, then generate a new roadmap.
"""

    if "mbbs" in qual and ("mbbs" in goal or "doctor" in goal):
        return f"""## Your Personalized Education Roadmap

**Profile Summary:** {req.highest_qualification} → **Goal:** {req.goal}

---

## ⚠ Important: You Already Hold an MBBS

You cannot pursue MBBS again. Here are your **actual next steps**:

### Option 1: MD / MS via NEET PG
- **Exam:** NEET PG — mandatory for all PG medical seats
- **Top colleges:** AIIMS Delhi, JIPMER, PGI Chandigarh, CMC Vellore
- **Timeline:** 6-12 months preparation

### Option 2: Super-speciality (DM / MCh)
- After MD/MS, pursue DM (Medicine) or MCh (Surgery) — 3-year programmes

### Option 3: MBA in Healthcare Management
- **Exams:** CAT / XAT
- **Colleges:** IIM Ahmedabad (PGPX Healthcare), IIHMR Delhi

### Option 4: Clinical Practice
- Start practicing, join a hospital, build clinical experience

---

**Action:** Update your goal in Build Profile and generate a new roadmap.
"""

    if any(k in goal for k in ["engineer", "b.tech", "iit", "nit", "jee"]):
        # Differentiate IIT/NIT goal from generic engineering
        wants_iit = any(k in goal for k in ["iit", "jee advanced"])
        wants_nit = any(k in goal for k in ["nit"])
        wants_iit_nit = wants_iit or wants_nit or ("iit" in goal and "nit" in goal)

        if wants_iit_nit:
            return f"""## Your Personalized Education Roadmap

**Profile Summary:** {req.highest_qualification} → **Goal:** {req.goal}
**Current Skills:** {req.skills}

---

## 1. Current Status Assessment
You are currently at **{req.highest_qualification}** level and want to get into IIT/NIT for B.Tech. This is an achievable goal with focused preparation.

**Important:** IITs and NITs are ONLY accessible through JEE exams. State exams like EAMCET, MHT-CET, KCET etc. CANNOT get you into IIT or NIT.

---

## 2. Required Entrance Exams

### For IITs (Indian Institutes of Technology):
- **Step 1: JEE Main** — You must score in the top 2,50,000 to qualify for JEE Advanced
  - Conducted by NTA, twice a year (January & April sessions)
  - Best of two attempts is considered
- **Step 2: JEE Advanced** — This is the ONLY exam for IIT admission
  - Conducted by IITs on rotation, once a year (May/June)
  - Only top 2,50,000 from JEE Main can attempt this
  - Counselling: JoSAA

### For NITs (National Institutes of Technology) and IIITs:
- **JEE Main score is used directly** — no separate exam needed
  - 31 NITs, 26 IIITs, 33+ GFTIs accept JEE Main score
  - Counselling: JoSAA (centralized) and CSAB (for leftover seats)

### EXAMS THAT DO NOT LEAD TO IIT/NIT:
- ❌ EAMCET / EAPCET — only for AP/TS state colleges
- ❌ MHT-CET — only for Maharashtra state colleges
- ❌ KCET — only for Karnataka state colleges
- ❌ WBJEE — only for West Bengal state colleges
- ❌ COMEDK — only for Karnataka private colleges
- ❌ BITSAT — only for BITS Pilani/Goa/Hyderabad (good alternative, but NOT IIT/NIT)

---

## 3. Preparation Timeline (12 Months)
**Months 1-3:** NCERT Class 11 Physics, Chemistry, Maths — build strong foundation
**Months 4-6:** JEE-level problem solving (HC Verma, Cengage, RD Sharma) + coaching material
**Months 7-9:** Full syllabus revision + weekly full-length JEE Main mocks
**Months 10-11:** JEE Main attempt (Jan session) + analyze weak areas
**Month 12:** JEE Advanced preparation (if qualified) + JEE Main April session

---

## 4. Top Colleges to Target

### IITs (via JEE Advanced):
- IIT Bombay, IIT Delhi, IIT Madras, IIT Kanpur, IIT Kharagpur (top 5)
- IIT Roorkee, IIT Guwahati, IIT Hyderabad (next tier)
- IIT BHU, IIT Indore, IIT Patna, IIT Gandhinagar, IIT Ropar (newer IITs)

### NITs (via JEE Main):
- NIT Trichy, NIT Warangal, NIT Surathkal (top 3 NITs)
- NIT Calicut, MNIT Jaipur, MNNIT Allahabad, VNIT Nagpur
- NIT Rourkela, NIT Durgapur, NIT Kurukshetra

### IIITs (via JEE Main):
- IIIT Hyderabad, IIIT Allahabad, IIIT Delhi, IIIT Bangalore

### Good Alternatives (separate exams):
- BITS Pilani, BITS Goa, BITS Hyderabad (via BITSAT — separate exam)

---

## 5. Skills to Develop
- Strong conceptual Physics, Chemistry, Mathematics (Class 11+12 level)
- Problem-solving speed and accuracy
- Time management during 3-hour exams
- {"Your existing skills in " + req.skills + " will be useful in engineering" if req.skills else "Build analytical thinking"}

---

## 6. Career Milestones
- **1 Year:** Clear JEE Main + JEE Advanced → secure admission at IIT/NIT
- **3 Years:** Complete B.Tech (halfway), secure internships at top companies
- **5 Years:** Graduate from IIT/NIT → placement/higher studies (M.Tech/MS/MBA)

---

## 7. Scholarships & Financial Aid
- **MCM at IITs:** Full fee waiver for family income < ₹1 lakh/year, 2/3 waiver for < ₹5 lakh
- **Institute merit scholarships at NITs**
- **Central Sector Scholarship:** For top 20 percentile of Class 12 board
- **Pragati (AICTE):** ₹50,000/year for girls in technical education
- **State scholarships:** AP ePass, TS ePASS, MahaDBT, Karnataka SSP
- **Coaching:** Allen, FIITJEE, Resonance, Physics Wallah, Narayana, Sri Chaitanya
"""
        else:
            # Generic engineering — can mention state exams too
            exams = ["JEE Main (for NITs, IIITs — also qualifier for JEE Advanced)", "JEE Advanced (for IITs only — must qualify via JEE Main first)", "BITSAT (for BITS Pilani, Goa, Hyderabad only)", "State CETs: AP EAPCET, TS EAMCET, MHT-CET, KCET, WBJEE, COMEDK, KEAM (for respective state colleges ONLY)"]
            colleges = ["IITs (via JEE Advanced only)", "NITs, IIITs (via JEE Main only)", "BITS Pilani / Goa / Hyderabad (via BITSAT only)", "State colleges: JNTU, Anna Univ, COEP Pune, VJTI Mumbai (via respective state CET)"]
            timeline = "**Months 1-3:** NCERT Class 11+12 Physics/Maths/Chemistry  \n**Months 4-6:** JEE-level problem solving + coaching  \n**Months 7-9:** Full syllabus + weekly mocks  \n**Months 10-12:** JEE Main attempt + state CET preparation"
    elif any(k in goal for k in ["doctor", "mbbs", "medical", "neet"]):
        exams = ["NEET-UG — the ONLY exam for ALL MBBS/BDS seats in India (govt + private). No other exam exists for medical admission.", "Counselling: MCC (15% All India Quota) + State counselling (85% state quota)"]
        colleges = ["AIIMS Delhi (NEET rank ~1-50)", "JIPMER Puducherry (rank ~50-200)", "Maulana Azad MC Delhi, Grant MC Mumbai (rank ~200-500)", "Top state GMCs (rank ~500-10,000)", "Private: Manipal, Kasturba, SRM Medical, Amrita"]
        timeline = "**Months 1-4:** Biology NCERT line by line (both Class 11 & 12)  \n**Months 5-7:** Chemistry (Physical + Organic + Inorganic) + Physics  \n**Months 8-10:** Full-length NEET mocks (every weekend)  \n**Months 11-12:** Weak area revision + previous year papers"
    elif any(k in goal for k in ["mba", "management", "cat", "iim"]):
        exams = ["CAT (for all 20 IIMs + FMS, MDI, SPJIMR, IIT B-schools) — held in November", "XAT (primarily for XLRI Jamshedpur)", "SNAP (for Symbiosis: SIBM Pune, SCMHRD)", "NMAT (for NMIMS Mumbai)", "IIFT (for Indian Institute of Foreign Trade only)"]
        colleges = ["IIM A/B/C (99+ percentile)", "IIM L/K/I (95-99 percentile)", "XLRI, FMS Delhi, MDI Gurgaon (90-98 percentile)", "New IIMs, SIBM Pune, NMIMS (85-95 percentile)"]
        timeline = "**Months 1-3:** Quantitative Aptitude + Verbal Ability basics  \n**Months 4-6:** Data Interpretation + Logical Reasoning  \n**Months 7-9:** Mock CATs every week + sectional practice  \n**Months 10-12:** CAT (Nov) + XAT (Jan) + SNAP + WAT/GD/PI prep"
    elif any(k in goal for k in ["law", "lawyer", "clat", "nlu", "llb"]):
        exams = ["CLAT (for 22+ National Law Universities)", "AILET (for NLU Delhi ONLY — separate from CLAT)", "LSAT India (for Jindal and some private law colleges — NOT for NLUs)"]
        colleges = ["NLSIU Bangalore (CLAT rank 1-80)", "NLU Delhi (via AILET, not CLAT)", "NALSAR Hyderabad (CLAT rank 80-200)", "WBNUJS Kolkata (rank 200-400)", "NLU Jodhpur, GNLU Gandhinagar, RMLNLU Lucknow"]
        timeline = "**Months 1-3:** English + Legal Reasoning foundation  \n**Months 4-6:** GK / Current Affairs daily + Logical Reasoning  \n**Months 7-9:** Full-length CLAT mocks + AILET practice  \n**Months 10-12:** CLAT exam (Dec) + AILET + counselling"
    elif any(k in goal for k in ["data", "ai", "ml", "machine learning", "data scientist"]):
        exams = ["GATE CS/DA (for M.Tech in AI/ML at IITs/IISc)", "GRE (for MS abroad at CMU, Stanford, MIT)", "Industry certifications (Google ML, AWS, Coursera specializations)"]
        colleges = ["IIT Bombay, IIT Delhi, IIT Madras, IISc (via GATE for M.Tech)", "IIIT Hyderabad (strong AI/ML programme)", "Abroad: CMU, Stanford, MIT, Georgia Tech (via GRE)"]
        timeline = "**Months 1-3:** Python, Statistics, Linear Algebra, Probability  \n**Months 4-6:** ML algorithms + Kaggle projects + GATE prep  \n**Months 7-9:** Deep Learning + NLP/CV specialization  \n**Months 10-12:** GATE exam (Feb) / GRE + applications + portfolio"
    elif any(k in goal for k in ["civil service", "ias", "upsc", "ips"]):
        exams = ["UPSC CSE — the ONLY exam for IAS/IPS/IFS. Three stages: Prelims (June) → Mains (Sept) → Interview (Feb-May)", "State PSC exams as backup (APPSC, TSPSC, MPSC, UPPSC etc.)"]
        colleges = ["Training: LBSNAA Mussoorie (IAS), SVPNPA Hyderabad (IPS)", "Coaching: Vajiram & Ravi, Forum IAS, Vision IAS, Drishti IAS, Insights IAS"]
        timeline = "**Months 1-4:** NCERT (Class 6-12) all subjects + General Studies foundation  \n**Months 5-8:** Optional subject + Current Affairs daily + answer writing practice  \n**Months 9-10:** Prelims mock tests (weekly) + CSAT preparation  \n**Months 11-12:** Prelims attempt (June) → if cleared, switch to Mains writing"
    elif any(k in goal for k in ["software engineer", "software"]):
        exams = ["JEE Main (for NITs/IIITs — CSE/IT branch)", "JEE Advanced (for IITs — CSE branch)", "BITSAT (for BITS Pilani CSE)", "State CETs (for state engineering colleges — CSE/IT)"]
        colleges = ["IIT Bombay CSE (via JEE Advanced)", "NIT Trichy/Warangal CSE (via JEE Main)", "BITS Pilani CSE (via BITSAT)", "IIIT Hyderabad (via JEE Main + separate test)"]
        timeline = "**Months 1-3:** JEE preparation (Physics, Chemistry, Maths)  \n**Months 4-6:** Problem solving + mock tests  \n**Months 7-9:** Full syllabus revision  \n**Months 10-12:** JEE Main + Advanced attempts"
    elif any(k in goal for k in ["government job", "banking", "ssc", "railways"]):
        exams = ["SSC CGL (for Group B & C central govt posts) — requires bachelor's degree", "IBPS PO / Clerk (for 11 public sector banks) — requires bachelor's degree", "RBI Grade B (for Reserve Bank) — requires bachelor's with 60%", "RRB NTPC (for railway non-technical posts)", "SSC CHSL (for LDC/DEO) — requires Class 12"]
        colleges = ["No college admission — these are government recruitment exams", "Coaching: Paramount, Career Power, Oliveboard, Adda247, Testbook"]
        timeline = "**Months 1-3:** Quantitative Aptitude + English  \n**Months 4-6:** Reasoning + General Awareness  \n**Months 7-9:** Full-length mocks + previous year papers  \n**Months 10-12:** Exam attempts + interview preparation"
    elif any(k in goal for k in ["defence", "nda", "cds"]):
        exams = ["NDA (after Class 12, age 16.5-19.5) — conducted by UPSC twice a year", "CDS (after graduation) — conducted by UPSC twice a year", "AFCAT (for Air Force, after graduation)"]
        colleges = ["NDA Khadakwasla (Pune) → then IMA Dehradun / Naval Academy / Air Force Academy", "OTA Chennai (for CDS OTA entry)"]
        timeline = "**Months 1-3:** Maths + General Ability (English + GK)  \n**Months 4-6:** Physical fitness training + mock tests  \n**Months 7-9:** Previous year papers + SSB interview preparation  \n**Months 10-12:** NDA/CDS exam + SSB interview"
    elif any(k in goal for k in ["chartered accountant", "ca"]):
        exams = ["CA Foundation (after Class 12, or direct entry after graduation)", "CA Intermediate", "CA Final + 3-year Articleship", "All conducted by ICAI"]
        colleges = ["NOT linked to any college — professional certification by ICAI", "Coaching: VSI, Swapnil Patni, CA Monks, Unacademy CA"]
        timeline = "**Months 1-4:** CA Foundation preparation (4 subjects)  \n**Months 5-8:** CA Foundation exam → result → register for Intermediate  \n**Months 9-12:** Start CA Intermediate Group 1 preparation  \n**Total journey:** 4-5 years from Foundation to CA Final"
    elif any(k in goal for k in ["architecture", "b.arch"]):
        exams = ["NATA (for most architecture colleges — SPA Delhi, CEPT, JJ School)", "JEE Main Paper 2A (for B.Arch at NITs, some IITs)", "Requires Class 12 with Maths, minimum 50%"]
        colleges = ["SPA Delhi, SPA Bhopal (via NATA)", "IIT Kharagpur, IIT Roorkee (via JEE Main Paper 2A)", "CEPT Ahmedabad, JJ School Mumbai (via NATA)"]
        timeline = "**Months 1-3:** Drawing/sketching skills + spatial awareness  \n**Months 4-6:** NATA aptitude preparation + JEE Maths  \n**Months 7-9:** Mock tests + portfolio building  \n**Months 10-12:** NATA exam + JEE Main Paper 2A"
    elif any(k in goal for k in ["teacher", "professor"]):
        exams = ["B.Ed entrance (for school teaching)", "CTET / State TET (Teacher Eligibility Test — mandatory for govt school jobs)", "UGC NET / CSIR NET (for college lectureship eligibility)", "PhD entrance (for professor track)"]
        colleges = ["For school teaching: B.Ed from any recognized university → clear CTET", "For college: Master's degree + UGC NET → apply as Assistant Professor", "For university professor: PhD required + publications"]
        timeline = "**Months 1-4:** Complete/prepare for B.Ed (if not done)  \n**Months 5-8:** CTET/TET preparation  \n**Months 9-12:** Apply for govt school positions / Start UGC NET prep for college"
    else:
        exams = ["CUET (for central universities — BA/B.Sc/B.Com/BBA)", "State entrance exams (as applicable)", "Relevant professional exams for your specific goal"]
        colleges = ["Central Universities: DU, JNU, BHU, AMU, Jamia (via CUET)", "State universities (via state entrance or merit)", "Private: Ashoka, Shiv Nadar, Manipal, Christ University"]
        timeline = "**Months 1-3:** Foundation and core subject mastery  \n**Months 4-6:** Entrance exam preparation  \n**Months 7-9:** Mock exams + result analysis  \n**Months 10-12:** Applications + counselling"

    exams_md = "\n".join(f"- {e}" for e in exams)
    colleges_md = "\n".join(f"- {c}" for c in colleges)

    return f"""## Your Personalized Education Roadmap

**Profile Summary:** {req.highest_qualification} -> **Goal:** {req.goal}
**Current Skills:** {req.skills}

---

## 1. Current Status Assessment
Based on your qualification (**{req.highest_qualification}**), you are at a strong starting point. Your skills in **{req.skills}** are an asset. The key now is to align your preparation with the right entrance exams and institutions for **{req.goal}**.

---

## 2. Recommended Entrance Exams
{exams_md}

---

## 3. Preparation Timeline (12 Months)
{timeline}

---

## 4. Top Colleges to Target
{colleges_md}

---

## 5. Skills to Develop
- Strong domain fundamentals (subject-specific)
- Analytical thinking and problem-solving
- Time management and exam strategy
- Communication and soft skills
- Digital tools relevant to {req.goal}

---

## 6. Career Milestones
- **1 Year:** Clear entrance exam -> secure admission in target institution
- **3 Years:** Complete degree + internship + build professional network
- **5 Years:** Establish professionally, consider specialization or higher studies

---

## 7. Scholarships & Financial Aid
- **Central Sector Scholarship** - For students in top 20 percentile of Class 12
- **National Merit-cum-Means Scholarship (NMMS)**
- **Pragati & Saksham Scholarships** - AICTE (for technical education)
- **State Government Scholarships** - Check your state's scholarship portal
- **Institute Merit Scholarships** - Available at most central institutions
- **Private Scholarships** - Tata, Reliance, Wipro, Infosys foundations
"""


# ─── Cutoffs Data (loaded once) ─────────────────────────────────────────────────
_CUTOFFS_DATA = []
try:
    with open(os.path.join(os.path.dirname(__file__) if "__file__" in dir() else ".", "cutoffs.json")) as _cf:
        _CUTOFFS_DATA = json.load(_cf)
except Exception:
    try:
        with open("cutoffs.json") as _cf:
            _CUTOFFS_DATA = json.load(_cf)
    except Exception:
        pass

# ─── Pydantic Models for Exam Calendar ──────────────────────────────────────────
class ExamCalendarCreate(BaseModel):
    exam_name: str
    exam_category: Optional[str] = None
    event_type: Optional[str] = None
    event_date: str
    event_end_date: Optional[str] = None
    description: Optional[str] = None
    website_url: Optional[str] = None
    is_tentative: bool = False

class ExamCalendarUpdate(BaseModel):
    exam_name: Optional[str] = None
    exam_category: Optional[str] = None
    event_type: Optional[str] = None
    event_date: Optional[str] = None
    event_end_date: Optional[str] = None
    description: Optional[str] = None
    website_url: Optional[str] = None
    is_tentative: Optional[bool] = None

class CollegePredictRequest(BaseModel):
    exam: str
    rank: Optional[float] = None
    percentile: Optional[float] = None
    score: Optional[float] = None
    category: str = "General"

class SubscribeRequest(BaseModel):
    exam_name: str
    subscribe_type: str = "all"

class ChatRequest(BaseModel):
    message: str

# ─── Admin Exam Calendar CRUD ───────────────────────────────────────────────────

@app.post("/api/admin/exam-calendar", status_code=201)
def admin_create_exam_event(payload: dict, current=Depends(get_current_user), db=Depends(get_db)):
    user_id = int(current["sub"])
    _require_role(user_id, "admin", db)
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)

    # Support single object or array
    items = payload.get("events") if "events" in payload else ([payload] if "exam_name" in payload else [payload])
    if isinstance(items, dict):
        items = [items]

    created = []
    for item in items:
        cur.execute("""
            INSERT INTO exam_calendar (exam_name, exam_category, event_type, event_date, event_end_date,
                                       description, website_url, is_tentative, created_by)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s) RETURNING id, exam_name, event_date
        """, (
            item.get("exam_name"), item.get("exam_category"), item.get("event_type"),
            item.get("event_date"), item.get("event_end_date"),
            item.get("description"), item.get("website_url"),
            item.get("is_tentative", False), user_id
        ))
        row = cur.fetchone()
        created.append({"id": row["id"], "exam_name": row["exam_name"], "event_date": str(row["event_date"])})
    db.commit()
    return {"created": created, "count": len(created)}

@app.post("/api/admin/exam-calendar/bulk", status_code=201)
def admin_bulk_create_events(events: List[ExamCalendarCreate], current=Depends(get_current_user), db=Depends(get_db)):
    user_id = int(current["sub"])
    _require_role(user_id, "admin", db)
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)

    created = []
    for ev in events:
        cur.execute("""
            INSERT INTO exam_calendar (exam_name, exam_category, event_type, event_date, event_end_date,
                                       description, website_url, is_tentative, created_by)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s) RETURNING id
        """, (ev.exam_name, ev.exam_category, ev.event_type, ev.event_date, ev.event_end_date,
              ev.description, ev.website_url, ev.is_tentative, user_id))
        created.append(cur.fetchone()["id"])
    db.commit()
    return {"created_ids": created, "count": len(created)}

@app.put("/api/admin/exam-calendar/{event_id}")
def admin_update_exam_event(event_id: int, req: ExamCalendarUpdate, current=Depends(get_current_user), db=Depends(get_db)):
    user_id = int(current["sub"])
    _require_role(user_id, "admin", db)
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)

    fields, vals = [], []
    for field in ["exam_name","exam_category","event_type","event_date","event_end_date","description","website_url","is_tentative"]:
        v = getattr(req, field, None)
        if v is not None:
            fields.append(f"{field} = %s")
            vals.append(v)
    if not fields:
        raise HTTPException(400, "No fields to update")
    fields.append("updated_at = NOW()")
    vals.append(event_id)
    cur.execute(f"UPDATE exam_calendar SET {', '.join(fields)} WHERE id = %s RETURNING id", vals)
    if not cur.fetchone():
        raise HTTPException(404, "Event not found")
    db.commit()
    return {"message": "Updated", "id": event_id}

@app.delete("/api/admin/exam-calendar/{event_id}")
def admin_delete_exam_event(event_id: int, current=Depends(get_current_user), db=Depends(get_db)):
    user_id = int(current["sub"])
    _require_role(user_id, "admin", db)
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    cur.execute("DELETE FROM exam_calendar WHERE id = %s RETURNING id", (event_id,))
    if not cur.fetchone():
        raise HTTPException(404, "Event not found")
    db.commit()
    return {"message": "Deleted", "id": event_id}

# ─── Public Exam Calendar Endpoints ─────────────────────────────────────────────

@app.get("/api/exam-calendar")
def list_exam_events(category: Optional[str] = None, month: Optional[int] = None,
                     year: Optional[int] = None, event_type: Optional[str] = None,
                     exam_name: Optional[str] = None, db=Depends(get_db)):
    cur = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    where, params = [], []
    if category:
        where.append("exam_category = %s"); params.append(category)
    if month:
        where.append("EXTRACT(MONTH FROM event_date) = %s"); params.append(month)
    if year:
        where.append("EXTRACT(YEAR FROM event_date) = %s"); params.append(year)
    if event_type:
        where.append("event_type = %s"); params.append(event_type)
    if exam_name:
        where.append("LOWER(exam_name) LIKE LOWER(%s)"); params.append(f"%{exam_name}%")
    clause = (" WHERE " + " AND ".join(where)) if where else ""
    cur.execute(f"SELECT id, exam_name, exam_category, event_type, event_date, event_end_date, description, website_url, is_tentative, created_at FROM exam_calendar{clause} ORDER BY event_date ASC", params)
    rows = cur.fetchall()
    for r in rows:
        for k in ("event_date", "event_end_date", "created_at"):
            if r.get(k):
                r[k] = str(r[k])
    return {"events": rows, "count": len(rows)}

@app.get("/api/exam-calendar/upcoming")
def upcoming_exam_events(days: int = 30, db=Depends(get_db)):
    cur = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute("""
        SELECT id, exam_name, exam_category, event_type, event_date, event_end_date,
               description, website_url, is_tentative
        FROM exam_calendar
        WHERE event_date >= CURRENT_DATE AND event_date <= CURRENT_DATE + %s * INTERVAL '1 day'
        ORDER BY event_date ASC
    """, (days,))
    rows = cur.fetchall()
    for r in rows:
        for k in ("event_date", "event_end_date"):
            if r.get(k):
                r[k] = str(r[k])
    return {"events": rows, "count": len(rows)}

# ─── College Predictor ──────────────────────────────────────────────────────────

@app.post("/api/predict-college")
def predict_college(req: CollegePredictRequest):
    exam_key = req.exam.lower().replace(" ", "_").replace("-", "_")
    matched_exam = None
    for ex in _CUTOFFS_DATA:
        if exam_key in ex.get("id", "").lower() or exam_key in ex.get("examName", "").lower().replace(" ", "_"):
            matched_exam = ex
            break
    if not matched_exam:
        available = [e["id"] for e in _CUTOFFS_DATA]
        raise HTTPException(404, f"Exam '{req.exam}' not found. Available: {available}")

    results = []
    for entry in matched_exam.get("data", []):
        if entry.get("category", "").lower() != req.category.lower():
            continue
        # JEE Advanced uses rank (lower is better)
        if "closeRank" in entry and req.rank is not None:
            if req.rank <= entry["closeRank"]:
                results.append({
                    "college": entry.get("college"),
                    "branch": entry.get("branch"),
                    "category": entry.get("category"),
                    "closeRank": entry.get("closeRank"),
                    "openRank": entry.get("openRank"),
                    "chance": "High" if req.rank <= entry.get("openRank", 0) else "Moderate"
                })
        # JEE Main / NEET / CAT use percentile (higher is better)
        elif "cutoffPercentile" in entry and req.percentile is not None:
            if req.percentile >= entry["cutoffPercentile"]:
                results.append({
                    "college": entry.get("college"),
                    "branch": entry.get("branch"),
                    "category": entry.get("category"),
                    "quota": entry.get("quota"),
                    "cutoffPercentile": entry.get("cutoffPercentile"),
                    "chance": "High" if req.percentile >= entry["cutoffPercentile"] + 1 else "Moderate"
                })
        # CLAT / NEET / CA use score (higher is better for CLAT/NEET, check context)
        elif "cutoffScore" in entry and req.score is not None:
            if req.score >= entry["cutoffScore"]:
                results.append({
                    "college": entry.get("college"),
                    "branch": entry.get("branch"),
                    "category": entry.get("category"),
                    "cutoffScore": entry.get("cutoffScore"),
                    "notes": entry.get("notes"),
                    "chance": "High" if req.score >= entry["cutoffScore"] + 5 else "Moderate"
                })

    results.sort(key=lambda x: x.get("closeRank") or x.get("cutoffPercentile") or x.get("cutoffScore") or 0,
                 reverse=("closeRank" not in (results[0] if results else {})))

    return {
        "exam": matched_exam.get("examName"),
        "year": matched_exam.get("year"),
        "source": matched_exam.get("source"),
        "input": {"rank": req.rank, "percentile": req.percentile, "score": req.score, "category": req.category},
        "matches": results,
        "count": len(results),
        "notes": matched_exam.get("notes")
    }

# ─── Subscription Endpoints ─────────────────────────────────────────────────────

@app.post("/api/subscribe", status_code=201)
def subscribe_exam(req: SubscribeRequest, current=Depends(get_current_user), db=Depends(get_db)):
    user_id = int(current["sub"])
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    try:
        cur.execute("""
            INSERT INTO subscriptions (user_id, exam_name, subscribe_type)
            VALUES (%s, %s, %s) RETURNING id
        """, (user_id, req.exam_name, req.subscribe_type))
        db.commit()
        return {"message": "Subscribed", "id": cur.fetchone()["id"]}
    except psycopg2.errors.UniqueViolation:
        db.rollback()
        raise HTTPException(409, "Already subscribed to this exam")

@app.delete("/api/subscribe/{exam_name}")
def unsubscribe_exam(exam_name: str, current=Depends(get_current_user), db=Depends(get_db)):
    user_id = int(current["sub"])
    cur = db.cursor()
    cur.execute("DELETE FROM subscriptions WHERE user_id = %s AND exam_name = %s RETURNING id", (user_id, exam_name))
    if not cur.fetchone():
        raise HTTPException(404, "Subscription not found")
    db.commit()
    return {"message": "Unsubscribed", "exam_name": exam_name}

@app.get("/api/subscriptions")
def list_subscriptions(current=Depends(get_current_user), db=Depends(get_db)):
    user_id = int(current["sub"])
    cur = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute("SELECT id, exam_name, subscribe_type, created_at FROM subscriptions WHERE user_id = %s ORDER BY created_at DESC", (user_id,))
    rows = cur.fetchall()
    for r in rows:
        if r.get("created_at"):
            r["created_at"] = str(r["created_at"])
    return {"subscriptions": rows, "count": len(rows)}

@app.get("/api/exam-calendar/my-alerts")
def my_exam_alerts(current=Depends(get_current_user), db=Depends(get_db)):
    user_id = int(current["sub"])
    cur = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute("""
        SELECT ec.id, ec.exam_name, ec.exam_category, ec.event_type, ec.event_date,
               ec.event_end_date, ec.description, ec.website_url, ec.is_tentative
        FROM exam_calendar ec
        INNER JOIN subscriptions s ON LOWER(ec.exam_name) = LOWER(s.exam_name)
        WHERE s.user_id = %s AND ec.event_date >= CURRENT_DATE
        ORDER BY ec.event_date ASC
    """, (user_id,))
    rows = cur.fetchall()
    for r in rows:
        for k in ("event_date", "event_end_date"):
            if r.get(k):
                r[k] = str(r[k])
    return {"alerts": rows, "count": len(rows)}

# ─── AI Chat Endpoint ───────────────────────────────────────────────────────────

EDUCATION_SYSTEM_PROMPT = """You are an expert Indian education counselor and career advisor. You help students with:
- Information about entrance exams (JEE, NEET, CLAT, CAT, GATE, CUET, CA Foundation, etc.)
- College admissions process and cutoffs
- Career guidance for Engineering, Medical, Law, Management, and other fields
- Scholarship information and financial aid
- Study strategies and preparation tips
- Comparing colleges and branches
- Understanding reservation categories and quotas
- Timeline planning for exam preparation

Be accurate, helpful, and encouraging. Provide specific, actionable advice. If you don't know something, say so rather than guessing.
Always respond in a clear, structured format. Use markdown for formatting when helpful."""

@app.post("/api/chat")
async def ai_chat(req: ChatRequest, current=Depends(get_current_user)):
    async def stream_response():
        try:
            async with httpx.AsyncClient(timeout=120.0) as client:
                async with client.stream("POST", f"{OLLAMA_URL}/api/generate", json={
                    "model": OLLAMA_MODEL,
                    "prompt": req.message,
                    "system": EDUCATION_SYSTEM_PROMPT,
                    "stream": True,
                    "options": {"temperature": 0.7, "num_predict": 1500}
                }) as response:
                    async for line in response.aiter_lines():
                        if line.strip():
                            try:
                                chunk = json.loads(line)
                                token = chunk.get("response", "")
                                if token:
                                    yield f"data: {json.dumps({'token': token})}\n\n"
                                if chunk.get("done"):
                                    yield f"data: {json.dumps({'done': True})}\n\n"
                                    break
                            except json.JSONDecodeError:
                                continue
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"

    return StreamingResponse(stream_response(), media_type="text/event-stream",
                             headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"})
