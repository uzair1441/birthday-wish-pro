import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// Persistent storage path for verified TIDs
const DATA_DIR = path.join(process.cwd(), 'data');
const TIDS_FILE = path.join(DATA_DIR, 'used_tids.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export interface UsedTidRecord {
  tid: string;
  usedAt: string;
  recipientName?: string;
  senderName?: string;
  amount?: number;
  wishId?: string;
  source?: string;
}

const usedTidsMap = new Map<string, UsedTidRecord>();

function loadUsedTids() {
  try {
    if (fs.existsSync(TIDS_FILE)) {
      const content = fs.readFileSync(TIDS_FILE, 'utf-8');
      const records: UsedTidRecord[] = JSON.parse(content);
      usedTidsMap.clear();
      records.forEach((rec) => {
        const key = rec.tid.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
        usedTidsMap.set(key, rec);
      });
    }
  } catch (err) {
    console.error('Error loading used TIDs:', err);
  }
}

function saveUsedTids() {
  try {
    const records = Array.from(usedTidsMap.values());
    fs.writeFileSync(TIDS_FILE, JSON.stringify(records, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving used TIDs:', err);
  }
}

loadUsedTids();

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// 2. Real-time TID Verification API with Anti-Duplicate Protection
app.post('/api/verify-tid', (req, res) => {
  const { tid, recipientName, senderName, amount, wishId, source } = req.body || {};

  if (!tid || typeof tid !== 'string') {
    return res.status(400).json({
      success: false,
      reason: 'EMPTY_TID',
      message: 'Transaction ID (TID) enter karna zaroori hai.'
    });
  }

  // Normalize: Uppercase and remove any spaces/hyphens/hashes
  const normalized = tid.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');

  if (normalized.length < 8) {
    return res.status(400).json({
      success: false,
      reason: 'INVALID_FORMAT',
      message: 'Transaction ID kam az kam 8 hinson ya characters par mushtamil honi chahiye (jaise Easypaisa 3737 ya JazzCash 8558 SMS ki 10-12 digit TID).'
    });
  }

  // Check if TID was ALREADY used anywhere
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

  // Fresh TID: Mark as used instantly
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
});

// 3. Quick check without claiming
app.get('/api/check-tid/:tid', (req, res) => {
  const rawTid = req.params.tid || '';
  const normalized = rawTid.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (!normalized) {
    return res.json({ exists: false });
  }
  const isUsed = usedTidsMap.has(normalized);
  const existing = isUsed ? usedTidsMap.get(normalized) : null;
  res.json({
    exists: isUsed,
    usedAt: existing?.usedAt || null
  });
});

// 4. Get all verified TIDs log for admin/owner
app.get('/api/used-tids', (req, res) => {
  const list = Array.from(usedTidsMap.values()).sort(
    (a, b) => new Date(b.usedAt).getTime() - new Date(a.usedAt).getTime()
  );
  res.json({
    total: list.length,
    records: list
  });
});

// 5. Admin reset a TID for testing
app.post('/api/admin/reset-tid', (req, res) => {
  const { tid } = req.body || {};
  if (!tid) return res.status(400).json({ success: false });
  const normalized = String(tid).trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  const deleted = usedTidsMap.delete(normalized);
  if (deleted) {
    saveUsedTids();
  }
  res.json({ success: true, deleted });
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
