"""
Support Models & Data Structures for SAi Developer Support System
Python 3.12+ Pydantic Models
"""

from datetime import datetime
from pydantic import BaseModel, EmailStr, Field

class SupportRequest(BaseModel):
    """
    Developer Support & Feedback Request Model
    Encapsulates user feedback, development support inquiries, and platform notes.
    """
    username: str = Field(..., min_length=2, max_length=100, description="User or Organization name")
    email: EmailStr = Field(..., description="User email address for developer response")
    message: str = Field(..., min_length=5, max_length=3000, description="Support or feedback message details")
    reason: str = Field(
        default="تطوير وتحسين نماذج الذكاء الاصطناعي",
        description="Reason for supporting development (AI models, Server costs, New features, UX improvements)"
    )

class SupportResponse(BaseModel):
    """API Response Model for Developer Support Submissions"""
    success: bool
    message: str
    request_id: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
