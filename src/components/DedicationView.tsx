import React from 'react';
import { Heart, Copy, Check, ShieldCheck, Sparkles, Building2, UserCheck, MessageCircle, Phone, Award, Code2, Palette } from 'lucide-react';

interface DedicationViewProps {
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export const DedicationView: React.FC<DedicationViewProps> = ({ showToast }) => {
  const whatsappNumber = "00249919980435";
  const whatsappLink = "https://wa.me/249919980435?text=" + encodeURIComponent("السلام عليكم أستاذ كمال جعفر زكريا، تواصلت معك بخصوص منصة صوت السودان للذكاء الاصطناعي");

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto pb-12">
      
      {/* Dedication Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-teal-950 to-zinc-950 border border-emerald-500/40 rounded-3xl p-8 space-y-6 shadow-2xl backdrop-blur-xl">
        <div className="space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            <Heart className="w-4 h-4 fill-emerald-500/40 text-emerald-400" />
            إهداء ومبادرة وطنية سودانية 🇸🇩
          </div>

          <h1 className="text-2xl md:text-4xl font-black text-white leading-tight">
            مشروع وطني لخدمة العلم والتقنية والذكاء الاصطناعي في السودان
          </h1>

          <p className="text-xs md:text-sm text-zinc-200 leading-relaxed max-w-2xl">
            إهداء خاص لكل المبتكرين والطلاب والباحثين والشباب في جميع أنحاء السودان الحبيب. هذا التطبيق متاح مجاناً وبدون أي اشتراكات ربحية لخدمة المعرفة وتطوير التكنولوجيا.
          </p>
        </div>

        {/* Designer Profile Card */}
        <div className="bg-zinc-900/90 border border-emerald-500/40 rounded-3xl p-6 md:p-8 space-y-5 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Designer Avatar Emblem */}
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-amber-400 p-1 shrink-0 shadow-xl shadow-emerald-500/20">
              <div className="w-full h-full bg-zinc-950 rounded-[22px] flex items-center justify-center flex-col text-center">
                <span className="text-2xl font-black text-emerald-400">ك ج</span>
                <span className="text-[9px] font-bold text-zinc-400 mt-0.5">كمال جعفر</span>
              </div>
            </div>

            <div className="space-y-3 text-center md:text-right flex-1">
              <div className="space-y-1">
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <h2 className="text-2xl font-black text-white">كمال جعفر زكريا</h2>
                  <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <UserCheck className="w-3 h-3" />
                    المصمم والمهندس الرئيسي
                  </span>
                </div>
                <p className="text-xs text-emerald-400 font-bold">
                  مهندس ومصمم منصة ومبادرة "صوت السودان للذكاء الاصطناعي"
                </p>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed">
                مطور برمجيات ومهندس واجهات مستخدم متمرس، متخِصص في تصميم وتطوير النظم الذكية وتطبيقات الويب التفاعلية. صُممت هذه المنصة برؤية وطنية طموحة لتقديم أحدث تقنيات الصوت، الرؤية، والمحادثة بأسلوب عصري وسهل الوصول لجميع أبناء السودان.
              </p>

              {/* Specialization Tags */}
              <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start pt-1">
                <span className="px-3 py-1 bg-zinc-950 border border-zinc-800 rounded-xl text-[11px] text-zinc-300 font-medium flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                  هندسة البرمجيات والـ AI
                </span>
                <span className="px-3 py-1 bg-zinc-950 border border-zinc-800 rounded-xl text-[11px] text-zinc-300 font-medium flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-purple-400" />
                  تصميم واجهات وتجربة المستخدم (UI/UX)
                </span>
                <span className="px-3 py-1 bg-zinc-950 border border-zinc-800 rounded-xl text-[11px] text-zinc-300 font-medium flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  مبادرة تقنية مجانية
                </span>
              </div>

              {/* WhatsApp Contact Bar */}
              <div className="pt-4 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-200">
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>رقم التواصل المباشر (واتساب):</span>
                  <span className="text-emerald-400 font-mono dir-ltr">{whatsappNumber}</span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black rounded-xl text-xs shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 fill-zinc-950" />
                    <span>مراسلة عبر الواتساب</span>
                  </a>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(whatsappNumber);
                      showToast("تم نسخ رقم الواتساب (00249919980435) للحافظة!");
                    }}
                    className="p-2.5 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-zinc-300 transition-all"
                    title="نسخ رقم الواتساب"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Bank Card Contribution */}
        <div className="bg-zinc-950/90 border border-emerald-500/40 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-zinc-800 pb-4">
            <div className="space-y-1 text-center sm:text-right">
              <span className="text-xs text-zinc-400 font-bold">بنك الخرطوم (Bank of Khartoum):</span>
              <h3 className="text-xl font-black text-emerald-400 tracking-wider">2813955</h3>
              <p className="text-[11px] text-zinc-400">باسم: كمال جعفر زكريا موسى</p>
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText("2813955");
                showToast("تم نسخ رقم حساب بنك الخرطوم (2813955) بنجاح!");
              }}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-black rounded-xl text-xs shadow-lg transition-all flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              <span>نسخ رقم الحساب (2813955)</span>
            </button>
          </div>

          <p className="text-[11px] text-zinc-400 leading-relaxed">
            💡 **تنويه نبل وشفافية:** نرحب بالمساهمة الطوعية لدعم استدامة تشغيل سيرفرات المنصة وتطوير نماذج الذكاء الاصطناعي لخدمة كافة أبناء السودان.
          </p>
        </div>

        {/* Vision Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-zinc-300 pt-2">
          <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-1">
            <h4 className="font-bold text-emerald-400">مجاني لجميع الطلاب</h4>
            <p className="text-[11px] text-zinc-400">بدون إعلانات مزعجة أو قيود استجابة.</p>
          </div>

          <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-1">
            <h4 className="font-bold text-teal-400">دعم الباحثين والبرمجة</h4>
            <p className="text-[11px] text-zinc-400">أدوات متطورة للأكاديميين والمطورين.</p>
          </div>

          <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-1">
            <h4 className="font-bold text-amber-400">تطوير مستمر</h4>
            <p className="text-[11px] text-zinc-400">تحديثات دورية لمواكبة أحدث تقنيات العالم.</p>
          </div>
        </div>

      </div>

    </div>
  );
};

