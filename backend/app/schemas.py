from pydantic import BaseModel, EmailStr, ConfigDict, field_validator


class SignUpRequest(BaseModel):
    name: str
    email: EmailStr
    password: str

    @field_validator("password")
    @classmethod
    def password_min_length(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long")
        return v

    @field_validator("name")
    @classmethod
    def name_not_blank(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Name is required")
        return v.strip()


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    email: EmailStr


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class MovieOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    genre: str
    language: str
    duration_mins: int
    rating: float
    price: float
    accent: str


class BookingCreate(BaseModel):
    movie_id: int
    show_time: str
    seats: int = 1

    @field_validator("seats")
    @classmethod
    def seats_range(cls, v: int) -> int:
        if v < 1 or v > 10:
            raise ValueError("Seats must be between 1 and 10")
        return v


class BookingOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    show_time: str
    seats: int
    movie: MovieOut
