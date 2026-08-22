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
  Copy,
  Menu
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
  sidebarOpen?: boolean;
  setSidebarOpen?: (open: boolean | ((prev: boolean) => boolean)) => void;
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
  setAppLanguage,
  sidebarOpen,
  setSidebarOpen
}) => {
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-30 bg-black/95 backdrop-blur-xl border-b border-zinc-800/90 px-4 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        
        {/* Brand & Menu Button */}
        <div className="flex items-center gap-3">
          {setSidebarOpen && (
            <button
              onClick={() => setSidebarOpen(prev => !prev)}
              className="p-2.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 text-white rounded-xl transition-all flex items-center gap-1.5 shadow-md"
              title="فتح / إغلاق القائمة"
            >
              <Menu className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-black text-white">القائمة</span>
            </button>
          )}

          <button 
            onClick={() => setActiveView('dashboard')}
            className="flex items-center gap-2 text-right hover:opacity-90 transition-all group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 flex items-center justify-center text-zinc-950 font-black shadow-lg shadow-emerald-500/20 border border-emerald-300/40 group-hover:scale-105 transition-transform shrink-0">
              <span className="text-lg">SAi</span>
            </div>
            
            {/* Sudan Map Frame Badge */}
            <div className="flex items-center gap-2 bg-emerald-950/80 border border-emerald-500/40 px-3 py-1.5 rounded-2xl shadow-inner">
              <svg viewBox="0 0 100 100" className="w-7 h-7 text-emerald-400 shrink-0" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="3.5" strokeLinejoin="round">
                <path d="M38 10 L58 10 L68 18 L64 28 L82 42 L78 58 L62 76 L52 82 L42 86 L32 76 L22 74 L12 62 L10 44 L20 32 L26 18 Z" />
                <circle cx="50" cy="45" r="4" className="fill-emerald-400" />
              </svg>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-xs md:text-sm text-emerald-300 tracking-tight">
                    الذكاء الاصطناعي السوداني
                  </span>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-extrabold px-1.5 py-0.2 rounded border border-emerald-500/30">
                    🇸🇩 SAi
                  </span>
                </div>
                <p className="text-[9px] text-zinc-300 hidden sm:block">
                  المنصة الذكية الشاملة
                </p>
              </div>
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
            className="w-full pl-4 pr-10 py-2 bg-zinc-950 border border-zinc-800 focus:border-emerald-500/80 rounded-xl text-xs text-white placeholder-zinc-400 focus:outline-none transition-all shadow-inner"
          />
          {globalSearchQuery && (
            <button 
              onClick={() => setGlobalSearchQuery('')}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
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

          {/* Support SAi badge */}
          <button
            onClick={() => setActiveView('dedication')}
            className="hidden lg:flex items-center gap-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all"
            title="دعم وتطوير منصة SAi"
          >
            <Heart className="w-3.5 h-3.5 text-emerald-400 fill-emerald-500/30" />
            <span>دعم وتطوير SAi</span>
          </button>

          {/* Language Switcher */}
          {setAppLanguage && (
            <button
              onClick={() => {
                const nextLang = appLanguage === 'ar' ? 'en' : 'ar';
                setAppLanguage(nextLang);
                showToast(nextLang === 'ar' ? "تم التحويل إلى اللغة العربية 🇸🇩" : "Switched to English 🇬🇧");
              }}
              className="px-2.5 py-1.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-zinc-200 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1"
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
            }}
            className="p-2 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-white rounded-xl transition-all"
            title={themeMode === 'dark' ? 'الوضع الليلي الفائق مفعّل' : 'تفعيل الوضع الليلي الفائق'}
          >
            {themeMode === 'dark' ? <Moon className="w-4 h-4 text-emerald-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="p-2 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-white rounded-xl transition-all relative"
            >
              <Bell className="w-4 h-4 text-zinc-200" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-zinc-950 text-[9px] font-black flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute left-0 mt-2 w-80 bg-black/98 border border-zinc-800 rounded-2xl shadow-2xl p-4 z-50 space-y-3 animate-fade-in">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <h4 className="text-xs font-black text-white">مركز الإشعارات والأنباء</h4>
                  <button onClick={() => setShowNotifMenu(false)} className="text-zinc-400 hover:text-white">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-[11px] text-zinc-400 text-center py-4">لا توجد إشعارات جديدة حالياً.</p>
                  ) : (
                    notifications.map((n) => (
                      <div key={n.id} className="p-2.5 bg-zinc-950 border border-zinc-800/80 rounded-xl space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-emerald-400">{n.title}</span>
                          <span className="text-[9px] text-zinc-400">{new Date(n.created_at).toLocaleDateString('ar-SD')}</span>
                        </div>
                        <p className="text-[10px] text-zinc-200 leading-relaxed">{n.content}</p>
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
            className="flex items-center gap-2 p-1.5 md:px-3 md:py-1.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 rounded-xl transition-all"
          >
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
              <User className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-white hidden sm:inline">
              {currentUser ? currentUser.name.split(' ')[0] : 'تسجيل دخول'}
            </span>
          </button>

        </div>

      </div>
    </header>
  );
};
