import { useState } from 'react'
import { Link } from 'react-router-dom'
import { careerPaths } from '../data/careerPaths'

export default function CareerPaths() {
  const [selected, setSelected] = useState(null)

  return (
    <div>
      <div className="section-header">
        <h1>Career Paths & Education Roadmaps</h1>
        <p>Explore {careerPaths.length}+ career streams - what to study, which exams to write, where to apply, and what to expect.</p>
      </div>

      <div className="card-grid">
        {careerPaths.map(cp => (
          <div key={cp.id} className="card" style={{cursor: 'pointer', border: selected === cp.id ? '2px solid var(--primary)' : undefined}} onClick={() => setSelected(selected === cp.id ? null : cp.id)}>
            <div style={{display:'flex', alignItems:'center', gap:12, marginBottom:12}}>
              <span style={{fontSize:'2rem'}}>{cp.icon}</span>
              <div>
                <h3 style={{color:'var(--primary-dark)'}}>{cp.name}</h3>
                <span className="badge badge-info">{cp.streams?.join(', ')}</span>
              </div>
            </div>
            <p style={{fontSize:'0.85rem', color:'var(--text-light)', marginBottom:8}}><strong>After Class 10:</strong> {cp.afterClass10}</p>
            <div style={{display:'flex', flexWrap:'wrap', gap:4, marginBottom:8}}>
              {cp.examsToWrite?.slice(0, 4).map((e, i) => <span key={i} className="badge badge-primary" style={{fontSize:'0.7rem'}}>{e}</span>)}
              {cp.examsToWrite?.length > 4 && <span className="badge badge-warning" style={{fontSize:'0.7rem'}}>+{cp.examsToWrite.length - 4} more</span>}
            </div>

            {selected === cp.id && (
              <div style={{marginTop:16, paddingTop:16, borderTop:'1px solid var(--border)'}}>
                <div style={{marginBottom:12}}>
                  <h4 style={{marginBottom:4}}>Exams to Write:</h4>
                  <ul style={{paddingLeft:20, fontSize:'0.9rem'}}>{cp.examsToWrite?.map((e, i) => <li key={i}>{e}</li>)}</ul>
                </div>
                {cp.collegeTypes && <p style={{fontSize:'0.9rem', marginBottom:8}}><strong>College Types:</strong> {cp.collegeTypes}</p>}
                <div style={{marginBottom:12}}>
                  <h4 style={{marginBottom:4}}>Career Options:</h4>
                  <div style={{display:'flex', flexWrap:'wrap', gap:4}}>
                    {cp.careerOptions?.map((c, i) => <span key={i} className="badge badge-success" style={{fontSize:'0.75rem'}}>{c}</span>)}
                  </div>
                </div>
                {cp.avgSalary && <p style={{fontSize:'0.9rem', marginBottom:8}}><strong>Avg Salary:</strong> {cp.avgSalary}</p>}
                {cp.furtherStudies && (
                  <div style={{marginBottom:12}}>
                    <h4 style={{marginBottom:4}}>Further Studies:</h4>
                    <ul style={{paddingLeft:20, fontSize:'0.9rem'}}>{cp.furtherStudies.map((f, i) => <li key={i}>{f}</li>)}</ul>
                  </div>
                )}
                {cp.prepTimeline && <p style={{fontSize:'0.9rem', background:'#fffbeb', padding:12, borderRadius:8}}><strong>Preparation Tips:</strong> {cp.prepTimeline}</p>}
              </div>
            )}
            <p style={{fontSize:'0.8rem', color:'var(--primary-light)', marginTop:8}}>{selected === cp.id ? 'Click to collapse' : 'Click to expand details'}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
