import { SudaneseDictionaryManager, DictionaryEntry } from './sudaneseDictionary';

export type UserIntent = 
  | 'QUESTION'      // سؤال واستفسار
  | 'REQUEST'       // طلب خدمة أو تنفيذ
  | 'COMMAND'       // أمر مباشر
  | 'AD_COPY'       // كتابة إعلانية وتسويقية
  | 'TRANSLATION'   // ترجمة لغات أو لهجات
  | 'CHAT'          // دردشة ومسامرة ودية
  | 'POETRY'        // شعر ودوبيت ومسدار
  | 'STORY'         // قصة وحكاية ورواية
  | 'CODING'        // برمجة وأكواد وتقنية
  | 'MEDICAL'       // استشارة صحية وطبية
  | 'LEGAL'         // استشارة قانونية ورسمية
  | 'EDUCATION';    // أبحاث وتعليم ودراسة

export interface SLEAnalysisResult {
  originalText: string;
  normalizedText: string;
  isSudaneseDialect: boolean;
  dialectConfidence: number; // 0 to 100%
  matchedSudaneseTerms: DictionaryEntry[];
  detectedIntent: UserIntent;
  intentLabelAr: string;
  correctionsMade: Array<{ original: string; corrected: string; reason: string }>;
  suggestedPromptWrapper: string;
}

// Common Sudanese dialect spelling typos and fixes
const COMMON_TYPOS: Record<string, string> = {
  "ازول": "يا زول",
  "عليكالله": "عليك الله",
  "شيديد": "شديد",
  "شنوالخبر": "شنو الخبر",
  "دايرء": "داير",
  "هصي": "هسي", "هسع": "هسي",
  "حبابكعشرة": "حبابك عشرة",
  "ماسخ": "ماسخ",
  "دايرن": "دايرين",
  "عايزن": "عايزين",
  "ياحبيب": "يا حبيب",
  "يااخوي": "يا أخوي",
  "ياابوي": "يا أبوي"
};

export class SudaneseLanguageEngine {
  
  /**
   * Pre-process user text through the Sudanese Language Engine layer
   */
  public static process(text: string): SLEAnalysisResult {
    const originalText = text.trim();
    if (!originalText) {
      return this.emptyResult(originalText);
    }

    // 1. Correct Typos & Normalization
    const { normalizedText, correctionsMade } = this.correctAndNormalize(originalText);

    // 2. Vocabulary & Dialect Detection
    const matchedTerms = this.extractMatchedTerms(normalizedText);

    // Calculate dialect confidence percentage
    const dialectConfidence = this.calculateDialectConfidence(normalizedText, matchedTerms);
    const isSudaneseDialect = dialectConfidence > 25;

    // 3. Intent Detection
    const detectedIntent = this.detectIntent(normalizedText);
    const intentLabelAr = this.getIntentLabelAr(detectedIntent);

    // 4. Construct Prompt Wrapper for LLM / Gemini
    const suggestedPromptWrapper = this.constructSystemPromptWrapper(normalizedText, detectedIntent, isSudaneseDialect);

    return {
      originalText,
      normalizedText,
      isSudaneseDialect,
      dialectConfidence,
      matchedSudaneseTerms: matchedTerms,
      detectedIntent,
      intentLabelAr,
      correctionsMade,
      suggestedPromptWrapper
    };
  }

  /**
   * Correct common Sudanese dialect typos & normalize whitespace/punctuation
   */
  public static correctAndNormalize(text: string): { normalizedText: string; correctionsMade: Array<{ original: string; corrected: string; reason: string }> } {
    let current = text;
    const correctionsMade: Array<{ original: string; corrected: string; reason: string }> = [];

    // Replace known typo patterns
    Object.entries(COMMON_TYPOS).forEach(([typo, fix]) => {
      if (current.includes(typo)) {
        current = current.replaceAll(typo, fix);
        correctionsMade.push({
          original: typo,
          corrected: fix,
          reason: "تصحيح إملائي تلقائي للهجة السودانية"
        });
      }
    });

    // Normalize repeated punctuation (e.g. !!!! -> !)
    current = current.replace(/!{2,}/g, '!').replace(/\?{2,}/g, '؟').replace(/؟{2,}/g, '؟');

    // Clean multiple spaces
    current = current.replace(/\s+/g, ' ').trim();

    return { normalizedText: current, correctionsMade };
  }

  /**
   * Extract dictionary term matches
   */
  private static extractMatchedTerms(text: string): DictionaryEntry[] {
    const words = text.split(/\s+/);
    const matches: DictionaryEntry[] = [];
    const seenIds = new Set<string>();

    words.forEach(w => {
      const found = SudaneseDictionaryManager.findExactOrPartial(w);
      if (found && !seenIds.has(found.id)) {
        seenIds.add(found.id);
        matches.push(found);
      }
    });

    return matches;
  }

  /**
   * Calculate probability confidence of Sudanese dialect
   */
  private static calculateDialectConfidence(text: string, matchedTerms: DictionaryEntry[]): number {
    let score = matchedTerms.length * 20;

    // Keywords check
    const sudaneseKeywords = [
      "شنو", "يا زول", "زول", "هسي", "داير", "عايز", "عليك الله", "سمح", "شديد",
      "حبابك", "أبشر", "عوجة", "دق سدر", "حنك", "شمار", "قاعد", "مارق", "بالحيل",
      "يا حبيب", "ود عمي", "آي", "كر علي", "ساهل"
    ];

    sudaneseKeywords.forEach(kw => {
      if (text.includes(kw)) score += 15;
    });

    return Math.min(100, Math.max(0, score));
  }

