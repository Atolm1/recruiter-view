'use client';
import { useEffect } from 'react';

// Sets the localStorage flag Plausible checks before sending anything.
export default function ExcludeFromAnalytics() {
  useEffect(() => {
    try {
      window.localStorage.setItem('plausible_ignore', 'true');
    } catch {
      // Storage blocked (private mode); nothing to set.
    }
  }, []);
  return null;
}
