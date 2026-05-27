"""Shared input validators."""
import re


def validate_price(value):
    """Ensure price is positive."""
    if value is not None and float(value) < 0:
        raise ValueError('Price must be a positive number.')


def validate_phone_number(value):
    """Loose E.164-style phone validation."""
    pattern = re.compile(r'^\+?[1-9]\d{7,14}$')
    if value and not pattern.match(value.replace(' ', '').replace('-', '')):
        raise ValueError('Invalid phone number format.')
