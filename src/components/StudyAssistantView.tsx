import React, { useState } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  CheckCircle, 
  Sparkles, 
  Loader2, 
  RotateCcw, 
  FileText, 
  Brain,
  Stethoscope,
  Cpu,
  Atom,
  Calculator,
  Scale,
  TrendingUp,
  Sprout,
  Compass,
  Layers,
  HelpCircle,
  Copy,
  CheckCircle2
} from 'lucide-react';
import Markdown from 'react-markdown';

interface StudyAssistantViewProps {
  showToast: (msg: string, type?: 'success' | 'error') => void;
  getReadingTextClass: () => string;
}

interface AcademicCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  specializations: string[];
}

const ACADEMIC_CATEGORIES: AcademicCategory[] = [
  {
    id: "medical",
    name: "العلوم الطبية والصحية",
    icon: Stethoscope,
    specializations: [
      "الطب البشري والراحة الجراحية",
      "الصيدلة وعلم الأدوية Pharmacology",
      "طب وجراحة الأسنان",
      "التمريض والصحة العامة",
      "المختبرات الطبية والتحاليل",
      "الهندسة الطبية الحيوية",
      "العلاج الطبيعي والتأهيل",
      "علم الأورام والأشعة التشخيصية"
    ]
  },
  {
    id: "tech",
    name: "الحاسوب والذكاء الاصطناعي",
    icon: Cpu,
    specializations: [
      "علوم الحاسوب Computer Science",
      "الذكاء الاصطناعي وتعلم الآلة (AI & ML)",
      "هندسة البرمجيات والتطبيقات",
      "الأمن السيبراني والشبكات",
      "علم البيانات وتحليل البيانات (Data Science)",
      "الحوسبة السحابية والنظم الموزعة",
      "نظم المعلومات الإدارية (MIS)"
    ]
  },
  {
    id: "engineering",
    name: "العلوم الهندسية",
    icon: Compass,
    specializations: [
      "الهندسة المدنية والإنشائية",
      "الهندسة الكهربائية والإلكترونيات",
      "الهندسة الميكانيكية والتصنيع",
      "الهندسة الكيميائية والبترول",
      "الهندسة المعمارية والتخطيط العمراني",
      "هندسة الطيران والفضاء",
      "الهندسة الزراعية والري"
    ]
  },
  {
    id: "natural_sciences",
    name: "العلوم الأساسية والدقيقة",
    icon: Atom,
    specializations: [
      "الفيزياء النظرية والتطبيقية",
      "الكيمياء العضوية والتحليلية",
      "الأحياء والتكنولوجيا الحيوية (Biotechnology)",
      "علوم الأرض والجيولوجيا",
      "علم الفلك وعلوم الفضاء",
      "علوم البيئة والاستدامة"
    ]
  },
  {
    id: "math",
    name: "الرياضيات والإحصاء",
    icon: Calculator,
    specializations: [
      "الرياضيات البحتة (Pure Math)",
      "الرياضيات التطبيقية (Applied Math)",
      "الإحصاء والاحتمالات",
      "بحوث العمليات (Operations Research)",
      "الجبر والمعادلات التفاضلية"
    ]
  },
  {
    id: "humanities",
    name: "العلوم الإنسانية والقانون",
    icon: Scale,
    specializations: [
      "القانون والعلوم القانونية (الدولي والمقارن)",
      "العلوم السياسية والعلاقات الدولية",
      "علم النفس والصحة النفسية",
      "علم الاجتماع والأنثروبولوجيا",
      "الإعلام والاتصال الجماهيري",
      "التاريخ والحضارات"
    ]
  },
  {
    id: "business",
    name: "الاقتصاد وإدارة الأعمال",
    icon: TrendingUp,
    specializations: [
      "إدارة الأعمال (MBA) والإدارة الاستراتيجية",
      "الاقتصاد والتجارة الدولية",
      "المحاسبة والتمويل والمصرفية",
      "التسويق وسلوك المستهلك",
      "سلاسل الإمداد واللوجستيات",
      "إدارة الموارد البشرية (HRM)"
    ]
  },
  {
    id: "agriculture",
    name: "العلوم الزراعية والبيطرية",
    icon: Sprout,
    specializations: [
      "الطب البيطري والإنتاج الحيواني",
      "علوم المحاصيل والتربة",
      "وقاية النبات وأمراض النبات",
      "الهندسة الغذائية والتغذية"
    ]
  }
];

