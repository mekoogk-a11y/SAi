export interface DictionaryEntry {
  id: string;
  word: string;
  fushaEquivalent: string;
  meaning: string;
  context: 'عامي' | 'شبابي' | 'رسمي' | 'إعلاني' | 'شعبي' | 'قديم' | 'تراثي';
  phonetics: string;
  region: 'الخرطوم' | 'الوسط والجزيرة' | 'الشمالية' | 'كردفان' | 'دارفور' | 'الشرق' | 'عامة السودان';
  synonyms: string[];
  plural?: string;
  conjugations?: string[];
  examples: string[];
  category: 'ترحيب وتحية' | 'تعبير وحماس' | 'وصف وأخلاق' | 'حياة يومية' | 'طعام ومناسبات' | 'تجارة وسوق' | 'أمثال وحكم' | 'شبابي';
}

export const INITIAL_SUDANESE_DICTIONARY: DictionaryEntry[] = [
  {
    id: "sud_001",
    word: "زول",
    fushaEquivalent: "شخص / إنسان / رجل",
    meaning: "تعبير سوداني اصيل يطلق على الشخص العاقل أو الإنسان، وتستعمل للتعظيم والمودة",
    context: "عامي",
    phonetics: "Zool",
    region: "عامة السودان",
    synonyms: ["زلمة", "شخص", "إنسان"],
    plural: "زولين / أزوال",
    conjugations: ["يا زول", "الزول دا", "زولنا"],
    examples: ["يا زول أبشر بالخير", "الزول دا سمح وخدوم شديد"],
    category: "ترحيب وتحية"
  },
  {
    id: "sud_002",
    word: "شديد",
    fushaEquivalent: "جداً / ممتاز / قوي",
    meaning: "تُستخدم للتوكيد والتعظيم بمعنى ممتاز جداً أو قوي ومتمكن",
    context: "إعلاني",
    phonetics: "Shadeed",
    region: "عامة السودان",
    synonyms: ["جداً", "قوي", "مافي كلام"],
    examples: ["الموقع دا سريع شديد", "الشغل دا انضباط شديد"],
    category: "تعبير وحماس"
  },
  {
    id: "sud_003",
    word: "حبابك",
    fushaEquivalent: "مرحباً بك / أهلاً وسهلاً",
    meaning: "عبارة ترحيبية سودانية عريقة تعبر عن الكرم والدفء في الاستقبال",
    context: "شعبي",
    phonetics: "Hababak",
    region: "عامة السودان",
    synonyms: ["مرحب بيك", "أهلاً", "حبابك عشرة"],
    examples: ["حبابك عشرة بلا كشرة في بيتك الثاني"],
    category: "ترحيب وتحية"
  },
  {
    id: "sud_004",
    word: "هسي / هسع",
    fushaEquivalent: "الآن / في هذه اللحظة",
    meaning: "تظرف زمان يشير إلى الوقت الحالي والسرعة الاستجابة",
    context: "عامي",
    phonetics: "Hasi / Hasaa",
    region: "عامة السودان",
    synonyms: ["الآن", "في التو", "هسيكتوي"],
    examples: ["نزل التطبيق هسي واستمتع بالميزات", "التنفيذ ببدأ هسي"],
    category: "حياة يومية"
  },
  {
    id: "sud_005",
    word: "شنو",
    fushaEquivalent: "ماذا / ما هو",
    meaning: "اسم استفهام يستعلم به عن الأشياء والأخبار",
    context: "عامي",
    phonetics: "Sheno",
    region: "عامة السودان",
    synonyms: ["ماذا", "إيه", "شنو الخبر"],
    examples: ["شنو الخبر الليلة؟", "شنو رأيك في الخدمة الجديدة؟"],
    category: "حياة يومية"
  },
  {
    id: "sud_006",
    word: "داير / عايز",
    fushaEquivalent: "أريد / أرغب في",
    meaning: "اسم فاعل يعبر عن الرغبة والطلب المباشر",
    context: "عامي",
    phonetics: "Daayir / Aayiz",
    region: "عامة السودان",
    synonyms: ["أريد", "أحتاج", "طالب"],
    plural: "دايرين / عايزين",
    examples: ["أنا داير أعمل إعلان جديد", "دايرين شغل انضباط"],
    category: "تجارة وسوق"
  },
  {
    id: "sud_007",
    word: "سمح",
    fushaEquivalent: "جميل / حسَن / طيب",
    meaning: "تصف كل ما هو جميل ورائع وطيب الخلق أو المظهر",
    context: "عامي",
    phonetics: "Samah",
    region: "عامة السودان",
    synonyms: ["جميل", "حلو", "ممتاز"],
    plural: "سمحين",
    examples: ["الكلام دا سمح شديد", "تصميم سمح ومرتب"],
    category: "وصف وأخلاق"
  },
  {
    id: "sud_008",
    word: "انضباط",
    fushaEquivalent: "متقن / على أكمل وجه",
    meaning: "مصطلح شبابي وإعلاني يعبر عن الإتقان التام والجودة الخارقة",
    context: "شبابي",
    phonetics: "Indibaat",
    region: "الخرطوم",
    synonyms: ["متقن", "فنان", "مظبوط"],
    examples: ["الصوت دا طلع انضباط عالي", "شغل انضباط شديد"],
    category: "تعبير وحماس"
  },
  {
    id: "sud_009",
    word: "عليك الله",
    fushaEquivalent: "أرجوك / بالله عليك",
    meaning: "أسلوب رجاء وتودد سوداني راقي مستمد من القسم بالله للمودة",
    context: "عامي",
    phonetics: "Alaik Allah",
    region: "عامة السودان",
    synonyms: ["بالله عليك", "أرجوك"],
    examples: ["عليك الله اشركني معاك في المشروعات"],
    category: "ترحيب وتحية"
  },
  {
    id: "sud_010",
    word: "دقّ سدر",
    fushaEquivalent: "تعهد بالمسؤولية / تحمّل الأمانة بثبات",
    meaning: "تعبير يدل على النخوة والشهامة والتعهد بإنجاز المهام الصعبة",
    context: "شعبي",
    phonetics: "Daq Sidir",
    region: "عامة السودان",
    synonyms: ["تعهد", "وعد", "التزم"],
    examples: ["الفريق دقّ سدر ووفر الخدمة مجاناً للجميع"],
    category: "وصف وأخلاق"
  },
  {
    id: "sud_011",
    word: "عوجة",
    fushaEquivalent: "مشكلة / خطب / عائق",
    meaning: "تشير إلى الضرر أو العائق، وتقال في حلف النفي (مافي عوجة) للتطمين",
    context: "عامي",
    phonetics: "Awja",
    region: "عامة السودان",
    synonyms: ["مشكلة", "عائق", "ضرر"],
    examples: ["مافي أي عوجة تب، الأمور كلها طيبة ومستقرة"],
    category: "حياة يومية"
  },
  {
    id: "sud_012",
    word: "حَنَك",
    fushaEquivalent: "موضوع / فكرة / خطة / أسلوب حديث",
    meaning: "كلمة معاصرة تعني الفكرة الذكية أو الموضوع الجاري مناقشته",
    context: "شبابي",
    phonetics: "Hanak",
    region: "الخرطوم",
    synonyms: ["فكرة", "موضوع", "خطط"],
    plural: "حنكات",
    examples: ["شنو الحنك الليلة؟", "الحنك دا خطير شديد"],
    category: "شبابي"
  },
  {
    id: "sud_013",
    word: "شَمار",
    fushaEquivalent: "أخبار خفية / كواليس / أسرار",
    meaning: "تُطلق مجازاً على الأخبار والسوالف والتفاصيل المستجدة",
    context: "عامي",
    phonetics: "Shamar",
    region: "عامة السودان",
    synonyms: ["أخبار", "كواليس", "سوالف"],
    examples: ["شنو الشمار الجديد؟", "الذكاء الاصطناعي جاب الشمار كله"],
    category: "حياة يومية"
  },
  {
    id: "sud_014",
    word: "كسر ثلج",
    fushaEquivalent: "مجاملة مفرطة / تلطيف الأجواء",
    meaning: "تعبير يتناول التودد والمجاملة الزائدة أو كسر جمود الحديث",
    context: "شبابي",
    phonetics: "Kasar Thalj",
    region: "عامة السودان",
    synonyms: ["مجاملة", "تلطيف"],
    examples: ["الزول دا بكسر ثلج عشان الخدمة تجيه أسرع"],
    category: "تعبير وحماس"
  },
  {
    id: "sud_015",
    word: "أبشر",
    fushaEquivalent: "أبشر بالخير / من دواعي سروري",
    meaning: "كلمة نخوة سودانية تعني الجاهزية التامة لتلبية الطلب برحابة صدر",
    context: "شعبي",
    phonetics: "Absher",
    region: "عامة السودان",
    synonyms: ["من عيوني", "تم", "حاضر"],
    examples: ["أبشر يا زول طلبك مجاب هسي"],
    category: "ترحيب وتحية"
  },
  {
    id: "sud_016",
    word: "بالحيل",
    fushaEquivalent: "بالتأكيد / جداً / بكل قوة",
    meaning: "تأكيد جازم ومحبب للموافقة القوية والدعم الكامل",
    context: "تراثي",
    phonetics: "Bel-Heel",
    region: "عامة السودان",
    synonyms: ["نعم", "تأكيد", "بالتأكيد"],
    examples: ["دايرين الذكاء الاصطناعي سوداني؟ - بالحيل والفضل والخير"],
    category: "أمثال وحكم"
  },
  {
    id: "sud_017",
    word: "قاعد",
    fushaEquivalent: "مستمر / يتواجد / قائم على الأمر",
    meaning: "فعل استمرار يفيد أن الشيء مستمر وفي أتم الجاهزية",
    context: "عامي",
    phonetics: "Gaaid",
    region: "عامة السودان",
    synonyms: ["مستمر", "موجود", "شغال"],
    examples: ["النظام قاعد يفكر ويحلل الأكواد بسرعة"],
    category: "حياة يومية"
  },
  {
    id: "sud_018",
    word: "مارق",
    fushaEquivalent: "خارج / ذاهب إلى الخارج",
    meaning: "تُستخدم للذهاب أو الخروج نحو مشوار أو سفر",
    context: "عامي",
    phonetics: "Maariq",
    region: "عامة السودان",
    synonyms: ["خارج", "رايح"],
    examples: ["أنا مارق السوق هسي"],
    category: "حياة يومية"
  }
];

