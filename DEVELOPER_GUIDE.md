# 📘 دليل المطور – Developer Guide
## Sudan AI (الذكاء الاصطناعي السوداني)

هذا الدليل الفني موجه للمهندسين والمطورين لاستيعاب بنية المشروع، قواعد البيانات، والعمليات الأساسية لخادم منصة Sudan AI.

---

## 📂 هيكلية المشروع (Project Structure)

```
.
├── server.ts              # خادم Express الرئيسي، محركات الذكاء الاصطناعي، وقواعد البيانات
├── metadata.json          # إعدادات وصلاحيات المنصة
├── package.json           # التبعيات والسكربتات
├── src/
│   ├── main.tsx           # نقطة مدخل تطبيق React
│   ├── App.tsx            # المكون الرئيسي للواجهات وواجهات المستخدم
│   ├── index.css          # تنسيقات Tailwind CSS الشاملة
│   └── types.ts           # الأنواع والواجهات البرمجية (TypeScript Interfaces)
└── .env.example           # المتغيرات البيئية المطلوبة
```

---

## 🗄️ قواعد البيانات (Database Architecture)

تعتمد المنصة هجين قواعد بيانات مزدوج:
1. **SQLite (`better-sqlite3`):** يُستخدم في البيئات المحلية والخوادم الدائمة.
2. **JSON DB Fallback (`db.json`):** يعمل تلقائياً كبديل آمن في بيئات الحاويات المجهولة لضمان عدم توقف الخدمات.

### الجداول الأساسية (Database Schemas):

```sql
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE,
  name TEXT,
  role TEXT DEFAULT 'user',
  plan TEXT DEFAULT 'free',
  password TEXT,
  created_at TEXT
);

CREATE TABLE IF NOT EXISTS chats (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  title TEXT,
  messages TEXT,
  created_at TEXT
);

CREATE TABLE IF NOT EXISTS favorites (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  type TEXT,
  title TEXT,
  content TEXT,
  created_at TEXT
);

CREATE TABLE IF NOT EXISTS folders (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  name TEXT,
  color TEXT,
  created_at TEXT
);

CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  title TEXT,
  content TEXT,
  type TEXT,
  created_at TEXT,
  read INTEGER DEFAULT 0
);
```

---

## ⚙️ معالجة الأخطاء ونظام التعافي التلقائي (Retry Mechanism)

تم تزويد كافة استدعاءات نماذج Gemini AI بدالة تعافي شبكي تلقائي (`withRetry`):
- تقوم بطلب إعادة المحاولة تلقائياً حتى 3 مرات متتالية عند حدوث اضطراب بالشبكة أو تجاور حدود معدل الطلبات (Rate Limits / 429).
- عند غياب المفتاح التجريبي أو تعذر الاتصال، ينتقل الخادم بسلاسة إلى محرك الردود الذكي المحلي (`generateFallbackAiToolResponse`) لضمان عدم انقطاع تجربة المستخدم.

---

## 🧪 إجراءات الجودة والاختبارات (Testing & Quality)

- **فحص الأنواع ولينت الأكواد:**
  ```bash
  npm run lint
  ```
- **البناء والتحقق من التجميع:**
  ```bash
  npm run build
  ```
