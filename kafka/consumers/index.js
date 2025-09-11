/*
 * IMPORTS
 */
import { initAccountConsumer } from './accountDeleted.js';

/*
 * EXPORTS
 */
export async function initConsumers() {
  // Start all consumers in parallel
  await Promise.all([initAccountConsumer()]);
}
