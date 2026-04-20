import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import colleges from '../data/colleges'

const allCategories = [...new Set(colleges.map(c => c.category))].sort()
const allStates = [...new Set(colleges.map(c => c.state).filter(Boolean))].sort()
const allTypes = [...new Set(colleges.map(c => c.type).filter(Boolean))].sort()

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

  return (
    <div>
      <div className="section-header">
        <h1>Colleges & Universities</h1>
        <p>{colleges.length}+ institutions with NIRF 2024 rankings, NAAC grades, admission details. Filter by state, type, category, or ranking.</p>
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <input type="text" placeholder="Search by name, city, state, entrance exam..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <div className="filter-group">
          <label>Category</label>
          <select className="filter-select" value={category} onChange={e => { setCategory(e.target.value); setPage(1); }}>
            <option value="">All</option>
            {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label>State</label>
          <select className="filter-select" value={state} onChange={e => { setState(e.target.value); setPage(1); }}>
            <option value="">All States</option>
            {allStates.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label>Type</label>
          <select className="filter-select" value={type} onChange={e => { setType(e.target.value); setPage(1); }}>
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
        <button className="filter-btn clear" onClick={() => { setSearch(''); setCategory(''); setState(''); setType(''); setSortBy('rank'); setPage(1); }}>Clear</button>
      </div>

      <div className="results-count">Showing <strong>{paged.length}</strong> of <strong>{filtered.length}</strong> colleges</div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>NIRF Rank</th>
              <th>Name</th>
              <th>Category</th>
              <th>State</th>
              <th>Type</th>
              <th>NAAC</th>
              <th>Admission Through</th>
              <th>Est.</th>
              <th>Website</th>
            </tr>
          </thead>
          <tbody>
            {paged.map(c => (
              <tr key={c.id}>
                <td><strong style={{color: c.nirfRank && c.nirfRank <= 10 ? 'var(--success)' : 'var(--text)'}}>{c.nirfRank || '-'}</strong>{c.nirfCategory ? <span style={{fontSize:'0.7rem', display:'block', color:'var(--text-light)'}}>{c.nirfCategory}</span> : null}</td>
                <td><Link to={`/colleges/${c.id}`} style={{fontWeight: 600}}>{c.shortName || c.name}</Link>{c.city ? <span style={{fontSize:'0.8rem', display:'block', color:'var(--text-light)'}}>{c.city}</span> : null}</td>
                <td><span className="badge badge-primary">{c.category}</span></td>
                <td>{c.state}</td>
                <td><span className={`badge ${c.type?.includes('Government') ? 'badge-success' : c.type?.includes('Private') ? 'badge-warning' : 'badge-info'}`}>{c.type}</span></td>
                <td>{c.naacGrade ? <span className="badge badge-purple">{c.naacGrade}</span> : '-'}</td>
                <td style={{fontSize:'0.8rem'}}>{c.admission?.join(', ') || '-'}</td>
                <td>{c.established || '-'}</td>
                <td>{c.website ? <a href={c.website} target="_blank" rel="noopener noreferrer" style={{fontSize:'0.8rem'}}>Visit</a> : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
