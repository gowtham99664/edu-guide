const BASE_URL = import.meta.env.VITE_API_URL || `${window.location.protocol}//${window.location.hostname}:1207`

async function request(method, path, body, token) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })
    const data = await res.json()
    if (!res.ok) return { error: data.detail || 'Something went wrong' }
    return data
  } catch {
    return { error: 'Cannot connect to server. Please try again.' }
  }
}

export const api = {
  get:  (path, token)       => request('GET',  path, null, token),
  post: (path, body, token) => request('POST', path, body, token),
}
