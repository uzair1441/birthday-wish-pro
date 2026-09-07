import { BirthdayWishData } from '../types';
import LZString from 'lz-string';
import { generateWhatsAppCardDataUrl } from './whatsappShare';

/**
 * Resizes and compresses any uploaded memory photo to a crisp, lightweight JPEG
 * so it never inflates memory, storage, or URLs.
 */
export function compressImage(file: File, maxWidth = 450, quality = 0.72): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      if (!src) {
        resolve('');
        return;
      }
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxWidth || height > maxWidth) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxWidth) / height);
            height = maxWidth;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        } else {
          resolve(src);
        }
      };
      img.onerror = () => resolve(src);
      img.src = src;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}

/**
 * Generates an ultra-short, clean birthday celebration link.
 * 1. Tries server/serverless API (/api/wishes) to generate a 6-character clean ID (e.g. ?w=k7x9m)
 * 2. If running completely static on Vercel/GitHub Pages without backend, falls back to
 *    an ultra-compact LZ-compressed URL (?c=...) that is ~95% smaller than raw base64.
 */
export async function createShortWishLink(data: BirthdayWishData): Promise<string> {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
  const cleanPath = pathname.endsWith('/') ? pathname : `${pathname}/`;

  // Always save to local history immediately
  saveWishToHistory(data);

  // 1. Try backend/serverless short ID storage with celebratory card picture
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);

    // Pre-generate the celebration card image as JPEG data URL for WhatsApp preview
    let cardImage: string | undefined;
    try {
      cardImage = await generateWhatsAppCardDataUrl({
        recipientName: data.recipientName,
        senderName: data.senderName,
        age: data.age,
        shareUrl: ''
      }, 'image/jpeg', 0.85);
    } catch {
      // Non-blocking fallback
    }

    const payload = {
      ...data,
      cardImage: cardImage || undefined
    };

    const res = await fetch('/api/wishes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const json = await res.json();
      if (json.success && json.id) {
        // Also cache locally by this short ID
        try {
          localStorage.setItem(`wish_id_${json.id}`, JSON.stringify(data));
        } catch {
          // Ignore
        }
        return `${origin}${cleanPath}?w=${json.id}`;
      }
    }
  } catch {
    // Backend not available (e.g. offline or static deployment without serverless)
  }

  // 2. Fallback: Ultra-compact LZ-String compression
  const compactCode = compressWishToCompact(data);
  return `${origin}${cleanPath}?c=${compactCode}`;
}

/**
 * Minifies and compresses wish data with LZ-String into a URL-safe compact slug.
 */
export function compressWishToCompact(data: BirthdayWishData): string {
  try {
    // Map to single-letter keys to eliminate JSON boilerplate
    const minified: Record<string, any> = {
      r: data.recipientName || '',
      s: data.senderName || '',
      rel: data.relationship || '',
      age: data.age || 0,
      c: data.cakeStyle || 'chocolate-fudge',
      t: data.theme || 'midnight-magic',
      m: data.message || '',
      h: data.headline || '',
      song: data.musicTrack || 'birthday-classic',
      stk: data.selectedStickers || [],
      sec: data.secretMessage || '',
      bal: data.enablePopBalloons ? 1 : 0,
      cut: data.enableCutCake ? 1 : 0,
      unw: data.enableUnwrapGift ? 1 : 0,
      cnf: data.enableConfettiPopper ? 1 : 0,
      p: data.isPaid ? 1 : 0,
      tx: data.transactionId || '',
      g: data.surpriseGift || undefined,
      gb: data.giftBoxStyle || undefined,
      gn: data.giftNote || undefined
    };

    // Include photo if present and reasonably sized
    if (data.photoUrl && data.photoUrl.length < 80000) {
      minified.pUrl = data.photoUrl;
    }
    if (data.photoCaption) {
      minified.pCap = data.photoCaption;
    }

    const jsonStr = JSON.stringify(minified);
    return LZString.compressToEncodedURIComponent(jsonStr);
  } catch (err) {
    console.warn('Compression error, using standard fallback:', err);
    return encodeWishToUrl(data);
  }
}

/**
 * Decompresses compact LZ-String payload back into BirthdayWishData.
 */
