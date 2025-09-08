type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

type Cache<T> = Map<string, CacheEntry<T>>;

const createCache = <T>(): Cache<T> => new Map();

const isExpired = (entry: CacheEntry<unknown>): boolean => 
  Date.now() > entry.expiresAt;

const set = <T>(
  cache: Cache<T>,
  key: string,
  value: T,
  ttlMs: number
): Cache<T> => {
  const newCache = new Map(cache);
  newCache.set(key, {
    value,
    expiresAt: Date.now() + ttlMs,
  });
  return newCache;
};

const get = <T>(
  cache: Cache<T>,
  key: string
): T | undefined => {
  const entry = cache.get(key);
  if (!entry) return undefined;
  if (isExpired(entry)) {
    const newCache = new Map(cache);
    newCache.delete(key);
    return undefined;
  }
  return entry.value;
};

const remove = <T>(
  cache: Cache<T>,
  key: string
): Cache<T> => {
  const newCache = new Map(cache);
  newCache.delete(key);
  return newCache;
};

const clear = <T>(cache: Cache<T>): Cache<T> => new Map();

const cleanup = <T>(cache: Cache<T>): Cache<T> => {
  const newCache = new Map<string, CacheEntry<T>>();
  for (const [key, entry] of cache.entries()) {
    if (!isExpired(entry)) {
      newCache.set(key, entry);
    }
  }
  return newCache;
};

export const CacheService = {
  createCache,
  set,
  get,
  remove,
  clear,
  cleanup
} as const;