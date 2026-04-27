import { useEffect, useState } from 'react'
import { api } from '../utils/api'
import { useAuth } from '../context/AuthContext'

export default function AdminMentorship() {
  const { token } = useAuth()
  const [status, setStatus] = useState('')
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const res = await api.get(`/api/admin/mentorship-requests${status ? `?status=${encodeURIComponent(status)}` : ''}`, token)
    setLoading(false)
    if (!res.error) setRequests(res.requests || [])
  }

  useEffect(() => { load() }, [status])

  const updateStatus = async (id, nextStatus) => {
    const res = await api.post(`/api/admin/mentorship-requests/${id}/status`, { status: nextStatus }, token)
    if (!res.error) {
      setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: nextStatus } : r)))
    }
  }

  return (
    <div>
      <div className="section-header">
        <h1>Admin - Mentorship Oversight</h1>
        <p>Monitor mentorship requests and update statuses when needed.</p>
      </div>

      <div className="filters-bar">
        <div className="filter-group">
          <label>Status</label>
          <select className="filter-select" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {loading && <div className="card">Loading mentorship requests...</div>}

      {!loading && (
        <>
          <div className="results-count">Showing <strong>{requests.length}</strong> request(s)</div>
          <div className="card-grid">
            {requests.map((r) => (
              <div key={r.id} className="card">
                <h3 style={{ marginBottom: 6 }}>{r.topic}</h3>
                <div className="info-row"><span className="info-label">Mentee:</span><span className="info-value">{r.mentee.name} ({r.mentee.email})</span></div>
                <div className="info-row"><span className="info-label">Mentor:</span><span className="info-value">{r.mentor.name} ({r.mentor.email})</span></div>
                <div className="info-row"><span className="info-label">Mode:</span><span className="info-value">{r.preferred_mode}</span></div>
                <div className="info-row"><span className="info-label">Status:</span><span className="info-value"><span className="badge badge-primary">{r.status}</span></span></div>
                {r.scheduled_at && <div className="info-row"><span className="info-label">Scheduled:</span><span className="info-value">{r.scheduled_at}</span></div>}
                <p style={{ fontSize: '0.88rem', marginTop: 8 }}>{r.message}</p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
                  <button className="filter-btn" onClick={() => updateStatus(r.id, 'accepted')}>Accept</button>
                  <button className="filter-btn clear" onClick={() => updateStatus(r.id, 'rejected')}>Reject</button>
                  <button className="filter-btn" style={{ background: 'var(--success)' }} onClick={() => updateStatus(r.id, 'completed')}>Complete</button>
                  <button className="filter-btn" style={{ background: '#64748b' }} onClick={() => updateStatus(r.id, 'cancelled')}>Cancel</button>
                </div>
              </div>
            ))}
          </div>
          {requests.length === 0 && <div className="card" style={{ textAlign: 'center' }}>No requests found.</div>}
        </>
      )}
    </div>
  )
}
