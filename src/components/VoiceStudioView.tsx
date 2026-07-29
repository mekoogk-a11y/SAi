import React, { useState, useRef } from 'react';
import { 
  Play, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Download, 
  Loader2, 
  RefreshCw, 
  Mic2, 
  Copy, 
  Heart, 
  Check, 
  Plus, 
  History,
  Sliders
} from 'lucide-react';

interface VoiceStudioViewProps {
  PRESETS: any[];
  VOICES: any[];
  TONES: any[];
  text: string;
  setText: (t: string) => void;
  selectedVoice: string;
  setSelectedVoice: (v: string) => void;
  selectedTone: string;
  setSelectedTone: (t: string) => void;
  isGenerating: boolean;
  setIsGenerating: (g: boolean) => void;
  isOptimizing: boolean;
  setIsOptimizing: (o: boolean) => void;
  audioUrl: string | null;
  setAudioUrl: (url: string | null) => void;
  isPlaying: boolean;
  setIsPlaying: (p: boolean) => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  showToast: (msg: string, type?: 'success' | 'error') => void;
  voiceHistory: any[];
  setVoiceHistory: React.Dispatch<React.SetStateAction<any[]>>;
  isVoiceFallbackActive: boolean;
  setIsVoiceFallbackActive: (val: boolean) => void;
}

