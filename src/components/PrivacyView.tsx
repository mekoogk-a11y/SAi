import React from 'react';
import { ShieldCheck, Lock, FileText, CheckCircle2, UserCheck, Eye, Database } from 'lucide-react';

interface PrivacyViewProps {
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export const PrivacyView: React.FC<PrivacyViewProps> = () => {
  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-4xl mx-auto text-right">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-emerald-950/80 border border-emerald-500/30 p-8 rounded-3xl space-y-3 backdrop-blur-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>الخصوصية والأمان والشروط القانونية</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-black text-white">سياسة الخصوصية وشروط استخدام منصة SAi</h1>
        <p className="text-xs md:text-sm text-zinc-300 leading-relaxed max-w-2xl">
          تلتزم منصة SAi لحماية بيانات مستخدميها وتوفير بيئة ذكاء اصطناعي آمنة وموثوقة بنسبة 100%.
        </p>
      </div>

      {/* Accordion / Content Sections */}
      <div className="space-y-6">
        
        {/* Section 1: Privacy */}
        <div className="p-6 rounded-3xl bg-zinc-900/80 border border-zinc-800 space-y-4 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-emerald-400 font-black text-base border-b border-zinc-800 pb-3">
            <Lock className="w-5 h-5 text-emerald-400" />
            <h2>1. حماية البيانات والخصوصية</h2>
          </div>
          <div className="space-y-2 text-xs text-zinc-300 leading-relaxed">
            <p>
              • نحن لا نقوم برفع أو تسريب بياناتك الشخصية أو محادثاتك لأي جهة خارجية.
            </p>
            <p>
              • جميع الطلبات والمستندات والصور المعالجة عبر الذكاء الاصطناعي يتم تشفيرها أثناء النقل ولا يتم تخزينها على خوادم عامة.
            </p>
            <p>
              • يتم حفظ تفضيلاتك وسجل المحادثات محلياً في متصفحك أو عبر خوادم Firebase المشفرة بحماية أمان صارمة.
            </p>
          </div>
        </div>

        {/* Section 2: Terms of Use */}
        <div className="p-6 rounded-3xl bg-zinc-900/80 border border-zinc-800 space-y-4 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-cyan-400 font-black text-base border-b border-zinc-800 pb-3">
            <FileText className="w-5 h-5 text-cyan-400" />
            <h2>2. شروط الاستخدام والاستخدام العادل</h2>
          </div>
          <div className="space-y-2 text-xs text-zinc-300 leading-relaxed">
            <p>
              • المنصة متاحة مجاناً 100% للأغراض العلمية، الأكاديمية، الإبداعية، والتجارية المشروعة.
            </p>
            <p>
              • يُحظر استخدام خدمات التوليد الصوتي أو المحادثة في إنشاء محتوى ضار، احتيالي، أو ينتهك القوانين والأنظمة المعمول بها.
            </p>
            <p>
              • نحتفظ بالحق في تقييد الوصول لأي استخدام ينتهك معايير الأمان أو يحاول تعطيل خوادم المنصة.
            </p>
          </div>
        </div>

        {/* Section 3: Intellectual Property */}
        <div className="p-6 rounded-3xl bg-zinc-900/80 border border-zinc-800 space-y-4 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-amber-400 font-black text-base border-b border-zinc-800 pb-3">
            <UserCheck className="w-5 h-5 text-amber-400" />
            <h2>3. الملكية الفكرية والعلامة التجارية</h2>
          </div>
          <div className="space-y-2 text-xs text-zinc-300 leading-relaxed">
            <p>
              • جميع حقوق الملكية الفكرية، الهوية البصرية، واسم منصة SAi (صوت السودان للذكاء الاصطناعي) محفوظة للمهندس كمال جعفر زكريا.
            </p>
            <p>
              • النصوص والصور والأصوات المُولّدة من قِبل المستخدمين تعود ملبيتها الكاملة للمستخدم لاستخدامها في مشاريعهم وأعمالهم الإعلانية والتجارية.
            </p>
          </div>
        </div>

        {/* Section 4: Security & PWA */}
        <div className="p-6 rounded-3xl bg-zinc-900/80 border border-zinc-800 space-y-4 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-rose-400 font-black text-base border-b border-zinc-800 pb-3">
            <Eye className="w-5 h-5 text-rose-400" />
            <h2>4. الأمان وتحديثات تطبيق PWA</h2>
          </div>
          <div className="space-y-2 text-xs text-zinc-300 leading-relaxed">
            <p>
              • يدعم الموقع تقنية Progressive Web App (PWA) للعمل بأعلى مستويات السرعة والأمان والتخزين المؤقت المحلي الذكي.
            </p>
            <p>
              • التطبيق متوافق تماماً مع معايير HTTPS وSSL ومتاح للنشر المباشر عبر Vercel وNetlify وCloudflare Pages.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};

export default PrivacyView;
