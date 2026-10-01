import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { api } from '../api'
import { useAuth } from '../AuthContext'

export default function SignUp() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const data = await api.signup(form)
      login(data.access_token, data.user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-ink">
      <Navbar />
      <div className="flex justify-center px-6 pt-8 pb-20">
        <div className="w-full max-w-md">
          <h1 className="font-display text-3xl mb-2">Create your account</h1>
          <p className="text-muted mb-8">Sign up to start booking shows near you.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm text-cream/80">Full name</span>
              <input
                type="text"
                required
                value={form.name}
                onChange={update('name')}
                className="bg-panel border border-cream/15 rounded-lg px-4 py-3 text-cream focus:outline-none focus:border-marquee"
                placeholder="Ananya Rao"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm text-cream/80">Email</span>
              <input
                type="email"
                required
                value={form.email}
                onChange={update('email')}
                className="bg-panel border border-cream/15 rounded-lg px-4 py-3 text-cream focus:outline-none focus:border-marquee"
                placeholder="you@example.com"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm text-cream/80">Password</span>
              <input
                type="password"
                required
                minLength={8}
                value={form.password}
                onChange={update('password')}
                className="bg-panel border border-cream/15 rounded-lg px-4 py-3 text-cream focus:outline-none focus:border-marquee"
                placeholder="At least 8 characters"
              />
            </label>

            {error && <p className="text-marquee text-sm">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 px-6 py-3 rounded-full bg-marquee text-ink font-medium hover:brightness-110 transition disabled:opacity-60"
            >
              {submitting ? 'Creating account…' : 'Sign up'}
            </button>
          </form>

          <p className="text-muted text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-marquee hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
