# PDM
import stripe
from sqlalchemy.orm import Session

# LOCAL
from saas_backend.auth.models import User, StripeMetadata


def get_or_create_stripe_customer(
    db: Session, user: User, plan: str = "free"
) -> StripeMetadata:
    metadata = db.query(StripeMetadata).filter_by(user_id=user.id).first()

    if metadata:
        return metadata

    stripe_customer = stripe.Customer.create(
        email=user.email or "testcustomer@test.com", metadata={"user_id": str(user.id)}
    )

    metadata = StripeMetadata(
        id=stripe_customer.id,
        user_id=user.id,
        subcription_plan=plan,
    )

    db.add(metadata)
    db.commit()
    db.refresh(metadata)

    return metadata
