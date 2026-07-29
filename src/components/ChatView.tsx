import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Mic, 
  MicOff, 
  Paperclip, 
  Trash2, 
  Copy, 
  Share2, 
  RefreshCw, 
  Search, 
  Plus, 
  Pin, 
  Download, 
  Volume2, 
  VolumeX, 
  X, 
  FileText, 
  Check, 
  Sparkles, 
  Bot, 
  User, 
  Code,
  BookOpen,
  Stethoscope,
  HardHat,
  Briefcase,
  Scale,
  ShoppingBag,
  Video,
  FlaskConical,
  GraduationCap,
  Newspaper,
  ChevronDown,
  Image as ImageIcon
} from 'lucide-react';
import Markdown from 'react-markdown';

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
  attachment?: {
    name: string;
    fileType: string;
  };
}

interface ChatViewProps {
  chatMessages: ChatMessage[];
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  chatInput: string;
  setChatInput: (val: string) => void;
  isSendingChat: boolean;
  handleSendChat: (overrideMsg?: string) => void;
  savedChats: any[];
  setSavedChats: React.Dispatch<React.SetStateAction<any[]>>;
  showToast: (msg: string, type?: 'success' | 'error') => void;
  getReadingTextClass: () => string;
  aiPersona: string;
  setAiPersona: (persona: any) => void;
  toggleSpeakText: (text: string) => void;
  currentlySpeakingText: string | null;
  currentUser: any;
}

