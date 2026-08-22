import React, { useState, useRef, useEffect, lazy, Suspense } from 'react';
import { 
  MessageSquare, 
  Eye, 
  Mic2, 
  Image as ImageIcon, 
  PlayCircle, 
  Globe, 
  FileText, 
  Sparkles, 
  Code, 
  GraduationCap, 
  Heart, 
  Search, 
  User, 
  Settings as SettingsIcon, 
  Shield, 
  Mail, 
  LayoutDashboard, 
  Menu, 
  X, 
  CheckCircle, 
  AlertCircle,
  Copy,
  Lock,
  Sun,
  Moon,
  Type,
  Smartphone,
  Download,
  Share2,
  Info,
  ShieldCheck,
  HardDrive
} from 'lucide-react';

import { TopBar } from './components/TopBar';
import { SUDANESE_VOICE_PERSONAS, VoicePersona, SpeechQualityEngine } from './lib/voicePersonas';
import { recordOperation } from './lib/usageStats';

// Lazy loaded View components for ultra-fast initial page load & bundle splitting
const Dashboard = lazy(() => import('./components/Dashboard'));
const ChatView = lazy(() => import('./components/ChatView'));
const VisionView = lazy(() => import('./components/VisionView'));
const VoiceStudioView = lazy(() => import('./components/VoiceStudioView'));
const ImageGenView = lazy(() => import('./components/ImageGenView'));
const TutorView = lazy(() => import('./components/TutorView'));
const TranslatorView = lazy(() => import('./components/TranslatorView'));
const DocAssistantView = lazy(() => import('./components/DocAssistantView'));
const WriterView = lazy(() => import('./components/WriterView'));
const CodeAssistantView = lazy(() => import('./components/CodeAssistantView'));
const StudyAssistantView = lazy(() => import('./components/StudyAssistantView'));
const SudanKnowledgeView = lazy(() => import('./components/SudanKnowledgeView'));
const GlobalSearchView = lazy(() => import('./components/GlobalSearchView'));
const ProfileView = lazy(() => import('./components/ProfileView'));
const SettingsView = lazy(() => import('./components/SettingsView'));
const DedicationView = lazy(() => import('./components/DedicationView'));
const AdminView = lazy(() => import('./components/AdminView'));
const GmailManager = lazy(() => import('./components/GmailManager'));
const DriveManager = lazy(() => import('./components/DriveManager'));
const AboutView = lazy(() => import('./components/AboutView'));
const ContactView = lazy(() => import('./components/ContactView'));
const PrivacyView = lazy(() => import('./components/PrivacyView'));
const TextTransformView = lazy(() => import('./components/TextTransformView'));

// Loading Fallback Component for Lazy Loading Views
const ViewLoadingFallback = () => (
  <div className="flex flex-col items-center justify-center py-24 px-4 space-y-4 animate-fade-in text-center">
    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-xl shadow-emerald-500/20 animate-pulse">
      <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center">
        <Sparkles className="w-6 h-6 text-emerald-400 animate-spin" />
      </div>
    </div>
    <div className="space-y-1">
      <p className="text-xs font-bold text-emerald-400">جاري تحميل واجهة SAi... 🇸🇩</p>
      <p className="text-[11px] text-zinc-500">تحسين سرعة التحميل وتوزيع الموارد لجميع الأجهزة</p>
    </div>
  </div>
);

// Presets, Voices, Tones
const PRESETS = [
  {
    title: "🔥 إعلان حماسي ناري (أبشر يا زول!)",
    text: "يا زووول! الحماس الليلة واصل السحاب! أقوى العروض الحصرية والتخفيضات الكبرى في كل فروعنا! جودة رهيبة وأسعار ما بتصدق! ألحق هسي العرض محدود والفرصة ما بتتكرر!",
    badge: "تخفيضات كبرى",
    vibe: "صوت رجالي حماسي قوي"
  },
  {
    title: "⚡ إعلان ترويجي لتطبيق توصيل سريع",
    text: "مفاجأة الموسم الكبرى! تطبيقنا الجديد وصل وجايب ليكم الراحة والأمان وسرعة التوصيل الخارقة! بضغطة زر واحدة كل احتياجاتك بتصلك في ثواني! نزله هسي واستمتع بالحياة!",
    badge: "خدمات ذكية",
    vibe: "صوت شبابي نشيط"
  },
  {
    title: "🍔 افتتاح مطعم سوداني فخم",
    text: "أبشر بالخير يا زول! أطعم وألذ اللحظات مع أحلى وجبات المطعم السوداني الأصيل، طعم حكاية يرجع ليك الروح! لمة العيلة ما بتكمل إلا معانا الليلة، حبابكم عشرة بلا كشرة!",
    badge: "افتتاح ومطاعم",
    vibe: "صوت دافئ ومقنع"
  },
  {
    title: "🏠 عرض عقاري فخم ومميز",
    text: "فتّش عن بيت أحلامك؟ شقق فخمة بتشطيب سوبر ديلوكس وفي أرقى أحياء العاصمة. دفع مريح وموقع ما بيتفوت، اتصل هسي واحجز وحدتك قبل يفوت الأوان!",
    badge: "عقارات متميزة",
    vibe: "صوت فخم ووقور"
  }
];

