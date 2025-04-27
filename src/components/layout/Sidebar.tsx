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
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Sidebar Toggle */}
           <button
        type="button"
        className="lg:hidden fixed top-8 left-4 btn btn-outline p-2 "
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {/* Sidebar Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-neutral-900/20 backdrop-blur-sm md:hidden z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full w-64 transform bg-white border-r border-neutral-200 
        transition-transform duration-200 ease-in-out md:translate-x-0 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-neutral-200 px-6">
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative h-8 w-8">
              <Image
                src="/logo.svg"
                alt="Smilescope Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-lg font-semibold text-neutral-900">
              Smilescope
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="space-y-1 px-3 py-4">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-neutral-200 p-4">
          <div className="flex items-center space-x-3 px-3">
            <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
              <User className="h-4 w-4 text-primary-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-900 truncate">
                Dr. Smith
              </p>
              <p className="text-xs text-neutral-500 truncate">
                Premium Account
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
} 