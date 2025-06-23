# STL
import os

APP_MODE = os.environ.get("APP_MODE", "prod")
STRIPE_API_KEY = os.getenv("STRIPE_SECRET_KEY")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")
STRIPE_ENABLED = os.getenv("STRIPE_ENABLED", "true").lower() == "true"
