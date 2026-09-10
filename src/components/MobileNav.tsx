'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Flame, PlayCircle, User, BookOpen, LayoutDashboard, ShieldCheck, Video, Megaphone } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export const MobileNav = () => {
  const pathname = usePathname();
  const { user } = useAuth();

  const dashboardHref =
    user?.role === 'admin'
      ? '/admin'
      : user?.role === 'creator'
      ? '/creator/dashboard'
      : user?.role === 'advertiser'
      ? '/advertiser/dashboard'
      : '/viewer/dashboard';

  const DashboardIcon =
    user?.role === 'admin'
      ? ShieldCheck
      : user?.role === 'creator'
      ? Video
      : user?.role === 'advertiser'
      ? Megaphone
      : LayoutDashboard;

  const items = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Blog', href: '/blog', icon: BookOpen },
    { label: 'Watch', href: '/watch/a1111111-1111-1111-1111-111111111111?ep=1', icon: PlayCircle },
    { label: 'Dashboard', href: dashboardHref, icon: DashboardIcon },
    { label: 'Profile', href: '/profile', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#070707]/95 backdrop-blur-md border-t border-[#292929] flex items-center justify-around h-13 px-2">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center justify-center gap-0.5 w-14 py-1 transition-all ${
              isActive
                ? 'text-[#FF007A] font-bold'
                : 'text-[#8F8F98] hover:text-white'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="text-[10px] truncate max-w-[50px]">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
};
