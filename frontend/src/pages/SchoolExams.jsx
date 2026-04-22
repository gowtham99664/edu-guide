import { useState } from 'react'
import { Link } from 'react-router-dom'
import schoolEntranceExams from '../data/schoolEntranceExams'

const PER_PAGE = 15

export default function SchoolExams() {
  const [expanded, setExpanded] = useState({})
  const [page, setPage] = useState(1)

  const toggle = (id) => setExpanded(p => ({ ...p, [id]: !p[id] }))

  const totalPages = Math.ceil(schoolEntranceExams.length / PER_PAGE)
  const paginated = schoolEntranceExams.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return (
    <div>
      <div className="section-header">
        <h1>School-Level Entrance Exams & Special Schools</h1>
        <p>Entrance exams for Navodaya Vidyalaya, Sainik Schools, Military Schools, Residential Schools (AP/TS Gurukul), Olympiads, Scholarships (NTSE, NMMS), and more.</p>
      </div>

      <div className="results-count">Showing <strong>{paginated.length}</strong> of <strong>{schoolEntranceExams.length}</strong> exams</div>

      <div className="card-grid">
        {paginated.map(exam => {
          const isOpen = expanded[exam.id]
          return (
            <div key={exam.id} className={`card exam-card${isOpen ? ' acc-open' : ''}`}>
              <div className="acc-header" onClick={() => toggle(exam.id)}>
                <div className="acc-header-info">
                  <h3>{exam.name}</h3>
                  <p>{exam.conductedBy}</p>
                  <div className="acc-badges">
                    <span className="badge badge-primary">{exam.forClass}</span>
                    {exam.frequency && <span className="badge badge-success">{exam.frequency}</span>}
                    {exam.statesCovered && <span className="badge badge-info">{exam.statesCovered}</span>}
                  </div>
                </div>
                <span className="acc-chevron">{isOpen ? '−' : '+'}</span>
              </div>

              {isOpen && (
                <div className="acc-body">
                  {exam.eligibility && (
                    <div className="info-row">
                      <span className="acc-detail-label">Eligibility:</span>
                      <span className="acc-detail-value">{exam.eligibility}</span>
                    </div>
                  )}

                  {exam.examPattern && (
                    <div className="info-row">
                      <span className="acc-detail-label">Exam Pattern:</span>
                      <span className="acc-detail-value">{exam.examPattern}</span>
                    </div>
                  )}

                  {exam.syllabus && (
                    <div style={{marginTop: 8}}>
                      <span className="acc-detail-label">Syllabus Highlights:</span>
                      {Object.entries(exam.syllabus).map(([key, val]) => (
                        <div key={key} style={{marginBottom: 6, marginLeft: 4}}>
                          <strong style={{fontSize: '0.82rem', textTransform: 'capitalize'}}>{key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')}:</strong>
                          {Array.isArray(val) && (
                            <ul style={{paddingLeft: 16, fontSize: '0.82rem', margin: '2px 0'}}>
                              {val.slice(0, 4).map((v, i) => <li key={i}>{v}</li>)}
                              {val.length > 4 && <li>+{val.length - 4} more topics...</li>}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {exam.schools && (
                    <div className="info-row">
                      <span className="acc-detail-label">Schools:</span>
                      <span className="acc-detail-value">{exam.schools}</span>
                    </div>
                  )}

                  {exam.scholarship && (
                    <div className="info-row">
                      <span className="acc-detail-label">Scholarship:</span>
                      <span className="acc-detail-value" style={{color: 'var(--success)'}}>{exam.scholarship}</span>
                    </div>
                  )}

                  {exam.applicationPeriod && (
                    <div className="info-row">
                      <span className="acc-detail-label">Application:</span>
                      <span className="acc-detail-value">{exam.applicationPeriod} | <strong>Exam:</strong> {exam.examMonth}</span>
                    </div>
                  )}

                  {exam.website && (
                    <a href={exam.website} target="_blank" rel="noopener noreferrer" className="acc-link">Official Website &rarr;</a>
                  )}

                  {exam.importantNotes && (
                    <div className="acc-note">{exam.importantNotes}</div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>&laquo; Prev</button>
          {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
            const p = page <= 5 ? i + 1 : page + i - 4
            if (p > totalPages || p < 1) return null
            return <button key={p} className={page === p ? 'active' : ''} onClick={() => setPage(p)}>{p}</button>
          })}
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next &raquo;</button>
        </div>
      )}
    </div>
  )
}
