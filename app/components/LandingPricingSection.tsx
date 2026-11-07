'use client';

import { Check, Sparkles, Clock, ShieldCheck, ArrowRight, Lock, Users } from 'lucide-react';

export default function LandingPricingSection({ appSignupUrl }: { appSignupUrl: string }) {
  // Plan 1: 15-Day Trial Pass
  const trialPrice = 22;

  // Plan 2: Early Joiner / Initial Customers (Locked for 2 Years)
  const earlyBase = 299;
  const earlyFee = Number((earlyBase * 0.03).toFixed(2)); // 8.97
  const earlyGst = Number((earlyBase * 0.18).toFixed(2)); // 53.82
  const earlyTotal = Number((earlyBase + earlyFee + earlyGst).toFixed(2)); // 361.79

  // Plan 3: Standard Plan (For future signups)
  const standardBase = 799;
  const standardFee = Number((standardBase * 0.03).toFixed(2)); // 23.97
  const standardGst = Number((standardBase * 0.18).toFixed(2)); // 143.82
  const standardTotal = Number((standardBase + standardFee + standardGst).toFixed(2)); // 966.79

  return (
    <div id="pricing" className="w-full max-w-6xl mx-auto py-16 px-4 text-center text-[var(--text-primary)] font-sans">
      <div className="max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-semibold mb-3 border border-teal-500/20 font-sans">
          <Sparkles size={14} /> Transparent Healthcare Pricing
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-[var(--text-primary)] tracking-tight font-display">
          Clear, Upfront Pricing for Clinics & Doctors
        </h2>
        <p className="text-xs md:text-sm text-[var(--text-secondary)] mt-2">
          No hidden fees, no auto-debit traps. Explicit itemized breakdown with base plan, 18% GST, and 3% platform processing fees.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch text-left">
        {/* Tier 1: 15-Day Trial Pass */}
        <div className="rounded-3xl p-7 bg-[var(--card-bg)] border border-[var(--card-border)] flex flex-col justify-between hover:border-teal-500/40 transition-all backdrop-blur-xl shadow-md">
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="px-3 py-1 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center gap-1.5 font-sans">
                <Clock size={13} /> 15-Day Trial Pass
              </span>
              <span className="text-[11px] text-[var(--text-muted)] font-sans">No Auto-Debit</span>
            </div>

            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-1">Trial Pass</h3>
            <p className="text-xs text-[var(--text-secondary)] mb-6">
              Full evaluation pass to run your live clinic OPD and patient consultations before subscribing.
            </p>

            <div className="mb-6 pb-6 border-b border-[var(--border)]">
              <div className="text-4xl font-black text-[var(--text-primary)] flex items-baseline gap-1 font-sans">
                <span className="text-2xl text-[var(--text-secondary)] font-bold">₹</span>
                <span>{trialPrice}</span>
                <span className="text-xs font-normal text-[var(--text-muted)] ml-1">/ 15 days</span>
              </div>
              <div className="text-[11px] text-teal-600 dark:text-teal-300/90 mt-1 font-sans font-medium">
                Flat evaluation price • One-time fee • Never auto-renewed
              </div>
            </div>

            <ul className="space-y-3 text-xs text-[var(--text-secondary)] mb-8">
              {[
                'Full OPD Prescriptions with Dosage Words',
                'Patient History & Chronic Conditions Tracker',
                'Medicine Inventory & Custom Templates',
                'Multi-lingual Instructions (English, Hindi, Marathi)',
                '1-Click WhatsApp Rx & Bill Sharing',
                'Thermal / A4 Custom Letterhead Export',
              ].map((feat) => (
                <li key={feat} className="flex items-start gap-2.5">
                  <Check size={15} className="text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <a
            href={appSignupUrl}
            className="w-full py-3.5 rounded-xl bg-[var(--surface-2)] hover:bg-[var(--surface-0)] text-[var(--text-primary)] font-bold text-sm flex items-center justify-center gap-2 border border-[var(--border)] shadow-sm transition-all"
          >
            Start 15-Day Trial (₹{trialPrice})
          </a>
        </div>

        {/* Tier 2: Early Joiner Plan (Initial Customers Offer - Locked for 2 Years) */}
        <div className="rounded-3xl p-7 bg-white dark:bg-slate-900 border-2 border-teal-500 flex flex-col justify-between shadow-2xl shadow-teal-500/15 relative overflow-hidden backdrop-blur-xl transition-colors">
          <div className="absolute top-0 right-0 bg-gradient-to-l from-teal-500 to-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-wider px-4 py-1 rounded-bl-xl shadow-md font-sans">
            Initial Customers Offer
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="px-3 py-1 rounded-xl bg-teal-500/20 text-teal-700 dark:text-teal-300 text-xs font-bold flex items-center gap-1.5 border border-teal-500/30">
                <Sparkles size={13} /> Early Joiners Rate
              </span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 font-sans">
                <Lock size={12} /> Locked for 2 Years
              </span>
            </div>

            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-1">Early Joiner Plan</h3>
            <p className="text-xs text-teal-800 dark:text-teal-200/90 mb-4 font-medium">
              Exclusive introductory price for initial customers. Locked at ₹{earlyBase}/month base for 2 full years!
            </p>

            <div className="mb-5 pb-5 border-b border-[var(--border)]">
              <div className="text-4xl font-black text-teal-600 dark:text-teal-400 flex items-baseline gap-1 font-sans">
                <span className="text-2xl text-teal-600 dark:text-teal-300 font-bold">₹</span>
                <span>{earlyBase}</span>
                <span className="text-xs font-normal text-[var(--text-muted)] ml-1">/ month (base)</span>
              </div>

              {/* Exact Transparent Itemized Tax Breakdown */}
              <div className="mt-3 text-xs text-[var(--text-secondary)] space-y-1.5 font-sans bg-teal-50/70 dark:bg-slate-800/80 p-3 rounded-xl border border-teal-500/20 dark:border-white/10 transition-colors">
                <div className="flex justify-between">
                  <span>Base Subscription:</span>
                  <span className="font-bold text-[var(--text-primary)]">₹{earlyBase}.00</span>
                </div>
                <div className="flex justify-between text-[var(--text-muted)]">
                  <span>+ 3% Platform Processing Fees:</span>
                  <span>+₹{earlyFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[var(--text-muted)]">
                  <span>+ 18% GST:</span>
                  <span>+₹{earlyGst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-[var(--border)] pt-1.5 font-bold text-teal-700 dark:text-teal-300 text-sm">
                  <span>Total Net Payable:</span>
                  <span>₹{earlyTotal.toFixed(2)} / mo</span>
                </div>
              </div>
            </div>

            <ul className="space-y-3 text-xs text-[var(--text-primary)] mb-8 font-medium">
              {[
                'Introductory rate locked for 2 years for early joiners',
                'Complete OPD Management & Prescription Suite',
                'IPD Inpatient Module (Beds, Wards, Daily Rounds)',
                'Nursing Day Logs & Procedure Record Charting',
                'Multi-Role Staff Access (Receptionist, Nurses, Doctors)',
                'Offline PWA Sync & Tamper-Evident Audit Trails',
                '0% MDR Dynamic UPI QR Code for Clinic Billing',
              ].map((feat) => (
                <li key={feat} className="flex items-start gap-2.5">
                  <Check size={15} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <a
            href={appSignupUrl}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-500/30 transition-all"
          >
            Claim ₹{earlyBase} Early Joiner Rate <ArrowRight size={16} />
          </a>
        </div>

        {/* Tier 3: Standard Plan (For future signups) */}
        <div className="rounded-3xl p-7 bg-[var(--card-bg)] border border-[var(--card-border)] flex flex-col justify-between hover:border-[var(--border)] transition-all backdrop-blur-xl shadow-md">
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="px-3 py-1 rounded-xl bg-[var(--surface-2)] text-[var(--text-secondary)] text-xs font-bold flex items-center gap-1.5 font-sans border border-[var(--border)]">
                <Users size={13} /> Standard Rate
              </span>
              <span className="text-xs text-[var(--text-muted)] font-sans">Future Signups</span>
            </div>

            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-1">Standard Plan</h3>
            <p className="text-xs text-[var(--text-secondary)] mb-4">
              The standard plan rate of ₹{standardBase}/month base for all other users who will be joining later.
            </p>

            <div className="mb-5 pb-5 border-b border-[var(--border)]">
              <div className="text-4xl font-black text-[var(--text-primary)] flex items-baseline gap-1 font-sans">
                <span className="text-2xl text-[var(--text-muted)] font-bold">₹</span>
                <span>{standardBase}</span>
                <span className="text-xs font-normal text-[var(--text-muted)] ml-1">/ month (base)</span>
              </div>

              {/* Exact Transparent Itemized Tax Breakdown */}
              <div className="mt-3 text-xs text-[var(--text-secondary)] space-y-1.5 font-sans bg-[var(--surface-2)] p-3 rounded-xl border border-[var(--border)]">
                <div className="flex justify-between">
                  <span>Base Subscription:</span>
                  <span className="font-bold text-[var(--text-primary)]">₹{standardBase}.00</span>
                </div>
                <div className="flex justify-between text-[var(--text-muted)]">
                  <span>+ 3% Platform Processing Fees:</span>
                  <span>+₹{standardFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[var(--text-muted)]">
                  <span>+ 18% GST:</span>
                  <span>+₹{standardGst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-[var(--border)] pt-1.5 font-bold text-[var(--text-primary)] text-sm">
                  <span>Total Net Payable:</span>
                  <span>₹{standardTotal.toFixed(2)} / mo</span>
                </div>
              </div>
            </div>

            <ul className="space-y-3 text-xs text-[var(--text-secondary)] mb-8">
              {[
                'Standard rate for users joining after initial offer',
                'Complete OPD Management & Prescription Suite',
                'IPD Inpatient Module (Beds, Wards, Daily Rounds)',
                'Nursing Day Logs & Procedure Record Charting',
                'Multi-Role Staff Access (Receptionist, Nurses, Doctors)',
                'Offline PWA Sync & Tamper-Evident Audit Trails',
                '0% MDR Dynamic UPI QR Code for Clinic Billing',
              ].map((feat) => (
                <li key={feat} className="flex items-start gap-2.5">
                  <Check size={15} className="text-[var(--text-muted)] flex-shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--surface-1)] border border-[var(--border)] text-center text-xs text-[var(--text-muted)] font-medium">
            Applies to all new clinics once early slots conclude
          </div>
        </div>
      </div>

      {/* Guarantee & Trust Badges */}
      <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-[var(--text-muted)]">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-emerald-500" />
          <span>No Auto-Debit Commitments</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-teal-500" />
          <span>Encrypted Patient Health Records</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-sky-500" />
          <span>Zero Server / Hardware Setup Needed</span>
        </div>
      </div>
    </div>
  );
}
