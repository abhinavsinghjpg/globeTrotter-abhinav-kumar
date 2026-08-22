import json
import asyncio
from pathlib import Path
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database import AsyncSessionLocal, async_engine, Base
from app.discovery.models import Destination, Place, Event, Activity, Restaurant, Shop
from app.user_auth.models import User, UserProfile
from app.user_auth.utils import hash_password
from app.shared.models import Role, PlaceStatus, VerificationStatus


async def seed_data():
    seed_file = Path(__file__).parent / "jaipur_seed.json"
    with open(seed_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        # Check or create Admin User
        admin_email = "admin@globetrotter.in"
        res = await session.execute(select(User).where(User.email == admin_email))
        admin = res.scalar_one_or_none()
        if not admin:
            admin = User(
                name="GlobeTrotter Admin",
                email=admin_email,
                password_hash=hash_password("Admin@12345"),
                role=Role.SUPER_ADMIN,
                is_active=True,
                is_verified=True,
            )
            session.add(admin)
            await session.flush()
            admin_profile = UserProfile(user_id=admin.id)
            session.add(admin_profile)
            print(f"Created default admin: {admin_email} / Admin@12345")

        # Check or create Destination
        dest_data = data["destination"]
        res = await session.execute(select(Destination).where(Destination.name == dest_data["name"]))
        destination = res.scalar_one_or_none()

        if not destination:
            destination = Destination(
                name=dest_data["name"],
                state=dest_data["state"],
                country=dest_data["country"],
                tagline=dest_data.get("tagline"),
                description=dest_data["description"],
                latitude=dest_data["latitude"],
                longitude=dest_data["longitude"],
                hero_image=dest_data.get("hero_image"),
                gallery=dest_data.get("gallery", []),
                best_time_to_visit=dest_data.get("best_time_to_visit"),
                is_popular=dest_data.get("is_popular", True),
            )
            session.add(destination)
            await session.flush()
            print(f"Created destination: {destination.name}")

            # Add Places
            for p in data.get("places", []):
                place = Place(
                    destination_id=destination.id,
                    name=p["name"],
                    category=p["category"],
                    description=p["description"],
                    latitude=p["latitude"],
                    longitude=p["longitude"],
                    status=PlaceStatus[p.get("status", "OPEN").upper().replace(" ", "_")],
                    opening_hours=p.get("opening_hours", {}),
                    price_range=p.get("price_range", "₹₹"),
                    entry_fee_inr=p.get("entry_fee_inr", 0.0),
                    rating=p.get("rating", 4.5),
                    reviews_count=p.get("reviews_count", 0),
                    is_hidden_spot=p.get("is_hidden_spot", False),
                    safety_notes=p.get("safety_notes"),
                    best_time_of_day=p.get("best_time_of_day", "Morning"),
                    suggested_duration_mins=p.get("suggested_duration_mins", 90),
                    photos=p.get("photos", []),
                    reels_urls=p.get("reels_urls", []),
                )
                session.add(place)

            # Add Events
            for e in data.get("events", []):
                from datetime import datetime
                event = Event(
                    destination_id=destination.id,
                    name=e["name"],
                    category=e["category"],
                    description=e["description"],
                    start_date=datetime.fromisoformat(e["start_date"].replace("Z", "+00:00")),
                    end_date=datetime.fromisoformat(e["end_date"].replace("Z", "+00:00")),
                    location_name=e["location_name"],
                    ticket_price_inr=e.get("ticket_price_inr", 0.0),
                    expected_crowd=e.get("expected_crowd", "High"),
                    suitable_age_groups=e.get("suitable_age_groups", ["16-26", "26-45", "45-old age"]),
                    photos=e.get("photos", []),
                )
                session.add(event)

            # Add Activities
            for a in data.get("activities", []):
                act = Activity(
                    destination_id=destination.id,
                    name=a["name"],
                    category=a["category"],
                    description=a["description"],
                    cost_inr=a["cost_inr"],
                    cost_type=a.get("cost_type", "verified"),
                    duration_mins=a.get("duration_mins", 120),
                    difficulty=a.get("difficulty", "easy"),
                    age_min=a.get("age_min", 5),
                    age_max=a.get("age_max", 70),
                    weather_dependency=a.get("weather_dependency", "Clear skies"),
                    best_season=a.get("best_season", "Oct to Mar"),
                    provider_name=a.get("provider_name"),
                    booking_url=a.get("booking_url"),
                )
                session.add(act)

            # Add Restaurants
            for r in data.get("restaurants", []):
                rest = Restaurant(
                    destination_id=destination.id,
                    name=r["name"],
                    category=r.get("category", "restaurant"),
                    cuisines=r.get("cuisines", []),
                    dietary_options=r.get("dietary_options", []),
                    must_try_dishes=r.get("must_try_dishes", []),
                    price_for_two_inr=r.get("price_for_two_inr", 400.0),
                    rating=r.get("rating", 4.5),
                    latitude=r["latitude"],
                    longitude=r["longitude"],
                    address=r["address"],
                    opening_hours=r.get("opening_hours", {}),
                )
                session.add(rest)

            # Add Shops
            for s in data.get("shops", []):
                shop = Shop(
                    destination_id=destination.id,
                    name=s["name"],
                    category=s["category"],
                    description=s["description"],
                    specialties=s.get("specialties", []),
                    price_range=s.get("price_range", "₹₹"),
                    rating=s.get("rating", 4.5),
                    latitude=s["latitude"],
                    longitude=s["longitude"],
                    address=s["address"],
                    photos=s.get("photos", []),
                )
                session.add(shop)

        await session.commit()
        print("Seed completed successfully!")


if __name__ == "__main__":
    asyncio.run(seed_data())
