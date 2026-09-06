import React, { useRef } from 'react';
import { BirthdayWishData } from '../../types';
import { PRESET_MESSAGES } from '../../data/presets';
import { CUTE_STICKER_LIST, CuteBabySticker } from '../CuteBabySticker';
import { Image as ImageIcon, Lock, Upload, Trash2, Check } from 'lucide-react';

interface StepMessagePhotoProps {
  data: BirthdayWishData;
  onChange: (updates: Partial<BirthdayWishData>) => void;
}

export const StepMessagePhoto: React.FC<StepMessagePhotoProps> = ({ data, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const applyPresetMessage = (preset: typeof PRESET_MESSAGES[0]) => {
    onChange({
      headline: preset.headline,
      message: preset.message
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      alert('Photo is a bit too large! Please choose an image under 4MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      onChange({ photoUrl: event.target?.result as string });
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    onChange({ photoUrl: undefined, photoCaption: undefined });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const toggleSticker = (stickerId: string) => {
    const current = data.selectedStickers || [];
    if (current.includes(stickerId)) {
      if (current.length <= 1) return; // Keep at least 1
      onChange({ selectedStickers: current.filter(id => id !== stickerId) });
    } else {
      if (current.length >= 6) return; // Max 6
      onChange({ selectedStickers: [...current, stickerId] });
    }
  };

  return (
    <div id="step-message-photo-container" className="space-y-6">
      
      <div className="border-b border-white/[0.08] pb-5 flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs font-semibold mb-2">
            <span>💌</span>
            <span>Heartfelt Keepsake Studio</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 font-serif">
            Step 4: Heartfelt Wish, Cute Stickers & Photo
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Express your warmest thoughts, select cute animated baby stickers, and attach a memory photo.
          </p>
        </div>
        <div className="hidden sm:block">
          <div className="p-2 rounded-2xl bg-white/[0.04] border border-white/[0.08] shadow-inner">
            <CuteBabySticker id="peach-goma-kiss" size={54} />
          </div>
        </div>
      </div>

      {/* Cute Animated Baby Stickers */}
      <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/[0.08] space-y-3.5 shadow-xl">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-white flex items-center gap-2">
            <span className="text-amber-400">✨</span>
            <span>Select Cute Animated Baby & Kitten Stickers</span>
          </label>
          <span className="text-[11px] text-amber-300 font-semibold bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20 font-mono">
            {(data.selectedStickers || []).length} / 6 selected
          </span>
        </div>
        <p className="text-xs text-slate-400">
          Cute Peach & Goma and Bubu & Dudu animated baby stickers that hug, kiss, and celebrate in the wish!
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          {CUTE_STICKER_LIST.map((sticker) => {
            const isSelected = (data.selectedStickers || []).includes(sticker.id);
            return (
              <button
                key={sticker.id}
                type="button"
                onClick={() => toggleSticker(sticker.id)}
                className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center transition-all cursor-pointer relative group active:scale-95 ${
                  isSelected
                    ? 'bg-gradient-to-b from-rose-500/20 to-purple-600/10 border-rose-400 shadow-lg ring-2 ring-rose-400/30 scale-[1.02]'
                    : 'bg-white/[0.03] border-white/[0.08] hover:border-white/20 opacity-75 hover:opacity-100'
                }`}
              >
                <CuteBabySticker id={sticker.id} size={54} animate={true} />
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-gradient-to-tr from-amber-400 to-rose-500 text-slate-950 flex items-center justify-center text-[10px] font-bold shadow">
                    <Check className="w-3 h-3 stroke-[3.5]" />
                  </div>
                )}
                <span className="text-xs font-bold text-white mt-2 truncate max-w-full">
                  {sticker.name}
                </span>
                <span className="text-[10px] text-rose-300/80">
                  {sticker.tag}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Template Inspirations */}
      <div>
        <label className="text-xs font-semibold text-slate-300 block mb-2">
          Quick Message Inspiration (Click to load template):
        </label>
        <div className="flex flex-wrap gap-2">
          {PRESET_MESSAGES.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyPresetMessage(preset)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-medium bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-200 hover:text-amber-300 transition cursor-pointer active:scale-95"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Headline */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300">
          Birthday Greeting Headline
        </label>
        <input
          id="input-headline"
          type="text"
          placeholder="e.g. Wishing the Happiest Birthday to the Most Wonderful Soul!"
          value={data.headline}
          onChange={(e) => onChange({ headline: e.target.value })}
          className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.1] text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/70 focus:bg-white/[0.07] focus:ring-2 focus:ring-amber-400/20 text-sm transition"
        />
      </div>

      {/* Main Message Body */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
          <span>Personal Birthday Letter / Wish <span className="text-rose-400">*</span></span>
          <span className="text-[11px] text-slate-400 font-mono">
            {data.message.length} characters
          </span>
        </label>
        <textarea
          id="textarea-message"
          rows={5}
          placeholder="Write your genuine, warm words here... Remind them of your memories, how special they are, and your prayers for their year ahead!"
          value={data.message}
          onChange={(e) => onChange({ message: e.target.value })}
          className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.1] text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/70 focus:bg-white/[0.07] focus:ring-2 focus:ring-amber-400/20 text-sm leading-relaxed transition"
        />
      </div>

      {/* Memory Photo Upload Section */}
      <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/[0.08] space-y-3.5 shadow-xl">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4 text-pink-400" />
            Special Memory Photo (Optional)
          </label>
          {data.photoUrl && (
            <button
              type="button"
              onClick={removePhoto}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Remove Photo
            </button>
          )}
        </div>

        {data.photoUrl ? (
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-1">
            {/* Polaroid Frame Preview */}
            <div className="p-2.5 bg-white rounded-xl shadow-2xl -rotate-2 transform hover:rotate-0 transition duration-300 max-w-[170px]">
              <img
                src={data.photoUrl}
                alt="Birthday Memory"
                className="w-36 h-40 object-cover rounded shadow-inner"
              />
              <p className="text-[10px] text-stone-800 text-center font-serif mt-1 truncate font-semibold">
                {data.photoCaption || 'Best Memories ❤️'}
              </p>
            </div>

            <div className="flex-1 w-full space-y-2">
              <label className="text-xs font-medium text-slate-300">Photo Caption / Note</label>
              <input
                type="text"
                placeholder="e.g. Remember that unforgettable trip together? 😄"
                value={data.photoCaption || ''}
                onChange={(e) => onChange({ photoCaption: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white placeholder-slate-500 focus:border-amber-400/70"
              />
              <p className="text-[11px] text-slate-400">
                This photo will be displayed in an animated polaroid keepsake inside the celebration!
              </p>
            </div>
          </div>
        ) : (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-white/20 hover:border-amber-400/60 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer bg-white/[0.02] hover:bg-white/[0.05] transition"
            >
              <div className="w-11 h-11 rounded-2xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-amber-300">
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-xs font-medium text-slate-200">
                Click or drag to upload a birthday memory photo
              </p>
              <p className="text-[11px] text-slate-500">
                Supports JPG, PNG, WEBP (Max 4MB)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Secret Message / Hidden Surprise */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-amber-400" />
          Secret Surprise Note (Revealed on Tap / Scratch)
        </label>
        <input
          id="input-secret-message"
          type="text"
          placeholder="e.g. Check your closet for an actual wrapped present! 🎁 or A surprise dinner is booked at 8 PM!"
          value={data.secretMessage || ''}
          onChange={(e) => onChange({ secretMessage: e.target.value })}
          className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.1] text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/70 focus:bg-white/[0.07] focus:ring-2 focus:ring-amber-400/20 text-sm transition"
        />
        <p className="text-[11px] text-slate-500">
          The recipient will see a mystery card they tap to reveal this confidential note!
        </p>
      </div>
    </div>
  );
};
