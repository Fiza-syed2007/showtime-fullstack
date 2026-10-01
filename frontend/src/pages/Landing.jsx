import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import MovieCard from '../components/MovieCard'
import { useAuth } from '../AuthContext'
import { api } from '../api'

export default function Landing() {
  const { token } = useAuth()
  const [movies, setMovies] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    api.movies().then(setMovies).catch(() => setError('Could not load movies right now.'))
  }, [])

  return (
    <div className="min-h-screen bg-ink">
      <Navbar />

      <section className="px-6 md:px-12 pt-8 pb-16 md:pt-16 md:pb-24">
        <div className="max-w-3xl">
          <p className="text-marquee font-medium mb-3">Now booking across Bengaluru & beyond</p>
          <h1 className="font-display text-5xl md:text-7xl leading-[1.05] mb-6">
            Grab your seat before the lights go down.
          </h1>
          <p className="text-muted text-lg max-w-xl mb-8">
            Browse what's playing, pick a showtime, and lock in your seats in under a minute.
            No queues, no printed tickets — just show up.
          </p>
          {!token && (
            <div className="flex gap-4">
              <Link to="/signup" className="px-6 py-3 rounded-full bg-marquee text-ink font-medium hover:brightness-110 transition">
                Create an account
              </Link>
              <Link to="/login" className="px-6 py-3 rounded-full border border-cream/20 font-medium hover:border-cream/50 transition">
                I already have one
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="px-6 md:px-12 pb-20">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="font-display text-2xl md:text-3xl">In theatres this week</h2>
          {token && <Link to="/dashboard" className="text-sm text-marquee hover:underline">Go to dashboard →</Link>}
        </div>

        {error && <p className="text-muted">{error}</p>}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              action={
                <Link
                  to={token ? '/dashboard' : '/signup'}
                  className="block text-center text-sm font-medium py-2 rounded-full border border-cream/20 hover:border-marquee hover:text-marquee transition"
                >
                  Book tickets
                </Link>
              }
            />
          ))}
        </div>
      </section>

      <footer className="px-6 md:px-12 py-8 border-t border-cream/10 text-sm text-muted">
        Built as a learning project. Not affiliated with any real ticketing service.
      </footer>
    </div>
  )
}
