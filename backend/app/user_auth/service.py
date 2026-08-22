from datetime import datetime, timedelta
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from fastapi import HTTPException, status
from app.user_auth.models import User, UserProfile, PasswordResetToken
from app.user_auth.schemas import (
    UserRegister,
    UserLogin,
    GoogleAuthRequest,
    UserProfileUpdate,
    ResetPasswordRequest,
)
from app.user_auth.utils import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    generate_reset_token,
)
from app.shared.models import Role


async def get_user_by_email(db: AsyncSession, email: str) -> Optional[User]:
    result = await db.execute(
        select(User).options(selectinload(User.profile)).where(User.email == email.lower(), User.is_deleted == False)
    )
    return result.scalar_one_or_none()


async def get_user_by_id(db: AsyncSession, user_id) -> Optional[User]:
    result = await db.execute(
        select(User).options(selectinload(User.profile)).where(User.id == user_id, User.is_deleted == False)
    )
    return result.scalar_one_or_none()


async def register_user(db: AsyncSession, data: UserRegister) -> User:
    existing = await get_user_by_email(db, data.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists.",
        )

    # Hash the password
    pw_hash = hash_password(data.password)

    new_user = User(
        name=data.name,
        email=data.email.lower(),
        phone=data.phone,
        password_hash=pw_hash,
        role=data.role or Role.TRAVELLER,
        auth_provider="local",
    )
    db.add(new_user)
    await db.flush()

    # Automatically create default traveller profile
    default_profile = UserProfile(user_id=new_user.id)
    db.add(default_profile)
    await db.commit()
    await db.refresh(new_user)
    return new_user


async def authenticate_user(db: AsyncSession, data: UserLogin) -> dict:
    user = await get_user_by_email(db, data.email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
        )
    if not verify_password(data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account has been suspended. Please contact support.",
        )

    access_token = create_access_token(user.id)
    refresh_token = create_refresh_token(user.id)
    return {"access_token": access_token, "refresh_token": refresh_token, "user": user}


async def google_authenticate(db: AsyncSession, data: GoogleAuthRequest) -> dict:
    user = await get_user_by_email(db, data.email)
    if not user:
        # Create user from Google
        user = User(
            name=data.name,
            email=data.email.lower(),
            avatar_url=data.avatar_url,
            is_verified=True,
            auth_provider="google",
            role=Role.TRAVELLER,
        )
        db.add(user)
        await db.flush()

        profile = UserProfile(user_id=user.id)
        db.add(profile)
        await db.commit()
        await db.refresh(user)
    else:
        if data.avatar_url and not user.avatar_url:
            user.avatar_url = data.avatar_url
            await db.commit()

    access_token = create_access_token(user.id)
    refresh_token = create_refresh_token(user.id)
    return {"access_token": access_token, "refresh_token": refresh_token, "user": user}


async def create_password_reset_token(db: AsyncSession, email: str) -> Optional[str]:
    user = await get_user_by_email(db, email)
    if not user:
        # Silently return to prevent user enumeration
        return None

    token = generate_reset_token()
    expires_at = datetime.utcnow() + timedelta(hours=2)

    reset_entry = PasswordResetToken(user_id=user.id, token=token, expires_at=expires_at)
    db.add(reset_entry)
    await db.commit()
    return token


async def reset_password_with_token(db: AsyncSession, data: ResetPasswordRequest) -> bool:
    result = await db.execute(
        select(PasswordResetToken).where(
            PasswordResetToken.token == data.token,
            PasswordResetToken.is_used == False,
            PasswordResetToken.expires_at > datetime.utcnow(),
        )
    )
    token_entry = result.scalar_one_or_none()
    if not token_entry:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token.",
        )

    user = await get_user_by_id(db, token_entry.user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    user.password_hash = hash_password(data.new_password)
    token_entry.is_used = True
    await db.commit()
    return True


async def update_user_profile(db: AsyncSession, user_id, data: UserProfileUpdate) -> UserProfile:
    result = await db.execute(select(UserProfile).where(UserProfile.user_id == user_id))
    profile = result.scalar_one_or_none()
    if not profile:
        profile = UserProfile(user_id=user_id)
        db.add(profile)

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(profile, field, value)

    await db.commit()
    await db.refresh(profile)
    return profile
