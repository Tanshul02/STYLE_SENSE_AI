import hashlib
import hmac
import os
from datetime import datetime, timedelta, timezone
from typing import Any, Union
import jwt

# Fallback secret key if not set in environment
SECRET_KEY = os.getenv("SECRET_KEY", "stylesense-super-secret-key-cloud-2026")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

def get_password_hash(password: str) -> str:
    salt = os.urandom(16).hex()
    pwd_hash = hashlib.pbkdf2_hmac(
        "sha256", password.encode("utf-8"), salt.encode("utf-8"), 100000
    ).hex()
    return f"{salt}${pwd_hash}"

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        if "$" not in hashed_password:
            # Handle legacy simple sha256 hashes if any exist
            return hashlib.sha256(plain_password.encode("utf-8")).hexdigest() == hashed_password
        salt, pwd_hash = hashed_password.split("$", 1)
        check_hash = hashlib.pbkdf2_hmac(
            "sha256", plain_password.encode("utf-8"), salt.encode("utf-8"), 100000
        ).hex()
        return hmac.compare_digest(check_hash, pwd_hash)
    except Exception:
        return False

def create_access_token(subject: Union[str, Any], expires_delta: timedelta = None) -> str:
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
