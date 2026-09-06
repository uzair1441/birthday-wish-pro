import type { VercelRequest, VercelResponse } from '@vercel/node';
import { usedTidsMap, saveUsedTids, normalizeTid } from '../_store';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
  const { tid } = req.body || {};
  if (!tid) return res.status(400).json({ success: false });
  const normalized = normalizeTid(String(tid));
  const deleted = usedTidsMap.delete(normalized);
  if (deleted) {
    saveUsedTids();
  }
  res.json({ success: true, deleted });
}
