import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../utils/api'

export default function Register() {
  const { register, user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    first_name: '', last_name: '', dob: '', phone: '', email: '', password: '', confirm_password: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [step, setStep] = useState('form')
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', ''])
  const [otpLoading, setOtpLoading] = useState(false)
  const [otpError, setOtpError] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  const otpRefs = useRef([])

  useEffect(() => { if (user) navigate('/') }, [user])
  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(t)
    }
  }, [resendTimer])

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

  const handleSendOtp = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setOtpLoading(true)
    setOtpError('')
    const result = await api.post('/api/send-otp', { email: form.email })
    setOtpLoading(false)
    if (result.error) {
      setErrors({ api: result.error })
    } else {
      setOtpSent(true)
      setStep('otp')
      setResendTimer(60)
      setOtpValues(['', '', '', '', '', ''])
      setTimeout(() => otpRefs.current[0]?.focus(), 100)
    }
  }

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otpValues]
    newOtp[index] = value.slice(-1)
    setOtpValues(newOtp)
    if (value && index < 5) otpRefs.current[index + 1]?.focus()
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0)
      otpRefs.current[index - 1]?.focus()
  }

  const handleOtpPaste = (e) => {
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (paste.length === 6) {
      setOtpValues(paste.split(''))
      otpRefs.current[5]?.focus()
      e.preventDefault()
    }
  }

  const handleVerifyOtp = async () => {
    const otp = otpValues.join('')
    if (otp.length !== 6) { setOtpError('Please enter the complete 6-digit code'); return }
    setOtpLoading(true)
    setOtpError('')
    const result = await api.post('/api/verify-otp', { email: form.email, otp })
    setOtpLoading(false)
    if (result.error) {
      setOtpError(result.error)
      setOtpValues(['', '', '', '', '', ''])
      otpRefs.current[0]?.focus()
    } else {
      await completeRegistration()
    }
  }

  const completeRegistration = async () => {
    setLoading(true)
    setErrors({})
    const result = await register(form)
    setLoading(false)
    if (result.error) {
      setErrors({ api: result.error })
      setStep('form')
    } else {
      setStep('done')
      setTimeout(() => navigate('/'), 2000)
    }
  }

  const handleResendOtp = async () => {
    if (resendTimer > 0) return
    setOtpLoading(true)
    setOtpError('')
    const result = await api.post('/api/send-otp', { email: form.email })
    setOtpLoading(false)
    if (result.error) setOtpError(result.error)
    else {
      setResendTimer(60)
      setOtpValues(['', '', '', '', '', ''])
      otpRefs.current[0]?.focus()
    }
  }

  const field = (name, label, type = 'text', placeholder = '') => (
    <div className="field" key={name}>
      <label>{label}</label>
      <input
        type={name.includes('password') && !showPw ? 'password' : type === 'password' ? (showPw ? 'text' : 'password') : type}
        value={form[name]}
        onChange={e => setForm(p => ({ ...p, [name]: e.target.value }))}
        placeholder={placeholder}
        autoComplete={name === 'password' ? 'new-password' : name === 'confirm_password' ? 'new-password' : name}
        disabled={step === 'otp'}
        className={errors[name] ? 'input-error' : ''}
      />
      {errors[name] && <span className="field-error">{errors[name]}</span>}
    </div>
  )

  return (
    <div className="login-page">
      {/* Header - reuse from login */}
      <header className="login-header">
        <div className="login-header-inner">
          <div className="login-logo">
            <div className="logo-icon">
              <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" fill="#f9a825" opacity="0.2"/>
                <path d="M20 6L8 14v12l12 8 12-8V14L20 6z" fill="#f9a825" opacity="0.3"/>
                <path d="M20 10l-8 5.5v9L20 30l8-5.5v-9L20 10z" fill="#1a237e"/>
                <path d="M16 18h8M16 21h6M16 24h4" stroke="#f9a825" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="logo-text">
               <h1>Vidya <span>Maarg</span></h1>
            </div>
          </div>
        </div>
      </header>

      <main className="login-main">
        {/* Left Illustration */}
        <div className="login-illustration">
          <div className="illustration-content">
            <svg viewBox="0 0 600 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="hero-svg">
              <circle cx="300" cy="250" r="200" fill="#1a237e" opacity="0.05"/>
              <circle cx="300" cy="250" r="150" fill="#534bae" opacity="0.05"/>
              <rect x="120" y="280" width="140" height="20" rx="3" fill="#1a237e" opacity="0.8"/>
              <rect x="125" y="260" width="130" height="20" rx="3" fill="#534bae" opacity="0.8"/>
              <rect x="130" y="240" width="120" height="20" rx="3" fill="#f9a825" opacity="0.8"/>
              <rect x="135" y="220" width="110" height="20" rx="3" fill="#1a237e" opacity="0.6"/>
              <polygon points="300,100 240,140 300,160 360,140" fill="#1a237e"/>
              <rect x="295" y="100" width="10" height="8" fill="#1a237e"/>
              <circle cx="300" cy="96" r="6" fill="#f9a825"/>
              <line x1="360" y1="140" x2="360" y2="175" stroke="#f9a825" strokeWidth="2"/>
              <circle cx="360" cy="178" r="4" fill="#f9a825"/>
              <rect x="270" y="155" width="60" height="10" rx="2" fill="#1a237e" opacity="0.7"/>
              <path d="M150 380 Q250 340 300 360 Q350 380 400 340 Q450 300 500 320" stroke="#f9a825" strokeWidth="3" strokeDasharray="8 4" fill="none" opacity="0.5"/>
              <circle cx="150" cy="380" r="6" fill="#1a237e" opacity="0.5"/>
              <circle cx="300" cy="360" r="6" fill="#534bae" opacity="0.5"/>
              <circle cx="500" cy="320" r="8" fill="#f9a825" opacity="0.7"/>
              <polygon points="480,120 484,132 496,132 486,140 490,152 480,144 470,152 474,140 464,132 476,132" fill="#f9a825" opacity="0.4"/>
            </svg>
            <div className="illustration-text">
              <h2>Begin Your Journey</h2>
              <p>Create your account and unlock AI-powered education guidance tailored just for you.</p>
              <div className="feature-pills">
                <span className="pill">AI Roadmap</span>
                <span className="pill">Entrance Exams</span>
                <span className="pill">College Finder</span>
                <span className="pill">Milestone Tracker</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Register Form */}
        <div className="login-form-section register-form-section">
          <div className="login-card register-card">
            <div className="login-card-header">
              <h2>{step === 'otp' ? 'Verify Email' : step === 'done' ? 'Welcome!' : 'Create Account'}</h2>
              <p>{step === 'otp'
                ? `6-digit code sent to ${form.email}`
                : step === 'done'
                ? 'Account created successfully!'
                : 'Join Vidya Maarg'}</p>
            </div>

            {errors.api && <div className="alert-error">{errors.api}</div>}

            {/* Step 1: Form */}
            {step === 'form' && (
              <form onSubmit={handleSendOtp} className="login-form register-form">
                <div className="field-row">
                  {field('first_name', 'First Name', 'text', 'Your Name')}
                  {field('last_name', 'Last Name', 'text', 'Your Surname')}
                </div>
                <div className="field-row">
                  {field('dob', 'Date of Birth', 'date')}
                  {field('phone', 'Phone', 'tel', '9876543210')}
                </div>
                {field('email', 'Email', 'email', 'you@example.com')}

                <div className="field">
                  <label>Password</label>
                  <div className="pw-field">
                    <input
                      type={showPw ? 'text' : 'password'}
                      value={form.password}
                      onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                      placeholder="Min 8 chars, 1 uppercase, 1 number"
                      autoComplete="new-password"
                      className={errors.password ? 'input-error' : ''}
                    />
                    <button type="button" className="pw-eye" onClick={() => setShowPw(!showPw)}>
                      {showPw ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  {errors.password && <span className="field-error">{errors.password}</span>}
                  <PasswordStrength password={form.password} />
                </div>

                {field('confirm_password', 'Confirm Password', 'password', 'Re-enter password')}

                <button type="submit" className="btn-login" disabled={otpLoading}>
                  {otpLoading ? 'Sending code...' : 'Continue & Verify Email'}
                </button>
              </form>
            )}

            {/* Step 2: OTP */}
            {step === 'otp' && (
              <div className="otp-section">
                {otpError && <div className="alert-error">{otpError}</div>}
                <div className="otp-boxes" onPaste={handleOtpPaste}>
                  {otpValues.map((val, i) => (
                    <input
                      key={i}
                      ref={el => otpRefs.current[i] = el}
                      className={`otp-box ${val ? 'filled' : ''}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={val}
                      onChange={e => handleOtpChange(i, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(i, e)}
                      autoFocus={i === 0}
                    />
                  ))}
                </div>
                <button
                  className="btn-login"
                  onClick={handleVerifyOtp}
                  disabled={otpLoading || otpValues.join('').length !== 6}
                >
                  {otpLoading ? 'Verifying...' : loading ? 'Creating account...' : 'Verify & Create Account'}
                </button>
                <div className="otp-actions">
                  <span className="otp-timer">
                    {resendTimer > 0
                      ? `Resend in ${resendTimer}s`
                      : <button className="link-btn" onClick={handleResendOtp} disabled={otpLoading}>Resend Code</button>}
                  </span>
                  <button className="link-btn" onClick={() => { setStep('form'); setOtpError('') }}>
                    Change details
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Done */}
            {step === 'done' && (
              <div className="done-section">
                <div className="done-check">&#10003;</div>
                <h3>Account Created!</h3>
                <p>Redirecting to profile builder...</p>
              </div>
            )}

            {step !== 'done' && (
              <p className="switch-auth">
                Already have an account? <Link to="/login">Sign in</Link>
              </p>
            )}
          </div>
        </div>
      </main>

      <footer className="login-footer">
        <p className="gita-slogan">
          "No matter how hard or impossible it is, never lose sight of your goal"
        </p>
        <p className="gita-source">- Monkey D. Luffy</p>
      </footer>
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
  const colors = ['', '#c62828', '#f9a825', '#c17900', '#2e7d32', '#1a237e']
  return (
    <div className="pw-strength">
      <div className="pw-bars">
        {[1,2,3,4,5].map(i => (
          <div key={i} className="pw-bar" style={{ background: i <= score ? colors[score] : '#e0e0e0' }} />
        ))}
      </div>
      <span style={{ color: colors[score], fontSize: '0.72rem', fontWeight: 600 }}>{labels[score]}</span>
    </div>
  )
}
