// Vercel Serverless Function Handler for /api/wishes
// Supports saving and retrieving wishes when deployed on Vercel

// In-memory cache for serverless instances
const globalStore = globalThis._wishesStore || new Map();
globalThis._wishesStore = globalStore;

function generateShortId() {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query || {};

  if (req.method === 'POST') {
    try {
      const wishData = req.body;
      if (!wishData) {
        return res.status(400).json({ success: false, message: 'No body provided' });
      }

      let shortId = generateShortId();
      while (globalStore.has(shortId)) {
        shortId = generateShortId();
      }

      const payload = {
        ...wishData,
        id: wishData.id || shortId,
        shortId,
        createdAt: new Date().toISOString()
      };

      globalStore.set(shortId, payload);

      const host = req.headers.host || 'localhost:3000';
      const protocol = req.headers['x-forwarded-proto'] || 'https';
      const shortUrl = `${protocol}://${host}/?w=${shortId}`;

      return res.status(200).json({
        success: true,
        id: shortId,
        shortUrl
      });
    } catch (e) {
      return res.status(500).json({ success: false, message: e.message });
    }
  }

  if (req.method === 'GET') {
    const wishId = id || req.url.split('/').pop().split('?')[0];
    if (!wishId || wishId === 'wishes') {
      return res.status(400).json({ success: false, message: 'ID required' });
    }

    const wish = globalStore.get(wishId);
    if (!wish) {
      return res.status(404).json({ success: false, message: 'Wish not found' });
    }

    return res.status(200).json({ success: true, wish });
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' });
}
