import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import engineeringExams from '../data/engineeringExams'
import { medicalExams, lawExams, managementExams, defenceExams, civilServicesExams } from '../data/otherExams'
import { designExams, architectureExams, agricultureExams, teachingExams, professionalExams, bankingExams, sscExams, railwayExams, researchExams } from '../data/moreExams'

const allExams = [
  ...engineeringExams, ...medicalExams, ...lawExams, ...managementExams,
  ...defenceExams, ...civilServicesExams, ...designExams, ...architectureExams,
  ...agricultureExams, ...teachingExams, ...professionalExams, ...bankingExams,
  ...sscExams, ...railwayExams, ...researchExams
]

const categories = [...new Set(allExams.map(e => e.category))].sort()
const levels = [...new Set(allExams.map(e => e.level).filter(Boolean))].sort()
const PER_PAGE = 15

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

export default function EntranceExams() {
  const [expanded, setExpanded] = useState(null)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [level, setLevel] = useState('All')
  const [page, setPage] = useState(1)

  const toggle = (id) => setExpanded(prev => prev === id ? null : id)
  const updateSearch = (v) => { setSearch(v); setPage(1) }
  const updateCategory = (v) => { setCategory(v); setPage(1) }
  const updateLevel = (v) => { setLevel(v); setPage(1) }

  const filtered = useMemo(() => {
    return allExams.filter(e => {
      const q = search.toLowerCase()
      const matchesSearch = !q ||
        e.name?.toLowerCase().includes(q) ||
        e.category?.toLowerCase().includes(q) ||
        e.conductedBy?.toLowerCase().includes(q) ||
        e.subcategory?.toLowerCase().includes(q)
      const matchesCat = category === 'All' || e.category === category
      const matchesLvl = level === 'All' || e.level === level
      return matchesSearch && matchesCat && matchesLvl
    })
  }, [search, category, level])

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const safePage = Math.min(page, totalPages || 1)
  const paginated = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE)

  const handlePageChange = (p) => {
    if (p >= 1 && p <= totalPages) setPage(p)
  }

  return (
    <div>
      <div className="section-header">
        <h1>Entrance Exams</h1>
        <p>Comprehensive database of {allExams.length}+ entrance exams across {categories.length} categories — Engineering, Medical, Law, Management, Defence, and more.</p>
      </div>

      <div className="pg-toolbar">
        <div className="pg-search-wrap">
          <span className="pg-search-icon-text">&#128269;</span>
          <input
            className="pg-search-input"
            type="text"
            placeholder="Search exams by name, category, conducting body..."
            value={search}
            onChange={e => updateSearch(e.target.value)}
          />
          {search && <button className="pg-search-clear" onClick={() => updateSearch('')}>&#10005;</button>}
        </div>
        <div className="pg-filter-row">
          <div className="pg-pills">
            <span className="pg-pill-label">Category:</span>
            <button className={`pg-pill${category === 'All' ? ' pg-pill-active' : ''}`} onClick={() => updateCategory('All')}>All</button>
            {categories.map(c => (
              <button key={c} className={`pg-pill${category === c ? ' pg-pill-active' : ''}`} onClick={() => updateCategory(c)}>{c}</button>
            ))}
          </div>
          <div className="pg-pills">
            <span className="pg-pill-label">Level:</span>
            <button className={`pg-pill${level === 'All' ? ' pg-pill-active' : ''}`} onClick={() => updateLevel('All')}>All</button>
            {levels.map(l => (
              <button key={l} className={`pg-pill${level === l ? ' pg-pill-active' : ''}`} onClick={() => updateLevel(l)}>{l}</button>
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
            const isOpen = expanded === exam.id
            return (
              <div key={exam.id} className={`card pg-acc-card${isOpen ? ' acc-open' : ''}`}>
                <div className="acc-header" onClick={() => toggle(exam.id)}>
                  <div className="acc-header-info">
                    <h3>{exam.name}</h3>
                    <p>{exam.conductedBy}</p>
                    <div className="acc-badges">
                      <span className="badge badge-primary">{exam.category}</span>
                      {exam.subcategory && <span className="badge badge-info">{exam.subcategory}</span>}
                      {exam.level && <span className="badge badge-purple">{exam.level}</span>}
                      {exam.frequency && <span className="badge badge-success">{exam.frequency}</span>}
                    </div>
                  </div>
                  <span className="acc-chevron">{isOpen ? '−' : '+'}</span>
                </div>

                {isOpen && (
                  <div className="acc-body">
                    {/* Inline metadata row */}
                    <div className="pg-meta-row">
                      {exam.eligibility && <span className="pg-meta-tag"><strong>Eligibility:</strong> {exam.eligibility}</span>}
                    </div>
                    <div className="pg-meta-row">
                      {exam.examMonth && <span className="pg-meta-tag"><strong>Exam:</strong> {exam.examMonth}</span>}
                      {exam.applicationPeriod && <span className="pg-meta-tag"><strong>Apply:</strong> {exam.applicationPeriod}</span>}
                      {exam.frequency && <span className="pg-meta-tag"><strong>Frequency:</strong> {exam.frequency}</span>}
                    </div>

                    {/* Exam Pattern summary */}
                    {exam.examPattern && (
                      <div className="pg-acc-section">
                        <h4 className="pg-acc-section-title">Exam Pattern</h4>
                        {exam.examPattern.papers && (
                          <div className="pg-meta-row pg-meta-row--wrap">
                            {exam.examPattern.papers.map((p, i) => (
                              <span key={i} className="pg-meta-tag">{p.name} — {p.marks} marks, {p.duration}</span>
                            ))}
                          </div>
                        )}
                        {exam.examPattern.marking && <p className="pg-acc-section-text"><strong>Marking:</strong> {exam.examPattern.marking}</p>}
                        {exam.examPattern.mode && <p className="pg-acc-section-text"><strong>Mode:</strong> {exam.examPattern.mode}</p>}
                      </div>
                    )}

                    {exam.acceptedBy && (
                      <div className="pg-acc-section">
                        <h4 className="pg-acc-section-title">Accepted By</h4>
                        <p className="pg-acc-section-text">{exam.acceptedBy}</p>
                      </div>
                    )}

                    <div className="pg-acc-actions">
                      <Link to={`/entrance-exams/${exam.id}`} className="btn btn-primary btn-sm">View Full Details</Link>
                      {exam.website && (
                        <a href={exam.website} target="_blank" rel="noopener noreferrer" className="acc-link">Official Website →</a>
                      )}
                    </div>

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
