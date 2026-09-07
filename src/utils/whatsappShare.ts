/**
 * Utility to generate a high-definition, festive WhatsApp celebration card picture
 * and handle WhatsApp sharing with attached image and short link.
 */

export interface WhatsAppCardOptions {
  recipientName: string;
  senderName?: string;
  age?: number;
  shareUrl: string;
}

/**
 * Creates an ultra-vibrant, high-resolution (1080x1080) celebration card image
 * with "BIRTHDAY WISH" banner, glowing cake, balloons, and "Special Surprise Inside" notice.
 */
export function generateWhatsAppCardBlob(
  options: WhatsAppCardOptions, 
  format: 'image/jpeg' | 'image/png' = 'image/jpeg',
  quality = 0.88
): Promise<Blob> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      resolve(new Blob([], { type: format }));
      return;
    }

    const { recipientName, senderName } = options;

    // 1. Festive Background: Deep velvet indigo to warm midnight berry
    const bgGrad = ctx.createRadialGradient(540, 480, 50, 540, 540, 750);
    bgGrad.addColorStop(0, '#2d0a3d');
    bgGrad.addColorStop(0.5, '#190628');
    bgGrad.addColorStop(1, '#0b0213');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1080, 1080);

    // 2. Glowing Bokeh Lights & Sparkle Dust
    const sparkles = [
      { x: 140, y: 220, r: 8, color: '#fcd34d' },
      { x: 920, y: 260, r: 9, color: '#f43f5e' },
      { x: 220, y: 780, r: 7, color: '#38bdf8' },
      { x: 860, y: 790, r: 10, color: '#fcd34d' },
      { x: 540, y: 160, r: 12, color: '#fbbf24' },
      { x: 180, y: 480, r: 6, color: '#e879f9' },
      { x: 900, y: 490, r: 6, color: '#fb7185' },
    ];
    sparkles.forEach((s) => {
      ctx.save();
      ctx.shadowColor = s.color;
      ctx.shadowBlur = 25;
      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // 3. Luxurious Double Border Frame with Gold Accents
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
    ctx.lineWidth = 3;
    ctx.strokeRect(36, 36, 1008, 1008);

    ctx.strokeStyle = 'rgba(244, 63, 94, 0.3)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(48, 48, 984, 984);

    // Corner Ornaments
    const drawCorner = (x: number, y: number, angle: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(0, 40);
      ctx.lineTo(0, 0);
      ctx.lineTo(40, 0);
      ctx.stroke();
      ctx.restore();
    };
    drawCorner(36, 36, 0);
    drawCorner(1044, 36, Math.PI / 2);
    drawCorner(1044, 1044, Math.PI);
    drawCorner(36, 1044, -Math.PI / 2);

    // 4. TOP RIBBON / HEADER: "✨ 🎂 BIRTHDAY WISH 🎂 ✨"
    ctx.save();
    const ribbonGrad = ctx.createLinearGradient(180, 80, 900, 80);
    ribbonGrad.addColorStop(0, '#f59e0b');
    ribbonGrad.addColorStop(0.5, '#f43f5e');
    ribbonGrad.addColorStop(1, '#a855f7');
    ctx.fillStyle = ribbonGrad;
    ctx.shadowColor = 'rgba(244, 63, 94, 0.5)';
    ctx.shadowBlur = 30;

    // Curved banner pill
    const rx = 190;
    const ry = 80;
    const rw = 700;
    const rh = 84;
    ctx.beginPath();
    ctx.roundRect(rx, ry, rw, rh, 42);
    ctx.fill();

    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 38px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 10;
    ctx.fillText('✨ 🎂 BIRTHDAY WISH 🎂 ✨', 540, 122);
    ctx.restore();

    // 5. RECIPIENT NAME SECTION
    ctx.save();
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '600 28px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('A SPECIAL CELEBRATION DEDICATED TO', 540, 220);

    // Name in grand glowing gold
    ctx.font = 'bold 64px Georgia, serif';
    ctx.fillStyle = '#fbbf24';
    ctx.shadowColor = 'rgba(251, 191, 36, 0.8)';
    ctx.shadowBlur = 24;
    const displayName = recipientName?.trim() || 'My Favorite Person';
    ctx.fillText(displayName.length > 24 ? displayName.substring(0, 22) + '...' : displayName, 540, 290);
    ctx.restore();

    // 6. CAKE & CANDLES ILLUSTRATION (Centerpiece)
    ctx.save();
    const cakeY = 400;
    // Pedestal Plate
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.beginPath();
    ctx.ellipse(540, cakeY + 180, 220, 28, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Cake Bottom Tier (Chocolate & Berry)
    const cakeGrad1 = ctx.createLinearGradient(380, cakeY + 80, 700, cakeY + 170);
    cakeGrad1.addColorStop(0, '#be185d');
    cakeGrad1.addColorStop(0.5, '#831843');
    cakeGrad1.addColorStop(1, '#500724');
    ctx.fillStyle = cakeGrad1;
    ctx.beginPath();
    ctx.roundRect(380, cakeY + 80, 320, 95, 20);
    ctx.fill();

    // Gold Icing Drips
    ctx.fillStyle = '#fbbf24';
    for (let i = 0; i < 7; i++) {
      ctx.beginPath();
      ctx.arc(410 + i * 46, cakeY + 85, 14, 0, Math.PI);
      ctx.fill();
    }

    // Cake Top Tier (Vanilla / Cream)
    const cakeGrad2 = ctx.createLinearGradient(430, cakeY, 650, cakeY + 80);
    cakeGrad2.addColorStop(0, '#fef08a');
    cakeGrad2.addColorStop(0.5, '#fde047');
    cakeGrad2.addColorStop(1, '#eab308');
    ctx.fillStyle = cakeGrad2;
    ctx.beginPath();
    ctx.roundRect(430, cakeY, 220, 80, 16);
    ctx.fill();

    // Burning Candles with Glowing Flames
    const candleXs = [475, 515, 540, 565, 605];
    candleXs.forEach((cx, idx) => {
      // Candle stick
      ctx.fillStyle = idx % 2 === 0 ? '#f43f5e' : '#38bdf8';
      ctx.fillRect(cx - 5, cakeY - 45, 10, 45);

      // Wick
      ctx.fillStyle = '#000000';
      ctx.fillRect(cx - 1, cakeY - 52, 2, 8);

      // Flame glow
      ctx.save();
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 20;
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.ellipse(cx, cakeY - 60, 8, 15, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.ellipse(cx, cakeY - 58, 4, 9, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Confetti particles around cake
    const confettiColors = ['#f43f5e', '#38bdf8', '#fbbf24', '#a855f7', '#10b981'];
    for (let i = 0; i < 36; i++) {
      ctx.save();
      const cx = 200 + (i * 21) % 680;
      const cy = cakeY - 80 + (i * 37) % 290;
      ctx.fillStyle = confettiColors[i % confettiColors.length];
      ctx.translate(cx, cy);
      ctx.rotate((i * 35 * Math.PI) / 180);
      ctx.fillRect(-6, -3, 12, 6);
      ctx.restore();
    }
    ctx.restore();

    // 7. SURPRISE CALLOUT CARD (The main message the user requested)
    // "جس میں اوپر لکھا ہو برتھ ڈے وش اور نیچے کچھ بولا گیا ہو کہ یعنی کہ اس لنک پر جا کر اپ کے لیے سرپرائز ہے۔"
    ctx.save();
    const boxX = 100;
    const boxY = 660;
    const boxW = 880;
    const boxH = 260;

    // Glowing Box Background
    const boxGrad = ctx.createLinearGradient(boxX, boxY, boxX + boxW, boxY + boxH);
    boxGrad.addColorStop(0, 'rgba(30, 41, 59, 0.95)');
    boxGrad.addColorStop(0.5, 'rgba(15, 23, 42, 0.98)');
    boxGrad.addColorStop(1, 'rgba(30, 41, 59, 0.95)');
    ctx.fillStyle = boxGrad;
    ctx.shadowColor = 'rgba(245, 158, 11, 0.35)';
    ctx.shadowBlur = 30;
    ctx.beginPath();
    ctx.roundRect(boxX, boxY, boxW, boxH, 28);
    ctx.fill();

    // Gold/Rose border
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Inner surprise header
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 32px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🎁 SPECIAL SURPRISE AWAITS YOU! 🎁', 540, boxY + 58);

    // Callout text in Urdu & English
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('اس لنک میں آپ کے لیے ایک پیارا سا برتھ ڈے سرپرائز ہے!', 540, boxY + 115);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '500 20px sans-serif';
    ctx.fillText('Tap the link below to cut your cake, blow candles & unwrap your gift!', 540, boxY + 160);

    // Click indicator badge
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.roundRect(300, boxY + 195, 480, 44, 22);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('👉 CLICK LINK BELOW TO OPEN SURPRISE 👈', 540, boxY + 223);
    ctx.restore();

    // 8. FOOTER: SENDER NOTE
    ctx.save();
    ctx.fillStyle = '#fb7185';
    ctx.font = 'italic 600 24px Georgia, serif';
    ctx.textAlign = 'center';
    const senderText = senderName?.trim() ? `With Lots of Love from ${senderName} ❤️` : 'With Warmest Love & Prayers ❤️';
    ctx.fillText(senderText, 540, 970);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 16px sans-serif';
    ctx.fillText('Interactive Birthday Celebration • Powered by VIP Celebration Studio', 540, 1010);
    ctx.restore();

    canvas.toBlob(
      (blob) => {
        resolve(blob || new Blob([], { type: format }));
      },
      format,
      quality
    );
  });
}

/**
 * Returns the card image as a compressed base64 data URL for fast uploading to backend.
 */
export function generateWhatsAppCardDataUrl(
  options: WhatsAppCardOptions,
  format: 'image/jpeg' | 'image/png' = 'image/jpeg',
  quality = 0.85
): Promise<string> {
  return new Promise((resolve) => {
    generateWhatsAppCardBlob(options, format, quality)
      .then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string) || '');
        reader.onerror = () => resolve('');
        reader.readAsDataURL(blob);
      })
      .catch(() => resolve(''));
  });
}

