import { useState } from 'react'
import { centralGovtJobs, majorPSUs, stateJobsMap, northeastOtherGovtJobs } from '../data/govtJobs_index'

const allCourses = centralGovtJobs.map(c => c.course)

export default function GovtJobs() {
  const [mode, setMode] = useState('central')
  const [selectedState, setSelectedState] = useState('')
  const [selectedCourse, setSelectedCourse] = useState('')
  const [expandedPsu, setExpandedPsu] = useState({})

  const togglePsu = (i) => setExpandedPsu(p => ({ ...p, [i]: !p[i] }))

  const filteredCentral = selectedCourse
    ? centralGovtJobs.filter(c => c.course === selectedCourse)
    : centralGovtJobs

  const stateData = selectedState
    ? stateJobsMap.find(s => s.stateId === selectedState)
    : null

  const filteredStateJobs = stateData
    ? (selectedCourse ? stateData.jobs.filter(c => c.course === selectedCourse) : stateData.jobs)
    : []

  const tabs = [
    { id: 'central', label: 'Central Govt Jobs' },
    { id: 'state', label: 'State Govt Jobs' },
    { id: 'psus', label: 'Major PSUs' },
  ]

  return (
    <div>
      <div className="section-header">
        <h1>Government Jobs by Qualification</h1>
        <p>Explore central government jobs, state government jobs, and major PSUs — filtered by your course/qualification. Data covers 15+ qualifications and 25+ major PSUs.</p>
      </div>

      <div className="card" style={{ background: '#fff8e1', borderLeft: '4px solid #f9a825', marginBottom: '1.5rem' }}>
        <p style={{ margin: 0, fontSize: '0.92rem', lineHeight: 1.6 }}>
          <strong>Disclaimer:</strong> Government job eligibility, recruitment processes, and salary structures change frequently. Please verify all information from official websites (UPSC, respective PSC, PSU/organization portals) before applying.
        </p>
      </div>

      <div className="filters-bar" style={{ marginBottom: '1.5rem' }}>
        {tabs.map(t => (
          <button key={t.id} className={`filter-btn${mode === t.id ? ' active' : ''}`} onClick={() => { setMode(t.id); setSelectedCourse(''); setSelectedState(''); setExpandedPsu({}) }}>
            {t.label}
          </button>
        ))}
      </div>

      {mode !== 'psus' && (
        <div className="filters-bar">
          <div className="filter-group">
            <label>Qualification</label>
            <select className="filter-select" value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)}>
              <option value="">All Qualifications</option>
              {allCourses.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          {mode === 'state' && (
            <div className="filter-group">
              <label>State</label>
              <select className="filter-select" value={selectedState} onChange={e => setSelectedState(e.target.value)} style={{ minWidth: 200 }}>
                <option value="">-- Select a State --</option>
                {stateJobsMap.map(s => (
                  <option key={s.stateId} value={s.stateId}>{s.stateName}</option>
                ))}
              </select>
            </div>
          )}
          {(selectedCourse || selectedState) && (
            <button className="filter-btn clear" onClick={() => { setSelectedCourse(''); setSelectedState(''); }}>Clear</button>
          )}
        </div>
      )}

      {/* ===== CENTRAL GOVT JOBS ===== */}
      {mode === 'central' && (
        <div>
          <div className="card" style={{ background: '#eff6ff', borderLeft: '4px solid var(--primary)', marginBottom: '1.5rem' }}>
            <p style={{ margin: 0, fontSize: '0.88rem' }}>
              Central government jobs are available across India regardless of state domicile. Recruitments are mostly via UPSC, SSC, RRB, PSU GATE score, or direct departmental recruitment.
            </p>
          </div>

          <div className="results-count">Showing <strong>{filteredCentral.length}</strong> qualification group(s)</div>

          {filteredCentral.map(section => (
            <div key={section.id} className="card" style={{ marginBottom: '1.5rem' }}>
              <div style={{ background: 'var(--primary)', color: 'white', padding: '12px 16px', borderRadius: 'var(--radius) var(--radius) 0 0', marginBottom: 0 }}>
                <h3 style={{ margin: '0 0 2px' }}>{section.course}</h3>
                <small style={{ opacity: 0.85 }}>{section.eligibility}</small>
              </div>
              <div className="table-wrap" style={{ borderRadius: '0 0 var(--radius) var(--radius)', marginTop: 0 }}>
                <table>
                  <thead>
                    <tr>
                      <th>Job / Post</th>
                      <th>Organization</th>
                      <th>Exam / Route</th>
                      <th>Salary</th>
                      <th>Official Link</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.jobs.map((job, i) => (
                      <tr key={i}>
                        <td><strong>{job.name}</strong></td>
                        <td>{job.organization}</td>
                        <td><span className="badge badge-primary">{job.exam}</span></td>
                        <td style={{ whiteSpace: 'nowrap' }}>{job.salary || '—'}</td>
                        <td><a href={job.website} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.82rem' }}>Official</a></td>
                        <td style={{ fontSize: '0.82rem', color: 'var(--text-light)' }}>{job.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===== STATE GOVT JOBS ===== */}
      {mode === 'state' && (
        <div>
          {!selectedState && (
            <div className="card" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-light)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🏛️</div>
              <h3 style={{ margin: '0 0 8px' }}>Select a State to view state government jobs</h3>
              <p style={{ margin: 0, fontSize: '0.88rem' }}>State-wise data is available for AP, Telangana, Tamil Nadu, Karnataka, Maharashtra, UP, Rajasthan, Gujarat, West Bengal, Bihar, Jharkhand, Odisha, MP, Chhattisgarh, Kerala, Goa, Delhi, Uttarakhand, J&K, Punjab, Haryana, HP, Assam, and North-East states.</p>
            </div>
          )}

          {selectedState && stateData && (
            <div>
              <div className="card" style={{ marginBottom: '1.5rem', background: '#f0fdf4', borderLeft: '4px solid var(--success)' }}>
                <h3 style={{ margin: '0 0 4px', color: 'var(--primary)' }}>{stateData.stateName}</h3>
                <p style={{ margin: 0, fontSize: '0.88rem' }}>Recruitment Board: <strong>{stateData.pscName}</strong> — <a href={stateData.pscWebsite} target="_blank" rel="noopener noreferrer">{stateData.pscWebsite}</a></p>
              </div>

              {filteredStateJobs.length === 0 && (
                <div className="card" style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-light)' }}>
                  <p>No specific data for this qualification in {stateData.stateName}. Please check {stateData.pscName} official website.</p>
                </div>
              )}

              {filteredStateJobs.map((section, idx) => (
                <div key={idx} className="card" style={{ marginBottom: '1.5rem' }}>
                  <div style={{ background: 'var(--primary)', color: 'white', padding: '10px 16px', borderRadius: 'var(--radius) var(--radius) 0 0' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem' }}>{section.course}</h3>
                  </div>
                  <div className="table-wrap" style={{ borderRadius: '0 0 var(--radius) var(--radius)', marginTop: 0 }}>
                    <table>
                      <thead>
                        <tr>
                          <th>Job / Post</th>
                          <th>Organization</th>
                          <th>Exam / Route</th>
                          <th>Official Link</th>
                          <th>Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {section.jobs.map((job, i) => (
                          <tr key={i}>
                            <td><strong>{job.name}</strong></td>
                            <td>{job.org}</td>
                            <td><span className="badge badge-primary">{job.exam}</span></td>
                            <td><a href={job.website} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.82rem' }}>Official</a></td>
                            <td style={{ fontSize: '0.82rem', color: 'var(--text-light)' }}>{job.notes}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}

              {selectedState === 'assam' && northeastOtherGovtJobs && (
                <div style={{ marginTop: '1.5rem' }}>
                  <h3 style={{ marginBottom: '1rem' }}>Other North-East States</h3>
                  {northeastOtherGovtJobs.map((stateGroup, idx) => (
                    <div key={idx} className="card" style={{ marginBottom: '1rem' }}>
                      <div style={{ padding: '10px 16px', background: 'var(--bg)', borderRadius: 'var(--radius) var(--radius) 0 0', borderBottom: '1px solid var(--border)' }}>
                        <strong>{stateGroup.state}</strong>
                      </div>
                      <div style={{ padding: '12px 16px' }}>
                        {stateGroup.jobs.map((job, i) => (
                          <div key={i} style={{ borderBottom: '1px solid var(--border)', padding: '8px 0' }}>
                            <strong>{job.name}</strong> — {job.org}
                            <span className="badge badge-primary" style={{ marginLeft: 8 }}>{job.exam}</span>
                            <div style={{ fontSize: '0.82rem', color: 'var(--text-light)', marginTop: 2 }}>{job.notes}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ===== MAJOR PSUs (ACCORDION) ===== */}
      {mode === 'psus' && (
        <div>
          <div className="card" style={{ background: '#eff6ff', borderLeft: '4px solid var(--primary)', marginBottom: '1.5rem' }}>
            <p style={{ margin: 0, fontSize: '0.88rem' }}>
              These are Central Government Public Sector Undertakings (PSUs) that recruit engineers, scientists, and other professionals. Most recruit via GATE score. Some like ISRO/DRDO/BARC have their own exams.
            </p>
          </div>

          <div className="results-count">Showing <strong>{majorPSUs.length}</strong> major PSUs</div>

          <div className="card-grid">
            {majorPSUs.map((psu, i) => {
              const isOpen = expandedPsu[i]
              return (
                <div key={i} className={`card${isOpen ? ' acc-open' : ''}`}>
                  <div className="acc-header" onClick={() => togglePsu(i)}>
                    <div className="acc-header-info">
                      <h3>{psu.shortName}</h3>
                      <div className="acc-badges">
                        <span className="badge badge-primary">{psu.sector}</span>
                      </div>
                      <p className="acc-subtitle" style={{marginTop: 4}}>{psu.name}</p>
                    </div>
                    <span className="acc-chevron">{isOpen ? '−' : '+'}</span>
                  </div>

                  {isOpen && (
                    <div className="acc-body">
                      <div className="info-row">
                        <span className="acc-detail-label">HQ:</span>
                        <span className="acc-detail-value">{psu.hq}</span>
                      </div>
                      {psu.centres && (
                        <div className="info-row">
                          <span className="acc-detail-label">Key Centres:</span>
                          <span className="acc-detail-value" style={{ fontSize: '0.84rem' }}>{psu.centres.join(', ')}</span>
                        </div>
                      )}
                      <div className="info-row">
                        <span className="acc-detail-label">Recruitment:</span>
                        <span className="acc-detail-value">{psu.recruitment}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 8 }}>
                        {psu.eligibleDegrees.map(d => <span key={d} className="badge badge-success">{d}</span>)}
                      </div>
                      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                        <a href={psu.website} target="_blank" rel="noopener noreferrer" className="filter-btn" style={{ fontSize: '0.82rem', textDecoration: 'none' }}>Careers</a>
                        {psu.prevPapersLink && <a href={psu.prevPapersLink} target="_blank" rel="noopener noreferrer" className="filter-btn" style={{ fontSize: '0.82rem', textDecoration: 'none', background: 'transparent', color: 'var(--primary)', border: '1px solid var(--primary)' }}>Papers</a>}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="card" style={{ marginTop: '1.5rem', background: '#fff8e1', borderLeft: '4px solid #f9a825' }}>
        <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>
          We tried our best to gather all information, but there might be some deviations. Kindly check with official government websites, respective PSC portals, and PSU career pages for the most accurate and updated information.
        </p>
      </div>
    </div>
  )
}
