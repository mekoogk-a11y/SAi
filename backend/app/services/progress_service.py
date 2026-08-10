"""
SAi Tutor - Student Learning Memory & Progress Tracking Service
"""

from typing import Dict, Any, List

# In-memory progress state (backed up by DB/JSON storage)
student_progress_store: Dict[str, Dict[str, Any]] = {}

class ProgressService:
    def get_progress(self, student_id: str = "demo-user") -> Dict[str, Any]:
        if student_id not in student_progress_store:
            student_progress_store[student_id] = {
                "student_id": student_id,
                "current_topic": "Python Programming",
                "level": "مبتدئ",
                "language": "sd-ar",
                "completion_percentage": 65,
                "completed_lessons": 8,
                "total_lessons": 12,
                "quiz_average": 88,
                "strengths": ["أساسيات الجمل الشرطية", "تركيب القوائم", "فهم المتغيرات"],
                "weak_points": ["الحلقات التكرارية المركبة"],
                "last_lesson": "المتغيرات وأنواع البيانات في Python",
                "next_lesson": "الجمل الشرطية (If Statements) أسلوب سوداني",
                "history": [
                   {"lesson": "مقدمة البرمجة", "date": "2026-08-08", "score": 90},
                   {"lesson": "المتغيرات", "date": "2026-08-09", "score": 85}
                ]
            }
        return student_progress_store[student_id]

    def update_progress(self, student_id: str, topic: str, lesson_title: str, quiz_score: int) -> Dict[str, Any]:
        p = self.get_progress(student_id)
        p["last_lesson"] = lesson_title
        p["completed_lessons"] = p.get("completed_lessons", 0) + 1
        pct = min(100, int((p["completed_lessons"] / p.get("total_lessons", 10)) * 100))
        p["completion_percentage"] = pct
        
        history = p.get("history", [])
        history.append({"lesson": lesson_title, "score": quiz_score})
        p["history"] = history
        return p

progress_service = ProgressService()
