# STL
from typing import final

# PDM
from pydantic import BaseModel
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship

# LOCAL
from saas_backend.auth.database import Base


class BaseUser(BaseModel):
    username: str
    password: str
    email: str


@final
class User(Base):
    __tablename__ = "user"
    id = Column(Integer, primary_key=True, index=True, unique=True, autoincrement=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    credits = Column(Integer, default=1)
    api_key_id = Column(Integer, ForeignKey("api_key.id"))

    stripe = relationship("StripeMetadata", back_populates="user", uselist=False)


@final
class StripeMetadata(Base):
    __tablename__ = "stripe_metadata"
    id = Column(String, primary_key=True, index=True, unique=True)  # stripe_customer_id
    user_id = Column(Integer, ForeignKey("user.id"), unique=True, index=True)
    subcription_plan = Column(String, index=True)
    stripe_subscription_id = Column(String, nullable=True)
    expires_at = Column(Integer, index=True)

    user = relationship("User", back_populates="stripe")


@final
class APIKey(Base):
    __tablename__ = "api_key"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"))
    api_key = Column(String)


@final
class Blacklist(Base):
    __tablename__ = "blacklist"
    id = Column(Integer, primary_key=True, index=True)
    jti = Column(String, unique=True, index=True)
    expires_at = Column(DateTime, index=True)
