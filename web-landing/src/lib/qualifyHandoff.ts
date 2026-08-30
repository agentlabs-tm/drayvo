/**
 * Carries the eligibility check's answers across to the application form.
 *
 * Someone who has just answered four questions should not have to retype them,
 * and a recruiter picking up the application can triage it immediately if the
 * answers travel with it. That is the whole purpose of this module.
 *
 * PRIVACY - this is the constraint that shapes the design.
 * The check tells the reader, in the UI, that it "runs entirely in your browser"
 * and that nothing is "submitted, stored, or sent". So:
 *
 *   1. State lives in a module variable. No sessionStorage, no localStorage, no
 *      cookie - nothing that outlives the tab or could be called "stored".
 *   2. It is published only when the reader clicks through to apply. Completing
 *      the check and ignoring the result hands over nothing.
 *   3. It lands in the visible message textarea, not a hidden field, so the
 *      reader can read, edit, or delete it before anything is sent.
 *
 * Anyone extending this must keep all three properties. Persisting the answers
 * would turn a promise made in the UI into a false one.
 */

let summary: string | null = null;
const listeners = new Set<(value: string) => void>();

/**
 * Called when the reader clicks the check's call to action.
 *
 * Retained only if nothing is listening yet. Holding it after delivery would
 * let a later remount of the form refill a field the reader had cleared.
 */
export function publishQualifySummary(value: string) {
  if (listeners.size === 0) {
    summary = value;
    return;
  }
  summary = null;
  listeners.forEach((listener) => listener(value));
}

/**
 * Subscribe to hand-offs. Returns an unsubscribe function.
 *
 * Replays the pending summary on subscribe: the form may mount after the check
 * has already published (it is further down the page), and a plain event would
 * have been missed. The value is cleared once delivered so a later remount does
 * not silently refill a field the reader has since emptied.
 */
export function onQualifySummary(listener: (value: string) => void) {
  if (summary !== null) {
    const pending = summary;
    summary = null;
    listener(pending);
  }
  listeners.add(listener);
  // Braces matter: `Set.delete` returns a boolean, and React requires an effect
  // destructor to return nothing.
  return () => {
    listeners.delete(listener);
  };
}
