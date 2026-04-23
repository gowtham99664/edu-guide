import { useParams, Link } from 'react-router-dom'
import colleges from '../data/colleges'

export default function CollegeDetail() {
  const { id } = useParams()
  const c = colleges.find(col => col.id === id)

  if (!c) {
    return (
      <div className="pg-notfound-card">
        <div className="empty-state">
          <h3>🎓 College Not Found</h3>
          <p>The college you're looking for doesn't exist or may have been removed.</p>
          <Link to="/colleges" className="btn btn-primary">← Browse All Colleges</Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="pg-breadcrumb">
        <Link to="/">Home</Link>
        <span className="pg-breadcrumb-sep">›</span>
        <Link to="/colleges">Colleges</Link>
        <span className="pg-breadcrumb-sep">›</span>
        <span className="pg-breadcrumb-current">{c.shortName || c.name}</span>
      </nav>

      {/* Header card */}
      <div className="detail-header">
        <h1>{c.name}</h1>
        {c.shortName && c.shortName !== c.name && <p className="pg-header-short">{c.shortName}</p>}
        <div className="meta">
          <span className="badge pg-badge-cat">{c.category}</span>
          <span className={`badge ${c.type?.includes('Government') ? 'pg-badge-govt' : c.type?.includes('Private') ? 'pg-badge-private' : 'pg-badge-deemed'}`}>{c.type}</span>
          {c.naacGrade && <span className="badge pg-badge-naac">NAAC {c.naacGrade}</span>}
          {c.nirfRank && <span className="badge pg-badge-nirf">NIRF #{c.nirfRank} ({c.nirfCategory})</span>}
        </div>
      </div>

      {/* Two-column content */}
      <div className="detail-grid">
        {/* Left: Overview */}
        <div className="card detail-section">
          <h2>Overview</h2>
          {c.city && (
            <div className="info-row">
              <span className="info-label">City</span>
              <span className="info-value">{c.city}</span>
            </div>
          )}
          {c.state && (
            <div className="info-row">
              <span className="info-label">State</span>
              <span className="info-value">{c.state}</span>
            </div>
          )}
          {c.established && (
            <div className="info-row">
              <span className="info-label">Established</span>
              <span className="info-value">{c.established}</span>
            </div>
          )}
          {c.type && (
            <div className="info-row">
              <span className="info-label">Type</span>
              <span className="info-value">{c.type}</span>
            </div>
          )}
          {c.fees && (
            <div className="info-row">
              <span className="info-label">Approx Fees</span>
              <span className="info-value">{c.fees}</span>
            </div>
          )}
          {c.website && (
            <div className="info-row">
              <span className="info-label">Website</span>
              <span className="info-value">
                <a href={c.website} target="_blank" rel="noopener noreferrer">{c.website}</a>
              </span>
            </div>
          )}
        </div>

        {/* Right: Admission */}
        <div className="card detail-section">
          <h2>Admission</h2>
          {c.admission && c.admission.length > 0 && (
            <div className="pg-detail-field">
              <span className="pg-detail-label">Entrance Exams</span>
              <div className="pg-detail-badges">
                {c.admission.map(a => (
                  <Link key={a} to={`/entrance-exams?search=${encodeURIComponent(a)}`} className="pg-exam-badge">{a}</Link>
                ))}
              </div>
            </div>
          )}
          {c.courses && c.courses.length > 0 && (
            <div className="pg-detail-field">
              <span className="pg-detail-label">Courses Offered</span>
              <div className="pg-detail-badges">
                {c.courses.map(course => (
                  <span key={course} className="pg-course-chip">{course}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Highlights */}
      {c.highlights && (
        <div className="pg-highlights-card">
          <h2>✨ Highlights</h2>
          <p className="pg-highlights-text">{c.highlights}</p>
        </div>
      )}
    </div>
  )
}
