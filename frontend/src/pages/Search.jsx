import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import engineeringExams from '../data/engineeringExams'
import { medicalExams, lawExams, managementExams, defenceExams, civilServicesExams } from '../data/otherExams'
import { designExams, architectureExams, agricultureExams, teachingExams, professionalExams, bankingExams, sscExams, railwayExams, researchExams } from '../data/moreExams'
import colleges from '../data/colleges'
import statesData from '../data/statesData'
import schoolEntranceExams from '../data/schoolEntranceExams'
import { careerPaths } from '../data/careerPaths'

const allExams = [...engineeringExams, ...medicalExams, ...lawExams, ...managementExams, ...defenceExams, ...civilServicesExams, ...designExams, ...architectureExams, ...agricultureExams, ...teachingExams, ...professionalExams, ...bankingExams, ...sscExams, ...railwayExams, ...researchExams]

export default function Search() {
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    if (!query || query.length < 2) return { exams: [], colleges: [], states: [], schoolExams: [], careers: [] }
    const q = query.toLowerCase()

    const exams = allExams.filter(e =>
      e.name?.toLowerCase().includes(q) || e.category?.toLowerCase().includes(q) ||
      e.conductedBy?.toLowerCase().includes(q) || e.id?.toLowerCase().includes(q) ||
      e.acceptedBy?.toLowerCase().includes(q) || e.subcategory?.toLowerCase().includes(q)
    ).slice(0, 15)

    const cols = colleges.filter(c =>
      c.name?.toLowerCase().includes(q) || c.shortName?.toLowerCase().includes(q) ||
      c.city?.toLowerCase().includes(q) || c.state?.toLowerCase().includes(q) ||
      c.category?.toLowerCase().includes(q) || c.admission?.some(a => a.toLowerCase().includes(q))
    ).slice(0, 15)

    const sts = statesData.filter(s =>
      s.name?.toLowerCase().includes(q) || s.abbreviation?.toLowerCase().includes(q) ||
      s.entranceExams?.some(e => e.toLowerCase().includes(q)) ||
      s.topColleges?.some(c => c.toLowerCase().includes(q))
    ).slice(0, 10)

    const se = schoolEntranceExams.filter(e =>
      e.name?.toLowerCase().includes(q) || e.conductedBy?.toLowerCase().includes(q) ||
      e.schools?.toLowerCase().includes(q)
    ).slice(0, 10)

    const cp = careerPaths.filter(c =>
      c.name?.toLowerCase().includes(q) || c.careerOptions?.some(o => o.toLowerCase().includes(q)) ||
      c.examsToWrite?.some(e => e.toLowerCase().includes(q))
    ).slice(0, 10)

    return { exams, colleges: cols, states: sts, schoolExams: se, careers: cp }
  }, [query])

  const totalResults = results.exams.length + results.colleges.length + results.states.length + results.schoolExams.length + results.careers.length

  return (
    <div>
      <div className="section-header">
        <h1>Search Everything</h1>
        <p>Search across all exams, colleges, states, career paths - find anything you need.</p>
      </div>

      <div style={{marginBottom:24}}>
        <input type="text" value={query} onChange={e => setQuery(e.target.value)}
          placeholder="Type to search... (e.g., 'IIT', 'NEET', 'Karnataka', 'medical', 'banking')"
          style={{width:'100%', padding:'14px 20px', fontSize:'1.1rem', border:'2px solid var(--border)', borderRadius:12, outline:'none'}}
          autoFocus />
      </div>

      {query.length >= 2 && <div className="results-count"><strong>{totalResults}</strong> results found for "{query}"</div>}

      {results.exams.length > 0 && (
        <div style={{marginBottom:32}}>
          <h2 style={{marginBottom:12}}>Entrance Exams ({results.exams.length})</h2>
          {results.exams.map(e => (
            <div key={e.id} className="card" style={{marginBottom:8, padding:16}}>
              <Link to={`/entrance-exams/${e.id}`} style={{fontWeight:700, fontSize:'1rem'}}>{e.name}</Link>
              <span className="badge badge-primary" style={{marginLeft:8}}>{e.category}</span>
              {e.conductedBy && <span style={{fontSize:'0.85rem', color:'var(--text-light)', marginLeft:8}}>{e.conductedBy}</span>}
            </div>
          ))}
        </div>
      )}

      {results.colleges.length > 0 && (
        <div style={{marginBottom:32}}>
          <h2 style={{marginBottom:12}}>Colleges & Universities ({results.colleges.length})</h2>
          {results.colleges.map(c => (
            <div key={c.id} className="card" style={{marginBottom:8, padding:16}}>
              <Link to={`/colleges/${c.id}`} style={{fontWeight:700}}>{c.shortName || c.name}</Link>
              <span className="badge badge-primary" style={{marginLeft:8}}>{c.category}</span>
              <span style={{fontSize:'0.85rem', color:'var(--text-light)', marginLeft:8}}>{c.city}, {c.state}</span>
              {c.nirfRank && <span className="badge badge-success" style={{marginLeft:8}}>NIRF #{c.nirfRank}</span>}
            </div>
          ))}
        </div>
      )}

      {results.states.length > 0 && (
        <div style={{marginBottom:32}}>
          <h2 style={{marginBottom:12}}>States ({results.states.length})</h2>
          {results.states.map(s => (
            <div key={s.id} className="card" style={{marginBottom:8, padding:16}}>
              <Link to={`/states/${s.id}`} style={{fontWeight:700}}>{s.name}</Link>
            </div>
          ))}
        </div>
      )}

      {results.schoolExams.length > 0 && (
        <div style={{marginBottom:32}}>
          <h2 style={{marginBottom:12}}>School Entrance Exams ({results.schoolExams.length})</h2>
          {results.schoolExams.map(e => (
            <div key={e.id} className="card" style={{marginBottom:8, padding:16}}>
              <span style={{fontWeight:700}}>{e.name}</span>
              <span className="badge badge-info" style={{marginLeft:8}}>{e.forClass}</span>
            </div>
          ))}
        </div>
      )}

      {results.careers.length > 0 && (
        <div style={{marginBottom:32}}>
          <h2 style={{marginBottom:12}}>Career Paths ({results.careers.length})</h2>
          {results.careers.map(c => (
            <div key={c.id} className="card" style={{marginBottom:8, padding:16}}>
              <Link to="/career-paths" style={{fontWeight:700}}>{c.icon} {c.name}</Link>
            </div>
          ))}
        </div>
      )}

      {query.length >= 2 && totalResults === 0 && (
        <div className="card" style={{textAlign:'center', padding:40}}>
          <h3>No results found for "{query}"</h3>
          <p style={{color:'var(--text-light)', marginTop:8}}>Try different keywords or browse using the navigation menu.</p>
        </div>
      )}
    </div>
  )
}
