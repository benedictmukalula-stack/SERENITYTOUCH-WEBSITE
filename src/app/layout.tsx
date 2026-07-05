import type { Metadata } from 'next';
import { Cormorant_Garamond } from 'next/font/google';
import './globals.css';

const cormorant = Cormorant_Garamond({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const cormorantBody = Cormorant_Garamond({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Tina's Sanctuary — Luxury Wellness in Lusaka",
  description:
    "Exclusive wellness sanctuary in Lusaka, Zambia. Certified therapists, silk-draped suites and considered rituals deliver the finest therapeutic experience.",
  keywords: [
    'wellness',
    'spa',
    'massage',
    'Lusaka',
    'Zambia',
    'luxury',
    'therapists',
    'membership',
  ],
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🌿</text></svg>',
  },
  openGraph: {
    title: "Tina's Sanctuary — Luxury Wellness in Lusaka",
    description:
      'Private wellness sanctuary in Ibex Hill, Lusaka — where certified therapists deliver the finest therapeutic experience in Zambia.',
    siteName: "Tina's Sanctuary",
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${cormorant.variable} ${cormorantBody.variable} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}