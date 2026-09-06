import type { VercelRequest, VercelResponse } from '@vercel/node';
import { usedTidsMap, saveUsedTids, normalizeTid, UsedTidRecord } from './_store';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { tid, recipientName, senderName, amount, wishId, source } = req.body || {};

  if (!tid || typeof tid !== 'string') {
    return res.status(400).json({
      success: false,
      reason: 'EMPTY_TID',
      message: 'Transaction ID (TID) enter karna zaroori hai.'
    });
  }

  const normalized = normalizeTid(tid);

  if (normalized.length < 8) {
    return res.status(400).json({
      success: false,
      reason: 'INVALID_FORMAT',
      message: 'Transaction ID kam az kam 8 hinson ya characters par mushtamil honi chahiye (jaise Easypaisa 3737 ya JazzCash 8558 SMS ki 10-12 digit TID).'
    });
  }

  if (usedTidsMap.has(normalized)) {
    const existing = usedTidsMap.get(normalized)!;
    return res.status(400).json({
      success: false,
      reason: 'ALREADY_USED',
      message: `Yeh Transaction ID (${normalized}) pehle se use ho chuki hai! Har payment sirf aik celebration link ke liye valid hoti hai.`,
      usedAt: existing.usedAt,
      recipientName: existing.recipientName
    });
  }

  const newRecord: UsedTidRecord = {
    tid: normalized,
    usedAt: new Date().toISOString(),
    recipientName: recipientName || 'Celebration Recipient',
    senderName: senderName || 'Anonymous',
    amount: typeof amount === 'number' ? amount : 300,
    wishId: wishId || '',
    source: source || 'easypaisa'
  };

  usedTidsMap.set(normalized, newRecord);
  saveUsedTids();

  return res.json({
    success: true,
    status: 'VERIFIED',
    message: 'Transaction ID kamyabi se verify ho chuki hai!',
    tid: normalized,
    verifiedAt: newRecord.usedAt
  });
}
