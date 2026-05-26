/** MIME type for site favicon from file extension (supports animated GIF). */
export function faviconMimeType(href: string): string {
  const path = href.split('?')[0].toLowerCase();
  if (path.endsWith('.gif')) return 'image/gif';
  if (path.endsWith('.png')) return 'image/png';
  if (path.endsWith('.webp')) return 'image/webp';
  if (path.endsWith('.ico')) return 'image/x-icon';
  return 'image/svg+xml';
}
