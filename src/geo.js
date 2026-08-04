// Hero-eyebrow geo-personalization.
// -----------------------------------------------------------------------------
// Cloudflare populates request.cf.latitude/longitude from the edge location
// that terminated the connection — no external geolocation service needed.
// We use it to show the visitor whichever one of our three service-area
// cities is actually closest to them, instead of listing all three. Visitors
// outside the service area (or with no cf geo data, e.g. local dev) get a
// generic fallback rather than a wrong or empty city claim.
//
// This is IP-based ("where they are"), not search-based — Google strips
// search-query terms before they reach destination sites, so there is no
// way to know what someone typed into the search bar. The full three-city
// list stays in the <title>, meta description, and JSON-LD schema so SEO
// relevance for all three cities is unaffected by this per-visitor swap.

const CITIES = [
  { name: 'Kalamazoo', lat: 42.2917, lon: -85.5872 },
  { name: 'Battle Creek', lat: 42.3211, lon: -85.1797 },
  { name: 'Grand Rapids', lat: 42.9634, lon: -85.6681 },
];

// Covers the service area plus surrounding towns (Portage, Comstock Park,
// etc.) without reaching into a neighboring city's own metro.
const MAX_DISTANCE_MILES = 25;

const FALLBACK_EYEBROW = 'Serving Southwest Michigan';

function haversineMiles(lat1, lon1, lat2, lon2) {
  const R = 3958.8; // Earth radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function heroEyebrowFor(cf) {
  const lat = cf && cf.latitude != null ? parseFloat(cf.latitude) : NaN;
  const lon = cf && cf.longitude != null ? parseFloat(cf.longitude) : NaN;

  if (Number.isNaN(lat) || Number.isNaN(lon)) {
    return FALLBACK_EYEBROW;
  }

  let nearest = null;
  let nearestDist = Infinity;
  for (const city of CITIES) {
    const dist = haversineMiles(lat, lon, city.lat, city.lon);
    if (dist < nearestDist) {
      nearest = city;
      nearestDist = dist;
    }
  }

  if (!nearest || nearestDist > MAX_DISTANCE_MILES) {
    return FALLBACK_EYEBROW;
  }

  return `${nearest.name}, MI`;
}
