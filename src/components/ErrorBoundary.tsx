import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by SAi ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4 font-sans" dir="rtl">
          <div className="max-w-md w-full bg-zinc-900/90 border border-emerald-500/30 rounded-3xl p-6 text-center space-y-5 shadow-2xl backdrop-blur-xl animate-fade-in">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto text-emerald-400">
              <AlertTriangle className="w-8 h-8 animate-bounce" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-black text-white">عذراً، حدث خطأ غير متوقع في الواجهة 🇸🇩</h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                تم تفعيل نظام الحماية الذاتية في منصة SAi. لا تقلق، بياناتك ومحادثاتك محفوظة بآمان.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-zinc-950/80 rounded-2xl border border-zinc-800 text-right text-[11px] font-mono text-zinc-400 overflow-x-auto max-h-32">
                <p className="font-bold text-red-400 mb-1">{this.state.error.name}: {this.state.error.message}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-zinc-950 font-black py-3 px-4 rounded-2xl text-xs hover:from-emerald-400 hover:to-teal-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <RefreshCw className="w-4 h-4" />
                <span>إعادة تحميل الصفحة</span>
              </button>

              <button
                onClick={() => {
                  window.location.href = '/';
                }}
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold py-3 px-4 rounded-2xl text-xs transition-all flex items-center justify-center gap-2 border border-zinc-700"
              >
                <Home className="w-4 h-4" />
                <span>الرئيسية</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
