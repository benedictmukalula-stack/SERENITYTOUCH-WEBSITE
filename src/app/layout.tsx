import type { Metadata } from 'next';
import { Playfair_Display, Inter, Cormorant_Garamond } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

const inter = Inter({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  variable: '--font-accent',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://serenitytouch.co.zm'),
  title: "Serenity Touch Spa — Luxury Wellness in Lusaka, Zambia",
  description:
    "Serenity Touch Spa — Lusaka's premier luxury wellness destination. 11 therapeutic treatments, signature packages, corporate wellness programs, and membership plans. Book online or call +260 761 404 555.",
  keywords: [
    'spa',
    'massage',
    'Lusaka',
    'Zambia',
    'luxury spa',
    'wellness',
    'therapists',
    'membership',
    'Thai massage',
    'aromatherapy',
    'couples massage',
    'deep tissue',
    'corporate wellness',
    'gift vouchers',
    'spa packages',
    'reflexology',
    'pregnancy massage',
    'couples massage',
    'Thai massage',
    'Ibex Hill',
    'Lusaka spa near me',
    'Zambian spa',
  ],
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">✨</text></svg>',
  },
  openGraph: {
    title: "Serenity Touch Spa — Luxury Wellness in Lusaka",
    description:
      'Premium wellness spa in Ibex Hill, Lusaka — where certified therapists deliver the finest therapeutic massage experience in Zambia.',
    siteName: "Serenity Touch Spa",
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
        className={`${playfair.variable} ${inter.variable} ${cormorant.variable} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}