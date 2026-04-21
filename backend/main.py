from fastapi import FastAPI, HTTPException, Depends, status
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
import httpx
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes
from jose import JWTError, jwt
from passlib.context import CryptContext

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
    """)
    conn.commit()
    cur.close()
    conn.close()

# ─── App ────────────────────────────────────────────────────────────────────────
app = FastAPI(title="EduGuide India API", version="2.0.0")

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
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    cur.execute("SELECT * FROM users WHERE id = %s", (int(current["sub"]),))
    user = cur.fetchone()
    if not user:
        raise HTTPException(404, "User not found")
    cur.execute("SELECT * FROM profiles WHERE user_id = %s", (int(current["sub"]),))
    profile = cur.fetchone()
    return {
        "id": user["id"],
        "email": user["email"],
        "first_name": decrypt_field(user["first_name"]),
        "last_name": decrypt_field(user["last_name"]),
        "dob": decrypt_field(user["dob"]),
        "phone": decrypt_field(user["phone"]),
        "profile": dict(profile) if profile else None,
    }

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

# ─── AI Plan Generation ────────────────────────────────────────────────────────
@app.post("/api/plan")
async def generate_plan(req: PlanRequest, current=Depends(get_current_user)):
    prompt = f"""You are an expert Indian education counselor. A student profile:
- Highest Qualification: {req.highest_qualification}
- Career Goal: {req.goal}
- Current Skills: {req.skills}

Create a detailed structured roadmap to achieve their goal in India. Include:

## 1. Current Status Assessment
## 2. Recommended Entrance Exams
(List specific exams with eligibility, importance - JEE, NEET, CAT, GATE, CLAT, UPSC etc.)
## 3. Preparation Timeline
(Month-by-month plan for 12 months)
## 4. Top Colleges to Target
(Based on goal and qualification)
## 5. Skills to Develop
## 6. Career Milestones
(1 year, 3 years, 5 years)
## 7. Scholarships & Financial Aid

Be specific, practical and motivating. Use bullet points."""

    try:
        async with httpx.AsyncClient(timeout=120.0) as client:
            resp = await client.post(f"{OLLAMA_URL}/api/generate", json={
                "model": OLLAMA_MODEL,
                "prompt": prompt,
                "stream": False,
                "options": {"temperature": 0.7, "num_predict": 1500}
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
    """Save AI-generated plan and its parsed milestones."""
    user_id = int(current["sub"])
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)

    # Get user profile for metadata
    cur.execute("SELECT * FROM profiles WHERE user_id = %s", (user_id,))
    profile = cur.fetchone()

    # Insert roadmap
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

    # Insert milestones
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
    """Get the latest roadmap and its milestones for the current user."""
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
    """Mark a milestone as completed with optional checkin data (rank, score, etc.)."""
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
    """Undo a milestone checkin."""
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
    """After checking in a milestone (e.g., entrance exam), generate AI recommendations based on rank/score."""
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

    prompt = f"""You are an expert Indian education counselor. A student has completed a milestone in their education journey and needs guidance on next steps.

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

Based on this milestone completion and the student's results, provide:

## Congratulations & Assessment
(Brief assessment of their result)

## Colleges/Opportunities You Can Target
(Based on rank/score, list specific realistic colleges or opportunities with expected cutoffs. Be very specific to Indian context.)

## Recommended Next Steps
(What they should do immediately - 3-5 actionable steps)

## Tips for the Next Phase
(Counseling advice, what to focus on)

