import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Sparkles, 
  Film, 
  CheckCircle2, 
  Smartphone, 
  MessageSquare, 
  ImageIcon, 
  Code2, 
  Languages, 
  Mic, 
  Grid, 
  Sliders, 
  UserCheck, 
  Copy, 
  Share2, 
  Download, 
  ChevronRight, 
  ChevronLeft,
  Wand2,
  Cpu,
  Layers,
  Award
} from 'lucide-react';

interface VideoGenViewProps {
  showToast: (msg: string, type?: 'success' | 'error') => void;
  getReadingTextClass: () => string;
}

interface VideoScene {
  id: number;
  title: string;
  subtitle: string;
  durationSeconds: number;
  startSec: number;
  endSec: number;
  voiceText: string;
  caption: string;
}

export const VideoGenView: React.FC<VideoGenViewProps> = ({ showToast }) => {
  // Video Playback State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [enableVoiceover, setEnableVoiceover] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'video' | 'scenes' | 'script'>('video');

  const videoContainerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  const [videoMode, setVideoMode] = useState<'60s' | '110s'>('60s');

  // 60-Second Video Preset (No Human Faces - Sudanese Dialect)
  const scenes60s: VideoScene[] = [
    {
      id: 1,
      title: "المشهد 1: المقدمة والترحيب بالعامية السودانية",
      subtitle: "خريطة السودان المضيئة + شعار SAi المتوهج + نبضات صوتية ثلاثية الأبعاد (بدون أشخاص)",
      durationSeconds: 10,
      startSec: 0,
      endSec: 10,
      voiceText: "مرحبتين بيك يا زول! مرحب بيك في SAi... منصتك السودانية الشاملة للذكاء الاصطناعي.",
      caption: "مرحبتين بيك يا زول! SAi – منصتك السودانية الشاملة للذكاء الاصطناعي 🇸🇩"
    },
    {
      id: 2,
      title: "المشهد 2: ميزة المحادثة والإجابات الفورية",
      subtitle: "واجهة محادثة ذكية متحركة بخلفية مظلمة وتأثير تفكير الخوارزميات السريعة",
      durationSeconds: 10,
      startSec: 10,
      endSec: 20,
      voiceText: "تقدر تسأل أي سؤال في البال، وتستلم إجابات سريعة ودقيقة في أسرع من البرق.",
      caption: "اسأل أي سؤال... واستلم إجابات سريعة ودقيقة في أسرع من البرق ⚡"
    },
    {
      id: 3,
      title: "المشهد 3: توليد الصوت الإعلاني السوداني الحماسي",
      subtitle: "موجات صوتية ذهبية وخضراء نابضة مع ميكروفون مستقبلي عاكس للتصاميم الصوتية",
      durationSeconds: 10,
      startSec: 20,
      endSec: 30,
      voiceText: "وتعمل نصوص وأصوات إعلانية حماسية بلهجتنا السودانية الفصيحة بكل سهولة!",
      caption: "توليد أصوات ونصوص إعلانية حماسية باللهجة السودانية 🎙️"
    },
    {
      id: 4,
      title: "المشهد 4: توليد الصور والأكواد والترجمة",
      subtitle: "فرشاة ضوئية ترسم بنرات وشعارات + شاشة كود تتبرمج تلقائياً مع ترجمة فورية",
      durationSeconds: 10,
      startSec: 30,
      endSec: 40,
      voiceText: "غير كدا، بتصمم ليك صور وشعارات، بتكتب ليك أكواد برمجية، وبتترجم ليك أي نص بين اللغات.",
      caption: "تصميم صور • كتابة أكواد • ترجمة لغات متعددة 🎨💻"
    },
    {
      id: 5,
      title: "المشهد 5: طريقة تشغيل المنصة في خطوات سريعة",
      subtitle: "شرح خطوات التشغيل 1-2-3-4 بأزرار وأيقونات متحركة بدون ظهور أي وجه بشر",
      durationSeconds: 10,
      startSec: 40,
      endSec: 50,
      voiceText: "طريقة التشغيل ساهلة شديد! افتح المنصة، اختار الخدمة العايزها، اكتب طلبك، واستلم النتيجة فوراً.",
      caption: "1. افتح المنصة ➔ 2. اختار الخدمة ➔ 3. اكتب طلبك ➔ 4. استلم النتيجة فوراً 🚀"
    },
    {
      id: 6,
      title: "المشهد 6: الخاتمة والتوقيع والرابط",
      subtitle: "شعار SAi يتوهج فوق السودان مع رابط البدء وتوقيع المهندس كمال جعفر زكريا",
      durationSeconds: 10,
      startSec: 50,
      endSec: 60,
      voiceText: "جرب SAi هسي واستمتع بقوة الذكاء الاصطناعي! صُمم بواسطة كمال جعفر زكريا.",
      caption: "جرب SAi هسي! | Designed & Engineered by Kamal Gafar Zakaria 🇸🇩"
    }
  ];

  // 110-Second Promo Preset
  const scenes110s: VideoScene[] = [
    {
      id: 1,
      title: "Scene 1 – المشهد الأول: الافتتاحية والشعار",
      subtitle: "خلفية مستقبليّة مظلمة تتحول إلى خريطة السودان المضيئة بألوان العلم وشعار SAi",
      durationSeconds: 11,
      startSec: 0,
      endSec: 11,
      voiceText: "SAi... الذكاء الاصطناعي السوداني.",
      caption: "SAi | Sudan Artificial Intelligence | الذكاء الاصطناعي السوداني"
    },
    {
      id: 2,
      title: "Scene 2 – المشهد الثاني: الترحيب والواجهة",
      subtitle: "عرض فتح تطبيق SAi على هاتف ذكي حديث بواجهة عربية فاخرة",
      durationSeconds: 11,
      startSec: 11,
      endSec: 22,
      voiceText: "أهلاً بيكم في SAi... الذكاء الاصطناعي السوداني، منصتكم الذكية المصممة عشان تساعدكم في العمل، الدراسة، والإبداع.",
      caption: "أهلاً بيكم في SAi... منصتكم الذكية المخصصة للعمل، الدراسة، والإبداع"
    },
    {
      id: 3,
      title: "Scene 3 – المشهد الثالث: المحادثة الذكية",
      subtitle: "عرض استجابة وتفكير المحادثة الذكية الفورية والإجابة عن الاستفسارات",
      durationSeconds: 11,
      startSec: 22,
      endSec: 33,
      voiceText: "اسأل أي سؤال... وخلّي SAi يقدّم ليك إجابات دقيقة وسريعة.",
      caption: "اسأل أي سؤال... وخلّي SAi يقدّم ليك إجابات دقيقة وسريعة"
    },
    {
      id: 4,
      title: "Scene 4 – المشهد الرابع: توليد الصور",
      subtitle: "توليد الشعارات، البنرات الإعلانية، والتصاميم الفنية بفرشاة الـ AI",
      durationSeconds: 11,
      startSec: 33,
      endSec: 44,
      voiceText: "أنشئ صور احترافية، شعارات، وتصاميم إبداعية في ثوانٍ.",
      caption: "أنشئ صور احترافية، شعارات، وتصاميم إبداعية في ثوانٍ"
    },
    {
      id: 5,
      title: "Scene 5 – المشهد الخامس: كتابة الأكواد والبرمجة",
      subtitle: "كتابة وبناء أكواد Python, HTML, Flutter, JS, و SQL بالذكاء الاصطناعي",
      durationSeconds: 11,
      startSec: 44,
      endSec: 55,
      voiceText: "اكتب الأكواد، ابنِ التطبيقات، وطوّر مشاريعك بسهولة.",
      caption: "اكتب الأكواد، ابنِ التطبيقات، وطوّر مشاريعك بسهولة"
    },
    {
      id: 6,
      title: "Scene 6 – المشهد السادس: الترجمة الفورية",
      subtitle: "ترجمة احترافية وسريعة بين العربية والإنجليزية واللغات العالمية",
      durationSeconds: 11,
      startSec: 55,
      endSec: 66,
      voiceText: "ترجم النصوص باحترافية بين عشرات اللغات.",
      caption: "ترجم النصوص باحترافية بين عشرات اللغات"
    },
    {
      id: 7,
      title: "Scene 7 – المشهد السابع: المساعد الصوتي بالعامية",
      subtitle: "محادثة صوتية حية بلهجة سودانية واحترافية وتعرف دقيق على الكلام",
      durationSeconds: 11,
      startSec: 66,
      endSec: 77,
      voiceText: "اتكلم مع SAi باللهجة السودانية وخلي الذكاء الاصطناعي يفهمك.",
      caption: "اتكلم مع SAi باللهجة السودانية وخلي الذكاء الاصطناعي يفهمك"
    },
    {
      id: 8,
      title: "Scene 8 – المشهد الثامن: حزمة الأدوات الذكية",
      subtitle: "عرض الأدوات: تحليل المستندات، الطبيب، التعليم، الأعمال، والبحوث",
      durationSeconds: 11,
      startSec: 77,
      endSec: 88,
      voiceText: "كل الأدوات الذكية في مكان واحد.",
      caption: "تحليل مستندات • مساعد طبي • مساعد دراسي • أعمال • برمجة • كتابة"
    },
    {
      id: 9,
      title: "Scene 9 – المشهد التاسع: طريقة الاستخدام",
      subtitle: "شرح متحرك في 4 خطوات: افتح، اختار الخدمة، اكتب طلبك، واستلم النتيجة",
      durationSeconds: 12,
      startSec: 88,
      endSec: 100,
      voiceText: "طريقة الاستخدام بسيطة... افتح التطبيق، اختار الخدمة، اكتب طلبك، واستلم النتيجة فوراً.",
      caption: "1. افتح التطبيق ➔ 2. اختار الخدمة ➔ 3. اكتب طلبك ➔ 4. استلم النتيجة"
    },
    {
      id: 10,
      title: "Scene 10 – المشهد العاشر: الخاتمة والحقوق",
      subtitle: "شعار SAi ثلاثي الأبعاد مع أضواء مستقبليّة وتوقيع المصمم كمال جعفر زكريا",
      durationSeconds: 10,
      startSec: 100,
      endSec: 110,
      voiceText: "SAi... الذكاء الاصطناعي السوداني. تم التصميم بواسطة كمال جعفر زكريا.",
      caption: "SAi – Sudan Artificial Intelligence | Designed by Kamal Gafar Zakaria"
    }
  ];

  const scenes = videoMode === '60s' ? scenes60s : scenes110s;
  const TOTAL_DURATION = videoMode === '60s' ? 60 : 110;

  // Current Scene Helper
  const currentSceneIndex = scenes.findIndex(s => currentTime >= s.startSec && currentTime < s.endSec);
  const currentScene = scenes[currentSceneIndex >= 0 ? currentSceneIndex : scenes.length - 1];

  // Speech Synthesis & Audio Visualizer
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const lastSpokenSceneRef = useRef<number>(-1);

  const speakSceneNarration = (text: string, sceneId: number) => {
    if (!enableVoiceover || isMuted) return;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // cancel previous
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA'; // Arabic voice
      utterance.pitch = 0.95; // Male/deeper tone
      utterance.rate = 0.9;  // Calm confident speed
      
      // Try to find an Arabic male voice if available
      const voices = window.speechSynthesis.getVoices();
      const arVoice = voices.find(v => v.lang.startsWith('ar') && (v.name.includes('Male') || v.name.includes('Maged') || v.name.includes('Tarik')));
      if (arVoice) {
        utterance.voice = arVoice;
      }

      window.speechSynthesis.speak(utterance);
      speechUtteranceRef.current = utterance;
      lastSpokenSceneRef.current = sceneId;
    }
  };

  // Main Animation Loop
  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = performance.now();
      const updateFrame = (time: number) => {
        const delta = (time - lastTimeRef.current) / 1000;
        lastTimeRef.current = time;

        setCurrentTime(prev => {
          const next = prev + delta * playbackSpeed;
          if (next >= TOTAL_DURATION) {
            setIsPlaying(false);
            return TOTAL_DURATION;
          }
          return next;
        });

        animationFrameRef.current = requestAnimationFrame(updateFrame);
      };
      animationFrameRef.current = requestAnimationFrame(updateFrame);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, playbackSpeed]);

  // Handle Scene voiceover trigger when scene changes
  useEffect(() => {
    if (isPlaying && enableVoiceover && currentScene.id !== lastSpokenSceneRef.current) {
      speakSceneNarration(currentScene.voiceText, currentScene.id);
    }
  }, [currentScene.id, isPlaying, enableVoiceover]);

  // Formatting Time (mm:ss)
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    lastSpokenSceneRef.current = -1; // reset voice scene
    if (isPlaying && enableVoiceover) {
      const targetScene = scenes.find(s => newTime >= s.startSec && newTime < s.endSec);
      if (targetScene) speakSceneNarration(targetScene.voiceText, targetScene.id);
    }
  };

  const jumpToScene = (scene: VideoScene) => {
    setCurrentTime(scene.startSec + 0.1);
    lastSpokenSceneRef.current = -1;
    if (!isPlaying) setIsPlaying(true);
    showToast(`الانتقال إلى: ${scene.title}`);
  };

  const toggleFullscreen = () => {
    if (!videoContainerRef.current) return;
    if (!document.fullscreenElement) {
      videoContainerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto pb-12">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-zinc-950 via-emerald-950/50 to-zinc-950 border border-emerald-500/30 p-6 rounded-3xl space-y-4 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center md:text-right">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black">
            <Film className="w-3.5 h-3.5" />
            <span>استوديو الفيديو الإعلاني الذكي (SAi Promo Video Studio)</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white">الفيديو الإعلاني بالعامية السودانية (60 ثانية بدون أشخاص)</h2>
          <p className="text-xs text-zinc-300 leading-relaxed max-w-2xl">
            فيديو توضيحي بدقيقة واحدة بالعامية السودانية بدون ظهور أي أشخاص، يعرض ميزات المنصة وطريقة تشغيلها بالرسوم المتحركة والواجهات المستقبليّة.
          </p>

          {/* Mode Switcher Buttons */}
          <div className="flex items-center gap-2 pt-2 justify-center md:justify-start">
            <button
              onClick={() => {
                setVideoMode('60s');
                setCurrentTime(0);
                lastSpokenSceneRef.current = -1;
                showToast("تم اختيار فيديو الـ 60 ثانية (بدون أشخاص - شرح الميزات والتشغيل بالعامية)");
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                videoMode === '60s'
                  ? 'bg-emerald-500 text-zinc-950 shadow-lg ring-2 ring-emerald-400/50'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>فيديو 60 ثانية (بالعامية - بدون أشخاص) 🇸🇩</span>
            </button>

            <button
              onClick={() => {
                setVideoMode('110s');
                setCurrentTime(0);
                lastSpokenSceneRef.current = -1;
                showToast("تم اختيار الفيديو الترويجي الشامل (110 ثانية)");
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                videoMode === '110s'
                  ? 'bg-emerald-500 text-zinc-950 shadow-lg ring-2 ring-emerald-400/50'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>فيديو 110 ثواني (العرض الكامل)</span>
            </button>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 p-1 bg-zinc-950 border border-zinc-800 rounded-2xl shrink-0">
          <button
            onClick={() => setActiveTab('video')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
              activeTab === 'video' ? 'bg-emerald-500 text-zinc-950 shadow-md' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>مشغل الفيديو الناطق</span>
          </button>
          <button
            onClick={() => setActiveTab('scenes')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
              activeTab === 'scenes' ? 'bg-emerald-500 text-zinc-950 shadow-md' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>المشاهد ({scenes.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('script')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
              activeTab === 'script' ? 'bg-emerald-500 text-zinc-950 shadow-md' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>السيناريو والصوت</span>
          </button>
        </div>
      </div>

      {activeTab === 'video' && (
        <div className="space-y-4">
          
          {/* MAIN CINEMATIC VIDEO DISPLAY STAGE */}
          <div 
            ref={videoContainerRef}
            className="relative w-full aspect-video bg-zinc-950 rounded-3xl border-2 border-emerald-500/30 overflow-hidden shadow-2xl flex flex-col justify-between p-6 select-none group"
            style={{
              backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.08) 0%, rgba(9, 9, 11, 0.98) 100%)'
            }}
          >

            {/* Ambient Animated Particles / Glowing Waves */}
            <div className="absolute inset-0 pointer-events-none opacity-30 overflow-hidden">
              <div className="absolute -top-20 -left-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
              <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
            </div>

            {/* Top Video Header HUD */}
            <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-3 backdrop-blur-md px-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-black text-emerald-400 tracking-wider">SAi 4K PROMO VIDEO</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800/80 text-zinc-300 border border-white/10">
                  {currentScene.title.split(':')[0]}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-black text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/30">
                  {formatTime(currentTime)} / {formatTime(TOTAL_DURATION)}
                </span>
              </div>
            </div>

            {/* CENTER STAGE: SCENE-SPECIFIC DYNAMIC ANIMATED CONTENT */}
            <div className="relative z-10 flex-1 flex items-center justify-center py-4 my-auto">
              
              {/* SCENE 1: OPENING & SAi EMBLEM LOGO */}
              {currentScene.id === 1 && (
                <div className="text-center space-y-5 animate-fade-in max-w-xl">
                  {/* Glowing Map & Flag Logo */}
                  <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
                    <div className="absolute inset-0 bg-emerald-500/30 rounded-full blur-2xl animate-pulse" />
                    {/* Sudan Flag Arc Tri-color */}
                    <div className="w-32 h-32 rounded-3xl bg-gradient-to-tr from-emerald-600 via-zinc-900 to-red-600 p-1 shadow-2xl animate-bounce">
                      <div className="w-full h-full bg-zinc-950 rounded-[22px] flex flex-col items-center justify-center relative overflow-hidden border border-emerald-400/40">
                        {/* Flag Stripe Accents */}
                        <div className="absolute top-0 left-0 right-0 h-3 bg-red-600" />
                        <div className="absolute top-3 left-0 right-0 h-3 bg-white" />
                        <div className="absolute top-6 left-0 right-0 h-3 bg-zinc-900" />
                        <div className="absolute bottom-0 left-0 right-0 h-4 bg-emerald-600" />

                        <div className="relative z-10 text-center pt-3">
                          <span className="text-3xl font-black text-white tracking-widest block drop-shadow-md">SAi</span>
                          <span className="text-[9px] text-emerald-400 font-extrabold uppercase">Sudan AI</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-200 to-amber-300">
                      SAi – Sudan Artificial Intelligence
                    </h1>
                    <p className="text-base font-extrabold text-emerald-400 tracking-wide">
                      الذكاء الاصطناعي السوداني الشامل
                    </p>
                  </div>
                </div>
              )}

              {/* SCENE 2: WELCOME DASHBOARD ON MOBILE */}
              {currentScene.id === 2 && (
                <div className="flex flex-col md:flex-row items-center justify-center gap-8 animate-fade-in w-full max-w-3xl">
                  {/* Phone Mockup Frame */}
                  <div className="w-56 h-[260px] bg-zinc-900 border-4 border-emerald-500/40 rounded-[32px] p-3 shadow-2xl relative overflow-hidden flex flex-col justify-between shrink-0">
                    <div className="w-16 h-3 bg-zinc-800 rounded-full mx-auto mb-2" />
                    <div className="bg-zinc-950 rounded-2xl p-3 flex-1 border border-zinc-800 space-y-2 text-right">
                      <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5">
                        <span className="text-[10px] font-black text-emerald-400">SAi v3.5</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      </div>
                      <div className="text-[10px] text-zinc-300 font-bold">أهلاً بك يا زول في SAi 🇸🇩</div>
                      <div className="p-2 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-[9px] text-emerald-300 leading-tight">
                        منصتك الذكية الأولى المصممة للعمل، الدراسة والإبداع!
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 pt-1">
                        <div className="p-1.5 bg-zinc-900 rounded-lg text-[8px] text-zinc-300 font-bold text-center">💬 محادثة</div>
                        <div className="p-1.5 bg-zinc-900 rounded-lg text-[8px] text-zinc-300 font-bold text-center">🎨 صور</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 text-center md:text-right max-w-md">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-xs font-bold">
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>واجهة حديثة وسريعة باللغة العربية</span>
                    </div>
                    <h2 className="text-2xl font-black text-white">منصتك الذكية اليومية للعمل والدراسة</h2>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      تصميم عصري متطور، يمنحك تجربة استخدام سلسة ومباشرة من هاتفك أو حاسوبك دون تعقيد.
                    </p>
                  </div>
                </div>
              )}

              {/* SCENE 3: AI CHAT DEMO */}
              {currentScene.id === 3 && (
                <div className="w-full max-w-2xl bg-zinc-900/90 border border-emerald-500/40 rounded-3xl p-5 space-y-3 shadow-2xl animate-fade-in text-right">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-black text-white">المحادثة الذكية السريعة - SAi Chat</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">Gemini 3.5 Pro</span>
                  </div>

                  {/* User bubble */}
                  <div className="flex justify-end">
                    <div className="bg-emerald-500 text-zinc-950 font-bold text-xs p-3 rounded-2xl rounded-tr-none max-w-xs shadow-md">
                      كيف أكتب خطة عمل ناجحة لمشروع تجاري سوداني؟
                    </div>
                  </div>

                  {/* AI bubble */}
                  <div className="flex justify-start">
                    <div className="bg-zinc-950 border border-emerald-500/30 text-zinc-200 text-xs p-3.5 rounded-2xl rounded-tl-none max-w-md space-y-2 shadow-md">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-black text-[11px]">
                        <Sparkles className="w-3 h-3" />
                        <span>SAi Assistant:</span>
                      </div>
                      <p className="leading-relaxed">
                        أبشر! لخطة عمل ناجحة: 1. حدد الفئة المستهدفة والسوق المحلّي. 2. الميزانية والتحليلات المالية. 3. استراتيجية التسويق بالعامية الجذابة.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* SCENE 4: IMAGE GENERATION DEMO */}
              {currentScene.id === 4 && (
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 animate-fade-in w-full max-w-2xl">
                  <div className="bg-zinc-900/90 border border-purple-500/40 rounded-3xl p-4 space-y-3 shadow-2xl flex-1 text-right">
                    <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
                      <ImageIcon className="w-4 h-4 text-purple-400" />
                      <span className="text-xs font-black text-white">توليد الصور والشعارات بالذكاء الاصطناعي</span>
                    </div>
                    <div className="p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-[11px] text-zinc-300 font-mono">
                      الوصف: "بنر إعلاني فاخر لعطر سوداني أصيل مع لمسات ذهبية ومظهر سينمائي 4K"
                    </div>
                    <div className="h-32 bg-gradient-to-tr from-purple-950 via-zinc-900 to-amber-950 rounded-2xl border border-purple-500/30 flex items-center justify-center relative overflow-hidden">
                      <div className="text-center space-y-1">
                        <Sparkles className="w-8 h-8 text-amber-400 mx-auto animate-spin" />
                        <span className="text-xs font-black text-amber-300 block">صورة فنية مولدة 4K</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SCENE 5: CODE GENERATION DEMO */}
              {currentScene.id === 5 && (
                <div className="w-full max-w-2xl bg-zinc-900/90 border border-cyan-500/40 rounded-3xl p-5 space-y-3 shadow-2xl animate-fade-in text-right">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <div className="flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs font-black text-white">مساعد البرمجيات وبناء الأكواد - Code Studio</span>
                    </div>
                    <span className="text-[10px] text-cyan-400 font-mono font-bold">Python | Flutter | JS | SQL</span>
                  </div>
                  <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 font-mono text-[11px] text-emerald-400 space-y-1 dir-ltr text-left">
                    <div><span className="text-purple-400">import</span> ai_sudan <span className="text-purple-400">as</span> sai</div>
                    <div>app = sai.<span className="text-amber-300">CreateApp</span>(name=<span className="text-teal-300">"SudanApp"</span>)</div>
                    <div>app.<span className="text-amber-300">generate_code</span>(type=<span className="text-teal-300">"Flutter"</span>)</div>
                    <div className="text-zinc-500"># Output: App built in seconds! ✓</div>
                  </div>
                </div>
              )}

              {/* SCENE 6: TRANSLATION DEMO */}
              {currentScene.id === 6 && (
                <div className="w-full max-w-2xl bg-zinc-900/90 border border-teal-500/40 rounded-3xl p-5 space-y-3 shadow-2xl animate-fade-in text-right">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <div className="flex items-center gap-2">
                      <Languages className="w-4 h-4 text-teal-400" />
                      <span className="text-xs font-black text-white">الترجمة الفورية متعددة اللغات</span>
                    </div>
                    <span className="text-[10px] text-teal-400 font-bold">عربي ⇄ English ⇄ Français</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800">
                      <span className="text-[10px] font-bold text-zinc-400 block mb-1">المُدخل (عربي):</span>
                      <p className="text-zinc-200">الذكاء الاصطناعي يطور مستقبل الأعمال في السودان.</p>
                    </div>
                    <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-500/40">
                      <span className="text-[10px] font-bold text-emerald-400 block mb-1">الترجمة (English):</span>
                      <p className="text-emerald-200 font-medium">Artificial Intelligence shapes the future of business in Sudan.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* SCENE 7: VOICE ASSISTANT DEMO */}
              {currentScene.id === 7 && (
                <div className="text-center space-y-4 animate-fade-in max-w-md">
                  <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                    <div className="absolute inset-0 bg-emerald-500/30 rounded-full blur-xl animate-ping" />
                    <div className="w-20 h-20 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-full flex items-center justify-center shadow-2xl relative z-10">
                      <Mic className="w-10 h-10 text-zinc-950" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-white">المساعد الصوتي بالعامية السودانية</h3>
                    <p className="text-xs text-emerald-400 font-bold">"اتكلم مع SAi باللهجة السودانية وخلي الذكاء الاصطناعي يفهمك"</p>
                  </div>
                </div>
              )}

              {/* SCENE 8: SMART TOOLS BENTO */}
              {currentScene.id === 8 && (
                <div className="w-full max-w-3xl space-y-3 animate-fade-in">
                  <div className="text-center space-y-1">
                    <h3 className="text-lg font-black text-white">حزمة الأدوات الذكية الشاملة</h3>
                    <p className="text-xs text-emerald-400 font-bold">كل الأدوات التي تحتاجها في منصة واحدة</p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      "📄 تحليل المستندات",
                      "🩺 المساعد الطبي",
                      "🎓 المساعد الدراسي",
                      "💼 حاسبة الأعمال",
                      "💻 تطوير البرمجيات",
                      "✍️ الكتابة الإبداعية",
                      "🔬 البحوث والدراسات",
                      "🇸🇩 موسوعة السودان"
                    ].map((tool, idx) => (
                      <div key={idx} className="p-3 bg-zinc-900/90 border border-emerald-500/30 rounded-2xl text-center text-xs font-black text-zinc-200 shadow-md">
                        {tool}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SCENE 9: HOW TO USE TUTORIAL */}
              {currentScene.id === 9 && (
                <div className="w-full max-w-3xl space-y-4 animate-fade-in text-center">
                  <h3 className="text-lg font-black text-white">طريقة الاستخدام بسيطة في 4 خطوات</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { step: "1", title: "افتح التطبيق", desc: "ادخل على SAi من متصفحك أو هاتفك" },
                      { step: "2", title: "اختار الخدمة", desc: "اختر بين الصوت، الصور، أو المحادثة" },
                      { step: "3", title: "اكتب طلبك", desc: "أدخل الفكرة أو السؤال بسهولة" },
                      { step: "4", title: "استلم النتيجة", desc: "انسخ أو شارك الإجابة والتصميم فوراً" }
                    ].map((st) => (
                      <div key={st.step} className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-1 text-right">
                        <div className="w-6 h-6 rounded-full bg-emerald-500 text-zinc-950 font-black text-xs flex items-center justify-center">
                          {st.step}
                        </div>
                        <div className="text-xs font-black text-white">{st.title}</div>
                        <div className="text-[10px] text-zinc-400">{st.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SCENE 10: CLOSING & CREDITS */}
              {currentScene.id === 10 && (
                <div className="text-center space-y-4 animate-fade-in max-w-lg">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-amber-400 p-1 mx-auto shadow-2xl shadow-emerald-500/30">
                    <div className="w-full h-full bg-zinc-950 rounded-xl flex items-center justify-center font-black text-2xl text-emerald-400">
                      SAi
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <h2 className="text-2xl font-black text-white">SAi – Sudan Artificial Intelligence</h2>
                    <p className="text-xs text-emerald-400 font-bold">الذكاء الاصطناعي السوداني</p>
                    <div className="pt-2 text-[11px] text-amber-300 font-extrabold border-t border-zinc-800/80">
                      Designed & Engineered by: Kamal Gafar Zakaria (كمال جعفر زكريا)
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* SUBTITLE CAPTION OVERLAY */}
            <div className="relative z-10 bg-zinc-950/90 border border-emerald-500/40 rounded-2xl p-3 text-center backdrop-blur-md shadow-xl">
              <span className="text-xs font-black text-amber-300 leading-relaxed block">
                "{currentScene.caption}"
              </span>
            </div>

            {/* BOTTOM PLAYBACK TOOLBAR */}
            <div className="relative z-10 flex flex-col gap-2 pt-2 border-t border-white/10">
              {/* Scrubbing Bar */}
              <input
                type="range"
                min="0"
                max={TOTAL_DURATION}
                step="0.1"
                value={currentTime}
                onChange={handleSeek}
                className="w-full accent-emerald-400 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
              />

              <div className="flex items-center justify-between gap-2 text-xs">
                {/* Play / Pause & Restart */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black rounded-xl shadow-md transition-all flex items-center gap-1.5"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                    <span>{isPlaying ? 'إيقاف' : 'تشغيل الفيديو'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentTime(0);
                      lastSpokenSceneRef.current = -1;
                      setIsPlaying(true);
                    }}
                    className="p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-xl border border-zinc-800 transition-all"
                    title="إعادة التشغيل من البداية"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                {/* Voiceover & Audio Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEnableVoiceover(!enableVoiceover)}
                    className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold transition-all ${
                      enableVoiceover ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'bg-zinc-900 text-zinc-500 border-zinc-800'
                    }`}
                  >
                    {enableVoiceover ? '🎙️ التعليق الصوتي السوداني (مفعل)' : '🎙️ التعليق الصوتي (معطل)'}
                  </button>

                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 bg-zinc-900 text-zinc-300 rounded-xl border border-zinc-800"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                  </button>

                  <button
                    onClick={toggleFullscreen}
                    className="p-2 bg-zinc-900 text-zinc-300 rounded-xl border border-zinc-800"
                    title="ملء الشاشة"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Quick Jump Buttons for All 10 Scenes */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-4 backdrop-blur-xl space-y-2">
            <label className="text-xs font-black text-zinc-300 block">الانتقال السريع لمشاهد الفيديو (10 المشاهد):</label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {scenes.map((sc) => (
                <button
                  key={sc.id}
                  onClick={() => jumpToScene(sc)}
                  className={`p-2.5 rounded-2xl text-[11px] font-extrabold text-right border transition-all ${
                    currentScene.id === sc.id
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-md'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  <span className="block text-[9px] text-zinc-500">مشهد {sc.id} ({sc.durationSeconds} ثواني)</span>
                  <span className="truncate block">{sc.title.split(':')[1] || sc.title}</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* SCENES LIST TAB */}
      {activeTab === 'scenes' && (
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 backdrop-blur-xl space-y-4 shadow-xl">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            <span>جدول المشاهد التفصيلي للفيديو الترويجي (10 المشاهد)</span>
          </h3>

          <div className="space-y-3">
            {scenes.map((sc) => (
              <div key={sc.id} className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-2 text-right">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <span className="text-xs font-black text-emerald-400">{sc.title}</span>
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                    {sc.startSec}ث - {sc.endSec}ث ({sc.durationSeconds} ثواني)
                  </span>
                </div>
                <p className="text-xs text-zinc-300">{sc.subtitle}</p>
                <div className="p-2.5 bg-emerald-950/30 border border-emerald-500/20 rounded-xl text-xs text-emerald-300 font-bold">
                  🗣️ التعليق الصوتي: "{sc.voiceText}"
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SCRIPT TAB */}
      {activeTab === 'script' && (
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 backdrop-blur-xl space-y-4 shadow-xl text-right">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-emerald-400" />
              <span>السيناريو الكامل والنص الترويجي الرسمي</span>
            </h3>
            <button
              onClick={() => {
                const fullText = scenes.map(s => `[${s.title}]\nالتعليق الصوتي: ${s.voiceText}\nالوصف: ${s.subtitle}\n`).join('\n');
                navigator.clipboard.writeText(fullText);
                showToast("تم نسخ النص والسيناريو كاملاً للحافظة!");
              }}
              className="px-4 py-2 bg-emerald-500 text-zinc-950 font-black rounded-xl text-xs shadow-md"
            >
              نسخ السيناريو الكامل 📋
            </button>
          </div>

          <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl text-xs text-zinc-200 leading-relaxed space-y-3 font-mono dir-rtl">
            <div className="text-emerald-400 font-bold">🎬 عنوان المبادرة: SAi – Sudan Artificial Intelligence (الذكاء الاصطناعي السوداني)</div>
            <div className="text-amber-300">👤 المصمم والمهندس الرئيسي: كمال جعفر زكريا (واتساب: 00249919980435)</div>
            <hr className="border-zinc-800" />
            {scenes.map(s => (
              <div key={s.id} className="space-y-1">
                <span className="text-purple-400 font-bold">[{s.title}]</span>
                <p className="text-zinc-300">التعليق الصوتي: "{s.voiceText}"</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