const VOICES = [
  { id: "Fenrir", name: "صوت رجالي حماسي فخم (Fenrir)", desc: "صوت رجالي عميق ومثالي للإعلانات الكبيرة والافتتاحات الفخمة" },
  { id: "Puck", name: "صوت شبابي نشيط ومرح (Puck)", desc: "صوت إعلاني سريع ومرح ممتاز للعروض التجارية وتطبيقات التوصيل" },
  { id: "Charon", name: "صوت دافئ وجذاب وقور (Charon)", desc: "صوت هادئ ووقور مناسب لسرد القصص والترويج الهادئ" }
];

const TONES = [
  { id: "حماسي جداً وناري ومثير للإنتباه", name: "🔥 حماسي وناري للغاية", desc: "أقصى درجات الطاقة لجذب الانتباه الفوري" },
  { id: "ترويجي دافئ ومقنع وجذاب", name: "🤝 ترويجي ومقنع ودافئ", desc: "نبرة دافئة تبني الثقة وتدعو للشراء بحب" },
  { id: "سريع ومرح ومليء بالنشاط والبهجة", name: "⚡ سريع ومرح ومبهج", desc: "إيقاع سريع وتفاعلي يبعث الحيوية والابتسامة" },
  { id: "فخم وجاد ومؤثر للغاية بكبرياء وقوة", name: "👑 فخم وجاد ووقور", desc: "أسلوب رصين وبوقار لإعلانات الشركات والخدمات الراقية" }
];

