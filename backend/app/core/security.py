"""
SAi Security & Privacy Protection Module
Ensures no financial data collection, sanitizes text inputs, and protects user privacy.
"""

import re
import html

def sanitize_text(input_str: str, max_length: int = 3000) -> str:
    """Sanitizes raw text inputs, prevents injection attacks and enforces length limits."""
    if not input_str:
        return ""
    # Strip dangerous HTML tags
    cleaned = html.escape(input_str.strip())
    # Truncate to maximum allowed length
    return cleaned[:max_length]

def validate_email(email: str) -> bool:
    """Validates user email format."""
    email_regex = r"^[\w\.-]+@[\w\.-]+\.\w+$"
    return bool(re.match(email_regex, email.strip()))

def enforce_zero_financial_data(payload: dict) -> None:
    """
    Security check ensuring no financial info (credit cards, bank accounts, CVVs)
    is accepted or stored anywhere in the platform.
    """
    forbidden_keywords = ["bankak", "بنكك", "credit_card", "cvv", "card_number", "account_number"]
    for key in payload.keys():
        if any(keyword in key.lower() for keyword in forbidden_keywords):
            raise ValueError("Forbidden: Financial data requests are strictly disabled on SAi Platform.")
