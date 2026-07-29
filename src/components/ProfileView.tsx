import React, { useState } from 'react';
import { User, Shield, Star, MessageSquare, Heart, Clock, LogOut, Lock, CheckCircle, Award, Zap, Download, Upload, ShieldCheck, Sparkles } from 'lucide-react';

interface ProfileViewProps {
  currentUser: any;
  setShowAuthModal: (s: boolean) => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
  setActiveView: (view: string) => void;
  savedChats: any[];
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  setShowAuthModal,
  showToast,
  setActiveView,
  savedChats
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'pro' | 'business'>('free');

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
    showToast("تم تصدير نسخة احتياطية كاملة من بياناتك بنجاح!");
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto pb-12">
      
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
            <span>المحادثات المحفوظة</span>
            <MessageSquare className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-white">{savedChats.length}</p>
        </div>

        <div className="p-5 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>المساهمات الوطنية</span>
            <Heart className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-400">حساب 2813955</p>
        </div>

        <div className="p-5 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>حالة الذكاء الاصطناعي</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-white">SAi 3.5 Pro</p>
        </div>
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
          <p className="text-xs text-zinc-400">تحميل ملف JSON كامل يحتوي على محادثاتك وسجلاتك للاحتفاظ بها محلياً</p>
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
