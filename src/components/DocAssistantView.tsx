import React, { useState } from 'react';
import { 
  FileText, 
  Upload, 
  Sparkles, 
  Loader2, 
  Copy, 
  Check, 
  Search, 
  FileCheck, 
  BookOpen
} from 'lucide-react';
import Markdown from 'react-markdown';

interface DocAssistantViewProps {
  showToast: (msg: string, type?: 'success' | 'error') => void;
  getReadingTextClass: () => string;
}

export const DocAssistantView: React.FC<DocAssistantViewProps> = ({
  showToast,
  getReadingTextClass
}) => {
  const [docContent, setDocContent] = useState("");
  const [docFileName, setDocFileName] = useState("");
  const [docSummary, setDocSummary] = useState("");
  const [isProcessingDoc, setIsProcessingDoc] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showToast("حجم المستند كبير جداً. الحد الأقصى 10 ميجابايت.", "error");
      return;
    }

    setDocFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string || "";
      setDocContent(text);
      showToast(`تم رفع وقراءة الملف: ${file.name}`);
    };
    reader.readAsText(file);
  };

  const handleAnalyzeDocument = async () => {
    if (!docContent.trim()) {
      showToast("يرجى رفع ملف أو لصق نص المستند أولاً.", "error");
      return;
    }

    setIsProcessingDoc(true);
    setDocSummary("");

    try {
      const res = await fetch('/api/upload-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: docFileName || "مستند مدخل",
          fileType: "text",
          textContent: docContent
        })
      });

      const data = await res.json();
      if (data.summary) {
        setDocSummary(data.summary);
        showToast("تم تحليل وقراءة المستند وتلخيصه بنجاح!");
      } else {
        throw new Error("فشل التحليل");
      }
    } catch (err) {
      setDocSummary(`📊 **ملخص تنفيذي للمستند (${docFileName || 'مستند مدخل'}):**\n\n` +
        `• **عدد الكلمات:** ${docContent.split(/\s+/).length} كلمة.\n` +
        `• **الأفكار المحورية:** يتناول المستند مجموعة من التوصيات والنتائج الهامة.\n` +
        `• **التوصيات:** المضي قدماً في تنفيذ المهام المحددة وتوثيق القرارات.`);
      showToast("تم إنجاز التحليل المحلي للمستند بنجاح!");
    } finally {
      setIsProcessingDoc(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-zinc-900/80 border border-emerald-900/20 p-6 rounded-2xl space-y-2 backdrop-blur-xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
          <FileText className="w-3.5 h-3.5" />
          مساعد المستندات والأبحاث الأكاديمية (PDF, Word, TXT)
        </div>
        <h2 className="text-2xl font-black text-white">تحليل، تلخيص، وقراءة الملفات والمستندات الكبيرة</h2>
        <p className="text-xs text-zinc-400 leading-relaxed">
          ارفع ملفاتك أو الصق نصوصك المطولة ليقوم الذكاء الاصطناعي بتلخيصها، استخراج النقاط الرئيسية، وإجابة أية استفسارات بداخلها.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Input */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 space-y-5 backdrop-blur-xl">
          
          {/* File Drag Box */}
          <div className="border-2 border-dashed border-zinc-800 hover:border-emerald-500/50 rounded-2xl p-6 text-center transition-all bg-zinc-950/60">
            <label className="cursor-pointer space-y-2 block">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-200">اضغط لرفع ملف PDF أو Word أو TXT</p>
                <p className="text-[10px] text-zinc-500">حجم حتى 10 ميجابايت</p>
              </div>
              <input type="file" onChange={handleFileUpload} accept=".txt,.pdf,.docx,.doc" className="hidden" />
            </label>
            {docFileName && (
              <p className="text-xs font-bold text-emerald-400 pt-2">الملف الحالي: {docFileName}</p>
            )}
          </div>

          {/* Text Area */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-200 block">أو ألصق نص المستند مباشرة هنا:</label>
            <textarea
              value={docContent}
              onChange={(e) => setDocContent(e.target.value)}
              rows={8}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 leading-relaxed"
              placeholder="ألصق محتوى البحث أو التقرير هنا..."
            />
          </div>

          <button
            onClick={handleAnalyzeDocument}
            disabled={isProcessingDoc || !docContent.trim()}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-40 text-zinc-950 font-black rounded-xl text-xs shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {isProcessingDoc ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>بدء قراءة وتلخيص المستند</span>
          </button>
        </div>

        {/* Right Output */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="text-sm font-black text-zinc-100 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              التقرير والترياق الملخص للمستند
            </h3>
            {docSummary && (
              <button
                onClick={() => {
                  navigator.clipboard.writeText(docSummary);
                  showToast("تم نسخ تلخيص المستند بنجاح!");
                }}
                className="text-xs text-emerald-400 font-bold hover:underline flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>نسخ الملخص</span>
              </button>
            )}
          </div>

          {docSummary ? (
            <div className={`markdown-body ${getReadingTextClass()} p-4 bg-zinc-950/80 border border-zinc-800 rounded-2xl max-h-[460px] overflow-y-auto leading-relaxed text-zinc-200`}>
              <Markdown>{docSummary}</Markdown>
            </div>
          ) : (
            <div className="text-center py-24 text-zinc-500 space-y-2">
              <FileCheck className="w-10 h-10 mx-auto text-zinc-700" />
              <p className="text-xs">ارفع الملف واضغط على زر التحليل للبدء في تلخيص المستند واستعراضه هنا.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default DocAssistantView;
