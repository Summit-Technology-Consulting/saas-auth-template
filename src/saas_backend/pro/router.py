# STL
from typing import Any

# PDM
from fastapi import Depends, APIRouter
from pydantic import BaseModel
from fastapi.responses import JSONResponse

# LOCAL
from saas_backend.auth.models import User
from saas_backend.stripe.stripe import require_pro_subscription

router = APIRouter(prefix="/pro")


class ProFeatureResponse(BaseModel):
    feature_name: str
    description: str
    available: bool


class AdvancedDataResponse(BaseModel):
    data_id: str
    content: str
    premium_metrics: dict[str, Any]


@router.get("/premium")
def get_premium_route(_: User = Depends(require_pro_subscription)):
    return JSONResponse(content={"is_premium": True})
