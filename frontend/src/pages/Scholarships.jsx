import { useState, useMemo } from 'react'
import scholarships from '../data/scholarships'

const types = ['Central Government', 'State Government', 'Private/Corporate', 'International']

export default function Scholarships() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [page, setPage] = useState(1)
  const [expanded, setExpanded] = useState({})
  const PER_PAGE = 15

  const toggle = (id) => setExpanded(p => ({ ...p, [id]: !p[id] }))

  const filtered = useMemo(() => {
    return scholarships.filter(s => {
      const matchType = !typeFilter || s.type === typeFilter
      const q = search.toLowerCase()
      const matchSearch = !q || s.name.toLowerCase().includes(q) ||
        s.provider.toLowerCase().includes(q) ||
        s.eligibility.toLowerCase().includes(q) ||
        (s.courses && s.courses.join(' ').toLowerCase().includes(q))
      return matchType && matchSearch
    })
  }, [search, typeFilter])

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const typeBadge = (type) => {
    if (type === 'Central Government') return 'badge badge-primary'
    if (type === 'State Government') return 'badge badge-success'
    if (type === 'International') return 'badge badge-purple'
    return 'badge badge-warning'
  }

  return (
    <div>
      <div className="section-header">
        <h1>Scholarships for Indian Students</h1>
        <p>Comprehensive database of Central Government, State Government, Private/Corporate, and International scholarships — {scholarships.length}+ entries. Filter by type or search by name, provider, or course.</p>
      </div>

      <div className="card" style={{ background: '#fff8e1', borderLeft: '4px solid #f9a825', marginBottom: '1.5rem' }}>
        <p style={{ margin: 0, fontSize: '0.92rem', lineHeight: 1.6 }}>
          <strong>Disclaimer:</strong> Scholarship amounts, eligibility criteria, and application deadlines change annually. Always verify from the official scholarship portal before applying. For government scholarships, the <strong>National Scholarship Portal (scholarships.gov.in)</strong> is the primary source.
        </p>
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <input type="text" placeholder="Search by name, provider, course, eligibility..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); setExpanded({}) }} />
        </div>
        <div className="filter-group">
          <label>Type</label>
          <select className="filter-select" value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setPage(1); setExpanded({}) }}>
            <option value="">All Types</option>
            {types.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        {(search || typeFilter) && (
          <button className="filter-btn clear" onClick={() => { setSearch(''); setTypeFilter(''); setPage(1); setExpanded({}) }}>Clear</button>
        )}
      </div>

      <div className="results-count">Showing <strong>{paginated.length}</strong> of <strong>{filtered.length}</strong> scholarships</div>

      <div className="card-grid">
        {paginated.map(s => {
          const isOpen = expanded[s.id]
          return (
            <div key={s.id} className={`card${isOpen ? ' acc-open' : ''}`}>
              <div className="acc-header" onClick={() => toggle(s.id)}>
                <div className="acc-header-info">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                    <h3 style={{ flex: 1 }}>{s.name}</h3>
                    <span style={{ fontWeight: 700, color: 'var(--success)', fontSize: '0.86rem', whiteSpace: 'nowrap' }}>{s.amount}</span>
                  </div>
                  <div className="acc-badges">
                    <span className={typeBadge(s.type)}>{s.type}</span>
                  </div>
                  <p className="acc-subtitle" style={{ marginTop: 4 }}>{s.provider}</p>
                </div>
                <span className="acc-chevron">{isOpen ? '−' : '+'}</span>
              </div>

              {isOpen && (
                <div className="acc-body">
                  <div className="info-row">
                    <span className="acc-detail-label">Eligibility:</span>
                    <span className="acc-detail-value">{s.eligibility}</span>
                  </div>
                  {s.courses && s.courses.length > 0 && (
                    <div className="info-row">
                      <span className="acc-detail-label">Courses:</span>
                      <span className="acc-detail-value" style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {s.courses.map(c => <span key={c} className="badge badge-info">{c}</span>)}
                      </span>
                    </div>
                  )}
                  <div className="info-row">
                    <span className="acc-detail-label">Apply By:</span>
                    <span className="acc-detail-value">{s.period}</span>
                  </div>
                  {s.highlights && <div className="acc-highlight">{s.highlights}</div>}
                  {s.website && (
                    <div style={{ marginTop: 12 }}>
                      <a href={s.website} target="_blank" rel="noopener noreferrer" className="filter-btn" style={{ fontSize: '0.82rem', textDecoration: 'none' }}>Apply / Know More</a>
                    </div>
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

      <div className="card" style={{ marginTop: '1.5rem', background: '#fff8e1', borderLeft: '4px solid #f9a825' }}>
        <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>
          We tried our best to gather all information, but there might be some deviations. Kindly check with official scholarship portals before applying.
          {' '}<strong>Key Portal:</strong> <a href="https://scholarships.gov.in" target="_blank" rel="noopener noreferrer">National Scholarship Portal (scholarships.gov.in)</a>
        </p>
      </div>
    </div>
  )
}
