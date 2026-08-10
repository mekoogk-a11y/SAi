import React, { useState } from 'react';
import { 
  Heart, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  Server, 
  Cpu, 
  Wrench, 
  Zap, 
  Smartphone, 
  MessageCircle, 
  Copy, 
  UserCheck, 
  Code2, 
  Palette, 
  Award,
  Mail,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface DedicationViewProps {
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export const DedicationView: React.FC<DedicationViewProps> = ({ showToast }) => {
  const whatsappNumber = "00249919980435";
  const developerEmail = "mekoogk@gmail.com";
  const whatsappLink = "https://wa.me/249919980435?text=" + encodeURIComponent("السلام عليكم أستاذ كمال جعفر زكريا، تواصلت معك بخصوص دعم وتطوير منصة صوت السودان للذكاء الاصطناعي (SAi)");

  // Form State
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('تطوير وتحسين نماذج الذكاء الاصطناعي');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmitSupport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !email.trim() || !message.trim()) {
      setSubmitError('الرجاء تعبئة جميع الحقول المطلوبة (الاسم، البريد، والرسالة).');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const res = await fetch('/api/support-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, reason, message })
      });

      const data = await res.json();
      if (data.success) {
        setSubmitSuccess(data.message || 'تم استلام طلبك بنجاح! شكراً لدعمك وملاحظاتك.');
        showToast('تم إرسال رسالتك إلى المطور بنجاح!', 'success');
        setMessage('');
      } else {
        setSubmitError(data.error || 'حدث خطأ أثناء إرسال البيانات.');
      }
    } catch (err) {
      console.error("Support submission error:", err);
      setSubmitError('تعذر الاتصال بالخادم. الرجاء التأكد من اتصال الإنترنت ثم المحاولة مجدداً.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto pb-12">
      
      {/* Header Support Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-teal-950 to-zinc-950 border border-emerald-500/40 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl backdrop-blur-xl">
        <div className="space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            <Heart className="w-4 h-4 fill-emerald-500/40 text-emerald-400" />
            <span>مركز دعم وتطوير منصة SAi – صوت السودان 🇸🇩</span>
          </div>

          <h1 className="text-2xl md:text-4xl font-black text-white leading-tight">
            دعم التطوير وتحديث البنية التحتية لمنصة الذكاء الاصطناعي السودانية
          </h1>

          <p className="text-xs md:text-sm text-zinc-300 leading-relaxed max-w-3xl">
            منصة <strong className="text-emerald-400">SAi</strong> مبادرة تقنية سودانية غير ربحية تهدف لتمكين الطلاب والباحثين والمبتكرين بأحدث أدوات التوليد الصوتي، معالجة اللغات، والرؤية الحاسوبية. دعمكم وملاحظاتكم تساهم مباشرة في تطوير واستدامة هذه المبادرة.
          </p>
        </div>

        {/* Pillars of Support */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs">
              <Cpu className="w-4 h-4" />
              <span>تطوير نماذج الذكاء الاصطناعي</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-normal">
              تدريب وتحديث نماذج الصوت بالعامية السودانية وفهم السياق الأكاديمي واللغوي.
            </p>
          </div>

          <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-1.5">
            <div className="flex items-center gap-2 text-teal-400 font-extrabold text-xs">
              <Server className="w-4 h-4" />
              <span>تكاليف الخوادم والـ Cloud</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-normal">
              تأمين خوادم معالجة سريعة (High Performance GPU Nodes) لتقديم استجابة فورية بدون توقف.
            </p>
          </div>

          <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-1.5">
            <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs">
              <Zap className="w-4 h-4" />
              <span>إضافة مزايا وتقنيات جديدة</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-normal">
              إدراج أدوات البرمجة المعقدة، التحليل البياني، ومحركات التوليد المرئي المتقدمة.
            </p>
          </div>

          <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-1.5">
            <div className="flex items-center gap-2 text-purple-400 font-extrabold text-xs">
              <Wrench className="w-4 h-4" />
              <span>الصيانة والأمان واستقرار النظام</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-normal">
              حماية بيانات المستخدمين والتأكد من عدم جمع أو تداول أي بيانات مالية أو حساسة.
            </p>
          </div>

          <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-1.5 sm:col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 text-cyan-400 font-extrabold text-xs">
              <Smartphone className="w-4 h-4" />
              <span>التجهيز لتطبيقات الأندرويد و iOS المستقلة</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-normal">
              بناء وتوفير تطبيقات الهواتف الذكية المباشرة عبر متجر Google Play ومتجر App Store مع ميزة العمل بدون إنترنت عند الحاجة.
            </p>
          </div>
        </div>
      </div>

      {/* Developer Profile Card */}
      <div className="bg-zinc-950/90 border border-emerald-500/40 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar Emblem */}
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-amber-400 p-1 shrink-0 shadow-xl shadow-emerald-500/20">
            <div className="w-full h-full bg-zinc-950 rounded-[22px] flex items-center justify-center flex-col text-center">
              <span className="text-2xl font-black text-emerald-400">ك ج</span>
              <span className="text-[9px] font-bold text-zinc-400 mt-0.5">كمال جعفر</span>
            </div>
          </div>

          <div className="space-y-3 text-center md:text-right flex-1">
            <div className="space-y-1">
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <h2 className="text-2xl font-black text-white">المهندس كمال جعفر زكريا</h2>
                <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <UserCheck className="w-3 h-3" />
                  المصمم والمهندس الرئيسي
                </span>
              </div>
              <p className="text-xs text-emerald-400 font-bold">
                مهندس برمجيات ومصمم واجهات النظم الذكية (Senior AI Platform Engineer & Architect)
              </p>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              يسعدني جداً استقبال آرائكم، ملاحظاتكم التطويرية، واقتراحاتكم للنهوض بهذه المبادرة الوطنية وإيصالها لأعلى المعايير العالمية.
            </p>

            {/* Specialization Badges */}
            <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start pt-1">
              <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-xl text-[11px] text-zinc-300 font-medium flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                هندسة النظم الذكية والـ FastAPI / Python
              </span>
              <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-xl text-[11px] text-zinc-300 font-medium flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-purple-400" />
                تصميم تجربة واجهات المستخدم (UI/UX Architecture)
              </span>
              <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-xl text-[11px] text-zinc-300 font-medium flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                مبادرة تقنية مجانية 100%
              </span>
            </div>

            {/* Direct Contact Methods */}
            <div className="pt-4 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="space-y-1 text-right">
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-200">
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>الواتساب المباشر:</span>
                  <span className="text-emerald-400 font-mono dir-ltr">{whatsappNumber}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-400">
                  <Mail className="w-4 h-4 text-teal-400" />
                  <span>البريد الإلكتروني:</span>
                  <span className="text-zinc-300 font-mono">{developerEmail}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black rounded-xl text-xs shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 fill-zinc-950" />
                  <span>مراسلة الواتساب</span>
                </a>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(whatsappNumber);
                    showToast("تم نسخ رقم الواتساب (00249919980435) بنجاح!");
                  }}
                  className="p-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-zinc-300 transition-all"
                  title="نسخ رقم الواتساب"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Support & Feedback Submission Form (SupportCenter Module) */}
      <div className="bg-zinc-950/90 border border-zinc-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
        <div className="space-y-1 text-right border-b border-zinc-800/80 pb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>نموذج التواصل ودعم التطوير</span>
          </div>
          <h3 className="text-xl font-black text-white">تقديم دعم، ملاحظات، أو اقتراحات تطويرية</h3>
          <p className="text-xs text-zinc-400">
            أرسل رسالتك مباشرة لفريق التطوير. لا نطلب ولا نجمع أي معلومات مالية أو بطاقات بنكية إطلاقاً.
          </p>
        </div>

        {submitSuccess && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-3 text-emerald-400 text-xs font-bold animate-fade-in">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{submitSuccess}</span>
          </div>
        )}

        {submitError && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-3 text-red-400 text-xs font-bold animate-fade-in">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{submitError}</span>
          </div>
        )}

        <form onSubmit={handleSubmitSupport} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 text-right">
              <label className="text-xs font-bold text-zinc-300">الاسم / اسم المؤسسة أو الجهة الداعمة *</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="أدخل اسمك أو اسم جهة العمل/الكلية"
                className="w-full px-4 py-3 bg-zinc-900/90 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
                required
              />
            </div>

            <div className="space-y-1.5 text-right">
              <label className="text-xs font-bold text-zinc-300">البريد الإلكتروني للتواصل *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@domain.com"
                className="w-full px-4 py-3 bg-zinc-900/90 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors dir-ltr text-right"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5 text-right">
            <label className="text-xs font-bold text-zinc-300">هدف الدعم أو نوع الرسالة *</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-900/90 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
            >
              <option value="تطوير وتحسين نماذج الذكاء الاصطناعي">تطوير وتحسين نماذج الذكاء الاصطناعي</option>
              <option value="دعم تكاليف السيرفرات والبنية السحابية">دعم تكاليف السيرفرات والبنية السحابية</option>
              <option value="إضافة ميزة أو أداة برمجية جديدة">إضافة ميزة أو أداة برمجية جديدة</option>
              <option value="طلب شراكة تقنية أو أكاديمية">طلب شراكة تقنية أو أكاديمية</option>
              <option value="تقديم ملاحظات حول واجهة وتجربة المستخدم">تقديم ملاحظات حول واجهة وتجربة المستخدم</option>
              <option value="دعم واستفسار عام">دعم واستفسار عام</option>
            </select>
          </div>

          <div className="space-y-1.5 text-right">
            <label className="text-xs font-bold text-zinc-300">تفاصيل الرسالة أو الاقتراح *</label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="اكتب رسالتك، اقتراحاتك لتطوير المنصة، أو تفاصيل الدعم بالتفصيل..."
              className="w-full px-4 py-3 bg-zinc-900/90 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
              required
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>خصوصية تامة – لا يتم طلب أو حفظ أي بيانات مالية.</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 text-zinc-950 font-black rounded-xl text-xs shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'جاري الإرسال...' : 'إرسال طلب الدعم والملاحظات'}</span>
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};

export default DedicationView;
