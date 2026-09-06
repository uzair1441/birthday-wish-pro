import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, Sparkles, Cake, Music, User, ChevronUp, ChevronDown } from 'lucide-react';
import { BirthdayWishData } from '../types';

interface LiveCompanionDockProps {
  wish: BirthdayWishData;
  onPreview: () => void;
}

export const LiveCompanionDock: React.FC<LiveCompanionDockProps> = ({
  wish,
  onPreview
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-sm w-[calc(100vw-2rem)] sm:w-auto">
      <motion.div 
        layout
        className="rounded-3xl bg-[#0e0a1f]/90 border border-amber-400/30 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] p-3 text-xs overflow-hidden"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
            </span>
            <span className="font-bold text-white text-xs font-serif flex items-center gap-1.5">
              <span>Live Celebration Card</span>
              <span className="text-[10px] font-mono text-amber-300 font-semibold px-1.5 py-0.2 rounded-full bg-amber-400/10 border border-amber-400/20">
                LIVE
              </span>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 text-slate-400 hover:text-white rounded-lg transition cursor-pointer"
              title={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={onPreview}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-rose-500 hover:from-amber-300 hover:to-rose-400 text-slate-950 font-bold text-[11px] shadow-md shadow-rose-500/20 transition cursor-pointer"
            >
              <Eye className="w-3 h-3" />
              <span>Full Preview</span>
            </motion.button>
          </div>
        </div>

        {/* Expandable customized content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-2.5 pt-2 border-t border-white/[0.08] grid grid-cols-3 gap-2 text-[10px]"
            >
              <div>
                <span className="text-slate-500 block">For:</span>
                <span className="font-bold text-white truncate block">
                  {wish.recipientName || 'Birthday Star'}
                </span>
                <span className="text-amber-400">{wish.age ? `${wish.age} yrs` : 'Milestone'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Cake:</span>
                <span className="font-semibold text-amber-200 capitalize truncate block">
                  {wish.cakeStyle.replace('-', ' ')}
                </span>
                <span className="text-emerald-400">Whole Bakery</span>
              </div>
              <div>
                <span className="text-slate-500 block">Soundtrack:</span>
                <span className="font-semibold text-rose-300 capitalize truncate block">
                  {wish.musicTrack.replace('happy-birthday-', '').replace('-', ' ')}
                </span>
                <span className="text-purple-300">Studio Audio</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
