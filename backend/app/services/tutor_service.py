"""
SAi Tutor - AI Personal Teacher Service
Supports Arabic (ar), Sudanese Dialect (sd-ar), and English (en).
"""

import os
from typing import Dict, Any, List, Optional
import google.genai as genai

SYSTEM_PROMPT_TUTOR = """
أنت SAi Tutor، مدرس ذكاء اصطناعي شخصي احترافي ضمن منصة SAi.

مهمتك ليست إعطاء الإجابات المباشرة فقط، بل مساعدة الطالب على فهم الموضوع وبناء المعرفة بنفسه.

كن صبورًا وواضحًا ومنظمًا وتشجيعيًا.

تكيف مع مستوى الطالب:
- إذا كان الطالب مبتدئًا: استخدم لغة بسيطة وأمثلة كثيرة ومحسوسة.
- إذا كان متوسطًا: زد العمق تدريجيًا وربط الشرح بالتطبيق الأكاديمي والعملي.
- إذا كان متقدمًا: استخدم شرحًا تقنيًا عميقًا ومفاهيم متقدمة.

عند شرح أي موضوع:
1. اشرح المفهوم الأساسي بوضوح.
2. أعطِ مثالاً بلمسة واقعية وبسيطة.
3. اطرح على الطالب سؤالاً للتأكد من الفهم.
4. انتظر إجابة الطالب وحللها.
5. وجه الطالب عند الخطأ واشرح السبب دون إحباط.

اللغة المحددة للشرح:
- Arabic Formal (ar): استخدم العربية الفصحى السليمة والواضحة.
- Sudanese Arabic (sd-ar): استخدم العامية السودانية الطبيعية والمفهومة مع تعابير سودانية مهذبة وتشجيعية مثل (يا زول، يا حبيب، حبابك، خطوة بخطوة، يا أخي).
- English (en): Natural, clear, encouraging English appropriate for learning.

لا تخلط اللغات إلا عند المصطلحات التقنية التي يستحسن ذكر اسمها بالإنجليزي جنب الشرح.
"""

class TutorService:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY", "")
        if api_key:
            self.client = genai.Client(api_key=api_key)
        else:
            self.client = None

    def generate_learning_plan(self, topic: str, level: str, lang: str) -> Dict[str, Any]:
        """Generate a structured personalized learning roadmap for a given topic."""
        prompt = f"""
        أنشئ خطة تعلم شخصية ومنظمة للمادة/المهارة: {topic}
        المستوى: {level}
        لغة الشرح المطلوبة: {lang} (ar: فصحى, sd-ar: عامية سودانية, en: English)

        المطلوب إرجاع JSON بالهيكل التالي:
        {{
          "topic": "{topic}",
          "level": "{level}",
          "language": "{lang}",
          "summary": "ملخص قصير للخطة والهدف التعليمي",
          "weeks": [
             {{
                "week_number": 1,
                "title": "عنوان الأسبوع/المرحلة الأولى",
                "topics": ["موضوع 1", "موضوع 2", "موضوع 3"]
             }},
             ... (أنشئ 3-4 أسابيع مقسمة بوضوح)
          ],
          "first_lesson": {{
             "title": "عنوان الدرس الأول",
             "explanation": "شرح تفاعلي مشجع للمفهوم الأساسي الأول",
             "example": "مثال عملي مبسط",
             "check_question": "سؤال قصير لتفقد فهم الطالب"
          }}
        }}
        """
        if not self.client:
            return self._fallback_plan(topic, level, lang)

        try:
            response = self.client.models.generate_content(
                model="gemini-2.5-flash",
                contents=[SYSTEM_PROMPT_TUTOR, prompt],
                config={"response_mime_type": "application/json"}
            )
            import json
            return json.loads(response.text)
        except Exception as e:
            print(f"Error generating learning plan: {e}")
            return self._fallback_plan(topic, level, lang)

    def _fallback_plan(self, topic: str, level: str, lang: str) -> Dict[str, Any]:
        return {
            "topic": topic,
            "level": level,
            "language": lang,
            "summary": f"مسار تعلم مخصص لـ {topic} بمستوى {level}",
            "weeks": [
                {
                    "week_number": 1,
                    "title": f"أساسيات {topic}",
                    "topics": ["المفاهيم الأساسية", "المصطلحات الأولى", "التطبيق المباشر"]
                },
                {
                    "week_number": 2,
                    "title": f"تطبيق وتعلم عميق لـ {topic}",
                    "topics": ["العمليات والأدوات", "حل المشكلات", "تمارين تفاعلية"]
                }
            ],
            "first_lesson": {
                "title": f"مقدمة في {topic}",
                "explanation": f"أهلاً بك في أول درس في {topic}! سنتعلم اليوم اللبنات الأساسية بأسلوب بسيط ومباشر.",
                "example": f"تخيل أن {topic} يشبه بناء بيت متين خطوة بخطوة.",
                "check_question": "ما هو الهدف الرئيسي الذي تريد تحقيقه من دراسة هذا المفهوم؟"
            }
        }

tutor_service = TutorService()
