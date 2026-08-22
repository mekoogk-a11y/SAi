import React, { useState, useEffect, useRef } from 'react';
import { tutorService, TUTOR_TONE_CONFIGS, TutorLevelStyle } from '../lib/tutorService';
import {
  GraduationCap,
  BookOpen,
  Sparkles,
  MessageSquare,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Lightbulb,
  CheckCircle2,
  XCircle,
  HelpCircle,
  BarChart3,
  Award,
  ArrowRight,
  Send,
  Loader2,
  Globe,
  Brain,
  Target,
  Clock,
  ChevronRight,
  Zap,
  Bookmark,
  RefreshCw,
  Sliders,
  Check,
  TrendingUp,
  FileText,
  Paperclip,
  Image as ImageIcon,
  Copy,
  X,
  Repeat
} from 'lucide-react';

interface TutorViewProps {
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export type TutorLanguage = 'ar' | 'sd-ar' | 'en';
export type TutorLevel = 'مبتدئ' | 'متوسط' | 'متقدم' | 'شرح مبسط' | 'شرح أكاديمي';

interface LessonPlan {
  topic: string;
  level: TutorLevel;
  language: TutorLanguage;
  summary: string;
  weeks: {
    week_number: number;
    title: string;
    topics: string[];
  }[];
  first_lesson: {
    title: string;
    explanation: string;
    example: string;
    check_question: string;
  };
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  timestamp: string;
}

interface QuizQuestion {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  question: string;
  options?: string[];
  correct_answer: string;
  explanation: string;
}

interface QuizData {
  quiz_title: string;
  questions: QuizQuestion[];
}

interface QuizResult {
  score: number;
  total: number;
  percentage: number;
  feedback: string;
  details: {
    question: string;
    user_answer: string;
    correct_answer: string;
    is_correct: boolean;
    explanation: string;
  }[];
  strengths: string[];
  weakness: string[];
  recommendation: string;
}

export const TutorView: React.FC<TutorViewProps> = ({ showToast }) => {
  // Navigation active tab
  const [activeTab, setActiveTab] = useState<'learn' | 'quiz' | 'progress'>('learn');

  // Learning Setup State
  const [topic, setTopic] = useState<string>('Python');
  const [level, setLevel] = useState<TutorLevel>('مبتدئ');
  const [language, setLanguage] = useState<TutorLanguage>('sd-ar');

  // Active Lesson & Plan
  const [plan, setPlan] = useState<LessonPlan | null>(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState<boolean>(false);
  const [currentLessonTitle, setCurrentLessonTitle] = useState<string>('');
  const [currentExplanation, setCurrentExplanation] = useState<string>('');
  const [currentExample, setCurrentExample] = useState<string>('');
  const [currentCheckQuestion, setCurrentCheckQuestion] = useState<string>('');

  // Re-explanation loading state
  const [isExplaining, setIsExplaining] = useState<boolean>(false);
  const [activeExplainMode, setActiveExplainMode] = useState<string>('explain');

  // File & Image Attachments State
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [attachedFileName, setAttachedFileName] = useState<string | null>(null);
  const [attachedFileText, setAttachedFileText] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Interactive Chat State
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('sai_tutor_messages');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });
  const [chatInput, setChatInput] = useState<string>('');
  const [isSendingChat, setIsSendingChat] = useState<boolean>(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      if (messages.length > 0) {
        localStorage.setItem('sai_tutor_messages', JSON.stringify(messages));
      }
    } catch (e) {}
  }, [messages]);

  // Text-To-Speech (TTS) State
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [speechSpeed, setSpeechSpeed] = useState<number>(1.0);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Diagnostic Test / Quiz State
  const [currentQuiz, setCurrentQuiz] = useState<QuizData | null>(null);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState<boolean>(false);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  // Student Progress History
  const [progressData, setProgressData] = useState<any>({
    completion_percentage: 65,
    completed_lessons: 6,
    total_lessons: 8,
    quiz_average: 88,
    strengths: ['استيعاب المتغيرات', 'تتبع الخطوات الشرطية', 'حل الأمثلة التطبيقية'],
    weak_points: ['التعامل مع الحلقات المركبة'],
    last_lesson: 'أساسيات البرمجة والمتغيرات',
    next_lesson: 'الجمل الشرطية (If Statements)',
    history: [
      { lesson: 'المفاهيم الأولى', date: '2026-08-08', score: 90 },
      { lesson: 'المتغيرات وأنواع البيانات', date: '2026-08-09', score: 85 }
    ]
  });

  // Example topic presets
  const TOPIC_PRESETS = [
    { name: 'Python', icon: '🐍' },
    { name: 'English', icon: '🇬🇧' },
    { name: 'Mathematics', icon: '📐' },
    { name: 'Physics', icon: '⚛️' },
    { name: 'Artificial Intelligence', icon: '🤖' },
    { name: 'Business', icon: '💼' },
    { name: 'Programming', icon: '💻' },
    { name: 'Cybersecurity', icon: '🛡️' },
    { name: 'History', icon: '📜' }
  ];

  // Load stored progress from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('sai_tutor_progress');
      if (saved) {
        setProgressData(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Could not parse saved tutor progress:", e);
    }
  }, []);

  // Save progress changes
  const saveProgress = (updated: any) => {
    setProgressData(updated);
    try {
      localStorage.setItem('sai_tutor_progress', JSON.stringify(updated));
    } catch (e) {}
  };

  // Scroll chat to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Start Learning Path
  const handleStartLearning = async () => {
    if (!topic.trim()) {
      showToast('يرجى تحديد المادة أو المهارة التي تريد تعلمها', 'error');
      return;
    }

    setIsGeneratingPlan(true);
    showToast('جاري إعداد مسار التعلم الشخصي وتخصيص المدرس... 🎓');

    try {
      const data = await tutorService.startLearningPath({
        topic: topic.trim(),
        level: level as TutorLevelStyle,
        language
      });

      if (data.status === 'success' && data.plan) {
        const p: LessonPlan = data.plan;
        setPlan(p);
        setCurrentLessonTitle(p.first_lesson.title);
        setCurrentExplanation(p.first_lesson.explanation);
        setCurrentExample(p.first_lesson.example);
        setCurrentCheckQuestion(p.first_lesson.check_question);

        // Initial welcome chat message
        const welcomeText = language === 'sd-ar'
          ? `يا حبيب أهلاً بك! أنا مدرّسك الذكي لـ (${topic}). نمط الشرح المختار: (${TUTOR_TONE_CONFIGS[level as TutorLevelStyle]?.label || level}). اقرأ الشرح فوق واسألني في أي وقت!`
          : language === 'en'
          ? `Welcome! I am your AI Tutor for (${topic}). Style: (${level}). Read the explanation above and ask me anything!`
          : `أهلاً بك! أنا معلمك الذكي لمادة (${topic}). تم إعداد مسار التعلم الخصيص لك بنمط (${level}). اقرأ الشرح واسألني عن أي نقطة!`;

        setMessages([
          { id: 'm1', sender: 'tutor', text: welcomeText, timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) }
        ]);

        setActiveTab('learn');
        showToast('تمت جهوزية مسار التعلم! ابدأ الدرس الأول الآن 🚀');
      } else {
        showToast('حدث خطأ في إنشاء مسار التعلم، تم تفعيل المسار البديل', 'error');
      }
    } catch (err) {
      console.error('Tutor start error:', err);
      showToast('تعذر الاتصال بالخادم، يرجى المحاولة مرة أخرى', 'error');
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  // Re-explain Concept (أزرار إشرح مرة أخرى)
  const handleReExplain = async (mode: 'explain' | 'simpler' | 'example' | 'exercise' | 'test') => {
    if (!topic) return;
    setIsExplaining(true);
    setActiveExplainMode(mode);

    try {
      const data = await tutorService.explainConcept({
        topic,
        concept: currentLessonTitle,
        mode,
        language,
        level: level as TutorLevelStyle
      });

      if (data.status === 'success') {
        const explanationText = data.explanation;
        setCurrentExplanation(explanationText);

        const tutorMsg = language === 'sd-ar'
          ? `إليك الشرح بأسلوب (${mode === 'simpler' ? 'أبسط' : mode === 'example' ? 'أمثلة عملية' : mode === 'exercise' ? 'تمرين تطبيقي' : 'جديد'}) [النمط: ${level}]: \n\n${explanationText}`
          : `Here is the explanation in (${mode}) style [Tone: ${level}]:\n\n${explanationText}`;

        setMessages(prev => [
          ...prev,
          {
            id: `msg-${Date.now()}`,
            sender: 'tutor',
            text: tutorMsg,
            timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
          }
        ]);

        showToast('تم تحديث طريقة الشرح بناءً على طلبك 💡');
      }
    } catch (err) {
      showToast('فشل في إعادة الشرح، حاول مرة أخرى', 'error');
    } finally {
      setIsExplaining(false);
    }
  };

  // Image upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('يرجى اختيار ملف صورة صالح', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setAttachedImage(reader.result as string);
      showToast('تمت إضافة الصورة بنجاح! 📸');
    };
    reader.readAsDataURL(file);
  };

  // File upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAttachedFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      setAttachedFileText(text);
      showToast(`تم إرفاق المستند (${file.name}) بنجاح! 📄`);
    };
    reader.readAsText(file);
  };

  // Copy text helper
  const copyToClipboard = (txt: string) => {
    navigator.clipboard.writeText(txt);
    showToast('تم نسخ الإجابة بنجاح! 📋');
  };

  // Speak single message helper
  const speakMessage = (txt: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(txt);
      utterance.lang = language === 'en' ? 'en-US' : 'ar-SA';
      utterance.rate = speechSpeed;
      window.speechSynthesis.speak(utterance);
      showToast('جاري قراءة الشرح... 🔊');
    }
  };

  // Send Chat Message to Tutor
  const handleSendChat = async (customPrompt?: string) => {
    const promptToSend = customPrompt || chatInput.trim();
    if ((!promptToSend && !attachedImage && !attachedFileText) || isSendingChat) return;

    let fullMessage = promptToSend;
    if (attachedFileName && attachedFileText) {
      fullMessage = `[مرفق ملف: ${attachedFileName}]\nمحتوى الملف:\n${attachedFileText.slice(0, 3000)}\n\n${fullMessage}`;
    }

    if (!customPrompt) setChatInput('');
    const imageToSend = attachedImage;
    
    // Reset attachments
    setAttachedImage(null);
    setAttachedFileName(null);
    setAttachedFileText(null);
    
    setIsSendingChat(true);

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: fullMessage || 'شرح الصورة / الملف المرفق',
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);

    try {
      const data = await tutorService.sendChatMessage({
        topic,
        lesson_title: currentLessonTitle || topic,
        message: fullMessage || 'يرجى تحليل الشرح وإجابة السؤال المرفق',
        language,
        level: level as TutorLevelStyle,
        image: imageToSend
      });

      if (data.status === 'success') {
        const tutorReply: ChatMessage = {
          id: `t-${Date.now()}`,
          sender: 'tutor',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, tutorReply]);
      }
    } catch (err) {
      showToast('تعذر إرسال السؤال للمدرس', 'error');
    } finally {
      setIsSendingChat(false);
    }
  };

  // Regenerate last reply
  const handleRegenerateLastReply = () => {
    const lastUserMsg = [...messages].reverse().find(m => m.sender === 'user');
    if (lastUserMsg) {
      handleSendChat(lastUserMsg.text);
      showToast('جاري إعادة صياغة الشرح... 🔄');
    } else {
      handleReExplain('explain');
    }
  };

  // Text-To-Speech (TTS)
  const handleToggleSpeech = () => {
    if ('speechSynthesis' in window) {
      if (isPlayingAudio) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
      } else {
        window.speechSynthesis.cancel();
        const textToRead = `${currentLessonTitle}. ${currentExplanation}`;
        const utterance = new SpeechSynthesisUtterance(textToRead);

        if (language === 'en') {
          utterance.lang = 'en-US';
        } else {
          utterance.lang = 'ar-SA';
        }

        utterance.rate = speechSpeed;

        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => setIsPlayingAudio(false);

        synthRef.current = utterance;
        window.speechSynthesis.speak(utterance);
        setIsPlayingAudio(true);
        showToast(`جاري تشغيل الشرح بصوت المدرس (سرعة ${speechSpeed}x) 🔊`);
      }
    } else {
      showToast('متصفحك لا يدعم خاصية نطق الصوت المباشر', 'error');
    }
  };

  // Generate Unit Quiz
  const handleStartQuiz = async () => {
    setIsGeneratingQuiz(true);
    setUserAnswers({});
    setQuizResult(null);
    showToast('جاري إعداد الاختبار التقييمي القصير... 📝');

    try {
      const res = await fetch('/api/tutor/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          lesson_title: currentLessonTitle || topic,
          language
        })
      });

      const data = await res.json();
      if (data.status === 'success' && data.quiz) {
        setCurrentQuiz(data.quiz);
        setActiveTab('quiz');
        showToast('تم تجهيز أسئلة الاختبار! أجب بتركيز 🎯');
      }
    } catch (err) {
      showToast('تعذر توليد أسئلة الاختبار', 'error');
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  // Evaluate Quiz Answers
  const handleEvaluateQuiz = async () => {
    if (!currentQuiz) return;

    try {
      const res = await fetch('/api/tutor/quiz/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quiz: currentQuiz,
          user_answers: userAnswers,
          language
        })
      });

      const data = await res.json();
      if (data.status === 'success' && data.evaluation) {
        const result: QuizResult = data.evaluation;
        setQuizResult(result);

        // Update progress history
        const newHist = [
          ...(progressData.history || []),
          { lesson: currentLessonTitle || topic, date: new Date().toISOString().split('T')[0], score: result.percentage }
        ];
        const newCompleted = (progressData.completed_lessons || 0) + 1;
        const updated = {
          ...progressData,
          completed_lessons: newCompleted,
          completion_percentage: Math.min(100, Math.round((newCompleted / (progressData.total_lessons || 10)) * 100)),
          history: newHist
        };
        saveProgress(updated);

        showToast(`تم التقييم! درجتك: ${result.score}/${result.total} (${result.percentage}%) 🎉`);
      }
    } catch (err) {
      showToast('تعذر تقييم إجاباتك', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 text-right font-sans" dir="rtl">
      
      {/* HEADER HERO SECTION */}
      <div className="relative bg-gradient-to-r from-zinc-900 via-zinc-900 to-emerald-950/80 border border-emerald-500/30 rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-right">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-xs font-bold shadow-inner">
              <GraduationCap className="w-4 h-4 animate-bounce text-emerald-400" />
              <span>SAi Tutor — المدرّس الذكي (AI Personal Teacher)</span>
            </div>

            <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight">
              مدرّسك الذكي الشخصي <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">بالطريقة واللغة</span> التي تناسبك 🎓
            </h1>

            <p className="text-sm text-zinc-300 max-w-2xl leading-relaxed">
              شرح مبسط، أمثلة حية، تفاعل مباشر بالعامية السودانية أو العربية الفصحى أو الإنجليزية، مع دعم تحويل النص إلى صوت واختبارات وتتبع لتقدمك الدرسي خطوة بخطوة.
            </p>
          </div>

          {/* Top Quick Stats Pill */}
          <div className="flex items-center gap-3 bg-zinc-950/80 border border-zinc-800 p-3.5 rounded-2xl">
            <div className="text-center px-3 border-l border-zinc-800">
              <div className="text-xs text-zinc-400">إنجازك</div>
              <div className="text-lg font-black text-emerald-400">{progressData.completion_percentage}%</div>
            </div>
            <div className="text-center px-3 border-l border-zinc-800">
              <div className="text-xs text-zinc-400">دروس مكتملة</div>
              <div className="text-lg font-black text-amber-400">{progressData.completed_lessons}</div>
            </div>
            <div className="text-center px-3">
              <div className="text-xs text-zinc-400">معدل الاختبارات</div>
              <div className="text-lg font-black text-cyan-400">{progressData.quiz_average}%</div>
            </div>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-6 border-t border-zinc-800/80">
          <button
            onClick={() => setActiveTab('learn')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 ${
              activeTab === 'learn'
                ? 'bg-emerald-500 text-zinc-950 shadow-lg shadow-emerald-500/20'
                : 'bg-zinc-950/80 text-zinc-300 hover:text-white border border-zinc-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>الدرس والتعلم التفاعلي</span>
          </button>

          <button
            onClick={handleStartQuiz}
            className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 ${
              activeTab === 'quiz'
                ? 'bg-emerald-500 text-zinc-950 shadow-lg shadow-emerald-500/20'
                : 'bg-zinc-950/80 text-zinc-300 hover:text-white border border-zinc-800'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>الاختبار التقييمي (Quiz)</span>
          </button>

          <button
            onClick={() => setActiveTab('progress')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 ${
              activeTab === 'progress'
                ? 'bg-emerald-500 text-zinc-950 shadow-lg shadow-emerald-500/20'
                : 'bg-zinc-950/80 text-zinc-300 hover:text-white border border-zinc-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>سجل تقدّمي الأكاديمي (Progress)</span>
          </button>
        </div>
      </div>

      {/* SETUP / SELECTION BAR */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-5 md:p-6 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
          
          {/* Topic Input */}
          <div className="flex-1 space-y-1.5">
            <label className="text-xs font-black text-amber-400 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>ماذا تريد أن تتعلم اليوم؟</span>
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="اكتب المادة أو المهارة (مثال: Python, English, الرياضيات, الذكاء الاصطناعي)..."
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 rounded-2xl px-4 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none"
            />
          </div>

          {/* Level & Style Selector */}
          <div className="space-y-1.5 flex-1">
            <label className="text-xs font-black text-zinc-300 flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-emerald-400" />
              <span>مستوى وأسلوب الشرح:</span>
            </label>
            <div className="flex flex-wrap items-center gap-1.5 bg-zinc-950 p-1.5 rounded-2xl border border-zinc-800">
              {([
                { id: 'مبتدئ', label: 'مبتدئ' },
                { id: 'متوسط', label: 'متوسط' },
                { id: 'متقدم', label: 'متقدم' },
                { id: 'شرح مبسط', label: '💡 شرح مبسط (أمثلة من الواقع السوداني)' },
                { id: 'شرح أكاديمي', label: '🎓 شرح أكاديمي (لغة فصحى دقيقة)' }
              ] as { id: TutorLevel; label: string }[]).map(item => (
                <button
                  key={item.id}
                  onClick={() => setLevel(item.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    level === item.id 
                      ? 'bg-emerald-500 text-zinc-950 font-black shadow-md shadow-emerald-500/20' 
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                  title={item.label}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Language Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-zinc-300 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>لغة الشرح:</span>
            </label>
            <div className="flex items-center bg-zinc-950 p-1 rounded-2xl border border-zinc-800">
              <button
                onClick={() => setLanguage('sd-ar')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  language === 'sd-ar' ? 'bg-emerald-500 text-zinc-950 font-black' : 'text-zinc-400 hover:text-white'
                }`}
                title="العامية السودانية الطبيعية"
              >
                🇸🇩 عامية سودانية
              </button>
              <button
                onClick={() => setLanguage('ar')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  language === 'ar' ? 'bg-emerald-500 text-zinc-950 font-black' : 'text-zinc-400 hover:text-white'
                }`}
                title="العربية الفصحى السليمة"
              >
                عربية فصحى
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  language === 'en' ? 'bg-emerald-500 text-zinc-950 font-black' : 'text-zinc-400 hover:text-white'
                }`}
                title="English"
              >
                🇬🇧 English
              </button>
            </div>
          </div>

          {/* Start Action Button */}
          <div className="flex items-end pt-1 md:pt-0">
            <button
              onClick={handleStartLearning}
              disabled={isGeneratingPlan}
              className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-40 text-zinc-950 font-black rounded-2xl text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
            >
              {isGeneratingPlan ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-zinc-950" />}
              <span>🚀 ابدأ التعلم هسة</span>
            </button>
          </div>
        </div>

        {/* Preset Topic Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-[11px] text-zinc-500 font-bold">أمثلة سريعة:</span>
          {TOPIC_PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => {
                setTopic(p.name);
                showToast(`تم اختيار المادة: ${p.name}`);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs transition-all flex items-center gap-1.5 border ${
                topic.toLowerCase() === p.name.toLowerCase()
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-bold'
                  : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-white'
              }`}
            >
              <span>{p.icon}</span>
              <span>{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: INTERACTIVE LESSON VIEW */}
      {activeTab === 'learn' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          
          {/* Main Lesson Explanation Panel (2 Columns) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Active Lesson Header & Card */}
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative">
              
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      مادة: {topic}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      مستوى: {level}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {language === 'sd-ar' ? '🇸🇩 عامية سودانية' : language === 'en' ? '🇬🇧 English' : 'عربية فصحى'}
                    </span>
                  </div>

                  <h2 className="text-xl md:text-2xl font-black text-white">
                    {currentLessonTitle || `الدرس الأول: أساسيات ${topic}`}
                  </h2>
                </div>

                {/* Text To Speech Control Bar */}
                <div className="flex items-center gap-2 bg-zinc-950 p-2 rounded-2xl border border-zinc-800">
                  <button
                    onClick={handleToggleSpeech}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isPlayingAudio
                        ? 'bg-rose-500 text-zinc-950 animate-pulse'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
                    }`}
                  >
                    {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    <span>{isPlayingAudio ? 'إيقاف الصوت' : '🔊 استمع للشرح'}</span>
                  </button>

                  {/* Speech Speed Select */}
                  <select
                    value={speechSpeed}
                    onChange={(e) => setSpeechSpeed(parseFloat(e.target.value))}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl px-2 py-1 text-[11px] text-amber-400 font-bold focus:outline-none"
                    title="سرعة نطق الصوت"
                  >
                    <option value={0.75}>0.75x (بطيء)</option>
                    <option value={1.0}>1.0x (طبيعي)</option>
                    <option value={1.25}>1.25x (سريع)</option>
                    <option value={1.5}>1.5x (فائق)</option>
                    <option value={2.0}>2.0x (مضاعف)</option>
                  </select>
                </div>
              </div>

              {/* Main Explanation Body */}
              <div className="space-y-4">
                <h3 className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Brain className="w-4 h-4" />
                  <span>الشرح التعليمي التفاعلي:</span>
                </h3>

                <div className="p-5 bg-zinc-950/80 border border-zinc-800 rounded-2xl text-zinc-200 text-sm leading-relaxed whitespace-pre-line shadow-inner">
                  {currentExplanation || `أهلاً بك! اكتب المادة التي تود تعلمها واضغط "ابدأ التعلم" لإنشاء درسك الأول مخصصاً بأحدث تقنيات Gemini.`}
                </div>
              </div>

              {/* Practical Example Box */}
              {currentExample && (
                <div className="p-4 bg-amber-950/20 border border-amber-500/30 rounded-2xl space-y-1.5">
                  <h4 className="text-xs font-black text-amber-400 flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4" />
                    <span>مثال تطبيقي مبسط:</span>
                  </h4>
                  <p className="text-xs text-amber-200/90 leading-relaxed">
                    {currentExample}
                  </p>
                </div>
              )}

              {/* Checking Question */}
              {currentCheckQuestion && (
                <div className="p-4 bg-cyan-950/20 border border-cyan-500/30 rounded-2xl space-y-1.5">
                  <h4 className="text-xs font-black text-cyan-400 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4" />
                    <span>سؤال لتفقد الفهم:</span>
                  </h4>
                  <p className="text-xs text-cyan-200/90 font-bold">
                    {currentCheckQuestion}
                  </p>
                </div>
              )}

              {/* Adaptive Re-Explanation Buttons (أزرار إعادة الشرح والمستويات) */}
              <div className="space-y-2 pt-2 border-t border-zinc-800">
                <span className="text-[11px] text-zinc-400 font-bold">لم تفهم النقطة جيداً؟ اختر طريقة إعادة الشرح المناسبة لك:</span>
                
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleReExplain('explain')}
                    disabled={isExplaining}
                    className="px-3.5 py-2 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-xs text-zinc-200 font-bold transition-all flex items-center gap-1.5 disabled:opacity-40"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
                    <span>🔄 اشرح مرة أخرى</span>
                  </button>

                  <button
                    onClick={() => handleReExplain('simpler')}
                    disabled={isExplaining}
                    className="px-3.5 py-2 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-xs text-amber-300 font-bold transition-all flex items-center gap-1.5 disabled:opacity-40"
                  >
                    <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                    <span>💡 اشرح بطريقة أبسط</span>
                  </button>

                  <button
                    onClick={() => handleReExplain('example')}
                    disabled={isExplaining}
                    className="px-3.5 py-2 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-xs text-cyan-300 font-bold transition-all flex items-center gap-1.5 disabled:opacity-40"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                    <span>📚 أعطني مثالاً</span>
                  </button>

                  <button
                    onClick={() => handleReExplain('exercise')}
                    disabled={isExplaining}
                    className="px-3.5 py-2 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-xs text-purple-300 font-bold transition-all flex items-center gap-1.5 disabled:opacity-40"
                  >
                    <Zap className="w-3.5 h-3.5 text-purple-400" />
                    <span>🧩 أعطني تمرينًا</span>
                  </button>

                  <button
                    onClick={handleStartQuiz}
                    className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black rounded-xl text-xs transition-all flex items-center gap-1.5"
                  >
                    <Target className="w-3.5 h-3.5 fill-zinc-950" />
                    <span>🎯 اختبرني الآن</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Interactive Tutor Chat Assistant Panel */}
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-5 md:p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <h3 className="text-xs font-black text-zinc-300 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>اسأل المدرّس الذكي عن أي نقطة في هذا الدرس:</span>
                </h3>

                <div className="flex items-center gap-1">
                  <button
                    onClick={handleRegenerateLastReply}
                    disabled={isSendingChat}
                    className="px-2.5 py-1 bg-zinc-950 border border-zinc-800 text-zinc-300 hover:text-emerald-400 rounded-xl text-[10px] font-bold flex items-center gap-1 transition-all"
                    title="إعادة توليد الإجابة الأخيرة"
                  >
                    <Repeat className="w-3 h-3 text-emerald-400" />
                    <span>إعادة الإجابة</span>
                  </button>
                </div>
              </div>

              {/* Hidden File & Image Inputs */}
              <input
                type="file"
                ref={imageInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              <input
                type="file"
                ref={fileInputRef}
                accept=".txt,.pdf,.doc,.docx"
                className="hidden"
                onChange={handleFileUpload}
              />

              {/* Chat Messages Feed */}
              <div className="h-72 overflow-y-auto bg-zinc-950/80 border border-zinc-800/80 rounded-2xl p-4 space-y-3 shadow-inner">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-4 text-zinc-500 space-y-2">
                    <GraduationCap className="w-8 h-8 text-emerald-500/40 animate-bounce" />
                    <p className="text-xs font-bold">مرحباً بك! أنا مدرسك الذكي SAi. يمكنك طرح أي سؤال أو مسألة هنا وسأشرحها لك خطوة بخطوة.</p>
                  </div>
                ) : (
                  messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex flex-col ${m.sender === 'user' ? 'items-start' : 'items-end'}`}
                    >
                      <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed space-y-2 ${
                        m.sender === 'user'
                          ? 'bg-emerald-500 text-zinc-950 font-bold rounded-tr-none shadow-md'
                          : 'bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-tl-none shadow-md'
                      }`}>
                        <div className="whitespace-pre-wrap">{m.text}</div>

                        {/* Action buttons on Tutor messages */}
                        {m.sender === 'tutor' && (
                          <div className="flex items-center gap-2 pt-2 border-t border-zinc-800/80 text-[10px]">
                            <button
                              onClick={() => speakMessage(m.text)}
                              className="px-2 py-1 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-emerald-400 rounded-lg flex items-center gap-1 font-bold transition-all"
                              title="استمع إلى الشرح بصوت واضح"
                            >
                              <Volume2 className="w-3 h-3 text-emerald-400" />
                              <span>استماع</span>
                            </button>

                            <button
                              onClick={() => copyToClipboard(m.text)}
                              className="px-2 py-1 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded-lg flex items-center gap-1 font-bold transition-all"
                              title="نسخ النص"
                            >
                              <Copy className="w-3 h-3 text-zinc-400" />
                              <span>نسخ</span>
                            </button>
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] text-zinc-600 px-1 pt-1">{m.timestamp}</span>
                    </div>
                  ))
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Attachment Previews */}
              {(attachedImage || attachedFileName) && (
                <div className="flex items-center gap-2 p-2 bg-zinc-950 border border-emerald-500/30 rounded-2xl">
                  {attachedImage && (
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-emerald-500/40">
                      <img src={attachedImage} alt="مرفق" className="w-full h-full object-cover" />
                      <button
                        onClick={() => setAttachedImage(null)}
                        className="absolute top-0.5 right-0.5 p-0.5 bg-black/80 rounded-full text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  {attachedFileName && (
                    <div className="flex items-center justify-between flex-1 bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-800 text-xs">
                      <div className="flex items-center gap-1.5 text-emerald-300 font-bold truncate">
                        <FileText className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{attachedFileName}</span>
                      </div>
                      <button
                        onClick={() => {
                          setAttachedFileName(null);
                          setAttachedFileText(null);
                        }}
                        className="text-zinc-400 hover:text-red-400 p-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Chat Input Bar */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => imageInputRef.current?.click()}
                  className="p-2.5 bg-zinc-950 border border-zinc-800 hover:border-emerald-500/40 text-zinc-400 hover:text-emerald-400 rounded-2xl transition-all"
                  title="رفع صورة للدرس أو المسألة"
                >
                  <ImageIcon className="w-4 h-4" />
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2.5 bg-zinc-950 border border-zinc-800 hover:border-emerald-500/40 text-zinc-400 hover:text-emerald-400 rounded-2xl transition-all"
                  title="رفع مستند أو ملف دراسي"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                  placeholder="اسأل معلمك: لم أفهم هذه النقطة، حل لي هذه المسألة..."
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />

                <button
                  onClick={() => handleSendChat()}
                  disabled={isSendingChat || (!chatInput.trim() && !attachedImage && !attachedFileText)}
                  className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-zinc-950 font-black rounded-2xl text-xs transition-all flex items-center gap-1 cursor-pointer"
                >
                  {isSendingChat ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  <span>إرسال</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar: Learning Plan Roadmap */}
          <div className="space-y-6">
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <h3 className="text-xs font-black text-white flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-amber-400" />
                  <span>خطة التعلم الشخصية (Roadmap)</span>
                </h3>

                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                  {plan ? `${plan.weeks.length} مراحل` : 'في الانتظار'}
                </span>
              </div>

              {plan ? (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                  <p className="text-xs text-zinc-400 italic">
                    {plan.summary}
                  </p>

                  {plan.weeks.map((week) => (
                    <div key={week.week_number} className="bg-zinc-950/80 border border-zinc-800/80 rounded-2xl p-3.5 space-y-2">
                      <div className="flex items-center justify-between text-xs font-black text-emerald-400">
                        <span>المرحلة {week.week_number}</span>
                        <span>{week.title}</span>
                      </div>

                      <ul className="space-y-1 pt-1">
                        {week.topics.map((tp, idx) => (
                          <li
                            key={idx}
                            onClick={() => {
                              setCurrentLessonTitle(tp);
                              handleReExplain('explain');
                            }}
                            className="text-xs text-zinc-300 hover:text-emerald-300 cursor-pointer p-1.5 rounded-lg hover:bg-zinc-900 flex items-center justify-between transition-colors"
                          >
                            <span>• {tp}</span>
                            <ChevronRight className="w-3 h-3 text-zinc-600" />
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center space-y-2 bg-zinc-950/50 rounded-2xl border border-dashed border-zinc-800">
                  <GraduationCap className="w-8 h-8 text-zinc-600 mx-auto" />
                  <p className="text-xs text-zinc-400 font-bold">لم تقم بإنشاء مسار تعلم بعد</p>
                  <p className="text-[11px] text-zinc-500">اختر مادة من أعلى واضغط "ابدأ التعلم" لإنشاء الخطة.</p>
                </div>
              )}
            </div>

            {/* Returning Student Welcome Back Memory Banner */}
            <div className="bg-gradient-to-r from-emerald-950/60 to-zinc-900 border border-emerald-500/30 rounded-3xl p-5 space-y-2 shadow-lg">
              <div className="flex items-center gap-2 text-xs font-black text-emerald-400">
                <span>👋 مرحباً بعودتك إلى SAi Tutor</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                آخر نقطة توقفت عندها: <span className="font-bold text-white">({progressData.last_lesson})</span>.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => {
                    setCurrentLessonTitle(progressData.next_lesson);
                    handleReExplain('explain');
                  }}
                  className="w-full py-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <span>متابعة الدرس التالي 🚀</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: UNIT QUIZ VIEW */}
      {activeTab === 'quiz' && (
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl animate-fade-in max-w-4xl mx-auto">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-400" />
                <span>{currentQuiz?.quiz_title || `اختبار قصير لـ ${topic}`}</span>
              </h2>
              <p className="text-xs text-zinc-400">اختبر استيعابك للمفاهيم واصلح أخطاءك مباشرة</p>
            </div>

            <button
              onClick={handleStartQuiz}
              disabled={isGeneratingQuiz}
              className="px-4 py-2 bg-zinc-950 border border-zinc-800 text-emerald-400 font-bold rounded-xl text-xs flex items-center gap-1.5 hover:bg-zinc-800"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>توليد أسئلة جديدة</span>
            </button>
          </div>

          {currentQuiz ? (
            <div className="space-y-6">
              {currentQuiz.questions.map((q, idx) => (
                <div key={q.id} className="bg-zinc-950/80 border border-zinc-800/80 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-black text-amber-400">
                    <span className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      {idx + 1}
                    </span>
                    <span>{q.question}</span>
                  </div>

                  {/* Options for Multiple Choice & True/False */}
                  {q.options && q.options.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {q.options.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setUserAnswers({ ...userAnswers, [q.id]: opt })}
                          className={`p-3 rounded-xl text-xs text-right font-bold transition-all border ${
                            userAnswers[q.id] === opt
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500 font-black shadow-md'
                              : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={userAnswers[q.id] || ''}
                      onChange={(e) => setUserAnswers({ ...userAnswers, [q.id]: e.target.value })}
                      placeholder="اكتب إجابتك هنا..."
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  )}
                </div>
              ))}

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleEvaluateQuiz}
                  className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-zinc-950 font-black rounded-2xl text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 fill-zinc-950" />
                  <span>تصحيح وتقييم الاختبار 🎯</span>
                </button>
              </div>

              {/* Quiz Results Panel */}
              {quizResult && (
                <div className="mt-6 p-6 bg-gradient-to-r from-zinc-950 via-zinc-900 to-emerald-950/60 border border-emerald-500/40 rounded-3xl space-y-4 animate-fade-in shadow-2xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-emerald-500/20 rounded-2xl text-emerald-400 font-black text-xl border border-emerald-500/40">
                        {quizResult.score} / {quizResult.total}
                      </div>
                      <div>
                        <h3 className="text-base font-black text-white">النتيجة: {quizResult.percentage}%</h3>
                        <p className="text-xs text-emerald-300 font-bold">{quizResult.feedback}</p>
                      </div>
                    </div>

                    <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                      {quizResult.recommendation}
                    </span>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-zinc-800">
                    <h4 className="text-xs font-black text-zinc-300">تفاصيل الإجابات والشرح:</h4>
                    {quizResult.details.map((d, i) => (
                      <div key={i} className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-xs space-y-1">
                        <div className="flex items-center justify-between font-bold">
                          <span className="text-white">{d.question}</span>
                          <span className={d.is_correct ? 'text-emerald-400' : 'text-rose-400'}>
                            {d.is_correct ? 'إجابة صحيحة ✓' : 'إجابة تحتاج مراجعة ✗'}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400">إجابتك: ({d.user_answer || 'لم تجب'}) • الإجابة الصحيحة: ({d.correct_answer})</p>
                        <p className="text-[11px] text-emerald-300/80 italic">{d.explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center space-y-3 bg-zinc-950/60 border border-dashed border-zinc-800 rounded-3xl">
              <Target className="w-10 h-10 text-zinc-600 mx-auto" />
              <p className="text-xs text-zinc-300 font-bold">اضغط "توليد أسئلة جديدة" لإنشاء اختبار لدرسك الحقيقي</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: STUDENT PROGRESS DASHBOARD */}
      {activeTab === 'progress' && (
        <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-zinc-900/90 border border-zinc-800 p-5 rounded-3xl space-y-2 text-center">
              <div className="text-xs text-zinc-400 font-bold">نسبة إكمال المادة</div>
              <div className="text-3xl font-black text-emerald-400">{progressData.completion_percentage}%</div>
              <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full" style={{ width: `${progressData.completion_percentage}%` }} />
              </div>
            </div>

            <div className="bg-zinc-900/90 border border-zinc-800 p-5 rounded-3xl space-y-2 text-center">
              <div className="text-xs text-zinc-400 font-bold">الدروس المكتملة</div>
              <div className="text-3xl font-black text-amber-400">{progressData.completed_lessons} / {progressData.total_lessons || 10}</div>
              <p className="text-[11px] text-zinc-500">واصل لإكمال الخطة بالكامل</p>
            </div>

            <div className="bg-zinc-900/90 border border-zinc-800 p-5 rounded-3xl space-y-2 text-center">
              <div className="text-xs text-zinc-400 font-bold">معدل درجات الاختبارات</div>
              <div className="text-3xl font-black text-cyan-400">{progressData.quiz_average}%</div>
              <p className="text-[11px] text-zinc-500">مستوى أداء ممتاز</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Strengths & Weak Points */}
            <div className="bg-zinc-900/90 border border-zinc-800 p-6 rounded-3xl space-y-4">
              <h3 className="text-xs font-black text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>نقاط القوة والمفاهيم المتقنة:</span>
              </h3>
              <ul className="space-y-2">
                {progressData.strengths?.map((st: string, idx: number) => (
                  <li key={idx} className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>{st}</span>
                  </li>
                ))}
              </ul>

              <h3 className="text-xs font-black text-rose-400 flex items-center gap-2 pt-2">
                <XCircle className="w-4 h-4" />
                <span>مفاهيم تحتاج إلى مراجعة وتدريب:</span>
              </h3>
              <ul className="space-y-2">
                {progressData.weak_points?.map((wp: string, idx: number) => (
                  <li key={idx} className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-rose-400" />
                    <span>{wp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* History Table */}
            <div className="bg-zinc-900/90 border border-zinc-800 p-6 rounded-3xl space-y-4">
              <h3 className="text-xs font-black text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>سجل الدروس والاختبارات السابقة:</span>
              </h3>

              <div className="space-y-2.5">
                {progressData.history?.map((h: any, idx: number) => (
                  <div key={idx} className="p-3 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <div className="font-bold text-white">{h.lesson}</div>
                      <div className="text-[10px] text-zinc-500">{h.date}</div>
                    </div>

                    <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                      الدرجة: {h.score}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default TutorView;
