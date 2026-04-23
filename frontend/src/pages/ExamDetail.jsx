import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import engineeringExams from '../data/engineeringExams'
import { medicalExams, lawExams, managementExams, defenceExams, civilServicesExams } from '../data/otherExams'
import { designExams, architectureExams, agricultureExams, teachingExams, professionalExams, bankingExams, sscExams, railwayExams, researchExams, culinaryExams, horticultureExams } from '../data/moreExams'

const allExams = [
  ...engineeringExams, ...medicalExams, ...lawExams, ...managementExams,
  ...defenceExams, ...civilServicesExams, ...designExams, ...architectureExams,
  ...agricultureExams, ...teachingExams, ...professionalExams, ...bankingExams,
  ...sscExams, ...railwayExams, ...researchExams, ...culinaryExams, ...horticultureExams
]

export default function ExamDetail() {
  const { id } = useParams()
  const exam = allExams.find(e => e.id === id)
  const [openSections, setOpenSections] = useState({
    basic: true,
    pattern: true,
    syllabus: false,
    accepted: false,
    states: false
  })

  const toggleSection = (key) => setOpenSections(p => ({ ...p, [key]: !p[key] }))

  if (!exam) {
    return (
      <div className="pg-not-found">
        <div className="pg-not-found-icon">🔍</div>
        <h2 className="pg-not-found-title">Exam Not Found</h2>
        <p className="pg-not-found-text">
          The exam you're looking for doesn't exist or may have been removed.
        </p>
        <Link to="/entrance-exams" className="btn btn-primary btn-lg">
          ← Browse All Exams
        </Link>
      </div>
    )
  }

  const renderSyllabus = (syllabus) => {
    if (!syllabus) return null
    return Object.entries(syllabus).map(([key, val]) => (
      <div key={key} className="pg-syllabus-block">
        <h3 className="pg-syllabus-heading">{key.replace(/_/g, ' ')}</h3>
        {Array.isArray(val) ? (
          <ul className="pg-syllabus-list">
            {val.map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        ) : typeof val === 'object' ? (
          Object.entries(val).map(([k2, v2]) => (
            <div key={k2} className="pg-syllabus-sub">
              <strong className="pg-syllabus-sub-label">{k2.replace(/_/g, ' ')}:</strong>
              {Array.isArray(v2) ? (
                <ul className="pg-syllabus-list">
                  {v2.map((t, i) => <li key={i}>{t}</li>)}
                </ul>
              ) : (
                <span className="pg-syllabus-sub-value"> {v2}</span>
              )}
            </div>
          ))
        ) : <p className="pg-syllabus-text">{val}</p>}
      </div>
    ))
  }

  const Section = ({ sectionKey, title, children, className }) => (
    <div className={`card detail-section ${className || ''}`}>
      <div className="section-toggle" onClick={() => toggleSection(sectionKey)}>
        <h2>{title}</h2>
        <span className="acc-chevron">{openSections[sectionKey] ? '−' : '+'}</span>
      </div>
      {openSections[sectionKey] && <div className="pg-section-body">{children}</div>}
    </div>
  )

  const quickInfoItems = [
    { label: 'Conducted By', value: exam.conductedBy, icon: '🏛️' },
    { label: 'Exam Month', value: exam.examMonth, icon: '📅' },
    { label: 'Frequency', value: exam.frequency, icon: '🔄' },
    { label: 'Mode', value: exam.examPattern?.mode, icon: '💻' }
  ].filter(item => item.value)

  return (
    <div className="pg-exam-detail">
      {/* Breadcrumb */}
      <nav className="pg-breadcrumb">
        <Link to="/" className="pg-breadcrumb-link">Home</Link>
        <span className="pg-breadcrumb-sep">›</span>
        <Link to="/entrance-exams" className="pg-breadcrumb-link">Entrance Exams</Link>
        <span className="pg-breadcrumb-sep">›</span>
        <span className="pg-breadcrumb-current">{exam.name}</span>
      </nav>

      {/* Header */}
      <div className="detail-header">
        <h1>{exam.name}</h1>
        <div className="meta">
          {exam.category && <span className="badge badge-primary">{exam.category}</span>}
          {exam.level && <span className="badge badge-purple">{exam.level}</span>}
          {exam.subcategory && <span className="badge badge-info">{exam.subcategory}</span>}
        </div>
      </div>

      {/* Quick Info Bar */}
      {quickInfoItems.length > 0 && (
        <div className="pg-quick-info">
          {quickInfoItems.map((item, i) => (
            <div key={i} className="pg-quick-info-chip">
              <span className="pg-quick-info-icon">{item.icon}</span>
              <div className="pg-quick-info-content">
                <span className="pg-quick-info-label">{item.label}</span>
                <span className="pg-quick-info-value">{item.value}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Basic Information */}
      <Section sectionKey="basic" title="Basic Information">
        {exam.eligibility && <div className="info-row"><span className="info-label">Eligibility</span><span className="info-value">{exam.eligibility}</span></div>}
        {exam.applicationPeriod && <div className="info-row"><span className="info-label">Application Period</span><span className="info-value">{exam.applicationPeriod}</span></div>}
        {exam.website && (
          <div className="info-row">
            <span className="info-label">Official Website</span>
            <span className="info-value">
              <a href={exam.website} target="_blank" rel="noopener noreferrer">{exam.website}</a>
            </span>
          </div>
        )}
      </Section>

      {/* Exam Pattern */}
      <Section sectionKey="pattern" title="Exam Pattern">
        {exam.examPattern?.papers?.map((p, i) => (
          <div key={i} className="pg-paper-card">
            <h3 className="pg-paper-name">{p.name}</h3>
            <div className="pg-paper-details">
              {p.sections && (
                <div className="pg-paper-detail">
                  <span className="pg-paper-detail-label">Sections</span>
                  <span className="pg-paper-detail-value">{p.sections}</span>
                </div>
              )}
              {p.marks && (
                <div className="pg-paper-detail">
                  <span className="pg-paper-detail-label">Total Marks</span>
                  <span className="pg-paper-detail-value">{p.marks}</span>
                </div>
              )}
              {p.duration && (
                <div className="pg-paper-detail">
                  <span className="pg-paper-detail-label">Duration</span>
                  <span className="pg-paper-detail-value">{p.duration}</span>
                </div>
              )}
            </div>
          </div>
        ))}
        {exam.examPattern?.marking && (
          <div className="pg-pattern-meta">
            <strong>Marking Scheme:</strong> {exam.examPattern.marking}
          </div>
        )}
        {exam.examPattern?.mode && (
          <div className="pg-pattern-meta">
            <strong>Mode:</strong> {exam.examPattern.mode}
          </div>
        )}
      </Section>

      {/* Detailed Syllabus */}
      {exam.syllabus && (
        <Section sectionKey="syllabus" title="Detailed Syllabus">
          {renderSyllabus(exam.syllabus)}
        </Section>
      )}

      {/* Accepted By */}
      {exam.acceptedBy && (
        <Section sectionKey="accepted" title="Accepted By (Colleges/Institutions)">
          <p className="pg-accepted-text">{exam.acceptedBy}</p>
        </Section>
      )}

      {/* State-wise Details */}
      {exam.stateList && (
        <Section sectionKey="states" title="State-wise Details">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>State</th>
                  <th>Body</th>
                  <th>Website</th>
                </tr>
              </thead>
              <tbody>
                {exam.stateList.map((s, i) => (
                  <tr key={i}>
                    <td>{s.state}</td>
                    <td>{s.body}</td>
                    <td>
                      {s.website ? (
                        <a href={s.website} target="_blank" rel="noopener noreferrer">{s.website}</a>
                      ) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      {/* Important Notes — always visible callout */}
      {exam.importantNotes && (
        <div className="pg-notes-callout">
          <div className="pg-notes-callout-header">
            <span className="pg-notes-callout-icon">⚠️</span>
            <h3 className="pg-notes-callout-title">Important Notes</h3>
          </div>
          <p className="pg-notes-callout-text">{exam.importantNotes}</p>
        </div>
      )}
    </div>
  )
}
