import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import engineeringExams from '../data/engineeringExams'
import { medicalExams, lawExams, managementExams } from '../data/otherExams'
import { designExams, architectureExams, agricultureExams, teachingExams, professionalExams, researchExams } from '../data/moreExams'

const allExams = [...engineeringExams, ...medicalExams, ...lawExams, ...managementExams, ...designExams, ...architectureExams, ...agricultureExams, ...teachingExams, ...professionalExams, ...researchExams]

export default function ExamDetail() {
  const { id } = useParams()
  const exam = allExams.find(e => e.id === id)
  const [openSections, setOpenSections] = useState({ basic: true })

  const toggleSection = (key) => setOpenSections(p => ({ ...p, [key]: !p[key] }))

  if (!exam) return <div className="card"><h2>Exam not found</h2><Link to="/entrance-exams">&larr; Back to Exams</Link></div>

  const renderSyllabus = (syllabus) => {
    if (!syllabus) return null
    return Object.entries(syllabus).map(([key, val]) => (
      <div key={key} style={{marginBottom: 12}}>
        <h3 style={{textTransform:'capitalize'}}>{key.replace(/_/g, ' ')}</h3>
        {Array.isArray(val) ? (
          <ul>{val.map((t, i) => <li key={i}>{t}</li>)}</ul>
        ) : typeof val === 'object' ? (
          Object.entries(val).map(([k2, v2]) => (
            <div key={k2} style={{marginLeft: 16, marginBottom: 8}}>
              <strong style={{textTransform:'capitalize'}}>{k2.replace(/_/g, ' ')}:</strong>
              {Array.isArray(v2) ? <ul>{v2.map((t, i) => <li key={i}>{t}</li>)}</ul> : <span> {v2}</span>}
            </div>
          ))
        ) : <p>{val}</p>}
      </div>
    ))
  }

  const Section = ({ sectionKey, title, children, style }) => (
    <div className="card detail-section" style={style}>
      <div className="section-toggle" onClick={() => toggleSection(sectionKey)}>
        <h2>{title}</h2>
        <span className="acc-chevron">{openSections[sectionKey] ? '−' : '+'}</span>
      </div>
      {openSections[sectionKey] && children}
    </div>
  )

  return (
    <div>
      <Link to="/entrance-exams" style={{display:'inline-block', marginBottom:16, fontWeight:600}}>&larr; Back to All Exams</Link>
      <div className="detail-header">
        <h1>{exam.name}</h1>
        <div className="meta">
          <span className="badge">{exam.category}</span>
          {exam.subcategory && <span className="badge">{exam.subcategory}</span>}
          {exam.level && <span className="badge">{exam.level}</span>}
        </div>
      </div>

      <Section sectionKey="basic" title="Basic Information">
        {exam.conductedBy && <div className="info-row"><span className="info-label">Conducted By:</span><span className="info-value">{exam.conductedBy}</span></div>}
        {exam.eligibility && <div className="info-row"><span className="info-label">Eligibility:</span><span className="info-value">{exam.eligibility}</span></div>}
        {exam.frequency && <div className="info-row"><span className="info-label">Frequency:</span><span className="info-value">{exam.frequency}</span></div>}
        {exam.applicationPeriod && <div className="info-row"><span className="info-label">Application Period:</span><span className="info-value">{exam.applicationPeriod}</span></div>}
        {exam.examMonth && <div className="info-row"><span className="info-label">Exam Month:</span><span className="info-value">{exam.examMonth}</span></div>}
        {exam.website && <div className="info-row"><span className="info-label">Official Website:</span><span className="info-value"><a href={exam.website} target="_blank" rel="noopener noreferrer">{exam.website}</a></span></div>}
      </Section>

      <Section sectionKey="pattern" title="Exam Pattern" style={{marginTop: 20}}>
        {exam.examPattern?.papers?.map((p, i) => (
          <div key={i} style={{marginBottom: 16, padding: 12, background: '#f8fafc', borderRadius: 8}}>
            <strong>{p.name}</strong>
            {p.sections && <p style={{marginTop:4, fontSize:'0.9rem'}}><strong>Sections:</strong> {p.sections}</p>}
            {p.marks && <p style={{fontSize:'0.9rem'}}><strong>Total Marks:</strong> {p.marks}</p>}
            {p.duration && <p style={{fontSize:'0.9rem'}}><strong>Duration:</strong> {p.duration}</p>}
          </div>
        ))}
        {exam.examPattern?.marking && <p style={{fontSize:'0.9rem'}}><strong>Marking Scheme:</strong> {exam.examPattern.marking}</p>}
        {exam.examPattern?.mode && <p style={{fontSize:'0.9rem'}}><strong>Mode:</strong> {exam.examPattern.mode}</p>}
      </Section>

      {exam.syllabus && (
        <Section sectionKey="syllabus" title="Detailed Syllabus" style={{marginTop: 20}}>
          {renderSyllabus(exam.syllabus)}
        </Section>
      )}

      {exam.acceptedBy && (
        <Section sectionKey="accepted" title="Accepted By (Colleges/Institutions)" style={{marginTop: 20}}>
          <p style={{fontSize:'0.9rem', lineHeight:1.8}}>{exam.acceptedBy}</p>
        </Section>
      )}

      {exam.stateList && (
        <Section sectionKey="states" title="State-wise Details" style={{marginTop: 20}}>
          <div className="table-wrap">
            <table>
              <thead><tr><th>State</th><th>Body</th><th>Website</th></tr></thead>
              <tbody>
                {exam.stateList.map((s, i) => (
                  <tr key={i}>
                    <td>{s.state}</td>
                    <td>{s.body}</td>
                    <td>{s.website ? <a href={s.website} target="_blank" rel="noopener noreferrer">{s.website}</a> : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      {exam.importantNotes && (
        <Section sectionKey="notes" title="Important Notes" style={{marginTop: 20, background:'#fffbeb', borderColor:'#fbbf24'}}>
          <p style={{fontSize:'0.9rem', lineHeight:1.8}}>{exam.importantNotes}</p>
        </Section>
      )}
    </div>
  )
}
