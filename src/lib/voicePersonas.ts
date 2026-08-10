export interface VoicePersona {
  id: string;
  name: string;
  speakerTitle: string;
  ageGroup: 'شاب' | 'متوسط العمر' | 'كبير/راوي' | 'رسمي' | 'نسائي';
  gender: 'رجل' | 'امرأة';
  tone: string;
  pitch: 'عالي' | 'متوسط' | 'منخفض';
  speed: number; // 0.8 to 1.5
  style: 'حماسي إعلاني' | 'إذاعي دافئ' | 'رسمي أكاديمي' | 'راوي قصص' | 'وثائقي فخم' | 'إخباري رصين' | 'شعر ودوبيت' | 'صوت نسائي دافئ';
  recommendedUse: string;
  samplePhrase: string;
  bgGradient: string;
  badgeColor: string;
  geminiVoiceAlias: string; // Underlying TTS voice map
  speechPitchValue: number; // Pitch value for SpeechSynthesis (0.5 - 1.5)
}

export const SUDANESE_VOICE_PERSONAS: VoicePersona[] = [
  {
    id: "sudan-abdallah",
    name: "عبد الله - صوت فخم ووقور 🎙️",
    speakerTitle: "صوت فخم ووقور ذو نبرة وثائقية عميقة",
    ageGroup: "متوسط العمر",
    gender: "رجل",
    tone: "فخم وعميق ووقور ورزين",
    pitch: "منخفض",
    speed: 0.92,
    style: "وثائقي فخم",
    recommendedUse: "الأفلام الوثائقية، السرد الشامل، التقارير الكبرى، الإعلانات الفاخرة",
    samplePhrase: "أهلاً وسهلاً بكم في منصة SAi، هنا تجتمع الفخامة والتقنية الذكية بلمسة سودانية أصيلة.",
    bgGradient: "from-emerald-600/20 to-teal-500/20",
    badgeColor: "border-emerald-500/40 text-emerald-400 bg-emerald-500/10",
    geminiVoiceAlias: "Fenrir",
    speechPitchValue: 0.82
  },
  {
    id: "sudan-mudather",
    name: "مدثر - صوت إعلاني حماسي ⚡",
    speakerTitle: "معلق إعلاني حماسي تجاري حار",
    ageGroup: "شاب",
    gender: "رجل",
    tone: "حماسي وناري ومندفع ومقنع",
    pitch: "عالي",
    speed: 1.12,
    style: "حماسي إعلاني",
    recommendedUse: "عروض التخفيضات، إعلانات السلع والمطاعم، المواسم والمناسبات",
    samplePhrase: "يا زول ألحق العروض الكبرى هسي قبل تفوت عليك! جودة انضباط وأسعار مبالغة ما بتصدق!",
    bgGradient: "from-amber-500/20 to-rose-500/20",
    badgeColor: "border-amber-500/40 text-amber-400 bg-amber-500/10",
    geminiVoiceAlias: "Fenrir",
    speechPitchValue: 1.15
  },
  {
    id: "sudan-badr",
    name: "بدر الدين - صوت هادئ وحكيم 📻",
    speakerTitle: "مذيع إذاعي هادئ وحكيم ومطمئن",
    ageGroup: "متوسط العمر",
    gender: "رجل",
    tone: "هادئ ودقيق ودافئ ومطمئن",
    pitch: "متوسط",
    speed: 0.98,
    style: "إذاعي دافئ",
    recommendedUse: "البودكاست، التقديم الإذاعي، الإرشادات، الرسائل التوعوية والتربوية",
    samplePhrase: "مرحباً بكم أصدقائي في هذه المساحة الهادئة، حيث نسعد بتقديم أحدث الحلول الذكية بكل ود وإتقان.",
    bgGradient: "from-cyan-500/20 to-blue-500/20",
    badgeColor: "border-cyan-500/40 text-cyan-400 bg-cyan-500/10",
    geminiVoiceAlias: "Charon",
    speechPitchValue: 0.95
  },
  {
    id: "sudan-ammar",
    name: "عمار - صوت شاب نشيط 🚀",
    speakerTitle: "شاب سوداني سريع ومرح وعصري",
    ageGroup: "شاب",
    gender: "رجل",
    tone: "عصري ومرح وسريع ونشيط",
    pitch: "متوسط",
    speed: 1.08,
    style: "حماسي إعلاني",
    recommendedUse: "تطبيقات التوصيل والخدمات، الألعاب، السوشيال ميديا والتسويق الرقمي",
    samplePhrase: "حبابك في عالم الذكاء الاصطناعي السريع! بضغطة زر واحدة كل طلباتك مجابة وبلمحة عين!",
    bgGradient: "from-teal-500/20 to-indigo-500/20",
    badgeColor: "border-teal-500/40 text-teal-400 bg-teal-500/10",
    geminiVoiceAlias: "Puck",
    speechPitchValue: 1.10
  },
  {
    id: "sudan-elhaj",
    name: "العم أحمد (الحاج) - راوي تراثي 📖",
    speakerTitle: "حكواتي سوداني كبير في السن دافئ الروح",
    ageGroup: "كبير/راوي",
    gender: "رجل",
    tone: "حكواتي دافئ ومعبر مليء بالوفاء والبركة",
    pitch: "منخفض",
    speed: 0.85,
    style: "راوي قصص",
    recommendedUse: "القصص التراثية والتاريخية، السير والذكريات، الروايات والأحاجي السودانية",
    samplePhrase: "كان يا ما كان في قديم الزمان، على ضفاف النيل العظيم، اجتمعت القلوب على النخوة والشهامة والكرم...",
    bgGradient: "from-orange-500/20 to-amber-600/20",
    badgeColor: "border-orange-500/40 text-orange-400 bg-orange-500/10",
    geminiVoiceAlias: "Aoede",
    speechPitchValue: 0.72
  },
  {
    id: "sudan-sara",
    name: "سارة - صوت نسائي دافئ 🌸",
    speakerTitle: "صوت نسائي سوداني راقي ولطيف",
    ageGroup: "شاب",
    gender: "امرأة",
    tone: "لطيف ودافئ وواضح ومهذب",
    pitch: "عالي",
    speed: 1.0,
    style: "صوت نسائي دافئ",
    recommendedUse: "خدمة العملاء، الردود الذكية، المساعد الشخصي، البرامج التفاعلية",
    samplePhrase: "أهلاً وسهلاً بك عزيزي، يسعدني جداً مساعدتك اليوم والإجابة على كل استفساراتك بكل حب وسرور.",
    bgGradient: "from-pink-500/20 to-rose-400/20",
    badgeColor: "border-pink-500/40 text-pink-400 bg-pink-500/10",
    geminiVoiceAlias: "Kore",
    speechPitchValue: 1.25
  },
  {
    id: "sudan-essam",
    name: "عصام - معلق تجاري 🏬",
    speakerTitle: "معلق تجاري وسوقي محترف",
    ageGroup: "متوسط العمر",
    gender: "رجل",
    tone: "موضوعي ومقنع وتجاري ناصع",
    pitch: "متوسط",
    speed: 1.02,
    style: "حماسي إعلاني",
    recommendedUse: "العقارات، الشركات، التغطيات الميدانية، المعارض والمنتجات الفاخرة",
    samplePhrase: "أبشر بالخير يا زول! فرصة العمر بين يديك هسي، امتلك الجودة والضمان الحقيقي وبأسهل الطرق.",
    bgGradient: "from-purple-500/20 to-indigo-500/20",
    badgeColor: "border-purple-500/40 text-purple-400 bg-purple-500/10",
    geminiVoiceAlias: "Fenrir",
    speechPitchValue: 0.98
  },
  {
    id: "sudan-ibrahim",
    name: "د. إبراهيم - أكاديمي ورسمي 👔",
    speakerTitle: "أستاذ أكاديمي وقارئ تقارير رسمية",
    ageGroup: "متوسط العمر",
    gender: "رجل",
    tone: "رسمي وأكاديمي وموثوق ودقيق",
    pitch: "متوسط",
    speed: 0.94,
    style: "رسمي أكاديمي",
    recommendedUse: "الأبحاث، التقارير الطبية والقانونية، المناهج التعليمية والعروض التقديمية",
    samplePhrase: "نرحب بكم في هذا التقرير الأكاديمي الشامل، حيث يستعرض النظام المؤشرات التقنية والنتائج بدقة عالية.",
    bgGradient: "from-blue-600/20 to-slate-500/20",
    badgeColor: "border-blue-500/40 text-blue-400 bg-blue-500/10",
    geminiVoiceAlias: "Kore",
    speechPitchValue: 0.90
  }
];

