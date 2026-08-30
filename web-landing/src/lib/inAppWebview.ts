/**
 * Detects an iOS in-app browser (a WKWebView hosted by another app) as opposed
 * to Safari itself.
 *
 * WHY THIS EXISTS
 * Telegram's webview declares a top content inset on its scroll view. WebKit
 * honours that by positioning `position: fixed` *and* `position: sticky`
 * elements below the inset, so a pinned header is painted roughly 60px lower
 * than the top of the visible area, and page content scrolls through the strip
 * left above it. The page cannot see this: `getBoundingClientRect().top`
 * reports 0, `visualViewport.offsetTop` reports 0, and every safe-area inset
 * resolves to 0. Measured on iOS 18.6 / WebKit 605.1.15 - `fixed` and `sticky`
 * were displaced by an identical amount while normal flow content and a
 * `bottom: 0` bar rendered correctly.
 *
 * Since the symptom is invisible to JavaScript, the environment has to be
 * detected instead, and that detection is necessarily a heuristic.
 *
 * HOW RELIABLE IS THIS
 * Not fully. Telegram's user-agent is indistinguishable from mobile Safari, so
 * this leans on injected globals and the WKWebView message bridge, which are
 * implementation details of the host app and can change without notice.
 *
 * It is built to fail safe in both directions:
 *   - False negative (we miss a webview): the header stays pinned and that user
 *     sees the strip. Exactly today's behaviour, no worse.
 *   - False positive (we flag Safari): the header scrolls with the page on a
 *     phone. A downgrade, not a breakage - and the sticky bottom action bar
 *     still carries the primary CTA.
 * Nothing here affects desktop, Android, or any non-WebKit browser.
 *
 * If Telegram changes and this stops matching, the symptom returns rather than
 * anything breaking. Re-check with /diag.html, which prints every signal below.
 */

/** Signals this build looks for. Kept exported so /diag.html reports the same list. */
export function collectSignals(): Record<string, boolean> {
  if (typeof window === 'undefined') return {};
  const w = window as unknown as Record<string, unknown>;
  const ua = navigator.userAgent;
  const webkit = w.webkit as { messageHandlers?: unknown } | undefined;

  return {
    // Platform gate. iPadOS reports a desktop UA, hence the touch-point check.
    isIOS:
      /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1),

    // Telegram injects these into its webview; Safari never has them.
    telegramProxy: 'TelegramWebviewProxy' in w || 'TelegramWebviewProxyProto' in w,
    telegramGlobal: 'Telegram' in w,

    /**
     * The WKWebView script-message bridge. Present when a host app has
     * installed a message handler, absent in Safari. The broadest signal here
     * and the one most likely to catch Instagram, Facebook, and the rest -
     * but also the one most likely to be absent if Telegram injects only into
     * an isolated content world.
     */
     wkMessageHandlers: !!webkit && typeof webkit.messageHandlers === 'object',

    // Apps that do identify themselves in the user-agent.
    uaNamedApp: /\bFBAN\/|\bFBAV\/|Instagram|Line\/|MicroMessenger|GSA\/|OKApp|TikTok/.test(ua),

    // Safari proper sets this only for home-screen web apps, never for in-app
    // browsers; useful for telling a standalone PWA apart from a webview.
    standalone: (navigator as unknown as { standalone?: boolean }).standalone === true,
  };
}

/**
 * True when the header should not be pinned, because pinning it in this
 * environment produces the misplaced-header strip described above.
 */
export function isAffectedWebview(): boolean {
  const s = collectSignals();
  if (!s.isIOS) return false;
  if (s.standalone) return false; // Home-screen PWA: fixed positioning is fine.
  return s.telegramProxy || s.telegramGlobal || s.wkMessageHandlers || s.uaNamedApp;
}

/** Attribute stamped on <html> so styling can key off it without prop drilling. */
export const WEBVIEW_ATTR = 'data-inapp-webview';
