# 📡 توثيق واجهات البرمجة (API Documentation)
## Sudan AI – الذكاء الاصطناعي السوداني

جميع الواجهات تُستدعى عبر البرتوكول HTTP/HTTPS على المسار `/api/*`.

---

### 1. توليد الصوت السوداني الإعلاني
- **المسار:** `POST /api/generate-voice`
- **الجسم (Body):**
  ```json
  {
    "text": "النص الإعلاني المراد نطقة",
    "voice": "Fenrir",
    "tone": "حماسي جداً وناري ومثير للإنتباه",
    "speed": 1.1,
    "pitch": 1.0
  }
  ```
- **الاستجابة:**
  ```json
  {
    "audioUrl": "data:audio/mp3;base64,...",
    "script": "النص الإعلاني المحسن بالعامية السودانية",
    "isFallback": false
  }
  ```

---

### 2. الدردشة الذكية الشاملة
- **المسار:** `POST /api/chat`
- **الجسم (Body):**
  ```json
  {
    "messages": [
      { "role": "user", "text": "مرحباً يا زول، ساعدني في كتابة كود Python" }
    ]
  }
  ```
- **الاستجابة:**
  ```json
  {
    "reply": "الرد الذكي المنظم المنسق بـ Markdown",
    "isFallback": false
  }
  ```

---

### 3. تحليل المرفقات والمستندات
- **المسار:** `POST /api/upload-document`
- **الجسم (Body):**
  ```json
  {
    "fileName": "تقرير_المبيعات.pdf",
    "fileType": "pdf",
    "textContent": "نص المستند المعالج..."
  }
  ```
- **الاستجابة:**
  ```json
  {
    "summary": "ملخص تنفيذي رائع مع جداول إحصائية واستنتاجات محورية",
    "isFallback": false
  }
  ```

---

### 4. الخدمات الاستشارية المتخصصة
- **المسار:** `POST /api/specialized-ai`
- **الجسم (Body):**
  ```json
  {
    "service": "agriculture | medical | engineering | document | translate | summarize | code | study | business",
    "content": "نص الاستفسار أو البيانات المدخلة",
    "config": {}
  }
  ```
- **الاستجابة:**
  ```json
  {
    "result": "التحليل الاستشاري التخصصي المعتمد",
    "isFallback": false
  }
  ```

---

### 5. إدارة المجلدات (Folders API)
- **جلب المجلدات:** `GET /api/folders/:userId`
- **إنشاء مجلد:** `POST /api/folders`
- **حذف مجلد:** `DELETE /api/folders/:id`

---

### 6. البحث في المحادثات المحفوظة
- **المسار:** `GET /api/chats/search/:userId?q=كلمة_البحث`
- **الاستجابة:** مصفوفة المحادثات المطابقة لنص البحث.

---

### 7. الإحصائيات ولوحة الإدارة
- **المسار:** `GET /api/admin/stats`
- **الاستجابة:**
  ```json
  {
    "totalUsers": 1284,
    "totalChats": 18450,
    "activeUsersToday": 342,
    "storageUsedMb": 124.5
  }
  ```