export function decompressCompactWish(compressed: string): BirthdayWishData | null {
  try {
    const jsonStr = LZString.decompressFromEncodedURIComponent(compressed);
    if (!jsonStr) return null;

    const m = JSON.parse(jsonStr);
    const wish: BirthdayWishData = {
      id: `wish-${Date.now()}`,
      createdAt: Date.now(),
      recipientName: m.r || '',
      senderName: m.s || '',
      relationship: m.rel || 'Friend',
      age: m.age || undefined,
      cakeStyle: m.c || 'chocolate-fudge',
      theme: m.t || 'midnight-magic',
      message: m.m || '',
      headline: m.h || '',
      musicTrack: m.song || 'birthday-classic',
      particles: ['balloons', 'confetti'],
      selectedStickers: m.stk || [],
      secretMessage: m.sec || undefined,
      enablePopBalloons: m.bal === 1,
      enableCutCake: m.cut !== 0,
      enableUnwrapGift: m.unw !== 0,
      enableConfettiPopper: m.cnf !== 0,
      isPaid: m.p === 1,
      transactionId: m.tx || '',
      photoUrl: m.pUrl || undefined,
      photoCaption: m.pCap || undefined,
      surpriseGift: m.g || undefined,
      giftBoxStyle: m.gb || undefined,
      giftNote: m.gn || undefined
    };
    return wish;
  } catch (err) {
    console.error('Decompression error:', err);
    return null;
  }
}

/**
 * Resolves wish data from any URL format:
 * - ?w=SHORT_ID (from backend or local cache)
 * - ?c=COMPACT_LZ (from compressed URL)
 * - #wish=LEGACY_BASE64 (backward compatibility)
 */
export async function resolveWishFromCurrentUrl(): Promise<BirthdayWishData | null> {
  if (typeof window === 'undefined') return null;

  const urlParams = new URLSearchParams(window.location.search);
  const hash = window.location.hash || '';

  // 1. Check for short ID (?w=... or #w=...)
  const shortId = urlParams.get('w') || (hash.startsWith('#w=') ? hash.replace('#w=', '') : null);
  if (shortId) {
    // Check local cache first for instant opening
    try {
      const cached = localStorage.getItem(`wish_id_${shortId}`);
      if (cached) {
        return JSON.parse(cached) as BirthdayWishData;
      }
    } catch {
      // Ignore
    }

    // Fetch from API
    try {
      const res = await fetch(`/api/wishes/${shortId}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.wish) {
          return json.wish as BirthdayWishData;
        }
      }
    } catch {
      // Ignore
    }

    // Check saved wishes history
    const saved = getSavedWishes();
    const found = saved.find(w => (w as any).shortId === shortId || w.id === shortId);
    if (found) return found;
  }

  // 2. Check for compact LZ payload (?c=... or #c=...)
  const compact = urlParams.get('c') || (hash.startsWith('#c=') ? hash.replace('#c=', '') : null);
  if (compact) {
    const decoded = decompressCompactWish(compact);
    if (decoded) return decoded;
  }

  // 3. Check for legacy base64 format (#wish=... or ?wish=...)
  let legacy = '';
  if (hash.startsWith('#wish=')) {
    legacy = hash.replace('#wish=', '');
  } else if (urlParams.get('wish')) {
    legacy = urlParams.get('wish') || '';
  }

  if (legacy) {
    const decoded = decodeWishFromUrl(legacy);
    if (decoded) return decoded;
  }

  return null;
}

/**
 * Legacy URL encoder (kept for backward compatibility)
 */
export function encodeWishToUrl(data: BirthdayWishData): string {
  try {
    const jsonStr = JSON.stringify(data);
    const utf8Bytes = new TextEncoder().encode(jsonStr);
    let binary = '';
    for (let i = 0; i < utf8Bytes.length; i++) {
      binary += String.fromCharCode(utf8Bytes[i]);
    }
    const base64 = btoa(binary);
    return encodeURIComponent(base64);
  } catch (err) {
    console.error('Error encoding wish data:', err);
    return '';
  }
}

/**
 * Legacy URL decoder (kept for backward compatibility)
 */
export function decodeWishFromUrl(encoded: string): BirthdayWishData | null {
  try {
    const base64 = decodeURIComponent(encoded);
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const jsonStr = new TextDecoder().decode(bytes);
    return JSON.parse(jsonStr) as BirthdayWishData;
  } catch (err) {
    console.error('Error decoding wish data:', err);
    return null;
  }
}

const STORAGE_KEY = 'advanced_birthday_wishes_saved';

export function saveWishToHistory(wish: BirthdayWishData) {
  try {
    const saved = getSavedWishes();
    const filtered = saved.filter(w => w.id !== wish.id);
    filtered.unshift(wish);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered.slice(0, 30)));
  } catch (e) {
    console.warn('Storage error:', e);
  }
}

export function getSavedWishes(): BirthdayWishData[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}
