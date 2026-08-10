export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  module: string;
  message: string;
  details?: any;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 100;

  public log(level: LogLevel, module: string, message: string, details?: any) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      module,
      message,
      details,
    };

    this.logs.unshift(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.pop();
    }

    const formattedMsg = `[SAi ${level.toUpperCase()}][${module}] ${message}`;
    if (level === 'error') {
      console.error(formattedMsg, details || '');
    } else if (level === 'warn') {
      console.warn(formattedMsg, details || '');
    } else if (level === 'info') {
      console.log(formattedMsg, details || '');
    } else {
      console.debug(formattedMsg, details || '');
    }
  }

  public info(module: string, message: string, details?: any) {
    this.log('info', module, message, details);
  }

  public warn(module: string, message: string, details?: any) {
    this.log('warn', module, message, details);
  }

  public error(module: string, message: string, details?: any) {
    this.log('error', module, message, details);
  }

  public getLogs(): LogEntry[] {
    return this.logs;
  }

  public clearLogs() {
    this.logs = [];
  }
}

export const logger = new Logger();
