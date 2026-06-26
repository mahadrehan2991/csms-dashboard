'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DeveloperSidebar from '@/components/developer/sidebar';
import TopNavbar from '@/components/developer/navbar';
import { ToastProvider } from '@/components/ui/toast';
import { api } from '@/lib/api';

interface User {
  id: string;
  email: string;
  name: string | null;
  userRoles: { role: { name: string } }[];
}

export default function DeveloperLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // Layout presentation states
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    // Restore sidebar state preference
    const pref = localStorage.getItem('sidebar-collapsed');
    if (pref === 'true') setCollapsed(true);
  }, []);

  const handleCollapseToggle = (val: boolean) => {
    setCollapsed(val);
    localStorage.setItem('sidebar-collapsed', String(val));
  };

  useEffect(() => {
    async function checkAuth() {
      try {
        const userData = await api.get<User>('/auth/me');
        const roleNames = userData.userRoles?.map((ur) => ur.role.name) || [];

        if (roleNames.length > 0) {
          setAuthorized(true);
          setUser(userData);
        } else {
          router.push('/dashboard');
        }
      } catch (err) {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [router]);

  // Inactivity idle auto-logout (5 minutes)
  useEffect(() => {
    if (!authorized) return;

    const IDLE_TIMEOUT = 5 * 60 * 1000; // 5 minutes
    let timeoutId: NodeJS.Timeout;

    const handleAutoLogout = async () => {
      try {
        await api.post('/auth/logout');
      } catch (err) {
        console.error('Auto-logout failure:', err);
      }
      router.push('/login?reason=idle');
    };

    const resetIdleTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleAutoLogout, IDLE_TIMEOUT);
    };

    const activityEvents = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    
    resetIdleTimer();

    activityEvents.forEach((ev) => {
      window.addEventListener(ev, resetIdleTimer);
    });

    return () => {
      clearTimeout(timeoutId);
      activityEvents.forEach((ev) => {
        window.removeEventListener(ev, resetIdleTimer);
      });
    };
  }, [authorized, router]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-sm font-medium text-muted-foreground animate-pulse">
            Loading CSMS Dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!authorized) return null;

  return (
    <ToastProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        {/* Responsive Collapsible Sidebar */}
        <DeveloperSidebar
          user={user}
          collapsed={collapsed}
          setCollapsed={handleCollapseToggle}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        {/* Workspace viewport container */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Dashboard top navigation control bar */}
          <TopNavbar
            collapsed={collapsed}
            setCollapsed={handleCollapseToggle}
            setMobileOpen={setMobileOpen}
          />

          {/* Dynamic page viewport */}
          <main className="flex-1 overflow-y-auto bg-muted/10">
            <div className="mx-auto max-w-7xl px-4 md:px-8 py-6 md:py-8 transition-all duration-300">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
