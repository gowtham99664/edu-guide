import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../utils/api'

const QUALIFICATIONS = [
  'Class 8',
  'Class 10 (SSC/CBSE)',
  'Class 12 - Science (PCM)',
  'Class 12 - Science (PCB)',
  'Class 12 - Science (PCMB)',
  'Class 12 - Commerce',
  'Class 12 - Arts/Humanities',
  'ITI (NCVT/SCVT)',
  'Diploma (Polytechnic)',
  "Bachelor's - Engineering (B.Tech/B.E)",
  "Bachelor's - Science (B.Sc)",
  "Bachelor's - Commerce (B.Com)",
  "Bachelor's - Arts (B.A)",
  "Bachelor's - Medicine (MBBS)",
  "Bachelor's - Dental (BDS)",
  "Bachelor's - AYUSH (BAMS/BHMS/BUMS/BNYS)",
  "Bachelor's - Veterinary (B.V.Sc)",
  "Bachelor's - Pharmacy (B.Pharm)",
  "Bachelor's - Nursing (B.Sc Nursing)",
  "Bachelor's - Physiotherapy (BPT)",
  "Bachelor's - Law (LLB/BA LLB)",
  "Bachelor's - Design (B.Des)",
  "Bachelor's - Architecture (B.Arch)",
  "Bachelor's - Education (B.Ed)",
  "Bachelor's - Fine Arts (BFA)",
  "Bachelor's - Computer Applications (BCA)",
  "Bachelor's - Agriculture (B.Sc Agri)",
  "Bachelor's - Other",
  "Master's - Engineering (M.Tech/M.E)",
  "Master's - Science (M.Sc)",
  "Master's - MBA",
  "Master's - Arts (M.A)",
  "Master's - Pharmacy (M.Pharm)",
  "Master's - Social Work (MSW)",
  "Master's - Computer Applications (MCA)",
  "Master's - Other",
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
  'Become a Pharmacist / Pharma Career',
  'Become a Veterinary Doctor',
  'Become a Psychologist',
  'Career in Animation / VFX / Gaming',
  'Cyber Security Expert',
  'Career in Food Science / Nutrition / Dietetics',
  'Become a Nurse / Paramedical Professional',
  'Fashion Designer (NIFT)',
  'ITI / Polytechnic / Vocational Skills',
  'Foreign Languages / Translator',
  'Career in Renewable Energy / Sustainability / ESG',
  'Career in Biotechnology / Life Sciences',
  'Career in Media / Journalism / Mass Communication',
  'Hotel Management & Hospitality',
  'Career in Sports / Physical Education',
  'Aviation Pilot / Merchant Navy Officer',
  'Social Work / NGO / Development Sector',
  'Career in Agriculture / Horticulture / Fishery',
  'Indian Forest Service (IFoS) / Wildlife',
  'Career in Music / Dance / Performing Arts',
  'Become an Actuary / Statistics',
  'Digital Marketing / E-Commerce',
  'Event Management',
  'Logistics & Supply Chain Management',
  'Forensic Science / Criminology',
  'Yoga & Naturopathy (BNYS)',
  'Library & Information Science',
  'Beauty / Cosmetology / Wellness',
  'Gem & Jewellery Design',
  'Fire & Safety Management',
  'Public Policy & Governance',
  'Rural Management / Cooperatives',
]

const SKILL_OPTIONS = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology',
  'English', 'Hindi', 'Telugu', 'Tamil', 'Kannada', 'Malayalam',
  'Programming (Python)', 'Programming (Java)', 'Programming (C/C++)',
  'Data Analysis', 'Machine Learning', 'Web Development', 'Mobile App Development',
  'Logical Reasoning', 'Verbal Ability', 'General Knowledge', 'Current Affairs',
  'Drawing / Sketching', 'Painting / Fine Arts', 'Animation / Digital Art',
  'Communication Skills', 'Leadership', 'Public Speaking', 'Teamwork',
  'Research & Writing', 'Problem Solving', 'Critical Thinking', 'Creativity',
  'Music / Singing', 'Dance', 'Acting / Theatre', 'Photography / Videography',
  'Sports / Athletics', 'Yoga / Fitness', 'Cooking / Culinary Arts',
  'French', 'German', 'Japanese', 'Korean', 'Spanish', 'Chinese',
  'Accounting / Commerce', 'Stock Market / Finance', 'Sales / Marketing',
  'Social Media', 'Content Writing', 'Graphic Design', 'Video Editing',
  'Mechanical Skills / Workshop', 'Electronics / Hardware', 'Networking / IT Support',
  'Patient Care / Empathy', 'Counselling / Psychology', 'Teaching / Mentoring',
  'Lab Skills / Experimentation', 'Environmental Awareness', 'Agriculture / Farming',
]

