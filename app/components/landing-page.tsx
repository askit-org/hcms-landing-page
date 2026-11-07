'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  Bed,
  WifiOff,
  QrCode,
  Users,
  Share2,
  Clock,
  ChevronDown,
  Zap,
  Menu,
  X,
  Sun,
  Moon,
  CheckCircle2,
} from 'lucide-react';

import Hero3DCanvas from './Hero3DCanvas';
import TiltCard from './TiltCard';
import InteractiveRxSandbox from './InteractiveRxSandbox';
import InteractiveWorkflowExplorer from './InteractiveWorkflowExplorer';
import LandingPricingSection from './LandingPricingSection';

const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '');
const signupUrl = `${appUrl}/signup`;
const loginUrl = `${appUrl}/login`;

export default function LandingPage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const saved = window.localStorage.getItem('hcms-theme');
    const initialTheme = saved === 'light' || saved === 'dark' ? saved : 'dark';
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    window.localStorage.setItem('hcms-theme', next);
    document.documentElement.setAttribute('data-theme', next);
    if (next === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const faqs = [
    {
      q: 'Does HCMS function when the clinic has no internet or slow WiFi?',
      a: 'Yes, 100%! HCMS is built as an offline-first Progressive Web App (PWA). You can register patients, write prescriptions, and chart daily inpatient rounds without internet. The instant connectivity returns, records seamlessly sync with your secure cloud backend.',
    },
    {
      q: 'How does direct WhatsApp sharing work without extra charges?',
      a: 'HCMS formats clean, professional medical statements and prescriptions into official WhatsApp message payloads with 1 click. It uses direct client-side WhatsApp intent with no per-SMS charges and zero third-party gateway markups.',
    },
    {
      q: 'Can my clinic receptionist and nursing staff use HCMS simultaneously?',
      a: 'Absolutely. HCMS includes multi-role RBAC (Role-Based Access Control). Receptionists manage queue tokens and vitals; nurses record bed day procedures and medication administration; while doctors retain exclusive authority over clinical diagnoses and prescriptions.',
    },
    {
      q: 'Are there any hidden costs, setup charges, or auto-debits?',
      a: 'Zero. The 15-day trial is a one-time evaluation pass (₹22), and the Premium plan is ₹299 + 18% GST and 3% platform fee. We never auto-debit your bank card without your manual authorization.',
    },
    {
      q: 'Is patient health information (PHI) secure and compliant?',
      a: 'Yes. HCMS is designed around HIPAA and Indian Digital Personal Data Protection (DPDP) principles with role isolation, tamper-evident audit logging, and encrypted transmission.',
    },
  ];

  return (
    <div
      data-theme={theme}
      className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans selection:bg-teal-500 selection:text-white relative overflow-x-hidden transition-colors duration-300"
    >
      {/* ─── STICKY GLASS HEADER ─── */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-3.5 backdrop-blur-xl bg-[var(--header-bg)] border-b border-[var(--border)] transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Logo */}
          <a href="#top" className="logo-row group text-decoration-none">
            <div className="logo-icon group-hover:scale-105">
              <img
                src="/icons/logo.png"
                alt="HCMS Logo"
                width={38}
                height={38}
              />
            </div>
            <div className="logo-text text-left">
              <h2>HCMS</h2>
              <p>Clinic Management</p>
            </div>
          </a>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold text-[var(--text-secondary)]">
            <a href="#features" className="hover:text-teal-500 transition-colors">Features</a>
            <a href="#demo" className="hover:text-teal-500 transition-colors flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
              Live Rx Sandbox
            </a>
            <a href="#workflows" className="hover:text-teal-500 transition-colors">OPD & IPD Workflows</a>
            <a href="#pricing" className="hover:text-teal-500 transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-teal-500 transition-colors">FAQ</a>
          </nav>

          {/* Action Header Buttons & Theme Toggle */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-[var(--border)] bg-[var(--surface-1)] text-[var(--text-secondary)] hover:text-teal-500 transition-all cursor-pointer"
              aria-label="Toggle theme mode"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <a
              href={loginUrl}
              className="px-4 py-2 text-xs font-bold text-[var(--text-secondary)] hover:text-teal-500 transition-colors"
            >
              Doctor Sign In
            </a>

            <a
              href={signupUrl}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-teal-500/25 transition-all"
            >
              <span>Start 15-Day Trial</span>
              <ArrowRight size={13} />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-[var(--border)] text-[var(--text-secondary)]"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[var(--text-secondary)] hover:text-teal-500"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden pt-4 pb-2 border-t border-[var(--border)] mt-3"
            >
              <div className="flex flex-col gap-2.5 text-sm font-semibold text-[var(--text-secondary)] text-left">
                <a href="#features" onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-lg hover:bg-white/5">Features</a>
                <a href="#demo" onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-lg hover:bg-white/5 text-teal-500">Live Rx Sandbox</a>
                <a href="#workflows" onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-lg hover:bg-white/5">OPD & IPD Workflows</a>
                <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-lg hover:bg-white/5">Pricing</a>
                <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-lg hover:bg-white/5">FAQ</a>

                <div className="pt-3 border-t border-[var(--border)] flex flex-col gap-2">
                  <a
                    href={signupUrl}
                    className="w-full py-2.5 rounded-xl bg-teal-600 text-white text-xs font-bold text-center flex items-center justify-center gap-2"
                  >
                    Start 15-Day Trial (₹22) <ArrowRight size={14} />
                  </a>
                  <a
                    href={loginUrl}
                    className="w-full py-2 rounded-xl bg-[var(--surface-1)] text-[var(--text-primary)] text-xs font-bold text-center border border-[var(--border)]"
                  >
                    Doctor Sign In
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ─── HERO SECTION WITH 3D INTERACTIVE CANVAS ─── */}
      <section id="top" className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 px-4 md:px-8 overflow-hidden">
        <Hero3DCanvas />

        <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-semibold mb-6 shadow-lg shadow-teal-500/10 backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
            <Sparkles size={13} />
            <span>Next-Gen Hospital & Clinic OS • Offline-First PWA</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-[var(--text-primary)] leading-[1.1] mb-6 font-display"
          >
            Your Clinic,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-teal-400 to-emerald-400">
              in Good Flow.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl leading-relaxed mb-8"
          >
            Give your clinical team one unified place for outpatient OPD visits, multi-lingual e-prescriptions, and inpatient hospital bed stays — so nothing gets lost between people and care.
          </motion.p>

          {/* Hero Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-10"
          >
            <a
              href={signupUrl}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white font-extrabold text-sm md:text-base flex items-center justify-center gap-2.5 shadow-xl shadow-teal-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>Start 15-Day Trial (₹22)</span>
              <ArrowRight size={18} />
            </a>

            <a
              href="#demo"
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-[var(--surface-1)] hover:bg-[var(--surface-2)] text-[var(--text-primary)] font-bold text-sm border border-[var(--border)] flex items-center justify-center gap-2 backdrop-blur-xl transition-all"
            >
              <span>Try Live Rx Sandbox</span>
              <ChevronDown size={16} />
            </a>
          </motion.div>

          {/* Live Floating Badge Metrics */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl w-full"
          >
            {[
              { icon: Clock, label: 'Rx Generation', val: '12 Seconds', color: 'text-teal-500' },
              { icon: WifiOff, label: 'Offline Ready', val: '100% PWA Cache', color: 'text-sky-500' },
              { icon: QrCode, label: 'Instant Payment', val: '0% MDR UPI QR', color: 'text-emerald-500' },
              { icon: ShieldCheck, label: 'Architecture', val: 'HIPAA & DPDP', color: 'text-amber-500' },
            ].map((stat, i) => (
              <div
                key={i}
                className="p-3.5 rounded-2xl bg-[var(--surface-1)] border border-[var(--border)] backdrop-blur-xl text-left flex flex-col justify-between shadow-sm"
              >
                <stat.icon size={18} className={`${stat.color} mb-1.5`} />
                <div>
                  <div className="text-xs font-black text-[var(--text-primary)] font-mono">{stat.val}</div>
                  <div className="text-[10px] text-[var(--text-muted)] font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── 3D PERSPECTIVE FEATURE GRID ─── */}
      <section id="features" className="py-20 px-4 md:px-8 max-w-7xl mx-auto text-center relative z-10">
        <div className="max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 text-xs font-semibold mb-3 border border-teal-500/20 font-mono">
            <Zap size={13} /> Engineered For Clinical Speed
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-[var(--text-primary)] tracking-tight font-display">
            Everything Your Clinic Needs, Built into One System
          </h2>
          <p className="text-sm md:text-base text-[var(--text-secondary)] mt-3">
            Designed directly alongside practicing physicians to eliminate repetitive manual handwriting and reduce burnout.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          <TiltCard className="p-7 bg-[var(--card-bg)] border border-[var(--card-border)] backdrop-blur-xl flex flex-col justify-between min-h-[260px] shadow-sm">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-teal-500/15 text-teal-500 flex items-center justify-center mb-5 border border-teal-500/25">
                <Stethoscope size={24} />
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">15-Second Rx Engine</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Pre-loaded with common generic & branded formulations. Select frequency slots (Morning, Afternoon, Night, SOS) and choose multi-lingual patient instructions in English, Hindi, and Marathi.
              </p>
            </div>
            <div className="text-[11px] font-bold text-teal-500 mt-4 flex items-center gap-1 font-mono">
              Multi-lingual Instructions <ArrowRight size={13} />
            </div>
          </TiltCard>

          <TiltCard className="p-7 bg-[var(--card-bg)] border border-[var(--card-border)] backdrop-blur-xl flex flex-col justify-between min-h-[260px] shadow-sm">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-sky-500/15 text-sky-500 flex items-center justify-center mb-5 border border-sky-500/25">
                <Bed size={24} />
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">Dedicated IPD Inpatient Wing</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Live ward and bed availability matrix, bed transfers, morning/evening doctor rounds, nursing procedure logs, and itemized discharge settlement invoices.
              </p>
            </div>
            <div className="text-[11px] font-bold text-sky-500 mt-4 flex items-center gap-1 font-mono">
              Live Bed Matrix <ArrowRight size={13} />
            </div>
          </TiltCard>

          <TiltCard className="p-7 bg-[var(--card-bg)] border border-[var(--card-border)] backdrop-blur-xl flex flex-col justify-between min-h-[260px] shadow-sm">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center mb-5 border border-emerald-500/25">
                <WifiOff size={24} />
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">Offline-Ready PWA</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Hospital basement with zero WiFi? Fiber router cut? HCMS continues functioning locally with zero interruption, queuing changes and auto-syncing when back online.
              </p>
            </div>
            <div className="text-[11px] font-bold text-emerald-500 mt-4 flex items-center gap-1 font-mono">
              Service Worker Cache <ArrowRight size={13} />
            </div>
          </TiltCard>

          <TiltCard className="p-7 bg-[var(--card-bg)] border border-[var(--card-border)] backdrop-blur-xl flex flex-col justify-between min-h-[260px] shadow-sm">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-500/15 text-purple-500 flex items-center justify-center mb-5 border border-purple-500/25">
                <QrCode size={24} />
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">Zero-MDR UPI Payment QR</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Generates dynamic NPCI-standard UPI QR codes for each OPD bill or IPD settlement. Patients scan via GPay, PhonePe, or Paytm with 0% gateway commission going to third parties.
              </p>
            </div>
            <div className="text-[11px] font-bold text-purple-500 mt-4 flex items-center gap-1 font-mono">
              Direct to Clinic Bank <ArrowRight size={13} />
            </div>
          </TiltCard>

          <TiltCard className="p-7 bg-[var(--card-bg)] border border-[var(--card-border)] backdrop-blur-xl flex flex-col justify-between min-h-[260px] shadow-sm">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-500 flex items-center justify-center mb-5 border border-amber-500/25">
                <Share2 size={24} />
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">Instant WhatsApp & Print</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                One-tap dispatch of digital prescriptions directly to patient WhatsApp numbers. Supports both standard A4 clinic letterheads and high-speed 80mm thermal receipt printers.
              </p>
            </div>
            <div className="text-[11px] font-bold text-amber-500 mt-4 flex items-center gap-1 font-mono">
              Paperless Workflow <ArrowRight size={13} />
            </div>
          </TiltCard>

          <TiltCard className="p-7 bg-[var(--card-bg)] border border-[var(--card-border)] backdrop-blur-xl flex flex-col justify-between min-h-[260px] shadow-sm">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-rose-500/15 text-rose-500 flex items-center justify-center mb-5 border border-rose-500/25">
                <Users size={24} />
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">Multi-Role Staff Collaboration</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Onboard receptionists, resident doctors, and nursing staff with granular permissions. Protect medical records from unauthorized tampering with immutable audit trails.
              </p>
            </div>
            <div className="text-[11px] font-bold text-rose-500 mt-4 flex items-center gap-1 font-mono">
              RBAC Protected <ArrowRight size={13} />
            </div>
          </TiltCard>
        </div>
      </section>

      {/* ─── LIVE PRESCRIPTION SANDBOX ─── */}
      <section className="py-16 px-4 md:px-8 relative z-10">
        <InteractiveRxSandbox appSignupUrl={signupUrl} />
      </section>

      {/* ─── WORKFLOW PIPELINES (REAL HCMS SCREENS) ─── */}
      <section className="py-16 px-4 md:px-8 relative z-10">
        <InteractiveWorkflowExplorer appSignupUrl={signupUrl} />
      </section>

      {/* ─── PRICING SECTION ─── */}
      <section className="relative z-10">
        <LandingPricingSection appSignupUrl={signupUrl} />
      </section>

      {/* ─── FAQ ACCORDION ─── */}
      <section id="faq" className="py-20 px-4 md:px-8 max-w-4xl mx-auto text-left relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 text-xs font-semibold mb-3 border border-teal-500/20 font-mono">
            Questions & Answers
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-[var(--text-primary)] tracking-tight font-display">
            Frequently Asked Questions
          </h2>
          <p className="text-xs md:text-sm text-[var(--text-secondary)] mt-2">
            Everything doctors ask when transitioning from paper registers to HCMS.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface-1)] overflow-hidden transition-all shadow-sm"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-[var(--text-primary)] hover:text-teal-500 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={18}
                    className={`text-[var(--text-muted)] transition-transform duration-200 ${isOpen ? 'rotate-180 text-teal-500' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border)] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── FINAL CALL-TO-ACTION BANNER ─── */}
      <section className="py-20 px-4 md:px-8 max-w-5xl mx-auto text-center relative z-10">
        <div className="rounded-3xl p-8 md:p-14 bg-gradient-to-br from-teal-50 via-white to-emerald-50 dark:from-teal-950/60 dark:via-slate-900 dark:to-emerald-950/60 border-2 border-teal-500/30 dark:border-teal-500/40 backdrop-blur-2xl shadow-xl dark:shadow-2xl dark:shadow-teal-500/20 text-[var(--text-primary)] dark:text-white transition-colors">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 font-display text-[var(--text-primary)] dark:text-white">
            Modernize Your Clinic in Under 60 Seconds
          </h2>
          <p className="text-sm md:text-base text-[var(--text-secondary)] dark:text-slate-300 max-w-xl mx-auto mb-8">
            Experience the speed of an offline-ready, multi-lingual clinical OS. Start your 15-day evaluation pass today with zero auto-debit commitments.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={signupUrl}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white font-extrabold text-sm md:text-base flex items-center justify-center gap-2 shadow-xl shadow-teal-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Start 15-Day Trial (₹22)
              <ArrowRight size={18} />
            </a>

            <a
              href={loginUrl}
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-white hover:bg-slate-50 dark:bg-white/10 dark:hover:bg-white/15 text-[var(--text-primary)] dark:text-white font-bold text-sm border border-slate-200 dark:border-white/15 transition-all text-center shadow-sm"
            >
              Sign In to Existing Clinic
            </a>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="w-full bg-[var(--surface-0)] border-t border-[var(--border)] text-[var(--text-muted)] text-xs py-14 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12 text-left">
          <div className="md:col-span-1">
            <a href="#top" className="logo-row mb-4 text-decoration-none inline-flex">
              <div className="logo-icon">
                <img
                  src="/icons/logo.png"
                  alt="HCMS Logo"
                  width={38}
                  height={38}
                />
              </div>
              <div className="logo-text text-left">
                <h2>HCMS</h2>
                <p>Clinic Management</p>
              </div>
            </a>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
              Modern Hospital & Clinic Management System designed for outpatient consultations, inpatient stays, fast multi-lingual e-prescriptions, and zero-fee UPI billing.
            </p>
            <div className="text-[11px] text-[var(--text-muted)] space-y-1">
              <p>Developed with precision by <strong>Askit Studio</strong></p>
              <p>© {new Date().getFullYear()} HCMS. All rights reserved.</p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] mb-3 font-mono">
              Clinical Modules
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#workflows" className="hover:text-teal-500 transition-colors">Fast OPD Queue & Consultation</a></li>
              <li><a href="#demo" className="hover:text-teal-500 transition-colors">Multi-lingual E-Prescription (Rx)</a></li>
              <li><a href="#workflows" className="hover:text-teal-500 transition-colors">IPD Ward & Bed Allocation Matrix</a></li>
              <li><a href="#workflows" className="hover:text-teal-500 transition-colors">Doctor Round Day Logs & Procedures</a></li>
              <li><a href="#workflows" className="hover:text-teal-500 transition-colors">Thermal & A4 Letterhead Printing</a></li>
              <li><a href="#workflows" className="hover:text-teal-500 transition-colors">Direct WhatsApp Invoicing</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] mb-3 font-mono">
              Compliance & Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href={`${appUrl}/privacy`} className="hover:text-teal-500 transition-colors">Privacy Policy</a></li>
              <li><a href={`${appUrl}/terms`} className="hover:text-teal-500 transition-colors">Terms of Service</a></li>
              <li><a href={`${appUrl}/refund`} className="hover:text-teal-500 transition-colors">Refund & Cancellation Policy</a></li>
              <li><span className="text-[var(--text-muted)]">DPDP Act (India) Alignment</span></li>
              <li><span className="text-[var(--text-muted)]">Role-Based Access Control (RBAC)</span></li>
              <li><span className="text-[var(--text-muted)]">Zero Third-Party Ad Trackers</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] mb-3 font-mono">
              Doctor Care Desk
            </h4>
            <div className="space-y-2.5 text-xs text-[var(--text-secondary)]">
              <p>Email: <a href="mailto:support@askitstudio.com" className="text-teal-500 underline">support@askitstudio.com</a></p>
              <p>Helpline: <strong>+91 7720808013</strong></p>
              <p>Headquarters: Pune, Maharashtra, Askit Studio, India</p>
              <div className="p-3 rounded-xl bg-[var(--surface-1)] border border-[var(--border)] text-[11px] text-[var(--text-muted)] mt-3 leading-relaxed">
                Medical Disclaimer: HCMS is a clinical management software and not a diagnostic device. Certified medical practitioners remain solely responsible for patient treatment decisions.
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[var(--text-muted)]">
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span>Encrypted Database & ISO 27001 Cloud Infrastructure Standards</span>
          </div>
          <div className="flex items-center gap-4">
            <a href={`${appUrl}/privacy`} className="hover:underline">Privacy</a>
            <a href={`${appUrl}/terms`} className="hover:underline">Terms</a>
            <a href={`${appUrl}/refund`} className="hover:underline">Refunds</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
