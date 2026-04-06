'use client';

import { useEffect } from 'react';

type Props = {
  data: Record<string, any>;
  id?: string;
};

export function ClientJsonLd({ data, id = 'json-ld' }: Props) {
  useEffect(() => {
    // Remove existing script if any
    const existing = document.getElementById(id);
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);

    return () => {
      const el = document.getElementById(id);
      if (el) el.remove();
    };
  }, [data, id]);

  return null;
}
