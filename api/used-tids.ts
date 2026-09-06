import type { VercelRequest, VercelResponse } from '@vercel/node';
import { usedTidsMap } from './_store';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const list = Array.from(usedTidsMap.values()).sort(
    (a, b) => new Date(b.usedAt).getTime() - new Date(a.usedAt).getTime()
  );
  res.json({
    total: list.length,
    records: list
  });
}
