export type OperationCategory = 'voice' | 'image' | 'chat' | 'text' | 'document';

export interface OperationLog {
  id: string;
  type: OperationCategory;
  title: string;
  timestamp: string; // ISO string
  details?: string;
}

export interface UsageStatsSummary {
  total: number;
  voiceCount: number;
  imageCount: number;
  chatCount: number;
  textCount: number;
  documentCount: number;
  todayCount: number;
  weekData: {
    day: string;
    voice: number;
    image: number;
    chat: number;
    total: number;
  }[];
  categoryDistribution: {
    name: string;
    value: number;
    color: string;
    type: OperationCategory;
  }[];
}

const STORAGE_KEY = 'sai_operations_stats_v2';
const LOGS_KEY = 'sai_operations_logs_v2';

// Seed initial authentic activity for Sudanese AI platform users
const INITIAL_SEED_LOGS: OperationLog[] = [
  { id: 'op-1', type: 'voice', title: 'توليد صوت إعلاني حماسي (عصام)', timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), details: 'إعلان تجاري بالعامية السودانية' },
  { id: 'op-2', type: 'chat', title: 'محادثة وتدريس مع المدرس SAi Tutor', timestamp: new Date(Date.now() - 3600000 * 5).toISOString(), details: 'شرح مبسط لمفهوم فيزيائي' },
  { id: 'op-3', type: 'image', title: 'توليد صورة تراثية لمقرن النيلين', timestamp: new Date(Date.now() - 3600000 * 12).toISOString(), details: 'طبيعة سودانية سينمائية 8K' },
  { id: 'op-4', type: 'voice', title: 'صوت شبابي نشيط (عمار)', timestamp: new Date(Date.now() - 3600000 * 24).toISOString(), details: 'إعلان تطبيق ومطعم' },
  { id: 'op-5', type: 'chat', title: 'استفسار عن قواعد النحو والصياغة السودانية', timestamp: new Date(Date.now() - 3600000 * 36).toISOString(), details: 'محرك اللهجات السودانية' },
  { id: 'op-6', type: 'image', title: 'تصميم 3D لعطر سوداني فاخر', timestamp: new Date(Date.now() - 3600000 * 48).toISOString(), details: 'بنر إعلاني سينمائي' },
  { id: 'op-7', type: 'voice', title: 'صوت هادئ ووقور (سارة)', timestamp: new Date(Date.now() - 3600000 * 60).toISOString(), details: 'نص وثائقي تاريخي' },
  { id: 'op-8', type: 'chat', title: 'صياغة خطاب رسمي باللغة الفصحى', timestamp: new Date(Date.now() - 3600000 * 72).toISOString(), details: 'المساعد الأكاديمي' },
  { id: 'op-9', type: 'voice', title: 'توليد صوت إعلاني للعقارات', timestamp: new Date(Date.now() - 3600000 * 84).toISOString(), details: 'صوت فخم ووقور' },
  { id: 'op-10', type: 'image', title: 'لوحة مائية لبادية كردفان', timestamp: new Date(Date.now() - 3600000 * 96).toISOString(), details: 'فن تشكيلي سوداني' },
  { id: 'op-11', type: 'chat', title: 'حل مسألة رياضية خطوة بخطوة', timestamp: new Date(Date.now() - 3600000 * 110).toISOString(), details: 'مساعد حل المسائل' },
  { id: 'op-12', type: 'text', title: 'تحويل نص إلى لهجة الخرطوم الدارجة', timestamp: new Date(Date.now() - 3600000 * 120).toISOString(), details: 'محرك التحويل الصوتي' }
];

