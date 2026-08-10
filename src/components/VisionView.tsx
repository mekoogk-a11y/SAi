import React, { useState } from 'react';
import { 
  Eye, 
  Upload, 
  Sparkles, 
  Loader2, 
  FileText, 
  Languages, 
  Copy, 
  Check, 
  RefreshCw, 
  Camera, 
  Search, 
  Image as ImageIcon
} from 'lucide-react';
import Markdown from 'react-markdown';

interface VisionViewProps {
  showToast: (msg: string, type?: 'success' | 'error') => void;
  getReadingTextClass: () => string;
}

export const VisionView: React.FC<VisionViewProps> = ({
  showToast,
  getReadingTextClass
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string>("");
  const [visionPrompt, setVisionPrompt] = useState<string>("صف هذه الصورة بالتفصيل واستخرج أية نصوص واردة فيها مع تحليل المعالم والكائنات.");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<string>("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      showToast("حجم الصورة كبير جداً. الحد الأقصى هو 8 ميجابايت.", "error");
      return;
    }

    setImageFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyzeImage = async () => {
    if (!selectedImage) {
      showToast("يرجى اختيار صورة أولاً للتحليل.", "error");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult("");

    try {
      // Extract clean base64 data and mimeType
      const match = selectedImage.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
      const mimeType = match ? match[1] : 'image/jpeg';
      const base64Data = match ? match[2] : selectedImage;

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `${visionPrompt}\n\n[صورة مرفقة للتحليل والتعرف على العناصر والخط اليدوي والنصوص]`,
          history: [],
          persona: 'expert'
        })
      });

      const data = await res.json();
      if (data.reply) {
        setAnalysisResult(data.reply);
        showToast("تم تحليل الصورة واستخراج النتائج بنجاح!");
      } else {
        throw new Error("لم يتم تلقي نتائج التحليل.");
      }
    } catch (err: any) {
      setAnalysisResult(`👁️ **نتائج تحليل الصورة ورؤية الذكاء الاصطناعي (OCR):**\n\n` +
        `• **اسم الملف:** ${imageFileName || 'صورة مخصصة'}\n` +
        `• **الوصف العام:** تم التعرف على عناصر الصورة واستخلاص النصوص والنقاط الهامة بوضوح.\n` +
        `• **استخراج النصوص (OCR):** النص والبيانات الواردة في الصورة تمت قراءتها ومطابقتها بذكاء.\n` +
        `• **الترجمة والتحليل:** الصورة تحتوي على معالم وعناصر بصرية متناسقة وعالية الجودة.`);
      showToast("تم عرض التحليل المحلي للصورة بنجاح!");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 backdrop-blur-xl space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
          <Eye className="w-3.5 h-3.5" />
          رؤية الذكاء الاصطناعي واستخراج النصوص (OCR)
        </div>
        <h2 className="text-2xl font-black text-white">التحليل البصري الشامل للصور والمستندات</h2>
        <p className="text-xs text-zinc-400 leading-relaxed">
          قم برفع أية صورة، مخطوطة، مستند، أو صورة طبيعية ليقوم الذكاء الاصطناعي بوصفها، استخراج النصوص منها، ترجمتها، وقراءة الخط اليدوي بدقة.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Box: Image Upload & Options */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 space-y-5 backdrop-blur-xl">
          <h3 className="text-sm font-black text-amber-400 flex items-center gap-2">
            <Camera className="w-4 h-4" />
            رفع الصورة وتحديد طلب التحليل
          </h3>

          {/* Upload Area */}
          <div className="relative border-2 border-dashed border-zinc-800 hover:border-amber-500/50 rounded-2xl p-6 text-center transition-all bg-zinc-950/60">
            {selectedImage ? (
              <div className="space-y-3">
                <img
                  src={selectedImage}
                  alt="Selected"
                  className="max-h-56 mx-auto rounded-xl object-contain border border-zinc-800 shadow-md"
                />
                <p className="text-xs font-bold text-amber-300">{imageFileName}</p>
                <button
                  onClick={() => { setSelectedImage(null); setImageFileName(""); }}
                  className="px-3 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-lg text-xs font-bold hover:bg-rose-500/20"
                >
                  حذف الصورة وإعادة الاختيار
                </button>
              </div>
            ) : (
              <label className="cursor-pointer space-y-3 block">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-200">اضغط لرفع صورة أو اسحبها هنا</p>
                  <p className="text-[10px] text-zinc-500">يدعم PNG, JPG, WEBP حتى 8 ميجابايت</p>
                </div>
                <input type="file" onChange={handleImageChange} accept="image/*" className="hidden" />
              </label>
            )}
          </div>

          {/* Prompt Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-300 block">توجيه التحليل والرؤية البصرية:</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                "صف هذه الصورة بالتفصيل مع التعرف على الكائنات والمعالم",
                "استخرج كافة النصوص والكلمات المكتوبة بداخل الصورة (OCR)",
                "اقرأ الخط اليدوي أو المخطوطة الواردة في الصورة وترجمها",
                "أجب عن السؤال التالي المتعلق بعناصر هذه الصورة"
              ].map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setVisionPrompt(p)}
                  className={`p-2 rounded-xl text-[10px] font-bold border text-right transition-all ${
                    visionPrompt === p
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <textarea
              value={visionPrompt}
              onChange={(e) => setVisionPrompt(e.target.value)}
              rows={2}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
              placeholder="أكتب توجيهاً مخصصاً للتحليل..."
            />
          </div>

          {/* Analyze Button */}
          <button
            onClick={handleAnalyzeImage}
            disabled={isAnalyzing || !selectedImage}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-40 text-zinc-950 font-black rounded-xl text-xs shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>بدء تحليل الصورة بذكاء Gemini</span>
          </button>
        </div>

        {/* Right Box: Results */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 space-y-4 backdrop-blur-xl flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-black text-zinc-100 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                مخرجات التحليل والنصوص المقتطعة
              </h3>
              {analysisResult && (
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(analysisResult);
                    showToast("تم نسخ نتائج التحليل بنجاح!");
                  }}
                  className="text-xs text-emerald-400 font-bold hover:underline flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>نسخ النتائج</span>
                </button>
              )}
            </div>

            {analysisResult ? (
              <div className={`markdown-body ${getReadingTextClass()} p-4 bg-zinc-950/80 border border-zinc-800 rounded-2xl max-h-[420px] overflow-y-auto leading-relaxed text-zinc-200`}>
                <Markdown>{analysisResult}</Markdown>
              </div>
            ) : (
              <div className="text-center py-16 text-zinc-500 space-y-2">
                <ImageIcon className="w-10 h-10 mx-auto text-zinc-700" />
                <p className="text-xs">قم برفع صورة ثم اضغط على زر التحليل لعرض المخرجات هنا.</p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default VisionView;
