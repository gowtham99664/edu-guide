import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../utils/api'

const QUALIFICATIONS = [
  'Class 10 (SSC/CBSE)',
  'Class 12 (HSC/CBSE) - Science',
  'Class 12 (HSC/CBSE) - Commerce',
  'Class 12 (HSC/CBSE) - Arts/Humanities',
  'Diploma (Polytechnic)',
  "Bachelor's Degree - Engineering (B.Tech/B.E)",
  "Bachelor's Degree - Science (B.Sc)",
  "Bachelor's Degree - Commerce (B.Com)",
  "Bachelor's Degree - Arts (B.A)",
  "Bachelor's Degree - Medicine (MBBS)",
  "Bachelor's Degree - Law (LLB)",
  "Bachelor's Degree - Other",
  "Master's Degree (M.Tech/M.E)",
  "Master's Degree (M.Sc)",
  "Master's Degree (MBA)",
  "Master's Degree - Other",
  'PhD / Doctorate',
]

const GOALS = [
  'Get into IIT / NIT (B.Tech)',
  'Become a Doctor (MBBS)',
  'Pursue MBA from IIM',
  'Crack UPSC / IAS / IPS',
  'Become a Data Scientist / AI Engineer',
  'Pursue MS/PhD Abroad',
  'Get into National Law University (CLAT)',
  'Become a Software Engineer',
  'Government Job (Banking / SSC / Railways)',
  'Defence Services (NDA / CDS)',
  'Chartered Accountant (CA)',
  'Pursue Architecture (B.Arch)',
  'Become a Teacher / Professor',
  'Start My Own Business / Startup',
  'Other (describe in skills)',
]

const SKILL_OPTIONS = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology',
  'English', 'Hindi', 'Programming (Python)', 'Programming (Java)',
  'Data Analysis', 'Machine Learning', 'Web Development',
  'Logical Reasoning', 'Verbal Ability', 'General Knowledge',
  'Drawing / Sketching', 'Communication Skills', 'Leadership',
  'Public Speaking', 'Research & Writing', 'Problem Solving',
]

export default function BuildProfile() {
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ highest_qualification: '', goal: '', skills: '' })
  const [selectedSkills, setSelectedSkills] = useState([])
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    // Load existing profile
    api.get('/api/profile', token).then(data => {
      if (data.profile) {
        setForm({
          highest_qualification: data.profile.highest_qualification || '',
          goal: data.profile.goal || '',
          skills: data.profile.skills || '',
        })
        if (data.profile.skills) {
          const savedSkills = data.profile.skills.split(',').map(s => s.trim()).filter(Boolean)
          setSelectedSkills(savedSkills)
        }
      }
    })
  }, [user])

  const toggleSkill = (skill) => {
    setSelectedSkills(prev => {
      const next = prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
      setForm(f => ({ ...f, skills: next.join(', ') }))
      return next
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.highest_qualification || !form.goal) {
      setError('Please fill in qualification and goal'); return
    }
    setLoading(true); setError('')
    const result = await api.post('/api/profile', form, token)
    setLoading(false)
    if (result.error) setError(result.error)
    else { setSaved(true); setTimeout(() => navigate('/my-path'), 1500) }
  }

  return (
    <div className="profile-page">
      <div className="page-header">
        <h1>Build Your Profile</h1>
        <p>Help us understand your background so we can create a personalized education roadmap for you.</p>
      </div>

      {saved && (
        <div className="alert alert-success">
          ✅ Profile saved! Redirecting to your AI-powered path planner...
        </div>
      )}
      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="profile-form">
        {/* Qualification */}
        <div className="profile-section">
          <h2 className="section-title">
            <span className="section-num">1</span>
            Highest Educational Qualification
          </h2>
          <div className="qual-grid">
            {QUALIFICATIONS.map(q => (
              <button
                key={q}
                type="button"
                className={`qual-btn${form.highest_qualification === q ? ' selected' : ''}`}
                onClick={() => setForm(f => ({ ...f, highest_qualification: q }))}
              >
                {q}
              </button>
            ))}
          </div>
          {form.highest_qualification && (
            <p className="selected-label">Selected: <strong>{form.highest_qualification}</strong></p>
          )}
        </div>

        {/* Goal */}
        <div className="profile-section">
          <h2 className="section-title">
            <span className="section-num">2</span>
            Your Career / Education Goal
          </h2>
          <div className="goal-grid">
            {GOALS.map(g => (
              <button
                key={g}
                type="button"
                className={`goal-btn${form.goal === g ? ' selected' : ''}`}
                onClick={() => setForm(f => ({ ...f, goal: g }))}
              >
                {g}
              </button>
            ))}
          </div>
          <div className="form-group" style={{marginTop: '16px'}}>
            <label className="form-label">Or describe your own goal:</label>
            <input
              className="form-input"
              type="text"
              value={GOALS.includes(form.goal) ? '' : form.goal}
              onChange={e => setForm(f => ({ ...f, goal: e.target.value }))}
              placeholder="e.g. Become a Chartered Accountant, Pursue Fine Arts..."
            />
          </div>
        </div>

        {/* Skills */}
        <div className="profile-section">
          <h2 className="section-title">
            <span className="section-num">3</span>
            Your Current Skill Set
          </h2>
          <p className="section-desc">Select all that apply — these help the AI tailor your roadmap.</p>
          <div className="skills-grid">
            {SKILL_OPTIONS.map(skill => (
              <button
                key={skill}
                type="button"
                className={`skill-chip${selectedSkills.includes(skill) ? ' selected' : ''}`}
                onClick={() => toggleSkill(skill)}
              >
                {selectedSkills.includes(skill) ? '✓ ' : ''}{skill}
              </button>
            ))}
          </div>
          <div className="form-group" style={{marginTop: '16px'}}>
            <label className="form-label">Additional skills (optional):</label>
            <input
              className="form-input"
              type="text"
              value={form.skills}
              onChange={e => {
                setForm(f => ({ ...f, skills: e.target.value }))
              }}
              placeholder="e.g. Mathematics, Python, Leadership..."
            />
          </div>
        </div>

        <div className="profile-actions">
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? <><span className="spinner" /> Saving...</> : '💾 Save Profile & Plan My Path'}
          </button>
        </div>
      </form>
    </div>
  )
}
