# STL
import logging
from contextlib import asynccontextmanager

# PDM
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware

# LOCAL
from saas_backend.auth.models import User
from saas_backend.auth.router import router as auth_router
from saas_backend.auth.database import Base, engine
from saas_backend.stripe.router import router as stripe_router
from saas_backend.auth.user_manager.user_manager import UserManager

_ = load_dotenv()


@asynccontextmanager
async def lifespan(_: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(lifespan=lifespan)

app.include_router(auth_router)
app.include_router(stripe_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"message": "OK"}


@app.get("/requires-auth")
def requires_auth(
    user: User = Depends(UserManager.get_user_from_header),
):
    return JSONResponse(content={"username": user.username})


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    exc_str = f"{exc}".replace("\n", " ").replace("   ", " ")
    logging.error(f"{request}: {exc_str}")
    content = {"status_code": 10422, "message": exc_str, "data": None}
    return JSONResponse(
        content=content, status_code=status.HTTP_422_UNPROCESSABLE_ENTITY
    )
