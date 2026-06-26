'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  UserCheck,
  UserX,
  Terminal,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  Lock,
  Plus,
  ScrollText,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';

interface Stats {
  totalUsers: number;
  activeAccounts: number;
  disabledAccounts: number;
  totalDevelopers: number;
}

interface ActivityLog {
  id: string;
  action: string;
  module: string;
  createdAt: string;
  user: { name: string | null; email: string } | null;
}

export default function DeveloperOverviewPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [profile, setProfile] = useState<{ name: string | null; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, logsData, profileData] = await Promise.all([
        api.get<Stats>('/users/stats'),
        api.get<ActivityLog[]>('/activity-logs?limit=5'),
        api.get<{ name: string | null; email: string }>('/auth/me'),
      ]);
      setStats(statsData);
      setLogs(logsData);
      setProfile(profileData);
    } catch (err: any) {
      setError(err.message || 'Failed to load panel statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-300">
      {/* Dynamic Welcome Hero Section */}
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card p-6 md:p-8 shadow-sm">
        {/* Background decorative glow element */}
        <div className="absolute -right-10 -top-10 h-72 w-72 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative z-10">
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary">COMECS Society Management System</p>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
              Welcome back, <span className="text-primary">{profile?.name || 'System Developer'}</span>
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground max-w-xl leading-relaxed">
              Everything is operating normally. All authorization flows, security logs, and database metrics are fully synchronized.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="flex items-center gap-2 bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-sm animate-pulse">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Fully Operational
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={loadData}
              disabled={loading}
              className="h-9 hover:bg-muted/80 shadow-sm cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
              Sync Stats
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3.5 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Polish Statistic Cards Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {loading && !stats ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="h-28 animate-pulse rounded-2xl bg-muted/40 border border-border" />
          ))
        ) : (
          <>
            <Card className="hover:shadow-md transition-all duration-300 border-border/60 shadow-sm group">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:scale-105 transition-transform duration-200">
                  <Users className="h-5.5 w-5.5" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Users</p>
                  <p className="text-2.5xl font-extrabold text-foreground">{stats?.totalUsers ?? 0}</p>
                  <p className="text-[10px] text-muted-foreground/80">Registered user accounts</p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-all duration-300 border-border/60 shadow-sm group">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/10 text-green-600 dark:text-green-400 group-hover:scale-105 transition-transform duration-200">
                  <UserCheck className="h-5.5 w-5.5" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Active Users</p>
                  <p className="text-2.5xl font-extrabold text-foreground">{stats?.activeAccounts ?? 0}</p>
                  <p className="text-[10px] text-muted-foreground/80">Currently allowed to access the system</p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-all duration-300 border-border/60 shadow-sm group">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive group-hover:scale-105 transition-transform duration-200">
                  <UserX className="h-5.5 w-5.5" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Suspended</p>
                  <p className="text-2.5xl font-extrabold text-foreground">{stats?.disabledAccounts ?? 0}</p>
                  <p className="text-[10px] text-muted-foreground/80">Accounts temporarily disabled</p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-all duration-300 border-border/60 shadow-sm group">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-600 dark:text-violet-400 group-hover:scale-105 transition-transform duration-200">
                  <Terminal className="h-5.5 w-5.5" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Developers</p>
                  <p className="text-2.5xl font-extrabold text-foreground">{stats?.totalDevelopers ?? 0}</p>
                  <p className="text-[10px] text-muted-foreground/80">Accounts with developer access</p>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Audit Activities */}
        <div className="lg:col-span-2">
          <Card className="h-full border-border/60 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-lg font-bold text-foreground">Recent Audit Trail</CardTitle>
                <CardDescription className="text-xs">Latest administrative actions logged in the system.</CardDescription>
              </div>
              <Link href="/developer/logs">
                <Button variant="ghost" size="sm" className="gap-1 cursor-pointer hover:bg-muted text-xs">
                  View All
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <div key={idx} className="h-10 animate-pulse rounded bg-muted/40" />
                  ))}
                </div>
              ) : logs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-xl border border-dashed border-border bg-muted/20">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground/60 mb-4">
                    <ScrollText className="h-6 w-6" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground mb-1">No activity recorded yet</h3>
                  <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                    System activity will appear here after administrators perform operations.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border/60">
                  {logs.map((log) => (
                    <div key={log.id} className="flex items-start justify-between py-3.5 gap-4">
                      <div className="space-y-1 min-w-0">
                        <p className="text-xs font-bold text-foreground truncate" title={log.action}>
                          {log.action}
                        </p>
                        <p className="text-[10px] text-muted-foreground truncate">
                          {log.user ? `${log.user.name || log.user.email} (${log.user.email})` : 'System Event'}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <Badge variant="secondary" className="text-[9px] font-bold uppercase tracking-wider">{log.module}</Badge>
                        <span className="text-[9px] text-muted-foreground">{formatDate(log.createdAt)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Panel */}
        <div>
          <Card className="h-full border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold text-foreground">Quick Access Controls</CardTitle>
              <CardDescription className="text-xs">Shortcut controls for security configurations.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Link href="/developer/users" className="w-full">
                <Button variant="outline" className="w-full justify-start gap-3 text-left py-6 border-border/60 hover:bg-muted/50 transition-all duration-200 shadow-sm">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <Users className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">User Administration</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Provision users and reset credentials.</p>
                  </div>
                </Button>
              </Link>

              <Link href="/developer/roles" className="w-full">
                <Button variant="outline" className="w-full justify-start gap-3 text-left py-6 border-border/60 hover:bg-muted/50 transition-all duration-200 shadow-sm">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-500/10 text-green-600 dark:text-green-400">
                    <ShieldCheck className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Configure Roles</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Map capabilities and designations.</p>
                  </div>
                </Button>
              </Link>

              <Link href="/developer/permissions" className="w-full">
                <Button variant="outline" className="w-full justify-start gap-3 text-left py-6 border-border/60 hover:bg-muted/50 transition-all duration-200 shadow-sm">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <Lock className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Feature Locking</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Toggle system permission keys.</p>
                  </div>
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
