import React, { useState, useEffect } from 'react';
import {
  Mail,
  Send,
  RefreshCw,
  Search,
  Sparkles,
  Inbox,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
  FileText,
  LogOut,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Paperclip
} from 'lucide-react';
import { googleSignIn, logoutGoogle, getAccessToken, initAuth } from '../lib/firebase';
import { User } from 'firebase/auth';

interface EmailMessage {
  id: string;
  threadId: string;
  snippet: string;
  from?: string;
  subject?: string;
  date?: string;
  bodyText?: string;
}

interface GmailManagerProps {
  showToast: (message: string, type?: 'success' | 'error') => void;
}

export const GmailManager: React.FC<GmailManagerProps> = ({ showToast }) => {
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Email List & View state
  const [messages, setMessages] = useState<EmailMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<EmailMessage | null>(null);
  const [isFetchingBody, setIsFetchingBody] = useState(false);

  // AI Summary State
  const [aiSummary, setAiSummary] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);

  // Compose State
  const [activeTab, setActiveTab] = useState<'inbox' | 'compose'>('inbox');
  const [toAddress, setToAddress] = useState('');
  const [subject, setSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isDraftingAI, setIsDraftingAI] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Confirmation Modal for Sending Email
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Initialize auth listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, accessToken) => {
        setGoogleUser(user);
        setToken(accessToken);
        setIsLoadingAuth(false);
      },
      () => {
        setGoogleUser(null);
        setToken(null);
        setIsLoadingAuth(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Fetch messages when authenticated
  useEffect(() => {
    if (token) {
      fetchInbox();
    }
  }, [token]);

  // Login handler
  const handleGoogleLogin = async () => {
    setIsSigningIn(true);
    try {
      const res = await googleSignIn();
      if (res) {
        setGoogleUser(res.user);
        setToken(res.accessToken);
        showToast(`تم تسجيل الدخول بنجاح عبر حساب Google (${res.user.email})! ✨`);
      }
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      showToast('فشل تسجيل الدخول باستخدام Google Gmail.', 'error');
    } finally {
      setIsSigningIn(false);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    await logoutGoogle();
    setGoogleUser(null);
    setToken(null);
    setMessages([]);
    setSelectedMessage(null);
    showToast('تم تسجيل الخروج من Gmail.');
  };

  // Fetch Inbox messages from Gmail API
  const fetchInbox = async (query = '') => {
    if (!token) return;
    setIsLoadingMessages(true);
    try {
      let url = 'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=15';
      if (query.trim()) {
        url += `&q=${encodeURIComponent(query.trim())}`;
      }

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        if (res.status === 401) {
          showToast('انتهت صلاحية جلسة Google، يُرجى تسجيل الدخول مجدداً.', 'error');
          setToken(null);
        }
        throw new Error(`Gmail API error: ${res.status}`);
      }

      const data = await res.json();
      const rawMsgs = data.messages || [];

      // Fetch headers/snippets for each message
      const msgDetails: EmailMessage[] = await Promise.all(
        rawMsgs.slice(0, 10).map(async (m: { id: string; threadId: string }) => {
          try {
            const detailRes = await fetch(
              `https://gmail.googleapis.com/gmail/v1/users/me/messages/${m.id}?format=full`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            const detail = await detailRes.json();
            const headers = detail.payload?.headers || [];

            const fromHeader = headers.find((h: any) => h.name.toLowerCase() === 'from')?.value || 'غير معروف';
            const subjectHeader = headers.find((h: any) => h.name.toLowerCase() === 'subject')?.value || '(بدون عنوان)';
            const dateHeader = headers.find((h: any) => h.name.toLowerCase() === 'date')?.value || '';

            return {
              id: m.id,
              threadId: m.threadId,
              snippet: detail.snippet || '',
              from: fromHeader,
              subject: subjectHeader,
              date: dateHeader ? new Date(dateHeader).toLocaleDateString('ar-SD', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' }) : '',
              bodyText: extractBodyText(detail.payload)
            };
          } catch {
            return { id: m.id, threadId: m.threadId, snippet: 'خطأ في جلب بيانات الرسالة' };
          }
        })
      );

      setMessages(msgDetails);
    } catch (err) {
      console.error('Fetch Inbox error:', err);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  // Helper to extract text body from Gmail payload
  const extractBodyText = (payload: any): string => {
    if (!payload) return '';
    if (payload.body && payload.body.data) {
      return decodeBase64Utf8(payload.body.data);
    }
    if (payload.parts && Array.isArray(payload.parts)) {
      for (const part of payload.parts) {
        if (part.mimeType === 'text/plain' && part.body && part.body.data) {
          return decodeBase64Utf8(part.body.data);
        }
        if (part.parts) {
          const subText = extractBodyText(part);
          if (subText) return subText;
        }
      }
    }
    return '';
  };

  const decodeBase64Utf8 = (str: string) => {
    try {
      const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
      return decodeURIComponent(
        escape(window.atob(base64))
      );
    } catch (e) {
      return 'تعذر تفكيك نص الرسالة.';
    }
  };

  // AI Email Draft Assistant
  const handleDraftWithAI = async () => {
    if (!aiPrompt.trim()) return;
    setIsDraftingAI(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              text: `أنت مساعد السودان للذكاء الاصطناعي المتخصص في كتابة وصياغة رسائل البريد الإلكتروني. صغ لي رسالة بريد إلكتروني احترافية ومقنعة بناءً على الطلب التالي:\n\n"${aiPrompt}"\n\nقم بالرد بصيغة JSON تحتوي على المفتاحين التالية فقط:\n{"subject": "عنوان البريد", "body": "محتوى البريد الكامل بالتنسيق المناسب"}`
            }
          ]
        })
      });

      const data = await res.json();
      let replyText = data.reply || '';
      
      // Try parsing JSON or extraction
      try {
        const jsonMatch = replyText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.subject) setSubject(parsed.subject);
          if (parsed.body) setEmailBody(parsed.body);
        } else {
          setEmailBody(replyText);
        }
      } catch {
        setEmailBody(replyText);
      }
      showToast('تمت صياغة البريد الإلكتروني بالذكاء الاصطناعي بنجاح! ✨');
    } catch (err) {
      showToast('فشل توليد البريد بالذكاء الاصطناعي.', 'error');
    } finally {
      setIsDraftingAI(false);
    }
  };

  // Summarize Email with AI
  const handleSummarizeEmail = async (msg: EmailMessage) => {
    setIsSummarizing(true);
    setAiSummary('');
    try {
      const contentToSummarize = msg.bodyText || msg.snippet;
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              text: `قم بتلخيص رسالة البريد الإلكتروني التالية بأسلوب موجز ومنظم بنقاط واضحة بالعامية السودانية واللغة العربية:\n\nالعنوان: ${msg.subject}\nالمرسل: ${msg.from}\nالمحتوى: ${contentToSummarize}`
            }
          ]
        })
      });
      const data = await res.json();
      setAiSummary(data.reply || 'تم التلخيص بنجاح.');
    } catch (err) {
      showToast('حدث خطأ أثناء التلخيص.', 'error');
    } finally {
      setIsSummarizing(false);
    }
  };

  // Execute Send Email
  const executeSendEmail = async () => {
    if (!token || !toAddress || !subject || !emailBody) return;
    setIsSending(true);
    try {
      // Build MIME RFC 2822 email
      const emailContent = [
        `To: ${toAddress}`,
        `Subject: =?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`,
        'Content-Type: text/plain; charset=utf-8',
        'MIME-Version: 1.0',
        '',
        emailBody
      ].join('\r\n');

      // Base64url encode
      const raw = btoa(unescape(encodeURIComponent(emailContent)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ raw })
      });

      if (!res.ok) {
        throw new Error(`Send failed with status ${res.status}`);
      }

      showToast(`تم إرسال البريد الإلكتروني بنجاح إلى ${toAddress}! 🚀`);
      setToAddress('');
      setSubject('');
      setEmailBody('');
      setShowConfirmModal(false);
      setActiveTab('inbox');
      fetchInbox();
    } catch (err) {
      console.error('Send Email Error:', err);
      showToast('فشل إرسال البريد الإلكتروني. يرجى التحقق من العنوان والمحاولة مجدداً.', 'error');
    } finally {
      setIsSending(false);
    }
  };

  if (isLoadingAuth) {
    return (
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-8 flex items-center justify-center gap-3 text-zinc-400">
        <Loader2 className="w-5 h-5 animate-spin text-amber-400" />
        <span>جاري التحقق من الربط مع Google Gmail...</span>
      </div>
    );
  }

  // If not logged in with Google Gmail OAuth
  if (!googleUser || !token) {
    return (
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-8 backdrop-blur-xl animate-fade-in space-y-6 text-center max-w-2xl mx-auto">
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto">
          <Mail className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-extrabold text-white">ربط وسائط البريد الإلكتروني Gmail</h2>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-lg mx-auto">
            قم بربط حسابك في Google Gmail بأمان لمقروئية وإرسال وتلخيص البريد الإلكتروني مباشرة عبر منصة الذكاء الاصطناعي السوداني.
          </p>
        </div>

        <div className="p-4 bg-zinc-950/80 border border-zinc-800 rounded-xl text-right text-xs space-y-2 text-zinc-300">
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>مميزات الربط المباشر مع Gmail:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-zinc-400 text-[11px] pr-2">
            <li>استعراض الوارد والبحث المباشر داخل بريدك.</li>
            <li>تلخيص الرسائل وتوفير ردود مقترحة بالعامية السودانية.</li>
            <li>صياغة وإرسال الرسائل الرسمية والإعلانية بالذكاء الاصطناعي مع تأكيد بشري آمن قبل الإرسال.</li>
          </ul>
        </div>

        {/* Official Google Sign In Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={isSigningIn}
          className="inline-flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-sm shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
        >
          {isSigningIn ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-slate-600" />
              <span>جاري الربط مع Google...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
              <span>تسجيل الدخول باستخدام Google Gmail</span>
            </>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 backdrop-blur-xl animate-fade-in space-y-5">
      
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-extrabold text-white">مركز البريد الإلكتروني (Gmail Integration)</h2>
              <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">متصل</span>
            </div>
            <p className="text-[11px] text-zinc-400">{googleUser.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => setActiveTab('inbox')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'inbox' ? 'bg-emerald-600 text-white' : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-white'}`}
          >
            <Inbox className="w-4 h-4" />
            <span>صندوق الوارد</span>
          </button>

          <button
            onClick={() => setActiveTab('compose')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'compose' ? 'bg-emerald-600 text-white' : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-white'}`}
          >
            <Send className="w-4 h-4" />
            <span>إرسال بريد جديد</span>
          </button>

          <button
            onClick={handleLogout}
            title="تسجيل الخروج من Gmail"
            className="p-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-red-400 hover:border-red-500/30 transition-all"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* INBOX VIEW */}
      {activeTab === 'inbox' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* Left Email List Column */}
          <div className="md:col-span-5 space-y-3">
            {/* Search & Refresh Bar */}
            <div className="flex items-center gap-2">
              <div className="flex-grow flex items-center gap-2 bg-zinc-950 border border-zinc-850 px-3 py-2 rounded-xl text-xs">
                <Search className="w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="بحث في الرسائل..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchInbox(searchQuery)}
                  className="bg-transparent border-none outline-none text-zinc-200 placeholder:text-zinc-600 w-full"
                />
              </div>

              <button
                onClick={() => fetchInbox(searchQuery)}
                disabled={isLoadingMessages}
                className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all"
                title="تحديث"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingMessages ? 'animate-spin text-emerald-400' : ''}`} />
              </button>
            </div>

            {/* Message Items List */}
            <div className="space-y-2 max-h-[500px] overflow-y-auto scrollbar-thin pr-1">
              {isLoadingMessages ? (
                <div className="py-12 text-center text-xs text-zinc-500 space-y-2">
                  <Loader2 className="w-5 h-5 animate-spin mx-auto text-emerald-400" />
                  <p>جاري تحميل رسائل Gmail...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="py-12 text-center text-xs text-zinc-500 space-y-1">
                  <Inbox className="w-8 h-8 mx-auto text-zinc-600" />
                  <p>لا توجد رسائل مطابقة.</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <button
                    key={msg.id}
                    onClick={() => {
                      setSelectedMessage(msg);
                      setAiSummary('');
                    }}
                    className={`w-full text-right p-3 rounded-xl border transition-all flex flex-col gap-1 ${selectedMessage?.id === msg.id ? 'bg-emerald-950/30 border-emerald-500/40 text-white shadow-md' : 'bg-zinc-950/60 border-zinc-850/80 text-zinc-300 hover:border-zinc-700'}`}
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-emerald-400 truncate max-w-[180px]">{msg.from}</span>
                      <span className="text-zinc-500 shrink-0">{msg.date}</span>
                    </div>
                    <span className="text-xs font-bold text-zinc-100 line-clamp-1">{msg.subject}</span>
                    <p className="text-[10px] text-zinc-400 line-clamp-2 leading-relaxed">{msg.snippet}</p>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Right Selected Email Viewer Column */}
          <div className="md:col-span-7 bg-zinc-950 border border-zinc-850 rounded-xl p-4 min-h-[450px] flex flex-col justify-between">
            {selectedMessage ? (
              <div className="space-y-4">
                <div className="space-y-2 pb-3 border-b border-zinc-850">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold text-white">{selectedMessage.subject}</h3>
                    <button
                      onClick={() => handleSummarizeEmail(selectedMessage)}
                      disabled={isSummarizing}
                      className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-lg text-xs font-bold transition-all shrink-0"
                    >
                      {isSummarizing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                      <span>تلخيص بالذكاء الاصطناعي</span>
                    </button>
                  </div>

                  <div className="text-[11px] text-zinc-400 space-y-0.5">
                    <p><strong className="text-zinc-300">المرسل:</strong> {selectedMessage.from}</p>
                    <p><strong className="text-zinc-300">التاريخ:</strong> {selectedMessage.date}</p>
                  </div>
                </div>

                {/* AI Summary Box if generated */}
                {aiSummary && (
                  <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-200 space-y-1.5 animate-fade-in">
                    <div className="flex items-center gap-1.5 font-bold text-amber-400">
                      <Sparkles className="w-4 h-4" />
                      <span>الملخص التنفيذي بالعامية السودانية:</span>
                    </div>
                    <p className="whitespace-pre-line text-[11px] leading-relaxed text-zinc-300">{aiSummary}</p>
                  </div>
                )}

                {/* Full Body or Snippet */}
                <div className="text-xs text-zinc-200 leading-relaxed space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  <p className="whitespace-pre-line">{selectedMessage.bodyText || selectedMessage.snippet}</p>
                </div>

                {/* Quick AI Reply Button */}
                <div className="pt-3 border-t border-zinc-850 flex items-center justify-end">
                  <button
                    onClick={() => {
                      setToAddress(selectedMessage.from?.match(/<([^>]+)>/)?.[1] || selectedMessage.from || '');
                      setSubject(`Re: ${selectedMessage.subject}`);
                      setActiveTab('compose');
                      setAiPrompt(`صغ رداً لبقاً ومناسباً على الرسالة التالية:\n"${selectedMessage.snippet}"`);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 border border-zinc-800 hover:border-emerald-500/30 text-zinc-200 hover:text-emerald-400 rounded-lg text-xs font-bold transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>الرد التلقائي السريع</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="my-auto text-center py-12 text-xs text-zinc-500 space-y-2">
                <FileText className="w-10 h-10 mx-auto text-zinc-700" />
                <p>اختر رسالة من القائمة لعرض تفاصيلها وتلخيصها.</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* COMPOSE VIEW */}
      {activeTab === 'compose' && (
        <div className="max-w-3xl mx-auto space-y-4">
          
          {/* AI Drafting Prompt Bar */}
          <div className="p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
              <Sparkles className="w-4 h-4" />
              <span>مساعد صياغة البريد الإلكتروني بالذكاء الاصطناعي:</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="صف طلبك (مثلاً: أكتب إيميل اعتذار رسمي، أو إيميل عرض سعر منتج سوداني)..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="flex-grow bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-emerald-500/40"
              />
              <button
                type="button"
                onClick={handleDraftWithAI}
                disabled={isDraftingAI || !aiPrompt.trim()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shrink-0"
              >
                {isDraftingAI ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>صياغة الـ AI</span>
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (toAddress && subject && emailBody) {
                setShowConfirmModal(true);
              } else {
                showToast('يرجى ملء كافة الخانات المطلوبة.', 'error');
              }
            }}
            className="space-y-3 bg-zinc-950 border border-zinc-850 p-5 rounded-xl text-xs"
          >
            <div className="space-y-1">
              <label className="text-zinc-400 font-bold block">إلى (عنوان البريد الإلكتروني):</label>
              <input
                type="email"
                required
                placeholder="example@gmail.com"
                value={toAddress}
                onChange={(e) => setToAddress(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 outline-none focus:border-emerald-500/50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-400 font-bold block">الموضوع (Subject):</label>
              <input
                type="text"
                required
                placeholder="عنوان البريد الإلكتروني..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 outline-none focus:border-emerald-500/50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-400 font-bold block">نص الرسالة:</label>
              <textarea
                required
                rows={8}
                placeholder="أكتب نص الرسالة هنا أو استخدم زر الصياغة بالذكاء الاصطناعي أعلاه..."
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-zinc-100 outline-none focus:border-emerald-500/50 leading-relaxed font-sans"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg"
              >
                <Send className="w-4 h-4" />
                <span>مراجعة وإرسال البريد الإلكتروني</span>
              </button>
            </div>
          </form>

        </div>
      )}

      {/* Mandatory User Confirmation Modal for Mutating Action (Send Email) */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-emerald-500/30 p-6 rounded-2xl max-w-md w-full space-y-4 animate-scale-up">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm pb-2 border-b border-zinc-800">
              <AlertCircle className="w-5 h-5 text-amber-400" />
              <span>تأكيد إرسال البريد الإلكتروني عبر Gmail</span>
            </div>

            <div className="space-y-2 text-xs text-zinc-300 leading-relaxed">
              <p>هل أنت متأكد من رغبتك في إرسال هذا البريد الإلكتروني رسمياً عبر حسابك الشخصي؟</p>

              <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl space-y-1 text-[11px]">
                <p><strong className="text-emerald-400">المستلم:</strong> {toAddress}</p>
                <p><strong className="text-emerald-400">العنوان:</strong> {subject}</p>
                <p className="line-clamp-2 text-zinc-400"><strong className="text-emerald-400">المحتوى:</strong> {emailBody}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={executeSendEmail}
                disabled={isSending}
                className="flex-grow py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>جاري الإرسال...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>نعم، قم بالإرسال الآن</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                disabled={isSending}
                className="px-4 py-2.5 bg-zinc-950 text-zinc-400 border border-zinc-800 rounded-xl text-xs hover:text-white transition-all"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
