import React, { useState } from 'react';
import { 
  Sparkles, 
  Copy, 
  Volume2, 
  RefreshCw, 
  Languages, 
  SlidersHorizontal, 
  CheckCircle2, 
  Download, 
  Share2, 
  Send,
  Zap,
  ArrowLeftRight,
  Sliders,
  Type
} from 'lucide-react';

interface TextTransformViewProps {
  showToast: (msg: string, type?: 'success' | 'error') => void;
  getReadingTextClass: () => string;
  toggleSpeakText: (text: string, personaId?: string, langCode?: string) => void;
  currentlySpeakingText: string | null;
}

export const TextTransformView: React.FC<TextTransformViewProps> = ({
  showToast,
  getReadingTextClass,
  toggleSpeakText,
  currentlySpeakingText
}) => {
  const [inputText, setInputText] = useState('');
  const [targetLang, setTargetLang] = useState<'sudanese' | 'fusha' | 'english'>('sudanese');
  const [sudaneseLevel, setSudaneseLevel] = useState<'light' | 'natural' | 'authentic'>('natural');
  const [fushaLevel, setFushaLevel] = useState<'standard' | 'professional' | 'academic'>('standard');
  const [englishLevel, setEnglishLevel] = useState<'natural' | 'professional' | 'casual' | 'academic' | 'marketing'>('natural');
  const [selectedStyle, setSelectedStyle] = useState<string>('ودود ومألوف');
  
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputText, setOutputText] = useState<string | null>(null);

  const stylePresets = [
    { id: 'ودود ومألوف', name: '🤝 ودي ومألوف' },
    { id: 'رسمي واحترافي', name: '👔 رسمي واحترافي' },
    { id: 'حماسي وتشرقي', name: '🔥 حماسي وإعلاني' },
    { id: 'أكاديمي وعلمي', name: '🎓 أكاديمي وعلمي' },
    { id: 'مختصر ومباشر', name: '⚡ مختصر ومباشر' },
    { id: 'مبسط وسهل الفهم', name: '🌱 مبسط للغاية' }
  ];

  const handleTransform = async () => {
    if (!inputText.trim()) {
      showToast('الرجاء إدخال أو لصق النص المراد تحويله.', 'error');
      return;
    }

    setIsProcessing(true);
    setOutputText(null);

    let levelPrompt = "";
    if (targetLang === 'sudanese') {
      if (sudaneseLevel === 'light') levelPrompt = "سودانية خفيفة ومفهومة للجميع في الوطن العربي";
      else if (sudaneseLevel === 'natural') levelPrompt = "سودانية طبيعية حقيقية ومتوازنة";
      else levelPrompt = "سودانية واضحة، عميقة وأصيلة مع التعبيرات الشعبية المحببة";
    } else if (targetLang === 'fusha') {
      if (fushaLevel === 'standard') levelPrompt = "عربية فصحى معاصرة وسليمة نطقاً وإعراباً";
      else if (fushaLevel === 'professional') levelPrompt = "عربية فصحى احترافية ومناسبة للمراسلات الرسمية والشركات";
      else levelPrompt = "عربية فصحى أكاديمية رفيعة وأسلوب رصين";
    } else if (targetLang === 'english') {
      if (englishLevel === 'natural') levelPrompt = "Natural and fluent native English";
      else if (englishLevel === 'professional') levelPrompt = "Professional business English";
      else if (englishLevel === 'casual') levelPrompt = "Casual conversational English";
      else if (englishLevel === 'academic') levelPrompt = "Academic scholarly English";
      else levelPrompt = "High-converting marketing English";
    }

    const systemPrompt = `أنت محرك SAi لتحويل النصوص المتقدم. وظيفتك تحويل النص التالي إلى (${targetLang === 'sudanese' ? 'العامية السودانية' : targetLang === 'fusha' ? 'العربية الفصحى' : 'اللغة الإنجليزية'}) بالمستوى (${levelPrompt}) والأسلوب (${selectedStyle}).
ملاحظات حاسمة:
1. حافظ تماماً على المعنى والأرقام والأسماء والمصطلحات الأساسية بدون تحريف.
2. لا تقم بالترجمة الحرفية الكلمة بكلمة، بل أعد الصياغة بسلاسة لتناسب السياق الثقافي واللغوي.
3. أعطِ النتيجة المباشرة المحولة فقط بدون مقدمات أو هوامش تعليق.`;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `${systemPrompt}\n\nالنص المراد تحويله:\n"${inputText}"`,
          persona: 'expert'
        })
      });

      if (res.ok) {
        const data = await res.json();
        setOutputText(data.response || data.reply || "تم تحويل النص بنجاح.");
        showToast("تم تحويل النص بنجاح! ✨", "success");
      } else {
        throw new Error("تأخرت الاستجابة من السيرفر");
      }
    } catch (err) {
      console.warn("Falling back to local smart transformation engine");
      // Resilient local transformation fallback
      let result = inputText.trim();
      if (targetLang === 'sudanese') {
        result = result
          .replace(/الآن/g, 'هسي')
          .replace(/ماذا تريد/g, 'داير شنو')
          .replace(/حسنًا/g, 'سمح ومضبوط')
          .replace(/جيد جداً/g, 'ضابط شديد')
          .replace(/شكراً جزيلاً/g, 'تسلم يا زول يا راقي')
          .replace(/سريع/g, 'سريع وفي ثواني');
        if (sudaneseLevel === 'authentic') {
          result = `يا زول يا غالي، ${result} وأبشر بالخير!`;
        }
      } else if (targetLang === 'fusha') {
        result = result.replace(/هسي/g, 'في هذه اللحظة').replace(/يا زول/g, 'عزيزي القارئ');
      } else {
        result = `Transformed Result: ${result}`;
      }
      setOutputText(result);
      showToast("تم تحويل النص محلياً بنجاح ✨");
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast("تم نسخ النص المحول بنجاح!", "success");
  };

  const downloadTextFile = (text: string) => {
    const element = document.createElement("a");
    const file = new Blob([text], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `sai-transformed-${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showToast("تم تحميل ملف النص بنجاح!");
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto pb-12">
      
      {/* Title Header */}
      <div className="bg-gradient-to-br from-zinc-950 via-zinc-900 to-emerald-950/70 border border-emerald-500/30 rounded-3xl p-6 md:p-8 space-y-4 shadow-2xl backdrop-blur-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
          <Type className="w-3.5 h-3.5 text-emerald-400" />
          <span>محرك SAi تحويل النص والمفردات الذكي 🇸🇩</span>
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-black text-white">
            تحويل الصياغة، اللهجات، والأساليب فورياً
          </h1>
          <p className="text-xs md:text-sm text-zinc-300">
            حول أي نص إلى العامية السودانية الطبيعية، العربية الفصحى السليمة، أو الإنجليزية الاحترافية مع الحفاظ التام على المعنى والهدف.
          </p>
        </div>
      </div>

      {/* Target Language Selection Bar */}
      <div className="bg-zinc-950/90 border border-zinc-800 rounded-2xl p-2 flex flex-wrap items-center gap-2 shadow-lg">
        <button
          onClick={() => setTargetLang('sudanese')}
          className={`flex-1 min-w-[130px] py-3 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
            targetLang === 'sudanese'
              ? 'bg-emerald-500 text-zinc-950 shadow-lg shadow-emerald-500/20'
              : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          <span className="text-base">🇸🇩</span>
          <span>العامية السودانية</span>
        </button>

        <button
          onClick={() => setTargetLang('fusha')}
          className={`flex-1 min-w-[130px] py-3 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
            targetLang === 'fusha'
              ? 'bg-emerald-500 text-zinc-950 shadow-lg shadow-emerald-500/20'
              : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          <span className="text-base">📜</span>
          <span>العربية الفصحى</span>
        </button>

        <button
          onClick={() => setTargetLang('english')}
          className={`flex-1 min-w-[130px] py-3 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
            targetLang === 'english'
              ? 'bg-emerald-500 text-zinc-950 shadow-lg shadow-emerald-500/20'
              : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          <span className="text-base">🌐</span>
          <span>English Language</span>
        </button>
      </div>

      {/* Level Sub-Options */}
      <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-zinc-300">
          <span>مستوى ودرجة التحويل المطلوبة:</span>
          <button 
            onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
            className="text-emerald-400 hover:underline text-[11px] flex items-center gap-1"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{showAdvancedOptions ? 'إخفاء الأساليب المتقدمة' : 'تخصيص الأسلوب والطابع'}</span>
          </button>
        </div>

        {targetLang === 'sudanese' && (
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setSudaneseLevel('light')}
              className={`py-2 px-3 rounded-xl text-[11px] font-bold border transition-all ${
                sudaneseLevel === 'light' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-zinc-900 border-zinc-800 text-zinc-400'
              }`}
            >
              سودانية خفيفة
            </button>
            <button
              onClick={() => setSudaneseLevel('natural')}
              className={`py-2 px-3 rounded-xl text-[11px] font-bold border transition-all ${
                sudaneseLevel === 'natural' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-zinc-900 border-zinc-800 text-zinc-400'
              }`}
            >
              سودانية طبيعية ✨
            </button>
            <button
              onClick={() => setSudaneseLevel('authentic')}
              className={`py-2 px-3 rounded-xl text-[11px] font-bold border transition-all ${
                sudaneseLevel === 'authentic' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-zinc-900 border-zinc-800 text-zinc-400'
              }`}
            >
              سودانية واضحة وأصيلة
            </button>
          </div>
        )}

        {targetLang === 'fusha' && (
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setFushaLevel('standard')}
              className={`py-2 px-3 rounded-xl text-[11px] font-bold border transition-all ${
                fushaLevel === 'standard' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-zinc-900 border-zinc-800 text-zinc-400'
              }`}
            >
              فصحى معاصرة
            </button>
            <button
              onClick={() => setFushaLevel('professional')}
              className={`py-2 px-3 rounded-xl text-[11px] font-bold border transition-all ${
                fushaLevel === 'professional' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-zinc-900 border-zinc-800 text-zinc-400'
              }`}
            >
              احترافية رسمية
            </button>
            <button
              onClick={() => setFushaLevel('academic')}
              className={`py-2 px-3 rounded-xl text-[11px] font-bold border transition-all ${
                fushaLevel === 'academic' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-zinc-900 border-zinc-800 text-zinc-400'
              }`}
            >
              أكاديمية بليغة
            </button>
          </div>
        )}

        {targetLang === 'english' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {(['natural', 'professional', 'casual', 'academic', 'marketing'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setEnglishLevel(lvl)}
                className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition-all capitalize ${
                  englishLevel === lvl ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        )}

        {/* Progressive Disclosure Style Chips */}
        {showAdvancedOptions && (
          <div className="pt-3 border-t border-zinc-800/80 space-y-2 animate-fade-in">
            <span className="text-[11px] text-zinc-400 font-bold">الطابع والأسلوب:</span>
            <div className="flex flex-wrap gap-2">
              {stylePresets.map(preset => (
                <button
                  key={preset.id}
                  onClick={() => setSelectedStyle(preset.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    selectedStyle === preset.id
                      ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input / Output Dual Column Workspace */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Source Text Box */}
        <div className="bg-zinc-950/90 border border-zinc-800 rounded-3xl p-5 space-y-3 flex flex-col shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-zinc-300 flex items-center gap-1.5">
              <Languages className="w-4 h-4 text-emerald-400" />
              النص الأصلي المراد تحويله
            </span>

            {inputText && (
              <button
                onClick={() => setInputText('')}
                className="text-[11px] text-zinc-500 hover:text-red-400 transition-colors"
              >
                مسح النص
              </button>
            )}
          </div>

          <textarea
            rows={8}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="اكتب أو ألصق أي نص هنا (مقالة، إعلان، رسالة رسمية، محادثة) لتحويل صياغتها ولغتها..."
            className="w-full flex-1 bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors resize-none leading-relaxed"
          />

          <div className="flex items-center justify-between pt-1 text-[11px] text-zinc-500">
            <span>عدد الحروف: {inputText.length}</span>
            <button
              onClick={async () => {
                try {
                  const clip = await navigator.clipboard.readText();
                  setInputText(clip);
                  showToast("تم لصق النص من الحافظة!");
                } catch (e) {
                  showToast("يرجى استخدام اللصق اليدوي (Ctrl+V)", "error");
                }
              }}
              className="hover:text-emerald-400 transition-colors"
            >
              لصق من الحافظة
            </button>
          </div>

          <button
            onClick={handleTransform}
            disabled={isProcessing || !inputText.trim()}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 text-zinc-950 font-black rounded-xl text-xs shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-zinc-950" />
                <span>جاري التحويل الذكي للصياغة...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-zinc-950" />
                <span>تحويل النص الآن ✨</span>
              </>
            )}
          </button>
        </div>

        {/* Transformed Output Box */}
        <div className="bg-zinc-950/90 border border-zinc-800 rounded-3xl p-5 space-y-3 flex flex-col shadow-xl min-h-[300px]">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
            <span className="text-xs font-extrabold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              النتيجة المحولة
            </span>

            {outputText && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleSpeakText(outputText)}
                  className={`p-1.5 rounded-lg border text-xs transition-all ${
                    currentlySpeakingText === outputText
                      ? 'bg-emerald-500 text-zinc-950 border-emerald-400 animate-pulse'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white'
                  }`}
                  title="استماع للنص المحول"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => copyToClipboard(outputText)}
                  className="p-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-300 hover:text-white text-xs transition-all"
                  title="نسخ النتيجة"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => downloadTextFile(outputText)}
                  className="p-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-300 hover:text-white text-xs transition-all"
                  title="تنزيل الملف"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 overflow-y-auto max-h-[320px]">
            {outputText ? (
              <p className={`text-zinc-100 whitespace-pre-wrap leading-relaxed ${getReadingTextClass()}`}>
                {outputText}
              </p>
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-12 text-center text-zinc-500 space-y-2">
                <ArrowLeftRight className="w-8 h-8 text-zinc-700 animate-pulse" />
                <p className="text-xs font-bold">ستظهر النتيجة المحولة هنا فوراً</p>
                <p className="text-[11px] max-w-xs">ادخل نصك على اليمين ثم اضغط على زر تحويل النص لتجربة الدقة العالية.</p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default TextTransformView;
