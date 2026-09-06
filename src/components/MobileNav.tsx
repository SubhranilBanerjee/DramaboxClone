'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Flame, PlayCircle, User } from 'lucide-react';

export const MobileNav = () => {
  const pathname = usePathname();

  const items = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Trending', href: '/#trending', icon: Flame },
    { label: 'Watch', href: '/watch/a1111111-1111-1111-1111-111111111111?ep=1', icon: PlayCircle },
    { label: 'Profile', href: '/profile', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0c0a18]/95 backdrop-blur-md border-t border-[#221c3d] flex items-center justify-around h-14 px-2">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center justify-center gap-0.5 w-16 py-1 transition-all ${
              isActive
                ? 'text-pink-400 font-bold drop-shadow-[0_0_8px_rgba(255,42,141,0.8)]'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="text-[10px]">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
};
