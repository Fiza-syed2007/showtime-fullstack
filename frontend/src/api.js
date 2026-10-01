// Set VITE_API_URL in a .env file (frontend/.env) when deploying, e.g.:
// VITE_API_URL=https://your-backend.onrender.com
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (res.status === 204) return null

  let data = null
  try {
    data = await res.json()
  } catch {
    // no body
  }

  if (!res.ok) {
    const message = (data && data.detail) || 'Something went wrong. Please try again.'
    throw new Error(typeof message === 'string' ? message : 'Something went wrong.')
  }
  return data
}

export const api = {
  signup: (payload) => request('/auth/signup', { method: 'POST', body: payload }),
  login: (payload) => request('/auth/login', { method: 'POST', body: payload }),
  me: (token) => request('/auth/me', { token }),
  movies: () => request('/movies'),
  myBookings: (token) => request('/bookings', { token }),
  createBooking: (payload, token) => request('/bookings', { method: 'POST', body: payload, token }),
  cancelBooking: (id, token) => request(`/bookings/${id}`, { method: 'DELETE', token }),
}
