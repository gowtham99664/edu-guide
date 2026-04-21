import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('eg_token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      api.get('/api/me', token)
        .then(data => { if (!data.error) setUser(data) })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const register = async (formData) => {
    const res = await api.post('/api/register', formData)
    if (res.error) return { error: res.error }
    const tok = res.access_token
    localStorage.setItem('eg_token', tok)
    setToken(tok)
    // Fetch user info
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

  const logout = () => {
    localStorage.removeItem('eg_token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
