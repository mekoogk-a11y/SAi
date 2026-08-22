import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Mic2, 
  ImageIcon, 
  MessageSquare, 
  Sparkles, 
  TrendingUp, 
  Activity, 
  RotateCcw, 
  Layers, 
  PieChart as PieChartIcon, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import { computeUsageStats, getStoredLogs, resetUsageStats, UsageStatsSummary, OperationLog } from '../lib/usageStats';

interface DashboardStatsProps {
  setActiveView: (view: string) => void;
  showToast?: (msg: string, type?: 'success' | 'error') => void;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ setActiveView, showToast }) => {
  const [stats, setStats] = useState<UsageStatsSummary>(computeUsageStats());
  const [recentLogs, setRecentLogs] = useState<OperationLog[]>([]);
  const [chartType, setChartType] = useState<'bar' | 'area'>('bar');
  const [activeFilter, setActiveFilter] = useState<'all' | 'voice' | 'image' | 'chat'>('all');

  const refreshData = () => {
    const s = computeUsageStats();
    setStats(s);
    setRecentLogs(getStoredLogs().slice(0, 6));
  };

  useEffect(() => {
    refreshData();

    // Listen to custom live events
    const handleOp = () => {
      refreshData();
    };

    window.addEventListener('sai_operation_recorded', handleOp);
    window.addEventListener('storage', handleOp);

    return () => {
      window.removeEventListener('sai_operation_recorded', handleOp);
      window.removeEventListener('storage', handleOp);
    };
  }, []);

  const handleReset = () => {
    if (confirm('هل تريد إعادة تهيئة سجل وإحصائيات العمليات؟')) {
      resetUsageStats();
      refreshData();
      if (showToast) showToast('تمت إعادة ضبط إحصائيات العمليات بنجاح 🔄');
    }
  };

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/95 border border-zinc-700/80 p-3 rounded-xl shadow-2xl backdrop-blur-md text-right space-y-1.5 min-w-[140px]">
          <p className="text-xs font-black text-emerald-400 border-b border-zinc-800 pb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-3 text-[11px]">
              <span className="font-extrabold text-white">{entry.value}</span>
              <span className="font-bold text-zinc-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                {entry.name}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Filter logs
  const filteredLogs = recentLogs.filter(log => {
    if (activeFilter === 'all') return true;
    return log.type === activeFilter;
  });

  return (
    <div className="space-y-6 animate-fade-in" id="dashboard-stats-section">
      
      {/* Top Header Card */}
      <div className="bg-zinc-950 border border-zinc-800/90 rounded-3xl p-5 md:p-7 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1 text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold shadow-sm mb-1">
              <Activity className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
              <span>مؤشرات أداء ومعالجة الذكاء الاصطناعي</span>
            </div>
            <h2 className="text-lg md:text-xl font-black text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              لوحة إحصائيات العمليات المنفذة (DashboardStats)
            </h2>
            <p className="text-xs text-zinc-300">
              تتبع فوري ومحلي لجميع عمليات المنصة: الأصوات الإعلانية، توليد وتعديل الصور، والمحادثات والدروس الذكية.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={refreshData}
              className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-bold text-zinc-200 hover:text-white transition-all flex items-center gap-1.5 shadow-sm"
              title="تحديث البيانات"
            >
              <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
              <span>تحديث</span>
            </button>
            <button
              onClick={handleReset}
              className="px-3 py-2 rounded-xl bg-zinc-900/60 hover:bg-red-950/40 border border-zinc-800 hover:border-red-500/40 text-xs font-bold text-zinc-400 hover:text-red-300 transition-all flex items-center gap-1.5"
              title="إعادة ضبط الإحصائيات"
            >
              <span>إعادة ضبط</span>
            </button>
          </div>
        </div>

        {/* 4 Summary Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mt-6">
          
          {/* Total Operations */}
          <div className="p-4 rounded-2xl bg-black border border-zinc-800 hover:border-emerald-500/40 transition-all group shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-zinc-400">إجمالي العمليات</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-105 transition-transform">
                <Zap className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">{stats.total}</span>
              <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30">
                +{stats.todayCount} اليوم
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 mt-1">عملية ذكاء اصطناعي مكتملة</p>
          </div>

          {/* Voice Operations */}
          <div 
            onClick={() => setActiveView('studio')}
            className="p-4 rounded-2xl bg-black border border-zinc-800 hover:border-emerald-500/50 transition-all group shadow-md cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-zinc-400">الأصوات الإعلانية 🎙️</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-105 transition-transform">
                <Mic2 className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-white">{stats.voiceCount}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
            </div>
            <p className="text-[10px] text-zinc-400 mt-1">توليد نصوص بصوت سوداني حماسي</p>
          </div>

          {/* Image Operations */}
          <div 
            onClick={() => setActiveView('image-gen')}
            className="p-4 rounded-2xl bg-black border border-zinc-800 hover:border-purple-500/50 transition-all group shadow-md cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-zinc-400">توليد وتعديل الصور 🎨</span>
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 group-hover:scale-105 transition-transform">
                <ImageIcon className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-white">{stats.imageCount}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-purple-400 transition-colors" />
            </div>
            <p className="text-[10px] text-zinc-400 mt-1">صور وتصاميم سينمائية 8K</p>
          </div>

          {/* Chat & Tutor Operations */}
          <div 
            onClick={() => setActiveView('chat')}
            className="p-4 rounded-2xl bg-black border border-zinc-800 hover:border-cyan-500/50 transition-all group shadow-md cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-zinc-400">الدردشة والدروس 💬</span>
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:scale-105 transition-transform">
                <MessageSquare className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-white">{stats.chatCount}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-cyan-400 transition-colors" />
            </div>
            <p className="text-[10px] text-zinc-400 mt-1">محادثات ذكية ودروس Tutor</p>
          </div>

        </div>

      </div>

      {/* Dual Charts Row: Trend Line/Bar + Category Distribution Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Main Chart (Bar / Area Trend) - 2 Columns */}
        <div className="lg:col-span-2 bg-zinc-950 border border-zinc-800/90 rounded-3xl p-5 md:p-6 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800/80 pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs md:text-sm font-black text-white">نشاط المعالجة الأسبوعي (صوت، صور، دردشة)</h3>
            </div>

            <div className="flex items-center bg-black p-1 rounded-xl border border-zinc-800">
              <button
                onClick={() => setChartType('bar')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  chartType === 'bar' ? 'bg-emerald-500 text-black font-black' : 'text-zinc-400 hover:text-white'
                }`}
              >
                أعمدة بيانية (Bar)
              </button>
              <button
                onClick={() => setChartType('area')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  chartType === 'area' ? 'bg-emerald-500 text-black font-black' : 'text-zinc-400 hover:text-white'
                }`}
              >
                مساحي متصل (Area)
              </button>
            </div>
          </div>

          {/* Recharts Container */}
          <div className="w-full h-64 md:h-72">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'bar' ? (
                <BarChart data={stats.weekData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222226" vertical={false} />
                  <XAxis dataKey="day" stroke="#71717a" fontSize={11} tickLine={false} />
                  <YAxis stroke="#71717a" fontSize={11} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    wrapperStyle={{ paddingTop: '10px', fontSize: '11px' }}
                    formatter={(val) => <span className="text-zinc-200 font-bold">{val}</span>} 
                  />
                  <Bar dataKey="voice" name="صوت إعلاني 🎙️" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="image" name="توليد صور 🎨" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="chat" name="دردشة ودروس 💬" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : (
                <AreaChart data={stats.weekData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVoice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorImage" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorChat" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222226" vertical={false} />
                  <XAxis dataKey="day" stroke="#71717a" fontSize={11} tickLine={false} />
                  <YAxis stroke="#71717a" fontSize={11} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    wrapperStyle={{ paddingTop: '10px', fontSize: '11px' }}
                    formatter={(val) => <span className="text-zinc-200 font-bold">{val}</span>} 
                  />
                  <Area type="monotone" dataKey="voice" name="صوت إعلاني 🎙️" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorVoice)" />
                  <Area type="monotone" dataKey="image" name="توليد صور 🎨" stroke="#8b5cf6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorImage)" />
                  <Area type="monotone" dataKey="chat" name="دردشة ودروس 💬" stroke="#06b6d4" strokeWidth={2.5} fillOpacity={1} fill="url(#colorChat)" />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie / Donut Chart - 1 Column */}
        <div className="bg-zinc-950 border border-zinc-800/90 rounded-3xl p-5 md:p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
            <div className="flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-purple-400" />
              <h3 className="text-xs md:text-sm font-black text-white">توزيع العمليات حسب القسم</h3>
            </div>
            <span className="text-[10px] font-black px-2 py-0.5 rounded bg-black border border-zinc-800 text-zinc-300">
              100% محلي
            </span>
          </div>

          {/* Pie Container */}
          <div className="w-full h-48 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.categoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={72}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#09090b" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend Items Breakdown */}
          <div className="space-y-1.5">
            {stats.categoryDistribution.map((item, idx) => {
              const percentage = stats.total > 0 ? Math.round((item.value / stats.total) * 100) : 0;
              return (
                <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-black border border-zinc-800/80 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="font-bold text-white text-[11px]">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2 font-black">
                    <span className="text-zinc-200">{item.value}</span>
                    <span className="text-[10px] text-zinc-400">({percentage}%)</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>

      {/* Recent Operations Log & Navigation Quick Actions */}
      <div className="bg-zinc-950 border border-zinc-800/90 rounded-3xl p-5 md:p-6 shadow-xl space-y-4">
        
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800/80 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs md:text-sm font-black text-white">سجل العمليات الحديثة المكتملة</h3>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-black p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                activeFilter === 'all' ? 'bg-emerald-500 text-black font-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              الكل
            </button>
            <button
              onClick={() => setActiveFilter('voice')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                activeFilter === 'voice' ? 'bg-emerald-500 text-black font-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              أصوات 🎙️
            </button>
            <button
              onClick={() => setActiveFilter('image')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                activeFilter === 'image' ? 'bg-emerald-500 text-black font-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              صور 🎨
            </button>
            <button
              onClick={() => setActiveFilter('chat')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                activeFilter === 'chat' ? 'bg-emerald-500 text-black font-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              دردشة 💬
            </button>
          </div>
        </div>

        {/* Log List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredLogs.map((log) => {
            const isVoice = log.type === 'voice';
            const isImage = log.type === 'image';
            const isChat = log.type === 'chat';

            const iconBg = isVoice 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
              : isImage 
              ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
              : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';

            const Icon = isVoice ? Mic2 : isImage ? ImageIcon : MessageSquare;
            const targetView = isVoice ? 'studio' : isImage ? 'image-gen' : 'chat';

            return (
              <div 
                key={log.id} 
                onClick={() => setActiveView(targetView)}
                className="p-3.5 rounded-2xl bg-black border border-zinc-800/80 hover:border-emerald-500/40 transition-all flex items-center justify-between gap-3 group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl border ${iconBg} shrink-0 group-hover:scale-105 transition-transform`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="text-right space-y-0.5">
                    <h4 className="text-xs font-extrabold text-white group-hover:text-emerald-300 transition-colors">
                      {log.title}
                    </h4>
                    {log.details && (
                      <p className="text-[10px] text-zinc-400">{log.details}</p>
                    )}
                  </div>
                </div>

                <div className="text-left shrink-0">
                  <span className="text-[9px] text-zinc-400 block">
                    {new Date(log.timestamp).toLocaleTimeString('ar-SD', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="text-[9px] text-emerald-400 font-bold group-hover:underline inline-flex items-center gap-0.5">
                    فتح الأداة <ArrowUpRight className="w-2.5 h-2.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
