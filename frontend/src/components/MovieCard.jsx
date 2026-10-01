import React from 'react'

export default function MovieCard({ movie, action }) {
  return (
    <div className="ticket-stub bg-panel rounded-xl overflow-hidden flex flex-col">
      <div
        className="h-28 flex items-end p-4"
        style={{ background: `linear-gradient(135deg, ${movie.accent}55, ${movie.accent}15)` }}
      >
        <span className="text-xs font-medium uppercase tracking-wide text-cream/80">{movie.language}</span>
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-display text-lg leading-snug">{movie.title}</h3>
        <p className="text-sm text-muted">{movie.genre} · {movie.duration_mins} min</p>
        <div className="flex items-center justify-between mt-1">
          <span className="text-sm text-stub font-medium">★ {movie.rating}</span>
          <span className="text-sm text-cream/80">₹{movie.price}</span>
        </div>
        {action && <div className="mt-3">{action}</div>}
      </div>
    </div>
  )
}
