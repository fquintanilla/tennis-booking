type LogContext = Record<string, unknown>;

/**
 * Centralized application logging. Keep provider integrations here so callers
 * do not need to change when observability tooling is added.
 */
export const logger = {
  error(message: string, error?: unknown, context?: LogContext) {
    console.error(message, { error, ...context });
  },

  warn(message: string, context?: LogContext) {
    console.warn(message, context);
  },

  info(message: string, context?: LogContext) {
    console.info(message, context);
  },
};
