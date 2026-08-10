"""
Developer Support & Feedback API Router
Handles incoming support requests, developer feedback, and platform support inquiries.
"""

import uuid
from datetime import datetime
from fastapi import APIRouter, HTTPException, status
from app.models.support import SupportRequest, SupportResponse
from app.core.security import sanitize_text, enforce_zero_financial_data

router = APIRouter(prefix="/support", tags=["Developer Support Center"])

# In-memory clean storage repository for demo/scalable DB migration
support_database = []

@router.post("/request", response_model=SupportResponse, status_code=status.HTTP_201_CREATED)
async def submit_support_request(payload: SupportRequest):
    """
    Submits a new developer support request or user feedback message.
    Strictly free of financial processing or donation data.
    """
    try:
        # Enforce zero financial data security check
        enforce_zero_financial_data(payload.model_dump())

        # Clean and sanitize input data
        clean_username = sanitize_text(payload.username, max_length=100)
        clean_email = payload.email.lower()
        clean_message = sanitize_text(payload.message, max_length=3000)
        clean_reason = sanitize_text(payload.reason, max_length=150)

        request_id = f"sup_{uuid.uuid4().hex[:8]}"
        created_at = datetime.utcnow()

        record = {
            "id": request_id,
            "username": clean_username,
            "email": clean_email,
            "message": clean_message,
            "reason": clean_reason,
            "created_at": created_at.isoformat()
        }
        support_database.append(record)

        return SupportResponse(
            success=True,
            message="تم استلام طلبك وملاحظاتك بنجاح. شكراً لدعمك وتواصلك مع مطور SAi!",
            request_id=request_id,
            timestamp=created_at
        )

    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail="حدث خطأ أثناء معالجة طلب الدعم")

@router.get("/health")
async def support_health():
    """Health check endpoint for SupportCenter service."""
    return {"status": "ok", "total_requests": len(support_database)}
