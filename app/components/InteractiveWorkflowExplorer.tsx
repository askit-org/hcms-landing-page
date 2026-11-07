'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Stethoscope,
  Bed,
  CheckCircle2,
  Users,
  Calendar,
  Receipt,
  FileCheck2,
  Sparkles,
  ArrowRight,
  Maximize2,
} from 'lucide-react';

interface WorkflowStep {
  number: string;
  title: string;
  detail: string;
  image?: string;
  alt?: string;
  caption?: string;
  badge: string;
  points: string[];
}

const opdWorkflow: WorkflowStep[] = [
  {
    number: '01',
    title: 'Instant Patient Registration',
    detail: 'Front-desk intake with auto-generated unique Patient ID, emergency guardian contacts, and chronic disease flags.',
    image: '/workflows/opd-patient-registration.png',
    alt: 'Real HCMS patient registration screen with blank form fields',
    caption: 'PATIENTS · NEW REGISTRATION',
    badge: 'Front Desk Intake',
    points: ['Auto-generates OPD IDs', 'Demographics & Vitals', 'Permanent Chronic Conditions'],
  },
  {
    number: '02',
    title: 'Consultation & Visit Charting',
    detail: 'Chief complaints picker, voice-to-text dictation, vital signs tracking (BP, Pulse, SpO2), and clinical diagnoses.',
    image: '/workflows/opd-new-visit.png',
    alt: 'Real HCMS new visit screen with consultation fields',
    caption: 'OPD · NEW CONSULTATION VISIT',
    badge: 'Doctor Desk',
    points: ['1-Click Chief Complaints', 'Voice-to-Text Input', 'Past Visit History Review'],
  },
  {
    number: '03',
    title: 'Prescription & Follow-Up Reminders',
    detail: 'Add medicines with clinical slot frequency (Morning, Afternoon, Night), print custom letterheads, and dispatch directly to patient WhatsApp.',
    badge: '1-Click Rx Engine',
    points: [
      'Multi-lingual instructions (EN, HI, MR)',
      'A4 Letterhead & 80mm Thermal Print',
      'Automated WhatsApp follow-up link',
      '0% MDR Dynamic UPI Payment QR',
    ],
  },
];

const ipdWorkflow: WorkflowStep[] = [
  {
    number: '01',
    title: 'Ward Matrix & Bed Availability',
    detail: 'Live visual occupancy matrix across ICU, General Wards, Private Rooms, and Semi-Private Beds with daily rates.',
    image: '/workflows/ipd-bed-plan.png',
    alt: 'Real HCMS inpatient ward plan showing bed availability',
    caption: 'IPD · WARD & BED PLAN MATRIX',
    badge: 'Live Bed Availability',
    points: ['Color-coded Bed Matrix', 'Real-Time Ward Occupancy', 'Configurable Daily Rates'],
  },
  {
    number: '02',
    title: 'Admission, Doctor Rounds & Nursing',
    detail: 'Capture admission diagnosis, attending consultant, advance deposits, morning/evening rounds, and nursing care logs.',
    badge: 'Inpatient Care Charting',
    points: [
      'Daily doctor round notes (ICU, Post-Op)',
      'Nursing procedure & medication tally',
      'Bed transfer with prorated daily rates',
      'Running daily ledger & charge tracking',
    ],
  },
  {
    number: '03',
    title: 'Discharge Summary & Settlement Bill',
    detail: 'Generate comprehensive hospital stay summary, home medications, post-op instructions, and consolidated final invoice.',
    badge: '1-Click Discharge Settlement',
    points: [
      'Structured discharge home prescriptions',
      'Multi-day itemized billing & deductions',
      'Direct WhatsApp discharge package',
      'Permanent medical stay audit archive',
    ],
  },
];

