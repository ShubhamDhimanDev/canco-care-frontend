/**
 * How long the website may keep a cached API answer. Passed to `cacheLife()` in lib/api/*.
 *
 * Laravel tells the site to drop cached content the moment an editor changes it (POST /api/revalidate, tags),
 * so `revalidate` and `expire` are only the safety net for the case where that call never arrives.
 *
 * `stale` is different: it is how long a visitor's BROWSER may reuse a page it already has without asking the
 * server (the built-in profiles say 5 minutes). Next enforces a floor of 30 seconds (and anything lower is
 * left out of prerendering, which breaks the build), so 30 is as low as it goes. It only affects clicking
 * around inside one open tab; a reload or a new visit always gets what the editor last saved.
 */
export const LIVE = { stale: 30, revalidate: 3600, expire: 86400 } as const;

/** Events are shown as upcoming/past relative to "now", so they refresh a little more often. */
export const LIVE_EVENTS = { stale: 30, revalidate: 60, expire: 3600 } as const;
