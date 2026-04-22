import { useState, useMemo } from 'react'
import internships from '../data/internships'

const PER_PAGE = 15

export default function Internships() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState({})
  const [page, setPage] = useState(1)

  const totalAll = internships.reduce((s, c) => s + c.entries.length, 0)

  const toggle = (key) => setExpanded(p => ({ ...p, [key]: !p[key] }))

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    const cats = selectedCategory === 'all' ? internships : internships.filter(c => c.id === selectedCategory)
    return cats.map(cat => ({
      ...cat,
      entries: cat.entries.filter(e =>
        !q || e.name.toLowerCase().includes(q) || e.org.toLowerCase().includes(q) ||
        e.eligibility.toLowerCase().includes(q) || (e.highlights && e.highlights.toLowerCase().includes(q))
      )
    })).filter(cat => cat.entries.length > 0)
  }, [search, selectedCategory])

  // Flatten all entries for pagination
  const allEntries = useMemo(() => {
    const result = []
    filtered.forEach(cat => {
      cat.entries.forEach((entry, i) => {
        result.push({ ...entry, _catId: cat.id, _catIcon: cat.icon, _catName: cat.category, _catDesc: cat.description, _key: `${cat.id}_${i}` })
      })
    })
    return result
  }, [filtered])

  const totalEntries = allEntries.length
  const totalPages = Math.ceil(totalEntries / PER_PAGE)
  const paginated = allEntries.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  // Reset page when filters change
  const updateCategory = (cat) => { setSelectedCategory(cat); setPage(1); setExpanded({}) }
  const updateSearch = (val) => { setSearch(val); setPage(1); setExpanded({}) }

  return (
    <div>
      <div className="section-header">
        <h1>Internship Opportunities for Indian Students</h1>
        <p>Discover government, research, corporate, international, and NGO internships — {totalAll}+ opportunities listed. Filter by category or search by name, organization, or eligibility.</p>
      </div>

      <div className="card" style={{ background: '#fff8e1', borderLeft: '4px solid #f9a825', marginBottom: '1.5rem' }}>
        <p style={{ margin: 0, fontSize: '0.92rem', lineHeight: 1.6 }}>
          <strong>Disclaimer:</strong> Internship availability, stipend amounts, eligibility criteria, and application deadlines change frequently. Always verify from the official organization website before applying.
        </p>
      </div>

      <div className="filters-bar" style={{ flexWrap: 'wrap', marginBottom: '1rem' }}>
        <button className={`filter-btn${selectedCategory === 'all' ? ' active' : ''}`} onClick={() => updateCategory('all')}>All Categories</button>
        {internships.map(cat => (
          <button key={cat.id} className={`filter-btn${selectedCategory === cat.id ? ' active' : ''}`} onClick={() => updateCategory(cat.id)}>
            {cat.icon || ''} {cat.category}
          </button>
        ))}
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <input type="text" placeholder="Search internships, organizations, eligibility..." value={search} onChange={e => updateSearch(e.target.value)} />
        </div>
        {search && <button className="filter-btn clear" onClick={() => updateSearch('')}>Clear</button>}
      </div>

      <div className="results-count">Showing <strong>{paginated.length}</strong> of <strong>{totalEntries}</strong> internship(s)</div>

      <div className="card-grid">
        {paginated.map(entry => {
          const isOpen = expanded[entry._key]
          return (
            <div key={entry._key} className={`card${isOpen ? ' acc-open' : ''}`}>
              <div className="acc-header" onClick={() => toggle(entry._key)}>
                <div className="acc-header-info">
                  <h3>{entry.name}</h3>
                  <p>{entry.org}</p>
                  <div className="acc-badges">
                    <span className="badge badge-primary">{entry.duration}</span>
                    {entry.stipend && <span className="badge badge-success">{entry.stipend}</span>}
                    {entry.period && <span className="badge badge-warning">{entry.period}</span>}
                  </div>
                </div>
                <span className="acc-chevron">{isOpen ? '−' : '+'}</span>
              </div>

              {isOpen && (
                <div className="acc-body">
                  <div className="info-row">
                    <span className="acc-detail-label">Eligibility:</span>
                    <span className="acc-detail-value">{entry.eligibility}</span>
                  </div>
                  {entry.highlights && <div className="acc-highlight">{entry.highlights}</div>}
                  {entry.website && (
                    <div className="acc-footer">
                      <a href={entry.website} target="_blank" rel="noopener noreferrer" className="filter-btn" style={{ fontSize: '0.82rem', textDecoration: 'none' }}>Apply / Know More</a>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {totalEntries === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-light)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🔍</div>
          <h3 style={{ margin: '0 0 8px' }}>No internships found</h3>
          <p style={{ margin: 0 }}>Try a different search term or category.</p>
        </div>
      )}

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
          We tried our best to gather all information, but there might be some deviations. Kindly check with the respective organizations for the most accurate and current information before applying.
        </p>
      </div>
    </div>
  )
}
