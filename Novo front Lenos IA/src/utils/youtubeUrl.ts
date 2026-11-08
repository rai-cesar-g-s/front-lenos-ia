const youtubeHosts = new Set(['youtube.com', 'www.youtube.com', 'm.youtube.com', 'music.youtube.com']);

export function getYouTubeId(value?: string): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password || url.port) return null;
    let id: string | null = null;
    if (url.hostname === 'youtu.be') {
      id = /^\/([^/]+)\/?$/.exec(url.pathname)?.[1] ?? null;
    } else if (youtubeHosts.has(url.hostname)) {
      id = url.pathname === '/watch' ? url.searchParams.get('v')
        : /^\/(?:shorts|live|embed|v)\/([^/]+)\/?$/.exec(url.pathname)?.[1] ?? null;
    }
    return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
  } catch {
    return null;
  }
}
