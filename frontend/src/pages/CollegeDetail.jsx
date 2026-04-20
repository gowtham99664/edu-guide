import { useParams, Link } from 'react-router-dom'
import colleges from '../data/colleges'

export default function CollegeDetail() {
  const { id } = useParams()
  const c = colleges.find(col => col.id === id)
  if (!c) return <div className="card"><h2>College not found</h2><Link to="/colleges">&larr; Back</Link></div>

  return (
    <div>
      <Link to="/colleges" style={{display:'inline-block', marginBottom:16, fontWeight:600}}>&larr; Back to Colleges</Link>
      <div className="detail-header">
        <h1>{c.name}</h1>
        {c.shortName && c.shortName !== c.name && <p style={{opacity:0.8, marginTop:4}}>{c.shortName}</p>}
        <div className="meta">
          <span className="badge">{c.category}</span>
          <span className="badge">{c.type}</span>
          {c.naacGrade && <span className="badge">NAAC {c.naacGrade}</span>}
          {c.nirfRank && <span className="badge">NIRF #{c.nirfRank} ({c.nirfCategory})</span>}
        </div>
      </div>

      <div className="detail-grid">
        <div className="card detail-section">
          <h2>Overview</h2>
          {c.city && <div className="info-row"><span className="info-label">City:</span><span className="info-value">{c.city}</span></div>}
          {c.state && <div className="info-row"><span className="info-label">State:</span><span className="info-value">{c.state}</span></div>}
          {c.established && <div className="info-row"><span className="info-label">Established:</span><span className="info-value">{c.established}</span></div>}
          {c.type && <div className="info-row"><span className="info-label">Type:</span><span className="info-value">{c.type}</span></div>}
          {c.fees && <div className="info-row"><span className="info-label">Approx Fees:</span><span className="info-value">{c.fees}</span></div>}
          {c.website && <div className="info-row"><span className="info-label">Website:</span><span className="info-value"><a href={c.website} target="_blank" rel="noopener noreferrer">{c.website}</a></span></div>}
        </div>
        <div className="card detail-section">
          <h2>Admission</h2>
          {c.admission && <div className="info-row"><span className="info-label">Entrance Exams:</span><span className="info-value">{c.admission.join(', ')}</span></div>}
          {c.courses && <div className="info-row"><span className="info-label">Courses:</span><span className="info-value">{c.courses.join(', ')}</span></div>}
        </div>
      </div>

      {c.highlights && (
        <div className="card detail-section" style={{marginTop: 20, background: '#f0fdf4', borderColor: '#86efac'}}>
          <h2>Highlights</h2>
          <p style={{fontSize:'0.95rem', lineHeight:1.8}}>{c.highlights}</p>
        </div>
      )}
    </div>
  )
}