// LocalStorage Persistence Key
const DICTIONARY_STORAGE_KEY = 'sai_sudanese_dictionary_v2';

export class SudaneseDictionaryManager {
  private static entries: DictionaryEntry[] = [];

  public static initialize(): DictionaryEntry[] {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(DICTIONARY_STORAGE_KEY);
      if (saved) {
        try {
          this.entries = JSON.parse(saved);
          return this.entries;
        } catch (e) {
          console.error("Failed parsing saved dictionary, falling back to initial.", e);
        }
      }
    }
    this.entries = [...INITIAL_SUDANESE_DICTIONARY];
    return this.entries;
  }

  public static getAllEntries(): DictionaryEntry[] {
    if (this.entries.length === 0) {
      this.initialize();
    }
    return this.entries;
  }

  public static addEntry(entry: Omit<DictionaryEntry, 'id'>): DictionaryEntry {
    const newEntry: DictionaryEntry = {
      ...entry,
      id: `sud_custom_${Date.now()}`
    };
    this.entries.unshift(newEntry);
    this.saveToStorage();
    return newEntry;
  }

  public static search(query: string, categoryFilter?: string, regionFilter?: string): DictionaryEntry[] {
    const all = this.getAllEntries();
    const q = query.trim().toLowerCase();

    return all.filter(item => {
      const matchesQuery = !q || 
        item.word.toLowerCase().includes(q) ||
        item.fushaEquivalent.toLowerCase().includes(q) ||
        item.meaning.toLowerCase().includes(q) ||
        item.synonyms.some(s => s.toLowerCase().includes(q));

      const matchesCat = !categoryFilter || categoryFilter === 'الكل' || item.category === categoryFilter;
      const matchesRegion = !regionFilter || regionFilter === 'الكل' || item.region === regionFilter;

      return matchesQuery && matchesCat && matchesRegion;
    });
  }

  public static findExactOrPartial(word: string): DictionaryEntry | undefined {
    const all = this.getAllEntries();
    const cleanWord = word.trim().replace(/^[وائبف]/, ''); // Clean prefix conjunctions
    return all.find(e => e.word === word || e.word === cleanWord || e.synonyms.includes(word));
  }

  private static saveToStorage() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(DICTIONARY_STORAGE_KEY, JSON.stringify(this.entries));
    }
  }
}
