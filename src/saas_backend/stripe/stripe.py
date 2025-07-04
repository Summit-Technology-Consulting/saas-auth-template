# STL
import time
from typing import Any

# PDM
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session

# LOCAL
from saas_backend.auth.models import User, PriceId, StripeMetadata
from saas_backend.auth.database import get_db
from saas_backend.auth.user_manager.user_manager import UserManager


def get_customer_stripe_data(id: int, db: Session):
    stripe_meta = db.query(StripeMetadata).filter(StripeMetadata.user_id == id).first()

    return stripe_meta or None


def get_customer_from_stripe_id(id: str, db: Session):
    stripe_meta = db.query(StripeMetadata).filter(StripeMetadata.id == id).first()
    if not stripe_meta:
        return None

    user = db.query(User).filter(User.id == stripe_meta.user_id)

    return user.first() or None


def update_user_plan_to_pro(
    stripe_customer_id: str, subscription_data: dict[str, Any], db: Session
):
    stripe_meta = (
        db.query(StripeMetadata).filter(StripeMetadata.id == stripe_customer_id).first()
    )

    if not stripe_meta:
        return False

    stripe_meta.subcription_plan = "pro"  # type: ignore
    stripe_meta.expires_at = subscription_data.get("expires_at")  # type: ignore
    stripe_meta.stripe_subscription_id = subscription_data.get("subscription_id")  # type: ignore

    db.commit()

    return True


def reactivate_user_subscription(customer_id: int, db: Session):
    customer = get_customer_stripe_data(customer_id, db)

    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="That customer does not exist.",
        )

    customer.subcription_plan = "pro"  # type: ignore
    db.commit()

    return True


def verify_active_subscription(user_id: int, db: Session = Depends(get_db)):
    stripe_meta = (
        db.query(StripeMetadata).filter(StripeMetadata.user_id == user_id).first()
    )

    if not stripe_meta:
        raise HTTPException(status_code=404, detail="User subscription not found.")

    if not stripe_meta.expires_at:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to access this resource.",
        )

    if stripe_meta.expires_at < int(time.time()):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Subscription has expired.",
        )

    return True


def require_pro_subscription(
    user: User = Depends(UserManager.get_user_from_header),
    db: Session = Depends(get_db),
):
    """Dependency that verifies user has an active pro subscription"""
    verify_active_subscription(user.id, db)
    return user


def get_price_id_from_name(name: str, db: Session):
    price_id = db.query(PriceId).filter(PriceId.name == name).first()

    if not price_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    return price_id.id
