import { useState, useMemo } from 'react'
import internships from '../data/internships'

export default function Internships() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [search, setSearch] = useState('')

  const totalAll = internships.reduce((s, c) => s + c.entries.length, 0)

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

  const totalEntries = filtered.reduce((sum, c) => sum + c.entries.length, 0)

  return (
    <div>
      <div className="section-header">
        <h1>Internship Opportunities for Indian Students</h1>
        <p>Discover government, research, corporate, international, and NGO internships — {totalAll}+ opportunities listed. Filter by category or search by name, organization, or eligibility.</p>
      </div>

      {/* Disclaimer */}
      <div className="card" style={{ background: '#fff8e1', borderLeft: '4px solid #f9a825', marginBottom: '1.5rem' }}>
        <p style={{ margin: 0, fontSize: '0.92rem', lineHeight: 1.6 }}>
          <strong>Disclaimer:</strong> Internship availability, stipend amounts, eligibility criteria, and application deadlines change frequently. Always verify from the official organization website before applying. We have compiled this to the best of our knowledge, but there may be deviations.
        </p>
      </div>

      {/* Category filter pills */}
      <div className="filters-bar" style={{ flexWrap: 'wrap', marginBottom: '1rem' }}>
        <button
          className={`filter-btn${selectedCategory === 'all' ? ' active' : ''}`}
          onClick={() => { setSelectedCategory('all'); }}
        >
          All Categories
        </button>
        {internships.map(cat => (
          <button
            key={cat.id}
            className={`filter-btn${selectedCategory === cat.id ? ' active' : ''}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.icon || ''} {cat.category}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="filters-bar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search internships, organizations, eligibility..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {search && (
          <button className="filter-btn clear" onClick={() => setSearch('')}>Clear</button>
        )}
      </div>

      <div className="results-count">Showing <strong>{totalEntries}</strong> internship(s)</div>

      {/* Internship Listings */}
      {filtered.map(cat => (
        <div key={cat.id} style={{ marginBottom: '2rem' }}>
          <h2 style={{ borderBottom: '2px solid var(--primary-light)', paddingBottom: 8, marginBottom: '1rem', fontSize: '1.15rem' }}>
            {cat.icon} {cat.category}
          </h2>
          {cat.description && <p style={{ color: 'var(--text-light)', marginBottom: '1rem', fontSize: '0.9rem' }}>{cat.description}</p>}

          <div className="card-grid">
            {cat.entries.map((entry, i) => (
              <div key={i} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)', borderRadius: 'var(--radius) var(--radius) 0 0' }}>
                  <h3 style={{ margin: '0 0 2px', fontSize: '1rem', color: 'var(--primary-dark)' }}>{entry.name}</h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{entry.org}</div>
                </div>

                <div style={{ padding: '12px 16px', flex: 1 }}>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                    <span className="badge badge-primary">{entry.duration}</span>
                    {entry.stipend && <span className="badge badge-success">{entry.stipend}</span>}
                    {entry.period && <span className="badge badge-warning">{entry.period}</span>}
                  </div>
                  <div className="info-row">
                    <span className="info-label">Eligibility:</span>
                    <span className="info-value">{entry.eligibility}</span>
                  </div>
                  {entry.highlights && (
                    <div style={{ marginTop: 8, fontSize: '0.84rem', color: '#1e40af', background: '#eff6ff', padding: '6px 10px', borderRadius: 6 }}>
                      {entry.highlights}
                    </div>
                  )}
                </div>

                <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border)' }}>
                  <a href={entry.website} target="_blank" rel="noopener noreferrer" className="filter-btn" style={{ fontSize: '0.82rem', textDecoration: 'none' }}>Apply / Know More</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {totalEntries === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-light)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🔍</div>
          <h3 style={{ margin: '0 0 8px' }}>No internships found</h3>
          <p style={{ margin: 0 }}>Try a different search term or category.</p>
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
