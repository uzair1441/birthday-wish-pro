import React from 'react';
import { motion } from 'motion/react';
import { BirthdayWishData } from '../../types';
import { User, Calendar, Heart, Award, Crown, Sparkles } from 'lucide-react';
import { CuteBabySticker } from '../CuteBabySticker';
import { soundManager } from '../../utils/audio';

interface StepRecipientProps {
  data: BirthdayWishData;
  onChange: (updates: Partial<BirthdayWishData>) => void;
}

const RELATIONSHIPS = [
  'Best Friend',
  'Life Partner / Soulmate',
  'Brother',
  'Sister',
  'Mother',
  'Father',
  'Cousin',
  'Close Colleague',
  'Mentor',
  'Special Someone'
];

const MILESTONES = [
  { age: 16, label: 'Sweet 16', tag: '👑' },
  { age: 18, label: 'Legal & Fabulous', tag: '🥂' },
  { age: 21, label: '21st Key to Life', tag: '💎' },
  { age: 25, label: 'Quarter Century', tag: '✨' },
  { age: 30, label: 'Dirty Thirty', tag: '🔥' },
  { age: 40, label: 'Fabulous Forty', tag: '🌟' },
  { age: 50, label: 'Golden Jubilee', tag: '🏆' },
];

export const StepRecipient: React.FC<StepRecipientProps> = ({ data, onChange }) => {
  const handleMilestoneClick = (m: typeof MILESTONES[0]) => {
    soundManager.playClick();
    onChange({ age: m.age, milestoneTitle: `${m.label} (${m.age})` });
  };
  return (
    <div id="step-recipient-container" className="space-y-6">
      <div className="border-b border-white/[0.08] pb-5 flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/25 text-amber-300 text-xs font-semibold mb-2">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>VIP Celebration Profile</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 font-serif">
            Step 1: Who is the Birthday Star?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Personalize the recipient's name, milestone age, and your warm relationship.
          </p>
        </div>
        <div className="hidden sm:block">
          <div className="p-2 rounded-2xl bg-white/[0.04] border border-white/[0.08] shadow-inner">
            <CuteBabySticker id="peach-goma-kiss" size={56} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Recipient Full Name */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-amber-400" />
            Birthday Person's Name <span className="text-rose-400">*</span>
          </label>
          <input
            id="input-recipient-name"
            type="text"
            required
            placeholder="e.g. Ayesha Khan or Zain"
            value={data.recipientName}
            onChange={(e) => onChange({ recipientName: e.target.value })}
            className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.1] text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/70 focus:bg-white/[0.07] focus:ring-2 focus:ring-amber-400/20 text-sm transition"
          />
        </div>

        {/* Nickname / Pet name */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            Nickname / Special Call Name (Optional)
          </label>
          <input
            id="input-nickname"
            type="text"
            placeholder="e.g. Queen, Rockstar, Champ, Angel"
            value={data.nickname || ''}
            onChange={(e) => onChange({ nickname: e.target.value })}
            className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.1] text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/70 focus:bg-white/[0.07] focus:ring-2 focus:ring-amber-400/20 text-sm transition"
          />
        </div>

        {/* Age */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            Turning Age
          </label>
          <div className="flex items-center gap-2.5">
            <input
              id="input-age"
              type="number"
              min={1}
              max={120}
              placeholder="e.g. 21"
              value={data.age || ''}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                onChange({ age: isNaN(val) ? undefined : val });
              }}
              className="w-32 px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.1] text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/70 focus:bg-white/[0.07] focus:ring-2 focus:ring-amber-400/20 text-sm transition"
            />
            <span className="text-xs font-medium text-slate-400">Years Young</span>
          </div>

          {/* Quick milestone picks */}
          <div className="flex flex-wrap gap-1.5 pt-2">
            {MILESTONES.map((m) => (
              <motion.button
                key={m.age}
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleMilestoneClick(m)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition cursor-pointer ${
                  data.age === m.age 
                    ? 'bg-gradient-to-r from-amber-400/25 to-rose-400/25 border-amber-400 text-amber-300 shadow-md ring-1 ring-amber-400/30' 
                    : 'bg-white/[0.03] border-white/[0.08] text-slate-400 hover:text-slate-200 hover:border-white/20'
                }`}
              >
                <span>{m.tag}</span>
                <span>{m.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Sender Name */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-400" />
            Your Name (Sender) <span className="text-rose-400">*</span>
          </label>
          <input
            id="input-sender-name"
            type="text"
            required
            placeholder="e.g. Uzair or Your Bestie"
            value={data.senderName}
            onChange={(e) => onChange({ senderName: e.target.value })}
            className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.1] text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/70 focus:bg-white/[0.07] focus:ring-2 focus:ring-amber-400/20 text-sm transition"
          />
        </div>

        {/* Relationship */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-400" />
            Your Relationship
          </label>
          <select
            id="select-relationship"
            value={data.relationship}
            onChange={(e) => onChange({ relationship: e.target.value })}
            className="w-full px-4 py-3 rounded-2xl bg-[#141026] border border-white/[0.1] text-white focus:outline-none focus:border-amber-400/70 text-sm transition cursor-pointer"
          >
            {RELATIONSHIPS.map((rel) => (
              <option key={rel} value={rel} className="bg-[#141026] text-white">{rel}</option>
            ))}
          </select>
        </div>

        {/* Birthday Date */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-sky-400" />
            Celebration Date (Optional)
          </label>
          <input
            id="input-birthday-date"
            type="date"
            value={data.birthdayDate || ''}
            onChange={(e) => onChange({ birthdayDate: e.target.value })}
            className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.1] text-white focus:outline-none focus:border-amber-400/70 text-sm transition cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};


