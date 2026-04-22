import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { api } from '../utils/api'

const AuthContext = createContext(null)

const IDLE_TIMEOUT = 30 * 60 * 1000 // 30 minutes

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('eg_token'))
  const [loading, setLoading] = useState(true)
  const idleTimer = useRef(null)

  useEffect(() => {
    if (token) {
      api.get('/api/me', token)
        .then(data => { if (!data.error) setUser(data) })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const doLogout = useCallback(() => {
    localStorage.removeItem('eg_token')
    setToken(null)
    setUser(null)
  }, [])

  // Idle auto-logout
  useEffect(() => {
    if (!user) return

    const resetTimer = () => {
      if (idleTimer.current) clearTimeout(idleTimer.current)
      idleTimer.current = setTimeout(() => {
        doLogout()
        // Force redirect to login — Layout/ProtectedRoute will handle it
        window.location.href = '/login'
      }, IDLE_TIMEOUT)
    }

    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click']
    events.forEach(ev => window.addEventListener(ev, resetTimer, { passive: true }))
    resetTimer() // Start initial timer

    return () => {
      events.forEach(ev => window.removeEventListener(ev, resetTimer))
      if (idleTimer.current) clearTimeout(idleTimer.current)
    }
  }, [user, doLogout])

  const register = async (formData) => {
    const res = await api.post('/api/register', formData)
    if (res.error) return { error: res.error }
    const tok = res.access_token
    localStorage.setItem('eg_token', tok)
    setToken(tok)
    const me = await api.get('/api/me', tok)
    if (!me.error) setUser(me)
    return { ok: true }
  }

  const login = async (email, password) => {
    const res = await api.post('/api/login', { email, password })
    if (res.error) return { error: res.error }
    const tok = res.access_token
    localStorage.setItem('eg_token', tok)
    setToken(tok)
    setUser(res.user)
    return { ok: true }
  }

  const logout = doLogout

  return (
    <AuthContext.Provider value={{ user, token, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