/* Searchable single-select dropdown */
function SearchableSelect({ options, value, onChange, placeholder }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const filtered = options.filter(o => o.toLowerCase().includes(query.toLowerCase()))
  const isCustom = value && !options.includes(value)

  return (
    <div className="searchable-select" ref={ref}>
      <input
        className="form-input"
        value={open ? query : (value || '')}
        placeholder={placeholder}
        onFocus={() => { setOpen(true); setQuery(value && options.includes(value) ? '' : (value || '')) }}
        onChange={e => { setQuery(e.target.value); onChange(e.target.value); setOpen(true) }}
      />
      {open && (
        <div className="ss-dropdown">
          {filtered.length > 0 ? filtered.map(o => (
            <div
              key={o}
              className={`ss-option${value === o ? ' selected' : ''}`}
              onClick={() => { onChange(o); setOpen(false); setQuery('') }}
            >{o}</div>
          )) : (
            query.length > 0 ? (
              <div className="ss-option ss-custom" onClick={() => { setOpen(false) }}>
                Use: "{query}"
              </div>
            ) : (
              <div className="ss-empty">No options found</div>
            )
          )}
        </div>
      )}
      {value && (
        <span className="ss-clear" onClick={() => { onChange(''); setQuery('') }}>&times;</span>
      )}
    </div>
  )
}

/* Searchable multi-select dropdown */
function SearchableMultiSelect({ options, selected, onToggle, placeholder }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const filtered = options.filter(o => o.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="searchable-select searchable-multi" ref={ref}>
      <div className="sm-input-wrap" onClick={() => setOpen(true)}>
        {selected.length > 0 && (
          <div className="sm-tags">
            {selected.map(s => (
              <span key={s} className="sm-tag">
                {s}
                <span className="sm-tag-remove" onClick={(e) => { e.stopPropagation(); onToggle(s) }}>&times;</span>
              </span>
            ))}
          </div>
        )}
        <input
          className="sm-search-input"
          value={query}
          placeholder={selected.length === 0 ? placeholder : 'Search more...'}
          onChange={e => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
        />
      </div>
      {open && (
        <div className="ss-dropdown">
          {filtered.length > 0 ? filtered.map(o => (
            <div
              key={o}
              className={`ss-option${selected.includes(o) ? ' selected' : ''}`}
              onClick={() => { onToggle(o); setQuery('') }}
            >
              <span className="ss-check">{selected.includes(o) ? '\u2713' : ''}</span>
              {o}
            </div>
          )) : (
            <div className="ss-empty">No options found</div>
          )}
        </div>
      )}
    </div>
  )
}

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
          Profile saved! Redirecting to your AI-powered path planner...
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
          <p className="section-desc">Select from the list or type your own qualification.</p>
          <SearchableSelect
            options={QUALIFICATIONS}
            value={form.highest_qualification}
            onChange={v => setForm(f => ({ ...f, highest_qualification: v }))}
            placeholder="Search or type your qualification..."
          />
        </div>

        {/* Goal */}
        <div className="profile-section">
          <h2 className="section-title">
            <span className="section-num">2</span>
            Your Career / Education Goal
          </h2>
          <p className="section-desc">Select a goal or type your own career aspiration.</p>
          <SearchableSelect
            options={GOALS}
            value={form.goal}
            onChange={v => setForm(f => ({ ...f, goal: v }))}
            placeholder="Search or type your goal..."
          />
        </div>

        {/* Skills */}
        <div className="profile-section">
          <h2 className="section-title">
            <span className="section-num">3</span>
            Your Current Skill Set
          </h2>
          <p className="section-desc">Select multiple skills or search to find specific ones.</p>
          <SearchableMultiSelect
            options={SKILL_OPTIONS}
            selected={selectedSkills}
            onToggle={toggleSkill}
            placeholder="Search and select skills..."
          />
          <div className="form-group" style={{marginTop: '16px'}}>
            <label className="form-label">Additional skills not in the list (optional):</label>
            <textarea
              className="form-input"
              rows={2}
              value={form.skills.split(', ').filter(s => !SKILL_OPTIONS.includes(s)).join(', ')}
              onChange={e => {
                const custom = e.target.value
                const fromChips = selectedSkills.filter(s => SKILL_OPTIONS.includes(s)).join(', ')
                setForm(f => ({ ...f, skills: [fromChips, custom].filter(Boolean).join(', ') }))
              }}
              placeholder="e.g. Robotics, Public Policy, Music..."
            />
          </div>
        </div>

        <div className="profile-actions">
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? <><span className="spinner" /> Saving...</> : 'Save Profile & Plan My Path'}
          </button>
        </div>
      </form>
    </div>
  )
}