export const VoiceStudioView: React.FC<VoiceStudioViewProps> = ({
  PRESETS,
  VOICES,
  TONES,
  text,
  setText,
  selectedVoice,
  setSelectedVoice,
  selectedTone,
  setSelectedTone,
  isGenerating,
  setIsGenerating,
  isOptimizing,
  setIsOptimizing,
  audioUrl,
  setAudioUrl,
  isPlaying,
  setIsPlaying,
  audioRef,
  showToast,
  voiceHistory,
  setVoiceHistory,
  isVoiceFallbackActive,
  setIsVoiceFallbackActive
}) => {
  const [speechSpeed, setSpeechSpeed] = useState<number>(1.0);

  // Generate Audio via Server API or SpeechSynthesis Fallback
  const handleGenerateVoice = async () => {
    if (!text.trim()) {
      showToast("يرجى كتابة نص إعلاني أولاً للتوليد.", "error");
      return;
    }

    setIsGenerating(true);
    setAudioUrl(null);

    try {
      const res = await fetch('/api/generate-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voiceName: selectedVoice,
          tone: selectedTone
        })
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setIsVoiceFallbackActive(false);
        showToast("تم توليد الصوت الإعلاني بنجاح عبر خادم Gemini!");
        
        // Add to history
        const newHist = {
          id: Date.now().toString(),
          text,
          voiceId: selectedVoice,
          voiceName: VOICES.find(v => v.id === selectedVoice)?.name || selectedVoice,
          tone: selectedTone,
          audioUrl: url,
          created_at: new Date().toISOString(),
          isVoiceFallbackActive: false
        };
        setVoiceHistory(prev => [newHist, ...prev]);
      } else {
        throw new Error("Server error, activating local TTS");
      }
    } catch (err) {
      console.log("Activating browser SpeechSynthesis fallback");
      setIsVoiceFallbackActive(true);
      showToast("تم تفعيل محرك النطق الصوتي المحلي السريع بنجاح!");

      // Local SpeechSynthesis trigger
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ar-SA';
        utterance.rate = speechSpeed;
        utterance.onstart = () => setIsPlaying(true);
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);
        window.speechSynthesis.speak(utterance);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // Optimize text via Gemini text optimizer
  const handleOptimizeText = async () => {
    if (!text.trim()) {
      showToast("أدخل نصاً أولاً لتحسينه لصالح الإعلانات السودانية.", "error");
      return;
    }

    setIsOptimizing(true);
    try {
      const res = await fetch('/api/optimize-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      const data = await res.json();
      if (data.text) {
        setText(data.text);
        showToast("تم تحسين الصياغة الإعلانية بالعامية السودانية الحماسية بنجاح!");
      }
    } catch (err) {
      showToast("تعذر تحسين النص حالياً.", "error");
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      
      {/* Vibe Header */}
      <div className="bg-zinc-900/80 border border-emerald-900/20 p-6 rounded-2xl space-y-2 backdrop-blur-xl">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          صوت إعلاني حماسي للرجال والنساء بالعامية السودانية
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-white leading-snug">استوديو تصميم الأصوات والإعلانات الصوتية</h2>
        <p className="text-zinc-400 text-xs leading-relaxed">
          اختر من سيناريوهات الإعلانات السودانية الجاهزة أو أكتب نصك الخاص، ثم انقر على توليد للحصول على صوت إعلاني فاخر ومقنع.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Editor Settings (2 Cols) */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Preset Buttons */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-5 space-y-3 backdrop-blur-xl">
            <h3 className="text-xs font-black text-emerald-400 tracking-wider uppercase flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              نماذج سيناريوهات إعلانية جاهزة ومجربة
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setText(p.text)}
                  className="p-3 bg-zinc-950/80 hover:bg-zinc-800 border border-zinc-800 hover:border-emerald-500/40 rounded-2xl text-right transition-all group space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-200 group-hover:text-emerald-400">{p.title}</span>
                    <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded font-extrabold">{p.badge}</span>
                  </div>
                  <p className="text-[10px] text-zinc-500 line-clamp-2 leading-relaxed">{p.text}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Text Editor */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-5 space-y-3 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-zinc-200">السيناريو والنص الإعلاني المراد نطقة:</label>
              <button
                onClick={handleOptimizeText}
                disabled={isOptimizing}
                className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20"
              >
                {isOptimizing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>تحسين النص بالعامية الحماسية</span>
              </button>
            </div>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={5}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/60 leading-relaxed"
              placeholder="اكتب سيناريو إعلانك بالعامية السودانية هنا..."
            />

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-3 text-xs text-zinc-400">
                <span>سرعة النطق:</span>
                <input
                  type="range"
                  min="0.75"
                  max="1.5"
                  step="0.1"
                  value={speechSpeed}
                  onChange={(e) => setSpeechSpeed(parseFloat(e.target.value))}
                  className="w-24 accent-emerald-500 cursor-pointer"
                />
                <span className="font-mono text-emerald-400 font-bold">{speechSpeed}x</span>
              </div>

              <button
                onClick={handleGenerateVoice}
                disabled={isGenerating}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-40 text-zinc-950 font-black rounded-xl text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
              >
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mic2 className="w-4 h-4" />}
                <span>توليد الصوت الإعلاني الآن</span>
              </button>
            </div>
          </div>

          {/* Player & Audio Stream output */}
          {(audioUrl || isVoiceFallbackActive) && (
            <div className="bg-gradient-to-r from-emerald-950/80 via-teal-950/60 to-zinc-950 border border-emerald-500/40 rounded-3xl p-5 space-y-3 shadow-2xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4" />
                  الملف الصوتي الإعلاني الجاهز
                </span>
                {audioUrl && (
                  <a
                    href={audioUrl}
                    download="sai-advertisement-voice.wav"
                    className="text-xs text-emerald-400 font-bold hover:underline flex items-center gap-1 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>تحميل الملف الصوتى</span>
                  </a>
                )}
              </div>

              {audioUrl && (
                <audio ref={audioRef} src={audioUrl} controls className="w-full h-10 accent-emerald-500" />
              )}
            </div>
          )}

        </div>

        {/* Right Options Column */}
        <div className="space-y-6">
          
          {/* Voices Selection */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-5 space-y-3 backdrop-blur-xl">
            <h3 className="text-xs font-black text-emerald-400 tracking-wider uppercase">اختر الصوت الإعلاني</h3>
            <div className="space-y-2">
              {VOICES.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVoice(v.id)}
                  className={`w-full p-3 rounded-2xl border text-right transition-all ${
                    selectedVoice === v.id
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 shadow-md'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <p className="text-xs font-bold mb-0.5">{v.name}</p>
                  <p className="text-[10px] opacity-75">{v.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Tone Selection */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-5 space-y-3 backdrop-blur-xl">
            <h3 className="text-xs font-black text-emerald-400 tracking-wider uppercase">النبرة والأجواء</h3>
            <div className="space-y-2">
              {TONES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTone(t.id)}
                  className={`w-full p-3 rounded-2xl border text-right transition-all ${
                    selectedTone === t.id
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 shadow-md'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <p className="text-xs font-bold mb-0.5">{t.name}</p>
                  <p className="text-[10px] opacity-75">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
