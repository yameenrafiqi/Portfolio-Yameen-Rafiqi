import './globals.css';
import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import Script from 'next/script';

// Optimize font loading with Next.js Font optimization
const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://yameenrafiqi.com'),
  title: {
    default: 'Yameen Rafiqi | Software Developer & AI Automation Engineer',
    template: '%s | Yameen Rafiqi',
  },
  description: 'Portfolio of Yameen Rafiqi - B.Tech CSE student specializing in Cyber Security at PES University. AI Automation & Software Development Intern with expertise in building scalable automation workflows, full-stack applications, and data engineering solutions.',
  keywords: [
    'software developer',
    'AI automation engineer',
    'cyber security',
    'full-stack developer',
    'B.Tech CSE',
    'PES University',
    'web development',
    'n8n',
    'Make.com',
    'Next.js',
    'Python',
    'Yameen Rafiqi',
    'portfolio',
    'data engineering',
    'automation workflows',
  ],
  authors: [{ name: 'Yameen Rafiqi', url: 'https://yameenrafiqi.com' }],
  creator: 'Yameen Rafiqi',
  publisher: 'Yameen Rafiqi',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yameenrafiqi.com',
    title: 'Yameen Rafiqi | Software Developer & AI Automation Engineer',
    description: 'Portfolio of Yameen Rafiqi - B.Tech CSE student specializing in Cyber Security. AI Automation & Software Development Intern with expertise in automation workflows and full-stack development.',
    siteName: 'Yameen Rafiqi Portfolio',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Yameen Rafiqi - Software Developer & AI Automation Engineer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yameen Rafiqi | Software Developer & AI Automation Engineer',
    description: 'B.Tech CSE student specializing in Cyber Security. AI Automation & Software Development Intern with expertise in automation workflows and full-stack development.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  verification: {
    google: 'your-google-verification-code', // Add your Google Search Console code
  },
  alternates: {
    canonical: 'https://yameenrafiqi.com',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0A' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        {/* Preconnect to external domains for faster loading */}
        <link rel="preconnect" href="https://calendar.google.com" />
        <link rel="dns-prefetch" href="https://calendar.google.com" />
        <link rel="preconnect" href="https://api.github.com" />
        <link rel="dns-prefetch" href="https://api.github.com" />
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
        
        {/* Load Google Calendar script asynchronously after page load */}
        <Script
          src="https://calendar.google.com/calendar/scheduling-button-script.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}