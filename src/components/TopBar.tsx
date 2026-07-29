import React, { useState } from 'react';
import { 
  Search, 
  Sun, 
  Moon, 
  Type, 
  Bell, 
  User, 
  Heart, 
  Shield, 
  X, 
  CheckCircle, 
  Sparkles,
  Copy
} from 'lucide-react';

interface TopBarProps {
  themeMode: 'dark' | 'light';
  setThemeMode: (mode: 'dark' | 'light') => void;
  fontSizeScale: 'normal' | 'large' | 'xlarge';
  setFontSizeScale: (scale: 'normal' | 'large' | 'xlarge') => void;
  currentUser: any;
  setShowAuthModal: (show: boolean) => void;
  setActiveView: (view: string) => void;
  notifications: any[];
  showToast: (msg: string, type?: 'success' | 'error') => void;
  globalSearchQuery: string;
  setGlobalSearchQuery: (query: string) => void;
  handleInstallPwa?: () => void;
  isPwaInstalled?: boolean;
  appLanguage?: 'ar' | 'en';
  setAppLanguage?: (lang: 'ar' | 'en') => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  themeMode,
  setThemeMode,
  fontSizeScale,
  setFontSizeScale,
  currentUser,
  setShowAuthModal,
  setActiveView,
  notifications,
  showToast,
  globalSearchQuery,
  setGlobalSearchQuery,
  handleInstallPwa,
  isPwaInstalled,
  appLanguage = 'ar',
  setAppLanguage
}) => {
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-30 bg-zinc-950/80 dark:bg-zinc-950/80 light-mode:bg-white/80 backdrop-blur-xl border-b border-zinc-800/80 light-mode:border-slate-200 px-4 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        
        {/* Brand & Mobile View Switcher */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveView('dashboard')}
            className="flex items-center gap-2.5 text-right hover:opacity-90 transition-all group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 flex items-center justify-center text-zinc-950 font-black shadow-lg shadow-emerald-500/20 border border-emerald-300/40 group-hover:scale-105 transition-transform">
              <span className="text-lg">SAi</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm md:text-base text-zinc-100 dark:text-zinc-100 light-mode:text-slate-900 tracking-tight">
                  الذكاء الاصطناعي السوداني
                </span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-extrabold px-1.5 py-0.5 rounded border border-emerald-500/20">
                  SAi 3.5
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-400 light-mode:text-slate-500 hidden sm:block">
                منصة وطنية شاملة لخدمة العلم والتقنية 🇸🇩
              </p>
            </div>
          </button>
        </div>

        {/* Global Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-4 relative">
          <Search className="w-4 h-4 text-zinc-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={globalSearchQuery}
            onChange={(e) => {
              setGlobalSearchQuery(e.target.value);
              if (e.target.value.trim().length > 0) {
                setActiveView('search');
              }
            }}
            placeholder="بحث شامل في المحادثات، المستندات، والمعرفة..."
            className="w-full pl-4 pr-10 py-2 bg-zinc-900/90 dark:bg-zinc-900/90 light-mode:bg-slate-100 border border-zinc-800 dark:border-zinc-800 light-mode:border-slate-300 rounded-xl text-xs text-zinc-100 light-mode:text-slate-900 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/60 transition-all"
          />
          {globalSearchQuery && (
            <button 
              onClick={() => setGlobalSearchQuery('')}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Utility Controls */}
        <div className="flex items-center gap-2">
          
          {/* PWA Install Button */}
          {!isPwaInstalled && handleInstallPwa && (
            <button
              onClick={handleInstallPwa}
              className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 px-3 py-1.5 rounded-xl text-xs font-black shadow-md transition-all animate-pulse"
              title="تثبيت التطبيق على جهازك أو هاتفك (PWA)"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>تثبيت التطبيق</span>
            </button>
          )}

          {/* Bank contribution badge */}
          <button
            onClick={() => {
              navigator.clipboard.writeText("2813955");
              showToast("تم نسخ رقم حساب بنك الخرطوم (2813955) للمساهمة!");
            }}
            className="hidden lg:flex items-center gap-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all"
            title="حساب بنك الخرطوم للمساهمة الوطنية"
          >
            <Heart className="w-3.5 h-3.5 text-emerald-400 fill-emerald-500/30" />
            <span>بنكك: 2813955</span>
          </button>

          {/* Font Size Adjuster */}
          <div className="flex items-center bg-zinc-900 dark:bg-zinc-900 light-mode:bg-slate-100 border border-zinc-800 dark:border-zinc-800 light-mode:border-slate-300 rounded-xl p-0.5">
            <button
              onClick={() => setFontSizeScale('normal')}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                fontSizeScale === 'normal' 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="خط عادي"
            >
              <Type className="w-3 h-3" />
            </button>
            <button
              onClick={() => setFontSizeScale('large')}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                fontSizeScale === 'large' 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="خط كبير مريح"
            >
              <Type className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setFontSizeScale('xlarge')}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                fontSizeScale === 'xlarge' 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="خط عريض جداً"
            >
              <Type className="w-4 h-4" />
            </button>
          </div>

          {/* Language Switcher */}
          {setAppLanguage && (
            <button
              onClick={() => {
                const nextLang = appLanguage === 'ar' ? 'en' : 'ar';
                setAppLanguage(nextLang);
                showToast(nextLang === 'ar' ? "تم التحويل إلى اللغة العربية 🇸🇩" : "Switched to English 🇬🇧");
              }}
              className="px-2.5 py-1.5 bg-zinc-900 dark:bg-zinc-900 light-mode:bg-slate-100 hover:bg-zinc-800 border border-zinc-800 dark:border-zinc-800 light-mode:border-slate-300 text-zinc-300 light-mode:text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
              title="تغيير اللغة / Switch Language"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{appLanguage === 'ar' ? 'العربية 🇸🇩' : 'English 🇬🇧'}</span>
            </button>
          )}

          {/* Theme Mode Toggle */}
          <button
            onClick={() => {
              const nextTheme = themeMode === 'dark' ? 'light' : 'dark';
              setThemeMode(nextTheme);
              localStorage.setItem('sudan_ai_theme', nextTheme);
              if (nextTheme === 'light') {
                document.documentElement.classList.add('light-mode');
              } else {
                document.documentElement.classList.remove('light-mode');
              }
            }}
            className="p-2 bg-zinc-900 dark:bg-zinc-900 light-mode:bg-slate-100 hover:bg-zinc-800 border border-zinc-800 dark:border-zinc-800 light-mode:border-slate-300 text-zinc-300 light-mode:text-slate-700 rounded-xl transition-all"
            title={themeMode === 'dark' ? 'تفعيل الوضع المضيء' : 'تفعيل الوضع ليلي'}
          >
            {themeMode === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-emerald-600" />}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="p-2 bg-zinc-900 dark:bg-zinc-900 light-mode:bg-slate-100 hover:bg-zinc-800 border border-zinc-800 dark:border-zinc-800 light-mode:border-slate-300 text-zinc-300 light-mode:text-slate-700 rounded-xl transition-all relative"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-zinc-950 text-[9px] font-black flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute left-0 mt-2 w-80 bg-zinc-900 dark:bg-zinc-900 light-mode:bg-white border border-zinc-800 dark:border-zinc-800 light-mode:border-slate-200 rounded-2xl shadow-2xl p-4 z-50 space-y-3 animate-fade-in">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <h4 className="text-xs font-black text-zinc-200 light-mode:text-slate-900">مركز الإشعارات والأنباء</h4>
                  <button onClick={() => setShowNotifMenu(false)} className="text-zinc-400 hover:text-zinc-200">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-[11px] text-zinc-500 text-center py-4">لا توجد إشعارات جديدة حالياً.</p>
                  ) : (
                    notifications.map((n) => (
                      <div key={n.id} className="p-2.5 bg-zinc-950/80 light-mode:bg-slate-50 border border-zinc-800/80 rounded-xl space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-emerald-400">{n.title}</span>
                          <span className="text-[9px] text-zinc-500">{new Date(n.created_at).toLocaleDateString('ar-SD')}</span>
                        </div>
                        <p className="text-[10px] text-zinc-400 light-mode:text-slate-600 leading-relaxed">{n.content}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile / Auth Button */}
          <button
            onClick={() => setActiveView('profile')}
            className="flex items-center gap-2 p-1.5 md:px-3 md:py-1.5 bg-zinc-900 dark:bg-zinc-900 light-mode:bg-slate-100 hover:bg-zinc-800 border border-zinc-800 dark:border-zinc-800 light-mode:border-slate-300 rounded-xl transition-all"
          >
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
              <User className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-zinc-200 light-mode:text-slate-800 hidden sm:inline">
              {currentUser ? currentUser.name.split(' ')[0] : 'تسجيل دخول'}
            </span>
          </button>

        </div>

      </div>
    </header>
  );
};