export class SpeechQualityEngine {

  /**
   * Optimize speech text for natural rendering across dialects and languages
   */
  public static optimizeSpeechText(text: string, personaId?: string, langCode?: string): string {
    let clean = text.trim();

    const isSudaneseDialect = !langCode || langCode === 'ar-sudanese' || (personaId && personaId.startsWith('sudan'));

    // 1. Phonetic Sudanese Dictionary Conversions ONLY for Sudanese dialect
    if (isSudaneseDialect) {
      clean = this.transformToPhoneticSudanese(clean);
      clean = this.convertNumbersToWords(clean);
    }

    // 2. Convert common acronyms
    clean = clean.replace(/\bSAi\b/gi, 'إس أي آي');
    if (!langCode || langCode.startsWith('ar')) {
      clean = clean.replace(/\bAI\b/gi, 'الذكاء الاصطناعي');
      clean = clean.replace(/\bPDF\b/gi, 'بي دي إف');
    }

    // 3. Clean punctuation symbols that mess up speech synthesis pacing
    clean = clean.replace(/!+/g, '. ')
                 .replace(/\?+/g, '؟ ')
                 .replace(/::+/g, ' ')
                 .replace(/#+/g, ' ')
                 .replace(/\*+/g, ' ')
                 .replace(/["'«»]/g, '');

    // 4. Inject natural pauses and rhythm
    clean = clean.replace(/،/g, ', ')
                 .replace(/;/g, '; ')
                 .replace(/\n+/g, '. ');

    // 5. Ensure smooth ending
    if (!clean.endsWith('.') && !clean.endsWith('؟') && !clean.endsWith('!')) {
      clean += '.';
    }

    return clean;
  }

  /**
   * Transform standard MSA terms to phonetic Sudanese dialect speech equivalents
   */
  private static transformToPhoneticSudanese(str: string): string {
    let res = str;

    const mappings: Array<[RegExp, string]> = [
      [/\bالآن\b/g, "هسّع"],
      [/\bهذا\b/g, "دا"],
      [/\bهذه\b/g, "دي"],
      [/\bهؤلاء\b/g, "ديل"],
      [/\bماذا\b/g, "شنو"],
      [/\bما الذي\b/g, "شنو الـ"],
      [/\bلماذا\b/g, "ليه"],
      [/\bكيف\b/g, "كيفن"],
      [/\bأيضاً\b/g, "كمان"],
      [/\bكثيراً\b/g, "شديد"],
      [/\bجداً\b/g, "شديد"],
      [/\bجميل\b/g, "سمح"],
      [/\bرائع\b/g, "رهيب ورهيب"],
      [/\bجيد\b/g, "زابط"],
      [/\bممتاز\b/g, "ضابط مية بالمية"],
      [/\bحسناً\b/g, "سمح"],
      [/\bنعم\b/g, "أيوا"],
      [/\bإن شاء الله\b/g, "أبشر بالخير"],
      [/\bشكراً لك\b/g, "تسلم يا غالي"],
      [/\bشكراً\b/g, "يديك العافية"],
      [/\bسوف نعمل\b/g, "حنعمل"],
      [/\bسوف نقوم\b/g, "حنقوم"],
      [/\bسوف\b/g, "حـ"],
      [/\bلا توجد\b/g, "مافي"],
      [/\bلا يوجد\b/g, "مافي"],
      [/\bلدينا\b/g, "عندنا"],
      [/\bلك\b/g, "ليك"],
      [/\bلكن\b/g, "لكين"],
      [/\bعندما\b/g, "لما"],
      [/\bليس\b/g, "مش"]
    ];

    for (const [pattern, replacement] of mappings) {
      res = res.replace(pattern, replacement);
    }

    return res;
  }

  /**
   * Helper to convert numbers to Sudanese Arabic words
   */
  public static convertNumbersToWords(str: string): string {
    return str.replace(/\b\d+\b/g, (numStr) => {
      const num = parseInt(numStr, 10);
      if (num === 0) return "صفر";
      if (num === 1) return "واحد";
      if (num === 2) return "اتنين";
      if (num === 3) return "تلاتة";
      if (num === 4) return "أربعة";
      if (num === 5) return "خمسة";
      if (num === 6) return "ستة";
      if (num === 7) return "سبعة";
      if (num === 8) return "تمنية";
      if (num === 9) return "تسعة";
      if (num === 10) return "عشرة";
      if (num === 50) return "خمسين";
      if (num === 100) return "مية";
      if (num === 1000) return "ألف";
      if (num === 2026) return "ألفين وستة وعشرين";
      return numStr;
    });
  }
}

