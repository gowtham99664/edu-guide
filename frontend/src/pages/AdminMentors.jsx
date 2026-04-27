import { useEffect, useState } from 'react'
import { api } from '../utils/api'
import { useAuth } from '../context/AuthContext'

export default function AdminMentors() {
  const { token } = useAuth()
  const [status, setStatus] = useState('pending')
  const [query, setQuery] = useState('')
  const [mentors, setMentors] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (status) params.set('status', status)
    if (query.trim()) params.set('q', query.trim())
    const res = await api.get(`/api/admin/mentors?${params.toString()}`, token)
    setLoading(false)
    if (!res.error) setMentors(res.mentors || [])
  }

  useEffect(() => { load() }, [status])

  const review = async (mentorUserId, nextStatus, publish) => {
    const res = await api.post(`/api/admin/mentors/${mentorUserId}/review`, {
      status: nextStatus,
      published: publish,
    }, token)
    if (!res.error) load()
  }

  return (
    <div>
      <div className="section-header">
        <h1>Admin - Mentor Verification</h1>
        <p>Review mentor applications and approve/reject publication status.</p>
      </div>

      <div className="filters-bar">
        <div className="filter-group">
          <label>Status</label>
          <select className="filter-select" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="all">All</option>
          </select>
        </div>
        <div className="search-box">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by email/headline/bio" />
        </div>
        <button className="filter-btn" onClick={load}>Search</button>
      </div>

      {loading && <div className="card">Loading mentor applications...</div>}

      {!loading && (
        <>
          <div className="results-count">Showing <strong>{mentors.length}</strong> mentor application(s)</div>
          <div className="card-grid">
            {mentors.map((m) => (
              <div key={m.user_id} className="card">
                <h3 style={{ marginBottom: 6 }}>{m.name}</h3>
                <p style={{ margin: '0 0 6px', color: 'var(--text-light)', fontSize: '0.86rem' }}>{m.email}</p>
                <p style={{ marginBottom: 8, color: 'var(--text-secondary)' }}>{m.headline}</p>
                <p style={{ fontSize: '0.88rem', marginBottom: 10 }}>{m.bio}</p>
                <div className="info-row"><span className="info-label">Experience:</span><span className="info-value">{m.experience_years} years</span></div>
                <div className="info-row"><span className="info-label">Status:</span><span className="info-value"><span className="badge badge-primary">{m.verification_status}</span></span></div>
                <div className="info-row"><span className="info-label">Published:</span><span className="info-value"><span className={`badge ${m.published ? 'badge-success' : 'badge-warning'}`}>{m.published ? 'yes' : 'no'}</span></span></div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
                  <button className="filter-btn" onClick={() => review(m.user_id, 'approved', true)}>Approve</button>
                  <button className="filter-btn clear" onClick={() => review(m.user_id, 'rejected', false)}>Reject</button>
                  <button className="filter-btn" style={{ background: '#475569' }} onClick={() => review(m.user_id, 'pending', false)}>Mark Pending</button>
                </div>
              </div>
            ))}
          </div>
          {mentors.length === 0 && <div className="card" style={{ textAlign: 'center' }}>No mentor applications found.</div>}
        </>
      )}
    </div>
  )
}
