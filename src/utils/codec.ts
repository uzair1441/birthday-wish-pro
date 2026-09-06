import { BirthdayWishData } from '../types';

/**
 * Encodes the birthday wish data into a compressed URL-safe string.
 */
export function encodeWishToUrl(data: BirthdayWishData): string {
  try {
    const jsonStr = JSON.stringify(data);
    // encode UTF-8 properly into base64
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
 * Decodes the birthday wish data from the URL parameter.
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
const ACCOUNTS_CONFIG_KEY = 'birthday_creator_payment_accounts';

export function saveWishToHistory(wish: BirthdayWishData) {
  try {
    const saved = getSavedWishes();
    const filtered = saved.filter(w => w.id !== wish.id);
    filtered.unshift(wish);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered.slice(0, 20)));
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
