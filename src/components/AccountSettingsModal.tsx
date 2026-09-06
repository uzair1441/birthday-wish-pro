import React, { useState, useEffect } from 'react';
import { PaymentAccountConfig } from '../types';
import { X, Save, Building, Smartphone, CreditCard, RotateCcw, ShieldCheck, Trash2, Check, Copy, RefreshCw } from 'lucide-react';
import { DEFAULT_PAYMENT_CONFIG } from '../data/presets';
import { fetchAllVerifiedTids, resetTidForTesting, VerifiedTidRecord } from '../utils/tidVerification';

interface AccountSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: PaymentAccountConfig;
  onSave: (updated: PaymentAccountConfig) => void;
}

export const AccountSettingsModal: React.FC<AccountSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSave
}) => {
  const [formData, setFormData] = useState<PaymentAccountConfig>(config);
  const [activeTab, setActiveTab] = useState<'easypaisa' | 'sadapay' | 'bank' | 'tids'>('easypaisa');
  const [verifiedTids, setVerifiedTids] = useState<VerifiedTidRecord[]>([]);
  const [loadingTids, setLoadingTids] = useState<boolean>(false);
  const [copiedTid, setCopiedTid] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && activeTab === 'tids') {
      loadTids();
    }
  }, [isOpen, activeTab]);

  const loadTids = async () => {
    setLoadingTids(true);
    const list = await fetchAllVerifiedTids();
    setVerifiedTids(list);
    setLoadingTids(false);
  };

  const handleResetSingleTid = async (tid: string) => {
    if (confirm(`Kya aap test ke liye TID "${tid}" ko unblock / reset karna chahte hain?`)) {
      await resetTidForTesting(tid);
      await loadTids();
    }
  };

  const handleCopyTid = (tid: string) => {
    navigator.clipboard.writeText(tid);
    setCopiedTid(tid);
    setTimeout(() => setCopiedTid(null), 2000);
  };

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const handleResetDefaults = () => {
    setFormData(DEFAULT_PAYMENT_CONFIG);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div 
        id="account-settings-modal"
        className="w-full max-w-xl bg-[#0c0919] border border-white/[0.12] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ring-1 ring-white/[0.05]"
      >
        {/* Header */}
        <div className="p-5 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.02]">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 font-serif">
              <CreditCard className="w-5 h-5 text-amber-300" />
              Configure Payment Accounts
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Set your receiving Easypaisa, SadaPay, and Bank details for 300 PKR payments.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition cursor-pointer active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/[0.08] bg-white/[0.01] px-4">
          <button
            onClick={() => setActiveTab('easypaisa')}
            className={`px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'easypaisa'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            Easypaisa
          </button>
          <button
            onClick={() => setActiveTab('sadapay')}
            className={`px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'sadapay'
                ? 'border-teal-400 text-teal-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            SadaPay
          </button>
          <button
            onClick={() => setActiveTab('bank')}
            className={`px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'bank'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building className="w-4 h-4" />
            Bank Transfer
          </button>
          <button
            onClick={() => setActiveTab('tids')}
            className={`px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'tids'
                ? 'border-rose-400 text-rose-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Used TIDs Log</span>
            {verifiedTids.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold">
                {verifiedTids.length}
              </span>
            )}
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Fee Setting */}
          <div className="p-3.5 bg-amber-400/10 border border-amber-400/25 rounded-2xl flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-300">Link Delivery Price:</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={formData.feePkr}
                onChange={(e) => setFormData({ ...formData, feePkr: Number(e.target.value) || 300 })}
                className="w-24 px-3 py-1.5 text-xs rounded-xl bg-white/[0.06] border border-amber-400/40 text-white text-right font-bold"
              />
              <span className="text-xs text-amber-200 font-bold font-mono">PKR</span>
            </div>
          </div>

          {activeTab === 'easypaisa' && (
            <div className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Easypaisa Mobile Number</label>
                <input
                  type="text"
                  placeholder="e.g. 0300-1234567"
                  value={formData.easypaisa.accountNumber}
                  onChange={(e) => setFormData({
                    ...formData,
                    easypaisa: { ...formData.easypaisa, accountNumber: e.target.value }
                  })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-sm text-white focus:border-emerald-400"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Account Title (Name on Easypaisa)</label>
                <input
                  type="text"
                  placeholder="e.g. Muhammad Uzair"
                  value={formData.easypaisa.accountTitle}
                  onChange={(e) => setFormData({
                    ...formData,
                    easypaisa: { ...formData.easypaisa, accountTitle: e.target.value }
                  })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-sm text-white focus:border-emerald-400"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Instructions for Sender</label>
                <textarea
                  rows={2}
                  value={formData.easypaisa.instructions}
                  onChange={(e) => setFormData({
                    ...formData,
                    easypaisa: { ...formData.easypaisa, instructions: e.target.value }
                  })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:border-emerald-400"
                />
              </div>
            </div>
          )}

          {activeTab === 'sadapay' && (
            <div className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">SadaPay Mobile / Number</label>
                <input
                  type="text"
                  placeholder="e.g. 0300-1234567"
                  value={formData.sadapay.accountNumber}
                  onChange={(e) => setFormData({
                    ...formData,
                    sadapay: { ...formData.sadapay, accountNumber: e.target.value }
                  })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-sm text-white focus:border-teal-400"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Account Title</label>
                <input
                  type="text"
                  placeholder="e.g. Uzair Ahmad"
                  value={formData.sadapay.accountTitle}
                  onChange={(e) => setFormData({
                    ...formData,
                    sadapay: { ...formData.sadapay, accountTitle: e.target.value }
                  })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-sm text-white focus:border-teal-400"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">SadaPay IBAN (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. PK56SADA0000000300123456"
                  value={formData.sadapay.iban || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    sadapay: { ...formData.sadapay, iban: e.target.value }
                  })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-sm text-white focus:border-teal-400"
                />
              </div>
            </div>
          )}

          {activeTab === 'bank' && (
            <div className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Bank Name</label>
                <input
                  type="text"
                  placeholder="e.g. Meezan Bank / HBL / Bank Alfalah"
                  value={formData.bank.bankName}
                  onChange={(e) => setFormData({
                    ...formData,
                    bank: { ...formData.bank, bankName: e.target.value }
                  })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-sm text-white focus:border-amber-400"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Account Number</label>
                <input
                  type="text"
                  placeholder="e.g. 0101-0102030405"
                  value={formData.bank.accountNumber}
                  onChange={(e) => setFormData({
                    ...formData,
                    bank: { ...formData.bank, accountNumber: e.target.value }
                  })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-sm text-white focus:border-amber-400"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Account Title</label>
                <input
                  type="text"
                  placeholder="e.g. Uzair Ahmad"
                  value={formData.bank.accountTitle}
                  onChange={(e) => setFormData({
                    ...formData,
                    bank: { ...formData.bank, accountTitle: e.target.value }
                  })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-sm text-white focus:border-amber-400"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">IBAN Number</label>
                <input
                  type="text"
                  placeholder="e.g. PK12MEZN0001010102030405"
                  value={formData.bank.iban}
                  onChange={(e) => setFormData({
                    ...formData,
                    bank: { ...formData.bank, iban: e.target.value }
                  })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-sm text-white focus:border-amber-400"
                />
              </div>
            </div>
          )}

          {/* Used TIDs Anti-Fraud & Verified Log */}
          {activeTab === 'tids' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-500/15 to-purple-500/15 border border-rose-500/30 flex items-center justify-between">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-rose-400" />
                    Anti-Duplicate Fraud Registry
                  </h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Har verified Transaction ID yahan register hoti hai taake koi bhi customer aik TID ko dobara use na kar sake.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={loadTids}
                  disabled={loadingTids}
                  className="p-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-slate-300 transition cursor-pointer active:scale-95 shrink-0"
                  title="Refresh Log"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingTids ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {/* TIDs List */}
              {verifiedTids.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs text-slate-400 space-y-1">
                  <p className="font-semibold text-slate-300">Abhi tak koi payment TID claim nahi hui</p>
                  <p className="text-[11px] text-slate-500">
                    Jab koi customer Easypaisa/Bank se pay karke TID enter karega, toh woh foran yahan show hogi aur lock ho jayegi.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {verifiedTids.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.15] transition flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-amber-300 text-xs sm:text-sm tracking-wide">
                            {item.tid}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold uppercase">
                            {item.source || 'Payment'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                          <span>For: <strong className="text-white">{item.recipientName || 'Gift Recipient'}</strong></span>
                          <span>•</span>
                          <span>{new Date(item.usedAt).toLocaleDateString()} {new Date(item.usedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleCopyTid(item.tid)}
                          className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 transition cursor-pointer"
                          title="Copy TID"
                        >
                          {copiedTid === item.tid ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleResetSingleTid(item.tid)}
                          className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 transition cursor-pointer"
                          title="Unblock / Reset for test"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-white/[0.08] bg-white/[0.02] flex items-center justify-between">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/[0.05] transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-rose-400 hover:from-amber-300 hover:to-rose-300 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition cursor-pointer active:scale-95"
            >
              <Save className="w-4 h-4" />
              Save Account Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
