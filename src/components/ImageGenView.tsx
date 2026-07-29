import React, { useState } from 'react';
import { 
  Image as ImageIcon, 
  Sparkles, 
  Loader2, 
  Download, 
  Share2, 
  RefreshCw, 
  Copy, 
  Heart, 
  Maximize2, 
  Grid, 
  Palette,
  Check,
  X,
  Plus,
  Wand2,
  Sliders,
  Clock,
  Layers,
  ArrowRight,
  Eye
} from 'lucide-react';

interface ImageGenViewProps {
  imagePrompt: string;
  setImagePrompt: (p: string) => void;
  selectedAspect: string;
  setSelectedAspect: (a: string) => void;
  generatedImage: string | null;
  setGeneratedImage: (img: string | null) => void;
  isGeneratingImage: boolean;
  setIsGeneratingImage: (g: boolean) => void;
  imageError: string | null;
  setImageError: (e: string | null) => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

interface ImageHistoryItem {
  id: string;
  image: string;
  prompt: string;
  aspectRatio: string;
  style: string;
  createdAt: string;
}

export const ImageGenView: React.FC<ImageGenViewProps> = ({
  imagePrompt,
  setImagePrompt,
  selectedAspect,
  setSelectedAspect,
  generatedImage,
  setGeneratedImage,
  isGeneratingImage,
  setIsGeneratingImage,
  imageError,
  setImageError,
  showToast
}) => {
  const [selectedStyle, setSelectedStyle] = useState<string>("واقعي سينمائي (Photorealistic)");
  const [activeTab, setActiveTab] = useState<'create' | 'result'>('create');
  const [imageHistory, setImageHistory] = useState<ImageHistoryItem[]>([]);
  const [fullscreenPreview, setFullscreenPreview] = useState<string | null>(null);

  const stylePresets = [
    { name: "واقعي سينمائي (Photorealistic)", promptSuffix: ", 8k resolution, ultra-realistic high-end photorealistic photography, dramatic cinematic lighting, award-winning commercial shot" },
    { name: "تراث وثقافة سودانية (Sudanese Heritage)", promptSuffix: ", rich vibrant Sudanese traditional colors, authentic cultural motifs, golden sunset lighting, majestic Nile backdrop" },
    { name: "تصميم 3D ثلاثي الأبعاد (3D Render)", promptSuffix: ", 3d digital artwork, blender render, smooth textures, studio light reflections, octan render 8k" },
    { name: "أنمي ورسوم يابانية (Anime)", promptSuffix: ", vibrant anime artstyle, Makoto Shinkai aesthetic, atmospheric sky, clean linework, beautiful digital painting" },
    { name: "سايبربانك ومستقبلي (Cyberpunk)", promptSuffix: ", futuristic neon lighting, cyan and purple glow, dark sci-fi city atmosphere, metallic reflections" },
    { name: "لوحة زينية بالألوان المائية (Watercolor)", promptSuffix: ", soft watercolor painting, elegant fluid color splashes, expressive strokes, artistic canvas texture" }
  ];

  const aspectRatios = [
    { label: "1:1 مربع", value: "1:1" },
    { label: "16:9 شاشة عريضة", value: "16:9" },
    { label: "9:16 ستوري هاتف", value: "9:16" },
    { label: "4:3 بوستر", value: "4:3" }
  ];

  const samplePrompts = [
    "بنر إعلاني فاخر لعطر سوداني أصيل مع لمسات ذهبية وزجاجة بلورية على خلفية نيلية هادئة",
    "صورة فوتوغرافية سينمائية لجمال الطبيعة في مقرن النيلين بالخرطوم وقت الغروب",
    "تصميم 3D حديث لتطبيق هاتف ذكي يعبر عن الخدمات المالية والتحويلات السريعة في السودان",
    "لوحة فنية رقمية لبخور سوداني يتصاعد منه الدخان الفاخر مع أواني نحاسية أثرية",
    "بوستر إعلاني جذاب لقهوة سودانية (جبنة) ساخنة مع حبوب البن الذهبية وأجواء دافئة"
  ];

  // Core Generate Handler
  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) {
      showToast("يرجى كتابة وصف الصورة أولاً.", "error");
      return;
    }

    setIsGeneratingImage(true);
    setImageError(null);

