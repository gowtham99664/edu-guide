import { useParams, Link } from 'react-router-dom'
import statesData from '../data/statesData'

export default function StateDetail() {
  const { id } = useParams()
  const s = statesData.find(st => st.id === id)
  if (!s) return <div className="card"><h2>State not found</h2><Link to="/states">&larr; Back</Link></div>

  return (
    <div>
      <Link to="/states" style={{display:'inline-block', marginBottom:16, fontWeight:600}}>&larr; Back to States</Link>
      <div className="detail-header">
        <h1>{s.name}</h1>
        <div className="meta">
          <span className="badge">{s.abbreviation}</span>
        </div>
      </div>

      <div className="detail-grid">
        <div className="card detail-section">
          <h2>Education Board</h2>
          {s.board && (
            <>
              <p><strong>{s.board.name}</strong></p>
              {s.board.website && <p><a href={s.board.website} target="_blank" rel="noopener noreferrer">{s.board.website}</a></p>}
            </>
          )}
          {s.educationDept && <p style={{marginTop:8}}><strong>Education Dept:</strong> <a href={s.educationDept} target="_blank" rel="noopener noreferrer">{s.educationDept}</a></p>}
        </div>

        <div className="card detail-section">
          <h2>Entrance Exams in {s.name}</h2>
          {s.entranceExams ? (
            <ul>{s.entranceExams.map((e, i) => <li key={i}>{e}</li>)}</ul>
          ) : <p>Uses national-level exams (JEE Main, NEET, CUET)</p>}
        </div>
      </div>

      {s.topColleges && (
        <div className="card detail-section" style={{marginTop:20}}>
          <h2>Top Colleges & Universities in {s.name}</h2>
          <div style={{display:'flex', flexWrap:'wrap', gap:8}}>
            {s.topColleges.map((c, i) => <span key={i} className="badge badge-primary" style={{padding:'6px 12px', fontSize:'0.85rem'}}>{c}</span>)}
          </div>
        </div>
      )}

      {s.scholarships && (
        <div className="card detail-section" style={{marginTop:20}}>
          <h2>Scholarship Schemes</h2>
          <ul>{s.scholarships.map((sc, i) => <li key={i}>{sc}</li>)}</ul>
        </div>
      )}
    </div>
  )
}
