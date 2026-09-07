import React, { useState, useEffect } from 'react';
import { BirthdayWishData, PaymentAccountConfig } from '../../types';
import { createShortWishLink, saveWishToHistory } from '../../utils/codec';
import { soundManager } from '../../utils/audio';
import { verifyTransactionId } from '../../utils/tidVerification';
import { 
  shareToWhatsAppWithCard, 
  downloadWhatsAppCard, 
  formatWhatsAppMessage 
} from '../../utils/whatsappShare';
import { 
  CheckCircle2, 
  Copy, 
  Check, 
  ExternalLink, 
  Smartphone, 
  CreditCard, 
  Building, 
  ShieldCheck, 
  ShieldAlert,
  AlertTriangle,
  Sparkles, 
  Settings,
  Eye,
  PartyPopper,
  Download,
  Share2,
  Image as ImageIcon
} from 'lucide-react';
import { CuteBabySticker } from '../CuteBabySticker';
import confetti from 'canvas-confetti';

interface StepPaymentShareProps {
  data: BirthdayWishData;
  onChange: (updates: Partial<BirthdayWishData>) => void;
  accountConfig: PaymentAccountConfig;
  onOpenSettings: () => void;
  onPreviewCelebration: () => void;
}

export const StepPaymentShare: React.FC<StepPaymentShareProps> = ({
  data,
  onChange,
  accountConfig,
  onOpenSettings,
  onPreviewCelebration
}) => {
  const [activePaymentTab, setActivePaymentTab] = useState<'easypaisa' | 'sadapay' | 'bank'>('easypaisa');
  const [transactionIdInput, setTransactionIdInput] = useState<string>(data.transactionId || '');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [shareUrl, setShareUrl] = useState<string>('');
  const [linkCopied, setLinkCopied] = useState<boolean>(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [isDuplicateAlert, setIsDuplicateAlert] = useState<boolean>(false);
  const [verificationSuccess, setVerificationSuccess] = useState<string | null>(null);
  const [isSharingWhatsApp, setIsSharingWhatsApp] = useState<boolean>(false);
  const [isDownloadingCard, setIsDownloadingCard] = useState<boolean>(false);
  const [isGeneratingLink, setIsGeneratingLink] = useState<boolean>(false);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    soundManager.playClick();
    setTimeout(() => setCopiedKey(null), 2200);
  };

  const handleUnlockPayment = async (isDemoBypass = false) => {
    setVerificationError(null);
    setIsDuplicateAlert(false);
    setVerificationSuccess(null);

    if (isDemoBypass) {
      setIsVerifying(true);
      soundManager.playClick();
      const testTid = `DEMO-${Date.now().toString().slice(-6)}`;
      const updatedData: BirthdayWishData = {
        ...data,
        isPaid: true,
        transactionId: testTid
      };
      onChange(updatedData);
      saveWishToHistory(updatedData);

      // Generate ultra-short link
      const shortLink = await createShortWishLink(updatedData);
      setShareUrl(shortLink);

      setIsVerifying(false);
      soundManager.playCelebrationFanfare();

      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#8B5CF6']
      });
      return;
    }

    const trimmedTid = transactionIdInput.trim();
    if (!trimmedTid) {
      setVerificationError('Barah-e-karam apni Easypaisa / SadaPay / Bank Transaction ID (TID) enter karein.');
      soundManager.playClick();
      return;
    }

    setIsVerifying(true);
    soundManager.playClick();

    // Call anti-duplicate real-time verification engine (zero waiting time)
    const result = await verifyTransactionId({
      tid: trimmedTid,
      recipientName: data.recipientName,
      senderName: data.senderName,
      amount: accountConfig.priceRs || 300,
      wishId: data.id,
      source: activePaymentTab
    });

    if (!result.success) {
      setIsVerifying(false);
      setVerificationError(result.message);
      if (result.status === 'ALREADY_USED') {
        setIsDuplicateAlert(true);
      }
      soundManager.playClick();
      return;
    }

    // Fresh valid TID verified instantly!
    const updatedData: BirthdayWishData = {
      ...data,
      isPaid: true,
      transactionId: result.tid
    };
    onChange(updatedData);
    saveWishToHistory(updatedData);

    // Generate ultra-short link
    const shortLink = await createShortWishLink(updatedData);
    setShareUrl(shortLink);

    setIsVerifying(false);
    setVerificationSuccess('Payment Transaction ID verified successfully! VIP Celebration link unlocked.');
    soundManager.playCelebrationFanfare();

    confetti({
      particleCount: 90,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#8B5CF6']
    });
  };

  // Pre-generate clean short URL if already marked paid
  useEffect(() => {
    let isMounted = true;
    if (data.isPaid && !shareUrl) {
      setIsGeneratingLink(true);
      createShortWishLink(data)
        .then((url) => {
          if (isMounted) {
            setShareUrl(url);
            setIsGeneratingLink(false);
          }
        })
        .catch(() => {
          if (isMounted) setIsGeneratingLink(false);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [data.isPaid, data, shareUrl]);

  const handleShareWhatsApp = async () => {
    if (!shareUrl) return;
    setIsSharingWhatsApp(true);
    soundManager.playClick();
    try {
      await shareToWhatsAppWithCard({
        recipientName: data.recipientName,
        senderName: data.senderName,
        age: data.age,
        shareUrl
      });
    } finally {
      setIsSharingWhatsApp(false);
    }
  };

  const handleDownloadCard = async () => {
    if (!shareUrl) return;
    setIsDownloadingCard(true);
    soundManager.playClick();
    try {
      await downloadWhatsAppCard({
        recipientName: data.recipientName,
        senderName: data.senderName,
        age: data.age,
        shareUrl
      });
    } finally {
      setIsDownloadingCard(false);
    }
  };

  const whatsappDirectMessage = formatWhatsAppMessage({
    recipientName: data.recipientName,
    senderName: data.senderName,
    age: data.age,
    shareUrl
  });

  return (
    <div id="step-payment-share-container" className="space-y-6">
      <div className="border-b border-white/[0.08] pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>VIP Celebration Concierge</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 font-serif">
            Step 6: Review, Payment & Share Link
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Preview the full interactive experience and generate the forever-active shareable gift link.
          </p>
        </div>

        <button
          type="button"
          onClick={onPreviewCelebration}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400/20 via-rose-500/20 to-purple-500/20 hover:from-amber-400/30 hover:to-rose-500/30 border border-amber-400/40 text-xs font-bold text-amber-200 transition cursor-pointer self-start sm:self-auto shadow-lg active:scale-95"
        >
          <Eye className="w-4 h-4 text-amber-300" />
          <span>Full Experience Preview</span>
        </button>
      </div>

      {/* Creation Summary Card */}
      <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/[0.08] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs shadow-xl">
        <div>
          <span className="text-slate-500 block text-[11px] uppercase tracking-wider font-mono">Recipient</span>
          <span className="font-bold text-white text-sm truncate block mt-0.5">{data.recipientName || 'Unspecified'}</span>
          {data.age && <span className="text-amber-400 font-semibold">{data.age} Years Milestone</span>}
        </div>
        <div>
          <span className="text-slate-500 block text-[11px] uppercase tracking-wider font-mono">Sender</span>
          <span className="font-semibold text-white truncate block mt-0.5">{data.senderName || 'Secret Friend'}</span>
          <span className="text-slate-400">{data.relationship}</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[11px] uppercase tracking-wider font-mono">Selected Cake</span>
          <span className="font-semibold text-amber-200 capitalize block mt-0.5 truncate">{data.cakeStyle.replace('-', ' ')}</span>
          <span className="text-emerald-400 font-medium">Whole Bakery Cake</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[11px] uppercase tracking-wider font-mono">Features</span>
          <span className="font-semibold text-white capitalize block mt-0.5 truncate">{data.theme.replace('-', ' ')}</span>
          <span className="text-rose-400 font-medium">{(data.selectedStickers || []).length} Cute Stickers</span>
        </div>
      </div>

      {/* Conditional: Either Pay to Unlock OR Shareable Link is Ready */}
      {!data.isPaid ? (
        <div className="space-y-6">
          {/* Payment Notice Header */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-amber-500/10 via-white/[0.02] to-purple-500/10 border border-amber-400/30 shadow-2xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-4">
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-amber-400 to-rose-500 text-slate-950 flex items-center justify-center shrink-0 shadow-lg text-2xl font-bold">
                  ₨
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    Lifetime VIP Delivery: 300 PKR
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-extrabold uppercase tracking-wide border border-amber-400/30 font-mono">
                      One-time fee
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    To generate the permanent link for {data.recipientName || 'your loved one'}, please transfer 300 PKR to any account below.
                  </p>
                </div>
              </div>

              {/* Admin settings button */}
              <button
                type="button"
                onClick={onOpenSettings}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-slate-300 text-xs transition cursor-pointer self-start sm:self-auto active:scale-95"
                title="Change receiving account numbers"
              >
                <Settings className="w-3.5 h-3.5 text-amber-400" />
                <span>Configure Accounts</span>
              </button>
            </div>
          </div>

          {/* Payment Methods Selection Box */}
          <div className="rounded-3xl bg-white/[0.02] border border-white/[0.08] overflow-hidden shadow-2xl">
            {/* Tabs */}
            <div className="flex border-b border-white/[0.08] bg-white/[0.02]">
              <button
                type="button"
                onClick={() => setActivePaymentTab('easypaisa')}
                className={`flex-1 py-3.5 px-3 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition cursor-pointer ${
                  activePaymentTab === 'easypaisa'
                    ? 'border-emerald-400 text-emerald-300 bg-emerald-500/10'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Smartphone className="w-4 h-4 text-emerald-400" />
                Easypaisa
              </button>
              <button
                type="button"
                onClick={() => setActivePaymentTab('sadapay')}
                className={`flex-1 py-3.5 px-3 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition cursor-pointer ${
                  activePaymentTab === 'sadapay'
                    ? 'border-teal-400 text-teal-300 bg-teal-500/10'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <CreditCard className="w-4 h-4 text-teal-400" />
                SadaPay
              </button>
              <button
                type="button"
                onClick={() => setActivePaymentTab('bank')}
                className={`flex-1 py-3.5 px-3 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition cursor-pointer ${
                  activePaymentTab === 'bank'
                    ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Building className="w-4 h-4 text-amber-400" />
                Bank Transfer
              </button>
            </div>

            {/* Tab Details */}
            <div className="p-5 space-y-4">
              {activePaymentTab === 'easypaisa' && (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-white/[0.04] border border-emerald-500/30 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-400 block font-mono">Easypaisa Mobile Account:</span>
                      <span className="text-lg font-bold text-emerald-300 font-mono tracking-wider">
                        {accountConfig.easypaisa.accountNumber}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(accountConfig.easypaisa.accountNumber, 'ep-num')}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-200 text-xs font-semibold transition cursor-pointer active:scale-95"
                    >
                      {copiedKey === 'ep-num' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'ep-num' ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.07] flex items-center justify-between text-xs">
                    <span className="text-slate-400">Account Title:</span>
                    <span className="font-bold text-white">{accountConfig.easypaisa.accountTitle}</span>
                  </div>

                  <p className="text-[11px] text-slate-400 italic">
                    💡 {accountConfig.easypaisa.instructions}
                  </p>
                </div>
              )}

              {activePaymentTab === 'sadapay' && (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-white/[0.04] border border-teal-500/30 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-400 block font-mono">SadaPay Account Number:</span>
                      <span className="text-lg font-bold text-teal-300 font-mono tracking-wider">
                        {accountConfig.sadapay.accountNumber}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(accountConfig.sadapay.accountNumber, 'sada-num')}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/40 text-teal-200 text-xs font-semibold transition cursor-pointer active:scale-95"
                    >
                      {copiedKey === 'sada-num' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'sada-num' ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.07] flex items-center justify-between text-xs">
                    <span className="text-slate-400">Account Title:</span>
                    <span className="font-bold text-white">{accountConfig.sadapay.accountTitle}</span>
                  </div>

                  {accountConfig.sadapay.iban && (
                    <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.07] flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px]">IBAN:</span>
                        <span className="font-mono text-slate-300 text-[11px]">{accountConfig.sadapay.iban}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(accountConfig.sadapay.iban || '', 'sada-iban')}
                        className="p-1.5 rounded text-slate-400 hover:text-white"
                      >
                        {copiedKey === 'sada-iban' ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  )}

                  <p className="text-[11px] text-slate-400 italic">
                    💡 {accountConfig.sadapay.instructions}
                  </p>
                </div>
              )}

              {activePaymentTab === 'bank' && (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-white/[0.04] border border-amber-500/30 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-400 block font-mono">{accountConfig.bank.bankName}</span>
                      <span className="text-lg font-bold text-amber-300 font-mono tracking-wider">
                        {accountConfig.bank.accountNumber}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(accountConfig.bank.accountNumber, 'bank-num')}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-xs font-semibold transition cursor-pointer active:scale-95"
                    >
                      {copiedKey === 'bank-num' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'bank-num' ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.07] flex items-center justify-between text-xs">
                    <span className="text-slate-400">Account Title:</span>
                    <span className="font-bold text-white">{accountConfig.bank.accountTitle}</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.07] flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">IBAN:</span>
                      <span className="font-mono text-slate-300 text-[11px]">{accountConfig.bank.iban}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(accountConfig.bank.iban, 'bank-iban')}
                      className="p-1.5 rounded text-slate-400 hover:text-white"
                    >
                      {copiedKey === 'bank-iban' ? <Check className="w-3.5 h-3.5 text-amber-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Transaction ID Submission Form */}
              <div className="pt-4 border-t border-white/[0.08] space-y-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Enter Payment Transaction ID (TID) / Reference
                  </label>
                  <span className="text-[11px] text-amber-300/80 font-mono">
                    ⚡ Instant Zero-Wait Verification
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5">
                  <input
                    id="input-tid"
                    type="text"
                    placeholder="e.g. 28471928410 (Easypaisa 3737 SMS)"
                    value={transactionIdInput}
                    onChange={(e) => {
                      setTransactionIdInput(e.target.value);
                      if (verificationError) setVerificationError(null);
                      if (isDuplicateAlert) setIsDuplicateAlert(false);
                    }}
                    className={`flex-1 px-4 py-3.5 rounded-2xl bg-white/[0.04] border text-sm text-white placeholder-slate-500 focus:outline-none focus:bg-white/[0.07] font-mono tracking-wide transition-all ${
                      isDuplicateAlert
                        ? 'border-rose-500/80 ring-2 ring-rose-500/30'
                        : verificationError
                        ? 'border-amber-500/80 ring-1 ring-amber-500/30'
                        : 'border-white/[0.1] focus:border-amber-400/80'
                    }`}
                  />
                  <button
                    type="button"
                    disabled={isVerifying}
                    onClick={() => handleUnlockPayment(false)}
                    className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-bold text-xs sm:text-sm shadow-xl shadow-emerald-500/20 transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 shrink-0"
                  >
                    {isVerifying ? (
                      <span className="inline-block w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    <span>{isVerifying ? 'Verifying TID...' : 'Verify & Unlock Link'}</span>
                  </button>
                </div>

                {/* ⚠️ DUPLICATE TID ALERT: Triggers when the TID has already been used */}
                {isDuplicateAlert && (
                  <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-200 text-xs space-y-1.5 animate-fadeIn">
                    <div className="flex items-center gap-2 font-bold text-rose-300 text-sm">
                      <ShieldAlert className="w-4.5 h-4.5 text-rose-400 shrink-0" />
                      <span>Yeh Transaction ID pehle use ho chuki hai!</span>
                    </div>
                    <p className="leading-relaxed text-slate-300">
                      {verificationError || 'Yeh TID pehle se kisi celebration wish ke liye claim ki ja chuki hai. Har payment sirf aik unique celebration link ke liye valid hoti hai. Duplicate TIDs qabil-e-qabool nahi hain.'}
                    </p>
                    <p className="text-[11px] text-amber-300/90 font-medium pt-1">
                      💡 Barah-e-karam apna taza 3737/8558 SMS check karein aur uski nayi Transaction ID enter karein.
                    </p>
                  </div>
                )}

                {/* Standard Format Error Alert */}
                {verificationError && !isDuplicateAlert && (
                  <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-200 text-xs flex items-center gap-2.5 animate-fadeIn">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{verificationError}</span>
                  </div>
                )}

                {/* SMS & TID Helper Hints */}
                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-[11px] text-slate-400 space-y-1">
                  <div className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <span>💡 TID Kahan Se Milegi?</span>
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-400">
                    <li><strong className="text-emerald-300">Easypaisa (3737 SMS):</strong> SMS ke aakhir mein likha hota hai: <span className="font-mono text-white bg-black/40 px-1 py-0.2 rounded">Trx ID: 28471928410</span></li>
                    <li><strong className="text-teal-300">JazzCash (8558 SMS):</strong> Message mein 10-hinson ka <span className="font-mono text-white bg-black/40 px-1 py-0.2 rounded">TID: 0192837465</span></li>
                    <li><strong className="text-amber-300">SadaPay / Bank:</strong> Receipt ya SMS ka Reference / Transaction Number</li>
                  </ul>
                </div>

                {/* Instant Demo Test Bypass Button */}
                <div className="pt-1 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Testing ya live check karna chahte hain?
                  </span>
                  <button
                    type="button"
                    onClick={() => handleUnlockPayment(true)}
                    className="text-xs text-amber-400 hover:text-amber-300 font-medium underline underline-offset-4 cursor-pointer flex items-center gap-1 active:scale-95"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Instant Demo Unlock (Skip payment for testing)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Shareable Link Unlocked State with Ultra-Short Link & WhatsApp Picture Card */
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-white/[0.02] to-amber-500/10 border border-emerald-400/50 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-400 text-slate-950 flex items-center justify-center shadow-lg shrink-0">
                <PartyPopper className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2 font-serif">
                  VIP Birthday Surprise Ready to Share! 🎉
                </h3>
                <p className="text-xs text-emerald-300">
                  Payment verified ({data.transactionId}). Your clean, short celebration link is generated!
                </p>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold self-start sm:self-auto">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Ultra-Short URL Active</span>
            </div>
          </div>

          {/* Clean Short Link Box */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                <span>🔗 Your Short Celebration Link</span>
                <span className="text-[10px] text-emerald-400 font-mono bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">
                  Ultra-Short Mobile Friendly
                </span>
              </label>
              {shareUrl && (
                <span className="text-[11px] text-slate-500 font-mono">
                  {shareUrl.length} characters
                </span>
              )}
            </div>

            <div className="p-2.5 sm:p-3 rounded-2xl bg-black/50 border border-white/[0.1] flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <input
                type="text"
                readOnly
                value={isGeneratingLink ? 'Generating clean short link...' : shareUrl}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/[0.04] text-xs sm:text-sm text-emerald-300 font-mono border border-white/[0.06] select-all focus:outline-none truncate"
              />
              <button
                type="button"
                onClick={() => {
                  if (!shareUrl) return;
                  copyToClipboard(shareUrl, 'share-link');
                  setLinkCopied(true);
                  setTimeout(() => setLinkCopied(false), 2000);
                }}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-rose-400 hover:from-amber-300 hover:to-rose-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-lg active:scale-95 shrink-0"
              >
                {linkCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{linkCopied ? 'Short Link Copied!' : 'Copy Short Link'}</span>
              </button>
            </div>
          </div>

          {/* WhatsApp Celebration Greeting Card Preview (As Requested) */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-b from-indigo-950/60 via-purple-950/40 to-slate-950/80 border border-amber-500/30 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base">🖼️</span>
                <h4 className="text-sm font-bold text-white">
                  WhatsApp Birthday Card Picture Preview
                </h4>
              </div>
              <span className="text-[11px] text-amber-300 font-medium bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                Shared with WhatsApp
              </span>
            </div>

            {/* Visual Card Frame */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-purple-950/60 to-slate-900 border-2 border-amber-400/40 text-center relative overflow-hidden shadow-2xl space-y-4">
              {/* Corner Ornaments */}
              <div className="absolute top-2 left-2 text-amber-400/50 text-xs">✦</div>
              <div className="absolute top-2 right-2 text-amber-400/50 text-xs">✦</div>
              <div className="absolute bottom-2 left-2 text-amber-400/50 text-xs">✦</div>
              <div className="absolute bottom-2 right-2 text-amber-400/50 text-xs">✦</div>

              {/* 1. Top Ribbon: "BIRTHDAY WISH" */}
              <div className="inline-block px-5 py-2 rounded-full bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 text-white font-extrabold text-xs sm:text-sm tracking-wider shadow-lg border border-amber-200/40">
                ✨ 🎂 BIRTHDAY WISH 🎂 ✨
              </div>

              {/* 2. Recipient Name Header */}
              <div className="space-y-1">
                <p className="text-[11px] uppercase tracking-widest text-slate-300 font-semibold">
                  A Special Celebration Dedicated To
                </p>
                <h3 className="text-xl sm:text-2xl font-bold font-serif text-amber-300 drop-shadow-md">
                  {data.recipientName || 'My Favorite Person'}
                </h3>
              </div>

              {/* 3. Cake & Celebration Illustration */}
              <div className="py-2 flex items-center justify-center gap-3">
                <span className="text-3xl sm:text-4xl animate-bounce">🎈</span>
                <div className="p-3.5 rounded-2xl bg-white/[0.06] border border-white/[0.1] shadow-inner text-4xl sm:text-5xl">
                  🎂
                </div>
                <span className="text-3xl sm:text-4xl animate-bounce delay-150">🎉</span>
              </div>

              {/* 4. Surprise Announcement Box */}
              <div className="p-4 rounded-2xl bg-black/60 border border-amber-400/40 text-left space-y-1.5 shadow-inner">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-xs sm:text-sm">
                  <span>🎁</span>
                  <span>SPECIAL SURPRISE AWAITS YOU!</span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-white leading-snug">
                  اس لنک میں آپ کے لیے ایک پیارا سا برتھ ڈے سرپرائز ہے!
                </p>
                <p className="text-[11px] text-slate-300">
                  Tap the celebration link to cut your personalized cake, blow glowing candles, unwrap your secret gift & read your keepsake letter!
                </p>
                <div className="pt-1 flex items-center gap-1.5 text-[11px] text-rose-300 font-semibold">
                  <span>👉</span>
                  <span className="font-mono text-emerald-300 underline underline-offset-2">
                    {shareUrl || 'https://.../?w=surprise'}
                  </span>
                </div>
              </div>

              {/* 5. Sender Footer */}
              <p className="text-xs italic text-rose-300/90 pt-1">
                {data.senderName ? `With Lots of Love from ${data.senderName} ❤️` : 'With Warmest Love & Prayers ❤️'}
              </p>
            </div>

            <p className="text-xs text-slate-400 text-center">
              💡 Yeh card picture aur clean short link WhatsApp par send kiye jayenge taake recipient ko foran pyara sa surprise preview nazar aaye!
            </p>
          </div>

          {/* Sharing Action Channels */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* 1. Main WhatsApp Share with Picture Button */}
              <button
                type="button"
                disabled={isSharingWhatsApp || !shareUrl}
                onClick={handleShareWhatsApp}
                className="p-4 rounded-2xl bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#20bd5a] hover:to-[#0f7a6e] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition cursor-pointer active:scale-95 shadow-xl shadow-emerald-500/20 disabled:opacity-50"
              >
                {isSharingWhatsApp ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Smartphone className="w-5 h-5 shrink-0" />
                )}
                <span>Share to WhatsApp with Picture</span>
                <ImageIcon className="w-4 h-4 opacity-80 shrink-0" />
              </button>

              {/* 2. Download Birthday Card Picture */}
              <button
                type="button"
                disabled={isDownloadingCard || !shareUrl}
                onClick={handleDownloadCard}
                className="p-4 rounded-2xl bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.15] text-amber-300 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer active:scale-95 shadow-md disabled:opacity-50"
              >
                {isDownloadingCard ? (
                  <span className="inline-block w-4 h-4 border-2 border-amber-300 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Download className="w-4 h-4 text-amber-400" />
                )}
                <span>Download Card Picture (1080p)</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Direct WhatsApp Web / App text link */}
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappDirectMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] text-slate-300 hover:text-white text-xs font-medium flex items-center justify-center gap-2 transition cursor-pointer active:scale-95"
              >
                <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                <span>Open in WhatsApp Web / App</span>
              </a>

              {/* Open & Experience celebration button */}
              <button
                type="button"
                onClick={onPreviewCelebration}
                className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-rose-400 hover:from-amber-300 hover:to-rose-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-lg active:scale-95"
              >
                <Eye className="w-4 h-4" />
                <span>Open Birthday Experience</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

