import { useParams, Link } from 'react-router-dom'
import colleges from '../data/colleges'
import placements from '../data/placements'
import { useLanguage } from '../utils/i18n.jsx'

export default function CollegeDetail() {
  const { id } = useParams()
  const { t } = useLanguage()
  const c = colleges.find(col => col.id === id)
  const placementData = placements.find(p => p.collegeId === id)

  if (!c) {
    return (
      <div className="pg-notfound-card">
        <div className="empty-state">
          <h3>College Not Found</h3>
          <p>The college you're looking for doesn't exist or may have been removed.</p>
          <Link to="/colleges" className="btn btn-primary">Back to Colleges</Link>
        </div>
      </div>
    )
  }

  const maxSector = placementData ? Math.max(...Object.values(placementData.sectorWise)) : 0

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="pg-breadcrumb">
        <Link to="/">{t('nav.home')}</Link>
        <span className="pg-breadcrumb-sep">&rsaquo;</span>
        <Link to="/colleges">{t('nav.colleges')}</Link>
        <span className="pg-breadcrumb-sep">&rsaquo;</span>
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
          <h2>{t('college.overview')}</h2>
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
          <h2>{t('college.admission')}</h2>
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
          <h2>{t('college.highlights')}</h2>
          <p className="pg-highlights-text">{c.highlights}</p>
        </div>
      )}

      {/* Placements Section */}
      {placementData && (
        <div className="card detail-section" style={{ marginTop: 24 }}>
          <h2>{t('college.placements')} ({placementData.year})</h2>

          {placementData.note && (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: 16, fontStyle: 'italic' }}>{placementData.note}</p>
          )}

          {/* Stats Grid */}
          {placementData.stats.placementPercentage !== null && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 24 }}>
              {placementData.stats.studentsPlaced != null && (
                <div style={{ background: 'var(--bg-secondary, #f5f5f5)', borderRadius: 8, padding: '12px 16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--primary, #1a237e)' }}>{placementData.stats.studentsPlaced}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Students Placed</div>
                </div>
              )}
              {placementData.stats.placementPercentage != null && (
                <div style={{ background: 'var(--bg-secondary, #f5f5f5)', borderRadius: 8, padding: '12px 16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--primary, #1a237e)' }}>{placementData.stats.placementPercentage}%</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Placement Rate</div>
                </div>
              )}
              {placementData.stats.averagePackage && (
                <div style={{ background: 'var(--bg-secondary, #f5f5f5)', borderRadius: 8, padding: '12px 16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--primary, #1a237e)' }}>{placementData.stats.averagePackage}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Average Package</div>
                </div>
              )}
              {placementData.stats.medianPackage && (
                <div style={{ background: 'var(--bg-secondary, #f5f5f5)', borderRadius: 8, padding: '12px 16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--primary, #1a237e)' }}>{placementData.stats.medianPackage}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Median Package</div>
                </div>
              )}
              {placementData.stats.highestPackage && (
                <div style={{ background: 'var(--bg-secondary, #f5f5f5)', borderRadius: 8, padding: '12px 16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#d97706' }}>{placementData.stats.highestPackage}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Highest Package</div>
                </div>
              )}
              {placementData.stats.highestDomestic && (
                <div style={{ background: 'var(--bg-secondary, #f5f5f5)', borderRadius: 8, padding: '12px 16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#d97706' }}>{placementData.stats.highestDomestic}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Highest Domestic</div>
                </div>
              )}
            </div>
          )}

          {/* Top Recruiters */}
          {placementData.topRecruiters.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: '1rem', marginBottom: 10, color: 'var(--text-primary)' }}>{t('college.topRecruiters')}</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {placementData.topRecruiters.map(r => (
                  <span key={r} style={{ background: 'var(--bg-secondary, #f5f5f5)', border: '1px solid var(--border, #e0e0e0)', borderRadius: 6, padding: '4px 12px', fontSize: '0.84rem', color: 'var(--text-primary)' }}>{r}</span>
                ))}
              </div>
            </div>
          )}

          {/* Sector-wise Distribution */}
          {Object.keys(placementData.sectorWise).length > 0 && (
            <div>
              <h3 style={{ fontSize: '1rem', marginBottom: 10, color: 'var(--text-primary)' }}>{t('college.sectorWise')}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {Object.entries(placementData.sectorWise).map(([sector, pct]) => (
                  <div key={sector} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ minWidth: 180, fontSize: '0.84rem', color: 'var(--text-primary)' }}>{sector}</span>
                    <div style={{ flex: 1, background: 'var(--bg-secondary, #eee)', borderRadius: 4, height: 20, overflow: 'hidden' }}>
                      <div style={{ width: `${(pct / maxSector) * 100}%`, height: '100%', background: 'var(--primary, #1a237e)', borderRadius: 4, transition: 'width 0.3s' }} />
                    </div>
                    <span style={{ minWidth: 36, fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)', textAlign: 'right' }}>{pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
