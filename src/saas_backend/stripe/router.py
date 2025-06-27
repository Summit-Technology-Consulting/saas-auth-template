# STL
import traceback

# PDM
import stripe
import stripe.error
from fastapi import Depends, Request, APIRouter, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse

# LOCAL
from saas_backend.constants import STRIPE_API_KEY, STRIPE_WEBHOOK_SECRET
from saas_backend.auth.models import User, StripeMetadata
from saas_backend.stripe.utils import get_or_create_stripe_customer
from saas_backend.auth.database import get_db
from saas_backend.stripe.stripe import (
    update_user_plan_to_pro,
    reactivate_user_subscription,
)
from saas_backend.auth.user_manager.user_manager import UserManager

router = APIRouter(prefix="/stripe")
stripe.api_key = STRIPE_API_KEY


class CheckoutSessionRequest(BaseModel):
    price_id: str


@router.post("/create-checkout-session")
def create_checkout_session(
    request: CheckoutSessionRequest,
    user: User = Depends(UserManager.get_user_from_header),
    db: Session = Depends(get_db),
):
    stripe_customer = get_or_create_stripe_customer(db, user)

    subscriptions = stripe.Subscription.list(
        customer=str(stripe_customer.id),
        status="all",
        expand=["data.default_payment_method"],
    )

    for sub in subscriptions.data:
        if sub.status == "active":
            if sub.cancel_at_period_end:
                # Reactivate the subscription
                stripe.Subscription.modify(sub.id, cancel_at_period_end=False)
                reactivate_user_subscription(user.id, db)
                return JSONResponse(content={"message": "Subscription reactivated"})
            else:
                # Already subscribed
                raise HTTPException(
                    status_code=400, detail="You already have an active subscription."
                )
        elif sub.status == "trialing":
            raise HTTPException(
                status_code=400, detail="You already have a trialing subscription."
            )

    # No valid subscription, proceed to create a new checkout session
    session = stripe.checkout.Session.create(
        customer=str(stripe_customer.id),
        payment_method_types=["card"],
        line_items=[{"price": request.price_id, "quantity": 1}],
        mode="subscription",
        success_url="http://localhost:3000/success",
        cancel_url="http://localhost:3000/cancel",
    )

    return JSONResponse(content={"url": session.url})


@router.post("/cancel-subscription")
def cancel_subscription(
    user: User = Depends(UserManager.get_user_from_header),
    db: Session = Depends(get_db),
):
    """Cancel the user's active subscription"""
    try:
        # Get user's stripe metadata
        stripe_metadata = (
            db.query(StripeMetadata).filter(StripeMetadata.user_id == user.id).first()
        )

        if not stripe_metadata or not stripe_metadata.stripe_subscription_id:
            raise HTTPException(
                status_code=400, detail="No active subscription found to cancel"
            )

        # Cancel the subscription in Stripe
        subscription = stripe.Subscription.modify(
            stripe_metadata.stripe_subscription_id, cancel_at_period_end=True
        )

        print(subscription)

        # Update the user's plan to free
        stripe_metadata.subcription_plan = "canceled"  # type: ignore
        db.commit()

        return JSONResponse(
            content={
                "message": "Subscription cancelled successfully",
            }
        )

    except Exception as e:
        if "stripe" in str(e).lower():
            traceback.print_exc()
            raise HTTPException(status_code=400, detail=f"Stripe error: {str(e)}")

        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("/webhook")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    endpoint_secret = STRIPE_WEBHOOK_SECRET

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
    except stripe.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")

    event_type = event["type"]

    # Subscription Started
    if event_type == "customer.subscription.created":
        subscription = event["data"]["object"]
        stripe_customer_id = subscription.get("customer")
        subscription_id = subscription.get("id")
        current_period_end = subscription["items"]["data"][0]["current_period_end"]

        expires_at = current_period_end if current_period_end else None

        subscription_data = {
            "subscription_id": subscription_id,
            "expires_at": expires_at,
        }

        if update_user_plan_to_pro(stripe_customer_id, subscription_data, db):
            return JSONResponse(content={"status": "created"})

    # Subscription Renewed (Payment Success)
    elif event_type == "invoice.payment_succeeded":
        invoice = event["data"]["object"]
        if invoice.get("billing_reason") == "subscription_cycle":
            stripe_customer_id = invoice.get("customer")
            subscription_id = invoice.get("subscription")
            current_period_end = invoice.get("lines")["data"][0]["period"]["end"]

            subscription_data = {
                "subscription_id": subscription_id,
                "expires_at": current_period_end,
            }

            if update_user_plan_to_pro(stripe_customer_id, subscription_data, db):
                return JSONResponse(content={"status": "renewed"})

    # Subscription Cancelled
    elif event_type == "customer.subscription.deleted":
        subscription = event["data"]["object"]
        stripe_customer_id = subscription.get("customer")

        # Optional: also clear subscription_id or plan if needed
        stripe_meta = (
            db.query(StripeMetadata)
            .filter(StripeMetadata.id == stripe_customer_id)
            .first()
        )
        if stripe_meta:
            stripe_meta.expires_at = 0  # type: ignore
            stripe_meta.subcription_plan = "free"  # type: ignore
            stripe_meta.stripe_subscription_id = None  # type: ignore
            db.commit()
            return JSONResponse(content={"status": "cancelled"})

    return JSONResponse(content={"status": "ignored"})
