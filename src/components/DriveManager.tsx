import React, { useState, useEffect } from 'react';
import { 
  HardDrive, 
  FolderPlus, 
  Upload, 
  Search, 
  Trash2, 
  ExternalLink, 
  RefreshCw, 
  FileText, 
  Image as ImageIcon, 
  Film, 
  FileCode, 
  File, 
  Check, 
  AlertCircle,
  LogIn,
  LogOut,
  Folder
} from 'lucide-react';
import { googleSignIn, getAccessToken, logoutGoogle, auth } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  iconLink?: string;
  thumbnailLink?: string;
  createdTime?: string;
  size?: string;
}

interface DriveManagerProps {
  showToast: (message: string, type?: 'success' | 'error') => void;
}

export const DriveManager: React.FC<DriveManagerProps> = ({ showToast }) => {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [newFolderName, setNewFolderName] = useState<string>('');
  const [showFolderModal, setShowFolderModal] = useState<boolean>(false);
  
  // Destructive Action Modal state (Explicit Confirmation Mandate)
  const [fileToDelete, setFileToDelete] = useState<DriveFile | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const token = await getAccessToken();
        if (token) {
          setAccessToken(token);
          fetchDriveFiles(token);
        }
      } else {
        setAccessToken(null);
        setFiles([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      setLoading(true);
      const res = await googleSignIn();
      if (res && res.accessToken) {
        setAccessToken(res.accessToken);
        showToast('تم تسجيل الدخول واستدعاء أذونات Google Drive بنجاح 🟢');
        await fetchDriveFiles(res.accessToken);
      }
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      showToast('تعذر تسجيل الدخول بـ Google: ' + (err.message || String(err)), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await logoutGoogle();
    setAccessToken(null);
    setFiles([]);
    showToast('تم تسجيل الخروج بنجاح');
  };

  const fetchDriveFiles = async (token?: string) => {
    const activeToken = token || accessToken;
    if (!activeToken) return;

    try {
      setLoading(true);
      const query = searchQuery
        ? `name contains '${searchQuery.replace(/'/g, "\\'")}' and trashed = false`
        : `trashed = false`;
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files?pageSize=30&fields=files(id,name,mimeType,webViewLink,iconLink,thumbnailLink,createdTime,size)&q=${encodeURIComponent(query)}`,
        {
          headers: {
            Authorization: `Bearer ${activeToken}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          showToast('انتهت صلاحية جلسة Google Drive. يرجى تسجيل الدخول مجدداً.', 'error');
          setAccessToken(null);
          return;
        }
        throw new Error(`خطأ من Google Drive API: ${response.statusText}`);
      }

      const data = await response.json();
      setFiles(data.files || []);
    } catch (err: any) {
      console.error('Error fetching drive files:', err);
      showToast('تعذر جلب ملفات Google Drive: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0 || !accessToken) return;

    const file = fileList[0];
    try {
      setIsUploading(true);
      const metadata = {
        name: file.name,
        mimeType: file.type,
      };

      const formData = new FormData();
      formData.append(
        'metadata',
        new Blob([JSON.stringify(metadata)], { type: 'application/json' })
      );
      formData.append('file', file);

      const res = await fetch(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink,mimeType',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        }
      );

      if (!res.ok) {
        throw new Error('فشل رفع الملف إلى Google Drive');
      }

      showToast(`تم رفع الملف "${file.name}" بنجاح إلى Google Drive 🚀`);
      fetchDriveFiles();
    } catch (err: any) {
      console.error('File Upload Error:', err);
      showToast('تعذر رفع الملف: ' + err.message, 'error');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim() || !accessToken) return;

    try {
      setLoading(true);
      const metadata = {
        name: newFolderName.trim(),
        mimeType: 'application/vnd.google-apps.folder',
      };

      const res = await fetch('https://www.googleapis.com/drive/v3/files', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metadata),
      });

      if (!res.ok) throw new Error('فشل إنشاء المجلد في Google Drive');

      showToast(`تم إنشاء المجلد "${newFolderName}" بنجاح 📁`);
      setNewFolderName('');
      setShowFolderModal(false);
      fetchDriveFiles();
    } catch (err: any) {
      showToast('خطأ أثناء إنشاء المجلد: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteFile = async () => {
    if (!fileToDelete || !accessToken) return;

    try {
      setLoading(true);
      const res = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileToDelete.id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!res.ok && res.status !== 204) {
        throw new Error('فشل حذف الملف من Google Drive');
      }

      showToast(`تم حذف "${fileToDelete.name}" من Google Drive بنجاح.`);
      setFiles((prev) => prev.filter((f) => f.id !== fileToDelete.id));
    } catch (err: any) {
      showToast('خطأ أثناء الحذف: ' + err.message, 'error');
    } finally {
      setFileToDelete(null);
      setLoading(false);
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('folder')) return <Folder className="w-5 h-5 text-amber-400" />;
    if (mimeType.includes('image')) return <ImageIcon className="w-5 h-5 text-sky-400" />;
    if (mimeType.includes('video')) return <Film className="w-5 h-5 text-purple-400" />;
    if (mimeType.includes('javascript') || mimeType.includes('json') || mimeType.includes('html'))
      return <FileCode className="w-5 h-5 text-emerald-400" />;
    if (mimeType.includes('pdf') || mimeType.includes('document'))
      return <FileText className="w-5 h-5 text-blue-400" />;
    return <File className="w-5 h-5 text-zinc-400" />;
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-zinc-900 to-teal-950/60 border border-emerald-500/30 rounded-3xl p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 shadow-inner">
              <HardDrive className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-white">إدارة Google Drive</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  سحابي ☁️
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                تصفح، رفع، وإدارة مستنداتك وسجلاتك مباشرة عبر حساب Google Drive الخاص بك في بيئة SAi.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!accessToken ? (
              <button
                onClick={handleSignIn}
                disabled={loading}
                className="bg-white hover:bg-zinc-100 text-zinc-900 font-extrabold px-4 py-2.5 rounded-2xl text-xs flex items-center gap-2 transition-all shadow-lg hover:shadow-xl"
              >
                <LogIn className="w-4 h-4 text-emerald-600" />
                <span>ربط حساب Google Drive</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-300 font-bold bg-zinc-800/80 px-3 py-1.5 rounded-xl border border-zinc-700/80 truncate max-w-[160px]">
                  {user?.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 p-2.5 rounded-xl text-xs flex items-center gap-1 transition-all border border-zinc-700"
                  title="تسجيل الخروج"
                >
                  <LogOut className="w-4 h-4 text-red-400" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Drive Workspace */}
      {accessToken ? (
        <div className="space-y-4">
          {/* Action & Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-zinc-900/80 border border-zinc-800 p-4 rounded-2xl">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="البحث في ملفات Google Drive..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchDriveFiles()}
                className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl pr-10 pl-4 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={() => fetchDriveFiles()}
                disabled={loading}
                className="p-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl transition-all border border-zinc-700 text-xs flex items-center gap-1"
                title="تحديث القائمة"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>

              <button
                onClick={() => setShowFolderModal(true)}
                className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold rounded-xl text-xs flex items-center gap-1.5 border border-zinc-700 transition-all"
              >
                <FolderPlus className="w-4 h-4 text-amber-400" />
                <span>مجلد جديد</span>
              </button>

              <label className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-black rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all">
                <Upload className="w-4 h-4" />
                <span>{isUploading ? 'جاري الرفع...' : 'رفع ملف'}</span>
                <input
                  type="file"
                  onChange={handleUploadFile}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Files List / Grid */}
          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 min-h-[300px]">
            {loading && files.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-3">
                <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
                <p className="text-xs text-zinc-400">جاري تحميل ملفات Google Drive...</p>
              </div>
            ) : files.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
                <HardDrive className="w-12 h-12 text-zinc-600" />
                <p className="text-sm font-bold text-zinc-300">لا توجد ملفات حالياً في هذه القائمة</p>
                <p className="text-xs text-zinc-500 max-w-sm">
                  يمكنك رفع المستندات أو الصور أو إنشاء مجلدات جديدة ليتم حفظها في سحابة Drive.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="p-3.5 bg-zinc-950/70 border border-zinc-800/90 rounded-xl hover:border-emerald-500/40 transition-all group flex flex-col justify-between space-y-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-zinc-900 rounded-lg shrink-0">
                        {getFileIcon(file.mimeType)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-xs font-bold text-zinc-200 truncate group-hover:text-emerald-400 transition-colors" title={file.name}>
                          {file.name}
                        </h3>
                        <p className="text-[10px] text-zinc-500 mt-0.5 truncate">
                          {file.mimeType.split('.').pop()?.toUpperCase() || 'DOCUMENT'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60 text-xs">
                      {file.webViewLink ? (
                        <a
                          href={file.webViewLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
                        >
                          <span>فتح في Drive</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-[10px] text-zinc-500">مستند سحابي</span>
                      )}

                      <button
                        onClick={() => setFileToDelete(file)}
                        className="text-zinc-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                        title="حذف الملف"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Unauthenticated State */
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-3xl p-12 text-center space-y-4 max-w-xl mx-auto">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto text-emerald-400">
            <HardDrive className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-black text-white">ربط وسائط سحابة Google Drive</h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            قم بتسجيل الدخول ببريدك الإلكتروني لمنح تطبيق SAi صلاحية قراءة وحفظ مستنداتك وتسجيلاتك بأمان على سحابتك الخاصة.
          </p>

          <button
            onClick={handleSignIn}
            disabled={loading}
            className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-black px-6 py-3 rounded-2xl text-xs flex items-center justify-center gap-2 mx-auto shadow-xl transition-all"
          >
            <LogIn className="w-4 h-4" />
            <span>تسجيل الدخول والتفويض لـ Google Drive</span>
          </button>
        </div>
      )}

      {/* New Folder Modal */}
      {showFolderModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 max-w-sm w-full space-y-4 animate-scale-up">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <FolderPlus className="w-4 h-4 text-amber-400" />
              <span>إنشاء مجلد جديد في Drive</span>
            </h3>

            <input
              type="text"
              placeholder="اسم المجلد الجديد..."
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50"
            />

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={handleCreateFolder}
                disabled={!newFolderName.trim() || loading}
                className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black py-2 rounded-xl text-xs transition-all"
              >
                إنشاء
              </button>
              <button
                onClick={() => setShowFolderModal(false)}
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-2 px-4 rounded-xl text-xs transition-all"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Explicit Destructive Action Confirmation Modal */}
      {fileToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-red-500/30 rounded-3xl p-6 max-w-md w-full space-y-4 animate-scale-up">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-2.5 bg-red-500/10 border border-red-500/30 rounded-xl">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white">تأكيد حذف الملف من Google Drive</h3>
                <p className="text-[11px] text-zinc-400">إجراء حساس يتطلب موافقتك الصريحة</p>
              </div>
            </div>

            <p className="text-xs text-zinc-300 bg-zinc-950/80 p-3 rounded-xl border border-zinc-800 leading-relaxed">
              هل أنت متأكد من رغبتك في نقل الملف <span className="font-bold text-red-400">"{fileToDelete.name}"</span> إلى السلة في Google Drive؟
            </p>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={confirmDeleteFile}
                disabled={loading}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white font-black py-2.5 rounded-xl text-xs transition-all shadow-lg shadow-red-600/20"
              >
                نعم، تأكيد الحذف
              </button>
              <button
                onClick={() => setFileToDelete(null)}
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-2.5 px-4 rounded-xl text-xs transition-all"
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

export default DriveManager;
