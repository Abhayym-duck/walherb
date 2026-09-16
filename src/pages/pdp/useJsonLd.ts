// ─────────────────────────────────────────────────────────────────────────────
// useJsonLd — inject schema.org JSON-LD into document.head
//
// Vite SPA has no SSR/head manager, so we manage the <script> tags directly.
// Each mount writes a single combined ld+json block tagged with a data-attribute
// and removes it on unmount / product change, so stale schemas never linger.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect } from 'react';

const TAG = 'data-pdp-jsonld';

export function useJsonLd(schemas: object[]) {
  // Serialize once per render so the effect only re-runs when the data changes.
  const json = JSON.stringify(schemas);

  useEffect(() => {
    if (typeof document === 'undefined' || !schemas.length) return;

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute(TAG, 'true');
    script.text = json;
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [json]); // eslint-disable-line react-hooks/exhaustive-deps
}
