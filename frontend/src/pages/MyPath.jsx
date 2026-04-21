import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../utils/api'

// Parse plan text into structured milestones
function parsePlanToMilestones(planText) {
  const lines = planText.split('\n')
  const milestones = []
  let currentSection = ''

  for (const line of lines) {
    const trimmed = line.trim()
    // Detect section headers
    if (trimmed.startsWith('## ')) {
      currentSection = trimmed.replace(/^##\s*\d*\.?\s*/, '').trim()
      continue
    }
    // Detect bullet items as milestones
    if ((trimmed.startsWith('- ') || trimmed.startsWith('* ')) && trimmed.length > 4) {
      const text = trimmed.slice(2).trim()
      // Determine type based on section
      let milestoneType = 'general'
      const sectionLower = currentSection.toLowerCase()
      if (sectionLower.includes('entrance exam') || sectionLower.includes('exam')) {
        milestoneType = 'exam'
      } else if (sectionLower.includes('college') || sectionLower.includes('target')) {
        milestoneType = 'college'
      } else if (sectionLower.includes('timeline') || sectionLower.includes('preparation')) {
        milestoneType = 'preparation'
      } else if (sectionLower.includes('skill')) {
        milestoneType = 'skill'
      } else if (sectionLower.includes('career') || sectionLower.includes('milestone')) {
        milestoneType = 'career'
      } else if (sectionLower.includes('scholarship') || sectionLower.includes('financial')) {
        milestoneType = 'scholarship'
      }

      // Clean bold markers for title
      const cleanText = text.replace(/\*\*/g, '')
      milestones.push({
        section: currentSection,
        title: cleanText.length > 100 ? cleanText.slice(0, 100) + '...' : cleanText,
        description: text,
        milestone_type: milestoneType,
      })
    }
  }
  return milestones
}

// Icons for milestone types
const TYPE_ICONS = {
  exam: '\u{1F4DD}',
  college: '\u{1F3DB}',
  preparation: '\u{1F4DA}',
  skill: '\u{1F4BB}',
  career: '\u{1F3AF}',
  scholarship: '\u{1F4B0}',
  general: '\u{2705}',
}

const TYPE_LABELS = {
  exam: 'Entrance Exam',
  college: 'College Target',
  preparation: 'Preparation Phase',
  skill: 'Skill Development',
  career: 'Career Milestone',
  scholarship: 'Scholarship',
  general: 'General',
}

export default function MyPath() {
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [plan, setPlan] = useState('')
  const [aiPowered, setAiPowered] = useState(false)
  const [model, setModel] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Milestone state
  const [milestones, setMilestones] = useState([])
  const [roadmapId, setRoadmapId] = useState(null)
  const [savedRoadmap, setSavedRoadmap] = useState(null)

  // Checkin dialog state
  const [checkinMilestone, setCheckinMilestone] = useState(null)
  const [checkinForm, setCheckinForm] = useState({ rank: '', score: '', percentile: '', category: '', notes: '' })
  const [checkinLoading, setCheckinLoading] = useState(false)

  // Recommendations state
  const [recommendations, setRecommendations] = useState(null)
  const [recsLoading, setRecsLoading] = useState(false)
  const [recsMilestoneId, setRecsMilestoneId] = useState(null)

  // View mode: 'plan' shows full plan text, 'milestones' shows milestone tracker
  const [viewMode, setViewMode] = useState('milestones')

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    // Load profile
    api.get('/api/profile', token).then(data => {
      if (data.profile) setProfile(data.profile)
    })
    // Load saved roadmap
    api.get('/api/roadmap', token).then(data => {
      if (data.roadmap) {
        setSavedRoadmap(data.roadmap)
        setPlan(data.roadmap.plan_text)
        setAiPowered(data.roadmap.ai_powered)
        setModel(data.roadmap.model)
        setRoadmapId(data.roadmap.id)
        setMilestones(data.milestones || [])
      }
    })
  }, [user])

  const generatePlan = async () => {
    if (!profile?.goal || !profile?.highest_qualification) {
      setError('Please complete your profile first.')
      return
    }
    setLoading(true); setError(''); setPlan(''); setMilestones([]); setRecommendations(null)
    const result = await api.post('/api/plan', {
      highest_qualification: profile.highest_qualification,
      goal: profile.goal,
      skills: profile.skills || 'General',
    }, token)
    setLoading(false)
    if (result.error) {
      setError(result.error)
    } else {
      setPlan(result.plan)
      setAiPowered(result.ai_powered)
      setModel(result.model)

      // Parse and save roadmap with milestones
      const parsed = parsePlanToMilestones(result.plan)
      const saveResult = await api.post('/api/roadmap', {
        plan_text: result.plan,
        ai_powered: result.ai_powered,
        model: result.model,
        milestones: parsed,
      }, token)

      if (!saveResult.error) {
        // Reload to get milestone IDs from DB
        const roadmapData = await api.get('/api/roadmap', token)
        if (roadmapData.roadmap) {
          setSavedRoadmap(roadmapData.roadmap)
          setRoadmapId(roadmapData.roadmap.id)
          setMilestones(roadmapData.milestones || [])
        }
      }
    }
  }

  const openCheckin = (milestone) => {
    setCheckinMilestone(milestone)
    setCheckinForm({ rank: '', score: '', percentile: '', category: '', notes: '' })
  }

  const submitCheckin = async () => {
    if (!checkinMilestone) return
    setCheckinLoading(true)
    const result = await api.post(`/api/milestones/${checkinMilestone.id}/checkin`, checkinForm, token)
    setCheckinLoading(false)
    if (!result.error) {
      // Update milestone in local state
      setMilestones(prev => prev.map(m =>
        m.id === checkinMilestone.id
          ? { ...m, completed: true, completed_at: new Date().toISOString(), checkin_data: result.checkin_data }
          : m
      ))
      setCheckinMilestone(null)
    } else {
      setError(result.error)
    }
  }

  const undoCheckin = async (milestoneId) => {
    const result = await api.post(`/api/milestones/${milestoneId}/uncheckin`, {}, token)
    if (!result.error) {
      setMilestones(prev => prev.map(m =>
        m.id === milestoneId
          ? { ...m, completed: false, completed_at: null, checkin_data: {} }
          : m
      ))
      // Clear recommendations if they were for this milestone
      if (recsMilestoneId === milestoneId) {
        setRecommendations(null)
        setRecsMilestoneId(null)
      }
    }
  }

  const getRecommendations = async (milestoneId) => {
    setRecsLoading(true)
    setRecsMilestoneId(milestoneId)
    setRecommendations(null)
    const result = await api.post(`/api/milestones/${milestoneId}/recommendations`, {}, token)
    setRecsLoading(false)
    if (!result.error) {
      setRecommendations(result.recommendations)
    } else {
      setError(result.error)
    }
  }

  const completedCount = milestones.filter(m => m.completed).length
  const totalCount = milestones.length
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  // Group milestones by section
  const grouped = {}
  for (const m of milestones) {
    if (!grouped[m.section]) grouped[m.section] = []
    grouped[m.section].push(m)
  }

  return (
    <div className="path-page">
      <div className="page-header">
        <h1>My Education Path</h1>
        <p>AI-powered personalized roadmap with milestone tracking</p>
      </div>

      {!profile ? (
        <div className="empty-state card">
          <div style={{fontSize:'3rem', marginBottom:'16px'}}>{'\u{1F4CB}'}</div>
          <h3>No Profile Found</h3>
          <p>Build your profile first to get a personalized education roadmap.</p>
          <Link to="/build-profile" className="btn btn-primary" style={{marginTop:'16px', display:'inline-block'}}>
            Build My Profile
          </Link>
        </div>
      ) : (
        <>
          {/* Profile Summary */}
          <div className="card path-summary">
            <div className="summary-grid">
              <div className="summary-item">
                <span className="summary-label">Qualification</span>
                <span className="summary-value">{profile.highest_qualification}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Goal</span>
                <span className="summary-value">{profile.goal}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Skills</span>
                <span className="summary-value">{profile.skills || 'Not specified'}</span>
              </div>
            </div>
            <div style={{display:'flex', gap:'12px', marginTop:'16px', flexWrap:'wrap'}}>
              <button
                className="btn btn-primary btn-lg"
                onClick={generatePlan}
                disabled={loading}
              >
                {loading
                  ? <><span className="spinner" /> Generating your roadmap...</>
                  : plan ? '\u{1F504} Regenerate Roadmap' : '\u{1F916} Generate My Roadmap'}
              </button>
              <Link to="/build-profile" className="btn btn-outline">
                {'\u270F\uFE0F'} Edit Profile
              </Link>
            </div>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          {loading && (
            <div className="card ai-loading">
              <div className="ai-loading-inner">
                <div className="ai-pulse">{'\u{1F9E0}'}</div>
                <div>
                  <h3>Qwen AI is analyzing your profile...</h3>
                  <p>Building your personalized education roadmap. This may take 30-60 seconds.</p>
                </div>
              </div>
              <div className="loading-steps">
                {['Analyzing qualifications', 'Matching entrance exams', 'Researching colleges', 'Planning timeline', 'Generating roadmap'].map((step, i) => (
                  <div key={step} className="loading-step">
                    <span className="step-dot loading" style={{animationDelay: `${i * 0.4}s`}} />
                    {step}
                  </div>
                ))}
              </div>
            </div>
          )}

          {plan && !loading && (
            <>
              {/* Progress Bar */}
              {milestones.length > 0 && (
                <div className="card progress-card">
                  <div className="progress-header">
                    <h3>Your Progress</h3>
                    <span className="progress-text">{completedCount} / {totalCount} milestones completed ({progressPct}%)</span>
                  </div>
                  <div className="progress-bar-track">
                    <div className="progress-bar-fill" style={{width: `${progressPct}%`}} />
                  </div>
                </div>
              )}

              {/* View Toggle */}
              <div className="view-toggle">
                <button
                  className={`toggle-btn ${viewMode === 'milestones' ? 'active' : ''}`}
                  onClick={() => setViewMode('milestones')}
                >
                  {'\u{1F3AF}'} Milestone Tracker
                </button>
                <button
                  className={`toggle-btn ${viewMode === 'plan' ? 'active' : ''}`}
                  onClick={() => setViewMode('plan')}
                >
                  {'\u{1F4C4}'} Full Roadmap
                </button>
              </div>

              {/* Milestone Tracker View */}
              {viewMode === 'milestones' && milestones.length > 0 && (
                <div className="milestones-container">
                  {Object.entries(grouped).map(([section, items]) => (
                    <div key={section} className="card milestone-section">
                      <h3 className="section-heading">{section}</h3>
                      <div className="milestone-list">
                        {items.map(m => (
                          <div key={m.id} className={`milestone-item ${m.completed ? 'completed' : ''}`}>
                            <div className="milestone-left">
                              <span className="milestone-icon">{TYPE_ICONS[m.milestone_type] || TYPE_ICONS.general}</span>
                              <div className="milestone-info">
                                <span className="milestone-title">{m.title}</span>
                                <span className="milestone-type-badge">{TYPE_LABELS[m.milestone_type] || 'General'}</span>
                                {m.completed && m.checkin_data && Object.keys(m.checkin_data).length > 0 && (
                                  <div className="checkin-details">
                                    {m.checkin_data.rank && <span className="checkin-tag">Rank: {m.checkin_data.rank}</span>}
                                    {m.checkin_data.score && <span className="checkin-tag">Score: {m.checkin_data.score}</span>}
                                    {m.checkin_data.percentile && <span className="checkin-tag">Percentile: {m.checkin_data.percentile}</span>}
                                    {m.checkin_data.notes && <span className="checkin-tag">{m.checkin_data.notes}</span>}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="milestone-actions">
                              {!m.completed ? (
                                <button className="btn btn-sm btn-success" onClick={() => openCheckin(m)}>
                                  Check In
                                </button>
                              ) : (
                                <>
                                  <span className="completed-badge">{'\u2705'} Done</span>
                                  {(m.milestone_type === 'exam' || m.milestone_type === 'career') && (
                                    <button
                                      className="btn btn-sm btn-accent"
                                      onClick={() => getRecommendations(m.id)}
                                      disabled={recsLoading && recsMilestoneId === m.id}
                                    >
                                      {recsLoading && recsMilestoneId === m.id ? 'Loading...' : '\u{1F52E} Get Guidance'}
                                    </button>
                                  )}
                                  <button className="btn btn-sm btn-ghost" onClick={() => undoCheckin(m.id)}>Undo</button>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Recommendations Panel */}
              {recommendations && (
                <div className="card recommendations-card">
                  <div className="recs-header">
                    <h2>{'\u{1F52E}'} AI Recommendations</h2>
                    <button className="btn btn-sm btn-ghost" onClick={() => { setRecommendations(null); setRecsMilestoneId(null) }}>
                      Close
                    </button>
                  </div>
                  <div className="plan-content">
                    <MarkdownRenderer content={recommendations} />
                  </div>
                </div>
              )}

              {/* Full Plan View */}
              {viewMode === 'plan' && (
                <div className="card plan-card">
                  <div className="plan-header">
                    <h2>Your Personalized Roadmap</h2>
                    <div className="plan-meta">
                      {aiPowered
                        ? <span className="badge badge-success">{'\u2728'} AI-Powered by {model}</span>
                        : <span className="badge badge-warning">{'\u{1F4DA}'} Expert Rule-Based Plan</span>}
                    </div>
                  </div>
                  <div className="plan-content">
                    <MarkdownRenderer content={plan} />
                  </div>
                  <div className="plan-footer">
                    <button className="btn btn-outline" onClick={() => window.print()}>{'\u{1F5A8}\uFE0F'} Print / Save as PDF</button>
                    <Link to="/entrance-exams" className="btn btn-outline">{'\u{1F4DD}'} Browse Entrance Exams</Link>
                    <Link to="/colleges" className="btn btn-outline">{'\u{1F3DB}\uFE0F'} Explore Colleges</Link>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Checkin Modal */}
          {checkinMilestone && (
            <div className="modal-overlay" onClick={() => setCheckinMilestone(null)}>
              <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2>Check In: {checkinMilestone.title}</h2>
                <p className="modal-subtitle">
                  {checkinMilestone.milestone_type === 'exam'
                    ? 'Enter your exam results below. This will help us provide personalized college recommendations.'
                    : 'Mark this milestone as completed. Add any relevant details.'}
                </p>

                {(checkinMilestone.milestone_type === 'exam' || checkinMilestone.milestone_type === 'career') && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Rank (if applicable)</label>
                      <input
                        className="form-input"
                        type="text"
                        placeholder="e.g. 5432"
                        value={checkinForm.rank}
                        onChange={e => setCheckinForm(f => ({ ...f, rank: e.target.value }))}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Score</label>
                      <input
                        className="form-input"
                        type="text"
                        placeholder="e.g. 250/300"
                        value={checkinForm.score}
                        onChange={e => setCheckinForm(f => ({ ...f, score: e.target.value }))}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Percentile</label>
                      <input
                        className="form-input"
                        type="text"
                        placeholder="e.g. 97.5"
                        value={checkinForm.percentile}
                        onChange={e => setCheckinForm(f => ({ ...f, percentile: e.target.value }))}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Category</label>
                      <select
                        className="form-input"
                        value={checkinForm.category}
                        onChange={e => setCheckinForm(f => ({ ...f, category: e.target.value }))}
                      >
                        <option value="">Select category</option>
                        <option value="General">General</option>
                        <option value="OBC">OBC</option>
                        <option value="SC">SC</option>
                        <option value="ST">ST</option>
                        <option value="EWS">EWS</option>
                        <option value="PwD">PwD</option>
                      </select>
                    </div>
                  </>
                )}

                <div className="form-group">
                  <label className="form-label">Notes (optional)</label>
                  <textarea
                    className="form-input"
                    rows="3"
                    placeholder="Any additional details..."
                    value={checkinForm.notes}
                    onChange={e => setCheckinForm(f => ({ ...f, notes: e.target.value }))}
                  />
                </div>

                <div className="modal-actions">
                  <button className="btn btn-primary" onClick={submitCheckin} disabled={checkinLoading}>
                    {checkinLoading ? <><span className="spinner" /> Saving...</> : '\u2705 Complete Milestone'}
                  </button>
                  <button className="btn btn-outline" onClick={() => setCheckinMilestone(null)}>Cancel</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// Simple markdown renderer
function MarkdownRenderer({ content }) {
  const lines = content.split('\n')
  const elements = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    if (line.startsWith('## ')) {
      elements.push(<h2 key={i} className="md-h2">{parseBold(line.slice(3))}</h2>)
    } else if (line.startsWith('### ')) {
      elements.push(<h3 key={i} className="md-h3">{parseBold(line.slice(4))}</h3>)
    } else if (line.startsWith('**') && line.endsWith('**')) {
      elements.push(<p key={i} className="md-bold-para">{parseBold(line)}</p>)
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      elements.push(<li key={i} className="md-li">{parseBold(line.slice(2))}</li>)
    } else if (/^\d+\.\s/.test(line)) {
      elements.push(<li key={i} className="md-li md-ol">{parseBold(line.replace(/^\d+\.\s/, ''))}</li>)
    } else if (line.startsWith('---')) {
      elements.push(<hr key={i} className="md-hr" />)
    } else if (line.trim() === '') {
      elements.push(<div key={i} className="md-spacer" />)
    } else {
      elements.push(<p key={i} className="md-p">{parseBold(line)}</p>)
    }
    i++
  }

  return <div className="markdown-body">{elements}</div>
}

function parseBold(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/)
  return parts.map((p, i) =>
    p.startsWith('**') && p.endsWith('**')
      ? <strong key={i}>{p.slice(2, -2)}</strong>
      : p
  )
}
