'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Lock,
  ScrollText,
  LogOut,
  Terminal,
  ChevronRight,
  UserCheck,
  Truck,
  Calendar,
  BarChart3,
  ShieldAlert,
} from 'lucide-react';
import { useToast } from '@/components/ui/toast';

interface User {
  id: string;
  email: string;
  name: string | null;
  userRoles: { role: { name: string } }[];
}

interface DeveloperSidebarProps {
  user: User | null;
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (val: boolean) => void;
}

const navItems = [
  // Developer Section
  { href: '/developer', label: 'Overview', icon: LayoutDashboard, exact: true, requiredRoles: ['Developer', 'Registration Head', 'Logistics Head', 'Event Head', 'President'] },
  { href: '/developer/users', label: 'User Management', icon: Users, requiredRoles: ['Developer'] },
  { href: '/developer/roles', label: 'Role Management', icon: ShieldCheck, requiredRoles: ['Developer'] },
  { href: '/developer/permissions', label: 'Permissions', icon: Lock, requiredRoles: ['Developer'] },
  { href: '/developer/logs', label: 'Activity Logs', icon: ScrollText, requiredRoles: ['Developer'] },
  
  // Registration Section
  { href: '/developer/registration', label: 'Registration', icon: UserCheck, requiredRoles: ['Registration Head', 'President'], disabled: true },

  // Logistics Section
  { href: '/developer/logistics', label: 'Logistics', icon: Truck, requiredRoles: ['Logistics Head', 'President'], disabled: true },

  // Events Section
  { href: '/developer/events', label: 'Events', icon: Calendar, requiredRoles: ['Event Head', 'President'], disabled: true },

  // Reports Section
  { href: '/developer/reports', label: 'Reports', icon: BarChart3, requiredRoles: ['President'], disabled: true },
];

export default function DeveloperSidebar({
  user,
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}: DeveloperSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  const roleNames = user?.userRoles?.map((ur) => ur.role.name) || [];
  const primaryRole = roleNames[0] || 'Member';

  const visibleNavItems = navItems.filter((item) => {
    return item.requiredRoles.some((role) => roleNames.includes(role));
  });

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch {}
    router.push('/login');
  };

  const content = (
    <div className="flex h-full flex-col bg-card border-r border-border/80">
      {/* Brand Header */}
      <div className={cn(
        'flex items-center justify-between border-b border-border/60 px-5 py-4 shrink-0 transition-all duration-300',
        collapsed ? 'justify-center px-2 py-5' : 'px-6'
      )}>
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20 transition-all duration-200">
            <Terminal className="h-4.5 w-4.5 text-primary" />
          </div>
          {!collapsed && (
            <div className="animate-in fade-in duration-300">
              <p className="text-sm font-extrabold tracking-tight text-foreground">CSMS</p>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{primaryRole}</p>
            </div>
          )}
        </div>
        
        {/* Toggle Button for Desktop */}
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="hidden md:flex h-6 w-6 items-center justify-center rounded border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            title="Collapse Sidebar"
          >
            <ChevronRight className="h-3 w-3 rotate-180" />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {visibleNavItems.map(({ href, label, icon: Icon, exact, disabled }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={disabled ? '#' : href}
              className={cn(
                'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/10'
                  : disabled
                    ? 'text-muted-foreground/50 hover:bg-transparent cursor-not-allowed'
                    : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                collapsed && 'justify-center px-2'
              )}
              onClick={(e) => {
                if (disabled) {
                  e.preventDefault();
                  toast(`The ${label} module is planned and will be integrated into the CSMS Dashboard Framework.`, 'info', 'Module Planned');
                } else {
                  setMobileOpen(false);
                }
              }}
            >
              <Icon className={cn(
                'h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-105',
                isActive ? 'text-primary-foreground' : disabled ? 'text-muted-foreground/30' : 'text-muted-foreground group-hover:text-foreground'
              )} />
              {!collapsed && (
                <span className="flex-1 truncate animate-in fade-in duration-200">
                  {label}
                </span>
              )}
              {disabled && !collapsed && (
                <span className="text-[9px] bg-muted text-muted-foreground/75 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider scale-90 shrink-0">
                  Soon
                </span>
              )}
              {isActive && !collapsed && <ChevronRight className="h-3.5 w-3.5 opacity-70 shrink-0" />}
              
              {/* Collapsed Tooltip */}
              {collapsed && (
                <div className="absolute left-full ml-3 z-50 hidden group-hover:block rounded-lg bg-foreground text-background text-xs font-semibold px-2.5 py-1.5 whitespace-nowrap shadow-md">
                  {label} {disabled && '(Coming Soon)'}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer User Info & Logout */}
      <div className="border-t border-border/60 px-3 py-4 shrink-0 bg-muted/10">
        {!collapsed && user && (
          <div className="px-3 pb-3 mb-3 border-b border-border/40 animate-in fade-in duration-300">
            <p className="text-xs font-bold text-foreground truncate">{user.name || 'Member'}</p>
            <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={cn(
            'group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200 cursor-pointer',
            collapsed && 'justify-center px-2'
          )}
        >
          <LogOut className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-destructive transition-colors" />
          {!collapsed && <span className="animate-in fade-in duration-200">Sign Out</span>}
          
          {collapsed && (
            <div className="absolute left-full ml-3 z-50 hidden group-hover:block rounded-lg bg-destructive text-white text-xs font-semibold px-2.5 py-1.5 whitespace-nowrap shadow-md">
              Sign Out
            </div>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={cn(
        'hidden md:block h-screen shrink-0 transition-all duration-300 border-r border-border/40',
        collapsed ? 'w-16' : 'w-64'
      )}>
        {content}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/55 backdrop-blur-sm md:hidden animate-in fade-in duration-300"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 md:hidden transition-transform duration-300 transform bg-card shadow-2xl',
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        {content}
      </aside>
    </>
  );
}
