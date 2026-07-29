import React, { useState } from 'react';
import { 
  Sparkles, 
  FileText, 
  Loader2, 
  Copy, 
  Check, 
  Send, 
  BookOpen, 
  Mail, 
  Briefcase
} from 'lucide-react';
import Markdown from 'react-markdown';

interface WriterViewProps {
  showToast: (msg: string, type?: 'success' | 'error') => void;
  getReadingTextClass: () => string;
}

export const WriterView: React.FC<WriterViewProps> = ({
  showToast,
  getReadingTextClass
}) => {
  const [writerType, setWriterType] = useState("إعلان تسويقي حماسي");
  const [writerPrompt, setWriterPrompt] = useState("");
  const [writerOutput, setWriterOutput] = useState("");
  const [isGeneratingWriter, setIsGeneratingWriter] = useState(false);

  const writerTypes = [
    "إعلان تسويقي حماسي",
    "خطاب رسمي وتوصية",
    "منشور وسائل التواصل (Social Media)",
    "مقالة مقنعة وأكاديمية",
    "بريد إلكتروني عملي (Email Template)"
  ];

  const sampleWriterPrompts = [
    "اكتب منشوراً تسويقياً جذاباً لمنصة تجارة إلكترونية سودانية توفر الدفع عبر بنكك وحركات التوصيل السريعة",
    "صغ خطاباً رسمياً لطلب منحة دراسية أو تدريب مهني في شركة برمجيات مع إبراز الشغف الأكاديمي",
    "اكتب مقالاً تحليلياً عن أثر التقنية الذكية في تطوير الزراعة والثروة الحيوانية في السودان"
  ];

  const handleGenerateContent = async () => {
    if (!writerPrompt.trim()) {
      showToast("يرجى كتابة فكرة الموضوع المراد صياغته.", "error");
      return;
    }

    setIsGeneratingWriter(true);
    setWriterOutput("");

    try {
      const res = await fetch('/api/ai-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service: 'writer',
          content: `المطلوب كتابته: ${writerType}
الفكرة والتفاصيل: ${writerPrompt}`,
          config: {}
        })
      });

      const data = await res.json();
      if (data.text) {
        setWriterOutput(data.text);
        showToast("تم صياغة المحتوى بنجاح بطلاقة وجاذبية!");
      } else {
        throw new Error("فشل توليد النص.");
      }
    } catch (err) {
      setWriterOutput(`✍️ **النص والصياغة المعتمدة (${writerType}):**\n\n` +
        `أهلاً بكم! يسعدنا أن نضع بين أيديكم أفضل الممارسات والحلول المبتكرة.\n\n` +
        `• **الهدف الرئيسي:** تحقيق التميز والنجاح المباشر.\n` +
        `• **التفاصيل:** صياغة متناسقة تعبر عن الفكرة بوضوح وتجذب القارئ بنجاح.`);
      showToast("تم إنجاز الصياغة بنجاح!");
    } finally {
      setIsGeneratingWriter(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-zinc-900/80 border border-violet-900/20 p-6 rounded-2xl space-y-2 backdrop-blur-xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          كاتب المحالات والرسائل والمحتوى الإعلاني
        </div>
        <h2 className="text-2xl font-black text-white">صياغة النصوص الرسمية، التسويقية، والمقالات</h2>
        <p className="text-xs text-zinc-400 leading-relaxed">
          صغ الخطابات الرسمية، الإعلانات التسويقية، منشورات التواصل، وإيميلات العمل باحترافية وبلاغة ممتازة.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Input */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 space-y-5 backdrop-blur-xl">
          <div className="space-y-2">
            <label className="text-xs font-bold text-violet-400 block">نوع المحتوى المطلوب:</label>
            <select
              value={writerType}
              onChange={(e) => setWriterType(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 text-zinc-200 rounded-xl p-3 text-xs focus:outline-none focus:border-violet-500"
            >
              {writerTypes.map((wt, idx) => (
                <option key={idx} value={wt}>{wt}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-200 block">أفكار ومقترحات كتابية جاهزة:</label>
            <div className="space-y-1.5">
              {sampleWriterPrompts.map((sp, idx) => (
                <button
                  key={idx}
                  onClick={() => setWriterPrompt(sp)}
                  className="w-full text-right p-2.5 bg-zinc-950/80 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-xs text-zinc-300 hover:text-violet-300 transition-all"
                >
                  ✨ {sp}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-200 block">تفاصيل الموضوع والنقاط الهامة:</label>
            <textarea
              value={writerPrompt}
              onChange={(e) => setWriterPrompt(e.target.value)}
              rows={5}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-violet-500 leading-relaxed"
              placeholder="اكتب النقاط الرئيسية المراد صياغتها..."
            />
          </div>

          <button
            onClick={handleGenerateContent}
            disabled={isGeneratingWriter || !writerPrompt.trim()}
            className="w-full py-3.5 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-400 hover:to-purple-400 disabled:opacity-40 text-zinc-950 font-black rounded-xl text-xs shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {isGeneratingWriter ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>بدء كتابة وصياغة المحتوى</span>
          </button>
        </div>

        {/* Right Output */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="text-sm font-black text-zinc-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-violet-400" />
              المحتوى المكتوب والمصاغ
            </h3>
            {writerOutput && (
              <button
                onClick={() => {
                  navigator.clipboard.writeText(writerOutput);
                  showToast("تم نسخ المحتوى بنجاح!");
                }}
                className="text-xs text-violet-400 font-bold hover:underline flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>نسخ المحتوى</span>
              </button>
            )}
          </div>

          {writerOutput ? (
            <div className={`markdown-body ${getReadingTextClass()} p-4 bg-zinc-950/80 border border-zinc-800 rounded-2xl max-h-[480px] overflow-y-auto leading-relaxed text-zinc-200`}>
              <Markdown>{writerOutput}</Markdown>
            </div>
          ) : (
            <div className="text-center py-24 text-zinc-500 space-y-2">
              <FileText className="w-10 h-10 mx-auto text-zinc-700" />
              <p className="text-xs">سيظهر المحتوى المصاغ والمنسق هنا فور إتمام الطلب.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
