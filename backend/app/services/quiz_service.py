"""
SAi Tutor - Quiz Generation and Evaluation Service
"""

import os
import json
from typing import Dict, Any, List
import google.genai as genai

class QuizService:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY", "")
        self.client = genai.Client(api_key=api_key) if api_key else None

    def generate_quiz(self, topic: str, lesson_title: str, lang: str) -> Dict[str, Any]:
        """Generate a quiz with multiple question types for a lesson."""
        prompt = f"""
        أنشئ اختبارًا قصيرًا وممتعًا لتقييم فهم الطالب لدرس: {lesson_title} في مادة: {topic}.
        اللغة المطلوب استخدامها في الأسئلة والخيارات: {lang} (ar / sd-ar / en).

        أنشئ 3-4 أسئلة تتنوع بين:
        - اختيار من متعدد (multiple_choice)
        - صح أو خطأ (true_false)
        - سؤال إجابة قصيرة/تطبيقي (short_answer)

        أرجع النتيجة بصيغة JSON حصرية:
        {{
           "quiz_title": "اختبار: {lesson_title}",
           "questions": [
              {{
                 "id": "q1",
                 "type": "multiple_choice",
                 "question": "نص السؤال هنا",
                 "options": ["خيار A", "خيار B", "خيار C", "خيار D"],
                 "correct_answer": "خيار A",
                 "explanation": "شرح سبب الصحة"
              }},
              {{
                 "id": "q2",
                 "type": "true_false",
                 "question": "نص السؤال",
                 "options": ["صح", "خطأ"],
                 "correct_answer": "صح",
                 "explanation": "الشرح"
              }}
           ]
        }}
        """
        if not self.client:
            return self._fallback_quiz(lesson_title)

        try:
            res = self.client.models.generate_content(
                model="gemini-2.5-flash",
                contents=[prompt],
                config={"response_mime_type": "application/json"}
            )
            return json.loads(res.text)
        except Exception as e:
            print(f"Quiz generation error: {e}")
            return self._fallback_quiz(lesson_title)

    def evaluate_quiz(self, quiz: Dict[str, Any], user_answers: Dict[str, str], lang: str) -> Dict[str, Any]:
        """Evaluate answers and return score, feedback, strengths, weak points, and recommendations."""
        questions = quiz.get("questions", [])
        total = len(questions)
        correct_count = 0
        details = []

        for q in questions:
            q_id = q.get("id")
            user_ans = user_answers.get(q_id, "").strip()
            correct_ans = str(q.get("correct_answer", "")).strip()
            
            is_correct = (user_ans.lower() == correct_ans.lower()) or (user_ans in correct_ans or correct_ans in user_ans)
            if is_correct:
                correct_count += 1

            details.append({
                "question": q.get("question"),
                "user_answer": user_ans,
                "correct_answer": correct_ans,
                "is_correct": is_correct,
                "explanation": q.get("explanation", "")
            })

        score_percentage = round((correct_count / total) * 100) if total > 0 else 0

        feedback_msg = "ممتاز جداً! استيعابك متقن ومبهر." if score_percentage >= 80 else (
            "أداء جيد جداً! واصل والمراجعة تثبت المعلومة أكثر." if score_percentage >= 50 else
            "محاولة طيبة، يفضل إعادة مراجعة الشرح البسيط للتمكن التام."
        )

        return {
            "score": correct_count,
            "total": total,
            "percentage": score_percentage,
            "feedback": feedback_msg,
            "details": details,
            "strengths": ["استيعاب المفاهيم الأساسية", "سرعة الإجابة والتطبيق"],
            "weakness": ["تدرج الخطوات الدقيقة في بعض الأسئلة"] if score_percentage < 100 else [],
            "recommendation": "الانتقال للدرس التالي" if score_percentage >= 70 else "مراجعة أمثلة إضافية قبل الانتقال"
        }

    def _fallback_quiz(self, lesson_title: str) -> Dict[str, Any]:
        return {
            "quiz_title": f"اختبار تقييمي لـ {lesson_title}",
            "questions": [
                {
                    "id": "q1",
                    "type": "multiple_choice",
                    "question": f"ما هي الفائدة الرئيسية من دراسة {lesson_title}؟",
                    "options": ["فهم الأساسيات بوضوح", "حفظ التعاريف فقط", "تجاهل التمارين", "لا شيء مما سبق"],
                    "correct_answer": "فهم الأساسيات بوضوح",
                    "explanation": "الفهم هو الأساس للبناء والممارسة العملية."
                },
                {
                    "id": "q2",
                    "type": "true_false",
                    "question": "يمكن تطبيق المفاهيم التي تعلمنا في هذا الدرس في أمثلة عملية من الحياة اليومية.",
                    "options": ["صح", "خطأ"],
                    "correct_answer": "صح",
                    "explanation": "نعم، كل مفهوم يترجم إلى فائدة وتطبيق عملي."
                }
            ]
        }

quiz_service = QuizService()
