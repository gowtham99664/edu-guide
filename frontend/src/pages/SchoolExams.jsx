import { Link } from 'react-router-dom'
import schoolEntranceExams from '../data/schoolEntranceExams'

export default function SchoolExams() {
  return (
    <div>
      <div className="section-header">
        <h1>School-Level Entrance Exams & Special Schools</h1>
        <p>Entrance exams for Navodaya Vidyalaya, Sainik Schools, Military Schools, Residential Schools (AP/TS Gurukul), Olympiads, Scholarships (NTSE, NMMS), and more.</p>
      </div>

      <div className="card-grid">
        {schoolEntranceExams.map(exam => (
          <div key={exam.id} className="card exam-card">
            <div className="exam-name">{exam.name}</div>
            <div className="exam-body">{exam.conductedBy}</div>
            <p style={{fontSize:'0.85rem', marginBottom:6}}><strong>For:</strong> {exam.forClass}</p>
            <p style={{fontSize:'0.85rem', marginBottom:6, color:'var(--text-light)'}}>{exam.eligibility?.substring(0, 150)}{exam.eligibility?.length > 150 ? '...' : ''}</p>
            <div className="exam-meta">
              <span className="badge badge-primary">{exam.forClass}</span>
              {exam.frequency && <span className="badge badge-success">{exam.frequency}</span>}
              {exam.statesCovered && <span className="badge badge-info">{exam.statesCovered}</span>}
            </div>

            <div style={{marginTop:16, paddingTop:12, borderTop:'1px solid var(--border)'}}>
              <h4 style={{fontSize:'0.9rem', marginBottom:6}}>Exam Pattern:</h4>
              <p style={{fontSize:'0.85rem'}}>{exam.examPattern}</p>

              {exam.syllabus && (
                <div style={{marginTop:8}}>
                  <h4 style={{fontSize:'0.9rem', marginBottom:4}}>Syllabus Highlights:</h4>
                  {Object.entries(exam.syllabus).map(([key, val]) => (
                    <div key={key} style={{marginBottom:6}}>
                      <strong style={{fontSize:'0.8rem', textTransform:'capitalize'}}>{key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')}:</strong>
                      {Array.isArray(val) && <ul style={{paddingLeft:16, fontSize:'0.8rem'}}>{val.slice(0, 4).map((v, i) => <li key={i}>{v}</li>)}{val.length > 4 && <li>+{val.length - 4} more topics...</li>}</ul>}
                    </div>
                  ))}
                </div>
              )}

              {exam.schools && <p style={{fontSize:'0.85rem', marginTop:8}}><strong>Schools:</strong> {exam.schools.substring(0, 200)}{exam.schools.length > 200 ? '...' : ''}</p>}
              {exam.scholarship && <p style={{fontSize:'0.85rem', marginTop:4, color:'var(--success)'}}><strong>Scholarship:</strong> {exam.scholarship}</p>}
              {exam.applicationPeriod && <p style={{fontSize:'0.85rem', marginTop:4}}><strong>Application:</strong> {exam.applicationPeriod} | <strong>Exam:</strong> {exam.examMonth}</p>}
              {exam.website && <p style={{marginTop:8}}><a href={exam.website} target="_blank" rel="noopener noreferrer" style={{fontWeight:600}}>Official Website &rarr;</a></p>}
              {exam.importantNotes && <p style={{fontSize:'0.8rem', marginTop:8, padding:8, background:'#fffbeb', borderRadius:6}}>{exam.importantNotes}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
