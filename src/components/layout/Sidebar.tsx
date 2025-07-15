"use client"
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Home, User, Settings, Camera, MessageSquare, Calendar, Gift, Info } from 'lucide-react';
import Image from 'next/image';

const navigationItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Camera', href: '/camera', icon: Camera },
  { name: 'SmileChat', href: '/smilechat', icon: MessageSquare },
  { name: 'Appointments', href: '/appointments', icon: Calendar },
  { name: 'Special Offers', href: '/offers', icon: Gift },
  { name: 'Account', href: '/account', icon: User },
  { name: 'Information', href: '/informations', icon: Info },
];

export default function Sidebar({ collapsed, setCollapsed }: { collapsed: boolean, setCollapsed: (c: boolean) => void }) {
  const pathname = usePathname();

  return (
    <>
      {/* Sidebar Toggle */}
      <button
        type="button"
        className="fixed top-4 left-4 z-50 bg-[#1c788c] text-white rounded-full p-2 shadow-lg transition-all duration-300"
        onClick={() => setCollapsed(!collapsed)}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <Menu className="h-6 w-6" /> : <X className="h-6 w-6" />}
      </button>
      <aside
        className={`fixed top-0 left-0 z-40 h-full bg-white border-r border-[#74a8bc] transition-all duration-300 flex flex-col ${collapsed ? 'w-20' : 'w-64'} shadow-lg`}
      >
        {/* Logo */}
        <div className={`flex items-center border-b border-[#aedae8] px-4 h-16 transition-all duration-300 ${collapsed ? 'justify-center' : ''}`}>
          <Link href="/" className="flex items-center w-full justify-center">
            <div className={`relative ${collapsed ? 'h-10 w-10' : 'h-16 w-full'}`}>
              <Image
                src="/smilescope.jpeg"
                alt="Smilescope Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>
        </div>
        {/* Navigation */}
        <nav className="flex-1 py-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 font-poppins text-base font-bold text-[#1c788c] hover:bg-[#aedae8] ${isActive ? 'bg-[#aedae8] text-[#1c788c]' : ''} ${collapsed ? 'justify-center' : ''}`}
                  >
                    <Icon className="h-6 w-6" />
                    {!collapsed && <span>{item.name}</span>}
                  </Link>
                </li>
              );
            })}
            <li>
              <a href="/gallery" className={`flex items-center px-4 py-3 rounded-lg text-[#1c788c] hover:bg-[#aedae8] font-poppins font-bold text-base transition-colors duration-200 ${collapsed ? 'justify-center' : ''}`}>
                <svg className="w-6 h-6 mr-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                {!collapsed && <span>Gallery</span>}
              </a>
            </li>
          </ul>
        </nav>
        {/* Footer */}
        <div className={`absolute bottom-0 left-0 right-0 border-t border-[#aedae8] transition-all duration-300 ${collapsed ? 'flex flex-col items-center' : ''}`}>
          <div className={`user-profile flex items-center ${collapsed ? 'justify-center py-2' : 'space-x-2 px-2 py-2'}`} style={{ fontSize: '0.8rem', pointerEvents: 'none' }}>
            <div className="h-6 w-6 rounded-full bg-[#aedae8] flex items-center justify-center">
              <User className="h-3 w-3 text-[#1c788c]" />
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-poppins font-bold text-[#1c788c] truncate m-0">Dr. Smith</p>
                <p className="text-[10px] font-inter text-[#74a8bc] truncate m-0">Premium Account</p>
              </div>
            )}
          </div>
        </div>
      </aside>
      <style jsx>{`
        .user-profile {
          font-size: 0.8rem;
          padding: 8px 0;
          pointer-events: none;
        }
      `}</style>
    </>
  );
} 