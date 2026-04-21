import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register, user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    first_name: '', last_name: '', dob: '', phone: '', email: '', password: '', confirm_password: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)

  useEffect(() => { if (user) navigate('/') }, [user])

  const validate = () => {
    const e = {}
    if (!form.first_name.trim()) e.first_name = 'First name is required'
    if (!form.last_name.trim()) e.last_name = 'Last name is required'
    if (!form.dob) e.dob = 'Date of birth is required'
    if (!form.phone.match(/^[6-9]\d{9}$/)) e.phone = 'Enter valid 10-digit Indian mobile number'
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Enter a valid email address'
    if (form.password.length < 8) e.password = 'Password must be at least 8 characters'
    if (!/[A-Z]/.test(form.password)) e.password = (e.password || '') + ' Include uppercase letter.'
    if (!/[0-9]/.test(form.password)) e.password = (e.password || '') + ' Include a number.'
    if (form.password !== form.confirm_password) e.confirm_password = 'Passwords do not match'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    setErrors({})
    const result = await register(form)
    setLoading(false)
    if (result.error) setErrors({ api: result.error })
    else navigate('/build-profile')
  }

  const field = (name, label, type = 'text', placeholder = '') => (
    <div className="form-group" key={name}>
      <label className="form-label">{label}</label>
      <input
        className={`form-input${errors[name] ? ' input-error' : ''}`}
        type={name.includes('password') && !showPw ? 'password' : type === 'password' ? (showPw ? 'text' : 'password') : type}
        value={form[name]}
        onChange={e => setForm(p => ({ ...p, [name]: e.target.value }))}
        placeholder={placeholder}
        autoComplete={name === 'password' ? 'new-password' : name === 'confirm_password' ? 'new-password' : name}
      />
      {errors[name] && <span className="form-error">{errors[name]}</span>}
    </div>
  )

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">🎓</div>
          <h1>Create Your Account</h1>
          <p>Join EduGuide India — your personal education companion</p>
        </div>

        {errors.api && <div className="alert alert-error">{errors.api}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            {field('first_name', 'First Name', 'text', 'e.g. Rahul')}
            {field('last_name', 'Last Name', 'text', 'e.g. Sharma')}
          </div>
          <div className="form-row">
            {field('dob', 'Date of Birth', 'date')}
            {field('phone', 'Phone Number', 'tel', 'e.g. 9876543210')}
          </div>
          {field('email', 'Email Address', 'email', 'you@example.com')}

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="pw-wrap">
              <input
                className={`form-input${errors.password ? ' input-error' : ''}`}
                type={showPw ? 'text' : 'password'}
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                placeholder="Min 8 chars, 1 uppercase, 1 number"
                autoComplete="new-password"
              />
              <button type="button" className="pw-toggle" onClick={() => setShowPw(!showPw)}>
                {showPw ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.password && <span className="form-error">{errors.password}</span>}
            <PasswordStrength password={form.password} />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              className={`form-input${errors.confirm_password ? ' input-error' : ''}`}
              type={showPw ? 'text' : 'password'}
              value={form.confirm_password}
              onChange={e => setForm(p => ({ ...p, confirm_password: e.target.value }))}
              placeholder="Re-enter your password"
              autoComplete="new-password"
            />
            {errors.confirm_password && <span className="form-error">{errors.confirm_password}</span>}
          </div>

          <div className="security-note">
            🔒 Your data is encrypted with AES-256-GCM. We never store sensitive data in plain text.
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? <span className="spinner" /> : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

function PasswordStrength({ password }) {
  if (!password) return null
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  if (password.length >= 12) score++

  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong']
  const colors = ['', '#ef4444', '#f59e0b', '#eab308', '#10b981', '#059669']

  return (
    <div className="pw-strength">
      <div className="pw-bars">
        {[1,2,3,4,5].map(i => (
          <div key={i} className="pw-bar" style={{ background: i <= score ? colors[score] : '#e2e8f0' }} />
        ))}
      </div>
      <span style={{ color: colors[score], fontSize: '0.75rem', fontWeight: 600 }}>{labels[score]}</span>
    </div>
  )
}