    const styleObj = stylePresets.find(s => s.name === selectedStyle);
    const fullPrompt = imagePrompt + (styleObj ? styleObj.promptSuffix : "");

    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: fullPrompt,
          aspectRatio: selectedAspect
        })
      });

      const data = await res.json();
      if (data.image) {
        const imageSrc = data.image.startsWith('data:') ? data.image : `data:image/jpeg;base64,${data.image}`;
        setGeneratedImage(imageSrc);
        
        // Push to session history
        const newItem: ImageHistoryItem = {
          id: Date.now().toString(),
          image: imageSrc,
          prompt: imagePrompt,
          aspectRatio: selectedAspect,
          style: selectedStyle,
          createdAt: new Date().toLocaleTimeString('ar-SD', { hour: '2-digit', minute: '2-digit' })
        };
        setImageHistory(prev => [newItem, ...prev]);

        // Automatically switch to result screen without leaving Image Generator module
        setActiveTab('result');
        showToast("تم توليد الصورة بنجاح بفرشاة الذكاء الاصطناعي! 🎨✨");
      } else {
        throw new Error(data.error || "فشل توليد الصورة");
      }
    } catch (err: any) {
      setImageError(err.message || "حدث خطأ أثناء توليد الصورة.");
      showToast("تعذر توليد الصورة حالياً.", "error");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // 💾 Button 1: Save Image
  const handleSaveImage = () => {
    if (!generatedImage) return;
    try {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `sawt-sudan-ai-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast("تم تحميل وتنزيل الصورة بنجاح في جهازك! 💾");
    } catch (err) {
      showToast("حدث خطأ أثناء تنزيل الصورة.", "error");
    }
  };

  // 🔗 Button 2: Share Image
  const handleShareImage = async () => {
    if (!generatedImage) return;
    try {
      if (navigator.share) {
        const response = await fetch(generatedImage);
        const blob = await response.blob();
        const file = new File([blob], 'sawt-sudan-ai-image.png', { type: blob.type || 'image/png' });
        
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'صورة بذكاء صوت السودان الاصطناعي',
            text: `تم توليد هذه الصورة بواسطة منصة صوت السودان للذكاء الاصطناعي:\n"${imagePrompt}"`,
            files: [file]
          });
          showToast("تمت مشاركة الصورة بنجاح! 🚀");
          return;
        }
      }

      // Fallback: Copy description & prompt to clipboard
      await navigator.clipboard.writeText(`صورة مولدة بذكاء صوت السودان الاصطناعي 🇸🇩✨\nالوصف: "${imagePrompt}"`);
      showToast("تم نسخ وصف الصورة وبياناتها للحافظة لمشاركتها! 🔗");
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        await navigator.clipboard.writeText(`صورة مولدة بذكاء صوت السودان الاصطناعي:\n${imagePrompt}`);
        showToast("تم نسخ بيانات الصورة للمشاركة! 🔗");
      }
    }
  };

  // 🔄 Button 3: Generate Again
  const handleGenerateAgain = () => {
    handleGenerateImage();
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto pb-12">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-purple-950/40 border border-purple-500/30 p-6 rounded-3xl space-y-3 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center md:text-right">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-bold">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>استوديو توليد الصور المستقل (Gemini Image Studio)</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white">استوديو توليد الصور والتصاميم</h2>
          <p className="text-xs text-zinc-300 leading-relaxed max-w-2xl">
            وحدة مستقلة مخصصة لإنشاء وتحويل أفكارك النصية إلى تصاميم وبنرات إعلانية مبهرة بفرشاة الذكاء الاصطناعي.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 p-1 bg-zinc-950 border border-zinc-800 rounded-2xl shrink-0">
          <button
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
              activeTab === 'create'
                ? 'bg-purple-500 text-zinc-950 shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>لوحة الإنشاء والوصف</span>
          </button>

          <button
            onClick={() => {
              if (!generatedImage) {
                showToast("قم بتوليد صورة أولاً لعرض النتيجة.", "error");
                return;
              }
              setActiveTab('result');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
              activeTab === 'result'
                ? 'bg-purple-500 text-zinc-950 shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>شاشة النتيجة {generatedImage && '✨'}</span>
          </button>
        </div>
      </div>

      {/* Main Studio Body */}
      {activeTab === 'create' ? (
        /* CREATE / INPUT INTERFACE */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Controls - 7 Cols */}
          <div className="lg:col-span-7 bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 space-y-5 backdrop-blur-xl shadow-xl">
            
            {/* Prompt Input Area */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-zinc-200 flex items-center gap-1.5">
                  <Wand2 className="w-4 h-4 text-purple-400" />
                  <span>الوصف النصي للصورة المطلوبة:</span>
                </label>
                <span className="text-[10px] text-zinc-500">ادعم العربية والإنجليزية</span>
              </div>
              <textarea
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                rows={4}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="اكتب وصف الصورة بالتفصيل هنا (مثال: بنر إعلاني فاخر لعطر سوداني بلمسات ذهبية ومظهر سينمائي)..."
              />
            </div>

            {/* Quick Inspiration Prompts */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-purple-400 block">أفكار ونماذج وصف جاهزة للاختيار السريع:</label>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {samplePrompts.map((sp, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setImagePrompt(sp);
                      showToast("تم اختيار الوصف المقترح!");
                    }}
                    className="w-full text-right p-2.5 bg-zinc-950/80 hover:bg-zinc-800 border border-zinc-800/80 rounded-xl text-xs text-zinc-300 hover:text-purple-300 transition-all flex items-center justify-between group"
                  >
                    <span className="truncate">✨ {sp}</span>
                    <Plus className="w-3.5 h-3.5 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mr-2" />
                  </button>
                ))}
              </div>
            </div>

            {/* Style Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-200 block">الأسلوب والنمط الفني (Style Preset):</label>
              <select
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 text-zinc-200 rounded-xl p-3 text-xs focus:outline-none focus:border-purple-500"
              >
                {stylePresets.map((s, idx) => (
                  <option key={idx} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>

            {/* Aspect Ratio Buttons */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-200 block">أبعاد قياس الصورة (Aspect Ratio):</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {aspectRatios.map((ar) => (
                  <button
                    key={ar.value}
                    onClick={() => setSelectedAspect(ar.value)}
                    className={`p-3 rounded-xl text-xs font-bold border transition-all text-center ${
                      selectedAspect === ar.value
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/50 shadow-sm'
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                    }`}
                  >
                    {ar.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {imageError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300">
                {imageError}
              </div>
            )}

            {/* Main Action Trigger */}
            <button
              onClick={handleGenerateImage}
              disabled={isGeneratingImage || !imagePrompt.trim()}
              className="w-full py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 hover:from-purple-400 hover:to-pink-400 disabled:opacity-40 text-zinc-950 font-black rounded-2xl text-sm shadow-xl transition-all flex items-center justify-center gap-2"
            >
              {isGeneratingImage ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>جاري رسم وتصوير لوحتك بأعلى دقة...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>توليد الصورة الآن بالذكاء الاصطناعي</span>
                </>
              )}
            </button>

          </div>

          {/* Right Side Preview & History - 5 Cols */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Live Preview Box */}
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 backdrop-blur-xl space-y-4 shadow-xl">
              <h3 className="text-xs font-black text-zinc-200 flex items-center justify-between border-b border-zinc-800 pb-3">
                <span>معاينة النتيجة الحالية</span>
                {generatedImage && (
                  <button
                    onClick={() => setActiveTab('result')}
                    className="text-[11px] text-purple-400 font-bold hover:underline flex items-center gap-1"
                  >
                    <span>فتح الشاشة المخصصة ←</span>
                  </button>
                )}
              </h3>

              {isGeneratingImage ? (
                <div className="py-20 text-center space-y-4">
                  <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto" />
                  <p className="text-xs text-zinc-400 font-bold animate-pulse">
                    جاري معالجة وتوليد الصورة بذكاء Gemini...
                  </p>
                </div>
              ) : generatedImage ? (
                <div className="space-y-3 animate-fade-in">
                  <div className="relative group overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
                    <img
                      src={generatedImage}
                      alt="AI Result"
                      className="w-full object-contain max-h-[300px] mx-auto"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button
                        onClick={() => setActiveTab('result')}
                        className="px-4 py-2 bg-purple-500 text-zinc-950 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-lg"
                      >
                        <Eye className="w-4 h-4" />
                        <span>عرض النتيجة المكبرة</span>
                      </button>
                    </div>
                  </div>

                  {/* Quick Action Bar on preview */}
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    <button
                      onClick={handleSaveImage}
                      className="p-2.5 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-xs font-bold text-zinc-200 transition-all flex items-center justify-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5 text-purple-400" />
                      <span>حفظ</span>
                    </button>
                    <button
                      onClick={handleShareImage}
                      className="p-2.5 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-xs font-bold text-zinc-200 transition-all flex items-center justify-center gap-1"
                    >
                      <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>مشاركة</span>
                    </button>
                    <button
                      onClick={handleGenerateAgain}
                      className="p-2.5 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-xs font-bold text-zinc-200 transition-all flex items-center justify-center gap-1"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                      <span>إعادة</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-20 text-center space-y-3 text-zinc-500">
                  <ImageIcon className="w-12 h-12 mx-auto text-zinc-700" />
                  <p className="text-xs">ادخل الوصف واضغط "توليد الصورة" لتظهر هنا فور الانتهاء.</p>
                </div>
              )}
            </div>

            {/* Session History Gallery */}
            {imageHistory.length > 0 && (
              <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-5 backdrop-blur-xl space-y-3">
                <h4 className="text-xs font-black text-zinc-300 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-purple-400" />
                  <span>معرض صور الجلسة الحالية ({imageHistory.length})</span>
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {imageHistory.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setGeneratedImage(item.image);
                        setImagePrompt(item.prompt);
                        setActiveTab('result');
                      }}
                      className="group relative rounded-xl overflow-hidden border border-zinc-800 aspect-square bg-zinc-950 hover:border-purple-500 transition-all"
                    >
                      <img src={item.image} alt={item.prompt} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Eye className="w-4 h-4 text-white" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      ) : (
        /* RESULT SCREEN INTERFACE (REQUIREMENT MET) */
        <div className="bg-zinc-900/90 border border-purple-500/30 rounded-3xl p-6 md:p-8 space-y-6 backdrop-blur-xl shadow-2xl animate-fade-in">
          
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
              <h3 className="text-lg font-black text-white">شاشة عرض النتيجة والصورة المولدة</h3>
            </div>
            
            <button
              onClick={() => setActiveTab('create')}
              className="px-4 py-2 bg-zinc-950 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <ArrowRight className="w-4 h-4" />
              <span>العودة للوحة الإنشاء والتعديل</span>
            </button>
          </div>

          {/* Main Image Display Box */}
          <div className="relative group max-w-2xl mx-auto rounded-3xl overflow-hidden border-2 border-purple-500/40 bg-zinc-950 shadow-2xl">
            {generatedImage ? (
              <img
                src={generatedImage}
                alt="Generated AI Masterpiece"
                className="w-full h-auto max-h-[500px] object-contain mx-auto"
              />
            ) : (
              <div className="py-24 text-center text-zinc-500">لا توجد صورة مولدة حالياً</div>
            )}

            {/* Fullscreen Trigger */}
            {generatedImage && (
              <button
                onClick={() => setFullscreenPreview(generatedImage)}
                className="absolute top-4 left-4 p-2.5 bg-black/70 hover:bg-black text-white rounded-2xl border border-white/20 transition-all backdrop-blur-md"
                title="عرض ملء الشاشة"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Image Details Card */}
          <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-4 max-w-2xl mx-auto space-y-2">
            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">الوصف المستخدم في التوليد:</span>
            <p className="text-xs text-zinc-200 font-medium leading-relaxed">"{imagePrompt}"</p>
            <div className="flex items-center gap-3 pt-2 text-[10px] text-zinc-400 border-t border-zinc-800/80">
              <span>الأبعاد: <strong className="text-zinc-200">{selectedAspect}</strong></span>
              <span>النمط: <strong className="text-zinc-200">{selectedStyle}</strong></span>
            </div>
          </div>

          {/* REQUIRED RESULT BUTTONS TOOLBAR */}
          <div className="flex flex-wrap items-center justify-center gap-3 max-w-2xl mx-auto pt-2">
            
            {/* 💾 Button 1: Save Image */}
            <button
              onClick={handleSaveImage}
              className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-black rounded-2xl text-xs shadow-xl transition-all flex items-center gap-2 shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>💾 حفظ الصورة (Save)</span>
            </button>

            {/* 🔗 Button 2: Share Image */}
            <button
              onClick={handleShareImage}
              className="px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-zinc-950 font-black rounded-2xl text-xs shadow-xl transition-all flex items-center gap-2 shrink-0"
            >
              <Share2 className="w-4 h-4" />
              <span>🔗 مشاركة الصورة (Share)</span>
            </button>

            {/* 🔄 Button 3: Generate Again */}
            <button
              onClick={handleGenerateAgain}
              disabled={isGeneratingImage}
              className="px-6 py-3.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 disabled:opacity-40 text-zinc-950 font-black rounded-2xl text-xs shadow-xl transition-all flex items-center gap-2 shrink-0"
            >
              {isGeneratingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              <span>🔄 توليد مرة أخرى (Generate Again)</span>
            </button>

          </div>

        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {fullscreenPreview && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center justify-center space-y-4">
            <button
              onClick={() => setFullscreenPreview(null)}
              className="absolute -top-12 left-0 p-2 text-zinc-400 hover:text-white bg-zinc-900 rounded-full border border-zinc-800"
            >
              <X className="w-6 h-6" />
            </button>
            <img src={fullscreenPreview} alt="Fullscreen Preview" className="max-w-full max-h-[80vh] object-contain rounded-3xl border border-zinc-800 shadow-2xl" />
            <div className="flex items-center gap-3">
              <button onClick={handleSaveImage} className="px-5 py-2.5 bg-emerald-500 text-zinc-950 font-black rounded-xl text-xs">تحميل الصورة</button>
              <button onClick={() => setFullscreenPreview(null)} className="px-5 py-2.5 bg-zinc-800 text-white font-black rounded-xl text-xs">إغلاق</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
