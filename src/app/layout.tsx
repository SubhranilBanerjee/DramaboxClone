import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { MobileNav } from '@/components/MobileNav';
import { ToastProvider } from '@/components/Toast';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'DramaBox - Short-Form Vertical Reel Dramas',
  description: 'Stream trending short-form vertical dramas, billionaire romance, revenge stories, and thrillers.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark bg-[#07060e] text-slate-100">
      <body className="min-h-screen bg-[#07060e] text-slate-100 flex flex-col antialiased selection:bg-pink-500 selection:text-white">
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
