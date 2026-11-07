'use client';

import { useEffect, useState } from 'react';

const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://hcms.askitstudio.in').replace(/\/$/, '');
const signupUrl = `${appUrl}/signup`;
const loginUrl = `${appUrl}/login`;

type WorkflowStep = { number: string; title: string; detail: string; image?: string; alt?: string; caption?: string; points?: string[] };

const opdSteps: WorkflowStep[] = [
  { number: '01', title: 'Register the patient', detail: 'Create a patient record with the details your team needs for future visits.', image: '/workflows/opd-patient-registration.png', alt: 'Real HCMS patient registration screen with blank form fields', caption: 'PATIENTS · NEW REGISTRATION' },
  { number: '02', title: 'Start an OPD visit', detail: 'Open a visit and record complaints, diagnosis, vital signs, and consultation notes.', image: '/workflows/opd-new-visit.png', alt: 'Real HCMS new visit screen with blank patient and consultation fields', caption: 'OPD · NEW VISIT' },
  { number: '03', title: 'Finish with a care plan', detail: 'Add medicines and advice, save the prescription, and keep follow-up details with the visit.', points: ['Prescription & advice', 'Visit history', 'Follow-up reminders'] },
];

const ipdSteps: WorkflowStep[] = [
  { number: '01', title: 'See ward and bed availability', detail: 'Use the ward plan to see bed status and choose a suitable vacant bed.', image: '/workflows/ipd-bed-plan.png', alt: 'Real HCMS inpatient ward plan showing bed availability', caption: 'IPD · WARD PLAN' },
  { number: '02', title: 'Record the admission', detail: 'Select a patient and bed, then enter admission details, diagnosis, and any advance deposit.', points: ['Patient & bed selection', 'Admission date and doctor', 'Diagnosis & deposit'] },
  { number: '03', title: 'Manage the inpatient stay', detail: 'Keep the stay moving with daily care, charges, and discharge details in the inpatient workflow.', points: ['Daily rounds & notes', 'Running charges', 'Discharge record'] },
];

function Brand() {
  return <a className="brand" href="#top" aria-label="HCMS home"><span className="brand-symbol" aria-hidden="true"><i /><i /></span><span>HCMS</span></a>;
}

function Arrow() { return <span aria-hidden="true">↗</span>; }

function Workflow({ id, eyebrow, title, intro, steps, tint }: {
  id: string; eyebrow: string; title: string; intro: string;
  steps: WorkflowStep[]; tint: 'opd' | 'ipd';
}) {
  return (
    <section className={`workflow ${tint}`} id={id}>
      <div className="workflow-heading">
        <div><span className="eyebrow"><b />{eyebrow}</span><h2>{title}</h2></div>
        <p>{intro}</p>
      </div>
      <div className="workflow-steps">
        {steps.map((step) => (
          <article className="workflow-step" key={step.number}>
            <div className="step-copy"><span className="step-number">{step.number}</span><div><h3>{step.title}</h3><p>{step.detail}</p>
            {step.points && <ul>{step.points.map((point) => <li key={point}><span>✓</span>{point}</li>)}</ul>}
            </div></div>
            {step.image ? <figure className="screen-card"><div className="screen-top"><span className="screen-lights"><i /><i /><i /></span><span>hcms.askitstudio.in</span><span className="screen-live"><i /> REAL APP SCREEN</span></div><img src={step.image} alt={step.alt || ''} loading="lazy"/><figcaption>{step.caption}<span>Captured from HCMS</span></figcaption></figure> : <div className="step-summary"><div className="summary-mark">{tint === 'opd' ? 'Rx' : '+'}</div><span className="summary-label">{tint === 'opd' ? 'CONSULTATION COMPLETE' : 'INPATIENT CARE'}</span><div className="summary-line"/><small>{tint === 'opd' ? 'Visit details stay with the patient record.' : 'Admission details carry through the stay.'}</small></div>}
          </article>
        ))}
      </div>
    </section>
  );
}

