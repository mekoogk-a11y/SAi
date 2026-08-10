export interface UnmappedTermLog {
  id: string;
  term: string;
  contextSentence: string;
  suggestedMeaning?: string;
  userEmail?: string;
  timestamp: string;
}

const LEARNING_LOGS_KEY = 'sai_unmapped_terms_logs';

export class LearningSystemManager {

  /**
   * Log an unmapped or unrecognized Sudanese dialect term
   */
  public static logUnmappedTerm(term: string, contextSentence: string, suggestedMeaning?: string): void {
    if (!term || term.trim().length < 2) return;

    const existingLogs = this.getLoggedTerms();
    
    // Check if already logged recently
    const isAlreadyLogged = existingLogs.some(l => l.term.toLowerCase() === term.toLowerCase().trim());
    if (isAlreadyLogged) return;

    const newLog: UnmappedTermLog = {
      id: `term_log_${Date.now()}`,
      term: term.trim(),
      contextSentence: contextSentence.trim(),
      suggestedMeaning: suggestedMeaning?.trim(),
      timestamp: new Date().toISOString()
    };

    existingLogs.unshift(newLog);

    if (typeof window !== 'undefined') {
      localStorage.setItem(LEARNING_LOGS_KEY, JSON.stringify(existingLogs.slice(0, 100)));
    }
  }

  /**
   * Get list of logged unrecognized terms for learning and review
   */
  public static getLoggedTerms(): UnmappedTermLog[] {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LEARNING_LOGS_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Error loading learning logs:", e);
        }
      }
    }
    return [];
  }

  /**
   * Clear learning logs after admin review
   */
  public static clearLogs(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LEARNING_LOGS_KEY);
    }
  }
}
