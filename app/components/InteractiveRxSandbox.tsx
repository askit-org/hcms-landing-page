'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Stethoscope,
  Pill,
  Sparkles,
  Printer,
  Share2,
  Check,
  Plus,
  Trash2,
  Clock,
  Sunrise,
  Sun,
  Moon,
  Zap,
  Calendar,
  Languages,
  QrCode,
  User,
  Activity,
  FileCheck2,
  ChevronDown,
  RotateCcw,
  Search,
  Droplets,
  CheckSquare,
  Square,
} from 'lucide-react';

interface MedicineRow {
  id: string;
  name: string;
  type: string;
  // Slots: Morning, Afternoon, Night
  morning: boolean;
  afternoon: boolean;
  night: boolean;
  specialType: string; // e.g. "As needed (SOS)", "Apply 2x daily"
  amount: string; // e.g. "1", "5", "10"
  unitType: string; // e.g. "tablet", "ml", "capsule"
  duration: string; // e.g. "5 days"
  selectedInstructionKeys: string[];
  customInstruction: string;
}

interface PatientCase {
  id: string;
  name: string;
  age: number;
  gender: 'M' | 'F';
  phone: string;
  uhid: string;
  diagnosis: string;
  vitals: { bp: string; pulse: string; temp: string; spo2: string; weight: string };
}

const PATIENTS: PatientCase[] = [
  {
    id: 'p1',
    name: 'Aman Kazi',
    age: 28,
    gender: 'M',
    phone: '+91 98220 11420',
    uhid: 'HCMS-8021',
    diagnosis: 'Acute Viral Bronchitis & Rhinitis',
    vitals: { bp: '120/80', pulse: '74 bpm', temp: '98.4°F', spo2: '99%', weight: '68 kg' },
  },
  {
    id: 'p2',
    name: 'Azam Kazi',
    age: 32,
    gender: 'M',
    phone: '+91 98220 11421',
    uhid: 'HCMS-8022',
    diagnosis: 'Acute Gastritis & Acid Peptic Disease',
    vitals: { bp: '128/82', pulse: '78 bpm', temp: '98.6°F', spo2: '98%', weight: '72 kg' },
  },
  {
    id: 'p3',
    name: 'Shahbaz Khan Patan',
    age: 35,
    gender: 'M',
    phone: '+91 98220 11422',
    uhid: 'HCMS-8023',
    diagnosis: 'Tension-Type Headache & Cervical Spasm',
    vitals: { bp: '124/84', pulse: '80 bpm', temp: '98.2°F', spo2: '99%', weight: '76 kg' },
  },
];

const PRESET_INSTRUCTIONS = [
  {
    id: 'before_meals',
    en: 'Take before meals',
    hi: 'खाने से पहले लें',
    mr: 'जेवणापूर्वी घ्या',
  },
  {
    id: 'after_meals',
    en: 'Take after meals',
    hi: 'खाने के बाद लें',
    mr: 'जेवणानंतर घ्या',
  },
  {
    id: 'with_food',
    en: 'Take with food',
    hi: 'भोजन के साथ लें',
    mr: 'जेवणासोबत घ्या',
  },
  {
    id: 'empty_stomach',
    en: 'Take on an empty stomach',
    hi: 'खाली पेट लें',
    mr: 'उपाशीपोटी घ्या',
  },
  {
    id: 'plenty_water',
    en: 'Take with plenty of water',
    hi: 'खूब सारे पानी के साथ लें',
    mr: 'भरपूर पाण्यासोबत घ्या',
  },
  {
    id: 'at_bedtime',
    en: 'Take at bedtime',
    hi: 'रात को सोते समय लें',
    mr: 'रात्री झोपताना घ्या',
  },
  {
    id: 'no_water_syrup',
    en: 'Do not drink water immediately after syrup',
    hi: 'सिरप के तुरंत बाद पानी न पिएं',
    mr: 'सिरप घेतल्यानंतर लगेच पाणी पिऊ नये',
  },
  {
    id: 'complete_course',
    en: 'Complete the full course',
    hi: 'दवा का पूरा कोर्स समाप्त करें',
    mr: 'औषधाचा पूर्ण कोर्स वेळेवर पूर्ण करा',
  },
];