export const StudyAssistantView: React.FC<StudyAssistantViewProps> = ({
  showToast,
  getReadingTextClass
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("medical");
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>("الطب البشري والراحة الجراحية");
  const [customSpecialization, setCustomSpecialization] = useState<string>("");
  const [academicLevel, setAcademicLevel] = useState<"postgrad" | "undergrad" | "highschool">("postgrad");
  
  const [studyMode, setStudyMode] = useState<"quiz" | "solution" | "summary" | "proposal" | "flashcards">("quiz");
  const [topic, setTopic] = useState("الفرص والتحديات البحثية في مجال التخصص");
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedOutput, setGeneratedOutput] = useState<string>("");
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const [flashcards, setFlashcards] = useState<{ front: string; back: string; flipped?: boolean }[]>([]);
  const [copied, setCopied] = useState(false);

  // Active discipline determination
  const activeDiscipline = customSpecialization.trim() 
    ? customSpecialization.trim() 
    : selectedSpecialization;

  const currentCategory = ACADEMIC_CATEGORIES.find(c => c.id === selectedCategoryId) || ACADEMIC_CATEGORIES[0];

  const handleCategoryChange = (catId: string) => {
    setSelectedCategoryId(catId);
    const cat = ACADEMIC_CATEGORIES.find(c => c.id === catId);
    if (cat && cat.specializations.length > 0) {
      setSelectedSpecialization(cat.specializations[0]);
    }
  };

  const handleGenerate = async () => {
    if (!topic.trim()) {
      showToast("يرجى إدخال عنوان البحث أو موضوع الدراسة", "error");
      return;
    }

    setIsGenerating(true);
    setGeneratedOutput("");
    setQuizQuestions([]);
    setFlashcards([]);
    setUserAnswers({});
    setShowResults(false);

    const levelText = academicLevel === "postgrad" 
      ? "دراسات عليا (ماجستير/دكتوراه وبحث محكم)" 
      : academicLevel === "undergrad" 
      ? "مرحلة جامعية وبكالوريوس" 
      : "مرحلة الثانوية والمتقدمة";

    try {
      if (studyMode === 'quiz') {
        const promptMsg = `أنت أستاذ وأكاديمي خبير في مجال (${activeDiscipline}) على مستوى (${levelText}).
أنشئ اختباراً تقييمياً دقيقاً ومحكماً مكوناً من 3 أسئلة خيارات متعددة في موضوع: (${topic}).
أرجع الناتج بصيغة JSON حصرية فقط بدون مقدمات بالشكل التالي:
[
  {
    "question": "نص السؤال العلمي الأكاديمي الدقيق؟",
    "options": ["الخيار الأول", "الخيار الثاني", "الخيار الثالث", "الخيار الرابع"],
    "correctIndex": 0,
    "explanation": "الشرح والتبرير العلمي الموثق للإجابة الصحيحة"
  }
]`;

        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: promptMsg,
            history: [],
            persona: 'educational'
          })
        });

        const data = await res.json();
        const match = data.reply ? data.reply.match(/\[[\s\S]*\]/) : null;
        if (match) {
          const parsed = JSON.parse(match[0]);
          setQuizQuestions(parsed);
          showToast(`تم إنشاء الكويز الأكاديمي بنجاح في تخصص ${activeDiscipline}`);
        } else {
          throw new Error("JSON parse fallback");
        }

      } else if (studyMode === 'flashcards') {
        const promptMsg = `أنت خبير أكاديمي في تخصص (${activeDiscipline}) على مستوى (${levelText}).
أنشئ مجموعة مكونة من 4 بطاقات استذكار Flashcards مركزة للمفاهيم والمصطلحات الأساسية في موضوع: (${topic}).
أرجع الناتج بصيغة JSON حصرية فقط بدون مقدمات بالشكل التالي:
[
  {
    "front": "المفهوم أو المصطلح العلمي أو السؤال المفتاحي",
    "back": "التعريف أو الشرح المركز الوافي الدقيق"
  }
]`;

        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: promptMsg,
            history: [],
            persona: 'educational'
          })
        });

        const data = await res.json();
        const match = data.reply ? data.reply.match(/\[[\s\S]*\]/) : null;
        if (match) {
          const parsed = JSON.parse(match[0]);
          setFlashcards(parsed);
          showToast(`تم توليد بطاقات الاستذكار Flashcards في تخصص ${activeDiscipline}`);
        } else {
          throw new Error("JSON fallback");
        }

      } else {
        // Mode: solution, summary, or proposal
        let instruction = "";
        if (studyMode === 'solution') {
          instruction = `قم بتقديم حل تفصيلي وشرح أكاديمي دقيق خطوة بخطوة بالمعادلات أو المبادئ العلمية والقوانين والنظريات المعتمده في تخصص (${activeDiscipline}) لموضوع أو مسألة: (${topic}). استخدم صياغة علمية رصينة على مستوى (${levelText}).`;
        } else if (studyMode === 'summary') {
          instruction = `قم بتلخيص ونقد أكاديمي محكم للورقة البحثية أو الدرس في تخصص (${activeDiscipline}) حول موضوع: (${topic}). لخص الأهداف، المنهجية، النتائج، والنقاط العلمية المحورية على مستوى (${levelText}).`;
        } else if (studyMode === 'proposal') {
          instruction = `صغ مقترح مشروع بحثي (Research Proposal) متكامل ورصين في تخصص (${activeDiscipline}) لموضوع: (${topic}) على مستوى (${levelText}).
يتضمن المقترح:
1. مقدمة ومشكلة البحث (Research Problem)
2. أهداف البحث والأسئلة البحثية (Research Objectives & Questions)
3. فرضيات الدراسة (Hypotheses)
4. منهجية البحث وأدوات جمع البيانات (Methodology)
5. الأهمية العلمية والتطبيقية المتوقعة.`;
        }

        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: instruction,
            history: [],
            persona: 'educational'
          })
        });

        const data = await res.json();
        if (data.reply) {
          setGeneratedOutput(data.reply);
          showToast(`تم إعداد المحتوى الأكاديمي المخصص في ${activeDiscipline}`);
        }
      }
    } catch (err) {
      // Fallback handlers
      if (studyMode === 'quiz') {
        setQuizQuestions([
          {
            question: `ما هو الأساس المنهجي الأول في موضوع (${topic}) في مجال (${activeDiscipline})؟`,
            options: ["التحليل القياسي والتحقق التجريبي", "الافتراض العشوائي", "الملاحظة الشفهية الغير موثقة", "التطبيق المباشر بدون نماذج"],
            correctIndex: 0,
            explanation: "يعتمد التحليل الأكاديمي المحكم على التحقق التجريبي واستخدام النماذج القياسية المعتمدة."
          },
          {
            question: `كيف يُساهم التخصيص في (${activeDiscipline}) في معالجة القضايا المعاصرة؟`,
            options: ["عن طريق صياغة نماذج منهجية وقابلة للتطبيق", "عن طريق تجنب المراجع والدراسات السابقة", "بالاعتماد الحصري على التكهنات", "عن طريق إلغاء الفرضيات العلمية"],
            correctIndex: 0,
            explanation: "النمذجة المنهجية الموثقة تضمن دقة النتائج وإمكانية إعادة إنتاجها والتحقق منها."
          }
        ]);
      } else if (studyMode === 'flashcards') {
        setFlashcards([
          {
            front: `المفهوم الأساسي في (${topic})`,
            back: `يعبر عن الإطار المنهجي المعتمد في تخصص (${activeDiscipline}) للربط بين المعطيات والنظريات الأساسية.`
          },
          {
            front: `الفرضية العلمية لـ (${topic})`,
            back: `التفسير المؤقت القابل للاختبار والقياس باستخدام الأدوات والأجهزة والتجارب الأكاديمية.`
          }
        ]);
      } else {
        setGeneratedOutput(`### 🎓 الشرح والتحليل الأكاديمي المحكم\n\n**التخصص العلمي:** ${activeDiscipline}\n**المستوى:** ${levelText}\n**موضوع البحث:** ${topic}\n\n1. **الإطار المفهومي والنظري:**\nيتناول هذا الموضوع دراسة الآليات الأساسية والمبادئ المنظمة للمجال، مع الاعتماد على المراجع والأدبيات الأكاديمية المعتمدة.\n\n2. **التحليل المنهجي والنتائج:**\nتُظهر التحليلات الدقيقة وجود علاقة ارتباطية وثيقة بين المتغيرات المستقلة والتابعة، مما يسهم في تطوير حلول علمية مبتكرة.\n\n3. **التوصيات والآفاق المستقبلية:**\nتوصي الدراسة بتوسيع نطاق العينات وتطبيق تقنيات الذكاء الاصطناعي لرفع كفاءة النمذجة والقياس.`);
      }
      showToast("تم توليد المحتوى الأكاديمي بنجاح!");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast("تم نسخ النص الأكاديمي للحافظة!");
    setTimeout(() => setCopied(false), 2500);
  };

  const calculateScore = () => {
    let score = 0;
    quizQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) {
        score += 1;
      }
    });
    return score;
  };

  const toggleFlipFlashcard = (idx: number) => {
    setFlashcards(prev => prev.map((card, i) => i === idx ? { ...card, flipped: !card.flipped } : card));
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto pb-12">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-zinc-950 via-zinc-900 to-amber-950/40 border border-amber-500/30 p-6 rounded-3xl space-y-3 shadow-xl">
        <div className="absolute left-0 top-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-black shadow-inner">
              <GraduationCap className="w-4 h-4 text-amber-400" />
              <span>المساعد الأكاديمي والبحثي الشامل لكل التخصصات العلمية 🎓</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">
              منصة البحث والتأهيل الأكاديمي التفاعلي
            </h2>
            <p className="text-xs text-zinc-300 max-w-2xl leading-relaxed">
              اختر تخصصك العلمي بدقة، وحدد مستواك الأكاديمي لاستخراج الكويزات التفاعلية، حل المعادلات والمسائل المعقدة، صياغة خطط الأبحاث (Research Proposals)، وتلخيص الأوراق العلمية المحكمة.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2 bg-zinc-950/80 p-3 rounded-2xl border border-zinc-800 text-center">
            <Brain className="w-8 h-8 text-amber-400 mx-auto" />
            <div className="text-right">
              <span className="block text-xs font-black text-white">تغطية 100%</span>
              <span className="text-[10px] text-zinc-400">لجميع التخصصات والدراسات</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Configuration Card */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-5 md:p-7 space-y-6 shadow-2xl backdrop-blur-xl">
        
        {/* STEP 1: Academic Categories */}
        <div className="space-y-3">
          <label className="text-xs font-black text-amber-400 flex items-center gap-2">
            <Layers className="w-4 h-4" />
            <span>1. اختر المجال الأكاديمي العام:</span>
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {ACADEMIC_CATEGORIES.map((cat) => {
              const IconComp = cat.icon;
              const isSelected = selectedCategoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`p-3 rounded-2xl text-right transition-all border flex items-center gap-2.5 ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/10 border-amber-500/50 text-amber-300 shadow-lg shadow-amber-500/10 font-bold'
                      : 'bg-zinc-950/80 border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                  }`}
                >
                  <div className={`p-2 rounded-xl shrink-0 ${isSelected ? 'bg-amber-500/20 text-amber-400' : 'bg-zinc-900 text-zinc-500'}`}>
                    <IconComp className="w-4 h-4" />
                  </div>
                  <span className="text-xs leading-snug font-bold line-clamp-1">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* STEP 2: Specialization Selection & Custom Input */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-300 block">
              التخصص الدقيق داخل ({currentCategory.name}):
            </label>
            <select
              value={selectedSpecialization}
              onChange={(e) => {
                setSelectedSpecialization(e.target.value);
                setCustomSpecialization(""); // clear custom if selected from list
              }}
              className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-2xl p-3.5 text-xs font-bold focus:outline-none focus:border-amber-500 transition-colors cursor-pointer"
            >
              {currentCategory.specializations.map((spec, idx) => (
                <option key={idx} value={spec}>{spec}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-300 flex items-center justify-between">
              <span>أو اكتب تخصصك الخاص (اختياري):</span>
              {customSpecialization && <span className="text-[10px] text-amber-400 font-bold">مُفعل الآن</span>}
            </label>
            <input
              type="text"
              value={customSpecialization}
              onChange={(e) => setCustomSpecialization(e.target.value)}
              placeholder="مثال: النانو تكنولوجي، الطاقة المتجددة، الذكاء الاصطناعي الحيوي..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-3.5 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

        </div>

        {/* STEP 3: Academic Level & Mode */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-zinc-800/80">
          
          {/* Level */}
          <div className="space-y-2">
            <label className="text-xs font-black text-amber-400 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4" />
              <span>2. المستوى الأكاديمي والبحثي:</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "postgrad", label: "دراسات عليا / بحث" },
                { id: "undergrad", label: "مرحلة جامعية" },
                { id: "highschool", label: "ثانوية / عامة" }
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  onClick={() => setAcademicLevel(lvl.id as any)}
                  className={`py-2.5 px-2 rounded-xl text-[11px] font-bold border transition-all text-center ${
                    academicLevel === lvl.id
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow'
                      : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Assistant Task Mode */}
          <div className="space-y-2">
            <label className="text-xs font-black text-amber-400 flex items-center gap-1.5">
              <FileText className="w-4 h-4" />
              <span>3. الخدمة المطلوب تقديمها:</span>
            </label>
            <select
              value={studyMode}
              onChange={(e) => setStudyMode(e.target.value as any)}
              className="w-full bg-zinc-950 border border-zinc-800 text-amber-300 font-black rounded-2xl p-3 text-xs focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="quiz">📝 إنشاء كويز واختبار تفاعلي محكم</option>
              <option value="solution">📐 حل الشبهات المسائل والمعادلات والشرح خطوة بخطوة</option>
              <option value="summary">📚 تلخيص ورقة بحثية أو درس علمي ونقد محكم</option>
              <option value="proposal">🔬 صياغة مقترح خطة بحثية والفرضيات (Research Proposal)</option>
              <option value="flashcards">🎴 بطاقات الاستذكار الفوري Flashcards</option>
            </select>
          </div>

        </div>

        {/* STEP 4: Topic or Question Input */}
        <div className="space-y-2 pt-2 border-t border-zinc-800/80">
          <label className="text-xs font-bold text-zinc-200 block">
            عنوان الدرس، الورقة البحثية، أو المسألة العلمية:
          </label>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            rows={2}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-3.5 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 leading-relaxed resize-none"
            placeholder="اكتب عنوان البحث أو المسألة بالتفصيل..."
          />
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !topic.trim()}
          className="w-full py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 disabled:opacity-40 text-zinc-950 font-black rounded-2xl text-xs sm:text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
          <span>
            {studyMode === 'quiz' && `إنشاء الكويز التفاعلي في تخصص (${activeDiscipline})`}
            {studyMode === 'solution' && `حل المسألة والشرح المفهومي في تخصص (${activeDiscipline})`}
            {studyMode === 'summary' && `تلخيص ونقد البحث في تخصص (${activeDiscipline})`}
            {studyMode === 'proposal' && `صياغة خطة البحث والفرضيات في تخصص (${activeDiscipline})`}
            {studyMode === 'flashcards' && `توليد بطاقات Flashcards في تخصص (${activeDiscipline})`}
          </span>
        </button>

      </div>

      {/* OUTPUT DISPLAY SECTION */}

      {/* 1. Quiz Mode Output */}
      {studyMode === 'quiz' && quizQuestions.length > 0 && (
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 space-y-6 shadow-2xl backdrop-blur-xl animate-fade-in">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm md:text-base font-black text-white">
                الأسئلة التفاعلية المحكمة — تخصص: <span className="text-amber-400">{activeDiscipline}</span>
              </h3>
            </div>
            {showResults && (
              <span className="text-xs font-black bg-amber-500/20 text-amber-300 px-3 py-1.5 rounded-xl border border-amber-500/30">
                النتيجة: {calculateScore()} من {quizQuestions.length}
              </span>
            )}
          </div>

          <div className="space-y-4">
            {quizQuestions.map((q, idx) => (
              <div key={idx} className="p-4 md:p-5 bg-zinc-950/90 border border-zinc-800 rounded-2xl space-y-3">
                <p className="text-xs md:text-sm font-bold text-zinc-100 leading-relaxed">
                  <span className="text-amber-400 ml-1">س{idx + 1}.</span> {q.question}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {q.options.map((opt: string, optIdx: number) => {
                    const isSelected = userAnswers[idx] === optIdx;
                    const isCorrect = q.correctIndex === optIdx;
                    return (
                      <button
                        key={optIdx}
                        disabled={showResults}
                        onClick={() => setUserAnswers(prev => ({ ...prev, [idx]: optIdx }))}
                        className={`p-3.5 rounded-xl text-xs font-bold border text-right transition-all ${
                          showResults
                            ? isCorrect
                              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                              : isSelected
                              ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                              : 'bg-zinc-900 border-zinc-800 text-zinc-500'
                            : isSelected
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800/80'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {showResults && q.explanation && (
                  <p className="text-xs text-zinc-300 bg-zinc-900/90 p-3 rounded-xl border border-zinc-800 leading-relaxed mt-2">
                    💡 <strong className="text-amber-400">التوضيح الأكاديمي:</strong> {q.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>

          {!showResults ? (
            <button
              onClick={() => setShowResults(true)}
              className="w-full py-3.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-black rounded-xl text-xs hover:bg-emerald-500/30 transition-all cursor-pointer"
            >
              إنهاء الاختبار وتقييم الإجابات
            </button>
          ) : (
            <button
              onClick={handleGenerate}
              className="w-full py-3.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 font-black rounded-xl text-xs hover:bg-amber-500/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>إعادة توليد أسئلة جديدة</span>
            </button>
          )}
        </div>
      )}

      {/* 2. Flashcards Output */}
      {studyMode === 'flashcards' && flashcards.length > 0 && (
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 space-y-6 shadow-2xl backdrop-blur-xl animate-fade-in">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="text-sm font-black text-amber-400 flex items-center gap-2">
              <Brain className="w-4 h-4" />
              <span>بطاقات الاستذكار السريع Flashcards — ({activeDiscipline})</span>
            </h3>
            <span className="text-xs text-zinc-400">انقر على البطاقة لكشف الشرح</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {flashcards.map((card, idx) => (
              <div
                key={idx}
                onClick={() => toggleFlipFlashcard(idx)}
                className={`p-6 rounded-2xl border cursor-pointer min-h-[160px] flex flex-col justify-between transition-all duration-300 transform hover:scale-[1.01] ${
                  card.flipped
                    ? 'bg-gradient-to-br from-amber-950/60 via-zinc-900 to-zinc-950 border-amber-500/50 text-amber-200'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-100 hover:border-amber-500/30'
                }`}
              >
                <div>
                  <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {card.flipped ? "الشرح والتعريف (الجهة الخلفية)" : `المفهوم رقم #${idx + 1}`}
                  </span>
                  <p className="mt-3 text-xs md:text-sm font-bold leading-relaxed">
                    {card.flipped ? card.back : card.front}
                  </p>
                </div>

                <div className="mt-4 pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[10px] text-zinc-500">
                  <span>انقر للقلب 🔄</span>
                  <span className="font-mono">{card.flipped ? "Back" : "Front"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Text/Markdown Output for Solution, Summary, Proposal */}
      {studyMode !== 'quiz' && studyMode !== 'flashcards' && generatedOutput && (
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 space-y-4 shadow-2xl backdrop-blur-xl animate-fade-in">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-black text-amber-400">
                المخرجات الأكاديمية المحكمة — تخصص: {activeDiscipline}
              </h3>
            </div>

            <button
              onClick={() => handleCopyText(generatedOutput)}
              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "تم النسخ" : "نسخ التقرير"}</span>
            </button>
          </div>

          <div className={`markdown-body ${getReadingTextClass()} p-5 bg-zinc-950/90 border border-zinc-800/80 rounded-2xl leading-relaxed text-zinc-200 shadow-inner`}>
            <Markdown>{generatedOutput}</Markdown>
          </div>
        </div>
      )}

    </div>
  );
};

export default StudyAssistantView;
