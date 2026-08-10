import React, { useState } from 'react';
import { Shield, Bell, Send, Users, Cpu, Activity, Check } from 'lucide-react';

interface AdminViewProps {
  notifications: any[];
  setNotifications: React.Dispatch<React.SetStateAction<any[]>>;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  notifications,
  setNotifications,
  showToast
}) => {
  const [notifTitle, setNotifTitle] = useState("");
  const [notifContent, setNotifContent] = useState("");

  const handleBroadcast = () => {
    if (!notifTitle.trim() || !notifContent.trim()) {
      showToast("يرجى ملء جميع الخانات المخصصة للإشعار.", "error");
      return;
    }

    const newNotif = {
      id: Date.now().toString(),
      title: notifTitle,
      content: notifContent,
      created_at: new Date().toISOString(),
      read: false
    };

    setNotifications(prev => [newNotif, ...prev]);
    showToast("تم بث الإشعار بنجاح لكافة مستخدمي المنصة!");
    setNotifTitle("");
    setNotifContent("");
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 backdrop-blur-xl space-y-2">
        <h2 className="text-2xl font-black text-white flex items-center gap-2">
          <Shield className="w-6 h-6 text-emerald-400" />
          لوحة تحكم المشرف والنظام (SAi System Admin)
        </h2>
        <p className="text-xs text-zinc-400">بث الإشعارات، متابعة الأداء ومؤشرات الاستخدام الخادمي</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>الخوادم النشطة</span>
            <Cpu className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-white">Cloud Run 100%</p>
        </div>

        <div className="p-5 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>زمن الاستجابة</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-400">&lt; 120ms</p>
        </div>

        <div className="p-5 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>الإشعارات المرسلة</span>
            <Bell className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-white">{notifications.length}</p>
        </div>
      </div>

      {/* Broadcast Box */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 space-y-4 backdrop-blur-xl">
        <h3 className="text-sm font-black text-emerald-400 flex items-center gap-2">
          <Send className="w-4 h-4" />
          بث إشعار عام لجميع المستخدمين
        </h3>

        <div className="space-y-3">
          <input
            type="text"
            value={notifTitle}
            onChange={(e) => setNotifTitle(e.target.value)}
            placeholder="عنوان الإشعار (مثال: تحديث جديد في محرك الأصوات...)"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500"
          />

          <textarea
            value={notifContent}
            onChange={(e) => setNotifContent(e.target.value)}
            rows={3}
            placeholder="نص تفاصيل الإشعار..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500"
          />

          <button
            onClick={handleBroadcast}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-zinc-950 font-black rounded-xl text-xs shadow-md"
          >
            بث الإشعار الآن
          </button>
        </div>
      </div>

    </div>
  );
};

export default AdminView;
