# STL
import time
from typing import Any

# PDM
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session

# LOCAL
from saas_backend.auth.models import StripeMetadata
from saas_backend.auth.database import get_db


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


def verify_active_subscription(user_id: str, db: Session = Depends(get_db)):
    stripe_meta = db.query(StripeMetadata).filter(StripeMetadata.id == user_id).first()

    if not stripe_meta:
        raise HTTPException(status_code=404, detail="User subscription not found.")

    if stripe_meta.expires_at < int(time.time()):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Subscription has expired.",
        )

    return True