export const ChatView: React.FC<ChatViewProps> = ({
  chatMessages,
  setChatMessages,
  chatInput,
  setChatInput,
  isSendingChat,
  handleSendChat,
  savedChats,
  setSavedChats,
  showToast,
  getReadingTextClass,
  aiPersona,
  setAiPersona,
  toggleSpeakText,
  currentlySpeakingText,
  currentUser
}) => {
  const [chatSearch, setChatSearch] = useState("");
  const [showPromptLibrary, setShowPromptLibrary] = useState(false);
  const [selectedPromptCategory, setSelectedPromptCategory] = useState("students");
  const [chatAttachment, setChatAttachment] = useState<{ name: string; fileType: string; content: string } | null>(null);
  const [isRecordingMic, setIsRecordingMic] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isSendingChat]);

  // Prompt Library Data Categories
  const promptCategories = [
    {
      id: "students",
      name: "🎓 الطلاب",
      icon: GraduationCap,
      prompts: [
        "اشرح لي خوارزميات ترتيب القوائمSorting algorithms بأسلوب مبسط جداً مع أمثلة بلغة Python",
        "قم بعمل ملخص دراسي شامل لدرس الوراثة والجينات في الأحياء مع النقاط المهمة للامتحان",
        "صمم لي جدول مذاكرة أسبوعي متوازن لتغطي 5 مواد مع أوقات راحة وصلاة"
      ]
    },
    {
      id: "doctors",
      name: "🩺 الأطباء والتوعية",
      icon: Stethoscope,
      prompts: [
        "اكتب نصائح توعوية صحية حول التغذية السليمة والوقاية من ضربات الشمس في الصيف (مع تنبيه طبي)",
        "صغ إرشادات للإسعافات الأولية لحالات الاختناق وارتفاع ضغط الدم بطريقة سهلة ومبسطة",
        "اكتب منشوراً للتوعية بأهمية التبرع بالدم وفوائده الصحية على الجسم"
      ]
    },
    {
      id: "engineers",
      name: "👷 المهندسين",
      icon: HardHat,
      prompts: [
        "احسب لي القدرة المطلوبة لمنظومة طاقة شمسية لتشغيل ثلاجة ومكياف و10 لمبات ومضخة مياه",
        "اكتب الخطوات والمواصفات الموصى بها لصب الخرسانة المسلحة في المناطق الحارة",
        "صغ لي تقريراً هندسياً أولياً لتقييم كفاءة العزل الحراري والمائي في المباني السكنية"
      ]
    },
    {
      id: "programmers",
      name: "💻 المبرمجين",
      icon: Code,
      prompts: [
        "افحص هذا الكود المكتوب بـ React وNode.js وحسن لي الأداء مع تصحيح الثغرات المحتملة",
        "اكتب لي دالة async/await لطلب البيانات من API مع آلية إعادة المحاولة Retry والـ Timeout",
        "صمم لي مخطط قاعدة بيانات PostgreSQL متكامل لتطبيق تجارة إلكترونية مع الجداول والمفاتيح"
      ]
    },
    {
      id: "lawyers",
      name: "⚖️ المحامين والاستشارات",
      icon: Scale,
      prompts: [
        "صغ لي مسودة عقد تقديم خدمات برمجة وتصميم بين شركة وفريدلانسر مع ضمان حقوق الطرفين",
        "اكتب خطاب اتفاقية عدم إفشاء معلومات سرية (NDA) نموذجية ومحترفة",
        "صيغ لي نموذج مذكرة تفاهم لتأسيس شراكة تجارية بسيطة بين طرفين"
      ]
    },
    {
      id: "merchants",
      name: "🛒 التجار والأعمال",
      icon: ShoppingBag,
      prompts: [
        "اكتب نصاً إعلانياً حماسياً بالعامية السودانية لعروض وتخفيضات بضاعة جديدة مع الدفع عبر بنكك",
        "اقترح علي استراتيجية تسويق رقمي لافتتاح متجر ملابس وأجهزة إلكترونية في السودان",
        "صمم لي دراسة جدوى تسويقية مبسطة لتطبيق توصيل طلبات ومستلزمات منزلية"
      ]
    },
    {
      id: "creators",
      name: "🎬 صناع المحتوى",
      icon: Video,
      prompts: [
        "اكتب لي سيناريو فيديو قصير (Reels/TikTok) مدته 30 ثانية حماسي ومضحك بالعامية السودانية",
        "اعطني 10 عناوين جذابة ومثيرة للاهتمام لفيديوهات يوتيوب عن الذكاء الاصطناعي والتكنولوجيا",
        "اكتب خطة محتوى لمشروع تجاري لمدة شهر مع أفكار المنشورات والفيديوهات"
      ]
    },
    {
      id: "researchers",
      name: "🔬 الباحثين الأكاديميين",
      icon: FlaskConical,
      prompts: [
        "قم بصياغة ملخص بحثي (Abstract) احترافي حول أثر التقنيات الحديثة في تطوير الإنتاج الزراعي",
        "ساعدني في كتابة هيكل ومقدمة ورقة علمية لمراجعة الدراسات السابقة (Literature Review)",
        "اقترح علي صياغات أكاديمية دقيقة لفرضيات الدراسة والنتائج المتوقعة"
      ]
    },
    {
      id: "teachers",
      name: "📚 المعلمين والمربين",
      icon: BookOpen,
      prompts: [
        "حضّر لي خطة درس تفاعلي مدته 45 دقيقة لشرح الفيزياء للطلاب بطريقة ممتعة",
        "اكتب 10 أسئلة اختيار من متعدد متدرجة الصعوبة في مادة التاريخ مع إجاباتها النموذجية",
        "اقترح علي أنشطة وألعاب تعليمية لتعزيز الفهم والتفاعل داخل الفصل الدراسي"
      ]
    },
    {
      id: "journalists",
      name: "📰 الصحفيين والإعلاميين",
      icon: Newspaper,
      prompts: [
        "اكتب بياناً صحفياً رسمياً وموجزاً لإعلان إطلاق منصة ذكاء اصطناعي سودانية عالمية",
        "صغ مقالاً صحفياً تحليلياً عن مستجدات سوق التكنولوجيا والابتكار في المنطقة",
        "اقترح لي أسئلة حوارية وعميقة لمقابلة صحفية مع رائد أعمال في المجال التقني"
      ]
    }
  ];

  // Speech Recognition
  const toggleMicRecording = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      showToast("التفريغ الصوتي المباشر غير مدعوم في متصفحك الحالي.", "error");
      return;
    }

    if (isRecordingMic) {
      setIsRecordingMic(false);
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'ar-SA';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsRecordingMic(true);
        showToast("جاري الاستماع لصوتك باللغة العربية...");
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setChatInput(chatInput ? chatInput + " " + transcript : transcript);
          showToast("تم تحويل الصوت إلى نص بنجاح!");
        }
        setIsRecordingMic(false);
      };

      recognition.onerror = () => {
        setIsRecordingMic(false);
        showToast("حدث خطأ أثناء التقاط الصوت.", "error");
      };

      recognition.onend = () => {
        setIsRecordingMic(false);
      };

      recognition.start();
    } catch (err) {
      setIsRecordingMic(false);
      showToast("تعذر تشغيل الميكروفون.", "error");
    }
  };

  // Handle File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showToast("حجم الملف كبير جداً. الحد الأقصى هو 10 ميجابايت.", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const textContent = event.target?.result as string || "";
      setChatAttachment({
        name: file.name,
        fileType: file.type || file.name.split('.').pop() || 'file',
        content: textContent
      });
      showToast(`تم إرفاق الملف: ${file.name}`);
    };
    reader.readAsText(file);
  };

  // Export Chat History
  const exportChatHistory = (format: 'txt' | 'json' | 'md' | 'word') => {
    if (chatMessages.length === 0) return;

    let content = "";
    if (format === 'json') {
      content = JSON.stringify(chatMessages, null, 2);
    } else if (format === 'md') {
      content = `# صوت السودان (Sawt Sudan AI) - سجل المحادثة\n\n` + 
        chatMessages.map(m => `### ${m.role === 'user' ? '👤 المستخدم' : '🤖 الذكاء الاصطناعي'}\n\n${m.text}\n`).join('\n---\n\n');
    } else if (format === 'word') {
      content = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Sawt Sudan AI Chat</title></head><body style="font-family: Arial, sans-serif; direction: rtl; text-align: right;">` +
        `<h1>صوت السودان (Sawt Sudan AI) - سجل المحادثة</h1><hr>` +
        chatMessages.map(m => `<div style="margin-bottom: 20px; p: 10px; background: #f4f4f4; border-radius: 8px;"><h3>${m.role === 'user' ? 'المستخدم' : 'الذكاء الاصطناعي'}</h3><p>${m.text.replace(/\n/g, '<br>')}</p></div>`).join('') +
        `</body></html>`;
    } else {
      content = chatMessages.map(m => `[${m.role === 'user' ? 'المستخدم' : 'الذكاء الاصطناعي'}]:\n${m.text}\n`).join('\n-------------------\n\n');
    }

    const fileType = format === 'word' ? 'application/msword' : 'text/plain;charset=utf-8';
    const ext = format === 'word' ? 'doc' : format;
    const blob = new Blob([content], { type: fileType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sawt-sudan-chat-${Date.now()}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`تم تصدير المحادثة بصيغة ${format.toUpperCase()}`);
  };

  // Filter messages by search if search term entered
  const filteredMessages = chatSearch.trim()
    ? chatMessages.filter(m => m.text.toLowerCase().includes(chatSearch.toLowerCase()))
    : chatMessages;

  return (
    <div className="space-y-4 animate-fade-in max-w-5xl mx-auto">
      
      {/* Top Header & Persona Selector */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-xl">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-zinc-950 font-black shadow-lg shadow-emerald-500/20">
            <Bot className="w-5 h-5 text-zinc-950" />
          </div>
          <div>
            <h2 className="text-base font-black text-zinc-100 flex items-center gap-2">
              صوت السودان - شاشة المحادثة الرئيسية
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                Gemini 3.5
              </span>
            </h2>
            <p className="text-[11px] text-zinc-400">إجابة الاستفسارات، كتابة الأكواد، تحليل الملفات، والنطق الصوتي.</p>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          
          {/* Persona Picker */}
          <select
            value={aiPersona}
            onChange={(e) => setAiPersona(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 text-zinc-200 rounded-xl text-xs px-3 py-1.5 focus:outline-none focus:border-emerald-500"
          >
            <option value="creative">🎨 إبداعي سوداني (حماسي)</option>
            <option value="formal">👔 رسمي واحترافي</option>
            <option value="educational">📚 تعليمي وأكاديمي</option>
            <option value="expert">💻 خبير برمجيات وبحثي</option>
            <option value="concise">⚡ سريع ومختصر</option>
          </select>

          {/* Prompt Library Toggle */}
          <button
            onClick={() => setShowPromptLibrary(!showPromptLibrary)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
              showPromptLibrary 
                ? 'bg-emerald-500 text-zinc-950 border-emerald-400' 
                : 'bg-zinc-950 hover:bg-zinc-800 text-emerald-400 border-emerald-500/30'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>مكتبة البرومبتات</span>
          </button>

          {/* Export Dropdown */}
          <div className="relative group">
            <button className="p-2 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1">
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">تصدير</span>
              <ChevronDown className="w-3 h-3 text-zinc-400" />
            </button>

            <div className="absolute left-0 mt-1 w-36 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-1 hidden group-hover:block z-50 space-y-1">
              <button onClick={() => exportChatHistory('md')} className="w-full text-right px-3 py-1.5 text-[11px] text-zinc-200 hover:bg-zinc-800 rounded-lg">Markdown (.md)</button>
              <button onClick={() => exportChatHistory('word')} className="w-full text-right px-3 py-1.5 text-[11px] text-zinc-200 hover:bg-zinc-800 rounded-lg">Word (.doc)</button>
              <button onClick={() => exportChatHistory('txt')} className="w-full text-right px-3 py-1.5 text-[11px] text-zinc-200 hover:bg-zinc-800 rounded-lg">نص عادي (.txt)</button>
              <button onClick={() => exportChatHistory('json')} className="w-full text-right px-3 py-1.5 text-[11px] text-zinc-200 hover:bg-zinc-800 rounded-lg">JSON Data</button>
            </div>
          </div>

          {/* New Chat Button */}
          <button
            onClick={() => {
              if (window.confirm("هل انت متأكد من بدء محادثة جديدة؟")) {
                setChatMessages([{
                  role: 'assistant',
                  text: 'حبابك عشرة يا زول! مرحباً بك مجدداً في محادثة جديدة مع صوت السودان. كيف يمكنني مساعدتك الآن؟ 🇸🇩✨'
                }]);
                showToast("تم بدء محادثة جديدة");
              }
            }}
            className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>جديدة</span>
          </button>

        </div>
      </div>

      {/* Prompt Library Drawer */}
      {showPromptLibrary && (
        <div className="bg-zinc-900/90 border border-emerald-500/30 rounded-3xl p-5 space-y-4 backdrop-blur-xl animate-fade-in shadow-2xl">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="text-xs font-black text-emerald-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              مكتبة الأوامر والبرومبتات التخصصية الجاهزة
            </h3>
            <button onClick={() => setShowPromptLibrary(false)} className="text-zinc-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5 border-b border-zinc-800/80 pb-3">
            {promptCategories.map((cat) => {
              const Icon = cat.icon;
              const isCatActive = selectedPromptCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedPromptCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isCatActive
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                      : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

          {/* Category Prompts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {promptCategories.find(c => c.id === selectedPromptCategory)?.prompts.map((pText, pIdx) => (
              <button
                key={pIdx}
                onClick={() => {
                  setChatInput(pText);
                  setShowPromptLibrary(false);
                  showToast("تم اختيار النمط الجاهز، اضغط إرسال للبدء!");
                }}
                className="p-3 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 hover:border-emerald-500/40 rounded-2xl text-xs text-zinc-200 text-right leading-relaxed transition-all flex flex-col justify-between group space-y-2"
              >
                <span>✨ {pText}</span>
                <span className="text-[10px] text-emerald-400 font-bold group-hover:underline">استخدام هذا الأمر ←</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages Search Bar */}
      {chatMessages.length > 2 && (
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={chatSearch}
            onChange={(e) => setChatSearch(e.target.value)}
            placeholder="البحث داخل هذه المحادثة..."
            className="w-full pr-9 pl-4 py-2 bg-zinc-900/60 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>
      )}

      {/* Messages Stream Body */}
      <div className="bg-zinc-950/90 border border-zinc-800/80 rounded-3xl p-4 md:p-6 min-h-[500px] max-h-[620px] overflow-y-auto space-y-6 shadow-inner backdrop-blur-xl">
        {filteredMessages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-fade-in`}
          >
            {/* Avatar */}
            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-black text-xs shrink-0 shadow-md ${
              msg.role === 'user'
                ? 'bg-gradient-to-tr from-amber-500 to-orange-400 text-zinc-950'
                : 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-zinc-950'
            }`}>
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Message Bubble */}
            <div className={`max-w-[85%] rounded-3xl p-4 md:p-5 space-y-2 border ${
              msg.role === 'user'
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-100 rounded-tr-none'
                : 'bg-zinc-900/90 border-zinc-800 text-zinc-100 rounded-tl-none'
            }`}>
              {msg.attachment && (
                <div className="flex items-center gap-2 p-2 bg-zinc-950/80 rounded-xl border border-zinc-800 text-xs text-amber-300 font-mono">
                  <Paperclip className="w-3.5 h-3.5" />
                  <span>مرفق: {msg.attachment.name}</span>
                </div>
              )}

              {/* Message Markdown Text */}
              <div className={`markdown-body ${getReadingTextClass()} leading-relaxed text-right`}>
                <Markdown>{msg.text}</Markdown>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800/50 text-[10px] text-zinc-500">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(msg.text);
                    showToast("تم نسخ النص بنجاح!");
                  }}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>نسخ</span>
                </button>

                <button
                  onClick={() => toggleSpeakText(msg.text)}
                  className={`hover:text-emerald-400 transition-colors flex items-center gap-1 ${
                    currentlySpeakingText === msg.text ? 'text-amber-400 font-bold' : ''
                  }`}
                >
                  {currentlySpeakingText === msg.text ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                  <span>{currentlySpeakingText === msg.text ? 'إيقاف' : 'استماع'}</span>
                </button>

                {msg.role === 'assistant' && (
                  <button
                    onClick={() => handleSendChat("إعادة صياغة واستكمال الرد الأخير بشكل أكثر تفصيلاً وسلاسة")}
                    className="hover:text-emerald-400 transition-colors flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>إعادة توليد</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {isSendingChat && (
          <div className="flex items-center gap-3 animate-pulse">
            <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 bg-zinc-900/80 border border-emerald-500/30 rounded-2xl text-xs text-emerald-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>صوت السودان يفكر ويصيغ الإجابة بأعلى جودة...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Attachment Preview Pill */}
      {chatAttachment && (
        <div className="flex items-center justify-between p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300">
          <div className="flex items-center gap-2">
            <Paperclip className="w-4 h-4" />
            <span className="font-bold">مرفق جاهز للإرسال: {chatAttachment.name}</span>
          </div>
          <button onClick={() => setChatAttachment(null)} className="text-zinc-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Input Box Area */}
      <div className="relative bg-zinc-900/90 border border-zinc-800 rounded-3xl p-3 shadow-2xl backdrop-blur-xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendChat();
          }}
          className="flex items-center gap-2"
        >
          {/* File Upload Trigger */}
          <label className="p-3 bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-amber-400 rounded-2xl cursor-pointer border border-zinc-800 transition-all shrink-0" title="رفع ملف مستند أو صورة">
            <Paperclip className="w-4.5 h-4.5" />
            <input type="file" onChange={handleFileUpload} className="hidden" accept=".txt,.pdf,.docx,.json,.js,.py,.ts,.jpg,.png" />
          </label>

          {/* Mic Trigger */}
          <button
            type="button"
            onClick={toggleMicRecording}
            className={`p-3 rounded-2xl border transition-all shrink-0 ${
              isRecordingMic
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/50 animate-pulse'
                : 'bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-emerald-400 border-zinc-800'
            }`}
            title="تحدث بصوتك لتحويله إلى نص"
          >
            {isRecordingMic ? <MicOff className="w-4.5 h-4.5" /> : <Mic className="w-4.5 h-4.5" />}
          </button>

          {/* Large Text Input */}
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="أكتب سؤالك أو طلبك هنا باللغة العربية أو الإنجليزية..."
            className="flex-grow bg-transparent text-sm text-zinc-100 placeholder-zinc-500 px-3 focus:outline-none"
            disabled={isSendingChat}
          />

          {/* Large Send Button */}
          <button
            type="submit"
            disabled={isSendingChat || (!chatInput.trim() && !chatAttachment)}
            className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-40 text-zinc-950 font-black rounded-2xl shadow-lg transition-all shrink-0 flex items-center gap-2"
          >
            <span>إرسال</span>
            <Send className="w-4 h-4 rotate-180" />
          </button>
        </form>
      </div>

    </div>
  );
};
