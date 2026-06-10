// React hooks for screens. Wave 2 and Wave 3 consume these. Browser only.

import { useState, useEffect, useCallback } from 'react';
import type { ProgressState, TasteProfile, InterestTag } from './types';
import { getProgress, subscribeProgress } from './progress';
import { getTasteProfile, topInterests } from './taste';

// Subscribes to progress and re-renders on any mutation.
export function useProgress(): ProgressState {
  const [state, setState] = useState<ProgressState>(() => getProgress());

  useEffect(() => {
    // Re-sync on mount in case progress changed before this hook subscribed.
    setState(getProgress());
    const unsubscribe = subscribeProgress(setState);
    return unsubscribe;
  }, []);

  return state;
}

// Reads taste. Because recordInterest does not broadcast, we expose a refresh so
// a screen can pull the latest profile after recording an event.
export function useTaste(): {
  profile: TasteProfile;
  top: (n?: number) => InterestTag[];
  refresh: () => void;
} {
  const [profile, setProfile] = useState<TasteProfile>(() => getTasteProfile());

  const refresh = useCallback(() => {
    setProfile(getTasteProfile());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const top = useCallback((n?: number) => topInterests(n), []);

  return { profile, top, refresh };
}
