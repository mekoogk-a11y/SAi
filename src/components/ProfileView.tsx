import React, { useState } from 'react';
import { User, Shield, Star, MessageSquare, Heart, Clock, LogOut, Lock, CheckCircle, Award, Zap, Download, Upload, ShieldCheck, Sparkles, Volume2, Edit, Trash2, Copy, Filter, Search, Play, Pause, Mic, Radio, Tag } from 'lucide-react';
import { SpeechQualityEngine, SUDANESE_VOICE_PERSONAS } from '../lib/voicePersonas';

interface ProfileViewProps {
  currentUser: any;
  setShowAuthModal: (s: boolean) => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
  setActiveView: (view: string) => void;
  savedChats: any[];
  savedAdVoices?: any[];
  setSavedAdVoices?: React.Dispatch<React.SetStateAction<any[]>>;
  handleEditAdVoiceInStudio?: (item: any) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  setShowAuthModal,
  showToast,
  setActiveView,
  savedChats,
  savedAdVoices = [],
  setSavedAdVoices,
  handleEditAdVoiceInStudio
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'pro' | 'business'>('free');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('الكل');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState<string | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editCategoryVal, setEditCategoryVal] = useState<string>('');

  const CATEGORIES = ['الكل', 'عروض وتخفيضات', 'إعلانات حماسية', 'مطاعم وأغذية', 'عقارات فاخرة', 'خدمات وتطبيقات', 'عامة'];

  const plans = [
    {
      id: 'free',
      name: 'العضوية المجانية 🇸🇩',
      price: 'مجاناً 100%',
      desc: 'دخول كامل لجميع الأدوات الأساسية، الدردشة، الرؤية، والاستماع الصوتي.',
      features: ['محادثات غير محدودة', 'توليد أصوات إعلانية سودانية', 'قراءة الصور والمستندات', 'دعم الميكروفون المباشر']
    },
    {
      id: 'pro',
      name: 'SAi Pro الاحترافية ⚡',
      price: '2,500 د.س / شهرياً',
      desc: 'للباحثين والمطورين الراغبين بأسرع سرعة استجابة وأعلى أولوية معالجة.',
      features: ['أسرع وقت معالجة من خوادم Cloud Run', 'توليد صور بدقة عالية جداً', 'توليد سيناريوهات فيديو طويلة', 'دعم فني مباشر على مدار الساعة']
    },
    {
      id: 'business',
      name: 'SAi Business للأعمال 👔',
      price: '10,000 د.س / شهرياً',
      desc: 'للشركات والمؤسسات التجارية لربط الـ API وإدارة الفرق والمحتوى التسويقي.',
      features: ['وصول مباشر لـ API الخوادم', 'ربط البريد الإلكتروني والمستندات الضخمة', 'إدارة المستخدمين المتعددين', 'تقارير أداء واستخدام مخصصة']
    }
  ];

  const handleExportDataBackup = () => {
    const data = {
      user: currentUser,
      savedChats,
      savedAdVoices,
      exportedAt: new Date().toISOString(),
      platform: "Sawt Sudan AI (SAi 3.5)"
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sawt-sudan-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("تم تصدير نسخة احتياطية كاملة من بياناتك بما فيها الأصوات المفضلة بنجاح!");
  };

  const handleDeleteSavedVoice = (id: string) => {
    if (setSavedAdVoices) {
      setSavedAdVoices(prev => prev.filter(v => v.id !== id));
      showToast("تم إزالة الصوت الإعلاني من المفضلة بنجاح.");
    }
  };

  const handleUpdateCategory = (id: string, newCat: string) => {
    if (setSavedAdVoices) {
      setSavedAdVoices(prev => prev.map(v => v.id === id ? { ...v, category: newCat } : v));
      setEditingItemId(null);
      showToast("تم تحديث التصنيف الإعلاني بنجاح! 🏷️");
    }
  };

  const handleToggleSpeakScript = async (id: string, scriptText: string, voiceId?: string) => {
    if (currentlySpeakingId === id) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setCurrentlySpeakingId(null);
      return;
    }

    setCurrentlySpeakingId(id);
    const persona = SUDANESE_VOICE_PERSONAS.find(p => p.id === voiceId) || SUDANESE_VOICE_PERSONAS[0];
    const optimized = SpeechQualityEngine.optimizeSpeechText(scriptText, persona.id);

    try {
      const res = await fetch('/api/generate-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: optimized,
          voiceName: persona.geminiVoiceAlias,
          tone: persona.tone
        })
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audio.onended = () => setCurrentlySpeakingId(null);
        audio.onerror = () => fallbackSpeak(optimized, persona, id);
        await audio.play();
        showToast("جاري التشغيل بالصوت الإعلاني السوداني عالي الجودة... 🔊");
        return;
      }
    } catch (e) {
      // ignore
    }

    fallbackSpeak(optimized, persona, id);
  };

  const fallbackSpeak = (optimizedText: string, persona: any, id: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(optimizedText);
      const voices = window.speechSynthesis.getVoices();
      const arVoice = voices.find(v => v.lang.startsWith('ar')) || voices.find(v => v.lang.includes('AR'));
      if (arVoice) utterance.voice = arVoice;

      utterance.lang = 'ar-SA';
      utterance.rate = persona?.speed || 1.0;
      utterance.pitch = persona?.speechPitchValue || 1.0;
      utterance.onend = () => setCurrentlySpeakingId(null);
      utterance.onerror = () => setCurrentlySpeakingId(null);
      window.speechSynthesis.speak(utterance);
      showToast("جاري التشغيل بالمحرك الصوتي السوداني... 🔊");
    } else {
      setCurrentlySpeakingId(null);
      showToast("متصفحك لا يدعم قراءة النصوص الصوتية المباشرة.", "error");
    }
  };

  const handleCopyText = (textStr: string) => {
    navigator.clipboard.writeText(textStr);
    showToast("تم نسخ نص النص الإعلاني للحافظة 📋");
  };

  const filteredVoices = savedAdVoices.filter(v => {
    const matchesCategory = activeCategoryFilter === 'الكل' || v.category === activeCategoryFilter;
    const matchesSearch = searchQuery === '' ||
      (v.title && v.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (v.text && v.text.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (v.voiceName && v.voiceName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto pb-12 text-right">
      
      {/* Profile Card Header */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 md:p-8 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center gap-4 text-center md:text-right">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-black text-2xl text-zinc-950 shadow-xl shadow-emerald-500/20">
            {currentUser ? currentUser.name[0] : 'ز'}
          </div>
          <div>
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <h2 className="text-xl font-black text-white">
                {currentUser ? currentUser.name : 'زائر منصة صوت السودان'}
              </h2>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                عضوية مجانية 🇸🇩
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              {currentUser ? currentUser.email : 'قم بتسجيل الدخول لحفظ محادثاتك وتفضيلاتك عبر كل أجهزتك'}
            </p>
          </div>
        </div>

        <div>
          {currentUser ? (
            <button
              onClick={() => {
                showToast("تم تسجيل الخروج بنجاح!");
              }}
              className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>تسجيل الخروج</span>
            </button>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-zinc-950 font-black rounded-xl text-xs shadow-lg transition-all flex items-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>تسجيل الدخول / إنشاء حساب</span>
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>الأصوات الإعلانية المفضلة</span>
            <Volume2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-400">{savedAdVoices.length}</p>
        </div>

        <div className="p-5 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>المحادثات المحفوظة</span>
            <MessageSquare className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-white">{savedChats.length}</p>
        </div>

        <div className="p-5 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>حالة المحرك الصوتي (SLVI)</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-white">SAi 3.5 Pro</p>
        </div>
      </div>

      {/* FAVORITE AD VOICES SECTION (المفضلة) */}
      <div className="bg-zinc-900/80 border border-emerald-500/40 rounded-3xl p-6 backdrop-blur-xl space-y-5 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
          <div className="space-y-1">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              <span>الأصوات الإعلانية المفضلة والمحفوظة 🎙️</span>
            </h3>
            <p className="text-xs text-zinc-400">
              جميع السيناريوهات والتسجيلات الإعلانية السودانية التي قمت بتوليدها وحفظها مع خيارات التعديل وإعادة التشغيل.
            </p>
          </div>

          <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black rounded-full shrink-0">
            عدد ({filteredVoices.length}) صوت محفوظ
          </span>
        </div>

        {/* Category Filters & Search */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Search input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-zinc-400 absolute right-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث في الأصوات المفضلة..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pr-9 pl-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/60"
              />
            </div>

            {/* Category pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 max-w-full">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    activeCategoryFilter === cat
                      ? 'bg-emerald-500 text-zinc-950 font-black shadow-md'
                      : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800/80'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Saved Voices List Grid */}
        {filteredVoices.length === 0 ? (
          <div className="p-8 text-center bg-zinc-950/60 border border-dashed border-zinc-800 rounded-2xl space-y-3">
            <Volume2 className="w-8 h-8 text-zinc-600 mx-auto animate-pulse" />
            <p className="text-xs text-zinc-400 font-bold">لا توجد أصوات إعلانية محفوظة في هذا التصنيف حالياً.</p>
            <p className="text-[11px] text-zinc-500">يمكنك الذهاب إلى استوديو الأصوات وتوليد ناطق إعلاني ثم النقر على "حفظ في المفضلة".</p>
            <button
              onClick={() => setActiveView('studio')}
              className="px-4 py-2 bg-emerald-500 text-zinc-950 font-black rounded-xl text-xs shadow-md inline-flex items-center gap-1.5"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>الانتقال لاستوديو الأصوات الآن</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredVoices.map((voiceItem) => (
              <div
                key={voiceItem.id}
                className="bg-zinc-950 border border-zinc-800 hover:border-emerald-500/40 rounded-2xl p-4 space-y-3 transition-all text-right flex flex-col justify-between group"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-black text-white line-clamp-1 group-hover:text-emerald-400 transition-colors">
                      {voiceItem.title || 'صوت إعلاني سوداني'}
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-extrabold rounded-md shrink-0">
                      {voiceItem.category || 'عامة'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-zinc-400">
                    <span className="text-teal-400 font-bold">{voiceItem.voiceName || 'صوت إعلاني'}</span>
                    <span>•</span>
                    <span className="text-amber-400/90">{voiceItem.tone || 'حماسي'}</span>
                    <span>•</span>
                    <span className="text-zinc-500">{new Date(voiceItem.created_at).toLocaleDateString('ar-SD')}</span>
                  </div>

                  {/* Script text box */}
                  <div className="p-3 bg-zinc-900/90 rounded-xl border border-zinc-800/80 relative">
                    <p className="text-xs text-zinc-200 leading-relaxed font-arabic">
                      "{voiceItem.text}"
                    </p>
                    <button
                      onClick={() => handleCopyText(voiceItem.text)}
                      title="نسخ النص الإعلاني"
                      className="absolute left-2 top-2 p-1 text-zinc-400 hover:text-emerald-400 bg-zinc-950/80 rounded-md border border-zinc-800"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>

                  {/* HTML Audio Player if available */}
                  {voiceItem.audioUrl && (
                    <audio src={voiceItem.audioUrl} controls className="w-full h-8 accent-emerald-500 mt-2" />
                  )}
                </div>

                {/* Actions Row */}
                <div className="pt-3 border-t border-zinc-900 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {/* Replay voice button */}
                    <button
                      onClick={() => handleToggleSpeakScript(voiceItem.id, voiceItem.text, voiceItem.voiceId)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 ${
                        currentlySpeakingId === voiceItem.id
                          ? 'bg-amber-500 text-zinc-950 animate-pulse font-black'
                          : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
                      }`}
                    >
                      {currentlySpeakingId === voiceItem.id ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span>إعادة التشغيل 🔊</span>
                    </button>

                    {/* Edit in Studio */}
                    {handleEditAdVoiceInStudio && (
                      <button
                        onClick={() => handleEditAdVoiceInStudio(voiceItem)}
                        className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1"
                      >
                        <Edit className="w-3 h-3 text-cyan-400" />
                        <span>تعديل بالاستوديو ✏️</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Inline edit category */}
                    {editingItemId === voiceItem.id ? (
                      <select
                        value={editCategoryVal || voiceItem.category}
                        onChange={(e) => handleUpdateCategory(voiceItem.id, e.target.value)}
                        className="bg-zinc-900 text-emerald-300 border border-emerald-500/40 rounded-lg text-[10px] p-1 focus:outline-none"
                      >
                        {CATEGORIES.filter(c => c !== 'الكل').map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingItemId(voiceItem.id);
                          setEditCategoryVal(voiceItem.category);
                        }}
                        title="تغيير التصنيف"
                        className="p-1.5 text-zinc-400 hover:text-amber-400 bg-zinc-900 hover:bg-zinc-800 rounded-lg border border-zinc-800"
                      >
                        <Tag className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Delete button */}
                    <button
                      onClick={() => handleDeleteSavedVoice(voiceItem.id)}
                      title="حذف من المفضلة"
                      className="p-1.5 text-zinc-500 hover:text-rose-400 bg-zinc-900 hover:bg-zinc-800 rounded-lg border border-zinc-800 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Developer & Designer Bio Card */}
      <div className="bg-zinc-900/80 border border-emerald-500/30 rounded-3xl p-6 backdrop-blur-xl space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3 text-center sm:text-right">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-black text-zinc-950 text-base shrink-0">
              ك ج
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <h3 className="text-base font-black text-white">المهندس والمصمم: كمال جعفر زكريا</h3>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                  تطوير وتصميم
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                مصمم ومطور منصة صوت السودان للذكاء الاصطناعي 🇸🇩
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://wa.me/249919980435?text=%D0%A1%D0%BB%D0%B0%D0%BC%20%D8%B9%D9%84%D9%8A%D9%83%D9%85%20%D8%A3%D8%B3%D8%AA%D8%A7%D8%B0%20%D9%83%D9%85%D8%A7%D9%84%20%D8%AC%D8%B9%D9%81%D8%B1%20%D8%B2%D9%83%D8%B1%D9%8A%D8%A7"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-zinc-950" />
              <span>واتساب: 00249919980435</span>
            </a>
          </div>
        </div>
        <p className="text-xs text-zinc-300 leading-relaxed">
          متخصص في تطوير النظم المتقدمة وتصميم واجهات المستخدم لتطبيقات الذكاء الاصطناعي. يسعدنا استلام اقتراحاتكم واستفساراتكم الفنية مباشرة عبر الواتساب.
        </p>
      </div>

      {/* Subscription Plans */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            باقات العضوية والاستخدام
          </h3>
          <span className="text-xs text-emerald-400 font-bold">التطبيق مجاني 100% لجميع السودانيين</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((p) => (
            <div
              key={p.id}
              className={`p-6 rounded-3xl border space-y-4 transition-all relative ${
                selectedPlan === p.id
                  ? 'bg-gradient-to-b from-zinc-900 via-zinc-900 to-emerald-950/40 border-emerald-500 shadow-xl'
                  : 'bg-zinc-900/80 border-zinc-800'
              }`}
            >
              <div>
                <h4 className="text-sm font-black text-white">{p.name}</h4>
                <p className="text-lg font-black text-emerald-400 mt-1">{p.price}</p>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">{p.desc}</p>
              </div>

              <div className="space-y-2 pt-2 border-t border-zinc-800/80">
                {p.features.map((feat, fIdx) => (
                  <div key={fIdx} className="flex items-center gap-2 text-xs text-zinc-300">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  setSelectedPlan(p.id as any);
                  showToast(`تم اختيار ${p.name}!`);
                }}
                className={`w-full py-2.5 rounded-xl text-xs font-black transition-all ${
                  selectedPlan === p.id
                    ? 'bg-emerald-500 text-zinc-950 shadow-md'
                    : 'bg-zinc-950 text-zinc-300 hover:bg-zinc-800 border border-zinc-800'
                }`}
              >
                {selectedPlan === p.id ? 'الباقة الحالية' : 'ترقية العضوية'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Data Backup & Export Section */}
      <div className="p-6 bg-zinc-900/80 border border-zinc-800 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-right">
          <h4 className="text-sm font-black text-white flex items-center gap-2 justify-center sm:justify-start">
            <Download className="w-4 h-4 text-emerald-400" />
            النسخ الاحتياطي وتصدير البيانات
          </h4>
          <p className="text-xs text-zinc-400">تحميل ملف JSON كامل يحتوي على محادثاتك وأصواتك الإعلانية المفضلة للاحتفاظ بها محلياً</p>
        </div>

        <button
          onClick={handleExportDataBackup}
          className="px-5 py-2.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>تحميل النسخة الاحتياطية</span>
        </button>
      </div>

    </div>
  );
};

export default ProfileView;
