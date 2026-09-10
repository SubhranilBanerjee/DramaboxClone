import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { MobileNav } from '@/components/MobileNav';
import { ToastProvider } from '@/components/Toast';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'YarrowPlay - Short-Form Vertical Reel Dramas',
  description: 'Stream trending short-form vertical reel dramas, billionaire romance, revenge stories, and thrillers on YarrowPlay.',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark bg-[#070707] text-white">
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://assets.mixkit.co" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://assets.mixkit.co" />
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      </head>
      <body className="min-h-screen bg-[#070707] text-white flex flex-col antialiased selection:bg-[#FF007A] selection:text-white">
        <AuthProvider>
          <ToastProvider>
            <Navbar />
            <main className="flex-1 pb-16 md:pb-0">{children}</main>
            <MobileNav />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
