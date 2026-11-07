import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'HCMS — A clearer day at your clinic',
  description:
    'Manage patients, appointments, OPD visits, prescriptions, inpatient care, billing, and reports in one clinic management system.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