Be specific, data-driven and encouraging. If they provided a rank/score, give realistic college options for that rank range."""

    try:
        async with httpx.AsyncClient(timeout=120.0) as client:
            resp = await client.post(f"{OLLAMA_URL}/api/generate", json={
                "model": OLLAMA_MODEL,
                "prompt": prompt,
                "stream": False,
                "options": {"temperature": 0.7, "num_predict": 1500}
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
    goal = req.goal.lower()

    if any(k in goal for k in ["engineer", "b.tech", "iit", "nit", "jee"]):
        exams = ["JEE Main (Jan & Apr sessions)", "JEE Advanced (for IITs)", "BITSAT", "State CETs (MHT-CET, AP EAPCET, TS EAMCET, KCET)"]
        colleges = ["IIT Bombay / Delhi / Madras / Kharagpur", "NIT Trichy / Warangal / Surathkal", "BITS Pilani / Goa / Hyderabad", "VIT Vellore, Manipal, SRM Chennai"]
        timeline = "**Months 1-3:** NCERT Physics/Maths/Chemistry revision  \n**Months 4-6:** Problem solving + coaching modules  \n**Months 7-9:** Full syllabus coverage + weekly mocks  \n**Months 10-12:** Intense revision + JEE Main attempt"
    elif any(k in goal for k in ["doctor", "mbbs", "medical", "neet"]):
        exams = ["NEET-UG (single national exam for MBBS/BDS)", "AIIMS (included in NEET now)", "JIPMER (included in NEET now)", "State counseling via NEET score"]
        colleges = ["AIIMS Delhi / Mumbai / Bhopal", "CMC Vellore", "JIPMER Puducherry", "Top Government Medical Colleges via NEET"]
        timeline = "**Months 1-4:** Biology deep-dive (NCERT line by line)  \n**Months 5-7:** Chemistry + Physics  \n**Months 8-10:** Full-length NEET mocks  \n**Months 11-12:** Weak area revision + final mocks"
    elif any(k in goal for k in ["mba", "management", "cat", "iim"]):
        exams = ["CAT (for IIMs)", "XAT (for XLRI)", "SNAP (for Symbiosis)", "MAT / CMAT / NMAT", "GMAT (for international programs)"]
        colleges = ["IIM Ahmedabad / Bangalore / Calcutta", "XLRI Jamshedpur", "FMS Delhi", "MDI Gurgaon, SPJIMR Mumbai"]
        timeline = "**Months 1-3:** Quantitative Aptitude basics  \n**Months 4-6:** Verbal Ability + Data Interpretation  \n**Months 7-9:** Mock CATs every week  \n**Months 10-12:** CAT + apply to top B-schools"
    elif any(k in goal for k in ["law", "lawyer", "clat", "llb"]):
        exams = ["CLAT (for all NLUs)", "AILET (NLU Delhi)", "LSAT India", "DU LLB Entrance"]
        colleges = ["NLSIU Bangalore", "NLU Delhi", "NALSAR Hyderabad", "WBNUJS Kolkata", "NLU Jodhpur"]
        timeline = "**Months 1-3:** Legal Reasoning + English  \n**Months 4-6:** GK / Current Affairs + Logical Reasoning  \n**Months 7-9:** Full-length CLAT mocks  \n**Months 10-12:** Interview prep + application"
    elif any(k in goal for k in ["data", "ai", "ml", "machine learning", "data scientist"]):
        exams = ["GATE CS / DA (for M.Tech + PSU jobs)", "IIT/IISc M.Tech entrance", "NIMCET (for MCA)", "Industry certifications (Google, AWS, Coursera)"]
        colleges = ["IISc Bangalore", "IIT Bombay / Delhi / Madras", "IIIT Hyderabad", "CMI Chennai, ISI Kolkata"]
        timeline = "**Months 1-3:** Python, Statistics, Linear Algebra  \n**Months 4-6:** ML algorithms + Kaggle projects  \n**Months 7-9:** GATE preparation (if M.Tech target)  \n**Months 10-12:** Portfolio + job/college applications"
    elif any(k in goal for k in ["civil service", "ias", "upsc", "ips"]):
        exams = ["UPSC CSE Prelims (June)", "UPSC CSE Mains (September)", "UPSC Interview (February-May)", "State PSC exams as backup"]
        colleges = ["LBSNAA Mussoorie (IAS training)", "SVPNPA Hyderabad (IPS training)", "Coaching: Vajiram, Forum IAS, Vision IAS"]
        timeline = "**Months 1-4:** NCERT + General Studies foundation  \n**Months 5-8:** Optional subject + Current Affairs daily  \n**Months 9-10:** Prelims mocks + answer writing  \n**Months 11-12:** Mains writing practice"
    else:
        exams = ["CUET (Central University common entrance)", "Relevant state entrance exams", "GATE / CAT / other PG exams for your field"]
        colleges = ["Central Universities (DU, BHU, JNU)", "Top NITs and IITs", "BITS Pilani campuses", "Top private universities (Ashoka, Shiv Nadar, Manipal)"]
        timeline = "**Months 1-3:** Foundation and core subject mastery  \n**Months 4-6:** Practice tests and weak area improvement  \n**Months 7-9:** Mock exams and result analysis  \n**Months 10-12:** Applications and interview preparation"

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
