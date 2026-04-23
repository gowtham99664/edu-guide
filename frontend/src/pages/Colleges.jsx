import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import colleges from '../data/colleges'

const allCategories = [...new Set(colleges.map(c => c.category))].sort()
const allStates = [...new Set(colleges.map(c => c.state).filter(Boolean))].sort()
const allTypes = [...new Set(colleges.map(c => c.type).filter(Boolean))].sort()

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

export default function Colleges() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [state, setState] = useState('')
  const [type, setType] = useState('')
  const [sortBy, setSortBy] = useState('rank')
  const [page, setPage] = useState(1)
  const perPage = 15

  const filtered = useMemo(() => {
    let result = colleges.filter(c => {
      if (category && c.category !== category) return false
      if (state && c.state !== state) return false
      if (type && c.type !== type) return false
      if (search) {
        const s = search.toLowerCase()
        return (c.name?.toLowerCase().includes(s) || c.shortName?.toLowerCase().includes(s) ||
                c.city?.toLowerCase().includes(s) || c.state?.toLowerCase().includes(s) ||
                c.category?.toLowerCase().includes(s) || c.admission?.some(a => a.toLowerCase().includes(s)))
      }
      return true
    })

    result.sort((a, b) => {
      if (sortBy === 'rank') {
        const ra = a.nirfRank || 999
        const rb = b.nirfRank || 999
        return ra - rb
      }
      if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '')
      if (sortBy === 'established') return (a.established || 9999) - (b.established || 9999)
      return 0
    })
    return result
  }, [search, category, state, type, sortBy])

  const totalPages = Math.ceil(filtered.length / perPage)
  const paged = filtered.slice((page - 1) * perPage, page * perPage)

  const uniqueStatesCount = new Set(colleges.map(c => c.state).filter(Boolean)).size

  return (
    <div>
      {/* Header */}
      <div className="section-header">
        <h1>Colleges & Universities</h1>
        <p>Explore {colleges.length}+ institutions with NIRF 2024 rankings, NAAC grades, and admission details.</p>
        <div className="pg-stats-row">
          <div className="pg-stat-pill">
            <span className="pg-stat-num">{colleges.length}</span>
            <span className="pg-stat-label">Total Colleges</span>
          </div>
          <div className="pg-stat-pill">
            <span className="pg-stat-num">{allCategories.length}</span>
            <span className="pg-stat-label">Categories</span>
          </div>
          <div className="pg-stat-pill">
            <span className="pg-stat-num">{uniqueStatesCount}</span>
            <span className="pg-stat-label">States</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="pg-filters-card">
        <div className="pg-search-row">
          <div className="search-box">
            <input type="text" placeholder="🔍 Search by name, city, state, entrance exam..." value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
          </div>
        </div>
        <div className="pg-filter-row">
          <div className="filter-group">
            <label>Category</label>
            <select className="filter-select" value={category} onChange={e => { setCategory(e.target.value); setPage(1) }}>
              <option value="">All Categories</option>
              {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="filter-group">
            <label>State</label>
            <select className="filter-select" value={state} onChange={e => { setState(e.target.value); setPage(1) }}>
              <option value="">All States</option>
              {allStates.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="filter-group">
            <label>Type</label>
            <select className="filter-select" value={type} onChange={e => { setType(e.target.value); setPage(1) }}>
              <option value="">All Types</option>
              {allTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="filter-group">
            <label>Sort By</label>
            <select className="filter-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="rank">NIRF Rank</option>
              <option value="name">Name (A-Z)</option>
              <option value="established">Established (Oldest)</option>
            </select>
          </div>
          <button className="filter-btn clear" onClick={() => { setSearch(''); setCategory(''); setState(''); setType(''); setSortBy('rank'); setPage(1) }}>Clear All</button>
        </div>
      </div>

      {/* Results count */}
      <div className="results-count">
        Showing <strong>{paged.length}</strong> of <strong>{filtered.length}</strong> colleges
        {(category || state || type || search) && <span className="pg-filter-active"> (filtered)</span>}
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="pg-empty-card">
          <div className="empty-state">
            <h3>No colleges found</h3>
            <p>Try adjusting your filters or search terms to find what you're looking for.</p>
            <button className="btn btn-primary btn-sm" onClick={() => { setSearch(''); setCategory(''); setState(''); setType(''); setSortBy('rank'); setPage(1) }}>Reset Filters</button>
          </div>
        </div>
      ) : (
        /* College cards */
        <div className="pg-college-list">
          {paged.map(c => (
            <div className="pg-college-card" key={c.id}>
              <div className="pg-college-rank">
                <span className={`pg-rank-num ${c.nirfRank && c.nirfRank <= 10 ? 'pg-rank-top' : ''}`}>
                  {c.nirfRank || '—'}
                </span>
                {c.nirfCategory && <span className="pg-rank-cat">{c.nirfCategory}</span>}
              </div>
              <div className="pg-college-body">
                <div className="pg-college-title">
                  <Link to={`/colleges/${c.id}`} className="pg-college-name">{c.name}</Link>
                  {c.city && <span className="pg-college-location">📍 {c.city}{c.state ? `, ${c.state}` : ''}</span>}
                </div>
                <div className="pg-college-badges">
                  <span className="badge badge-primary">{c.category}</span>
                  <span className={`badge ${c.type?.includes('Government') ? 'badge-green' : c.type?.includes('Private') ? 'badge-yellow' : 'badge-info'}`}>{c.type}</span>
                  {c.naacGrade && <span className="badge badge-purple">NAAC {c.naacGrade}</span>}
                </div>
                {c.admission && c.admission.length > 0 && (
                  <div className="pg-college-chips">
                    {c.admission.map(a => <span key={a} className="pg-chip">{a}</span>)}
                  </div>
                )}
              </div>
              <div className="pg-college-meta-right">
                {c.established && <span className="pg-meta-item">🏛 Est. {c.established}</span>}
                {c.website && <a href={c.website} target="_blank" rel="noopener noreferrer" className="pg-meta-link">🌐 Website</a>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(1)}>First</button>
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹ Prev</button>
          {getPaginationRange(page, totalPages).map((p, i) =>
            p === '...' ? (
              <span key={`e${i}`} className="pg-ellipsis">…</span>
            ) : (
              <button key={p} className={page === p ? 'active' : ''} onClick={() => setPage(p)}>{p}</button>
            )
          )}
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next ›</button>
          <button disabled={page === totalPages} onClick={() => setPage(totalPages)}>Last</button>
        </div>
      )}
    </div>
  )
}
