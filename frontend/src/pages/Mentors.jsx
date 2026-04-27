import { useEffect, useMemo, useState } from 'react'
import { api } from '../utils/api'
import { useAuth } from '../context/AuthContext'

export default function Mentors() {
  const { token } = useAuth()
  const [query, setQuery] = useState('')
  const [expertise, setExpertise] = useState('')
  const [mentors, setMentors] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMentor, setSelectedMentor] = useState(null)
  const [requestForm, setRequestForm] = useState({ topic: '', message: '', preferred_mode: 'chat', scheduled_at: '' })
  const [reqMsg, setReqMsg] = useState({ ok: '', err: '' })

  const loadMentors = async () => {
    setLoading(true)
    const q = new URLSearchParams()
    if (query.trim()) q.set('q', query.trim())
    if (expertise.trim()) q.set('expertise', expertise.trim())
    const res = await api.get(`/api/mentors${q.toString() ? `?${q.toString()}` : ''}`, token)
    setLoading(false)
    if (!res.error) setMentors(res.mentors || [])
  }

  useEffect(() => { loadMentors() }, [])

  const expertiseOptions = useMemo(() => {
    const set = new Set()
    mentors.forEach((m) => (m.expertise || []).forEach((e) => set.add(e)))
    return Array.from(set).sort()
  }, [mentors])

  const submitRequest = async (e) => {
    e.preventDefault()
    setReqMsg({ ok: '', err: '' })
    if (!selectedMentor) return
    if (!requestForm.topic.trim() || !requestForm.message.trim()) {
      setReqMsg({ ok: '', err: 'Topic and message are required' })
      return
    }
    const payload = {
      mentor_user_id: selectedMentor.user_id,
      topic: requestForm.topic.trim(),
      message: requestForm.message.trim(),
      preferred_mode: requestForm.preferred_mode,
      scheduled_at: requestForm.scheduled_at || null,
    }
    const res = await api.post('/api/mentorship-requests', payload, token)
    if (res.error) {
      setReqMsg({ ok: '', err: res.error })
      return
    }
    setReqMsg({ ok: 'Mentorship request sent successfully', err: '' })
    setRequestForm({ topic: '', message: '', preferred_mode: 'chat', scheduled_at: '' })
    setTimeout(() => setSelectedMentor(null), 1200)
  }

  return (
    <div>
      <div className="section-header">
        <h1>Find Mentors</h1>
        <p>Browse verified mentors, review their expertise, and request guidance sessions.</p>
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by mentor headline or bio"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label>Expertise</label>
          <select className="filter-select" value={expertise} onChange={(e) => setExpertise(e.target.value)}>
            <option value="">All</option>
            {expertiseOptions.map((e) => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>
        <button className="filter-btn" onClick={loadMentors}>Apply</button>
      </div>

      {loading && <div className="card">Loading mentors...</div>}

      {!loading && (
        <>
          <div className="results-count">Showing <strong>{mentors.length}</strong> mentor(s)</div>
          <div className="card-grid">
            {mentors.map((m) => (
              <div key={m.user_id} className="card">
                <h3 style={{ marginBottom: 6 }}>{m.name}</h3>
                <p style={{ marginBottom: 8, color: 'var(--text-secondary)' }}>{m.headline}</p>
                <p style={{ fontSize: '0.88rem', marginBottom: 10 }}>{m.bio}</p>
                <div className="info-row"><span className="info-label">Experience:</span><span className="info-value">{m.experience_years} years</span></div>
                <div className="info-row"><span className="info-label">Status:</span><span className="info-value"><span className="badge badge-success">{m.verification_status}</span></span></div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', margin: '8px 0 10px' }}>
                  {(m.expertise || []).slice(0, 6).map((e) => <span key={e} className="badge badge-primary">{e}</span>)}
                </div>
                <button className="filter-btn" onClick={() => { setSelectedMentor(m); setReqMsg({ ok: '', err: '' }) }}>Request Mentorship</button>
              </div>
            ))}
          </div>
          {mentors.length === 0 && <div className="card" style={{ textAlign: 'center' }}>No mentors found. Try changing filters.</div>}
        </>
      )}

      {selectedMentor && (
        <div className="settings-overlay" onClick={(e) => { if (e.target === e.currentTarget) setSelectedMentor(null) }}>
          <div className="settings-modal">
            <div className="settings-modal-header">
              <h2>Request Mentorship</h2>
              <button className="settings-modal-close" onClick={() => setSelectedMentor(null)}>&times;</button>
            </div>
            <div className="settings-modal-body">
              <p style={{ marginBottom: 12 }}><strong>Mentor:</strong> {selectedMentor.name}</p>
              {reqMsg.ok && <div className="settings-msg-ok">{reqMsg.ok}</div>}
              {reqMsg.err && <div className="settings-msg-err">{reqMsg.err}</div>}
              <form onSubmit={submitRequest}>
                <div className="field">
                  <label>Topic</label>
                  <input value={requestForm.topic} onChange={(e) => setRequestForm((p) => ({ ...p, topic: e.target.value }))} placeholder="e.g. IIT preparation strategy" required />
                </div>
                <div className="field">
                  <label>Message</label>
                  <textarea value={requestForm.message} onChange={(e) => setRequestForm((p) => ({ ...p, message: e.target.value }))} placeholder="Briefly explain what guidance you need" rows={4} required />
                </div>
                <div className="field">
                  <label>Preferred Mode</label>
                  <select value={requestForm.preferred_mode} onChange={(e) => setRequestForm((p) => ({ ...p, preferred_mode: e.target.value }))}>
                    <option value="chat">Chat</option>
                    <option value="call">Call</option>
                    <option value="video">Video</option>
                  </select>
                </div>
                <div className="field">
                  <label>Preferred Time (optional)</label>
                  <input type="datetime-local" value={requestForm.scheduled_at} onChange={(e) => setRequestForm((p) => ({ ...p, scheduled_at: e.target.value }))} />
                </div>
                <button type="submit" className="btn-save">Send Request</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
