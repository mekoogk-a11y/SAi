import React, { useState } from 'react';
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
  Folder, 
  Star, 
  Clock, 
  Zap, 
  ShieldCheck, 
  Bot, 
  HelpCircle,
  Copy,
  ChevronLeft,
  Paperclip,
  Mic,
  Send,
  ArrowLeft,
  Type
} from 'lucide-react';

interface DashboardProps {
  setActiveView: (view: string) => void;
  currentUser: any;
  showToast: (msg: string, type?: 'success' | 'error') => void;
  savedChats: any[];
  favorites: any[];
  onStartChatWithPrompt?: (prompt: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  setActiveView,
  currentUser,
  showToast,
  savedChats,
  favorites,
  onStartChatWithPrompt
}) => {
  const [mainPrompt, setMainPrompt] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleSendMainPrompt = () => {
    if (!mainPrompt.trim()) return;
    if (onStartChatWithPrompt) {
      onStartChatWithPrompt(mainPrompt);
    } else {
      setActiveView('chat');
    }
  };

  const quickShortcuts = [
    { id: 'writer', title: '✨ كتابة', icon: Sparkles },
    { id: 'search', title: '🔎 بحث ذكي', icon: Search },
    { id: 'documents', title: '📄 تحليل ملف', icon: FileText },
    { id: 'translator', title: '🌐 ترجمة', icon: Globe },
    { id: 'transform', title: '✍️ تحويل النص', icon: Type },
    { id: 'studio', title: '🎙️ صوت إعلاني', icon: Mic2 }
  ];

  const quickAccessCards = [
    {
      id: 'chat',
      title: 'الدردشة الذكية 💬',
      desc: 'محادثات تفاعلية، توليد أفكار، إجابة على الأسئلة بكل لغات العالم بذكاء خارق.',
      icon: MessageSquare,
      color: 'from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30',
      badge: 'الرئيسية'
    },
    {
      id: 'transform',
      title: 'تحويل النص والصياغة ✍️',
      desc: 'تحويل أي نص إلى العامية السودانية، العربية الفصحى، أو الإنجليزية بأساليب متعددة.',
      icon: Type,
      color: 'from-teal-500/20 to-emerald-500/10 text-teal-400 border-teal-500/30',
      badge: 'جديد'
    },
    {
      id: 'vision',
      title: 'الرؤية وقراءة الصور 👁️',
      desc: 'تحليل الصور، استخراج النصوص (OCR)، التعرف على النباتات والآثار والمعالم والخط اليدوي.',
      icon: Eye,
      color: 'from-amber-500/20 to-yellow-500/10 text-amber-400 border-amber-500/30',
      badge: 'ذكي'
    },
    {
      id: 'studio',
      title: 'المساعد الصوتي والإعلانات 🎙️',
      desc: 'توليد أصوات رجالية ونسائية حماسية بالعامية السودانية مع تحسين السيناريو فورياً.',
      icon: Mic2,
      color: 'from-cyan-500/20 to-blue-500/10 text-cyan-400 border-cyan-500/30',
      badge: 'حماسي'
    },
    {
      id: 'image',
      title: 'توليد الصور والفن 🖼️',
      desc: 'إنشاء صور وبنرات إعلانية وتصاميم سينمائية عالية الجودة بفرشاة الذكاء الاصطناعي.',
      icon: ImageIcon,
      color: 'from-purple-500/20 to-pink-500/10 text-purple-400 border-purple-500/30',
      badge: 'إبداعي'
    },
    {
      id: 'tutor',
      title: 'SAi Tutor — المدرّس الذكي 🎓',
      desc: 'مدرّسك الذكي الذي يشرح لك بالطريقة واللغة التي تناسبك (العربية الفصحى، العامية السودانية، English) مع صوت واختبارات.',
      icon: GraduationCap,
      color: 'from-amber-500/20 to-emerald-500/10 text-emerald-400 border-emerald-500/30',
      badge: 'مدرّس ذكي'
    },
    {
      id: 'translator',
      title: 'المترجم الفوري 🌐',
      desc: 'ترجمة فورية بين كل لغات العالم مع دعم خاص وراقي اللهجات السودانية والنطق الصوتي.',
      icon: Globe,
      color: 'from-blue-500/20 to-indigo-500/10 text-blue-400 border-blue-500/30',
      badge: 'شامل'
    },
    {
      id: 'documents',
      title: 'مساعد المستندات و PDF 📄',
      desc: 'رفع وقراءة ملفات PDF, Word, TXT لتلخيصها واستخراج الاستنتاجات وإجابة الأسئلة.',
      icon: FileText,
      color: 'from-emerald-500/20 to-green-500/10 text-emerald-300 border-emerald-500/30',
      badge: 'PDF'
    },
    {
      id: 'writer',
      title: 'كاتب المقالات والمنشورات ✍️',
      desc: 'صياغة المقالات، الرسائل الرسمية، المنشورات التسويقية، والمحتوى الإعلاني الجذاب.',
      icon: Sparkles,
      color: 'from-violet-500/20 to-purple-500/10 text-violet-400 border-violet-500/30',
      badge: 'احترافي'
    },
    {
      id: 'code',
      title: 'مساعد البرمجة والأكواد 💻',
      desc: 'كتابة، شرح، واكتشاف الأخطاء ومعاينتها مباشرة لـ Python, JS, Flutter, C++, Java, Rust.',
      icon: Code,
      color: 'from-sky-500/20 to-cyan-500/10 text-sky-400 border-sky-500/30',
      badge: 'مطور'
    },
    {
      id: 'study',
      title: 'المساعد الأكاديمي والامتحانات 📚',
      desc: 'إنشاء كويزات تفاعلية، بطاقات استذكار Flashcards، حل مسائل الرياضيات وتلخيص الدروس.',
      icon: GraduationCap,
      color: 'from-amber-500/20 to-orange-500/10 text-amber-300 border-amber-500/30',
      badge: 'طلاب'
    },
    {
      id: 'sudan',
      title: 'موسوعة السودان AI 🇸🇩',
      desc: 'معرفة شاملة بتاريخ السودان، الثقافة، اللهجات، الزراعة، الاقتصاد، السياحة، والأكلات الشعبية.',
      icon: Heart,
      color: 'from-emerald-600/30 to-emerald-950/20 text-emerald-400 border-emerald-500/40',
      badge: 'سوداني'
    },
    {
      id: 'dedication',
      title: 'دعم وتطوير SAi 🇸🇩',
      desc: 'مركز دعم وتطوير المنصة والتواصل المباشر مع المهندس المطور كمال جعفر لتسريع تحديث النماذج.',
      icon: Heart,
      color: 'from-emerald-500/20 to-teal-500/10 text-emerald-300 border-emerald-500/30',
      badge: 'دعم التطوير'
    }
  ];

  const quickPromptIdeas = [
    { title: "حُول هذا النص إلى العامية السودانية الطبيعية", view: "transform" },
    { title: "اكتب نص إعلان حماسي لعطر سوداني فاخر", view: "studio" },
    { title: "اشرح لي خوارزميات المكدس والمصفوفات بلغة Python", view: "code" },
    { title: "لخص هذا البحث الأكاديمي واستخرج النقاط المحورية", view: "documents" },
    { title: "احسب لي تكلفة منظومة طاقة شمسية لمنزل في الخرطوم", view: "chat" },
    { title: "أنشئ كويز تفاعلي من 5 أسئلة في الأحياء والوراثة", view: "study" }
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* Central Welcome Header & AI Input Box */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-emerald-950/80 border border-emerald-500/30 p-6 md:p-10 shadow-2xl backdrop-blur-xl text-center space-y-6">
        <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute right-0 top-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-emerald-900/60 to-zinc-950 border border-emerald-500/40 text-emerald-300 text-xs font-black shadow-lg">
            <svg viewBox="0 0 100 100" className="w-6 h-6 text-emerald-400 shrink-0" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="3.5" strokeLinejoin="round">
              <path d="M38 10 L58 10 L68 18 L64 28 L82 42 L78 58 L62 76 L52 82 L42 86 L32 76 L22 74 L12 62 L10 44 L20 32 L26 18 Z" />
              <circle cx="50" cy="45" r="4" className="fill-emerald-400 animate-ping" />
              <circle cx="50" cy="45" r="4" className="fill-emerald-400" />
            </svg>
            <span>منصة الذكاء الاصطناعي السوداني العالمية 🇸🇩</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tight">
            مرحباً بك في SAi
          </h1>

          <p className="text-sm md:text-base text-emerald-400 font-extrabold">
            ماذا تريد أن تنجز اليوم؟
          </p>
        </div>

        {/* Central Input Box */}
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="relative bg-zinc-900/90 border border-emerald-500/40 rounded-2xl p-2 md:p-3 shadow-2xl focus-within:border-emerald-400 transition-all">
            <textarea
              rows={3}
              value={mainPrompt}
              onChange={(e) => setMainPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMainPrompt();
                }
              }}
              placeholder="اكتب سؤالك، فكرتك، أو النص الذي تريد صياغته هنا..."
              className="w-full bg-transparent text-white placeholder-zinc-500 text-xs md:text-sm p-2 focus:outline-none resize-none leading-relaxed"
            />

            <div className="flex items-center justify-between border-t border-zinc-800/80 pt-2 px-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveView('documents')}
                  className="p-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-xs font-bold"
                  title="إرفاق ملف أو مستند"
                >
                  <Paperclip className="w-4 h-4" />
                  <span className="hidden sm:inline">إرفاق ملف</span>
                </button>

                <button
                  onClick={() => {
                    setIsRecording(!isRecording);
                    if (!isRecording) {
                      showToast("جاري تفعيل الإدخال الصوتي...");
                    }
                  }}
                  className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                    isRecording 
                      ? 'bg-red-500/20 border-red-500 text-red-400 animate-pulse' 
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-cyan-400'
                  }`}
                  title="إدخال صوتي"
                >
                  <Mic className="w-4 h-4" />
                  <span className="hidden sm:inline">{isRecording ? 'جاري الاستماع...' : 'صوتي'}</span>
                </button>
              </div>

              <button
                onClick={handleSendMainPrompt}
                disabled={!mainPrompt.trim()}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-40 text-zinc-950 font-black rounded-xl text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer"
                title="إرسال الفكرة أو السؤال"
              >
                <span>إرسال</span>
                <ArrowLeft className="w-4 h-4 text-zinc-950 stroke-[3]" />
              </button>
            </div>
          </div>

          {/* Quick Actions Shortcuts below Central Box */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {quickShortcuts.map((sc) => {
              const Icon = sc.icon;
              return (
                <button
                  key={sc.id}
                  onClick={() => setActiveView(sc.id)}
                  className="px-3.5 py-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-emerald-500/40 text-zinc-300 hover:text-emerald-300 text-xs font-extrabold transition-all flex items-center gap-1.5"
                >
                  <Icon className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{sc.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Access Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-zinc-100 dark:text-zinc-100 light-mode:text-slate-900 flex items-center gap-2">
              <Bot className="w-5 h-5 text-emerald-400" />
              أدوات SAi والخدمات الذكية
            </h2>
            <p className="text-xs text-zinc-400 dark:text-zinc-400 light-mode:text-slate-500">اختر أياً من الأدوات المتاحة للبدء فوراً</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {quickAccessCards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.id}
                onClick={() => setActiveView(card.id)}
                className={`p-5 rounded-2xl bg-gradient-to-br ${card.color} border bg-zinc-900/70 hover:bg-zinc-800/80 transition-all duration-300 text-right group flex flex-col justify-between space-y-3 hover:-translate-y-1 hover:shadow-xl`}
              >
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-emerald-400 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-zinc-950/80 border border-zinc-800 text-zinc-300">
                    {card.badge}
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-sm text-zinc-100 group-hover:text-emerald-400 transition-colors mb-1">
                    {card.title}
                  </h3>
                  <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                    {card.desc}
                  </p>
                </div>

                <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 pt-1 group-hover:translate-x-1 transition-transform">
                  <span>فتح الخدمة</span>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-3">
        <h3 className="text-xs font-black text-emerald-400 tracking-wider uppercase flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-400" />
          مقترحات سريعة للبدء
        </h3>
        <div className="flex flex-wrap gap-2">
          {quickPromptIdeas.map((idea, idx) => (
            <button
              key={idx}
              onClick={() => setActiveView(idea.view)}
              className="px-3 py-2 bg-zinc-950/80 hover:bg-zinc-800 border border-zinc-800 hover:border-emerald-500/40 rounded-xl text-xs text-zinc-300 hover:text-emerald-300 transition-all text-right"
            >
              ✨ {idea.title}
            </button>
          ))}
        </div>
      </div>

      {/* Contribution National Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-teal-950/60 to-zinc-950 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-right">
          <div className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-400">
            <Heart className="w-4 h-4 fill-emerald-500/40 text-emerald-400" />
            <span>مشروع وطني سوداني غير ربحي 🇸🇩</span>
          </div>
          <p className="text-xs text-zinc-300 max-w-xl leading-relaxed">
            التطبيق متاح مجاناً 100% لدعم الطلاب والباحثين والمطورين في السودان. يمكنك المساهمة في دعم وتطوير المنصة وسيرفرات الذكاء الاصطناعي عبر التواصل المباشر مع المطور.
          </p>
        </div>

        <button
          onClick={() => setActiveView('dedication')}
          className="px-4 py-2.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-black rounded-xl text-xs transition-all flex items-center gap-2 shrink-0"
        >
          <Heart className="w-4 h-4 fill-emerald-500/40" />
          <span>مركز دعم SAi</span>
        </button>
      </div>

    </div>
  );
};

export default Dashboard;
