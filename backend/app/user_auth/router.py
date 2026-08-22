from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.dependencies import get_current_user
from app.user_auth.models import User
from app.user_auth.schemas import (
    UserRegister,
    UserLogin,
    GoogleAuthRequest,
    TokenResponse,
    RefreshTokenRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    UserRead,
    UserProfileRead,
    UserProfileUpdate,
)
from app.user_auth.service import (
    register_user,
    authenticate_user,
    google_authenticate,
    create_password_reset_token,
    reset_password_with_token,
    update_user_profile,
)
from app.user_auth.utils import decode_token, create_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def register(data: UserRegister, db: AsyncSession = Depends(get_db)):
    """Register a new user with email, name, password, and optional role."""
    return await register_user(db, data)


@router.post("/login", response_model=TokenResponse)
async def login(data: UserLogin, db: AsyncSession = Depends(get_db)):
    """Authenticate with email and password to receive JWT tokens."""
    return await authenticate_user(db, data)


@router.post("/google", response_model=TokenResponse)
async def google_login(data: GoogleAuthRequest, db: AsyncSession = Depends(get_db)):
    """Sign in or register with Google OAuth credentials."""
    return await google_authenticate(db, data)


@router.post("/refresh")
async def refresh_token(data: RefreshTokenRequest):
    """Obtain a new access token using a valid refresh token."""
    payload = decode_token(data.refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token.",
        )
    new_access = create_access_token(payload.get("sub"))
    return {"access_token": new_access, "token_type": "bearer"}


@router.post("/forgot-password")
async def forgot_password(data: ForgotPasswordRequest, db: AsyncSession = Depends(get_db)):
    """Initiate password reset flow for forgotten passwords."""
    token = await create_password_reset_token(db, data.email)
    # In production, email/SMS this token or reset link. In dev, return status.
    return {
        "message": "If this email is registered, password reset instructions have been generated.",
        "dev_reset_token": token,  # Provided in dev for convenient testing
    }


@router.post("/reset-password")
async def reset_password(data: ResetPasswordRequest, db: AsyncSession = Depends(get_db)):
    """Reset user password using a verified reset token."""
    await reset_password_with_token(db, data)
    return {"message": "Password has been successfully updated. You can now login."}


@router.get("/me", response_model=UserRead)
async def get_me(current_user: User = Depends(get_current_user)):
    """Get the currently authenticated user's profile and details."""
    return current_user


@router.patch("/profile", response_model=UserProfileRead)
async def update_profile(
    data: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update traveller profile preferences (age group, budget level, travel style, dietary options, etc.)."""
    return await update_user_profile(db, current_user.id, data)
