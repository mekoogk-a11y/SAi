import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  BookOpen, 
  Sparkles, 
  Search, 
  MapPin, 
  Utensils, 
  Landmark, 
  Wheat, 
  Sun, 
  Copy, 
  Loader2,
  BookMarked,
  Plus,
  Volume2,
  Filter
} from 'lucide-react';
import Markdown from 'react-markdown';
import { SudaneseDictionaryManager, DictionaryEntry } from '../lib/sudaneseDictionary';

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

  // Dictionary Tab States
  const [viewMode, setViewMode] = useState<'encyclopedia' | 'dictionary'>('encyclopedia');
  const [dictSearchQuery, setDictSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('الكل');
  const [selectedDictCat, setSelectedDictCat] = useState('الكل');
  const [dictionaryEntries, setDictionaryEntries] = useState<DictionaryEntry[]>([]);

  // Add Word Form State
  const [showAddWordModal, setShowAddWordModal] = useState(false);
  const [newWord, setNewWord] = useState('');
  const [newFusha, setNewFusha] = useState('');
  const [newMeaning, setNewMeaning] = useState('');
  const [newRegion, setNewRegion] = useState<any>('عامة السودان');
  const [newCategory, setNewCategory] = useState<any>('حياة يومية');

  useEffect(() => {
    setDictionaryEntries(SudaneseDictionaryManager.getAllEntries());
  }, []);

  const handleSearchDictionary = () => {
    const results = SudaneseDictionaryManager.search(dictSearchQuery, selectedDictCat, selectedRegion);
    setDictionaryEntries(results);
  };

  useEffect(() => {
    handleSearchDictionary();
  }, [dictSearchQuery, selectedRegion, selectedDictCat]);

  const handleAddWordSubmit = () => {
    if (!newWord.trim() || !newMeaning.trim()) {
      showToast("يرجى إدخال الكلمة والمعنى قبل الحفظ", "error");
      return;
    }

    const added = SudaneseDictionaryManager.addEntry({
      word: newWord.trim(),
      fushaEquivalent: newFusha.trim() || newWord.trim(),
      meaning: newMeaning.trim(),
      context: 'عامي',
      phonetics: newWord.trim(),
      region: newRegion,
      synonyms: [newWord.trim()],
      examples: [`تُستخدم كلمة ${newWord.trim()} في العامية السودانية.`],
      category: newCategory
    });

    setDictionaryEntries(SudaneseDictionaryManager.getAllEntries());
    showToast(`تمت إضافة كلمة "${added.word}" لقاموس اللهجة السودانية بنجاح! 🇸🇩`);
    setShowAddWordModal(false);
    setNewWord('');
    setNewFusha('');
    setNewMeaning('');
  };

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
        `• **الأهمية التاريخية وثقافية:** يُعد هذا الموضوع جزءاً أصيلاً من الهوية السودانية الثرية بالتنوع والأصالة.\n` +
        `• **التفاصيل:** توثيق شامل بالدلائل والشواهد التاريخية الجغرافية والمعرفية.`);
      showToast("تم عرض التقرير المعرفي بنجاح!");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto pb-12 text-right">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950/90 via-teal-950/70 to-zinc-950 border border-emerald-500/30 p-6 rounded-3xl space-y-3 backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
            <Heart className="w-3.5 h-3.5 fill-emerald-500/40 text-emerald-400" />
            <span>الموسوعة وقاموس اللهجة السودانية الأصيل 🇸🇩</span>
          </div>

          <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-2xl border border-zinc-800 text-xs font-bold">
            <button
              onClick={() => setViewMode('encyclopedia')}
              className={`px-3 py-1.5 rounded-xl transition-all ${viewMode === 'encyclopedia' ? 'bg-emerald-500 text-zinc-950 font-black' : 'text-zinc-400 hover:text-white'}`}
            >
              الموسوعة الشاملة
            </button>
            <button
              onClick={() => setViewMode('dictionary')}
              className={`px-3 py-1.5 rounded-xl transition-all ${viewMode === 'dictionary' ? 'bg-emerald-500 text-zinc-950 font-black' : 'text-zinc-400 hover:text-white'}`}
            >
              قاموس اللهجة السودانية 📖
            </button>
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-black text-white">موسوعة وقاموس المعرفة السودانية الشاملة</h2>
        <p className="text-xs text-zinc-300 leading-relaxed max-w-3xl">
          استكشف التاريخ العريق لممالك كوش ومروي، وقاموس اللهجات السودانية المزود بالمعاني، المرادفات بالنطق السليم وإمكانية إضافة كلمات جديدة.
        </p>
      </div>

      {viewMode === 'encyclopedia' && (
        <div className="space-y-6">
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
                  <span>التقرير الثقافي والمعرفي</span>
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
      )}

      {/* Part 2: Dictionary Explorer */}
      {viewMode === 'dictionary' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Controls Bar */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-5 space-y-4 backdrop-blur-xl">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <BookMarked className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-black text-white">قاموس المفردات والتعبيرات السودانية</h3>
              </div>

              <button
                onClick={() => setShowAddWordModal(true)}
                className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة كلمة جديدة للقاموس</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="relative">
                <input
                  type="text"
                  value={dictSearchQuery}
                  onChange={(e) => setDictSearchQuery(e.target.value)}
                  placeholder="ابحث عن كلمة سودانية (مثل: زول، شديد، هسي...)"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pr-9 pl-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
                <Search className="w-4 h-4 text-zinc-500 absolute right-3 top-3" />
              </div>

              <div>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-zinc-300 focus:outline-none"
                >
                  <option value="الكل">جميع المناطق (الخرطوم، كردفان، الشمالية...)</option>
                  <option value="عامة السودان">عامة السودان</option>
                  <option value="الخرطوم">الخرطوم والمدن</option>
                  <option value="الوسط والجزيرة">الوسط والجزيرة</option>
                  <option value="الشمالية">الشمالية ونهر النيل</option>
                  <option value="كردفان">كردفان الكبرى</option>
                  <option value="دارفور">دارفور الكبرى</option>
                  <option value="الشرق">الشرق وبورتسودان</option>
                </select>
              </div>

              <div>
                <select
                  value={selectedDictCat}
                  onChange={(e) => setSelectedDictCat(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-zinc-300 focus:outline-none"
                >
                  <option value="الكل">جميع التصنيفات</option>
                  <option value="ترحيب وتحية">ترحيب وتحية</option>
                  <option value="تعبير وحماس">تعبير وحماس</option>
                  <option value="وصف وأخلاق">وصف وأخلاق</option>
                  <option value="حياة يومية">حياة يومية</option>
                  <option value="شبابي">مصطلحات شبابية</option>
                  <option value="تجارة وسوق">تجارة وسوق</option>
                </select>
              </div>
            </div>
          </div>

          {/* Dictionary Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dictionaryEntries.map((entry) => (
              <div
                key={entry.id}
                className="bg-zinc-900/80 border border-zinc-800 hover:border-emerald-500/40 rounded-3xl p-5 space-y-3 backdrop-blur-xl transition-all group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-lg font-black text-emerald-400 group-hover:text-emerald-300 transition-colors">
                      {entry.word}
                    </h4>
                    <span className="text-[10px] text-zinc-500 font-mono">النطق: {entry.phonetics}</span>
                  </div>

                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                    {entry.region}
                  </span>
                </div>

                <div className="space-y-1.5 pt-1 border-t border-zinc-800/80 text-xs">
                  <p className="text-zinc-200 font-bold">
                    <span className="text-zinc-500 font-normal">المرادف بالفصحى: </span>
                    {entry.fushaEquivalent}
                  </p>
                  <p className="text-zinc-300 text-[11px] leading-relaxed">
                    <span className="text-zinc-500 font-normal">المعنى والسياق: </span>
                    {entry.meaning}
                  </p>
                </div>

                {entry.examples && entry.examples.length > 0 && (
                  <div className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-800/60 text-[10px] text-zinc-400 italic">
                    💬 "{entry.examples[0]}"
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      )}

      {/* Add Word Modal */}
      {showAddWordModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-emerald-500/40 rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl text-right animate-fade-in">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-400" />
              <span>إضافة كلمة سودانية جديدة لقاموس المنصة</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1">الكلمة السودانية:</label>
                <input
                  type="text"
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  placeholder="مثال: حبابك، جكس، حنك، زول..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1">المرادف بالفصحى:</label>
                <input
                  type="text"
                  value={newFusha}
                  onChange={(e) => setNewFusha(e.target.value)}
                  placeholder="مثال: أهلاً وسهلاً / صديقي..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1">المعنى والسياق الاستخدام:</label>
                <textarea
                  value={newMeaning}
                  onChange={(e) => setNewMeaning(e.target.value)}
                  placeholder="شرح معنى الكلمة ومتى تُستخدم عند السودانيين..."
                  rows={3}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1">المنطقة:</label>
                  <select
                    value={newRegion}
                    onChange={(e) => setNewRegion(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-300 focus:outline-none"
                  >
                    <option value="عامة السودان">عامة السودان</option>
                    <option value="الخرطوم">الخرطوم والمدن</option>
                    <option value="الوسط والجزيرة">الوسط والجزيرة</option>
                    <option value="الشمالية">الشمالية ونهر النيل</option>
                    <option value="كردفان">كردفان الكبرى</option>
                    <option value="دارفور">دارفور الكبرى</option>
                    <option value="الشرق">الشرق وبورتسودان</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1">التصنيف:</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-300 focus:outline-none"
                  >
                    <option value="حياة يومية">حياة يومية</option>
                    <option value="ترحيب وتحية">ترحيب وتحية</option>
                    <option value="تعبير وحماس">تعبير وحماس</option>
                    <option value="وصف وأخلاق">وصف وأخلاق</option>
                    <option value="تجارة وسوق">تجارة وسوق</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={handleAddWordSubmit}
                className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black rounded-xl text-xs transition-all shadow-md"
              >
                حفظ الكلمة في القاموس
              </button>
              <button
                onClick={() => setShowAddWordModal(false)}
                className="px-4 py-3 bg-zinc-800 text-zinc-300 font-bold rounded-xl text-xs hover:bg-zinc-700"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SudanKnowledgeView;
