from sqlalchemy.orm import Session
from . import models

DEMO_MOVIES = [
    dict(title="Nebula Heist", genre="Action / Thriller", language="English", duration_mins=142, rating=8.4, price=250, accent="#E23744"),
    dict(title="Monsoon Diaries", genre="Drama", language="Hindi", duration_mins=128, rating=8.1, price=200, accent="#3B82F6"),
    dict(title="Laugh Riot", genre="Comedy", language="English", duration_mins=110, rating=7.6, price=180, accent="#F59E0B"),
    dict(title="Shadow Protocol", genre="Sci-Fi", language="English", duration_mins=136, rating=8.7, price=280, accent="#8B5CF6"),
    dict(title="Karnataka Express", genre="Drama / Family", language="Kannada", duration_mins=145, rating=8.9, price=220, accent="#10B981"),
    dict(title="Midnight Raga", genre="Musical", language="Tamil", duration_mins=132, rating=8.0, price=210, accent="#EC4899"),
]


def seed_movies(db: Session) -> None:
    if db.query(models.Movie).first():
        return
    for m in DEMO_MOVIES:
        db.add(models.Movie(**m))
    db.commit()
