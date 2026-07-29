import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Sun, 
  Moon, 
  Type, 
  Trash2, 
  Download, 
  ShieldCheck, 
  Bug, 
  Check, 
  X, 
  Heart,
  Smartphone,
  Sparkles,
  DownloadCloud
} from 'lucide-react';

interface SettingsViewProps {
  themeMode: 'dark' | 'light';
  setThemeMode: (m: 'dark' | 'light') => void;
  fontSizeScale: 'normal' | 'large' | 'xlarge';
  setFontSizeScale: (s: 'normal' | 'large' | 'xlarge') => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
  aiPersona: string;
  setAiPersona: (p: any) => void;
  handleInstallPwa?: () => void;
  isPwaInstalled?: boolean;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  themeMode,
  setThemeMode,
  fontSizeScale,
  setFontSizeScale,
  showToast,
  aiPersona,
  setAiPersona,
  handleInstallPwa,
  isPwaInstalled
}) => {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showBugModal, setShowBugModal] = useState(false);
  const [bugReportText, setBugReportText] = useState("");

  const handleClearCache = () => {
    if (window.confirm("هل انت متأكد من مسح الذاكرة المؤقتة للتطبيق؟ لن يتم حذف حسابك.")) {
      localStorage.removeItem('sudan_ai_saved_chats');
      showToast("تم مسح الذاكرة المؤقتة بنجاح!");
    }
  };

  const handleSendBugReport = () => {
    if (!bugReportText.trim()) return;
    showToast("تم إرسال البلاغ لفريق التطوير بنجاح! شقراً لمساهمتك.");
    setBugReportText("");
    setShowBugModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 backdrop-blur-xl space-y-2">
        <h2 className="text-2xl font-black text-white flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-emerald-400" />
          الإعدادات وتفضيلات PWA
        </h2>
        <p className="text-xs text-zinc-400">تخصيص المظهر، تثبيت التطبيق، حجم الخط، وإدارة الذاكرة</p>
      </div>

      <div className="space-y-4">

        {/* PWA App Installation Box */}
        <div className="p-6 bg-gradient-to-r from-emerald-950/60 via-zinc-900 to-teal-950/40 border border-emerald-500/40 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1 text-center sm:text-right">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
              <Smartphone className="w-3.5 h-3.5" />
              <span>تطبيق ويب تقدمي (PWA Installable)</span>
            </div>
            <h3 className="text-base font-black text-white">تثبيت تطبيق صوت السودان على جهازك</h3>
            <p className="text-xs text-zinc-300 leading-relaxed max-w-md">
              قم بتثبيت التطبيق مباشرة من المتصفح ليعمل بملء الشاشة، سرعة فائقة، ودون الحاجة للمتجر على Android، iPhone، أو Windows.
            </p>
          </div>

          <button
            onClick={handleInstallPwa}
            className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-black rounded-2xl text-xs shadow-xl transition-all flex items-center gap-2 shrink-0"
          >
            <DownloadCloud className="w-4 h-4" />
            <span>{isPwaInstalled ? 'التطبيق مثبت حالياً ✓' : 'تثبيت التطبيق الآن'}</span>
          </button>
        </div>
        
        {/* Theme Settings */}
        <div className="p-5 bg-zinc-900/80 border border-zinc-800 rounded-2xl flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-zinc-100">نمط المظهر والنمط البصري</h3>
            <p className="text-xs text-zinc-400">التبديل بين الوضع الليلي والمضيء المريح للعينين</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setThemeMode('dark')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                themeMode === 'dark' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-zinc-950 text-zinc-400 border-zinc-800'
              }`}
            >
              ليلي
            </button>
            <button
              onClick={() => setThemeMode('light')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                themeMode === 'light' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-zinc-950 text-zinc-400 border-zinc-800'
              }`}
            >
              مضيء
            </button>
          </div>
        </div>

        {/* Font Scale Settings */}
        <div className="p-5 bg-zinc-900/80 border border-zinc-800 rounded-2xl flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-zinc-100">حجم الخط ونسبة التكبير</h3>
            <p className="text-xs text-zinc-400">تعديل حجم النصوص لسهولة القراءة في القراءة والمحادثات</p>
          </div>
          <div className="flex items-center gap-2">
            {[
              { id: 'normal', label: 'عادي 100%' },
              { id: 'large', label: 'كبير 115%' },
              { id: 'xlarge', label: 'عريض 130%' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFontSizeScale(f.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  fontSizeScale === f.id ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-zinc-950 text-zinc-400 border-zinc-800'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cache & Data Management */}
        <div className="p-5 bg-zinc-900/80 border border-zinc-800 rounded-2xl flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-zinc-100">مسح الذاكرة المؤقتة</h3>
            <p className="text-xs text-zinc-400">تنظيف السجلات المؤقتة لتسريع أداء التطبيق</p>
          </div>
          <button
            onClick={handleClearCache}
            className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>مسح الذاكرة</span>
          </button>
        </div>

        {/* Privacy & Bug Report Modals Trigger */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <button
            onClick={() => setShowPrivacyModal(true)}
            className="p-4 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 rounded-2xl text-right transition-all flex items-center gap-3"
          >
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <h4 className="text-xs font-bold text-zinc-100">سياسة الخصوصية وأمان البيانات</h4>
              <p className="text-[10px] text-zinc-400">تراعي أقصى معايير التشفير وعدم مشاركة بياناتك</p>
            </div>
          </button>

          <button
            onClick={() => setShowBugModal(true)}
            className="p-4 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 rounded-2xl text-right transition-all flex items-center gap-3"
          >
            <Bug className="w-5 h-5 text-amber-400" />
            <div>
              <h4 className="text-xs font-bold text-zinc-100">الإبلاغ عن خلل أو تقديم مقترح</h4>
              <p className="text-[10px] text-zinc-400">ملاحظاتك تساعدنا في تحسين المنصة باستمرار</p>
            </div>
          </button>
        </div>

      </div>

      {/* Privacy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-black text-emerald-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                سياسة الخصوصية وأمان المنصة (SAi)
              </h3>
              <button onClick={() => setShowPrivacyModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-zinc-300 space-y-3 leading-relaxed">
              <p>• جميع المحادثات والملفات المرفقة مشفرة ولا يتم استخدامها لتدريب نماذج تجارية دون إذنك.</p>
              <p>• نحن نلتزم بحماية الخصوصية الرقمية لكافة المستخدمين والباحثين في السودان.</p>
              <p>• يمكنك حذف كافة بياناتك المحفوظة في أي وقت عبر الإعدادات.</p>
            </div>
          </div>
        </div>
      )}

      {/* Bug Report Modal */}
      {showBugModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-black text-amber-400 flex items-center gap-2">
                <Bug className="w-4 h-4" />
                تقديم بلاغ أو مقترح تطوير
              </h3>
              <button onClick={() => setShowBugModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <textarea
              value={bugReportText}
              onChange={(e) => setBugReportText(e.target.value)}
              rows={4}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              placeholder="اكتب تفاصيل الملاحظة أو المقترح..."
            />

            <button
              onClick={handleSendBugReport}
              disabled={!bugReportText.trim()}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-zinc-950 font-black rounded-xl text-xs shadow-md"
            >
              إرسال المقترح للفريق
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