const SPECIAL_PRESETS = [
  { label: 'As needed (SOS)', value: 'As needed (SOS)', icon: <Zap size={13} /> },
  { label: 'Apply 2x daily', value: 'Apply 2x daily', icon: <Sparkles size={13} /> },
  { label: '1 per week (Weekly)', value: '1 per week', icon: <Calendar size={13} /> },
  { label: '2 per week (Twice weekly)', value: '2 per week', icon: <Calendar size={13} /> },
  { label: '1 per month (Monthly)', value: '1 per month', icon: <Calendar size={13} /> },
  { label: 'STAT (Immediately)', value: 'STAT', icon: <Zap size={13} /> },
];

const DOSAGE_UNITS = ['drops', 'ml', 'sachet', 'tablet', 'capsule', 'puff', 'tsp', 'mg', 'L'];
const DURATION_OPTIONS = ['1 day', '2 days', '3 days', '5 days', '7 days', '10 days', '14 days', '15 days', '30 days'];

export default function InteractiveRxSandbox({ appSignupUrl }: { appSignupUrl: string }) {
  const [activePatientIndex, setActivePatientIndex] = useState(0);
  const [activePrintLang, setActivePrintLang] = useState<'en' | 'hi' | 'mr'>('en');

  // Active open popover: { rowId: string, type: 'dose' | 'instructions' } | null
  const [activePopover, setActivePopover] = useState<{ rowId: string; type: 'dose' | 'instructions' } | null>(null);

  // Search filter inside instructions modal
  const [instructionSearch, setInstructionSearch] = useState('');

  // Catalog search input
  const [catalogQuery, setCatalogQuery] = useState('');

  // Toast flags
  const [copied, setCopied] = useState(false);
  const [printed, setPrinted] = useState(false);

  const popoverRef = useRef<HTMLDivElement>(null);

  // Close popover on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setActivePopover(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const patient = PATIENTS[activePatientIndex];

  // Prescribed medicines table state
  const [medRows, setMedRows] = useState<MedicineRow[]>([
    {
      id: 'med-1',
      name: 'Paracetamol 650 mg',
      type: 'Tablet',
      morning: true,
      afternoon: false,
      night: true,
      specialType: '',
      amount: '1',
      unitType: 'tablet',
      duration: '5 days',
      selectedInstructionKeys: ['after_meals', 'plenty_water'],
      customInstruction: '',
    },
    {
      id: 'med-2',
      name: 'Pantoprazole 40 mg',
      type: 'Tablet',
      morning: true,
      afternoon: false,
      night: false,
      specialType: '',
      amount: '1',
      unitType: 'tablet',
      duration: '7 days',
      selectedInstructionKeys: ['empty_stomach'],
      customInstruction: '',
    },
    {
      id: 'med-3',
      name: 'Dextromethorphan Syrup',
      type: 'Syrup',
      morning: true,
      afternoon: false,
      night: true,
      specialType: '',
      amount: '10',
      unitType: 'ml',
      duration: '5 days',
      selectedInstructionKeys: ['no_water_syrup'],
      customInstruction: '',
    },
  ]);

  // Format dose for display on the table button and letterhead (NO 101 or 1-0-1!)
  const getDoseDisplay = (row: MedicineRow, lang: 'en' | 'hi' | 'mr' = 'en'): string => {
    if (row.specialType) {
      if (row.specialType.includes('SOS')) {
        return lang === 'mr' ? 'गरज असेल तेव्हा (SOS)' : lang === 'hi' ? 'जरूरत पड़ने पर (SOS)' : 'As needed (SOS)';
      }
      return row.specialType;
    }

    const slots: string[] = [];
    if (row.morning) slots.push(lang === 'mr' ? 'सकाळी' : lang === 'hi' ? 'सुबह' : 'Morning');
    if (row.afternoon) slots.push(lang === 'mr' ? 'दुपारी' : lang === 'hi' ? 'दोपहर' : 'Afternoon');
    if (row.night) slots.push(lang === 'mr' ? 'रात्री' : lang === 'hi' ? 'रात' : 'Night');

    const unitStr = row.amount && row.unitType ? `${row.amount} ${row.unitType}` : '';

    if (slots.length === 0) {
      return unitStr || (lang === 'mr' ? 'डोस निवडा' : lang === 'hi' ? 'खुराक चुनें' : 'Select Dose');
    }

    const frequencyStr = slots.join(' - ');
    return unitStr ? `${unitStr} (${frequencyStr})` : frequencyStr;
  };

  // Format instruction text for display
  const getInstructionsDisplay = (row: MedicineRow, lang: 'en' | 'hi' | 'mr'): string => {
    const list: string[] = [];
    row.selectedInstructionKeys.forEach((k) => {
      const item = PRESET_INSTRUCTIONS.find((p) => p.id === k);
      if (item) list.push(item[lang]);
    });
    if (row.customInstruction) list.push(row.customInstruction);
    return list.length > 0 ? list.join(' • ') : lang === 'mr' ? 'सूचना निवडा...' : lang === 'hi' ? 'निर्देश चुनें...' : 'Select Instructions...';
  };

  // Mutators
  const updateRow = (rowId: string, patch: Partial<MedicineRow>) => {
    setMedRows(medRows.map((r) => (r.id === rowId ? { ...r, ...patch } : r)));
  };

  const removeRow = (rowId: string) => {
    if (medRows.length > 1) {
      setMedRows(medRows.filter((r) => r.id !== rowId));
    }
  };

  const addMedicineByName = (name: string, type: string = 'Tablet') => {
    const newId = `med-${Date.now()}`;
    setMedRows([
      ...medRows,
      {
        id: newId,
        name,
        type,
        morning: true,
        afternoon: false,
        night: true,
        specialType: '',
        amount: '1',
        unitType: type.toLowerCase() === 'syrup' ? 'ml' : 'tablet',
        duration: '5 days',
        selectedInstructionKeys: ['after_meals'],
        customInstruction: '',
      },
    ]);
    setCatalogQuery('');
  };

  // WhatsApp formatted simulation
  const handleShareWhatsApp = () => {
    const formatted = `*Momin Healthcare Clinic*\n*Dr. Nihal Momin* (MBBS, DNB)\nHelpline: +91 7720808013\nPune, Maharashtra, Askit Studio, India\n---------------------------------\n*Patient:* ${patient.name} (${patient.age}Y/${patient.gender})\n*Diagnosis:* ${patient.diagnosis}\n*Date:* ${new Date().toLocaleDateString('en-IN')}\n\n*PRESCRIPTION (℞):*\n${medRows
      .map(
        (m, i) =>
          `${i + 1}. *${m.name}*\n   • Dose: ${getDoseDisplay(m, activePrintLang)}\n   • Duration: ${m.duration}\n   • Instructions: ${getInstructionsDisplay(m, activePrintLang)}`
      )
      .join('\n\n')}\n---------------------------------\nConsultation Fee: ₹400\nUPI: Direct to Clinic Bank (0% MDR)`;

    if (navigator?.clipboard) {
      navigator.clipboard.writeText(formatted);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  const handleSimulatePrint = () => {
    setPrinted(true);
    setTimeout(() => setPrinted(false), 2400);
  };

  return (
    <div id="demo" className="w-full max-w-6xl mx-auto rounded-3xl p-5 md:p-8 border border-teal-500/25 bg-[var(--card-bg)] backdrop-blur-2xl shadow-xl text-[var(--text-primary)] font-sans">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 mb-6 border-b border-[var(--border)]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-600 dark:text-teal-300 text-xs font-semibold mb-2">
            <Sparkles size={13} /> Interactive Clinic Software Sandbox
          </div>
          <h3 className="text-xl md:text-2xl font-black text-[var(--text-primary)] tracking-tight font-display">
            Try the Ultra-Fast E-Prescription Builder
          </h3>
          <p className="text-xs md:text-sm text-[var(--text-secondary)] mt-1">
            Exact UI from the HCMS app: slot frequency (Morning, Afternoon, Night), dosage measure, and multi-lingual clinical instruction checkboxes.
          </p>
        </div>

        {/* Global Print Language Picker */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-[var(--surface-1)] border border-[var(--border)] shadow-sm">
          <span className="text-xs text-[var(--text-secondary)] px-2 flex items-center gap-1.5 font-medium">
            <Languages size={14} className="text-teal-600 dark:text-teal-400" /> Print Language:
          </span>
          {(['en', 'hi', 'mr'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setActivePrintLang(lang)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activePrintLang === lang
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-2)]'
              }`}
            >
              {lang === 'en' ? 'English' : lang === 'hi' ? 'हिंदी (Hindi)' : 'मराठी (Marathi)'}
            </button>
          ))}
        </div>
      </div>

      {/* Top Patient Consultation Selector */}
      <div className="mb-6 p-4 rounded-2xl bg-[var(--surface-1)] border border-[var(--border)]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 flex items-center gap-1.5">
            <User size={14} /> Active Consultation
          </span>
          <span className="text-[11px] text-[var(--text-secondary)]">
            Attending Physician: <strong className="text-[var(--text-primary)]">Dr. Nihal Momin</strong> (MBBS, DNB)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {PATIENTS.map((p, idx) => {
            const isSelected = activePatientIndex === idx;
            return (
              <button
                key={p.id}
                onClick={() => setActivePatientIndex(idx)}
                className={`text-left p-3 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-teal-500/10 dark:bg-teal-500/20 border-teal-500 text-[var(--text-primary)] shadow-sm ring-1 ring-teal-500/50'
                    : 'bg-[var(--surface-2)] border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-0)] hover:text-[var(--text-primary)]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-sm text-[var(--text-primary)]">{p.name}</div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--surface-0)] border border-[var(--border)] text-[var(--text-secondary)] font-medium">
                    {p.age}Y / {p.gender}
                  </span>
                </div>
                <div className="text-[11px] text-teal-700 dark:text-teal-300/90 truncate mt-0.5 font-medium">
                  {p.diagnosis}
                </div>
                <div className="text-[10px] text-[var(--text-muted)] mt-1 flex items-center justify-between">
                  <span>UHID: {p.uhid}</span>
                  <span>{p.phone}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        {/* Left Side: Real Software Prescription Form */}
        <div className="lg:col-span-7 flex flex-col gap-4 text-left relative" ref={popoverRef}>
          {/* Main PRESCRIPTION Form Container (Mirrors Screenshots) */}
          <div className="p-4 md:p-5 rounded-2xl bg-[var(--surface-0)] border border-[var(--border)] flex flex-col gap-4 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                PRESCRIPTION
              </span>
              <span className="text-[11px] text-teal-600 dark:text-teal-400 font-medium">
                {medRows.length} active medicines
              </span>
            </div>

            {/* Medicine Search Bar */}
            <div className="relative">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Search medicine to add..."
                value={catalogQuery}
                onChange={(e) => setCatalogQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[var(--surface-1)] border border-[var(--border)] text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-teal-500 transition-colors"
              />

              {catalogQuery.trim() && (
                <div className="absolute top-full left-0 right-0 mt-1 p-2 rounded-xl bg-[var(--surface-0)] border border-[var(--border)] shadow-2xl z-20 flex flex-col gap-1">
                  {['Amoxicillin 500 mg', 'Cetirizine 10 mg', 'Azithromycin 500 mg', 'Ibuprofen 400 mg']
                    .filter((m) => m.toLowerCase().includes(catalogQuery.toLowerCase()))
                    .map((item) => (
                      <button
                        key={item}
                        onClick={() => addMedicineByName(item)}
                        className="text-left px-3 py-1.5 rounded-lg hover:bg-teal-500/10 text-xs font-semibold text-[var(--text-primary)] flex items-center justify-between"
                      >
                        <span>{item}</span>
                        <span className="text-[10px] text-teal-600 dark:text-teal-400">+ Add</span>
                      </button>
                    ))}
                  <button
                    onClick={() => addMedicineByName(catalogQuery.trim())}
                    className="text-left px-3 py-1.5 rounded-lg hover:bg-teal-500/10 text-xs font-bold text-teal-600 dark:text-teal-400 flex items-center gap-1.5 border-t border-[var(--border)] pt-2"
                  >
                    <Plus size={13} /> Add &quot;{catalogQuery.trim()}&quot; as custom drug
                  </button>
                </div>
              )}
            </div>

            {/* Prescription Table Columns */}
            <div className="grid grid-cols-12 gap-2 text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-wider px-1">
              <div className="col-span-4">MEDICINE</div>
              <div className="col-span-3">DOSE</div>
              <div className="col-span-2">DURATION</div>
              <div className="col-span-3">INSTRUCTIONS</div>
            </div>

            {/* Medicine Rows */}
            <div className="space-y-3">
              {medRows.map((row) => {
                const isDoseOpen = activePopover?.rowId === row.id && activePopover.type === 'dose';
                const isInstrOpen = activePopover?.rowId === row.id && activePopover.type === 'instructions';

                return (
                  <div
                    key={row.id}
                    className="p-3 rounded-xl bg-[var(--surface-1)] border border-[var(--border)] flex flex-col gap-2 relative transition-all"
                  >
                    <div className="grid grid-cols-12 gap-2 items-center">
                      {/* MEDICINE Name Input */}
                      <div className="col-span-4">
                        <input
                          type="text"
                          value={row.name}
                          onChange={(e) => updateRow(row.id, { name: e.target.value })}
                          className="w-full px-2.5 py-2 rounded-lg bg-[var(--surface-0)] border border-[var(--border)] text-xs text-[var(--text-primary)] font-semibold focus:outline-none focus:border-teal-500 truncate"
                        />
                      </div>

                      {/* DOSE Trigger Button */}
                      <div className="col-span-3 relative">
                        <button
                          type="button"
                          onClick={() =>
                            setActivePopover(isDoseOpen ? null : { rowId: row.id, type: 'dose' })
                          }
                          className={`w-full px-2.5 py-2 rounded-lg text-xs font-semibold flex items-center justify-between border transition-all text-left ${
                            isDoseOpen
                              ? 'border-teal-500 bg-teal-500/10 text-teal-700 dark:text-teal-300 ring-2 ring-teal-500/20'
                              : 'border-[var(--border)] bg-[var(--surface-0)] text-[var(--text-primary)] hover:border-teal-500/50'
                          }`}
                        >
                          <span className="flex items-center gap-1.5 truncate">
                            <Clock size={12} className="text-teal-600 dark:text-teal-400 flex-shrink-0" />
                            <span className="truncate">{getDoseDisplay(row, 'en')}</span>
                          </span>
                          <ChevronDown size={12} className="text-[var(--text-muted)] ml-1 flex-shrink-0" />
                        </button>
                      </div>

                      {/* DURATION Dropdown */}
                      <div className="col-span-2">
                        <select
                          value={row.duration}
                          onChange={(e) => updateRow(row.id, { duration: e.target.value })}
                          className="w-full px-2 py-2 rounded-lg bg-[var(--surface-0)] border border-[var(--border)] text-xs text-[var(--text-primary)] font-medium focus:outline-none focus:border-teal-500 cursor-pointer"
                        >
                          {DURATION_OPTIONS.map((dur) => (
                            <option key={dur} value={dur} className="bg-[var(--surface-0)] text-[var(--text-primary)]">
                              {dur}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* INSTRUCTIONS Trigger Button */}
                      <div className="col-span-3 relative">
                        <button
                          type="button"
                          onClick={() =>
                            setActivePopover(isInstrOpen ? null : { rowId: row.id, type: 'instructions' })
                          }
                          className={`w-full px-2.5 py-2 rounded-lg text-xs font-semibold flex items-center justify-between border transition-all text-left ${
                            isInstrOpen
                              ? 'border-teal-500 bg-teal-500/10 text-teal-700 dark:text-teal-300 ring-2 ring-teal-500/20'
                              : 'border-[var(--border)] bg-[var(--surface-0)] text-[var(--text-primary)] hover:border-teal-500/50'
                          }`}
                        >
                          <span className="truncate">
                            {row.selectedInstructionKeys.length > 0
                              ? `${row.selectedInstructionKeys.length} selected`
                              : 'Select Instructions...'}
                          </span>
                          <ChevronDown size={12} className="text-[var(--text-muted)] ml-1 flex-shrink-0" />
                        </button>
                      </div>
                    </div>

                    {/* Remove Action Button (as seen in screenshot) */}
                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={() => removeRow(row.id)}
                        disabled={medRows.length <= 1}
                        className="text-[11px] text-rose-500 hover:text-rose-600 disabled:opacity-30 flex items-center gap-1 font-semibold transition-colors"
                      >
                        <Trash2 size={12} /> Remove Medicine
                      </button>
                    </div>

                    {/* ─── REAL HCMS DOSE POPOVER (MATCHES SCREENSHOT 1) ─── */}
                    {isDoseOpen && (
                      <div className="absolute top-full left-0 mt-2 z-50 w-full max-w-[340px] rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-teal-500/40 p-4 shadow-2xl backdrop-blur-2xl flex flex-col gap-3 text-slate-900 dark:text-slate-100">
                        {/* 1. Daily Slots Frequency */}
                        <div>
                          <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                            1. DAILY SLOTS FREQUENCY
                          </div>

                          <div className="grid grid-cols-3 gap-2">
                            {/* Morning Slot */}
                            <div
                              onClick={() => {
                                updateRow(row.id, { morning: !row.morning, specialType: '' });
                              }}
                              className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                                row.morning && !row.specialType
                                  ? 'bg-teal-500/15 dark:bg-teal-500/20 border-teal-500 text-teal-800 dark:text-teal-300 ring-1 ring-teal-500/40'
                                  : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                              }`}
                            >
                              <Sunrise size={16} className={row.morning && !row.specialType ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400'} />
                              <span className="text-[9px] font-bold uppercase tracking-wider">MORNING</span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                  row.morning && !row.specialType ? 'bg-teal-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400'
                                }`}
                              >
                                {row.morning && !row.specialType ? '1 Dose' : 'Off'}
                              </span>
                            </div>

                            {/* Afternoon Slot */}
                            <div
                              onClick={() => {
                                updateRow(row.id, { afternoon: !row.afternoon, specialType: '' });
                              }}
                              className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                                row.afternoon && !row.specialType
                                  ? 'bg-teal-500/15 dark:bg-teal-500/20 border-teal-500 text-teal-800 dark:text-teal-300 ring-1 ring-teal-500/40'
                                  : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                              }`}
                            >
                              <Sun size={16} className={row.afternoon && !row.specialType ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400'} />
                              <span className="text-[9px] font-bold uppercase tracking-wider">AFTERNOON</span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                  row.afternoon && !row.specialType ? 'bg-teal-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400'
                                }`}
                              >
                                {row.afternoon && !row.specialType ? '1 Dose' : 'Off'}
                              </span>
                            </div>

                            {/* Night Slot */}
                            <div
                              onClick={() => {
                                updateRow(row.id, { night: !row.night, specialType: '' });
                              }}
                              className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                                row.night && !row.specialType
                                  ? 'bg-teal-500/15 dark:bg-teal-500/20 border-teal-500 text-teal-800 dark:text-teal-300 ring-1 ring-teal-500/40'
                                  : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                              }`}
                            >
                              <Moon size={16} className={row.night && !row.specialType ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400'} />
                              <span className="text-[9px] font-bold uppercase tracking-wider">NIGHT</span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                  row.night && !row.specialType ? 'bg-teal-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400'
                                }`}
                              >
                                {row.night && !row.specialType ? '1 Dose' : 'Off'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* SOS & Special Types */}
                        <div>
                          <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                            SOS & SPECIAL TYPES
                          </div>

                          <div className="grid grid-cols-2 gap-1.5">
                            {SPECIAL_PRESETS.map((spec) => (
                              <button
                                key={spec.label}
                                onClick={() => {
                                  updateRow(row.id, {
                                    specialType: spec.value,
                                    morning: false,
                                    afternoon: false,
                                    night: false,
                                  });
                                }}
                                className={`p-2 rounded-lg text-left text-[11px] font-semibold flex items-center gap-1.5 border transition-all ${
                                  row.specialType === spec.value
                                    ? 'bg-teal-500/20 border-teal-500 text-teal-900 dark:text-white'
                                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                                }`}
                              >
                                {spec.icon}
                                <span className="truncate">{spec.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* 2. Dosage Measure & Type */}
                        <div className="pt-2 border-t border-slate-200 dark:border-white/10">
                          <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                            2. DOSAGE MEASURE & TYPE
                          </div>

                          <div className="grid grid-cols-2 gap-2 mb-2">
                            <div>
                              <label className="text-[9px] text-slate-500 dark:text-slate-400 block mb-0.5">Amount</label>
                              <input
                                type="text"
                                placeholder="e.g. 2, 5, 1"
                                value={row.amount}
                                onChange={(e) => updateRow(row.id, { amount: e.target.value })}
                                className="w-full px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] text-slate-500 dark:text-slate-400 block mb-0.5">Type of dosage</label>
                              <input
                                type="text"
                                placeholder="e.g. drops, mL"
                                value={row.unitType}
                                onChange={(e) => updateRow(row.id, { unitType: e.target.value })}
                                className="w-full px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white"
                              />
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {DOSAGE_UNITS.map((unit) => (
                              <button
                                key={unit}
                                onClick={() => updateRow(row.id, { unitType: unit })}
                                className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
                                  row.unitType === unit
                                    ? 'bg-teal-500 text-white font-bold'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                                }`}
                              >
                                {unit}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Popover Bottom Actions */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-white/10">
                          <button
                            onClick={() => {
                              updateRow(row.id, {
                                morning: false,
                                afternoon: false,
                                night: false,
                                specialType: '',
                                amount: '',
                              });
                            }}
                            className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 font-semibold"
                          >
                            <RotateCcw size={12} /> Clear / Reset
                          </button>
                          <button
                            onClick={() => setActivePopover(null)}
                            className="px-4 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1"
                          >
                            <Check size={13} /> Done
                          </button>
                        </div>
                      </div>
                    )}

                    {/* ─── REAL HCMS INSTRUCTIONS POPOVER (MATCHES SCREENSHOT 2) ─── */}
                    {isInstrOpen && (
                      <div className="absolute top-full left-0 mt-2 z-50 w-full max-w-[380px] rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-teal-500/40 p-4 shadow-2xl backdrop-blur-2xl flex flex-col gap-3 text-slate-900 dark:text-slate-100">
                        {/* Header: Print Language Toggle */}
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/10">
                          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                            <Languages size={14} className="text-teal-600 dark:text-teal-400" /> Print Language:
                          </span>
                          <div className="flex items-center gap-1">
                            {(['en', 'hi', 'mr'] as const).map((lang) => (
                              <button
                                key={lang}
                                onClick={() => setActivePrintLang(lang)}
                                className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                                  activePrintLang === lang
                                    ? 'bg-teal-500 text-slate-950 shadow-sm'
                                    : 'bg-slate-150 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                }`}
                              >
                                {lang === 'en' ? 'English' : lang === 'hi' ? 'हिंदी' : 'मराठी'}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Search Filter */}
                        <div className="relative">
                          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type="text"
                            placeholder="Search instructions (e.g. food, water, bedtime)"
                            value={instructionSearch}
                            onChange={(e) => setInstructionSearch(e.target.value)}
                            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                          />
                        </div>

                        {/* Checkbox List */}
                        <div className="max-h-48 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                          {PRESET_INSTRUCTIONS.filter(
                            (p) =>
                              p.en.toLowerCase().includes(instructionSearch.toLowerCase()) ||
                              p.hi.includes(instructionSearch) ||
                              p.mr.includes(instructionSearch)
                          ).map((item) => {
                            const isChecked = row.selectedInstructionKeys.includes(item.id);
                            return (
                              <div
                                key={item.id}
                                onClick={() => {
                                  const next = isChecked
                                    ? row.selectedInstructionKeys.filter((k) => k !== item.id)
                                    : [...row.selectedInstructionKeys, item.id];
                                  updateRow(row.id, { selectedInstructionKeys: next });
                                }}
                                className={`p-2 rounded-lg flex items-center gap-2.5 cursor-pointer text-xs transition-colors ${
                                  isChecked ? 'bg-teal-500/15 dark:bg-teal-500/20 text-teal-900 dark:text-white' : 'hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300'
                                }`}
                              >
                                <div
                                  className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                                    isChecked
                                      ? 'bg-teal-500 border-teal-500 text-slate-950'
                                      : 'border-slate-400'
                                  }`}
                                >
                                  {isChecked && <Check size={11} />}
                                </div>
                                <span className="leading-tight">
                                  {item[activePrintLang]}
                                  <span className="text-[10px] text-slate-500 dark:text-slate-400 ml-1.5">
                                    / {activePrintLang === 'en' ? item.hi : item.en}
                                  </span>
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Custom Instruction Textarea */}
                        <div className="pt-2 border-t border-slate-200 dark:border-white/10">
                          <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                            Custom Instruction (Optional)
                          </label>
                          <textarea
                            rows={2}
                            placeholder="e.g. Avoid direct sunlight and dairy products"
                            value={row.customInstruction}
                            onChange={(e) => updateRow(row.id, { customInstruction: e.target.value })}
                            className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                          />
                        </div>

                        <div className="flex justify-end pt-1">
                          <button
                            onClick={() => setActivePopover(null)}
                            className="px-4 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs"
                          >
                            Done
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Exact HCMS Real Clinic Print Letterhead Preview */}
        <div className="lg:col-span-5 flex flex-col gap-3 text-left">
          <motion.div
            layout
            className="w-full bg-white text-slate-900 rounded-2xl p-5 md:p-6 shadow-2xl relative overflow-hidden font-sans border-2 border-teal-500/30"
          >
            {/* Top Verification Watermark */}
            <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-200 text-[10px] text-slate-500">
              <div className="flex items-center gap-1.5 font-bold text-teal-700 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                HCMS Digital Outpatient Record
              </div>
              <div className="text-slate-500">
                Date: <strong>{new Date().toLocaleDateString('en-IN')}</strong> · Rx: <strong>#OPD-7491</strong>
              </div>
            </div>

            {/* Doctor & Clinic Letterhead */}
            <div className="pb-3 mb-3 border-b-2 border-teal-800">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-base md:text-lg font-black text-teal-900 leading-tight">
                    Momin Healthcare Clinic & Day Care
                  </h4>
                  <p className="text-xs font-bold text-slate-700 mt-0.5">
                    Dr. Nihal Momin <span className="font-normal text-slate-600">• M.B.B.S., D.N.B. (Internal Medicine)</span>
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Reg. No: <strong>MMC/2018/04/1892</strong> • Helpline: <strong>+91 7720808013</strong>
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Pune, Maharashtra, Askit Studio, India
                  </p>
                </div>

                <div className="text-right">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 font-black text-sm">
                    Rx
                  </div>
                </div>
              </div>
            </div>

            {/* Patient Demographics Bar */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 mb-3 text-xs text-slate-700 flex flex-wrap items-center justify-between gap-1.5">
              <div>
                Patient: <strong className="text-slate-950 font-bold">{patient.name}</strong> ({patient.age}Y / {patient.gender})
              </div>
              <div className="text-slate-500 text-[11px]">
                UHID: <strong className="text-slate-700">{patient.uhid}</strong>
              </div>
            </div>

            {/* Vitals and Diagnosis Row */}
            <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
              <div className="p-2 rounded-lg bg-teal-50/50 border border-teal-100">
                <span className="text-[9px] font-bold text-teal-800 uppercase block">Diagnosis:</span>
                <span className="font-bold text-slate-900 text-xs">{patient.diagnosis}</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-[10px] text-slate-600 flex flex-col justify-center">
                <span>BP: {patient.vitals.bp} | Pulse: {patient.vitals.pulse}</span>
                <span>Temp: {patient.vitals.temp} | SpO2: {patient.vitals.spo2}</span>
              </div>
            </div>

            {/* ℞ Prescription Table */}
            <div className="mb-3">
              <div className="flex items-center gap-1.5 text-teal-800 font-black text-xs mb-1.5">
                <span className="text-sm font-serif italic">℞</span>
                <span>Rx — Prescribed Medicines</span>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100/80 text-slate-700 border-b border-slate-200 text-[10px]">
                      <th className="p-2 font-bold">#</th>
                      <th className="p-2 font-bold">Medicine</th>
                      <th className="p-2 font-bold">Dose</th>
                      <th className="p-2 font-bold">Duration</th>
                      <th className="p-2 font-bold">Instructions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medRows.map((row, i) => (
                      <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50/80">
                        <td className="p-2 font-bold text-teal-700">{i + 1}</td>
                        <td className="p-2 font-bold text-slate-900">
                          <div>{row.name}</div>
                          <span className="text-[9px] font-normal text-slate-500">{row.type}</span>
                        </td>
                        <td className="p-2 font-bold text-teal-800">
                          {getDoseDisplay(row, activePrintLang)}
                        </td>
                        <td className="p-2 text-slate-700 font-medium">{row.duration}</td>
                        <td className="p-2 text-slate-800 text-[11px] font-medium leading-tight">
                          {getInstructionsDisplay(row, activePrintLang)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Doctor Signature Block & Zero MDR UPI QR */}
            <div className="pt-2.5 border-t border-slate-200 flex items-end justify-between">
              {/* UPI QR Demo */}
              <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="w-10 h-10 bg-white p-0.5 rounded border border-slate-200 flex items-center justify-center">
                  <QrCode size={30} className="text-teal-800" />
                </div>
                <div className="text-[9px] text-slate-600 leading-tight">
                  <div className="font-bold text-slate-800">Scan to Pay (₹400)</div>
                  <div>Zero MDR UPI • NPCI</div>
                  <div className="text-emerald-700 font-semibold">Direct Clinic Bank A/c</div>
                </div>
              </div>

              {/* Doctor Stamp */}
              <div className="text-right">
                <div className="text-xs font-serif italic text-teal-800 font-bold">Dr. Nihal Momin</div>
                <div className="border-t border-slate-300 pt-0.5 mt-0.5 text-[9px] text-slate-500 font-semibold">
                  Dr. Nihal Momin (Consultant Physician)
                </div>
                <div className="text-[8px] text-slate-400">Authorized Medical Officer</div>
              </div>
            </div>
          </motion.div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
            <div className="flex items-center gap-2">
              <button
                onClick={handleSimulatePrint}
                className="px-3.5 py-2 rounded-xl bg-[var(--surface-1)] hover:bg-[var(--surface-2)] text-[var(--text-primary)] text-xs font-bold flex items-center gap-1.5 border border-[var(--border)] transition-all shadow-sm"
              >
                <Printer size={13} className="text-teal-600 dark:text-teal-400" />
                <span>{printed ? 'Sent to Printer!' : 'Print A4 / Thermal'}</span>
              </button>

              <button
                onClick={handleShareWhatsApp}
                className="px-3.5 py-2 rounded-xl bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5 border border-emerald-500/30 transition-all shadow-sm"
              >
                <Share2 size={13} />
                <span>{copied ? 'Copied Rx Link!' : 'Share WhatsApp Rx'}</span>
              </button>
            </div>

            <a
              href={appSignupUrl}
              className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 transition-colors"
            >
              <span>Activate Full Clinic Suite</span>
              <span>→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
