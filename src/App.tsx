import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BirthdayWishData, PaymentAccountConfig } from './types';
import { DEFAULT_PAYMENT_CONFIG } from './data/presets';
import { decodeWishFromUrl } from './utils/codec';
import { soundManager } from './utils/audio';

import { Navbar } from './components/Navbar';
import { AnimatedBackground } from './components/AnimatedBackground';
import { AnimatedHero } from './components/AnimatedHero';
import { StepIndicator } from './components/StepIndicator';
import { StepRecipient } from './components/steps/StepRecipient';
import { StepCakeCandles } from './components/steps/StepCakeCandles';
import { StepThemeMusic } from './components/steps/StepThemeMusic';
import { StepMessagePhoto } from './components/steps/StepMessagePhoto';
import { StepInteractions } from './components/steps/StepInteractions';
import { StepPaymentShare } from './components/steps/StepPaymentShare';
import { CelebrationView } from './components/CelebrationView';
import { AccountSettingsModal } from './components/AccountSettingsModal';
import { ValidationPopupNotification, ValidationNotificationData } from './components/ValidationPopupNotification';

import { ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';

const INITIAL_WISH: BirthdayWishData = {
  id: `wish_${Date.now()}`,
  recipientName: '',
  nickname: '',
  age: 21,
  milestoneTitle: '21st Milestone 💖',
  senderName: '',
  relationship: 'Best Friend',
  cakeStyle: 'chocolate-fudge',
  theme: 'midnight-magic',
  musicTrack: 'birthday-classic',
  particles: ['balloons', 'confetti', 'stars'],
  selectedStickers: ['peach-goma-kiss', 'bubu-dudu-hug', 'chibi-cake', 'chibi-dance'],
  headline: 'Wishing You The Happiest Birthday Ever!',
  message: 'Happy Birthday! On your special day, I hope you are surrounded by love, warmth, and laughter. You bring so much joy into everyone’s life. May this coming year fulfill your biggest dreams and keep you smiling every single day! 🎂✨',
  secretMessage: '',
  giftBoxStyle: 'royal-crimson',
  surpriseGift: 'chocolates-roses',
  giftNote: 'A sweet little surprise curated with lots of love! 💖',
  enableCutCake: true,
  enablePopBalloons: true,
  enableUnwrapGift: true,
  enableConfettiPopper: true,
  createdAt: Date.now(),
  isPaid: false
};

const ACCOUNTS_STORAGE_KEY = 'birthday_creator_payment_accounts_v1';

export default function App() {
  const [wish, setWish] = useState<BirthdayWishData>(INITIAL_WISH);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [maxReachedStep, setMaxReachedStep] = useState<number>(1);
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [standaloneWish, setStandaloneWish] = useState<BirthdayWishData | null>(null);

  // Validation state & notification modal/toast
  const [validationNotice, setValidationNotice] = useState<ValidationNotificationData | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    recipientName?: boolean;
    senderName?: boolean;
    nickname?: boolean;
  }>({});

  // Payment configuration
  const [accountConfig, setAccountConfig] = useState<PaymentAccountConfig>(() => {
    try {
      const saved = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_PAYMENT_CONFIG;
    } catch {
      return DEFAULT_PAYMENT_CONFIG;
    }
  });

  // Check URL hash or query param for recipient mode
  useEffect(() => {
    const parseUrlForWish = () => {
      let encodedStr = '';
      if (window.location.hash.startsWith('#wish=')) {
        encodedStr = window.location.hash.replace('#wish=', '');
      } else {
        const params = new URLSearchParams(window.location.search);
        const qWish = params.get('wish');
        if (qWish) encodedStr = qWish;
      }

      if (encodedStr) {
        const decoded = decodeWishFromUrl(encodedStr);
        if (decoded) {
          setStandaloneWish(decoded);
        }
      }
    };

    parseUrlForWish();
    window.addEventListener('hashchange', parseUrlForWish);
    return () => window.removeEventListener('hashchange', parseUrlForWish);
  }, []);

  const handleUpdateWish = (updates: Partial<BirthdayWishData>) => {
    setWish(prev => ({ ...prev, ...updates }));

    // Dynamically clear validation error when the user types in that field
    setValidationErrors(prev => {
      const next = { ...prev };
      if (updates.recipientName !== undefined && updates.recipientName.trim().length > 0) {
        next.recipientName = false;
      }
      if (updates.senderName !== undefined && updates.senderName.trim().length > 0) {
        next.senderName = false;
      }
      return next;
    });
  };

  const handleSaveAccounts = (updated: PaymentAccountConfig) => {
    setAccountConfig(updated);
    try {
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  };

  const focusFirstMissingField = (elementId: string) => {
    setTimeout(() => {
      const el = document.getElementById(elementId);
      if (el) {
        el.focus();
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 120);
  };

  // Step 1 Validation logic:
  // Mandatory fields: Birthday Person Name & Sender Name (Nickname is optional)
  // If both mandatory fields missing => "Enter Your Data"
  // If one specific mandatory field missing => specific message ("Enter Birthday Person Name" or "Enter the Sender Name")
  const validateStep1 = (): boolean => {
    const isRecipientMissing = !wish.recipientName.trim();
    const isSenderMissing = !wish.senderName.trim();

    // Condition 1: BOTH mandatory fields are missing
    if (isRecipientMissing && isSenderMissing) {
      setValidationErrors({
        recipientName: true,
        senderName: true,
        nickname: false
      });
      setValidationNotice({
        title: 'Enter Your Data',
        message: 'You missed that thing! Please enter Birthday Person Name & Sender Name.',
        missingFields: ['recipientName', 'senderName']
      });
      soundManager.playAlertNotice();
      focusFirstMissingField('input-recipient-name');
      return false;
    }

    // Condition 2: Only Birthday Person Name is missing
    if (isRecipientMissing) {
      setValidationErrors({
        recipientName: true,
        senderName: false,
        nickname: false
      });
      setValidationNotice({
        title: 'Enter Birthday Person Name',
        message: 'You missed that thing! Please enter Birthday Person Name.',
        missingFields: ['recipientName']
      });
      soundManager.playAlertNotice();
      focusFirstMissingField('input-recipient-name');
      return false;
    }

    // Condition 3: Only Sender Name is missing
    if (isSenderMissing) {
      setValidationErrors({
        recipientName: false,
        senderName: true,
        nickname: false
      });
      setValidationNotice({
        title: 'Enter the Sender Name',
        message: 'You missed that thing! Please enter the Sender Name.',
        missingFields: ['senderName']
      });
      soundManager.playAlertNotice();
      focusFirstMissingField('input-sender-name');
      return false;
    }

    // Both mandatory fields are filled
    setValidationErrors({});
    setValidationNotice(null);
    return true;
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!validateStep1()) {
        return;
      }
    }

    soundManager.playClick();
    const next = Math.min(6, currentStep + 1);
    setCurrentStep(next);
    if (next > maxReachedStep) {
      setMaxReachedStep(next);
    }
    // Directly stay and scroll into the Step Wizard section (no jumping back to hero/top)
    setTimeout(() => {
      const wizardEl = document.getElementById('step-wizard-section');
      if (wizardEl) {
        wizardEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  const handlePrevStep = () => {
    soundManager.playClick();
    setCurrentStep(prev => Math.max(1, prev - 1));
    setTimeout(() => {
      const wizardEl = document.getElementById('step-wizard-section');
      if (wizardEl) {
        wizardEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  const handleResetForm = () => {
    if (confirm('Start a fresh birthday wish? Any unsaved edits will be reset.')) {
      setWish({
        ...INITIAL_WISH,
        id: `wish_${Date.now()}`
      });
      setCurrentStep(1);
      setMaxReachedStep(1);
    }
  };

  // If viewing a shared link as a recipient
  if (standaloneWish) {
    return (
      <CelebrationView
        wish={standaloneWish}
        isStandaloneRecipient={true}
      />
    );
  }

  // If in Preview Mode
  if (isPreviewOpen) {
    return (
      <CelebrationView
        wish={wish}
        onExitPreview={() => setIsPreviewOpen(false)}
        isStandaloneRecipient={false}
      />
    );
  }

  return (
    <div id="creator-app" className="min-h-screen bg-[#070510] text-slate-100 flex flex-col selection:bg-amber-400 selection:text-slate-950 relative overflow-x-hidden font-sans">
      
      {/* Dynamic Animated Ambient Lights & Background Physics */}
      <AnimatedBackground />

      {/* Validation Notification Modal/Toast */}
      <ValidationPopupNotification
        notification={validationNotice}
        onClose={() => setValidationNotice(null)}
        onFocusField={(fieldKey) => {
          const id = fieldKey === 'recipientName' ? 'input-recipient-name' :
                     fieldKey === 'nickname' ? 'input-nickname' : 'input-sender-name';
          focusFirstMissingField(id);
        }}
      />

      {/* Top Header */}
      <Navbar
        onOpenSettings={() => setIsSettingsOpen(true)}
        onPreview={() => setIsPreviewOpen(true)}
        onReset={handleResetForm}
        isUnlocked={wish.isPaid}
      />

      {/* Animated Hero Presentation Showcase (Only shown on Step 1 / Main Page, hidden on Step 2, 3, 4, 5) */}
      {currentStep === 1 && (
        <AnimatedHero
          onQuickPreview={() => setIsPreviewOpen(true)}
          onScrollToBuilder={() => {
            const el = document.getElementById('step-wizard-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      )}

      {/* Main Wizard Area */}
      <main id="step-wizard-section" className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6 z-10 scroll-mt-20">
        
        {/* Step Progression Bar with Glassmorphic Floating Dock */}
        <div className="rounded-3xl p-4 sm:p-5 modern-animated-card">
          <StepIndicator
            currentStep={currentStep}
            onSelectStep={(s) => {
              if (currentStep === 1 && s > 1) {
                if (!validateStep1()) {
                  return;
                }
              }
              soundManager.playClick();
              setCurrentStep(s);
              setTimeout(() => {
                const wizardEl = document.getElementById('step-wizard-section');
                if (wizardEl) {
                  wizardEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }, 50);
            }}
            maxReachedStep={maxReachedStep}
          />
        </div>

        {/* Active Step Panel with Framer Motion Transition */}
        <section aria-label="Step Content" className="modern-animated-card rounded-[2.5rem] p-5 sm:p-8 relative overflow-hidden">
          {/* Subtle top metallic gold shimmer line */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent pointer-events-none" />

          {/* Smooth animated step transition */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 25, filter: 'blur(4px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: -25, filter: 'blur(4px)' }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {currentStep === 1 && (
                <StepRecipient
                  data={wish}
                  onChange={handleUpdateWish}
                  errors={validationErrors}
                />
              )}

              {currentStep === 2 && (
                <StepCakeCandles
                  data={wish}
                  onChange={handleUpdateWish}
                />
              )}

              {currentStep === 3 && (
                <StepThemeMusic
                  data={wish}
                  onChange={handleUpdateWish}
                />
              )}

              {currentStep === 4 && (
                <StepMessagePhoto
                  data={wish}
                  onChange={handleUpdateWish}
                />
              )}

              {currentStep === 5 && (
                <StepInteractions
                  data={wish}
                  onChange={handleUpdateWish}
                />
              )}

              {currentStep === 6 && (
                <StepPaymentShare
                  data={wish}
                  onChange={handleUpdateWish}
                  accountConfig={accountConfig}
                  onOpenSettings={() => setIsSettingsOpen(true)}
                  onPreviewCelebration={() => setIsPreviewOpen(true)}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Step Footer Navigation Buttons */}
          <div className="mt-8 pt-6 border-t border-white/[0.08] flex items-center justify-between">
            {currentStep > 1 ? (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                id="btn-prev-step"
                onClick={handlePrevStep}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 font-semibold text-xs sm:text-sm border border-white/[0.08] transition cursor-pointer active:scale-95"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous Step</span>
              </motion.button>
            ) : (
              <div />
            )}

            {currentStep < 6 ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                id="btn-next-step"
                onClick={handleNextStep}
                className="flex items-center gap-2.5 px-7 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-500 to-amber-400 hover:from-amber-300 hover:via-rose-400 hover:to-amber-300 text-slate-950 font-bold text-xs sm:text-sm shadow-xl shadow-rose-500/20 transition cursor-pointer"
              >
                <span>Continue to Step {currentStep + 1}</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                id="btn-final-preview"
                onClick={() => setIsPreviewOpen(true)}
                className="flex items-center gap-2.5 px-7 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-400 to-purple-400 text-slate-950 font-bold text-xs sm:text-sm shadow-xl shadow-amber-500/20 transition cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Experience Celebration</span>
              </motion.button>
            )}
          </div>
        </section>

      </main>

      {/* Account Settings Modal */}
      <AccountSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={accountConfig}
        onSave={handleSaveAccounts}
      />

    </div>
  );
}
