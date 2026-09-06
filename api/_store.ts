import fs from 'fs';
import path from 'path';

export interface UsedTidRecord {
  tid: string;
  usedAt: string;
  recipientName?: string;
  senderName?: string;
  amount?: number;
  wishId?: string;
  source?: string;
}

// Best-effort persistence within a warm serverless instance.
// Note: Vercel functions are stateless across cold starts, so this
// in-memory + /tmp store will reset periodically. For durable
// cross-request storage, swap this for a real database (e.g. Vercel KV/Postgres).
const TIDS_FILE = path.join('/tmp', 'used_tids.json');

const globalAny = globalThis as any;
if (!globalAny.__usedTidsMap) {
  globalAny.__usedTidsMap = new Map<string, UsedTidRecord>();
  try {
    if (fs.existsSync(TIDS_FILE)) {
      const content = fs.readFileSync(TIDS_FILE, 'utf-8');
      const records: UsedTidRecord[] = JSON.parse(content);
      records.forEach((rec) => {
        const key = rec.tid.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
        globalAny.__usedTidsMap.set(key, rec);
      });
    }
  } catch (err) {
    console.error('Error loading used TIDs:', err);
  }
}

export const usedTidsMap: Map<string, UsedTidRecord> = globalAny.__usedTidsMap;

export function saveUsedTids() {
  try {
    const records = Array.from(usedTidsMap.values());
    fs.writeFileSync(TIDS_FILE, JSON.stringify(records, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving used TIDs:', err);
  }
}

export function normalizeTid(tid: string): string {
  return tid.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
}
