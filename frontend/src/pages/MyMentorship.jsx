import { useEffect, useState } from 'react'
import { api } from '../utils/api'
import { useAuth } from '../context/AuthContext'

export default function MyMentorship() {
  const { token } = useAuth()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const res = await api.get('/api/mentorship-requests/mine', token)
      setLoading(false)
      if (!res.error) setRequests(res.requests || [])
    }
    load()
  }, [])

  return (
    <div>
      <div className="section-header">
        <h1>My Mentorship Requests</h1>
        <p>Track the status of mentorship requests you have sent to mentors.</p>
      </div>

      {loading && <div className="card">Loading your requests...</div>}

      {!loading && requests.length === 0 && (
        <div className="card" style={{ textAlign: 'center' }}>
          <h3>No requests yet</h3>
          <p style={{ margin: 0, color: 'var(--text-light)' }}>Visit Find Mentors and send your first request.</p>
        </div>
      )}

      {!loading && requests.length > 0 && (
        <div className="card-grid">
          {requests.map((r) => (
            <div key={r.id} className="card">
              <h3 style={{ marginBottom: 6 }}>{r.mentor_name}</h3>
              {r.mentor_headline && <p style={{ marginBottom: 8, color: 'var(--text-secondary)' }}>{r.mentor_headline}</p>}
              <div className="info-row"><span className="info-label">Topic:</span><span className="info-value">{r.topic}</span></div>
              <div className="info-row"><span className="info-label">Mode:</span><span className="info-value">{r.preferred_mode}</span></div>
              <div className="info-row"><span className="info-label">Status:</span><span className="info-value"><span className="badge badge-primary">{r.status}</span></span></div>
              {r.scheduled_at && <div className="info-row"><span className="info-label">Preferred Time:</span><span className="info-value">{r.scheduled_at}</span></div>}
              <p style={{ fontSize: '0.88rem', marginTop: 8 }}>{r.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
