/**
 * AdSense script loader — add once in root layout
 * Replace data-ad-client with your actual publisher ID
 */
export function AdSenseScript() {
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  if (!publisherId) return null;

  return (
    <script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
      crossOrigin="anonymous"
    />
  );
}
