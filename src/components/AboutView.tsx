import React from 'react';
import { Sparkles, ShieldCheck, Heart, Cpu, Globe, Mic2, Code, Zap, Award, UserCheck } from 'lucide-react';

interface AboutViewProps {
  setActiveView: (view: string) => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ setActiveView, showToast }) => {
  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-5xl mx-auto">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-emerald-950/90 border border-emerald-500/30 p-8 shadow-2xl backdrop-blur-xl space-y-4 text-right">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>منصة الذكاء الاصطناعي السودانية الشاملة (SAi) 🇸🇩</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
          عن منصة <span className="text-emerald-400">SAi</span> – صوت السودان للذكاء الاصطناعي
        </h1>

        <p className="text-sm md:text-base text-zinc-300 leading-relaxed max-w-3xl">
          منصة عالمية مبتكرة تهدف لتطوير وإتاحة أحدث تقنيات الذكاء الاصطناعي التوليدي بالعامية السودانية واللغات العالمية لجميع أبناء السودان والعالم العربي مجاناً وبأعلى أداء واستقرار.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => setActiveView('chat')}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-black rounded-2xl text-xs shadow-xl transition-all flex items-center gap-2"
          >
            <Zap className="w-4 h-4" />
            <span>تجربة المنصة الآن (ابدأ المحادثة)</span>
          </button>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-zinc-900/80 border border-zinc-800 space-y-3 backdrop-blur-xl text-right">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-black">
            <Award className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-white">رؤيتنا المستقبليّة</h2>
          <p className="text-xs text-zinc-300 leading-relaxed">
            تمكين الطلاب، الباحثين، المطورين، وأصحاب الأعمال في السودان والمنطقة من أحدث أدوات التفكير الرقمي والذكاء الاصطناعي دون قيود، مع الحفاظ على الهوية والثقافة السودانية الأصيلة.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-zinc-900/80 border border-zinc-800 space-y-3 backdrop-blur-xl text-right">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center font-black">
            <Heart className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-white">رسالتنا وهدفنا</h2>
          <p className="text-xs text-zinc-300 leading-relaxed">
            تقديم أداء فائق وسرعة خارقة في معالجة الصوت والنصوص والصور، بجانب دعم النطق بالعامية السودانية الحماسية، لتوفير حلول ذكية وعملية تساهم في بناء المستقبل الرقمي.
          </p>
        </div>
      </div>

      {/* Core Capabilities Showcase */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 md:p-8 space-y-6 text-right">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-emerald-400" />
          <span>أبرز إمكانيات منصة SAi</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
            <Mic2 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-xs font-bold text-white">توليد الصوت الإعلاني السوداني</h3>
            <p className="text-[11px] text-zinc-400 leading-relaxed">أصوات رجالية حماسية ونبرات تسويقية قوية بالعامية السودانية بدقة عالية.</p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
            <Globe className="w-5 h-5 text-cyan-400" />
            <h3 className="text-xs font-bold text-white">الدردشة والترجمة الفورية</h3>
            <p className="text-[11px] text-zinc-400 leading-relaxed">إجابات فائقة السرعة مع ترجمة دقيقة بكل اللغات ودعم لهجات السودان.</p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
            <Code className="w-5 h-5 text-amber-400" />
            <h3 className="text-xs font-bold text-white">المساعد البرمجي والأكاديمي</h3>
            <p className="text-[11px] text-zinc-400 leading-relaxed">كتابة الأكواد البرمجية، تصحيح الأخطاء، وحل الامتحانات وبحوث PDF.</p>
          </div>
        </div>
      </div>

      {/* Engineering & Dedication Credit */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/80 via-zinc-950 to-zinc-950 border border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-6 text-right">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-black text-emerald-400">
            <UserCheck className="w-4 h-4" />
            <span>التصميم والتطوير الهندسي 🇸🇩</span>
          </div>
          <h3 className="text-lg font-black text-white">المهندس: كمال جعفر زكريا (Kamal Gafar Zakaria)</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            تم تطوير المنصة بإتقان ورعاية هندسية رفيعة المستوى لتكون مشروعاً وطنياً رائداً في مجال الذكاء الاصطناعي.
          </p>
        </div>

        <button
          onClick={() => setActiveView('contact')}
          className="px-5 py-3 bg-zinc-900 hover:bg-zinc-800 text-emerald-400 border border-emerald-500/40 rounded-2xl text-xs font-extrabold shrink-0 transition-all"
        >
          التواصل المباشر مع المطور
        </button>
      </div>

    </div>
  );
};

export default AboutView;
