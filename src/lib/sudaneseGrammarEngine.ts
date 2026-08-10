import { SudaneseLanguageEngine } from './sudaneseLanguageEngine';

export interface GrammarCorrectionResult {
  original: string;
  improved: string;
  changesSummary: string[];
  fushaVersion: string;
  sudaneseDialectVersion: string;
  adCopyVersion: string;
}

export class SudaneseGrammarEngine {

  /**
   * Refines Sudanese text, fixes grammar errors, normalizes punctuation and returns multiple stylistic variants.
   */
  public static processText(input: string): GrammarCorrectionResult {
    const text = input.trim();
    if (!text) {
      return {
        original: input,
        improved: input,
        changesSummary: [],
        fushaVersion: input,
        sudaneseDialectVersion: input,
        adCopyVersion: input
      };
    }

    const { normalizedText, correctionsMade } = SudaneseLanguageEngine.correctAndNormalize(text);

    // Build changes summary
    const changesSummary = correctionsMade.map(c => `تم تحسين: "${c.original}" إلى "${c.corrected}"`);

    // Generate Stylistic Versions
    const fushaVersion = this.convertToFusha(normalizedText);
    const sudaneseDialectVersion = this.convertToSudaneseDialect(normalizedText);
    const adCopyVersion = this.convertToAdCopy(normalizedText);

    return {
      original: text,
      improved: normalizedText,
      changesSummary,
      fushaVersion,
      sudaneseDialectVersion,
      adCopyVersion
    };
  }

  /**
   * Convert Sudanese dialect phrasing to clear Standard Arabic (Fusha)
   */
  public static convertToFusha(text: string): string {
    let result = text;
    
    const replacements: Record<string, string> = {
      "يا زول": "يا صديقي العزيز",
      "زول": "شخص",
      "شنو": "ماذا",
      "هسي": "الآن",
      "هسع": "في الوقت الحالي",
      "داير": "أريد",
      "عايز": "أرغب في",
      "شديد": "جداً",
      "سمح": "جميل وممتاز",
      "عليك الله": "أرجوك كرمًا",
      "عوجة": "مشكلة",
      "مافي عوجة": "لا توجد أي مشكلة",
      "حبابك": "مرحباً بك",
      "أبشر": "من دواعي سروري",
      "بالحيل": "بالتأكيد",
      "قاعد": "مستمر في",
      "مارق": "ذاهب إلى الخارج"
    };

    Object.entries(replacements).forEach(([sud, fus]) => {
      result = result.replaceAll(sud, fus);
    });

    return result;
  }

  /**
   * Convert Standard Arabic phrasing to warm Sudanese Dialect
   */
  public static convertToSudaneseDialect(text: string): string {
    let result = text;

    const replacements: Record<string, string> = {
      "أهلاً وسهلاً": "حبابك عشرة بلا كشرة يا زول",
      "مرحباً بك": "حبابك ألف يا حبيب",
      "ماذا تريد": "شنو الدايرو يا زول؟",
      "الآن": "هسي",
      "جداً": "شديد",
      "جميل جداً": "سمح شديد وبسحر العين",
      "أنا أريد": "أنا داير",
      "لا توجد مشكلة": "مافي أي عوجة تب",
      "ممتاز": "انضباط عالي",
      "بالتأكيد": "بالحيل يا زول",
      "سوف أساعدك": "أبشر بالخير طلبك مجاب هسي"
    };

    Object.entries(replacements).forEach(([fus, sud]) => {
      result = result.replaceAll(fus, sud);
    });

    if (!result.includes("يا زول") && !result.includes("أبشر") && !result.includes("حبابك")) {
      result = `يا زول أبشر بالخير! ${result} ومافي أي عوجة!`;
    }

    return result;
  }

  /**
   * Convert text into enthusiastic Sudanese Advertising Copy (نص إعلاني سوداني حماسي)
   */
  public static convertToAdCopy(text: string): string {
    let base = this.convertToSudaneseDialect(text);
    return `🔥 أبشر بالخير يا زول! ${base} ⚡ ألحق العرض هسي والفرصة ما بتتكرر! اتصل بنا الآن واستمتع بالأفضل! 🚀`;
  }
}
