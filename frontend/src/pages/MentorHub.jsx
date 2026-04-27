import { useEffect, useState } from 'react'
import { api } from '../utils/api'
import { useAuth } from '../context/AuthContext'

export default function MentorHub() {
  const { token } = useAuth()
  const [profile, setProfile] = useState(null)
  const [requests, setRequests] = useState([])
  const [form, setForm] = useState({
    headline: '',
    bio: '',
    expertise: '',
    languages: '',
    experience_years: 0,
    is_accepting: true,
  })
  const [msg, setMsg] = useState({ ok: '', err: '' })

  const load = async () => {
    const p = await api.get('/api/mentor/profile', token)
    if (!p.error) {
      setProfile(p.profile)
      if (p.profile) {
        setForm({
          headline: p.profile.headline || '',
          bio: p.profile.bio || '',
          expertise: (p.profile.expertise || []).join(', '),
          languages: (p.profile.languages || []).join(', '),
          experience_years: p.profile.experience_years || 0,
          is_accepting: p.profile.is_accepting !== false,
        })
      }
    }
    const r = await api.get('/api/mentor/requests', token)
    if (!r.error) setRequests(r.requests || [])
  }

  useEffect(() => { load() }, [])

  const applyMentor = async (e) => {
    e.preventDefault()
    setMsg({ ok: '', err: '' })
    const payload = {
      headline: form.headline.trim(),
      bio: form.bio.trim(),
      expertise: form.expertise.split(',').map((x) => x.trim()).filter(Boolean),
      languages: form.languages.split(',').map((x) => x.trim()).filter(Boolean),
      experience_years: Number(form.experience_years || 0),
      is_accepting: !!form.is_accepting,
    }
    const res = await api.post('/api/mentor/apply', payload, token)
    if (res.error) {
      setMsg({ ok: '', err: res.error })
      return
    }
    setMsg({ ok: 'Application submitted. Verification pending.', err: '' })
    load()
  }

  const updateRequestStatus = async (id, status) => {
    const res = await api.post(`/api/mentor/requests/${id}/status`, { status }, token)
    if (res.error) return
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
  }

  return (
    <div>
      <div className="section-header">
        <h1>Mentor Hub</h1>
        <p>Apply as mentor, track verification status, and manage incoming mentorship requests.</p>
      </div>

      <div className="card" style={{ marginBottom: '1rem' }}>
        <h3 style={{ marginBottom: 10 }}>Your Mentor Status</h3>
        {profile ? (
          <div className="info-row">
            <span className="info-label">Verification:</span>
            <span className="info-value"><span className="badge badge-primary">{profile.verification_status}</span></span>
          </div>
        ) : (
          <p style={{ margin: 0, color: 'var(--text-light)' }}>You have not applied as mentor yet.</p>
        )}
      </div>

      <div className="card" style={{ marginBottom: '1.2rem' }}>
        <h3 style={{ marginBottom: 12 }}>{profile ? 'Update Mentor Profile' : 'Apply as Mentor'}</h3>
        {msg.ok && <div className="settings-msg-ok">{msg.ok}</div>}
        {msg.err && <div className="settings-msg-err">{msg.err}</div>}
        <form onSubmit={applyMentor}>
          <div className="field">
            <label>Headline</label>
            <input value={form.headline} onChange={(e) => setForm((p) => ({ ...p, headline: e.target.value }))} placeholder="e.g. IIT JEE Mentor | Ex-IIT" required />
          </div>
          <div className="field">
            <label>Bio</label>
            <textarea rows={4} value={form.bio} onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))} placeholder="Brief mentorship background" required />
          </div>
          <div className="detail-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="field">
              <label>Expertise (comma-separated)</label>
              <input value={form.expertise} onChange={(e) => setForm((p) => ({ ...p, expertise: e.target.value }))} placeholder="JEE, NEET, Career Planning" />
            </div>
            <div className="field">
              <label>Languages (comma-separated)</label>
              <input value={form.languages} onChange={(e) => setForm((p) => ({ ...p, languages: e.target.value }))} placeholder="English, Hindi, Telugu" />
            </div>
          </div>
          <div className="detail-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="field">
              <label>Experience (years)</label>
              <input type="number" min="0" value={form.experience_years} onChange={(e) => setForm((p) => ({ ...p, experience_years: e.target.value }))} />
            </div>
            <div className="field" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 28 }}>
              <input id="mentor_accepting" type="checkbox" checked={!!form.is_accepting} onChange={(e) => setForm((p) => ({ ...p, is_accepting: e.target.checked }))} />
              <label htmlFor="mentor_accepting" style={{ margin: 0 }}>Accept new requests</label>
            </div>
          </div>
          <button className="btn-save" type="submit">Submit</button>
        </form>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: 12 }}>Incoming Requests</h3>
        {requests.length === 0 ? (
          <p style={{ margin: 0, color: 'var(--text-light)' }}>No mentorship requests yet.</p>
        ) : (
          <div style={{ display: 'grid', gap: 10 }}>
            {requests.map((r) => (
              <div key={r.id} style={{ padding: 12, border: '1px solid var(--border)', borderRadius: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
                  <strong>{r.mentee_name}</strong>
                  <span className="badge badge-info">{r.status}</span>
                </div>
                <p style={{ margin: '8px 0 6px' }}><strong>Topic:</strong> {r.topic}</p>
                <p style={{ margin: 0, color: 'var(--text-light)', fontSize: '0.88rem' }}>{r.message}</p>
                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  <button className="filter-btn" onClick={() => updateRequestStatus(r.id, 'accepted')}>Accept</button>
                  <button className="filter-btn clear" onClick={() => updateRequestStatus(r.id, 'rejected')}>Reject</button>
                  <button className="filter-btn" style={{ background: 'var(--success)' }} onClick={() => updateRequestStatus(r.id, 'completed')}>Mark Completed</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
