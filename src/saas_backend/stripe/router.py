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
from saas_backend.stripe.stripe import update_user_plan_to_pro
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

    session = stripe.checkout.Session.create(
        customer=str(stripe_customer.id),
        payment_method_types=["card"],
        line_items=[{"price": request.price_id, "quantity": 1}],
        mode="subscription",
        success_url="http://localhost:3000/success",
        cancel_url="http://localhost:3000/cancel",
    )

    return JSONResponse(content={"url": session.url})


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
