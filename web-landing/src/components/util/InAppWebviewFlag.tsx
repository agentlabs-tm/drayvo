'use client';

import * as React from 'react';
import { WEBVIEW_ATTR, isAffectedWebview } from '@/lib/inAppWebview';

/**
 * Stamps `data-inapp-webview` on <html> when the page is running inside an iOS
 * in-app browser whose content inset displaces pinned headers. Styling keys off
 * the attribute (see Header and Hero), so no component has to thread the state
 * through props and no extra render is triggered anywhere else on the page.
 *
 * Runs in an effect rather than during render on purpose: the server has no
 * user-agent-dependent output here, so the markup React hydrates against is
 * identical for every visitor and the attribute is added afterwards. Doing this
 * during render would be a hydration mismatch.
 *
 * Renders nothing.
 */
export default function InAppWebviewFlag() {
  React.useEffect(() => {
    if (!isAffectedWebview()) return;
    const root = document.documentElement;
    root.setAttribute(WEBVIEW_ATTR, '');
    return () => root.removeAttribute(WEBVIEW_ATTR);
  }, []);

  return null;
}