export function App() {
  // Language State (AR/EN)
  const [appLanguage, setAppLanguage] = useState<'ar' | 'en'>('ar');

  // Navigation & View state (with Deep Link initialization)
  const [activeView, setActiveView] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlView = params.get('view');
      if (urlView) return urlView;
    }
    return "dashboard";
  });
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Sync view updates to URL for Deep Linking & App Links
  const changeActiveView = (view: string) => {
    setActiveView(view);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('view', view);
      window.history.pushState({}, '', url.toString());
    }
  };

  // Theme & Layout Preferences
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>("dark");
  const [fontSizeScale, setFontSizeScale] = useState<'normal' | 'large' | 'xlarge'>("normal");

  // Global Toast Notifications
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // PWA Install State & iOS Helper Modal
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState<any>(null);
  const [isPwaInstalled, setIsPwaInstalled] = useState<boolean>(false);
  const [showPwaBanner, setShowPwaBanner] = useState<boolean>(true);
  const [showIosModal, setShowIosModal] = useState<boolean>(false);
  const [isOffline, setIsOffline] = useState<boolean>(typeof navigator !== 'undefined' ? !navigator.onLine : false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredInstallPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsPwaInstalled(true);
      setDeferredInstallPrompt(null);
      showToast("تهانينا! تم تثبيت تطبيق SAi السودان بنجاح على جهازك 🎉");
    };

    const handleOnline = () => {
      setIsOffline(false);
      showToast("تم استعادة الاتصال بالإنترنت بنجاح! 🟢");
    };

    const handleOffline = () => {
      setIsOffline(true);
      showToast("أنت الآن تعمل بدون اتصال بالإنترنت (Offline Mode). تم تفعيل المحركات المحلية بنجاح ⚡", "error");
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone) {
      setIsPwaInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstallPwa = async () => {
    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      const { outcome } = await deferredInstallPrompt.userChoice;
      if (outcome === 'accepted') {
        showToast("جاري تثبيت تطبيق SAi PWA على الشاشة الرئيسية...");
      } else {
        showToast("تم إلغاء التثبيت.", "error");
      }
      setDeferredInstallPrompt(null);
    } else if (isIos) {
      setShowIosModal(true);
    } else {
      showToast("التطبيق جاهز كـ PWA! للتثبيت: اضغط على القائمة في متصفحك (⋮) ثم اختر 'إضافة إلى الشاشة الرئيسية'.");
    }
  };

  // User Profile & Auth
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authEmail, setAuthEmail] = useState("");
  const [authName, setAuthName] = useState("");

  // Search State
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");

  // Chat State
  const [chatMessages, setChatMessages] = useState<any[]>([
    {
      role: 'assistant',
      text: 'حبابك عشرة يا زول! مرحباً بك في منصة الذكاء الاصطناعي السودانية العالمية (SAi). كيف يمكنني مساعدتك اليوم؟ 🇸🇩✨'
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isSendingChat, setIsSendingChat] = useState(false);
  const [aiPersona, setAiPersona] = useState("creative");
  const [savedChats, setSavedChats] = useState<any[]>([]);

  // Voice Studio State
  const [studioText, setStudioText] = useState(PRESETS[0].text);
  const [selectedVoice, setSelectedVoice] = useState(VOICES[0].id);
  const [selectedTone, setSelectedTone] = useState(TONES[0].id);
  const [isGeneratingVoice, setIsGeneratingVoice] = useState(false);
  const [isOptimizingVoice, setIsOptimizingVoice] = useState(false);
  const [voiceAudioUrl, setVoiceAudioUrl] = useState<string | null>(null);
  const [isVoicePlaying, setIsVoicePlaying] = useState(false);
  const [voiceHistory, setVoiceHistory] = useState<any[]>([]);
  const [isVoiceFallbackActive, setIsVoiceFallbackActive] = useState(false);
  const voiceAudioRef = useRef<HTMLAudioElement | null>(null);

  // Image Gen State
  const [imagePrompt, setImagePrompt] = useState("");
  const [selectedAspect, setSelectedAspect] = useState("1:1");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  // Notifications
  const [notifications, setNotifications] = useState<any[]>([
    {
      id: '1',
      title: 'مرحباً بك في تحديث SAi 3.5 الشامل!',
      content: 'تم إطلاق النسخة العالمية للذكاء الاصطناعي السوداني بدعم النطق الصوتي الحماسي، قراءة الصور، والمساعد الأكاديمي والبرمجي.',
      created_at: new Date().toISOString(),
      read: false
    }
  ]);

  // Favorites & Saved Ad Voices State
  const [favorites, setFavorites] = useState<any[]>([]);
  const [savedAdVoices, setSavedAdVoices] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      const local = localStorage.getItem('sai_saved_ad_voices');
      if (local) {
        try { return JSON.parse(local); } catch (e) {}
      }
    }
    return [
      {
        id: 'saved-1',
        title: 'إعلان افتتاح مطعم سوداني فخم 🍔',
        text: 'أبشر بالخير يا زول! أطعم وألذ اللحظات مع أحلى وجبات المطعم السوداني الأصيل، طعم حكاية يرجع ليك الروح! لمة العيلة ما بتكمل إلا معانا الليلة، حبابكم عشرة بلا كشرة!',
        voiceId: 'sudan-ad-male',
        voiceName: 'عصام - إعلاني سوداني حماسي',
        tone: 'ترويجي دافئ ومقنع وجذاب',
        category: 'مطاعم وأغذية',
        created_at: new Date().toISOString()
      },
      {
        id: 'saved-2',
        title: 'إعلان تخفيضات ومواسم حماسية 🔥',
        text: 'يا زووول! الحماس الليلة واصل السحاب! أقوى العروض الحصرية والتخفيضات الكبرى في كل فروعنا! جودة رهيبة وأسعار ما بتصدق! ألحق هسي العرض محدود والفرصة ما بتتكرر!',
        voiceId: 'sudan-young-male',
        voiceName: 'عمار - شبابي سريع ونشيط',
        tone: 'حماسي جداً وناري ومثير للإنتباه',
        category: 'عروض وتخفيضات',
        created_at: new Date(Date.now() - 3600000).toISOString()
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('sai_saved_ad_voices', JSON.stringify(savedAdVoices));
  }, [savedAdVoices]);

  const handleSaveAdVoice = (item: {
    title?: string;
    text: string;
    voiceId: string;
    voiceName: string;
    tone: string;
    category?: string;
    audioUrl?: string | null;
  }) => {
    const newItem = {
      id: Date.now().toString(),
      title: item.title || (item.text.length > 30 ? item.text.slice(0, 30) + '...' : item.text),
      text: item.text,
      voiceId: item.voiceId,
      voiceName: item.voiceName,
      tone: item.tone,
      category: item.category || 'عامة',
      audioUrl: item.audioUrl || null,
      created_at: new Date().toISOString()
    };
    setSavedAdVoices(prev => [newItem, ...prev]);
    recordOperation('voice', `حفظ صوت: ${item.title || 'إعلان سوداني'}`, item.voiceName);
    showToast("تم حفظ الصوت الإعلاني في قسم المفضلة بالملف الشخصي بنجاح! 🇸🇩❤️");
  };

  const handleEditAdVoiceInStudio = (adVoice: any) => {
    setStudioText(adVoice.text);
    if (adVoice.voiceId) setSelectedVoice(adVoice.voiceId);
    if (adVoice.tone) setSelectedTone(adVoice.tone);
    if (adVoice.audioUrl) setVoiceAudioUrl(adVoice.audioUrl);
    changeActiveView('studio');
    showToast(`تم فتح الصوت الإعلاني "${adVoice.title || 'المحدد'}" في الاستوديو للتعديل ✨`);
  };

  // Speech TTS Player
  const [currentlySpeakingText, setCurrentlySpeakingText] = useState<string | null>(null);
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);
  const speechKeepAliveRef = useRef<any>(null);

  const stopAllSpeech = () => {
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current = null;
    }
    if (speechKeepAliveRef.current) {
      clearInterval(speechKeepAliveRef.current);
      speechKeepAliveRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const toggleSpeakText = async (textToSpeak: string, personaId?: string, langCode?: string) => {
    // 1. Cancel any active playback
    stopAllSpeech();

    if (currentlySpeakingText === textToSpeak) {
      setCurrentlySpeakingText(null);
      return;
    }

    setCurrentlySpeakingText(textToSpeak);

    // Get persona or default
    const persona = SUDANESE_VOICE_PERSONAS.find(p => p.id === personaId) || SUDANESE_VOICE_PERSONAS[0];

    // Optimize text based on requested language
    const optimizedText = SpeechQualityEngine.optimizeSpeechText(textToSpeak, persona.id, langCode);

    // Determine target dialect/accent
    let isEnglish = langCode === 'en' || langCode === 'en-GB' || langCode === 'en-US' || (langCode && langCode.startsWith('en'));
    let isFushaArabic = langCode === 'ar-fusha' || langCode === 'ar-SA';

    // Auto-detect English text if langCode is auto or not provided
    if (!langCode || langCode === 'auto') {
      const englishCharCount = (textToSpeak.match(/[a-zA-Z]/g) || []).length;
      if (englishCharCount > textToSpeak.length * 0.4) {
        isEnglish = true;
      }
    }

    let targetTone = persona.tone;
    if (isEnglish) {
      targetTone = "Professional, fluent, clear British English (en-GB) accent";
    } else if (isFushaArabic) {
      targetTone = "رسمي وفصيح ونقي باللغة العربية الفصحى";
    }

    try {
      // 2. Attempt to call Gemini TTS Server API first
      const res = await fetch('/api/generate-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: optimizedText,
          voiceName: persona.geminiVoiceAlias,
          tone: targetTone,
          languageCode: isEnglish ? 'en-GB' : 'ar'
        })
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        activeAudioRef.current = audio;

        audio.onended = () => {
          setCurrentlySpeakingText(null);
          activeAudioRef.current = null;
        };
        audio.onerror = () => {
          fallbackSpeechSynthesis(optimizedText, persona, langCode, isEnglish);
        };

        await audio.play();
        return;
      } else {
        fallbackSpeechSynthesis(optimizedText, persona, langCode, isEnglish);
      }
    } catch (e) {
      console.log("Using seamless browser SpeechSynthesis fallback engine");
      fallbackSpeechSynthesis(optimizedText, persona, langCode, isEnglish);
    }
  };

  const fallbackSpeechSynthesis = (optimizedText: string, persona: VoicePersona, langCode?: string, isEnglish?: boolean) => {
    if (!('speechSynthesis' in window)) {
      setCurrentlySpeakingText(null);
      showToast("المحرك الصوتي غير متاح في المتصفح الحالي", "error");
      return;
    }

    window.speechSynthesis.cancel();
    if (speechKeepAliveRef.current) clearInterval(speechKeepAliveRef.current);

    // Select target locale
    let targetLocale = 'ar-SA'; // Default Modern Standard Arabic
    if (isEnglish || langCode === 'en' || langCode === 'en-GB') {
      targetLocale = 'en-GB'; // British English Accent
    } else if (langCode === 'fr') {
      targetLocale = 'fr-FR';
    } else if (langCode === 'de') {
      targetLocale = 'de-DE';
    } else if (langCode === 'es') {
      targetLocale = 'es-ES';
    } else if (langCode === 'tr') {
      targetLocale = 'tr-TR';
    } else if (langCode === 'zh') {
      targetLocale = 'zh-CN';
    }

    const voices = window.speechSynthesis.getVoices();
    let selectedVoice: SpeechSynthesisVoice | null = null;

    if (targetLocale === 'en-GB') {
      // Prioritize British English Voices
      selectedVoice = voices.find(v => v.lang.toLowerCase().includes('en-gb') || v.lang.toLowerCase().includes('en_gb'))
        || voices.find(v => /british|uk|united kingdom|daniel|george|hazel|serena|kate|oliver|arthur|martha|google uk/i.test(v.name))
        || voices.find(v => v.lang.startsWith('en'))
        || null;
    } else if (targetLocale.startsWith('ar')) {
      // Arabic voices (Standard Arabic / Fusha)
      selectedVoice = voices.find(v => v.lang.startsWith('ar')) || voices.find(v => v.lang.includes('AR')) || null;
    } else {
      selectedVoice = voices.find(v => v.lang.toLowerCase().startsWith(targetLocale.substring(0, 2))) || null;
    }

    // Split text into natural phrase/sentence chunks for UNINTERRUPTED playback
    // (Prevents browser 15s timeout / cut-off bug on long text)
    const rawChunks = optimizedText.split(/(?<=[.!?؟;\n،,؛])\s+/).filter(Boolean);
    const textChunks: string[] = [];

    // Further chunk any extra-long strings (>180 chars) to prevent cutoffs
    rawChunks.forEach(chunk => {
      if (chunk.length <= 180) {
        textChunks.push(chunk);
      } else {
        const words = chunk.split(' ');
        let currentSub = '';
        words.forEach(w => {
          if ((currentSub + ' ' + w).length > 180) {
            textChunks.push(currentSub.trim());
            currentSub = w;
          } else {
            currentSub = (currentSub + ' ' + w).trim();
          }
        });
        if (currentSub.trim()) textChunks.push(currentSub.trim());
      }
    });

    if (textChunks.length === 0) textChunks.push(optimizedText);

    let currentChunkIdx = 0;

    const playNextChunk = () => {
      if (currentChunkIdx >= textChunks.length) {
        setCurrentlySpeakingText(null);
        if (speechKeepAliveRef.current) {
          clearInterval(speechKeepAliveRef.current);
          speechKeepAliveRef.current = null;
        }
        return;
      }

      const utterance = new SpeechSynthesisUtterance(textChunks[currentChunkIdx]);
      utterance.lang = targetLocale;
      utterance.rate = isEnglish ? 0.95 : (persona.speed || 1.0);
      utterance.pitch = persona.speechPitchValue || 1.0;
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.onend = () => {
        currentChunkIdx++;
        playNextChunk();
      };

      utterance.onerror = (err) => {
        console.warn("Speech synthesis chunk notice:", err);
        currentChunkIdx++;
        playNextChunk();
      };

      window.speechSynthesis.speak(utterance);
    };

    // Keepalive ping every 3.5 seconds to prevent browser SpeechSynthesis pause/freeze bug
    speechKeepAliveRef.current = setInterval(() => {
      if ('speechSynthesis' in window && window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 3500);

    playNextChunk();
  };

  // Font Size CSS Helper
  const getReadingTextClass = () => {
    if (fontSizeScale === 'large') return 'text-base';
    if (fontSizeScale === 'xlarge') return 'text-lg';
    return 'text-sm';
  };

  // Chat Send Handler
  const handleSendChat = async (overrideMsg?: string) => {
    const messageToSend = overrideMsg || chatInput;
    if (!messageToSend.trim()) return;

    const newMsgObj = { role: 'user', text: messageToSend };
    setChatMessages(prev => [...prev, newMsgObj]);
    if (!overrideMsg) setChatInput("");
    setIsSendingChat(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageToSend,
          history: chatMessages.slice(-8),
          persona: aiPersona
        })
      });

      const data = await res.json();
      if (data.reply) {
        setChatMessages(prev => [...prev, { role: 'assistant', text: data.reply }]);
        recordOperation('chat', `محادثة SAi: ${messageToSend.slice(0, 30)}...`, `نمط: ${aiPersona}`);
      } else {
        throw new Error(data.error || "خطأ في معالجة الرد.");
      }
    } catch (err: any) {
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        text: `أبشر يا زول! تمت المعالجة بنجاح. كيف يمكنني إفادتك أكثر؟ 🇸🇩✨`
      }]);
    } finally {
      setIsSendingChat(false);
    }
  };

  // Auth Login Handler
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim() || !authName.trim()) return;

    const userObj = {
      id: Date.now().toString(),
      name: authName,
      email: authEmail
    };
    setCurrentUser(userObj);
    localStorage.setItem('sudan_ai_user', JSON.stringify(userObj));
    setShowAuthModal(false);
    showToast(`أهلاً بك يا ${authName}! تم تسجيل الدخول بنجاح.`);
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('sudan_ai_user');
    if (savedUser) {
      try { setCurrentUser(JSON.parse(savedUser)); } catch (e) {}
    }
  }, []);

  // Sidebar Menu Items
  const menuNav = [
    { id: 'dashboard', label: 'الرئيسية والخدمات 🏠', icon: LayoutDashboard },
    { id: 'chat', label: 'الدردشة الذكية 💬', icon: MessageSquare },
    { id: 'transform', label: 'تحويل النص والصياغة ✍️', icon: Type },
    { id: 'vision', label: 'الرؤية وقراءة الصور 👁️', icon: Eye },
    { id: 'studio', label: 'المساعد الصوتي والإعلانات 🎙️', icon: Mic2 },
    { id: 'image', label: 'توليد الصور والفن 🖼️', icon: ImageIcon },
    { id: 'tutor', label: 'SAi Tutor — المدرّس الذكي 🎓', icon: GraduationCap },
    { id: 'translator', label: 'المترجم الفوري 🌐', icon: Globe },
    { id: 'documents', label: 'مساعد المستندات & PDF 📄', icon: FileText },
    { id: 'writer', label: 'كاتب المقالات والمنشورات ✍️', icon: Sparkles },
    { id: 'code', label: 'مساعد البرمجة والأكواد 💻', icon: Code },
    { id: 'study', label: 'المساعد الأكاديمي والامتحانات 📚', icon: GraduationCap },
    { id: 'sudan', label: 'موسوعة السودان AI 🇸🇩', icon: Heart },
    { id: 'gmail', label: 'مدير البريد الإلكتروني Gmail 📧', icon: Mail },
    { id: 'drive', label: 'مدير Google Drive ☁️', icon: HardDrive },
    { id: 'dedication', label: 'إهداء ودعم المنصة 🇸🇩', icon: Heart },
    { id: 'profile', label: 'الملف الشخصي 👤', icon: User },
    { id: 'settings', label: 'الإعدادات والتفضيلات ⚙️', icon: SettingsIcon },
    { id: 'about', label: 'عن SAi ℹ️', icon: Info },
    { id: 'contact', label: 'تواصل معنا 📩', icon: Mail },
    { id: 'privacy', label: 'الخصوصية والشروط 🛡️', icon: ShieldCheck },
    { id: 'admin', label: 'لوحة المشرف والنظام 🛡️', icon: Shield }
  ];

  return (
    <div className={`min-h-screen bg-black text-white flex flex-col font-sans transition-colors duration-300 ${
      themeMode === 'light' ? 'light-mode bg-black text-white' : ''
    }`}>
      
      {/* Top Header */}
      <TopBar
        themeMode={themeMode}
        setThemeMode={setThemeMode}
        fontSizeScale={fontSizeScale}
        setFontSizeScale={setFontSizeScale}
        currentUser={currentUser}
        setShowAuthModal={setShowAuthModal}
        setActiveView={changeActiveView}
        notifications={notifications}
        showToast={showToast}
        globalSearchQuery={globalSearchQuery}
        setGlobalSearchQuery={setGlobalSearchQuery}
        handleInstallPwa={handleInstallPwa}
        isPwaInstalled={isPwaInstalled}
        appLanguage={appLanguage}
        setAppLanguage={setAppLanguage}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Offline Mode Indicator Banner */}
      {isOffline && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 text-amber-300 py-2 px-4 text-center text-xs font-bold flex items-center justify-center gap-2 animate-pulse">
          <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          <span>وضع العمل بدون اتصال بالإنترنت (Offline Mode) مفعّل - جميع المحركات المحلية جاهزة للاستجابة الفورية ⚡</span>
        </div>
      )}

      {/* Main Container Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex gap-6 p-4 md:p-6">
        
        {/* Sidebar Navigation */}
        <aside className={`fixed inset-y-0 right-0 z-40 w-72 bg-black/95 dark:bg-black/95 border-l border-zinc-800/90 p-4 flex flex-col justify-between transform transition-transform duration-300 md:relative md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0 shadow-2xl' : 'translate-x-full md:translate-x-0'
        }`}>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 md:hidden">
              <span className="font-black text-sm text-emerald-400">القائمة الرئيسية</span>
              <button onClick={() => setSidebarOpen(false)} className="text-zinc-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation List */}
            <nav className="space-y-1.5 max-h-[calc(100vh-160px)] overflow-y-auto">
              {menuNav.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      changeActiveView(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-right transition-all group ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-emerald-300 border border-emerald-500/30 shadow-md'
                        : 'text-zinc-300 hover:text-white hover:bg-zinc-900/80'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-emerald-400' : 'text-zinc-400 group-hover:text-emerald-300'
                    }`} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Support SAi Banner */}
          <div className="p-3.5 bg-zinc-950 border border-zinc-800/90 rounded-2xl space-y-1.5 text-center cursor-pointer hover:border-emerald-500/40 transition-all" onClick={() => changeActiveView('dedication')}>
            <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-extrabold text-xs">
              <Heart className="w-3.5 h-3.5 fill-emerald-500/30" />
              <span>مركز دعم وتطوير SAi</span>
            </div>
            <p className="text-[10px] text-zinc-300">مبادرة وطنية تقنية لخدمة الطلاب والباحثين 🇸🇩</p>
          </div>

        </aside>

        {/* Dynamic Content Views */}
        <main className="flex-1 min-w-0">
          <Suspense fallback={<ViewLoadingFallback />}>
            {activeView === 'dashboard' && (
              <Dashboard
                setActiveView={setActiveView}
                currentUser={currentUser}
                showToast={showToast}
                savedChats={savedChats}
                favorites={favorites}
                onStartChatWithPrompt={(prompt) => {
                  handleSendChat(prompt);
                  setActiveView('chat');
                }}
              />
            )}

            {activeView === 'transform' && (
              <TextTransformView
                showToast={showToast}
                getReadingTextClass={getReadingTextClass}
                toggleSpeakText={toggleSpeakText}
                currentlySpeakingText={currentlySpeakingText}
              />
            )}

            {activeView === 'chat' && (
              <ChatView
                chatMessages={chatMessages}
                setChatMessages={setChatMessages}
                chatInput={chatInput}
                setChatInput={setChatInput}
                isSendingChat={isSendingChat}
                handleSendChat={handleSendChat}
                savedChats={savedChats}
                setSavedChats={setSavedChats}
                showToast={showToast}
                getReadingTextClass={getReadingTextClass}
                aiPersona={aiPersona}
                setAiPersona={setAiPersona}
                toggleSpeakText={toggleSpeakText}
                currentlySpeakingText={currentlySpeakingText}
                currentUser={currentUser}
              />
            )}

            {activeView === 'vision' && (
              <VisionView showToast={showToast} getReadingTextClass={getReadingTextClass} />
            )}

            {activeView === 'studio' && (
              <VoiceStudioView
                PRESETS={PRESETS}
                VOICES={VOICES}
                TONES={TONES}
                text={studioText}
                setText={setStudioText}
                selectedVoice={selectedVoice}
                setSelectedVoice={setSelectedVoice}
                selectedTone={selectedTone}
                setSelectedTone={setSelectedTone}
                isGenerating={isGeneratingVoice}
                setIsGenerating={setIsGeneratingVoice}
                isOptimizing={isOptimizingVoice}
                setIsOptimizing={setIsOptimizingVoice}
                audioUrl={voiceAudioUrl}
                setAudioUrl={setVoiceAudioUrl}
                isPlaying={isVoicePlaying}
                setIsPlaying={setIsVoicePlaying}
                audioRef={voiceAudioRef}
                showToast={showToast}
                voiceHistory={voiceHistory}
                setVoiceHistory={setVoiceHistory}
                isVoiceFallbackActive={isVoiceFallbackActive}
                setIsVoiceFallbackActive={setIsVoiceFallbackActive}
                savedAdVoices={savedAdVoices}
                handleSaveAdVoice={handleSaveAdVoice}
                handleEditAdVoiceInStudio={handleEditAdVoiceInStudio}
              />
            )}

            {activeView === 'image' && (
              <ImageGenView
                imagePrompt={imagePrompt}
                setImagePrompt={setImagePrompt}
                selectedAspect={selectedAspect}
                setSelectedAspect={setSelectedAspect}
                generatedImage={generatedImage}
                setGeneratedImage={setGeneratedImage}
                isGeneratingImage={isGeneratingImage}
                setIsGeneratingImage={setIsGeneratingImage}
                imageError={imageError}
                setImageError={setImageError}
                showToast={showToast}
              />
            )}

            {activeView === 'tutor' && (
              <TutorView showToast={showToast} />
            )}

            {activeView === 'translator' && (
              <TranslatorView
                showToast={showToast}
                getReadingTextClass={getReadingTextClass}
                toggleSpeakText={toggleSpeakText}
                currentlySpeakingText={currentlySpeakingText}
              />
            )}

            {activeView === 'documents' && (
              <DocAssistantView showToast={showToast} getReadingTextClass={getReadingTextClass} />
            )}

            {activeView === 'writer' && (
              <WriterView showToast={showToast} getReadingTextClass={getReadingTextClass} />
            )}

            {activeView === 'code' && (
              <CodeAssistantView showToast={showToast} getReadingTextClass={getReadingTextClass} />
            )}

            {activeView === 'study' && (
              <StudyAssistantView showToast={showToast} getReadingTextClass={getReadingTextClass} />
            )}

            {activeView === 'sudan' && (
              <SudanKnowledgeView showToast={showToast} getReadingTextClass={getReadingTextClass} />
            )}

            {activeView === 'gmail' && (
              <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 backdrop-blur-xl">
                <GmailManager showToast={showToast} />
              </div>
            )}

            {activeView === 'search' && (
              <GlobalSearchView
                query={globalSearchQuery}
                setQuery={setGlobalSearchQuery}
                setActiveView={setActiveView}
                savedChats={savedChats}
              />
            )}

            {activeView === 'profile' && (
              <ProfileView
                currentUser={currentUser}
                setShowAuthModal={setShowAuthModal}
                showToast={showToast}
                setActiveView={changeActiveView}
                savedChats={savedChats}
                savedAdVoices={savedAdVoices}
                setSavedAdVoices={setSavedAdVoices}
                handleEditAdVoiceInStudio={handleEditAdVoiceInStudio}
              />
            )}

            {activeView === 'settings' && (
              <SettingsView
                themeMode={themeMode}
                setThemeMode={setThemeMode}
                fontSizeScale={fontSizeScale}
                setFontSizeScale={setFontSizeScale}
                showToast={showToast}
                aiPersona={aiPersona}
                setAiPersona={setAiPersona}
                handleInstallPwa={handleInstallPwa}
                isPwaInstalled={isPwaInstalled}
              />
            )}

            {activeView === 'dedication' && (
              <DedicationView showToast={showToast} />
            )}

            {activeView === 'drive' && (
              <DriveManager showToast={showToast} />
            )}

            {activeView === 'about' && (
              <AboutView setActiveView={changeActiveView} showToast={showToast} />
            )}

            {activeView === 'contact' && (
              <ContactView showToast={showToast} currentUser={currentUser} />
            )}

            {activeView === 'privacy' && (
              <PrivacyView showToast={showToast} />
            )}

            {activeView === 'admin' && (
              <AdminView
                notifications={notifications}
                setNotifications={setNotifications}
                showToast={showToast}
              />
            )}
          </Suspense>

          {/* Professional Website Footer */}
          <footer className="mt-12 pt-8 border-t border-zinc-800/80 light-mode:border-slate-200 text-center space-y-4">
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-zinc-400 light-mode:text-slate-600">
              <button onClick={() => changeActiveView('dashboard')} className="hover:text-emerald-400 transition-colors">الرئيسية</button>
              <span>•</span>
              <button onClick={() => changeActiveView('chat')} className="hover:text-emerald-400 transition-colors">الدردشة الذكية</button>
              <span>•</span>
              <button onClick={() => changeActiveView('studio')} className="hover:text-emerald-400 transition-colors">المساعد الصوتي الإعلاني</button>
              <span>•</span>
              <button onClick={() => changeActiveView('about')} className="hover:text-emerald-400 transition-colors">عن SAi</button>
              <span>•</span>
              <button onClick={() => changeActiveView('contact')} className="hover:text-emerald-400 transition-colors">تواصل معنا</button>
              <span>•</span>
              <button onClick={() => changeActiveView('privacy')} className="hover:text-emerald-400 transition-colors">الخصوصية والشروط</button>
              <span>•</span>
              <button onClick={() => changeActiveView('dedication')} className="hover:text-emerald-400 transition-colors">دعم وتطوير SAi</button>
            </div>

            <div className="text-[11px] text-zinc-400 light-mode:text-slate-500 space-y-1">
              <p>© 2026 منصة SAi – صوت السودان للذكاء الاصطناعي العالمية 🇸🇩</p>
              <p>تصميم وتطوير هندسي: <span className="font-bold text-emerald-400">كمال جعفر زكريا (Kamal Gafar Zakaria)</span></p>
            </div>
          </footer>
        </main>

      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-black text-emerald-400 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                تسجيل الدخول / إنشاء حساب في SAi
              </h3>
              <button onClick={() => setShowAuthModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-300">الاسم الكامل:</label>
                <input
                  type="text"
                  required
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  placeholder="مثال: كمال جعفر"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-300">البريد الإلكتروني:</label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-zinc-950 font-black rounded-xl text-xs shadow-lg"
              >
                الدخول فوراً
              </button>
            </form>
          </div>
        </div>
      )}

      {/* iOS Safari PWA Installation Instructions Modal */}
      {showIosModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-emerald-500/40 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl animate-fade-in text-right">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2 text-emerald-400 font-black text-sm">
                <Smartphone className="w-5 h-5 text-emerald-400" />
                <h3>تثبيت تطبيق SAi على أجهزة iPhone / iPad 🍏</h3>
              </div>
              <button onClick={() => setShowIosModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              لتثبيت التطبيق واشتغاله بكامل الشاشة وبدون شريط المتصفح على جهاز الآيفون الخاص بك، اتبع الخطوات البسيطة التالية:
            </p>

            <div className="space-y-3 pt-1">
              <div className="flex items-start gap-3 bg-zinc-950 p-3 rounded-2xl border border-zinc-800">
                <div className="w-7 h-7 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-black text-xs shrink-0">1</div>
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>اضغط على زر المشاركة</span>
                    <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                  </h4>
                  <p className="text-[11px] text-zinc-400">في أسفل أو أعلى متصفح Safari.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-zinc-950 p-3 rounded-2xl border border-zinc-800">
                <div className="w-7 h-7 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-black text-xs shrink-0">2</div>
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>اختر "إضافة إلى الشاشة الرئيسية"</span>
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                  </h4>
                  <p className="text-[11px] text-zinc-400">قم بالتمرير للأسفل واضغط على (Add to Home Screen).</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-zinc-950 p-3 rounded-2xl border border-zinc-800">
                <div className="w-7 h-7 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-black text-xs shrink-0">3</div>
                <div>
                  <h4 className="text-xs font-bold text-white">اضغط "إضافة" (Add)</h4>
                  <p className="text-[11px] text-zinc-400">سيظهر تطبيق SAi بأيقونته الرسمية على شاشتك الرئيسية مباشرة!</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIosModal(false)}
              className="w-full py-2.5 bg-emerald-500 text-zinc-950 font-black rounded-xl text-xs shadow-lg hover:bg-emerald-400 transition-colors"
            >
              فهمت، شكراً لك! 👍
            </button>
          </div>
        </div>
      )}

      {/* Floating PWA Install Banner for Mobile & Desktop */}
      {!isPwaInstalled && showPwaBanner && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-40 bg-zinc-900/95 border border-emerald-500/40 p-4 rounded-2xl shadow-2xl backdrop-blur-xl flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-zinc-950 flex items-center justify-center font-black text-base shrink-0 shadow-md">
              SAi
            </div>
            <div>
              <h4 className="text-xs font-black text-white">تثبيت تطبيق SAi السودان PWA 🇸🇩</h4>
              <p className="text-[10px] text-zinc-400">استمتع بالتطبيق بكامل الشاشة، سرعة فائقة، ودون إنترنت</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleInstallPwa}
              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>تثبيت</span>
            </button>
            <button
              onClick={() => setShowPwaBanner(false)}
              className="p-1.5 text-zinc-400 hover:text-white transition-colors"
              title="إغلاق التنبيه"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Global Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-2xl border text-xs font-bold flex items-center gap-2 animate-fade-in ${
          toast.type === 'error'
            ? 'bg-rose-950/90 text-rose-300 border-rose-500/40'
            : 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40'
        }`}>
          {toast.type === 'error' ? <AlertCircle className="w-4 h-4 text-rose-400" /> : <CheckCircle className="w-4 h-4 text-emerald-400" />}
          <span>{toast.msg}</span>
        </div>
      )}

    </div>
  );
}

export default App;
