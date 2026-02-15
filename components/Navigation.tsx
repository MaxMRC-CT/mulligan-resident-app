'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Role } from '@prisma/client';

interface NavProps {
  role: Role;
  displayName?: string;
}

export function Navigation({ role, displayName }: NavProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { label: 'Home', href: '/dashboard', roles: ['RESIDENT', 'STAFF', 'ADMIN'] },
    { label: 'Announcements', href: '/announcements', roles: ['RESIDENT', 'STAFF', 'ADMIN'] },
    { label: 'Messages', href: '/messages', roles: ['RESIDENT', 'STAFF'] },
    { label: 'Chores', href: '/chores', roles: ['RESIDENT', 'STAFF', 'ADMIN'] },
    { label: 'Meetings', href: '/meetings', roles: ['RESIDENT', 'STAFF'] },
    { label: 'Journal', href: '/journal', roles: ['RESIDENT'] },
    { label: 'Admin', href: '/admin', roles: ['STAFF', 'ADMIN'] },
  ];

  const filteredItems = navItems.filter(item => item.roles.includes(role));

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-1">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-mulligan-orange rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="font-semibold text-mulligan-warm-gray hidden sm:inline">
                Mulligan
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {filteredItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'bg-mulligan-orange text-white'
                    : 'text-mulligan-warm-gray hover:bg-mulligan-soft-gray'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-sm text-mulligan-warm-gray hidden sm:inline">
              {displayName || 'User'}
            </span>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 text-sm text-mulligan-warm-gray hover:bg-mulligan-soft-gray rounded-md transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden pb-3 pt-2 space-y-1">
          {filteredItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? 'bg-mulligan-orange text-white'
                  : 'text-mulligan-warm-gray hover:bg-mulligan-soft-gray'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