export default function LandingPage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  useEffect(() => {
    const saved = window.localStorage.getItem('hcms-theme');
    if (saved === 'light' || saved === 'dark') setTheme(saved);
  }, []);
  function toggleTheme() {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    window.localStorage.setItem('hcms-theme', next);
  }

  return <main id="top" className="site-shell" data-theme={theme}>
    <header className="site-header"><Brand/><nav aria-label="Main navigation"><a href="#opd">OPD workflow</a><a href="#ipd">IPD workflow</a><a href="#features">Features</a></nav><div className="header-actions"><button className="theme-toggle" type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`} title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}><span aria-hidden="true">{theme === 'light' ? '☾' : '☀'}</span><small>{theme === 'light' ? 'Dark' : 'Light'}</small></button><a className="signin" href={loginUrl}>Sign in</a><a className="button button-small" href={signupUrl}>Get started <Arrow/></a></div></header>

    <section className="hero"><div className="hero-copy"><span className="eyebrow"><b/>HOSPITAL & CLINIC MANAGEMENT</span><h1>Your clinic,<br/>in <em>good flow.</em></h1><p>Give your team one clear place for patient records, OPD visits, and inpatient care—so less gets lost between the people and the work.</p><div className="hero-actions"><a className="button button-large" href={signupUrl}>Set up your clinic <span>→</span></a><a className="hero-link" href="#opd">See how it works <span>↓</span></a></div><div className="hero-foot"><span className="pulse"/> Explore HCMS for your clinic</div></div>
      <div className="hero-visual"><div className="hero-visual-top"><span><i/> REAL HCMS SCREEN</span><span>OPD · PATIENT VISIT</span></div><img src="/workflows/opd-new-visit.png" alt="Real HCMS patient visit screen showing the OPD consultation workflow"/><div className="visual-caption"><span className="visual-check">✓</span><span><b>One connected workflow</b><small>Patient record → consultation → follow-up</small></span></div><div className="visual-orbit"/></div>
    </section>

    <div className="trust-strip"><span>THE EVERYDAY WORK, CONNECTED</span><i/><span>Patient records</span><i/><span>OPD visits</span><i/><span>Inpatient care</span><i/><span>Clinic operations</span></div>

    <Workflow id="opd" eyebrow="OUTPATIENT · OPD" title="From registration to the next visit." intro="A practical patient journey, with the details of each consultation connected to the patient record." steps={opdSteps} tint="opd"/>
    <Workflow id="ipd" eyebrow="INPATIENT · IPD" title="From bed plan through the stay." intro="See the ward plan, capture admission details, and keep the inpatient journey organized through discharge." steps={ipdSteps} tint="ipd"/>

    <section className="features" id="features"><div className="features-heading"><span className="eyebrow"><b/>THE ESSENTIALS, CONNECTED</span><h2>Tools for the whole clinic day.</h2><p>Core workflows stay easy to find, so your team can focus on the work in front of them.</p></div><div className="feature-grid">{[
      ['01','Patients','Records and visit history in one place.'],['02','Appointments','Keep the day’s schedule in view.'],['03','OPD & prescriptions','Record consultations, medicines, and advice.'],['04','IPD & bed management','Organize admissions, beds, stays, and discharge.'],['05','Billing & reports','Keep billing and clinic activity accessible.'],['06','Clinic settings','Manage team access and clinic details.'],
    ].map(([n,title,description])=><article key={n}><span className="feature-number">{n}</span><span className="feature-glyph">{n==='03'?'Rx':n==='04'?'IP':n==='05'?'₹':n}</span><h3>{title}</h3><p>{description}</p><span className="feature-corner">↗</span></article>)}</div></section>

    <section className="closing"><div><span className="eyebrow"><b/>START WITH YOUR CLINIC</span><h2>Make the next clinic day clearer.</h2><p>Create an account and set up your HCMS workspace.</p></div><a className="button button-light" href={signupUrl}>Create your account <span>→</span></a></section>
    <footer><Brand/><span>Hospital & clinic management, made clear.</span><div><a href={loginUrl}>Sign in</a><a href={signupUrl}>Get started <Arrow/></a></div><small>© {new Date().getFullYear()} HCMS</small></footer>
  </main>;
}
