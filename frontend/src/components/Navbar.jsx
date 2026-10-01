import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'

export default function Navbar() {
  const { token, user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="flex items-center justify-between px-6 md:px-12 py-6">
      <Link to="/" className="font-display text-2xl tracking-tight text-cream">
        Show<span className="text-marquee">Time</span>
      </Link>
      <nav className="flex items-center gap-4">
        {token ? (
          <>
            <span className="hidden sm:inline text-sm text-muted">Hi, {user?.name?.split(' ')[0] || 'there'}</span>
            <Link
              to="/dashboard"
              className="text-sm font-medium px-4 py-2 rounded-full border border-cream/20 hover:border-cream/50 transition-colors"
            >
              My bookings
            </Link>
            <button
              onClick={() => {
                logout()
                navigate('/')
              }}
              className="text-sm font-medium px-4 py-2 rounded-full bg-marquee text-ink hover:brightness-110 transition"
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm font-medium px-4 py-2 rounded-full border border-cream/20 hover:border-cream/50 transition-colors">
              Log in
            </Link>
            <Link to="/signup" className="text-sm font-medium px-4 py-2 rounded-full bg-marquee text-ink hover:brightness-110 transition">
              Sign up
            </Link>
          </>
        )}
      </nav>
    </header>
  )
}
