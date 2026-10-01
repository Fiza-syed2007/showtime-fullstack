import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import MovieCard from '../components/MovieCard'
import { useAuth } from '../AuthContext'
import { api } from '../api'

const SHOWTIMES = ['Today 3:30 PM', 'Today 7:00 PM', 'Today 9:45 PM', 'Tomorrow 6:15 PM']

export default function Dashboard() {
  const { token } = useAuth()
  const [movies, setMovies] = useState([])
  const [bookings, setBookings] = useState([])
  const [openMovieId, setOpenMovieId] = useState(null)
  const [showTime, setShowTime] = useState(SHOWTIMES[0])
  const [seats, setSeats] = useState(2)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function refresh() {
    const [m, b] = await Promise.all([api.movies(), api.myBookings(token)])
    setMovies(m)
    setBookings(b)
  }

  useEffect(() => {
    refresh().catch(() => setError('Could not load your data right now.'))
  }, [])

  async function handleBook(movieId) {
    setBusy(true)
    setError('')
    try {
      await api.createBooking({ movie_id: movieId, show_time: showTime, seats: Number(seats) }, token)
      setOpenMovieId(null)
      await refresh()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function handleCancel(bookingId) {
    setBusy(true)
    setError('')
    try {
      await api.cancelBooking(bookingId, token)
      await refresh()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen bg-ink">
      <Navbar />

      <section className="px-6 md:px-12 pt-4 pb-12">
        <h1 className="font-display text-3xl md:text-4xl mb-8">Your bookings</h1>

        {error && <p className="text-marquee text-sm mb-4">{error}</p>}

        {bookings.length === 0 ? (
          <p className="text-muted mb-12">
            No bookings yet — pick a movie below and reserve your seats.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {bookings.map((b) => (
              <div key={b.id} className="ticket-stub bg-panel rounded-xl p-4 flex items-center justify-between gap-3">
                <div>
                  <p className="font-display text-lg">{b.movie.title}</p>
                  <p className="text-sm text-muted">{b.show_time} · {b.seats} seat{b.seats > 1 ? 's' : ''}</p>
                  <p className="text-sm text-stub">₹{b.movie.price * b.seats} total</p>
                </div>
                <button
                  onClick={() => handleCancel(b.id)}
                  disabled={busy}
                  className="text-sm px-3 py-2 rounded-full border border-cream/20 hover:border-marquee hover:text-marquee transition disabled:opacity-60"
                >
                  Cancel
                </button>
              </div>
            ))}
          </div>
        )}

        <h2 className="font-display text-2xl mb-6">Browse movies</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              action={
                openMovieId === movie.id ? (
                  <div className="flex flex-col gap-2 mt-1">
                    <select
                      value={showTime}
                      onChange={(e) => setShowTime(e.target.value)}
                      className="bg-ink border border-cream/15 rounded-lg px-2 py-2 text-sm"
                    >
                      {SHOWTIMES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={seats}
                      onChange={(e) => setSeats(e.target.value)}
                      className="bg-ink border border-cream/15 rounded-lg px-2 py-2 text-sm"
                    />
                    <button
                      onClick={() => handleBook(movie.id)}
                      disabled={busy}
                      className="text-sm font-medium py-2 rounded-full bg-marquee text-ink hover:brightness-110 transition disabled:opacity-60"
                    >
                      Confirm booking
                    </button>
                    <button
                      onClick={() => setOpenMovieId(null)}
                      className="text-xs text-muted hover:text-cream transition"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setOpenMovieId(movie.id)}
                    className="w-full text-center text-sm font-medium py-2 rounded-full border border-cream/20 hover:border-marquee hover:text-marquee transition"
                  >
                    Book tickets
                  </button>
                )
              }
            />
          ))}
        </div>
      </section>
    </div>
  )
}
