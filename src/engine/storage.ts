// Tiny persistence layer. Uses localStorage in the browser, an in-memory Map in
// Node (so engines run and are testable without a DOM). Never throws on a blocked
// or full localStorage. All keys are namespaced with the 'aitrainer:' prefix.

const PREFIX = 'aitrainer:';

const memory = new Map<string, string>();

function hasLocalStorage(): boolean {
  try {
    return typeof window !== 'undefined' && !!window.localStorage;
  } catch {
    return false;
  }
}

function rawGet(key: string): string | null {
  const full = PREFIX + key;
  if (hasLocalStorage()) {
    try {
      return window.localStorage.getItem(full);
    } catch {
      return memory.has(full) ? memory.get(full)! : null;
    }
  }
  return memory.has(full) ? memory.get(full)! : null;
}

function rawSet(key: string, value: string): void {
  const full = PREFIX + key;
  // Always keep the in-memory copy in sync so reads work even if localStorage fails.
  memory.set(full, value);
  if (hasLocalStorage()) {
    try {
      window.localStorage.setItem(full, value);
    } catch {
      // Blocked or full localStorage. The in-memory copy above is our fallback.
    }
  }
}

function rawRemove(key: string): void {
  const full = PREFIX + key;
  memory.delete(full);
  if (hasLocalStorage()) {
    try {
      window.localStorage.removeItem(full);
    } catch {
      // ignore
    }
  }
}

export function loadJSON<T>(key: string, fallback: T): T {
  const rawValue = rawGet(key);
  if (rawValue == null) return fallback;
  try {
    return JSON.parse(rawValue) as T;
  } catch {
    return fallback;
  }
}

export function saveJSON(key: string, value: unknown): void {
  try {
    rawSet(key, JSON.stringify(value));
  } catch {
    // Stringify failure (circular, etc). Never throw out of the storage layer.
  }
}

export function removeKey(key: string): void {
  rawRemove(key);
}
