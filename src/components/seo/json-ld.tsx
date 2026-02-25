/**
 * Generic JSON-LD script injector (Server Component)
 *
 * Safe: data is serialized from our own structured-data builders,
 * never from user input. JSON.stringify produces valid JSON without
 * HTML special characters that could break out of a script tag.
 *
 * Usage: <JsonLd data={buildCarJsonLd(vehicle, modelName)} />
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  // JSON.stringify is inherently safe for script[type=application/ld+json]
  // because JSON encoding escapes all special characters (< > & etc.)
  const jsonString = JSON.stringify(data);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonString }}
    />
  );
}