  /**
   * Detect Intent from Text
   */
  public static detectIntent(text: string): UserIntent {
    const t = text.toLowerCase();

    if (t.includes("كود") || t.includes("برمجة") || t.includes("function") || t.includes("python") || t.includes("javascript") || t.includes("خطأ في") || t.includes("دالة") || t.includes("موقع") || t.includes("app")) {
      return 'CODING';
    }
    if (t.includes("إعلان") || t.includes("تسويق") || t.includes("عرض خاص") || t.includes("تخفيض") || t.includes("افتتاح") || t.includes("منتج") || t.includes("بيع") || t.includes("شراء")) {
      return 'AD_COPY';
    }
    if (t.includes("قصيدة") || t.includes("شعر") || t.includes("دوبيت") || t.includes("مسدار") || t.includes("أبيات") || t.includes("قافية")) {
      return 'POETRY';
    }
    if (t.includes("قصة") || t.includes("حكاية") || t.includes("رواية") || t.includes("احكي لي") || t.includes("سيرة")) {
      return 'STORY';
    }
    if (t.includes("ترجم") || t.includes("ترجمة") || t.includes("معنى كلمة") || t.includes("بالإنجليزية") || t.includes("بالعربي")) {
      return 'TRANSLATION';
    }
    if (t.includes("علاج") || t.includes("دواء") || t.includes("أعراض") || t.includes("طبيب") || t.includes("مرض") || t.includes("صحة")) {
      return 'MEDICAL';
    }
    if (t.includes("قانون") || t.includes("محكمة") || t.includes("عقد") || t.includes("دعوى") || t.includes("دستور")) {
      return 'LEGAL';
    }
    if (t.includes("بحث") || t.includes("امتحان") || t.includes("شرح درس") || t.includes("جامعة") || t.includes("دراسة") || t.includes("مدرسة")) {
      return 'EDUCATION';
    }
    if (t.startsWith("كيف") || t.startsWith("شنو") || t.startsWith("ليه") || t.startsWith("متين") || t.startsWith("وين") || t.includes("؟") || t.includes("هل")) {
      return 'QUESTION';
    }
    if (t.includes("اعمل لي") || t.includes("أنشئ") || t.includes("صمم") || t.includes("اكتب لي") || t.includes("غير") || t.includes("عدل")) {
      return 'REQUEST';
    }

    return 'CHAT';
  }

  /**
   * Get Arabic Label for Intent
   */
  public static getIntentLabelAr(intent: UserIntent): string {
    const labels: Record<UserIntent, string> = {
      QUESTION: "سؤال واستفسار ❓",
      REQUEST: "طلب تنفيذ أو إنشاء 🛠️",
      COMMAND: "أمر مباشر ⚡",
      AD_COPY: "كتابة إعلانية وتسويقية 📢",
      TRANSLATION: "ترجمة وتفسير لغوي 🌐",
      CHAT: "محادثة ودردشة سودانية 💬",
      POETRY: "شعر ودوبيت ومسدار 📜",
      STORY: "قصة وحكاية ورواية 📖",
      CODING: "برمجة وتطوير أكواد 💻",
      MEDICAL: "استشارة صحية وطبية 🩺",
      LEGAL: "استشارة قانونية ورسمية ⚖️",
      EDUCATION: "تعليم وأبحاث أكاديمية 📚"
    };
    return labels[intent] || "محادثة عامة 💬";
  }

  /**
   * Construct System Prompt Wrapper for Gemini API with SAi persona
   */
  public static constructSystemPromptWrapper(text: string, intent: UserIntent, isSudanese: boolean): string {
    let contextHeader = `أنت (SAi) - المساعد الذكي السوداني الفائق والمنصة الشاملة للذكاء الاصطناعي المبتكرة بواسطة الباحث والمهندس كمال جعفر زكريا (Kamal Gafar Zakaria).\n`;
    
    if (isSudanese) {
      contextHeader += `المستخدم يتحدث باللهجة السودانية العذبة والمحببة.\nأجب بأسلوب سوداني أصيل، راقٍ، مفعم بالدفء، والترحاب، ويجمع بين الذكاء العلمي والدقة اللغوية، مع استخدام عبارات سودانية راقية (مثل: أهلاً يا زول، حبابك عشرة، أبشر بالخير، سمح شديد، مافي أي عوجة، انضباط عالي).\n`;
    } else {
      contextHeader += `أجب بلغة عربية فصيحة، سلسة، ومتقنة مع لمسة من الدفء والترحاب السوداني الأصيل والهوية المتميزة.\n`;
    }

    contextHeader += `نوع الطلب/النية المكتشفة: ${this.getIntentLabelAr(intent)}.\n`;
    contextHeader += `قدم إجابة منظمة، دقيقة، مبنية بأسلوب عالمي ومفهومة مباشرة.\n`;
    contextHeader += `نص المستخدم: "${text}"`;

    return contextHeader;
  }

  private static emptyResult(text: string): SLEAnalysisResult {
    return {
      originalText: text,
      normalizedText: text,
      isSudaneseDialect: false,
      dialectConfidence: 0,
      matchedSudaneseTerms: [],
      detectedIntent: 'CHAT',
      intentLabelAr: 'محادثة عامة 💬',
      correctionsMade: [],
      suggestedPromptWrapper: text
    };
  }
}
