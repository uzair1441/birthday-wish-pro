import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, X } from 'lucide-react';

export interface ValidationNotificationData {
  title: string;
  message: string;
  missingFields: string[];
}

interface ValidationPopupNotificationProps {
  notification: ValidationNotificationData | null;
  onClose: () => void;
  onFocusField?: (fieldId: string) => void;
}

export const ValidationPopupNotification: React.FC<ValidationPopupNotificationProps> = ({
  notification,
  onClose,
  onFocusField
}) => {
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4500);
    return () => clearTimeout(timer);
  }, [notification, onClose]);

  return (
    <AnimatePresence>
      {notification && (
        <div
          id="step-validation-popup"
          className="fixed top-5 left-1/2 -translate-x-1/2 z-50 pointer-events-auto px-3 w-full max-w-md flex justify-center"
        >
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 450, damping: 28 }}
            onClick={() => {
              if (notification.missingFields.length > 0 && onFocusField) {
                onFocusField(notification.missingFields[0]);
              }
            }}
            className="w-full sm:w-auto min-w-[300px] max-w-md flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-950/95 border border-rose-500/70 shadow-[0_10px_35px_rgba(244,63,94,0.35)] backdrop-blur-xl text-white cursor-pointer group"
          >
            {/* Small Alert Icon */}
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
              <AlertCircle className="w-4 h-4 stroke-[2.5] animate-pulse" />
            </div>

            {/* Small Content Text */}
            <div className="flex-1 min-w-0 pr-1">
              <h5 className="text-xs font-bold text-rose-200 flex items-center gap-1.5 leading-snug">
                <span>{notification.title}</span>
              </h5>
              <p className="text-[11px] text-slate-300 leading-tight mt-0.5 truncate sm:whitespace-normal">
                {notification.message}
              </p>
            </div>

            {/* Small Close Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition shrink-0 cursor-pointer"
              title="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
