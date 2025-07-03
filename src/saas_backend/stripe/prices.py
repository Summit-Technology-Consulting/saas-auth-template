# STL
import os

# LOCAL
from saas_backend.auth.models import PriceId
from saas_backend.auth.database import get_db

PRICE_IDS = {
    "pro": os.getenv("PRO_PLAN_PRICE_ID"),
}


def insert_price_ids_on_startup():
    db = next(get_db())
    for name, id in PRICE_IDS.items():
        existing = db.query(PriceId).filter_by(id=id).first()
        if not existing:
            db.add(PriceId(id=id, name=name))

    db.commit()
    db.close()
