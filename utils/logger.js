/*
 * IMPORTS
 */
import debug from 'debug';

/*
 * DEBUG LOGGING UTILITY
 */
export const createLogger = (namespace) => {
  return debug(`app:${namespace}`);
};

/*
 * PRE-CONFIGURED LOGGERS
 */
export const _ServerLog = createLogger('server');
export const _DatabaseLog = createLogger('database');
export const _AuthLog = createLogger('auth');
export const _ChatLog = createLogger('chat');
export const _LLMLog = createLogger('llm');
export const _KafkaLog = createLogger('kafka');
export const _ErrorLog = createLogger('error');

/*
 * EXPORTS
 */
export default createLogger;