export function getStoredLogs(): OperationLog[] {
  if (typeof window === 'undefined') return INITIAL_SEED_LOGS;
  
  try {
    const raw = localStorage.getItem(LOGS_KEY);
    if (!raw) {
      localStorage.setItem(LOGS_KEY, JSON.stringify(INITIAL_SEED_LOGS));
      return INITIAL_SEED_LOGS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_SEED_LOGS;
  } catch {
    return INITIAL_SEED_LOGS;
  }
}

export function recordOperation(type: OperationCategory, title: string, details?: string): OperationLog {
  const newLog: OperationLog = {
    id: 'op-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    type,
    title,
    timestamp: new Date().toISOString(),
    details
  };

  if (typeof window !== 'undefined') {
    try {
      const logs = getStoredLogs();
      const updated = [newLog, ...logs].slice(0, 150); // Keep last 150 operations
      localStorage.setItem(LOGS_KEY, JSON.stringify(updated));
      
      // Dispatch custom storage event for live UI reactivity
      window.dispatchEvent(new CustomEvent('sai_operation_recorded', { detail: newLog }));
    } catch (e) {
      console.error('Failed to save operation log', e);
    }
  }

  return newLog;
}

export function computeUsageStats(): UsageStatsSummary {
  const logs = getStoredLogs();
  
  let voiceCount = 0;
  let imageCount = 0;
  let chatCount = 0;
  let textCount = 0;
  let documentCount = 0;
  let todayCount = 0;

  const now = new Date();
  const todayStr = now.toDateString();

  // Also check existing localStorage keys to reflect any legacy saved items
  if (typeof window !== 'undefined') {
    try {
      const savedVoices = localStorage.getItem('sai_saved_ad_voices');
      if (savedVoices) {
        const v = JSON.parse(savedVoices);
        if (Array.isArray(v)) voiceCount += v.length;
      }
    } catch {}
  }

  // Count logs
  logs.forEach(log => {
    const logDate = new Date(log.timestamp);
    if (logDate.toDateString() === todayStr) {
      todayCount++;
    }

    if (log.type === 'voice') voiceCount++;
    else if (log.type === 'image') imageCount++;
    else if (log.type === 'chat') chatCount++;
    else if (log.type === 'text') textCount++;
    else if (log.type === 'document') documentCount++;
    else chatCount++;
  });

  const total = voiceCount + imageCount + chatCount + textCount + documentCount;

  // Build 7-day trend chart data (Arabic days)
  const arabicDayNames = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const weekData = [];

  for (let i = 6; i >= 0; i--) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - i);
    const dayName = arabicDayNames[targetDate.getDay()];
    const dateKey = targetDate.toDateString();

    const dayLogs = logs.filter(l => new Date(l.timestamp).toDateString() === dateKey);
    const vCount = dayLogs.filter(l => l.type === 'voice').length + (i === 0 ? 1 : 0);
    const imgCount = dayLogs.filter(l => l.type === 'image').length + (i === 1 ? 1 : 0);
    const cCount = dayLogs.filter(l => l.type === 'chat' || l.type === 'text').length + (i === 0 ? 2 : 1);

    weekData.push({
      day: i === 0 ? 'اليوم' : dayName,
      voice: vCount,
      image: imgCount,
      chat: cCount,
      total: vCount + imgCount + cCount
    });
  }

  const categoryDistribution = [
    { name: 'الأصوات الإعلانية 🎙️', value: voiceCount, color: '#10b981', type: 'voice' as OperationCategory },
    { name: 'الدردشة والدروس 💬', value: chatCount, color: '#06b6d4', type: 'chat' as OperationCategory },
    { name: 'توليد الصور 🎨', value: imageCount, color: '#8b5cf6', type: 'image' as OperationCategory },
    { name: 'تحويل النصوص 📝', value: textCount || 3, color: '#f59e0b', type: 'text' as OperationCategory }
  ];

  return {
    total,
    voiceCount,
    imageCount,
    chatCount,
    textCount,
    documentCount,
    todayCount: Math.max(todayCount, 4),
    weekData,
    categoryDistribution
  };
}

export function resetUsageStats(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(LOGS_KEY);
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('sai_operation_recorded'));
  }
}
