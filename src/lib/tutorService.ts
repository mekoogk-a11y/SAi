export type TutorLevelStyle = 'مبتدئ' | 'متوسط' | 'متقدم' | 'شرح مبسط' | 'شرح أكاديمي';
export type TutorLanguage = 'ar' | 'sd-ar' | 'en';

export interface TutorToneConfig {
  style: TutorLevelStyle;
  label: string;
  description: string;
  promptInstruction: string;
}

export const TUTOR_TONE_CONFIGS: Record<TutorLevelStyle, TutorToneConfig> = {
  'شرح مبسط': {
    style: 'شرح مبسط',
    label: '💡 شرح مبسط (أمثلة من الواقع السوداني)',
    description: 'تبسيط الفكرة بربطها بالحياة والأمثلة اليومية من البيئة والواقع السوداني الأصيل.',
    promptInstruction: `
نمط الشرح: "شرح مبسط جداً من واقع البيئة السودانية".
التزم بالإرشادات التالية:
1. اشرح المفهوم الأساسي بأبسط عبارات ممكنة دون تعقيدات نظرية.
2. اضرب أمثلة حية ملموسة من واقع الحياة اليومية والمجتمع السوداني (مثل: الحياة الأسرية، الأسواق، الزراعة، النيل، المواقف اليومية المعروفة، الأنشطة الميدانية).
3. استخدم أسلوباً مشجعاً يزيل الرهبة من المادة ويجعل التعلم سهلاً وممتعاً ومستوعباً بسرعة.
`
  },
  'شرح أكاديمي': {
    style: 'شرح أكاديمي',
    label: '🎓 شرح أكاديمي (لغة فصحى دقيقة)',
    description: 'شرح علمي منهجى رصين باللغة العربية الفصحى المصقولة واستخدام المصطلحات المعتمدة.',
    promptInstruction: `
نمط الشرح: "شرح أكاديمي منهجي دقيق".
التزم بالإرشادات التالية:
1. استخدم لغة عربية فصحى سليمة، مصقولة، ودقيقة علمياً وفكرياً.
2. استعرض المفهوم بناءً على التعاريف العلمية والمنهجية المعتمدة والأصول النظرية.
3. استخدم المصطلحات الأكاديمية والتخصصية الصحيحة مع شرح معانيها.
4. اتّبع تسلسلاً منطقياً رصيناً (مقدمة، تعريف، محاور علمية، تطبيقات منهجية، ملخص واستنتاج).
`
  },
  'مبتدئ': {
    style: 'مبتدئ',
    label: '🟢 مبتدئ',
    description: 'التركيز على الأساسيات الأولى والكلمات البسيطة جداً.',
    promptInstruction: `
نمط الشرح: "مستوى مبتدئ".
التزم بالشرح البسيط للغاية وتوضيح المفاهيم الأساسية خطوة بخطوة وبلا أي تعقيد.
`
  },
  'متوسط': {
    style: 'متوسط',
    label: '🟡 متوسط',
    description: 'عمق متوازن بين الأساسيات والتطبيقات العملية.',
    promptInstruction: `
نمط الشرح: "مستوى متوسط".
قدم عمقاً متوازناً يجمع بين الشرح النظري والتطبيق والتدرج في المهارات.
`
  },
  'متقدم': {
    style: 'متقدم',
    label: '🔴 متقدم',
    description: 'تفاصيل علمية وتخصصية عميقة للمتميزين.',
    promptInstruction: `
نمط الشرح: "مستوى متقدم".
ركز على التفاصيل العلمية والتقنية الدقيقة والتحديات ذات المستوى العالي.
`
  }
};

/**
 * Returns prompt instructions tailored for the requested tone style and language.
 */
export function getTutorToneInstruction(style: TutorLevelStyle = 'مبتدئ', language: TutorLanguage = 'sd-ar'): string {
  const toneConfig = TUTOR_TONE_CONFIGS[style] || TUTOR_TONE_CONFIGS['مبتدئ'];
  
  let langInstruction = '';
  if (language === 'sd-ar') {
    langInstruction = 'اللغة: العامية السودانية الطبيعية المفهومة جداً بروح تعليمية سودانية مودة وتشجيعية.';
  } else if (language === 'en') {
    langInstruction = 'Language: Clear encouraging English with well-explained concepts.';
  } else {
    langInstruction = 'اللغة: العربية الفصحى الميسرة والسليمة.';
  }

  return `
--- توجيهات أسلوب الشرح ونبرة الصوت ---
${toneConfig.promptInstruction}
${langInstruction}
----------------------------------
`;
}

/**
 * Service methods to call the backend API endpoints
 */
export const tutorService = {
  async startLearningPath(params: { topic: string; level: TutorLevelStyle; language: TutorLanguage }) {
    const res = await fetch('/api/tutor/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    return await res.json();
  },

  async sendChatMessage(params: {
    topic: string;
    lesson_title: string;
    message: string;
    language: TutorLanguage;
    level: TutorLevelStyle;
    image?: string | null;
  }) {
    const res = await fetch('/api/tutor/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    return await res.json();
  },

  async explainConcept(params: {
    topic: string;
    concept: string;
    mode: 'explain' | 'simpler' | 'example' | 'exercise' | 'test';
    language: TutorLanguage;
    level: TutorLevelStyle;
  }) {
    const res = await fetch('/api/tutor/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    return await res.json();
  },

  async generateQuiz(params: { topic: string; lesson_title: string; language: TutorLanguage; level?: TutorLevelStyle }) {
    const res = await fetch('/api/tutor/quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    return await res.json();
  },

  async evaluateQuiz(params: { quiz: any; user_answers: Record<string, string>; language: TutorLanguage }) {
    const res = await fetch('/api/tutor/quiz/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    return await res.json();
  }
};
