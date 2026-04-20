import { useState } from 'react'
import { Link } from 'react-router-dom'
import statesData from '../data/statesData'

export default function StateInfo() {
  const [search, setSearch] = useState('')

  const filtered = statesData.filter(s => {
    if (!search) return true
    const q = search.toLowerCase()
    return s.name.toLowerCase().includes(q) || s.abbreviation?.toLowerCase().includes(q)
  })

  return (
    <div>
      <div className="section-header">
        <h1>State-wise Education Information</h1>
        <p>Education boards, entrance exams, top colleges, and scholarship schemes for all 28 states and 8 union territories.</p>
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <input type="text" placeholder="Search states..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="card-grid">
        {filtered.map(s => (
          <div key={s.id} className="card">
            <h3 style={{color:'var(--primary-dark)', marginBottom:8}}>{s.name}</h3>
            {s.board && <p style={{fontSize:'0.85rem', marginBottom:6}}><strong>Board:</strong> {s.board.name}</p>}
            {s.entranceExams && (
              <div style={{marginBottom:8}}>
                <strong style={{fontSize:'0.85rem'}}>Entrance Exams:</strong>
                <div style={{display:'flex', flexWrap:'wrap', gap:4, marginTop:4}}>
                  {s.entranceExams.slice(0, 5).map((e, i) => <span key={i} className="badge badge-primary" style={{fontSize:'0.7rem'}}>{e}</span>)}
                  {s.entranceExams.length > 5 && <span className="badge badge-info" style={{fontSize:'0.7rem'}}>+{s.entranceExams.length - 5} more</span>}
                </div>
              </div>
            )}
            {s.topColleges && <p style={{fontSize:'0.8rem', color:'var(--text-light)'}}><strong>Top Colleges:</strong> {s.topColleges.slice(0, 4).join(', ')}{s.topColleges.length > 4 ? ` +${s.topColleges.length - 4} more` : ''}</p>}
            <Link to={`/states/${s.id}`} style={{display:'inline-block', marginTop:10, fontWeight:600, fontSize:'0.9rem'}}>View Full Details &rarr;</Link>
          </div>
        ))}
      </div>
    </div>
  )
}
