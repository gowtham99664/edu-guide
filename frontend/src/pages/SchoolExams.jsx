import { useState, useMemo } from 'react'
import schoolEntranceExams from '../data/schoolEntranceExams'

const PER_PAGE = 15
const ALL_CLASSES = [...new Set(schoolEntranceExams.map(e => e.forClass))].sort()
const ALL_FREQUENCIES = [...new Set(schoolEntranceExams.map(e => e.frequency).filter(Boolean))]

function getPaginationRange(current, total) {
  const delta = 2
  const range = []
  const left = Math.max(2, current - delta)
  const right = Math.min(total - 1, current + delta)
  range.push(1)
  if (left > 2) range.push('...')
  for (let i = left; i <= right; i++) range.push(i)
  if (right < total - 1) range.push('...')
  if (total > 1) range.push(total)
  return range
}

export default function SchoolExams() {
  const [expanded, setExpanded] = useState({})
  const [syllabusOpen, setSyllabusOpen] = useState({})
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [classFilter, setClassFilter] = useState('All')
  const [freqFilter, setFreqFilter] = useState('All')

  const toggle = (id) => setExpanded(p => ({ ...p, [id]: !p[id] }))
  const toggleSyllabus = (examId, key) => {
    const k = `${examId}-${key}`
    setSyllabusOpen(p => ({ ...p, [k]: !p[k] }))
  }

  const filtered = useMemo(() => {
    return schoolEntranceExams.filter(exam => {
      const q = search.toLowerCase()
      const matchesSearch = !q ||
        exam.name.toLowerCase().includes(q) ||
        exam.conductedBy?.toLowerCase().includes(q)
      const matchesClass = classFilter === 'All' || exam.forClass === classFilter
      const matchesFreq = freqFilter === 'All' || exam.frequency === freqFilter
      return matchesSearch && matchesClass && matchesFreq
    })
  }, [search, classFilter, freqFilter])

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const safePage = Math.min(page, totalPages || 1)
  const paginated = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE)

  const handlePageChange = (p) => {
    if (p >= 1 && p <= totalPages) setPage(p)
  }

  // Reset page when filters change
  const updateSearch = (v) => { setSearch(v); setPage(1) }
  const updateClass = (v) => { setClassFilter(v); setPage(1) }
  const updateFreq = (v) => { setFreqFilter(v); setPage(1) }

  return (
    <div>
      <div className="section-header">
        <h1>School-Level Entrance Exams & Special Schools</h1>
        <p>Entrance exams for Navodaya Vidyalaya, Sainik Schools, Military Schools, Residential Schools (AP/TS Gurukul), Olympiads, Scholarships (NTSE, NMMS), and more.</p>
      </div>

      <div className="pg-toolbar">
        <div className="pg-search-wrap">
          <span className="pg-search-icon">🔍</span>
          <input
            className="pg-search-input"
            type="text"
            placeholder="Search exams by name or conducting body..."
            value={search}
            onChange={e => updateSearch(e.target.value)}
          />
          {search && <button className="pg-search-clear" onClick={() => updateSearch('')}>✕</button>}
        </div>
        <div className="pg-filter-row">
          <div className="pg-pills">
            <span className="pg-pill-label">Class:</span>
            <button className={`pg-pill${classFilter === 'All' ? ' pg-pill-active' : ''}`} onClick={() => updateClass('All')}>All</button>
            {ALL_CLASSES.map(c => (
              <button key={c} className={`pg-pill${classFilter === c ? ' pg-pill-active' : ''}`} onClick={() => updateClass(c)}>{c}</button>
            ))}
          </div>
          <div className="pg-pills">
            <span className="pg-pill-label">Frequency:</span>
            <button className={`pg-pill${freqFilter === 'All' ? ' pg-pill-active' : ''}`} onClick={() => updateFreq('All')}>All</button>
            {ALL_FREQUENCIES.map(f => (
              <button key={f} className={`pg-pill${freqFilter === f ? ' pg-pill-active' : ''}`} onClick={() => updateFreq(f)}>{f}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="results-count">
        Showing <strong>{paginated.length}</strong> of <strong>{filtered.length}</strong> exams
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <h3>No exams found</h3>
          <p>Try adjusting your search or filter criteria.</p>
        </div>
      ) : (
        <div className="pg-acc-list">
          {paginated.map(exam => {
            const isOpen = expanded[exam.id]
            return (
              <div key={exam.id} className={`card pg-acc-card${isOpen ? ' acc-open' : ''}`}>
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
                    {/* Inline metadata row */}
                    <div className="pg-meta-row">
                      {exam.eligibility && <span className="pg-meta-tag"><strong>Eligibility:</strong> {exam.eligibility}</span>}
                      {exam.frequency && <span className="pg-meta-tag"><strong>Frequency:</strong> {exam.frequency}</span>}
                      {exam.examPattern && <span className="pg-meta-tag"><strong>Pattern:</strong> {exam.examPattern}</span>}
                      {exam.statesCovered && <span className="pg-meta-tag"><strong>States:</strong> {exam.statesCovered}</span>}
                    </div>

                    {exam.syllabus && (
                      <div className="pg-acc-section">
                        <h4 className="pg-acc-section-title">Syllabus Highlights</h4>
                        {Object.entries(exam.syllabus).map(([key, val]) => {
                          const syllKey = `${exam.id}-${key}`
                          const isSubOpen = syllabusOpen[syllKey]
                          return (
                            <div key={key} className="pg-syllabus-item">
                              <button className="pg-syllabus-toggle" onClick={() => toggleSyllabus(exam.id, key)}>
                                <span className="pg-syllabus-name">
                                  {key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')}
                                </span>
                                <span className="acc-chevron pg-syllabus-chevron">{isSubOpen ? '−' : '+'}</span>
                              </button>
                              {isSubOpen && Array.isArray(val) && (
                                <ul className="pg-acc-list-items pg-syllabus-topics">
                                  {val.map((v, i) => <li key={i}>{v}</li>)}
                                </ul>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}

                    <div className="pg-meta-row">
                      {exam.schools && <span className="pg-meta-tag"><strong>Schools:</strong> {exam.schools}</span>}
                      {exam.applicationPeriod && <span className="pg-meta-tag"><strong>Apply:</strong> {exam.applicationPeriod}</span>}
                      {exam.examMonth && <span className="pg-meta-tag"><strong>Exam:</strong> {exam.examMonth}</span>}
                    </div>

                    {exam.scholarship && (
                      <div className="pg-scholarship-highlight">
                        <span className="acc-detail-label">Scholarship:</span>
                        <span className="acc-detail-value">{exam.scholarship}</span>
                      </div>
                    )}

                    {exam.website && (
                      <a href={exam.website} target="_blank" rel="noopener noreferrer" className="acc-link">Official Website →</a>
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
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={safePage === 1} onClick={() => handlePageChange(safePage - 1)}>« Prev</button>
          {getPaginationRange(safePage, totalPages).map((p, i) =>
            p === '...' ? (
              <span key={`ellipsis-${i}`} className="pg-pagination-ellipsis">…</span>
            ) : (
              <button key={p} className={safePage === p ? 'active' : ''} onClick={() => handlePageChange(p)}>{p}</button>
            )
          )}
          <button disabled={safePage === totalPages} onClick={() => handlePageChange(safePage + 1)}>Next »</button>
        </div>
      )}
    </div>
  )
}