/**
 * Formats a clean, high-conversion WhatsApp message with the short link clearly positioned.
 * Format:
 * [Sender] created a special interactive birthday celebration surprise for you. Check your surprise here:
 * [link]
 */
export function formatWhatsAppMessage(options: WhatsAppCardOptions): string {
  const { recipientName, senderName, shareUrl } = options;
  const name = recipientName?.trim() || 'You';
  const sender = senderName?.trim() || 'Someone special';

  return `✨ 🎂 *HAPPY BIRTHDAY!* 🎂 ✨

${sender} created a special interactive birthday celebration surprise for you. Check your surprise here:
👉 ${shareUrl}`;
}

/**
 * Handles sharing to WhatsApp:
 * 1. Attaches the generated celebratory card picture directly using Web Share API (mobile devices)
 * 2. Pre-copies image to clipboard on desktop/WhatsApp Web for instant Ctrl+V paste
 * 3. Opens WhatsApp with the formatted message & short link for automatic rich image card preview!
 */
export async function shareToWhatsAppWithCard(options: WhatsAppCardOptions): Promise<{ success: boolean; method: 'web-share' | 'whatsapp-link' | 'error' }> {
  try {
    const cardBlob = await generateWhatsAppCardBlob(options, 'image/jpeg', 0.88);
    const messageText = formatWhatsAppMessage(options);

    const safeName = (options.recipientName || 'Celebration').replace(/[^a-zA-Z0-9]/g, '-');
    const imageFile = new File([cardBlob], `Birthday-Wish-${safeName}.jpg`, { type: 'image/jpeg' });

    // Optional: Pre-copy image to clipboard on modern browsers (supports WhatsApp Web pasting)
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && typeof ClipboardItem !== 'undefined') {
        const pngBlob = await generateWhatsAppCardBlob(options, 'image/png');
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': pngBlob })]);
      }
    } catch {
      // Non-blocking clipboard write
    }

    // Check if Web Share API with files is supported (Works on iOS Safari & Android Chrome)
    if (
      typeof navigator !== 'undefined' &&
      navigator.share &&
      navigator.canShare &&
      navigator.canShare({ files: [imageFile] })
    ) {
      try {
        await navigator.share({
          files: [imageFile],
          title: `Happy Birthday ${options.recipientName}! 🎂`,
          text: messageText
        });
        return { success: true, method: 'web-share' };
      } catch (err: any) {
        if (err?.name === 'AbortError') {
          return { success: true, method: 'web-share' };
        }
      }
    }

    // Fallback: Trigger WhatsApp Web/App deep link
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(messageText)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    return { success: true, method: 'whatsapp-link' };
  } catch (err) {
    console.error('Error sharing to WhatsApp:', err);
    const messageText = formatWhatsAppMessage(options);
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(messageText)}`, '_blank');
    return { success: false, method: 'error' };
  }
}

/**
 * Downloads the generated celebratory picture to the device with 1 click.
 */
export async function downloadWhatsAppCard(options: WhatsAppCardOptions) {
  const blob = await generateWhatsAppCardBlob(options, 'image/png');
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Birthday-Wish-${(options.recipientName || 'Celebration').replace(/\s+/g, '-')}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
