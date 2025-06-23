# PDM
import stripe
import stripe.error
from fastapi import Depends, Request, APIRouter, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse

# LOCAL
from saas_backend.constants import STRIPE_API_KEY, STRIPE_WEBHOOK_SECRET
from saas_backend.auth.models import User
from saas_backend.stripe.utils import get_or_create_stripe_customer
from saas_backend.auth.database import get_db
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
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    endpoint_secret = STRIPE_WEBHOOK_SECRET

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
    except stripe.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        # Lookup session.customer in DB and mark user as paid

    return {"status": "success"}
