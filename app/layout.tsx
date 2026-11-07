import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'HCMS — A clearer day at your clinic',
  description:
    'Manage patients, appointments, OPD visits, prescriptions, inpatient care, billing, and reports in one clinic management system.',
  icons: {
    icon: [
      { url: '/icons/icon.svg', type: 'image/svg+xml' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
