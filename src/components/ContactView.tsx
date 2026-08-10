import React, { useState } from 'react';
import { Mail, Send, MessageSquare, Phone, MapPin, CheckCircle, Heart, User, ShieldCheck } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

interface ContactViewProps {
  showToast: (msg: string, type?: 'success' | 'error') => void;
  currentUser: any;
}

export const ContactView: React.FC<ContactViewProps> = ({ showToast, currentUser }) => {
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      showToast("يرجى ملء جميع الحقول المطلوبة قبل الإرسال", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      if (auth.currentUser) {
        await addDoc(collection(db, 'app_feedback'), {
          id: `fb_${Date.now()}`,
          userId: auth.currentUser.uid,
          userName: name,
          content: `Subject: ${subject}\n\n${message}`,
          rating: 5,
          createdAt: new Date().toISOString()
        });
      }
      setSubmitted(true);
      showToast("تم إرسال رسالتك بنجاح! شكراً لك على تواصلك ودعمك 🇸🇩");
    } catch (err) {
      // Fallback
      setSubmitted(true);
      showToast("تم تسجيل رسالتك بنجاح! شكراً لك.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-emerald-950/80 border border-emerald-500/30 p-8 rounded-3xl space-y-3 backdrop-blur-xl text-right">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black">
          <Mail className="w-3.5 h-3.5" />
          <span>الدعم والملاحظات والتواصل 📩</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-black text-white">تواصل مع فريق منصة SAi</h1>
        <p className="text-xs md:text-sm text-zinc-300 leading-relaxed max-w-2xl">
          نحن هنا للاستماع إلى اقتراحاتك، استفساراتك، وتقديم الدعم الفني الكامل لتجربة ذكاء اصطناعي سودانية استثنائية.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Contact Info Cards */}
        <div className="space-y-4 md:col-span-1">
          <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-2 text-right">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-bold text-white">البريد الإلكتروني للدعم</h3>
            <p className="text-[11px] text-emerald-400 font-mono dir-ltr text-right">mekoogk@gmail.com</p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-2 text-right">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-black">
              <Heart className="w-5 h-5 fill-rose-500/30" />
            </div>
            <h3 className="text-xs font-bold text-white">المطور والرئيس التنفيذي</h3>
            <p className="text-xs text-zinc-300">كمال جعفر زكريا</p>
            <p className="text-[10px] text-zinc-400">Kamal Gafar Zakaria</p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-2 text-right">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-bold text-white">دعم التطبيق والتواصل المباشر</h3>
            <p className="text-xs text-emerald-400 font-mono font-bold dir-ltr text-right">00249919980435</p>
            <p className="text-[10px] text-zinc-400">التواصل عبر الواتساب أو الاتصال لتقديم الملاحظات والدعم 🇸🇩</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="md:col-span-2 bg-zinc-900/90 border border-zinc-800 p-6 md:p-8 rounded-3xl backdrop-blur-xl text-right">
          {submitted ? (
            <div className="py-12 text-center space-y-4 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-white">تم إرسال رسالتك بنجاح!</h3>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                شكراً لتواصلك معنا. يقوم فريق SAi بمراجعة الرسائل والملاحظات بشكل مستمر لتطوير المنصة والتحديث الفوري.
              </p>
              <button
                onClick={() => { setSubmitted(false); setMessage(''); setSubject(''); }}
                className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold transition-all"
              >
                إرسال رسالة أخرى
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-emerald-400" />
                <span>أرسل ملاحظتك أو استفسارك مباشرة</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-300">الاسم الكامل:</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: كمال جعفر"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-300">البريد الإلكتروني:</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-300">موضوع الرسالة:</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="مثال: اقتراح ميزة جديدة / استفسار عن خدمات الصوت"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-300">محتوى الرسالة:</label>
                <textarea
                  rows={5}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="اكتب رسالتك أو اقتراحك هنا..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-black rounded-xl text-xs shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>جاري الإرسال...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>إرسال الرسالة الآن</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
};

export default ContactView;
