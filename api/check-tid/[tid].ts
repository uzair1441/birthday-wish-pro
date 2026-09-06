import type { VercelRequest, VercelResponse } from '@vercel/node';
import { usedTidsMap, normalizeTid } from '../_store';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const rawTid = (req.query.tid as string) || '';
  const normalized = normalizeTid(rawTid);
  if (!normalized) {
    return res.json({ exists: false });
  }
  const isUsed = usedTidsMap.has(normalized);
  const existing = isUsed ? usedTidsMap.get(normalized) : null;
  res.json({
    exists: isUsed,
    usedAt: existing?.usedAt || null
  });
}
