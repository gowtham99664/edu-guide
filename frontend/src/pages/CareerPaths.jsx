import { useState, useMemo } from 'react'
import { careerPaths } from '../data/careerPaths'

const ALL_STREAMS = [...new Set(careerPaths.flatMap(cp => cp.streams || []))]

export default function CareerPaths() {
  const [expanded, setExpanded] = useState(null)
  const [search, setSearch] = useState('')
  const [streamFilter, setStreamFilter] = useState('All')

  const filtered = useMemo(() => {
    return careerPaths.filter(cp => {
      const q = search.toLowerCase()
      const matchesSearch = !q ||
        cp.name.toLowerCase().includes(q) ||
        cp.streams?.some(s => s.toLowerCase().includes(q)) ||
        cp.examsToWrite?.some(e => e.toLowerCase().includes(q))
      const matchesStream = streamFilter === 'All' ||
        cp.streams?.includes(streamFilter)
      return matchesSearch && matchesStream
    })
  }, [search, streamFilter])

  const toggle = (id) => setExpanded(prev => prev === id ? null : id)

  return (
    <div>
      <div className="section-header">
        <h1>Career Paths & Education Roadmaps</h1>
        <p>Explore {careerPaths.length}+ career streams — what to study, which exams to write, where to apply, and what to expect.</p>
      </div>

      <div className="pg-toolbar">
        <div className="pg-search-wrap">
          <span className="pg-search-icon">🔍</span>
          <input
            className="pg-search-input"
            type="text"
            placeholder="Search career paths, streams, or exams..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && <button className="pg-search-clear" onClick={() => setSearch('')}>✕</button>}
        </div>
        <div className="pg-pills">
          <button
            className={`pg-pill${streamFilter === 'All' ? ' pg-pill-active' : ''}`}
            onClick={() => setStreamFilter('All')}
          >All</button>
          {ALL_STREAMS.map(s => (
            <button
              key={s}
              className={`pg-pill${streamFilter === s ? ' pg-pill-active' : ''}`}
              onClick={() => setStreamFilter(s)}
            >{s}</button>
          ))}
        </div>
      </div>

      <div className="results-count">
        Showing <strong>{filtered.length}</strong> of <strong>{careerPaths.length}</strong> career paths
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <h3>No career paths found</h3>
          <p>Try adjusting your search or filter criteria.</p>
        </div>
      ) : (
        <div className="pg-acc-list">
          {filtered.map(cp => {
            const isOpen = expanded === cp.id
            return (
              <div key={cp.id} className={`card pg-acc-card${isOpen ? ' acc-open' : ''}`}>
                <div className="acc-header" onClick={() => toggle(cp.id)}>
                  <span className="pg-acc-icon">{cp.icon}</span>
                  <div className="acc-header-info">
                    <h3>{cp.name}</h3>
                    <div className="acc-badges">
                      {cp.streams?.map((s, i) => (
                        <span key={i} className="badge badge-info">{s}</span>
                      ))}
                      {cp.examsToWrite && (
                        <span className="badge badge-primary">{cp.examsToWrite.length} exams</span>
                      )}
                    </div>
                  </div>
                  <span className="acc-chevron">{isOpen ? '−' : '+'}</span>
                </div>

                {isOpen && (
                  <div className="acc-body">
                    {cp.afterClass10 && (
                      <div className="pg-meta-row">
                        <span className="pg-meta-tag"><strong>After Class 10:</strong> {cp.afterClass10}</span>
                      </div>
                    )}
                    {cp.avgSalary && (
                      <div className="pg-meta-row">
                        <span className="pg-meta-tag"><strong>Avg Salary:</strong> {cp.avgSalary}</span>
                        {cp.collegeTypes && <span className="pg-meta-tag"><strong>College Types:</strong> {cp.collegeTypes}</span>}
                      </div>
                    )}

                    <div className="pg-acc-section">
                      <h4 className="pg-acc-section-title">Exams to Write</h4>
                      <div className="pg-chip-wrap">
                        {cp.examsToWrite?.map((e, i) => (
                          <span key={i} className="badge badge-primary">{e}</span>
                        ))}
                      </div>
                    </div>

                    {cp.careerOptions && (
                      <div className="pg-acc-section">
                        <h4 className="pg-acc-section-title">Career Options</h4>
                        <div className="pg-chip-wrap">
                          {cp.careerOptions.map((c, i) => (
                            <span key={i} className="badge badge-success">{c}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {cp.furtherStudies && (
                      <div className="pg-acc-section">
                        <h4 className="pg-acc-section-title">Further Studies</h4>
                        <ul className="pg-acc-list-items">
                          {cp.furtherStudies.map((f, i) => <li key={i}>{f}</li>)}
                        </ul>
                      </div>
                    )}

                    {cp.prepTimeline && (
                      <div className="acc-note">
                        <strong>Preparation Tips:</strong> {cp.prepTimeline}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
