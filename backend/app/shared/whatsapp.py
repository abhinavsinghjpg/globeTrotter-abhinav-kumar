import urllib.parse
from app.config import settings


def generate_whatsapp_link(
    phone_number: str = None,
    message: str = "Namaste! I am planning a trip with GlobeTrotter and need assistance.",
) -> str:
    """Generates a standard click-to-chat WhatsApp link."""
    target_phone = phone_number or settings.WHATSAPP_ASSIST_PHONE
    # Clean phone number: remove +, -, spaces
    clean_phone = target_phone.replace("+", "").replace("-", "").replace(" ", "")
    encoded_text = urllib.parse.quote(message)
    return f"https://wa.me/{clean_phone}?text={encoded_text}"


def generate_trip_share_whatsapp_link(trip_name: str, destination: str, trip_url: str) -> str:
    """Generates a WhatsApp share link for an itinerary."""
    msg = f"Check out my travel plan '{trip_name}' to {destination} on GlobeTrotter: {trip_url}"
    return f"https://wa.me/?text={urllib.parse.quote(msg)}"


def generate_guide_contact_whatsapp_link(guide_phone: str, guide_name: str, traveller_name: str) -> str:
    """Generates a WhatsApp direct link to contact a verified local guide."""
    clean_phone = guide_phone.replace("+", "").replace("-", "").replace(" ", "")
    msg = f"Hi {guide_name}, I am {traveller_name} on GlobeTrotter. I would like to enquire about your local guided tour!"
    return f"https://wa.me/{clean_phone}?text={urllib.parse.quote(msg)}"
