import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { MobileNav } from '@/components/MobileNav';
import { ToastProvider } from '@/components/Toast';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { FloatingThemeSwitcher } from '@/components/FloatingThemeSwitcher';

export const metadata: Metadata = {
  title: 'DramaBox - Short-Form Vertical Reel Dramas',
  description: 'Stream trending short-form vertical dramas, billionaire romance, revenge stories, and thrillers.',
};

// Inline script that runs synchronously before first paint to avoid
// theme flash. Reads localStorage and sets data-theme + window.__THEME__.
// Follows the Next.js "preventing flash before hydration" pattern.
const themeInitScript = `
(function() {
  try {
    var saved = localStorage.getItem('dramabox-theme');
    var valid = ['dark','light','violet','neon'];
    var theme = valid.indexOf(saved) !== -1 ? saved : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    window.__THEME__ = theme;
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'dark');
    window.__THEME__ = 'dark';
  }
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark bg-[#07060e] text-slate-100">
      {/* eslint-disable-next-line @next/next/no-before-interactive-script-component */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen bg-[#07060e] text-slate-100 flex flex-col antialiased selection:bg-pink-500 selection:text-white">
        <AuthProvider>
          <ThemeProvider>
            <ToastProvider>
              <Navbar />
              <main className="flex-1 pb-16 md:pb-0">{children}</main>
              <MobileNav />
              <FloatingThemeSwitcher />
            </ToastProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