export default function InteractiveWorkflowExplorer({ appSignupUrl }: { appSignupUrl: string }) {
  const [activeTab, setActiveTab] = useState<'opd' | 'ipd'>('opd');
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const steps = activeTab === 'opd' ? opdWorkflow : ipdWorkflow;
  const currentStep = steps[activeStepIndex] || steps[0];

  return (
    <div id="workflows" className="w-full max-w-6xl mx-auto py-12 px-4 text-slate-100">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col items-center text-center mb-10">
        <div className="inline-flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900 border border-teal-500/30 backdrop-blur-xl shadow-xl shadow-teal-500/10 mb-4">
          <button
            onClick={() => {
              setActiveTab('opd');
              setActiveStepIndex(0);
            }}
            className={`px-6 py-2.5 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'opd'
                ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-lg shadow-teal-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Stethoscope size={16} /> Outpatient Clinic (OPD Workflow)
          </button>

          <button
            onClick={() => {
              setActiveTab('ipd');
              setActiveStepIndex(0);
            }}
            className={`px-6 py-2.5 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'ipd'
                ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-lg shadow-teal-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bed size={16} /> Inpatient Hospital (IPD Stay Journey)
          </button>
        </div>

        <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight">
          {activeTab === 'opd'
            ? 'From Patient Registration to Follow-Up'
            : 'From Bed Allocation through Discharge Settlement'}
        </h2>
        <p className="text-xs md:text-sm text-slate-400 max-w-xl mt-2">
          Experience real screens captured directly from HCMS. Click through each step to explore the operational journey.
        </p>
      </div>

      {/* Step Pills */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
        {steps.map((s, idx) => {
          const isSelected = activeStepIndex === idx;
          return (
            <button
              key={s.number}
              onClick={() => setActiveStepIndex(idx)}
              className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900 border-teal-500 shadow-xl shadow-teal-500/15'
                  : 'bg-slate-900/40 border-white/10 hover:border-white/20'
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 to-emerald-400" />
              )}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/10 text-teal-400">
                  {s.badge}
                </span>
                <span className={`text-xs font-mono font-bold ${isSelected ? 'text-teal-400' : 'text-slate-500'}`}>
                  STEP {s.number}
                </span>
              </div>
              <div className="font-bold text-sm text-white">{s.title}</div>
            </button>
          );
        })}
      </div>

      {/* Main Screen & Detail Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${activeTab}-${activeStepIndex}`}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25 }}
          className="rounded-3xl p-6 md:p-8 bg-slate-900/90 border border-white/10 backdrop-blur-2xl shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
        >
          {/* Left Text / Checklist */}
          <div className="lg:col-span-5 text-left flex flex-col gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 text-xs font-semibold w-fit border border-teal-500/20">
              <Sparkles size={13} /> {currentStep.badge}
            </div>

            <h3 className="text-xl md:text-2xl font-black text-white">
              {currentStep.title}
            </h3>

            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              {currentStep.detail}
            </p>

            <div className="space-y-2 mt-2">
              {currentStep.points.map((pt, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs text-slate-200">
                  <CheckCircle2 size={15} className="text-teal-400 flex-shrink-0" />
                  <span>{pt}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 flex items-center gap-3">
              <a
                href={appSignupUrl}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-teal-500/20 transition-all"
              >
                <span>Launch in Clinic</span>
                <ArrowRight size={13} />
              </a>
            </div>
          </div>

          {/* Right Real HCMS Screen Mockup */}
          <div className="lg:col-span-7">
            {currentStep.image ? (
              <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-700/80 shadow-2xl shadow-teal-500/10">
                {/* Browser Top Bar */}
                <div className="h-8 bg-slate-900 border-b border-white/10 px-4 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-slate-400">hcms.askitstudio.in</span>
                  <span className="text-[10px] text-teal-400 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                    AUTHENTIC SCREEN
                  </span>
                </div>

                {/* Screenshot Image */}
                <div className="relative group overflow-hidden bg-slate-950">
                  <img
                    src={currentStep.image}
                    alt={currentStep.alt || currentStep.title}
                    className="w-full h-auto object-cover max-h-[380px] group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-slate-950/95 via-slate-950/70 to-transparent flex items-center justify-between text-[11px] text-slate-300">
                    <span className="font-mono font-bold text-teal-300">{currentStep.caption}</span>
                    <span className="text-slate-400">Captured from HCMS Production</span>
                  </div>
                </div>
              </div>
            ) : (
              /* Fallback rich visual card for summary step */
              <div className="rounded-2xl p-8 bg-gradient-to-br from-slate-900 to-teal-950/50 border border-teal-500/30 text-left flex flex-col justify-between min-h-[320px]">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center mb-5 border border-teal-500/30 text-xl font-serif font-black italic">
                    Rx
                  </div>
                  <h4 className="text-xl font-black text-white mb-2">Connected Clinical Workflow</h4>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-md">
                    Every piece of patient data — past visits, recurring symptoms, medicine allergies, and running hospital invoices — is permanently unified into a single electronic health record.
                  </p>
                </div>

                <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>Zero Data Fragmentation</span>
                  <span className="text-teal-400 font-bold">100% HIPAA & DPDP Compliant</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

