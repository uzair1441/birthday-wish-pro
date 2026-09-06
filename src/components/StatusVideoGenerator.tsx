import React, { useState, useEffect, useRef } from 'react';
import { BirthdayWishData } from '../types';
import { CAKE_OPTIONS } from '../data/presets';
import { Download, Share2, Sparkles, Check, Film, X, Play, RefreshCw, Smartphone } from 'lucide-react';

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
  const cake = CAKE_OPTIONS.find(c => c.id === wish.cakeStyle) || CAKE_OPTIONS[0];

  // Pre-load cake image onto an HTMLImageElement
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
    };

    // Load user photo if any
    if (wish.photoUrl) {
      const userImg = new Image();
      userImg.crossOrigin = 'anonymous';
      userImg.src = wish.photoUrl;
      userImg.onload = () => {
        photoImgRef.current = userImg;
      };
    }
  }, [isOpen, cake.realCakeImageUrl, wish.photoUrl]);

  // Canvas drawing function for a given elapsed timestamp (0s to 30s)
  const drawScene = (ctx: CanvasRenderingContext2D, elapsedSec: number) => {
    const W = 720;
    const H = 1280;

    // Clear & background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, '#0F172A');
    bgGrad.addColorStop(0.5, '#1E1B4B');
    bgGrad.addColorStop(1, '#020617');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Dynamic background particles
    ctx.save();
    for (let i = 0; i < 35; i++) {
      const px = ((i * 97 + elapsedSec * 40) % W);
      const py = ((i * 137 + Math.sin(elapsedSec + i) * 60 + elapsedSec * 25) % H);
      const size = 3 + (i % 5) * 2;
      ctx.fillStyle = (i % 3 === 0) ? 'rgba(251, 191, 36, 0.4)' : (i % 3 === 1) ? 'rgba(244, 63, 94, 0.4)' : 'rgba(168, 85, 247, 0.4)';
      ctx.beginPath();
      ctx.arc(px, py, size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // SCENE 1: (0s - 7.5s) Grand Announcement
    if (elapsedSec < 7.5) {
      const sceneProgress = elapsedSec / 7.5;
      
      // Top festive badge
      ctx.save();
      ctx.fillStyle = '#F59E0B';
      ctx.font = 'bold 32px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('✨ SPECIAL BIRTHDAY WISH ✨', W / 2, 180);

      // Main big headline
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 56px serif';
      ctx.fillText('HAPPY BIRTHDAY', W / 2, 280);

      // Recipient Name in gold glowing box
      const nameGrad = ctx.createLinearGradient(100, 360, W - 100, 460);
      nameGrad.addColorStop(0, '#F59E0B');
      nameGrad.addColorStop(0.5, '#EC4899');
      nameGrad.addColorStop(1, '#8B5CF6');
      ctx.fillStyle = nameGrad;
      ctx.font = '900 68px sans-serif';
      ctx.fillText(wish.recipientName || 'Birthday Star', W / 2, 420);

      // Milestone or Nickname
      if (wish.age) {
        ctx.fillStyle = '#38BDF8';
        ctx.font = 'bold 36px sans-serif';
        ctx.fillText(`Turning ${wish.age} & Fabulous! 👑`, W / 2, 500);
      }

      // 3D Cake / celebration art
      if (cakeImgRef.current) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(W / 2, 750, 180, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(cakeImgRef.current, W / 2 - 180, 570, 360, 360);
        ctx.restore();

        // Ring border
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(W / 2, 750, 180, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Sender badge at bottom
      ctx.fillStyle = '#CBD5E1';
      ctx.font = 'italic 30px sans-serif';
      ctx.fillText(`Wished with all love by ${wish.senderName || 'Your Best Friend'} ❤️`, W / 2, 1080);
      ctx.restore();
    }

    // SCENE 2: (7.5s - 15s) Cake & Candle Blow & Cut
    else if (elapsedSec < 15) {
      ctx.save();
      ctx.fillStyle = '#EC4899';
      ctx.font = 'bold 34px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🎂 MAKE A WISH & CUT THE CAKE 🍰', W / 2, 180);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 44px sans-serif';
      ctx.fillText(cake.name, W / 2, 260);

      ctx.fillStyle = '#FCD34D';
      ctx.font = '28px sans-serif';
      ctx.fillText(`Flavor: ${cake.flavorNotes}`, W / 2, 310);

      // Large cake display
      if (cakeImgRef.current) {
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(100, 370, 520, 420, 24);
        ctx.clip();
        ctx.drawImage(cakeImgRef.current, 100, 370, 520, 420);
        ctx.restore();

        ctx.strokeStyle = '#EC4899';
        ctx.lineWidth = 5;
        ctx.stroke();
      }

      // Celebratory status
      ctx.fillStyle = '#10B981';
      ctx.font = '900 38px sans-serif';
      ctx.fillText('✨ Fresh Birthday Cake Sliced with Love! ✨', W / 2, 880);

      ctx.fillStyle = '#F8FAFC';
      ctx.font = 'bold 32px sans-serif';
      ctx.fillText('May this year be as sweet as cake! 🍰', W / 2, 960);
      ctx.restore();
    }

    // SCENE 3: (15s - 22.5s) Personal Photo Memory & Message
    else if (elapsedSec < 22.5) {
      ctx.save();
      ctx.fillStyle = '#A855F7';
      ctx.font = 'bold 34px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('💌 A HEARTFELT MESSAGE 💌', W / 2, 160);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 38px serif';
      ctx.fillText(wish.headline || 'Happy Birthday!', W / 2, 230);

      // If user photo exists, draw polaroid photo
      if (photoImgRef.current) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(W / 2 - 160, 290, 320, 360);

        ctx.drawImage(photoImgRef.current, W / 2 - 140, 310, 280, 260);

        ctx.fillStyle = '#1E293B';
        ctx.font = 'italic bold 20px sans-serif';
        ctx.fillText(wish.photoCaption || 'Precious Memories', W / 2, 620);
      }

      // Message card box
      const msgTop = photoImgRef.current ? 690 : 320;
      const msgHeight = photoImgRef.current ? 400 : 660;

      ctx.fillStyle = 'rgba(30, 41, 59, 0.85)';
      ctx.roundRect(80, msgTop, 560, msgHeight, 20);
      ctx.fill();
      ctx.strokeStyle = '#A855F7';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Message text wrapping
      ctx.fillStyle = '#F8FAFC';
      ctx.font = '28px sans-serif';
      ctx.textAlign = 'center';
      
      const words = (wish.message || '').split(' ');
      let line = '';
      let curY = msgTop + 60;
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > 500 && n > 0) {
          ctx.fillText(line, W / 2, curY);
          line = words[n] + ' ';
          curY += 42;
          if (curY > msgTop + msgHeight - 50) break;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, W / 2, curY);
      ctx.restore();
    }

    // SCENE 4: (22.5s - 30s) Grand Celebratory Finale
    else {
      ctx.save();
      ctx.fillStyle = '#F59E0B';
      ctx.font = 'bold 36px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🎆 GRAND CELEBRATION 🎆', W / 2, 200);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 64px serif';
      ctx.fillText('CHEERS TO YOU!', W / 2, 320);

      ctx.fillStyle = '#38BDF8';
      ctx.font = 'bold 42px sans-serif';
      ctx.fillText(wish.recipientName || 'Birthday Star', W / 2, 410);

      // Fireworks text & blessings
      ctx.fillStyle = '#CBD5E1';
      ctx.font = '30px sans-serif';
      ctx.fillText('May all your dreams turn into reality,', W / 2, 530);
      ctx.fillText('and happiness follow you every day!', W / 2, 580);

      // Animated golden gifts / symbols
      ctx.fillStyle = '#F59E0B';
      ctx.font = '80px sans-serif';
      ctx.fillText('🎁 🥂 🎂 🎈', W / 2, 750);

      ctx.fillStyle = '#E2E8F0';
      ctx.font = 'italic 32px sans-serif';
      ctx.fillText(`With Love Always,`, W / 2, 920);

      ctx.fillStyle = '#EC4899';
      ctx.font = 'bold 40px sans-serif';
      ctx.fillText(`${wish.senderName || 'Your Friend'}`, W / 2, 980);

      // Watermark
      ctx.fillStyle = '#64748B';
      ctx.font = '20px sans-serif';
      ctx.fillText('Generated with Advanced Birthday Wish Portal', W / 2, 1180);
      ctx.restore();
    }

    // Top Right 30s Status Progress Indicator
    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
    ctx.roundRect(W - 170, 40, 140, 44, 22);
    ctx.fill();
    ctx.fillStyle = '#38BDF8';
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${Math.min(30, Math.floor(elapsedSec))}s / 30s`, W - 100, 70);
    ctx.restore();
  };

  // Start animated generation & recording
  const startGenerationAndRecording = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsRecording(true);
    setIsDone(false);
    setRecordedVideoUrl(null);
    recordedChunksRef.current = [];
    setStatusMessage('Rendering 30-second Status Video...');

    const DURATION_SEC = 30;
    const startTime = performance.now();

    // Create Audio context synthesizer to provide real soundtrack in the recorded video
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const audioCtx = new AudioCtx();
    const dest = audioCtx.createMediaStreamDestination();

    // Generate celebratory audio tone track
    const playChime = (freq: number, startT: number, dur: number) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime + startT);
      gain.gain.setValueAtTime(0.001, audioCtx.currentTime + startT);
      gain.gain.exponentialRampToValueAtTime(0.3, audioCtx.currentTime + startT + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + startT + dur);
      osc.connect(gain);
      gain.connect(dest);
      gain.connect(audioCtx.destination);
      osc.start(audioCtx.currentTime + startT);
      osc.stop(audioCtx.currentTime + startT + dur);
    };

    // Happy birthday melody loops (C, C, D, C, F, E...)
    const melody = [261.63, 261.63, 293.66, 261.63, 349.23, 329.63, 261.63, 261.63, 293.66, 261.63, 392.00, 349.23];
    for (let loop = 0; loop < 5; loop++) {
      melody.forEach((freq, idx) => {
        playChime(freq, loop * 6 + idx * 0.45, 0.4);
      });
    }

    // Capture video stream from canvas
    const canvasStream = canvas.captureStream(30);
    // Combine video stream with audio stream
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
      setStatusMessage('🎉 30s Status Video is Ready to Download & Share!');
      audioCtx.close();
    };

    recorder.start(100);

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

  // Initial draw when opening
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
      `🎂 Watch my special 30s Birthday Status Wish created for ${wish.recipientName || 'You'}! Open the interactive wish: ${window.location.href}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div id="status-video-modal" className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0c0919] border border-white/[0.12] rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5 my-auto ring-1 ring-white/[0.05]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-rose-500/20 to-purple-500/20 border border-rose-500/30">
              <Smartphone className="w-6 h-6 text-rose-400" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2 font-serif">
                <span>Put on Your Status (30s Video)</span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30 font-mono">
                  9:16 Mobile
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Automatically generate a 30-second animated story with music for WhatsApp & Instagram Status!
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition cursor-pointer active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area: Canvas Preview + Action Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
          
          {/* Vertical Mobile Phone Mockup Stage */}
          <div className="flex flex-col items-center">
            <div className="relative w-56 sm:w-60 aspect-[9/16] rounded-3xl overflow-hidden border-4 border-white/[0.12] shadow-2xl bg-slate-950">
              <canvas
                ref={canvasRef}
                width={720}
                height={1280}
                className="w-full h-full object-cover"
              />

              {/* Status Bar Mockup */}
              <div className="absolute top-2 inset-x-4 flex justify-between text-[10px] text-white/70 font-semibold pointer-events-none">
                <span>9:41</span>
                <div className="flex items-center gap-1">
                  <span>5G</span>
                  <span>100%</span>
                </div>
              </div>
            </div>

            {/* Playhead Progress */}
            <div className="w-56 sm:w-60 mt-3 space-y-1">
              <div className="flex justify-between text-[11px] font-bold text-slate-400">
                <span>{currentTimeSec}s</span>
                <span className="text-amber-400 font-mono">30s Status Video</span>
              </div>
              <div className="w-full h-2 bg-white/[0.08] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-400 via-rose-500 to-purple-500 transition-all duration-200"
                  style={{ width: `${recordProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Controls & Features */}
          <div className="space-y-4">
            
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] space-y-2">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>What's inside the 30s status video?</span>
              </h4>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                <li><strong className="text-white">0s - 7s:</strong> Grand opening & recipient celebration name</li>
                <li><strong className="text-white">7s - 15s:</strong> Real cake showcase & celebration cake cut</li>
                <li><strong className="text-white">15s - 23s:</strong> Heartfelt letter & memory photo reveal</li>
                <li><strong className="text-white">23s - 30s:</strong> Fireworks finale & special blessings</li>
              </ul>
            </div>

            {/* Status message */}
            <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/25 text-xs text-purple-200 flex items-center gap-2">
              <span className="text-base">🎉</span>
              <span>{statusMessage}</span>
            </div>

            {/* Actions */}
            <div className="space-y-2.5 pt-2">
              {!isRecording && !isDone && (
                <button
                  type="button"
                  id="btn-start-record-video"
                  onClick={startGenerationAndRecording}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-500 to-purple-500 hover:from-amber-300 hover:via-rose-400 hover:to-purple-400 text-slate-950 font-bold text-xs sm:text-sm shadow-xl shadow-rose-500/20 transition cursor-pointer active:scale-95"
                >
                  <Film className="w-4 h-4" />
                  <span>Generate 30s Status Video Now</span>
                </button>
              )}

              {isRecording && (
                <div className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-200 font-bold text-sm animate-pulse">
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
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/20 transition cursor-pointer active:scale-95"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download 30s Video for Status</span>
                  </button>

                  <button
                    type="button"
                    id="btn-share-whatsapp-status"
                    onClick={shareToWhatsApp}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 text-emerald-300 font-bold text-xs transition cursor-pointer active:scale-95"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share Link to WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={startGenerationAndRecording}
                    className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-slate-400 hover:text-slate-200 text-xs font-semibold cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Re-generate Video</span>
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
