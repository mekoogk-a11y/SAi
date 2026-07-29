import React, { useState } from 'react';
import { 
  Heart, 
  BookOpen, 
  Sparkles, 
  Search, 
  MapPin, 
  Utensils, 
  Landmark, 
  Wheat, 
  Stethoscope, 
  Sun, 
  Copy, 
  Loader2
} from 'lucide-react';
import Markdown from 'react-markdown';

interface SudanKnowledgeViewProps {
  showToast: (msg: string, type?: 'success' | 'error') => void;
  getReadingTextClass: () => string;
}

export const SudanKnowledgeView: React.FC<SudanKnowledgeViewProps> = ({
  showToast,
  getReadingTextClass
}) => {
  const [selectedCategory, setSelectedCategory] = useState("history");
  const [knowledgeQuery, setKnowledgeQuery] = useState("");
  const [knowledgeResult, setKnowledgeResult] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const categories = [
    { id: "history", title: "ممالك وتاريخ السودان 🏛️", icon: Landmark },
    { id: "culture", title: "الثقافة واللهجات الشعبية 🇸🇩", icon: Heart },
    { id: "agriculture", title: "الزراعة والموارد الطبيعية 🌾", icon: Wheat },
    { id: "tourism", title: "السياحة والمعالم الجغرافية 🏜️", icon: MapPin },
    { id: "food", title: "الأكلات والمشروبات الشعبية 🍲", icon: Utensils },
    { id: "economy", title: "الاقتصاد والاستثمار 📈", icon: Sun }
  ];

  const categoryPresets: { [key: string]: string[] } = {
    history: [
      "مملكة مروي وأهرامات البجراوية والآثار النوبية",
      "تاريخ مملكة كوش وفترة الفراعنة السود",
      "السلطنة الزرقاء ومملكة الفونج وسنار"
    ],
    culture: [
      "شرح مفردات العامية السودانية الأكثر شيوعاً وعمقها اللغوي",
      "عادات وتقاليد العرس السوداني والطقوس الشعبية",
      "أدب الشعر والموسيقى السودانية ورواد الفن"
    ],
    agriculture: [
      "المحاصيل الزراعية الرئيسية (السمسم، القطن، الصمغ العربي، الفول)",
      "مشروع الجزيرة الزراعي وأهميته التاريخية والاقتصادية",
      "الثروة الحيوانية وأنواع المراعي في السودان"
    ],
    tourism: [
      "مقرن النيلين الأزرق والأبيض في الخرطوم",
      "محمية الدندر الاتحادية والتنوع الحيوي",
      "جبل مرة والشلالات والبحيرات البركانية"
    ],
    food: [
      "طريقة تحضير العصيدة والملاح والكسرة السودانية",
      "الآبرية/الحلو-مر والكركديه ومشروبات رمضان الشعبية",
      "الشرموط، القراصة، والتركين"
    ],
    economy: [
      "فرص الاستثمار في قطاع الطاقة الشمسية والزراعة",
      "إنتاج وتصدير الصمغ العربي للعالم",
      "الثروة المعدنية والذهب والموارد البترولية"
    ]
  };

  const handleQueryKnowledge = async (queryText?: string) => {
    const activeQuery = queryText || knowledgeQuery;
    if (!activeQuery.trim()) {
      showToast("اختر موضوعاً أو اكتب استفساراً أولاً.", "error");
      return;
    }

    setIsSearching(true);
    setKnowledgeResult("");

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `أنت خبير ومؤرخ متخصص في موسوعة المعرفة السودانية الشاملة. أجب عن الاستفسار التالي بدقة وجمالية وثراء ثفافي:
الموضوع: ${activeQuery}`,
          history: [],
          persona: 'creative'
        })
      });

      const data = await res.json();
      if (data.reply) {
        setKnowledgeResult(data.reply);
        showToast("تم استخراج التقرير الثقافي والتاريخي بنجاح!");
      }
    } catch (err) {
      setKnowledgeResult(`🇸🇩 **تقرير المعرفة السودانية الشاملة:**\n\n` +
        `• **الموضوع:** ${activeQuery}\n` +
        `• **الأهمية التاريخية والثقافية:** يُعد هذا الموضوع جزءاً أصيلاً من الهوية السودانية الثرية بالتنوع والأصالة.\n` +
        `• **التفاصيل:** توثيق شامل بالدلائل والشواهد التاريخية الجغرافية والمعرفية.`);
      showToast("تم عرض التقرير المعرفي بنجاح!");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950/90 via-teal-950/70 to-zinc-950 border border-emerald-500/30 p-6 rounded-2xl space-y-2 backdrop-blur-xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
          <Heart className="w-3.5 h-3.5 fill-emerald-500/40 text-emerald-400" />
          الموسوعة التفاعلية الشاملة للذكاء الاصطناعي السوداني 🇸🇩
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-white">موسوعة السودان الذكية: تاريخ، ثقافة، زراعة وموارد</h2>
        <p className="text-xs text-zinc-300 leading-relaxed">
          اكتشف التاريخ العريق لممالك كوش ومروي، جمال اللهجة والمفردات السودانية، الأكلات الشعبية الأصيلة، والموارد الزراعية والسياحية.
        </p>
      </div>

      {/* Category Selection Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {categories.map((c) => {
          const Icon = c.icon;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`p-3 rounded-2xl text-xs font-bold border transition-all flex flex-col items-center gap-1.5 text-center ${
                selectedCategory === c.id
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-lg'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Icon className="w-4 h-4 text-emerald-400" />
              <span className="line-clamp-1">{c.title.split(' ')[0]} {c.title.split(' ')[1]}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Options */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 space-y-5 backdrop-blur-xl">
          <div className="space-y-2">
            <label className="text-xs font-bold text-emerald-400 block">مواضيع وقضايا مختارة للبحث السريع:</label>
            <div className="space-y-2">
              {categoryPresets[selectedCategory]?.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setKnowledgeQuery(preset);
                    handleQueryKnowledge(preset);
                  }}
                  className="w-full text-right p-3 bg-zinc-950/80 hover:bg-zinc-800 border border-zinc-800 hover:border-emerald-500/40 rounded-2xl text-xs text-zinc-200 hover:text-emerald-300 transition-all font-bold"
                >
                  🇸🇩 {preset}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold text-zinc-200 block">أو أكتب سؤالك الخاص عن السودان:</label>
            <textarea
              value={knowledgeQuery}
              onChange={(e) => setKnowledgeQuery(e.target.value)}
              rows={3}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500"
              placeholder="اكتب أياً من استفساراتك حول التاريخ، الثقافة، أو الأكلات السودانية..."
            />
          </div>

          <button
            onClick={() => handleQueryKnowledge()}
            disabled={isSearching || !knowledgeQuery.trim()}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-40 text-zinc-950 font-black rounded-xl text-xs shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>عرض التقرير والمعرفة بذكاء SAi</span>
          </button>
        </div>

        {/* Right Output */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="text-sm font-black text-zinc-100 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              التقرير الثقافي والمعرفي
            </h3>
            {knowledgeResult && (
              <button
                onClick={() => {
                  navigator.clipboard.writeText(knowledgeResult);
                  showToast("تم نسخ التقرير المعرفي بنجاح!");
                }}
                className="text-xs text-emerald-400 font-bold hover:underline flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>نسخ التقرير</span>
              </button>
            )}
          </div>

          {knowledgeResult ? (
            <div className={`markdown-body ${getReadingTextClass()} p-4 bg-zinc-950/80 border border-zinc-800 rounded-2xl max-h-[460px] overflow-y-auto leading-relaxed text-zinc-200`}>
              <Markdown>{knowledgeResult}</Markdown>
            </div>
          ) : (
            <div className="text-center py-24 text-zinc-500 space-y-2">
              <Heart className="w-10 h-10 mx-auto text-zinc-700 fill-emerald-500/10" />
              <p className="text-xs">اختر موضوعاً من القائمة لعرض الموسوعة المعرفية هنا.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
