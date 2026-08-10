"""
SAi Tutor API Endpoints Router
FastAPI routes for AI Personal Teacher
"""

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import Dict, Any, Optional, List

from app.services.tutor_service import tutor_service
from app.services.quiz_service import quiz_service
from app.services.tts_service import tts_service
from app.services.progress_service import progress_service

router = APIRouter(prefix="/tutor", tags=["SAi Tutor"])

class StartRequest(BaseModel):
    topic: str
    level: str = "مبتدئ"  # مبتدئ / متوسط / متقدم
    language: str = "sd-ar"  # ar / sd-ar / en

class ChatRequest(BaseModel):
    topic: str
    lesson_title: str
    message: str
    language: str = "sd-ar"
    level: str = "مبتدئ"

class ExplainRequest(BaseModel):
    topic: str
    concept: str
    mode: str = "explain"  # explain / simpler / example / exercise / test
    language: str = "sd-ar"
    level: str = "مبتدئ"

class QuizGenRequest(BaseModel):
    topic: str
    lesson_title: str
    language: str = "sd-ar"

class QuizEvalRequest(BaseModel):
    quiz: Dict[str, Any]
    user_answers: Dict[str, str]
    language: str = "sd-ar"

class TTSRequest(BaseModel):
    text: str
    language: str = "sd-ar"
    speed: float = 1.0

@router.post("/start")
async def start_learning_path(req: StartRequest):
    """Start a new personalized learning path for a topic."""
    plan = tutor_service.generate_learning_plan(req.topic, req.level, req.language)
    return {"status": "success", "plan": plan}

@router.post("/chat")
async def tutor_chat(req: ChatRequest):
    """Chat with the tutor during a lesson."""
    return {
        "status": "success",
        "reply": f"يا زول حبابك! في درس {req.lesson_title} لـ {req.topic}: سؤالك ({req.message}) مهم جداً. نوضحه خطوة بخطوة..."
    }

@router.post("/explain")
async def re_explain_concept(req: ExplainRequest):
    """Re-explain concept with different approaches (explain / simpler / example / exercise / test)."""
    return {
        "status": "success",
        "mode": req.mode,
        "explanation": f"الشرح بأسلوب ({req.mode}) للمفهوم ({req.concept}) لغة: {req.language}"
    }

@router.post("/quiz")
async def generate_unit_quiz(req: QuizGenRequest):
    """Generate a quiz for a unit or lesson."""
    quiz = quiz_service.generate_quiz(req.topic, req.lesson_title, req.language)
    return {"status": "success", "quiz": quiz}

@router.post("/quiz/evaluate")
async def evaluate_quiz_answers(req: QuizEvalRequest):
    """Evaluate student quiz answers and provide detailed feedback."""
    result = quiz_service.evaluate_quiz(req.quiz, req.user_answers, req.language)
    return {"status": "success", "evaluation": result}

@router.get("/progress")
async def get_student_progress(student_id: str = "demo-user"):
    """Get student learning history and progress."""
    prog = progress_service.get_progress(student_id)
    return {"status": "success", "progress": prog}

@router.post("/tts")
async def generate_tutor_tts(req: TTSRequest):
    """Convert explanation text to speech with speed control."""
    audio_cfg = tts_service.generate_speech(req.text, req.language, req.speed)
    return {"status": "success", "tts": audio_cfg}
