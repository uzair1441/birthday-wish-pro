import React, { useState, useEffect, useRef } from 'react';
import { BirthdayWishData } from '../types';
import { CAKE_OPTIONS, THEME_OPTIONS } from '../data/presets';
import { GIFT_BOX_OPTIONS, SURPRISE_GIFT_OPTIONS } from '../data/giftPresets';
import { Download, Share2, Sparkles, Film, X, RefreshCw, Smartphone, Volume2, CheckCircle2 } from 'lucide-react';
import { getTrackAudioUrl, BUILTIN_SONGS } from '../utils/audio';

interface StatusVideoGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  wish: BirthdayWishData;
}

export const StatusVideoGenerator: React.FC<StatusVideoGeneratorProps> = ({
  isOpen,
  onClose,
  wish
}) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [recordProgress, setRecordProgress] = useState<number>(0);
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(0);
  const [isDone, setIsDone] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('Ready to create your 30s status video');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const cake = CAKE_OPTIONS.find(c => c.id === wish.cakeStyle) || CAKE_OPTIONS[0];
  const selectedSong = BUILTIN_SONGS.find(s => s.id === wish.musicTrack) || BUILTIN_SONGS[0];
  const theme = THEME_OPTIONS.find(t => t.id === wish.theme) || THEME_OPTIONS[0];
  const giftBox = GIFT_BOX_OPTIONS.find(b => b.id === wish.giftBoxStyle) || GIFT_BOX_OPTIONS[0];
  const surpriseGift = SURPRISE_GIFT_OPTIONS.find(g => g.id === wish.surpriseGift) || SURPRISE_GIFT_OPTIONS[0];

  // Pre-load cake image and user photo onto HTMLImageElements
  const cakeImgRef = useRef<HTMLImageElement | null>(null);
  const photoImgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Load cake photo
    const cakeImg = new Image();
    cakeImg.crossOrigin = 'anonymous';
    cakeImg.src = cake.realCakeImageUrl;
    cakeImg.onload = () => {
      cakeImgRef.current = cakeImg;
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) drawScene(ctx, 0);
      }
    };

    // Load user photo if provided
    if (wish.photoUrl) {
      const userImg = new Image();
      userImg.crossOrigin = 'anonymous';
      userImg.src = wish.photoUrl;
      userImg.onload = () => {
        photoImgRef.current = userImg;
        if (canvasRef.current) {
          const ctx = canvasRef.current.getContext('2d');
          if (ctx) drawScene(ctx, 0);
        }
      };
    }
  }, [isOpen, cake.realCakeImageUrl, wish.photoUrl]);

  // Helper: Draw image with rounded corners
  const drawRoundedImage = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    x: number,
    y: number,
    w: number,
    h: number,
    radius: number
  ) => {
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, radius);
    ctx.clip();
    ctx.drawImage(img, x, y, w, h);
    ctx.restore();
  };

  // Helper: Text Wrapping with strict safe bounds (Never overflows canvas or boxes)
  const drawWrappedText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number,
    maxLines: number = 6
  ): number => {
    const rawWords = (text || '').trim().split(/\s+/);
    if (!rawWords.length || rawWords[0] === '') return y;

    // Break words that individually exceed maxWidth
    const words: string[] = [];
    for (const w of rawWords) {
      if (ctx.measureText(w).width > maxWidth) {
        let chunk = '';
        for (let c = 0; c < w.length; c++) {
          const testChunk = chunk + w[c];
          if (ctx.measureText(testChunk).width > maxWidth && chunk.length > 0) {
            words.push(chunk + '-');
            chunk = w[c];
          } else {
            chunk = testChunk;
          }
        }
        if (chunk) words.push(chunk);
      } else {
        words.push(w);
      }
    }

    let line = '';
    let curY = y;
    let linesDrawn = 0;

    for (let n = 0; n < words.length; n++) {
      const testLine = line ? `${line} ${words[n]}` : words[n];
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line, x, curY);
        line = words[n];
        curY += lineHeight;
        linesDrawn++;
        if (linesDrawn >= maxLines) {
          const lastLine = n < words.length - 1 ? `${line}...` : line;
          ctx.fillText(lastLine, x, curY);
          return curY + lineHeight;
        }
      } else {
        line = testLine;
      }
    }
    if (line) {
      ctx.fillText(line, x, curY);
      curY += lineHeight;
    }
    return curY;
  };

  // Helper: Dynamically fit font size to strictly prevent text overflow
  const getFittedFontSize = (
    ctx: CanvasRenderingContext2D,
    text: string,
    fontFamily: string,
    startSize: number,
    minSize: number,
    maxWidth: number,
    weight: string = 'bold'
  ): number => {
    let size = startSize;
    ctx.font = `${weight} ${size}px ${fontFamily}`;
    while (size > minSize && ctx.measureText(text || '').width > maxWidth) {
      size -= 1;
      ctx.font = `${weight} ${size}px ${fontFamily}`;
    }
    return size;
  };

  // Canvas drawing function: Recreates the exact recipient celebration journey (0s to 30s)
  const drawScene = (ctx: CanvasRenderingContext2D, elapsedSec: number) => {
    const W = 720;
    const H = 1280;
    const SAFE_MAX_W = 600; // 60px padding on left & right
    const CENTER_X = W / 2;

    // 1. Dynamic Background matching user's selected Visual Lighting Theme
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    if (wish.theme === 'golden-glamour') {
      bgGrad.addColorStop(0, '#191003');
      bgGrad.addColorStop(0.5, '#291a05');
      bgGrad.addColorStop(1, '#120a02');
    } else if (wish.theme === 'pastel-blossom') {
      bgGrad.addColorStop(0, '#1c0512');
      bgGrad.addColorStop(0.5, '#2f0b20');
      bgGrad.addColorStop(1, '#17040f');
    } else if (wish.theme === 'neon-party') {
      bgGrad.addColorStop(0, '#03131c');
      bgGrad.addColorStop(0.5, '#081e2b');
      bgGrad.addColorStop(1, '#020d14');
    } else if (wish.theme === 'velvet-sunset') {
      bgGrad.addColorStop(0, '#200606');
      bgGrad.addColorStop(0.5, '#360d0d');
      bgGrad.addColorStop(1, '#160404');
    } else {
      // Midnight Stardust (Default)
      bgGrad.addColorStop(0, '#080318');
      bgGrad.addColorStop(0.5, '#170930');
      bgGrad.addColorStop(1, '#0a021a');
    }
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // 2. Dramatic Theatrical Stage Spotlight Beams (Theme-Aware)
    ctx.save();
    const spotAngle = Math.sin(elapsedSec * 0.8) * 0.1;
    // Left beam
    ctx.save();
    ctx.translate(60, 0);
    ctx.rotate(-0.25 + spotAngle);
    const leftBeam = ctx.createLinearGradient(0, 0, 0, 900);
    if (wish.theme === 'golden-glamour') {
      leftBeam.addColorStop(0, 'rgba(251, 191, 36, 0.35)');
      leftBeam.addColorStop(1, 'transparent');
    } else if (wish.theme === 'neon-party') {
      leftBeam.addColorStop(0, 'rgba(6, 182, 212, 0.35)');
      leftBeam.addColorStop(1, 'transparent');
    } else if (wish.theme === 'pastel-blossom') {
      leftBeam.addColorStop(0, 'rgba(244, 114, 182, 0.35)');
      leftBeam.addColorStop(1, 'transparent');
    } else if (wish.theme === 'velvet-sunset') {
      leftBeam.addColorStop(0, 'rgba(249, 115, 22, 0.35)');
      leftBeam.addColorStop(1, 'transparent');
    } else {
      leftBeam.addColorStop(0, 'rgba(168, 85, 247, 0.35)');
      leftBeam.addColorStop(1, 'transparent');
    }
    ctx.fillStyle = leftBeam;
    ctx.beginPath();
    ctx.moveTo(-40, 0);
    ctx.lineTo(240, 900);
    ctx.lineTo(80, 900);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Right beam
    ctx.save();
    ctx.translate(W - 60, 0);
    ctx.rotate(0.25 - spotAngle);
    const rightBeam = ctx.createLinearGradient(0, 0, 0, 900);
    rightBeam.addColorStop(0, 'rgba(251, 191, 36, 0.3)');
    rightBeam.addColorStop(1, 'transparent');
    ctx.fillStyle = rightBeam;
    ctx.beginPath();
    ctx.moveTo(40, 0);
    ctx.lineTo(-240, 900);
    ctx.lineTo(-80, 900);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    ctx.restore();

    // Floating golden/colored celebration particles
    ctx.save();
    for (let i = 0; i < 35; i++) {
      const px = (i * 89 + elapsedSec * 40) % W;
      const py = (i * 137 + Math.sin(elapsedSec * 1.5 + i) * 45 + elapsedSec * 32) % H;
      const size = 2 + (i % 4) * 2;
      const alpha = 0.25 + 0.25 * Math.sin(elapsedSec * 2 + i);
      ctx.fillStyle = (i % 3 === 0) 
        ? `rgba(251, 191, 36, ${alpha})` 
        : (i % 3 === 1) 
        ? `rgba(244, 63, 94, ${alpha})` 
        : `rgba(192, 132, 252, ${alpha})`;
      ctx.beginPath();
      ctx.arc(px, py, size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Overhead Festive Bunting Flags (bunting ribbons)
    const flagColors = ['#F43F5E', '#F59E0B', '#10B981', '#38BDF8', '#A855F7', '#EC4899'];
    ctx.save();
    for (let f = 0; f < 10; f++) {
      const fx = 35 + f * 70;
      const fy = 45 + Math.sin(f + elapsedSec * 2) * 6;
      ctx.fillStyle = flagColors[f % flagColors.length];
      ctx.beginPath();
      ctx.moveTo(fx, fy);
      ctx.lineTo(fx + 60, fy);
      ctx.lineTo(fx + 30, fy + 50);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();

    /* =========================================================================
       SCENE 1: (0.0s - 6.0s) THE VIP CELEBRATION ENVELOPE & INVITATION EXPERIENCE
       ========================================================================= */
    if (elapsedSec < 6.0) {
      ctx.save();

      // Top Header Crown & Calligraphy
      ctx.fillStyle = '#F59E0B';
      ctx.font = 'bold 22px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('👑 ROYAL BIRTHDAY DISPATCH 👑', CENTER_X, 140);

      // Calligraphy "Happy Birthday" Emblem
      const goldGrad = ctx.createLinearGradient(120, 180, W - 120, 240);
      goldGrad.addColorStop(0, '#FDE68A');
      goldGrad.addColorStop(0.5, '#F59E0B');
      goldGrad.addColorStop(1, '#FCD34D');
      ctx.fillStyle = goldGrad;
      ctx.font = 'bold 50px serif';
      ctx.fillText('Happy Birthday', CENTER_X, 220);

      // Gold divider line
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(CENTER_X - 120, 245);
      ctx.lineTo(CENTER_X + 120, 245);
      ctx.stroke();

      // Central Card Container
      ctx.fillStyle = 'rgba(15, 10, 30, 0.9)';
      ctx.beginPath();
      ctx.roundRect(60, 280, SAFE_MAX_W, 680, 28);
      ctx.fill();
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.45)';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Corner ornaments
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(80, 320); ctx.lineTo(80, 300); ctx.lineTo(100, 300); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(W - 80, 320); ctx.lineTo(W - 80, 300); ctx.lineTo(W - 100, 300); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(80, 920); ctx.lineTo(80, 940); ctx.lineTo(100, 940); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(W - 80, 920); ctx.lineTo(W - 80, 940); ctx.lineTo(W - 100, 940); ctx.stroke();

      // Recipient Salutation Badge
      ctx.fillStyle = 'rgba(244, 63, 94, 0.2)';
      ctx.beginPath();
      ctx.roundRect(CENTER_X - 160, 320, 320, 44, 22);
      ctx.fill();
      ctx.fillStyle = '#FDA4AF';
      ctx.font = 'bold 19px sans-serif';
      ctx.fillText('✨ A VIP Celebration Awaits You ✨', CENTER_X, 349);

      // Recipient Name (auto-adjust font size)
      const recipientName = wish.recipientName || 'Birthday Star';
      const nameFontSize = recipientName.length > 18 ? 38 : recipientName.length > 12 ? 46 : 56;
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `bold ${nameFontSize}px serif`;
      ctx.fillText(`For ${recipientName}`, CENTER_X, 430);

      // Subtitle
      ctx.fillStyle = '#CBD5E1';
      ctx.font = '22px sans-serif';
      const senderText = wish.senderName 
        ? `${wish.senderName} has crafted an interactive celebration with real cake, music & gifts for you!`
        : 'Someone crafted an interactive birthday celebration with cake, music & gifts for you!';
      drawWrappedText(ctx, senderText, CENTER_X, 480, SAFE_MAX_W - 80, 34, 3);

      // VIP Ticket Box inside
      ctx.fillStyle = 'rgba(245, 158, 11, 0.1)';
      ctx.beginPath();
      ctx.roundRect(90, 590, SAFE_MAX_W - 60, 160, 20);
      ctx.fill();
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.35)';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#FCD34D';
      ctx.font = 'bold 19px monospace';
      ctx.fillText('PASS CODE: ★ VIP-BIRTHDAY-PASS ★', CENTER_X, 630);

      ctx.fillStyle = '#E2E8F0';
      ctx.font = '21px sans-serif';
      ctx.fillText(`🎵 Song: ${selectedSong.name}`, CENTER_X, 675);
      ctx.fillText(`🎂 Cake: ${cake.name}`, CENTER_X, 715);

      // Open Button with animated tap pulse
      const isNearOpen = elapsedSec > 4.2;
      const buttonScale = isNearOpen ? (1 + 0.05 * Math.sin(elapsedSec * 10)) : 1;
      
      ctx.save();
      ctx.translate(CENTER_X, 840);
      ctx.scale(buttonScale, buttonScale);
      
      const btnGrad = ctx.createLinearGradient(-180, 0, 180, 0);
      btnGrad.addColorStop(0, '#F59E0B');
      btnGrad.addColorStop(0.5, '#F43F5E');
      btnGrad.addColorStop(1, '#9333EA');
      ctx.fillStyle = btnGrad;
      ctx.beginPath();
      ctx.roundRect(-210, -32, 420, 64, 32);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText(isNearOpen ? '✨ OPENING CELEBRATION... ✨' : '✨ Tap to Open Celebration ✨', 0, 8);
      ctx.restore();

      // Screen transition flash if close to 6.0s
      if (elapsedSec > 5.4) {
        const flashAlpha = Math.min(1, (elapsedSec - 5.4) / 0.6);
        ctx.fillStyle = `rgba(255, 255, 255, ${flashAlpha * 0.75})`;
        ctx.fillRect(0, 0, W, H);
      }

      ctx.restore();
    }

    /* =========================================================================
       SCENE 2: (6.0s - 13.0s) THE AUTHENTIC BAKERY CAKE ON STAGE & REAL KNIFE CUT
       ========================================================================= */
    else if (elapsedSec < 13.0) {
      const sceneElapsed = elapsedSec - 6.0;
      ctx.save();

      // Stage Header
      ctx.fillStyle = '#F43F5E';
      ctx.font = 'bold 22px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🎂 STEP 1: MAKE A WISH & CUT THE CAKE 🎂', CENTER_X, 150);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 36px serif';
      ctx.fillText(cake.name, CENTER_X, 205);

      ctx.fillStyle = '#FDE68A';
      ctx.font = '20px sans-serif';
      ctx.fillText(`Flavor: ${cake.flavorNotes}`, CENTER_X, 240);

      // Glowing circular pedestal under the cake
      ctx.save();
      const pedGrad = ctx.createRadialGradient(CENTER_X, 680, 60, CENTER_X, 680, 240);
      pedGrad.addColorStop(0, 'rgba(251, 191, 36, 0.45)');
      pedGrad.addColorStop(0.7, 'rgba(244, 63, 94, 0.25)');
      pedGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = pedGrad;
      ctx.beginPath();
      ctx.ellipse(CENTER_X, 680, 240, 70, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // The Real Bakery Cake Display (Clean rounded card, NO FAKE DRAWN CANDLES!)
      const cakeW = 420;
      const cakeH = 360;
      const cakeX = CENTER_X - cakeW / 2;
      const cakeY = 300;
      const isCakeCut = sceneElapsed > 3.0; // Cut finishes at ~9.0s mark

      // Cake Card Outer Frame & Shadow
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
      ctx.shadowBlur = 30;
      ctx.shadowOffsetY = 15;
      ctx.fillStyle = '#1e1026';
      ctx.beginPath();
      ctx.roundRect(cakeX - 4, cakeY - 4, cakeW + 8, cakeH + 8, 30);
      ctx.fill();
      ctx.restore();

      // Draw the authentic whole rounded cake photo
      if (cakeImgRef.current) {
        drawRoundedImage(ctx, cakeImgRef.current, cakeX, cakeY, cakeW, cakeH, 28);
      } else {
        // Fallback placeholder with golden rim
        ctx.fillStyle = '#3c1828';
        ctx.beginPath();
        ctx.roundRect(cakeX, cakeY, cakeW, cakeH, 28);
        ctx.fill();
        ctx.fillStyle = '#FCD34D';
        ctx.font = 'bold 36px serif';
        ctx.fillText(cake.name, CENTER_X, cakeY + 180);
      }

      // Border around cake card
      ctx.strokeStyle = isCakeCut ? '#10B981' : 'rgba(251, 191, 36, 0.6)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(cakeX, cakeY, cakeW, cakeH, 28);
      ctx.stroke();

      // Authentic Knife Slicing Animation (Between 2.0s and 3.2s of scene)
      if (sceneElapsed >= 1.8 && sceneElapsed <= 3.4) {
        const knifeProgress = Math.min(1, (sceneElapsed - 1.8) / 1.4);
        const knifeX = CENTER_X - 10 + knifeProgress * 20;
        const knifeY = cakeY - 20 + knifeProgress * 280;

        ctx.save();
        ctx.font = '80px sans-serif';
        ctx.textAlign = 'center';
        ctx.translate(knifeX, knifeY);
        ctx.rotate(-Math.PI / 6);
        ctx.fillText('🔪', 0, 0);
        ctx.restore();

        // Glowing slice cut trail
        ctx.strokeStyle = '#FDE68A';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(CENTER_X, cakeY + 20);
        ctx.lineTo(CENTER_X, knifeY);
        ctx.stroke();
      }

      // Slice Served Badge & Sliced line once cut is done
      if (isCakeCut) {
        // Golden cut line
        ctx.strokeStyle = '#FDE68A';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(CENTER_X, cakeY + 15);
        ctx.lineTo(CENTER_X, cakeY + cakeH - 15);
        ctx.stroke();

        // "🍰 Slice Served!" Badge on top right of cake
        ctx.save();
        ctx.fillStyle = '#F43F5E';
        ctx.beginPath();
        ctx.roundRect(cakeX + cakeW - 180, cakeY + 20, 160, 44, 22);
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 18px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🍰 Slice Served!', cakeX + cakeW - 100, cakeY + 48);
        ctx.restore();

        // Confetti pyrotechnics around cake
        ctx.save();
        for (let s = 0; s < 30; s++) {
          const sparkAngle = (s * 12 * Math.PI) / 180;
          const sparkDist = 80 + (sceneElapsed * 45 + s * 8) % 160;
          ctx.fillStyle = (s % 3 === 0) ? '#F59E0B' : (s % 3 === 1) ? '#F43F5E' : '#38BDF8';
          ctx.beginPath();
          ctx.arc(
            CENTER_X + Math.cos(sparkAngle) * sparkDist,
            cakeY + 180 + Math.sin(sparkAngle) * (sparkDist * 0.7),
            4, 0, Math.PI * 2
          );
          ctx.fill();
        }
        ctx.restore();
      }

      // Interactive Cut Button / Status on Stage (Matching web UI exactly)
      ctx.save();
      if (!isCakeCut) {
        // Button: Cut the cake
        ctx.fillStyle = 'rgba(244, 63, 94, 0.9)';
        ctx.beginPath();
        ctx.roundRect(CENTER_X - 170, 710, 340, 56, 28);
        ctx.fill();
        ctx.strokeStyle = '#FCD34D';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 20px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🔪 Slicing The Birthday Cake...', CENTER_X, 745);
      } else {
        // Badge: Cake cut & served
        ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
        ctx.beginPath();
        ctx.roundRect(CENTER_X - 180, 710, 360, 56, 28);
        ctx.fill();
        ctx.strokeStyle = '#10B981';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = '#34D399';
        ctx.font = 'bold 20px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('✨ Birthday Cake Cut & Served! 🍰', CENTER_X, 745);
      }
      ctx.restore();

      // Lower Info Banner
      ctx.fillStyle = 'rgba(15, 10, 30, 0.9)';
      ctx.beginPath();
      ctx.roundRect(80, 820, SAFE_MAX_W - 40, 160, 24);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#F8FAFC';
      ctx.font = 'bold 24px serif';
      ctx.textAlign = 'center';
      ctx.fillText('A Sweet Year of Blessings & Joy!', CENTER_X, 875);

      ctx.fillStyle = '#CBD5E1';
      ctx.font = '19px sans-serif';
      ctx.fillText('Next: Opening The Cardboard Birthday Card 💌', CENTER_X, 930);

      ctx.restore();
    }

    /* =========================================================================
       SCENE 3: (13.0s - 20.0s) THE REALISTIC BI-FOLD CARDBOARD GREETING CARD
       ========================================================================= */
    else if (elapsedSec < 20.0) {
      const sceneElapsed = elapsedSec - 13.0;
      ctx.save();

      // Section Header
      ctx.fillStyle = '#C084FC';
      ctx.font = 'bold 22px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('💌 STEP 2: PERSONAL BIRTHDAY CARD & MEMORIES 💌', CENTER_X, 135);

      // Card Opening Animation transition (Unfolds between 1.0s and 2.0s of scene)
      const isCardFullyOpen = sceneElapsed > 1.6;

      if (!isCardFullyOpen) {
        // Closed Cardboard Cover (گتے کا کور)
        const coverW = 460;
        const coverH = 640;
        const coverX = CENTER_X - coverW / 2;
        const coverY = 190;

        ctx.fillStyle = '#20040e';
        ctx.beginPath();
        ctx.roundRect(coverX, coverY, coverW, coverH, 28);
        ctx.fill();
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 4;
        ctx.stroke();

        // Embossed corners
        ctx.strokeRect(coverX + 16, coverY + 16, coverW - 32, coverH - 32);

        // Gold Ribbon across
        ctx.fillStyle = 'rgba(245, 158, 11, 0.4)';
        ctx.fillRect(coverX + 50, coverY, 40, coverH);

        // Wax Seal
        ctx.fillStyle = '#E11D48';
        ctx.beginPath();
        ctx.arc(CENTER_X, coverY + 220, 50, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#FCD34D';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '36px sans-serif';
        ctx.fillText('❤️', CENTER_X, coverY + 233);

        ctx.fillStyle = '#FDE68A';
        ctx.font = 'bold 36px serif';
        ctx.fillText('Happy Birthday', CENTER_X, coverY + 340);

        const recName = wish.recipientName || 'You';
        const recFontSize = getFittedFontSize(ctx, `For ${recName}`, 'sans-serif', 26, 18, coverW - 60);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `bold ${recFontSize}px sans-serif`;
        ctx.fillText(`For ${recName}`, CENTER_X, coverY + 390);

        // Tap to open prompt
        ctx.fillStyle = '#F59E0B';
        ctx.beginPath();
        ctx.roundRect(CENTER_X - 160, coverY + 490, 320, 56, 28);
        ctx.fill();
        ctx.fillStyle = '#090514';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText('📖 OPENING CARD... 📖', CENTER_X, coverY + 525);
      } else {
        // OPENED BI-FOLD CARD WITH 2 DISTINCT, MATHEMATICALLY ALIGNED SUB-BOXES
        const openW = 630;
        const openH = 880;
        const openX = CENTER_X - openW / 2;
        const openY = 165;

        // Outer cardboard folder
        ctx.fillStyle = '#1f0510';
        ctx.beginPath();
        ctx.roundRect(openX, openY, openW, openH, 24);
        ctx.fill();
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Corner gold ornaments on outer folder
        ctx.strokeStyle = '#FCD34D';
        ctx.lineWidth = 2;
        ctx.strokeRect(openX + 10, openY + 10, openW - 20, openH - 20);

        // Central Spine Crease
        const spineGrad = ctx.createLinearGradient(CENTER_X - 25, 0, CENTER_X + 25, 0);
        spineGrad.addColorStop(0, 'rgba(0,0,0,0.02)');
        spineGrad.addColorStop(0.5, 'rgba(0,0,0,0.25)');
        spineGrad.addColorStop(1, 'rgba(0,0,0,0.02)');
        ctx.fillStyle = spineGrad;
        ctx.fillRect(CENTER_X - 25, openY, 50, openH);

        // =======================================================
        // SUB-BOX 1: MEMORY KEEPSAKE BOX (TOP PANEL)
        // =======================================================
        const box1X = 65;
        const box1Y = 185;
        const box1W = 590;
        const box1H = 320;

        ctx.fillStyle = '#FFFDF8';
        ctx.beginPath();
        ctx.roundRect(box1X, box1Y, box1W, box1H, 18);
        ctx.fill();
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.5)';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.save();
        ctx.beginPath();
        ctx.roundRect(box1X, box1Y, box1W, box1H, 18);
        ctx.clip();

        // Top mini badge in Box 1
        ctx.fillStyle = '#92400E';
        ctx.font = 'bold 15px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('★ COMMEMORATIVE BIRTHDAY KEEPSAKE ★', CENTER_X, box1Y + 28);

        if (photoImgRef.current) {
          // Polaroid frame
          const frameW = 280;
          const frameH = 225;
          const frameX = CENTER_X - frameW / 2;
          const frameY = box1Y + 45;

          ctx.fillStyle = '#FFFFFF';
          ctx.save();
          ctx.shadowColor = 'rgba(0,0,0,0.2)';
          ctx.shadowBlur = 10;
          ctx.fillRect(frameX, frameY, frameW, frameH);
          ctx.restore();

          // Gold Washi tape
          ctx.fillStyle = 'rgba(251, 191, 36, 0.85)';
          ctx.fillRect(CENTER_X - 45, frameY - 8, 90, 18);

          // User photo
          drawRoundedImage(ctx, photoImgRef.current, frameX + 12, frameY + 12, frameW - 24, 160, 6);

          // Photo caption
          const captionText = wish.photoCaption || 'Precious Memories ✨';
          const captionSize = getFittedFontSize(ctx, captionText, 'serif', 16, 13, frameW - 20, 'italic');
          ctx.fillStyle = '#1E293B';
          ctx.font = `italic bold ${captionSize}px serif`;
          ctx.fillText(captionText, CENTER_X, frameY + 202);
        } else {
          // Celebration Keepsake Plaque if no photo
          const plaqueW = 440;
          const plaqueH = 210;
          const plaqueX = CENTER_X - plaqueW / 2;
          const plaqueY = box1Y + 48;

          ctx.fillStyle = '#FDF2F8';
          ctx.beginPath();
          ctx.roundRect(plaqueX, plaqueY, plaqueW, plaqueH, 16);
          ctx.fill();
          ctx.strokeStyle = '#F472B6';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.font = '50px sans-serif';
          ctx.fillText('🎂', CENTER_X, plaqueY + 65);

          ctx.fillStyle = '#9D174D';
          ctx.font = 'bold 22px serif';
          ctx.fillText('Heartfelt Celebration Keepsake', CENTER_X, plaqueY + 115);

          ctx.fillStyle = '#475569';
          ctx.font = 'italic 17px serif';
          ctx.fillText('"May this year overflow with happiness & blessings."', CENTER_X, plaqueY + 155);

          ctx.fillStyle = '#F59E0B';
          ctx.font = 'bold 14px monospace';
          ctx.fillText('★ SPECIAL BIRTHDAY EDITION ★', CENTER_X, plaqueY + 185);
        }
        ctx.restore(); // End Box 1 clip

        // =======================================================
        // SUB-BOX 2: HEARTFELT LETTER PANEL (BOTTOM PANEL)
        // =======================================================
        const box2X = 65;
        const box2Y = 520;
        const box2W = 590;
        const box2H = 505;

        ctx.fillStyle = '#FFFDF8';
        ctx.beginPath();
        ctx.roundRect(box2X, box2Y, box2W, box2H, 18);
        ctx.fill();
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.5)';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.save();
        ctx.beginPath();
        ctx.roundRect(box2X, box2Y, box2W, box2H, 18);
        ctx.clip();

        // Salutation Header in Box 2 (Never overflows)
        const salutationText = `Dearest ${wish.recipientName || 'Friend'},`;
        const salutationFontSize = getFittedFontSize(ctx, salutationText, 'serif', 27, 19, box2W - 60);
        ctx.fillStyle = '#831843';
        ctx.font = `bold ${salutationFontSize}px serif`;
        ctx.textAlign = 'center';
        ctx.fillText(salutationText, CENTER_X, box2Y + 42);

        // Headline Pill if present
        let msgStartY = box2Y + 75;
        if (wish.headline) {
          ctx.fillStyle = 'rgba(245, 158, 11, 0.15)';
          ctx.beginPath();
          ctx.roundRect(CENTER_X - 220, box2Y + 58, 440, 32, 16);
          ctx.fill();

          const headlineText = `"${wish.headline}"`;
          const headFontSize = getFittedFontSize(ctx, headlineText, 'serif', 17, 13, 410, 'italic');
          ctx.fillStyle = '#9A3412';
          ctx.font = `italic bold ${headFontSize}px serif`;
          ctx.fillText(headlineText, CENTER_X, box2Y + 80);
          msgStartY = box2Y + 120;
        }

        // Letter Message Body (Strict bounds, wrapped nicely)
        ctx.fillStyle = '#1C1917';
        ctx.font = '19px serif';
        const letterMaxW = box2W - 60; // 530px
        const afterMsgY = drawWrappedText(
          ctx,
          wish.message || 'Wishing you the happiest birthday filled with joy, peace, and endless sweet moments!',
          CENTER_X,
          msgStartY,
          letterMaxW,
          28,
          4
        );

        // Sign-off & Sender
        ctx.fillStyle = '#78350F';
        ctx.font = 'italic 18px serif';
        ctx.fillText('With all my love & warmest prayers,', CENTER_X, Math.min(box2Y + 360, afterMsgY + 22));

        const senderTitle = `${wish.senderName || 'Your Loved One'}${wish.relationship ? ` (${wish.relationship})` : ''}`;
        const senderFontSize = getFittedFontSize(ctx, `❤️ ${senderTitle}`, 'serif', 24, 17, box2W - 80);
        ctx.fillStyle = '#831843';
        ctx.font = `bold ${senderFontSize}px serif`;
        ctx.fillText(`❤️ ${senderTitle}`, CENTER_X, Math.min(box2Y + 395, afterMsgY + 54));

        // Secret Note Mini Sub-Box at base of letter panel
        const secretBoxW = box2W - 50;
        const secretBoxH = 55;
        const secretBoxX = box2X + 25;
        const secretBoxY = box2Y + 430;

        ctx.fillStyle = 'rgba(245, 158, 11, 0.12)';
        ctx.beginPath();
        ctx.roundRect(secretBoxX, secretBoxY, secretBoxW, secretBoxH, 12);
        ctx.fill();
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.5)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        const rawSecret = (wish.secretNote || 'Wishing you infinite happiness and blessings!').trim();
        const noteContent = `💌 Secret Note: "${rawSecret.length > 50 ? rawSecret.slice(0, 48) + '...' : rawSecret}"`;
        const fittedNoteSize = getFittedFontSize(ctx, noteContent, 'sans-serif', 15, 12, secretBoxW - 30, 'normal');
        ctx.fillStyle = '#92400E';
        ctx.font = `italic ${fittedNoteSize}px sans-serif`;
        ctx.fillText(noteContent, CENTER_X, secretBoxY + 33);

        ctx.restore(); // End Box 2 clip
      }

      ctx.restore();
    }

    /* =========================================================================
       SCENE 4: (20.0s - 25.5s) VIP SURPRISE BIRTHDAY GIFT BOX UNBOXING
       ========================================================================= */
    else if (elapsedSec < 25.5) {
      const sceneElapsed = elapsedSec - 20.0;
      ctx.save();

      // Section Header
      ctx.fillStyle = '#10B981';
      ctx.font = 'bold 22px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🎁 STEP 3: UNWRAPPING YOUR VIP SURPRISE GIFT 🎁', CENTER_X, 135);

      const isGiftUnboxed = sceneElapsed > 2.0;

      // Outer Stage Bounds (Spacious & centered)
      const stageW = 620;
      const stageH = 830;
      const stageX = CENTER_X - stageW / 2;
      const stageY = 175;

      // Outer Stage Card Frame
      ctx.fillStyle = 'rgba(6, 30, 25, 0.95)';
      ctx.beginPath();
      ctx.roundRect(stageX, stageY, stageW, stageH, 26);
      ctx.fill();
      ctx.strokeStyle = '#10B981';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Golden Corner Accents
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 2;
      ctx.strokeRect(stageX + 12, stageY + 12, stageW - 24, stageH - 24);

      if (!isGiftUnboxed) {
        // Luxury 3D Gift Box with Bow (Closed)
        const boxW = 460;
        const boxH = 360;
        const boxX = CENTER_X - boxW / 2;
        const boxY = stageY + 160;

        // Ground shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.beginPath();
        ctx.ellipse(CENTER_X, boxY + boxH + 15, 200, 30, 0, 0, Math.PI * 2);
        ctx.fill();

        // Box Body
        ctx.fillStyle = '#831843';
        ctx.beginPath();
        ctx.roundRect(boxX, boxY, boxW, boxH, 20);
        ctx.fill();
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Box Lid
        const lidW = 480;
        const lidH = 70;
        const lidX = CENTER_X - lidW / 2;
        const lidY = stageY + 140;
        ctx.fillStyle = '#9D174D';
        ctx.beginPath();
        ctx.roundRect(lidX, lidY, lidW, lidH, 14);
        ctx.fill();
        ctx.strokeStyle = '#FCD34D';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Gilded Ribbons
        ctx.fillStyle = '#F59E0B';
        ctx.fillRect(boxX, boxY + 150, boxW, 40);
        ctx.fillRect(CENTER_X - 20, boxY, 40, boxH);
        ctx.fillRect(CENTER_X - 20, lidY, 40, lidH);

        // Big Satin Bow on top
        ctx.font = '80px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🎀', CENTER_X, stageY + 155);

        // Attached Golden Gift Tag
        ctx.fillStyle = '#FDE68A';
        ctx.font = 'bold 24px serif';
        ctx.fillText(giftBox.name, CENTER_X, boxY + boxH + 60);

        ctx.fillStyle = '#94A3B8';
        ctx.font = '16px sans-serif';
        ctx.fillText(`FOR: ${wish.recipientName || 'You'} • FROM: ${wish.senderName || 'Loved One'}`, CENTER_X, boxY + boxH + 90);

        // Unwrapping Prompt
        ctx.fillStyle = '#10B981';
        ctx.beginPath();
        ctx.roundRect(CENTER_X - 170, boxY + boxH + 120, 340, 52, 26);
        ctx.fill();
        ctx.fillStyle = '#022C22';
        ctx.font = 'bold 18px sans-serif';
        ctx.fillText('✨ UNWRAPPING SURPRISE GIFT... ✨', CENTER_X, boxY + boxH + 153);
      } else {
        // UNBOXED SURPRISE GIFT SHOWCASE (Clean borders, NO OVERFLOW)
        const showcaseW = 560;
        const showcaseH = 750;
        const showcaseX = CENTER_X - showcaseW / 2;
        const showcaseY = stageY + 35;

        ctx.fillStyle = 'rgba(6, 78, 59, 0.35)';
        ctx.beginPath();
        ctx.roundRect(showcaseX, showcaseY, showcaseW, showcaseH, 22);
        ctx.fill();
        ctx.strokeStyle = '#10B981';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.save();
        ctx.beginPath();
        ctx.roundRect(showcaseX, showcaseY, showcaseW, showcaseH, 22);
        ctx.clip();

        // Confetti burst
        for (let s = 0; s < 30; s++) {
          const sparkAngle = (s * 12 * Math.PI) / 180;
          const sparkDist = 60 + (sceneElapsed * 40 + s * 10) % 150;
          ctx.fillStyle = (s % 2 === 0) ? '#F59E0B' : '#10B981';
          ctx.beginPath();
          ctx.arc(
            CENTER_X + Math.cos(sparkAngle) * sparkDist,
            showcaseY + 120 + Math.sin(sparkAngle) * sparkDist,
            4, 0, Math.PI * 2
          );
          ctx.fill();
        }

        // Circular Pedestal under gift icon
        const pedGrad = ctx.createRadialGradient(CENTER_X, showcaseY + 110, 10, CENTER_X, showcaseY + 110, 65);
        pedGrad.addColorStop(0, 'rgba(16, 185, 129, 0.5)');
        pedGrad.addColorStop(0.7, 'rgba(245, 158, 11, 0.2)');
        pedGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = pedGrad;
        ctx.beginPath();
        ctx.arc(CENTER_X, showcaseY + 110, 65, 0, Math.PI * 2);
        ctx.fill();

        // Gift Icon Emoji
        ctx.font = '72px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(surpriseGift.emoji, CENTER_X, showcaseY + 130);

        // Gift Title (Dynamically fitted so it NEVER bleeds outside)
        const giftTitleSize = getFittedFontSize(ctx, surpriseGift.name, 'serif', 28, 20, showcaseW - 60);
        ctx.fillStyle = '#FDE68A';
        ctx.font = `bold ${giftTitleSize}px serif`;
        ctx.fillText(surpriseGift.name, CENTER_X, showcaseY + 195);

        // Gift Tagline Pill Badge
        ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
        ctx.beginPath();
        ctx.roundRect(CENTER_X - 180, showcaseY + 215, 360, 36, 18);
        ctx.fill();
        ctx.strokeStyle = '#10B981';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#6EE7B7';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText(surpriseGift.tagline, CENTER_X, showcaseY + 239);

        // PERSONAL NOTE SUB-BOX (Never overflows border!)
        const noteW = 500;
        const noteH = 230;
        const noteX = showcaseX + (showcaseW - noteW) / 2;
        const noteY = showcaseY + 275;

        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.beginPath();
        ctx.roundRect(noteX, noteY, noteW, noteH, 18);
        ctx.fill();
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.save();
        ctx.beginPath();
        ctx.roundRect(noteX, noteY, noteW, noteH, 18);
        ctx.clip();

        // Note Header
        ctx.fillStyle = '#FDE68A';
        ctx.font = 'bold 16px sans-serif';
        const noteSender = (wish.senderName || 'Sender').toUpperCase();
        ctx.fillText(`💌 PERSONAL NOTE FROM ${noteSender}:`, CENTER_X, noteY + 38);

        // Note Wrapped Body
        ctx.fillStyle = '#FEF3C7';
        ctx.font = 'italic 18px serif';
        const rawNote = wish.giftNote || 'A sweet little surprise curated with lots of love! 💖';
        drawWrappedText(
          ctx,
          `"${rawNote}"`,
          CENTER_X,
          noteY + 80,
          noteW - 40,
          27,
          4
        );
        ctx.restore(); // End Note Box clip

        // Bottom VIP Voucher Claim Strip
        const passW = 500;
        const passH = 65;
        const passX = showcaseX + (showcaseW - passW) / 2;
        const passY = showcaseY + 535;

        ctx.fillStyle = 'rgba(16, 185, 129, 0.25)';
        ctx.beginPath();
        ctx.roundRect(passX, passY, passW, passH, 16);
        ctx.fill();
        ctx.strokeStyle = '#10B981';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#34D399';
        ctx.font = 'bold 18px sans-serif';
        ctx.fillText('🎫 VIP BIRTHDAY TREAT PASS • READY TO CLAIM', CENTER_X, passY + 40);

        // Next Outro Teaser
        ctx.fillStyle = '#CBD5E1';
        ctx.font = '20px sans-serif';
        ctx.fillText('Next: Grand Fireworks Finale! 🎆', CENTER_X, showcaseY + 665);

        ctx.restore(); // End Showcase clip
      }

      ctx.restore();
    }

    /* =========================================================================
       SCENE 5: (25.5s - 30.0s) GRAND CELEBRATORY FINALE & WHATSAPP STATUS OUTRO
       ========================================================================= */
    else {
      ctx.save();

      // Giant fireworks bursts across the sky
      for (let fw = 0; fw < 4; fw++) {
        const fwX = 120 + fw * 160;
        const fwY = 160 + (fw % 2) * 80;
        for (let ray = 0; ray < 12; ray++) {
          const angle = (ray * Math.PI) / 6;
          const rayLen = 40 + Math.sin(elapsedSec * 5 + ray) * 25;
          ctx.strokeStyle = (ray % 3 === 0) ? '#F59E0B' : (ray % 3 === 1) ? '#F43F5E' : '#38BDF8';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(fwX, fwY);
          ctx.lineTo(fwX + Math.cos(angle) * rayLen, fwY + Math.sin(angle) * rayLen);
          ctx.stroke();
        }
      }

      // Finale Big Title
      ctx.fillStyle = '#F59E0B';
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('✨ GRAND CELEBRATION FINALE ✨', CENTER_X, 320);

      // Grand Greeting
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 60px serif';
      ctx.fillText('HAPPY BIRTHDAY!', CENTER_X, 405);

      // Glowing Recipient Name
      const glowNameGrad = ctx.createLinearGradient(100, 450, W - 100, 520);
      glowNameGrad.addColorStop(0, '#F59E0B');
      glowNameGrad.addColorStop(0.5, '#EC4899');
      glowNameGrad.addColorStop(1, '#8B5CF6');
      ctx.fillStyle = glowNameGrad;
      ctx.font = 'bold 50px serif';
      ctx.fillText(wish.recipientName || 'Birthday Star', CENTER_X, 480);

      // Festive blessing message card
      ctx.fillStyle = 'rgba(15, 10, 30, 0.88)';
      ctx.beginPath();
      ctx.roundRect(80, 550, SAFE_MAX_W - 40, 280, 24);
      ctx.fill();
      ctx.strokeStyle = '#F43F5E';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = '#F8FAFC';
      ctx.font = '26px serif';
      ctx.fillText('May this special year bring you:', CENTER_X, 610);

      ctx.fillStyle = '#FDE68A';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText('🌟 Endless Happiness & Peace', CENTER_X, 665);
      ctx.fillText('💖 Radiant Health & Success', CENTER_X, 715);
      ctx.fillText('🎂 Dreams Turning Into Reality', CENTER_X, 765);

      // Emojis array
      ctx.font = '50px sans-serif';
      ctx.fillText('🎂 🥂 🎁 💖 🎉 🥳', CENTER_X, 890);

      // Sender Love outro
      ctx.fillStyle = '#CBD5E1';
      ctx.font = 'italic 23px serif';
      ctx.fillText('With All My Love & Warm Prayers,', CENTER_X, 980);

      ctx.fillStyle = '#F43F5E';
      ctx.font = 'bold 34px serif';
      ctx.fillText(wish.senderName || 'Your Loved One', CENTER_X, 1030);

      // Watermark
      ctx.fillStyle = '#64748B';
      ctx.font = '18px sans-serif';
      ctx.fillText('Interactive Birthday Wish Experience • Status Edition', CENTER_X, 1160);

      ctx.restore();
    }

    /* =========================================================================
       GLOBAL STATUS BAR & PROGRESS (Top of canvas)
       ========================================================================= */
    ctx.save();
    // Top right 30s status pill
    ctx.fillStyle = 'rgba(9, 5, 20, 0.85)';
    ctx.beginPath();
    ctx.roundRect(W - 170, 35, 130, 38, 19);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#38BDF8';
    ctx.font = 'bold 18px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${Math.min(30, Math.floor(elapsedSec))}s / 30s`, W - 105, 60);

    ctx.fillStyle = '#F43F5E';
    ctx.font = 'bold 15px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`🎵 ${selectedSong.name.slice(0, 16)}...`, 140, 59);
    ctx.restore();
  };

  // Start animated generation & real recording with the EXACT selected audio track
  const startGenerationAndRecording = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsRecording(true);
    setIsDone(false);
    setRecordedVideoUrl(null);
    recordedChunksRef.current = [];
    setStatusMessage(`Loading soundtrack "${selectedSong.name}" and preparing recording...`);

    const DURATION_SEC = 30;

    // Create AudioContext
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const audioCtx = new AudioCtx();
    audioContextRef.current = audioCtx;
    if (audioCtx.state === 'suspended') {
      await audioCtx.resume();
    }

    const dest = audioCtx.createMediaStreamDestination();

    // Fetch and play the EXACT selected song into the recording stream
    const trackFileUrl = getTrackAudioUrl(wish.musicTrack || 'birthday-classic');
    let hasLoadedAudio = false;

    try {
      const response = await fetch(trackFileUrl);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

      const bufferSource = audioCtx.createBufferSource();
      bufferSource.buffer = audioBuffer;
      bufferSource.loop = true;
      bufferSource.connect(dest);
      bufferSource.connect(audioCtx.destination);
      bufferSource.start(0);
      audioSourceRef.current = bufferSource;
      hasLoadedAudio = true;
      setStatusMessage(`Recording 30s Status Video with "${selectedSong.name}"...`);
    } catch (err) {
      console.warn('Audio fetch/decode issue, using celebratory tone synthesizer:', err);
      const playTone = (freq: number, startT: number, dur: number) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + startT);
        gain.gain.setValueAtTime(0.001, audioCtx.currentTime + startT);
        gain.gain.exponentialRampToValueAtTime(0.25, audioCtx.currentTime + startT + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + startT + dur);
        osc.connect(gain);
        gain.connect(dest);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + startT);
        osc.stop(audioCtx.currentTime + startT + dur);
      };
      const melody = [261.63, 261.63, 293.66, 261.63, 349.23, 329.63, 261.63, 261.63, 293.66, 261.63, 392.00, 349.23];
      for (let loop = 0; loop < 5; loop++) {
        melody.forEach((freq, idx) => {
          playTone(freq, loop * 6 + idx * 0.45, 0.4);
        });
      }
    }

    // Capture video stream from canvas
    const canvasStream = canvas.captureStream(30);
    // Combine video stream with audio destination stream
    const combinedTracks = [
      ...canvasStream.getVideoTracks(),
      ...dest.stream.getAudioTracks()
    ];
    const combinedStream = new MediaStream(combinedTracks);

    let recorder: MediaRecorder;
    try {
      recorder = new MediaRecorder(combinedStream, {
        mimeType: MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
          ? 'video/webm;codecs=vp9,opus'
          : 'video/webm'
      });
    } catch {
      recorder = new MediaRecorder(combinedStream);
    }

    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        recordedChunksRef.current.push(e.data);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      setRecordedVideoUrl(url);
      setIsRecording(false);
      setIsDone(true);
      setStatusMessage('🎉 30s Status Video is Ready! Perfect for WhatsApp & Instagram.');
      
      if (audioSourceRef.current) {
        try { audioSourceRef.current.stop(); } catch {}
      }
      if (audioContextRef.current) {
        try { audioContextRef.current.close(); } catch {}
      }
    };

    recorder.start(100);
    const startTime = performance.now();

    // Animation Loop
    const animate = () => {
      const elapsed = (performance.now() - startTime) / 1000;
      setCurrentTimeSec(Math.min(30, Math.floor(elapsed)));
      setRecordProgress(Math.min(100, Math.round((elapsed / DURATION_SEC) * 100)));

      drawScene(ctx, elapsed);

      if (elapsed < DURATION_SEC) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        if (recorder.state !== 'inactive') {
          recorder.stop();
        }
      }
    };

    animate();
  };

  // Initial draw when opening modal
  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        drawScene(ctx, 0);
      }
    }
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      if (audioSourceRef.current) {
        try { audioSourceRef.current.stop(); } catch {}
      }
      if (audioContextRef.current) {
        try { audioContextRef.current.close(); } catch {}
      }
    };
  }, [isOpen]);

  const downloadVideo = () => {
    if (!recordedVideoUrl) return;
    const a = document.createElement('a');
    a.href = recordedVideoUrl;
    a.download = `Birthday_Status_${(wish.recipientName || 'Celebration').replace(/\s+/g, '_')}_30s.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const shareToWhatsApp = () => {
    const text = encodeURIComponent(
      `🎂 Check out this 30s Birthday Celebration Status Video created for ${wish.recipientName || 'You'}! Watch & celebrate: ${window.location.href}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div id="status-video-modal" className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl md:max-w-4xl bg-[#0e0a1e] border border-white/[0.12] rounded-3xl p-3.5 sm:p-6 shadow-2xl space-y-3.5 sm:space-y-4 my-auto ring-1 ring-white/[0.08] max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-2.5 sm:pb-3">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-2 sm:p-2.5 rounded-2xl bg-gradient-to-tr from-rose-500/20 to-purple-500/20 border border-rose-500/30 shrink-0">
              <Smartphone className="w-4 h-4 sm:w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h3 className="text-sm sm:text-lg font-bold text-white flex items-center gap-2 font-serif">
                <span>WhatsApp 30s Status Video</span>
                <span className="text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30 font-mono">
                  9:16 Vertical
                </span>
              </h3>
              <p className="text-[10px] sm:text-[11px] text-slate-400 line-clamp-1 sm:line-clamp-none">
                Authentic screen recording of the full recipient experience with chosen song
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition cursor-pointer active:scale-95"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area: Canvas Preview + Action Panel (Optimized for Mobile & Desktop) */}
        <div className="flex flex-col md:flex-row gap-4 sm:gap-6 items-center">
          
          {/* Vertical Mobile Phone Mockup Stage */}
          <div className="flex flex-col items-center shrink-0 w-full sm:w-auto">
            <div className="relative w-40 sm:w-52 md:w-60 aspect-[9/16] rounded-3xl overflow-hidden border-4 border-white/[0.15] shadow-2xl bg-slate-950 mx-auto">
              <canvas
                ref={canvasRef}
                width={720}
                height={1280}
                className="w-full h-full object-cover"
              />

              {/* Status Bar Mockup */}
              <div className="absolute top-1.5 inset-x-3 flex justify-between text-[9px] text-white/70 font-semibold pointer-events-none">
                <span>9:41</span>
                <div className="flex items-center gap-1">
                  <span>5G</span>
                  <span>100%</span>
                </div>
              </div>
            </div>

            {/* Playhead Progress */}
            <div className="w-40 sm:w-52 md:w-60 mt-2 space-y-1">
              <div className="flex justify-between text-[10px] font-bold text-slate-400">
                <span>{currentTimeSec}s</span>
                <span className="text-amber-400 font-mono">30s Status Reel</span>
              </div>
              <div className="w-full h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-400 via-rose-500 to-purple-500 transition-all duration-200"
                  style={{ width: `${recordProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Controls & Features */}
          <div className="flex-1 w-full space-y-2.5 sm:space-y-3">
            
            {/* Music Track Badge */}
            <div className="p-2.5 sm:p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-between text-xs text-amber-200">
              <div className="flex items-center gap-2 min-w-0">
                <Volume2 className="w-4 h-4 text-amber-400 shrink-0" />
                <div className="min-w-0">
                  <span className="font-bold block text-amber-100 truncate">{selectedSong.name}</span>
                  <span className="text-[10px] text-amber-300/75">{selectedSong.genre}</span>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-400/20 font-bold shrink-0">Selected Song</span>
            </div>

            {/* 5 Story Moments Roadmap (Responsive 2-column or list) */}
            <div className="p-2.5 sm:p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] space-y-2">
              <h4 className="text-[11px] font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Exact 30s Celebration Journey:</span>
              </h4>
              <ul className="text-[10.5px] sm:text-[11px] text-slate-300 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                <li className="flex items-center gap-1.5">
                  <span className="text-[9.5px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-amber-300 shrink-0">0s-6s</span>
                  <span className="truncate">VIP Royal Pass & invitation</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-[9.5px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-amber-300 shrink-0">6s-13s</span>
                  <span className="truncate">Cake on pedestal & slice</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-[9.5px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-amber-300 shrink-0">13s-20s</span>
                  <span className="truncate">Cardboard card & keepsake</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-[9.5px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-amber-300 shrink-0">20s-25s</span>
                  <span className="truncate">VIP gift unboxing & note</span>
                </li>
                <li className="flex items-center gap-1.5 sm:col-span-2">
                  <span className="text-[9.5px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-amber-300 shrink-0">25s-30s</span>
                  <span className="truncate">Fireworks finale & status outro</span>
                </li>
              </ul>
            </div>

            {/* Status message */}
            <div className="p-2 sm:p-2.5 rounded-2xl bg-purple-500/10 border border-purple-500/25 text-xs text-purple-200 flex items-center gap-2">
              <span className="text-sm shrink-0">🎉</span>
              <span className="truncate">{statusMessage}</span>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-1">
              {!isRecording && !isDone && (
                <button
                  type="button"
                  id="btn-start-record-video"
                  onClick={startGenerationAndRecording}
                  className="w-full flex items-center justify-center gap-2 py-3 sm:py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-500 to-purple-500 hover:from-amber-300 hover:via-rose-400 hover:to-purple-400 text-slate-950 font-bold text-xs sm:text-sm shadow-xl shadow-rose-500/20 transition cursor-pointer active:scale-95 min-h-[44px]"
                >
                  <Film className="w-4 h-4" />
                  <span>Generate 30s Status Video Now</span>
                </button>
              )}

              {isRecording && (
                <div className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-200 font-bold text-xs sm:text-sm animate-pulse min-h-[44px]">
                  <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
                  <span>Recording Status Video ({currentTimeSec}s / 30s)...</span>
                </div>
              )}

              {isDone && recordedVideoUrl && (
                <div className="space-y-2">
                  <button
                    type="button"
                    id="btn-download-status-video"
                    onClick={downloadVideo}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-bold text-xs sm:text-sm shadow-xl shadow-emerald-500/20 transition cursor-pointer active:scale-95 min-h-[44px]"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download 30s Video for Status</span>
                  </button>

                  <button
                    type="button"
                    id="btn-share-whatsapp-status"
                    onClick={shareToWhatsApp}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 text-emerald-300 font-bold text-xs transition cursor-pointer active:scale-95 min-h-[40px]"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share to WhatsApp Status</span>
                  </button>

                  <button
                    type="button"
                    onClick={startGenerationAndRecording}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-slate-400 hover:text-slate-200 text-xs font-semibold cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Re-record Video</span>
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
