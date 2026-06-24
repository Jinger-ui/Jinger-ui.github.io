'use client';

import { useEffect, useState } from 'react';
import { EyeIcon } from '@heroicons/react/24/outline';
import { useMessages } from '@/lib/i18n/useMessages';

const COUNT_API_BASE = 'https://countapi.mileshilliard.com/api/v1';
const SESSION_STORAGE_KEY = 'prism-visitor-counted';

interface VisitorCountProps {
  counterKey: string;
}

export default function VisitorCount({ counterKey }: VisitorCountProps) {
  const messages = useMessages();
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function recordAndFetch() {
      try {
        const alreadyCounted = sessionStorage.getItem(SESSION_STORAGE_KEY) === counterKey;
        const action = alreadyCounted ? 'get' : 'hit';

        if (!alreadyCounted) {
          sessionStorage.setItem(SESSION_STORAGE_KEY, counterKey);
        }

        const response = await fetch(
          `${COUNT_API_BASE}/${action}/${encodeURIComponent(counterKey)}`
        );

        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as { value?: number };
        if (!cancelled && typeof data.value === 'number') {
          setCount(data.value);
        }
      } catch {
        // Counter is optional; fail silently if the API is unreachable.
      }
    }

    recordAndFetch();

    return () => {
      cancelled = true;
    };
  }, [counterKey]);

  if (count === null) {
    return null;
  }

  return (
    <p
      className="text-xs text-neutral-400 dark:text-neutral-500 flex items-center justify-center gap-1.5 mt-3 pt-3 border-t border-neutral-200/40 dark:border-neutral-700/40"
      aria-label={`${messages.footer.visitors}: ${count}`}
    >
      <EyeIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>
        {messages.footer.visitors}: {count.toLocaleString()}
      </span>
    </p>
  );
}
