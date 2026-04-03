'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Shield, Menu, X, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { clearAll } from '@/lib/store';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/onboarding', label: 'Get Started' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/simulate', label: 'Simulate' },
  { href: '/admin', label: 'Admin' },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  function handleReset() {
    clearAll();
    router.push('/');
    setOpen(false);
  }

  return (
    <header className="bg-surface border-b border-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold text-text-primary">
          <Shield className="w-5 h-5 text-primary" />
          <span className="text-[15px] tracking-tight">GigSuraksha</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1.5 text-[13px] font-medium rounded-md transition-colors ${
                pathname === link.href
                  ? 'bg-primary-light text-primary'
                  : 'text-text-secondary hover:text-text-primary hover:bg-border-light'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={handleReset}
            title="Reset demo — clears all local state"
            className="ml-2 flex items-center gap-1.5 px-2.5 py-1.5 text-[12px] font-medium text-text-muted hover:text-text-secondary transition-colors rounded-md hover:bg-border-light"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Demo
          </button>
        </nav>

        {/* Mobile Toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-1.5 rounded-md text-text-secondary hover:bg-border-light"
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {open && (
        <nav className="md:hidden border-t border-border bg-surface px-4 py-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`block px-3 py-2.5 text-[14px] font-medium rounded-md ${
                pathname === link.href
                  ? 'bg-primary-light text-primary'
                  : 'text-text-secondary hover:bg-border-light'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 w-full px-3 py-2.5 text-[13px] font-medium text-text-muted hover:bg-border-light rounded-md"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Demo
          </button>
        </nav>
      )}
    </header>
  );
}
