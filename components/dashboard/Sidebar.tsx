'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Map, FileText, AlertTriangle, Settings, LogOut, ShieldCheck, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThemeToggleCompact } from '@/components/ui/theme-toggle';
import { motion } from 'framer-motion';

const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: Map, label: 'Map Monitor', href: '/dashboard/map' },
    { icon: FileText, label: 'Reports', href: '/dashboard/reports' },
    { icon: AlertTriangle, label: 'Violations', href: '/dashboard/violations' },
    { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-full w-64 flex-col bg-gradient-to-b from-background to-muted/20 border-r-2 shadow-lg">
            {/* Header */}
            <div className="flex h-16 items-center justify-between border-b-2 px-6 bg-card/50 backdrop-blur-sm">
                <Link href="/" className="flex items-center gap-3 font-bold group">
                    <div className="relative">
                        <ShieldCheck className="h-7 w-7 text-primary group-hover:scale-110 transition-transform" />
                        <div className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-green-500 rounded-full animate-pulse" />
                    </div>
                    <span className="text-lg bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        CSIDC Monitor
                    </span>
                </Link>
                <ThemeToggleCompact />
            </div>

            {/* Status Badge */}
            <div className="px-4 py-4">
                <div className="rounded-xl bg-primary/10 border-2 border-primary/20 p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Activity className="h-4 w-4 text-primary animate-pulse" />
                        <span className="text-xs font-semibold text-primary">System Status</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                        All systems operational
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-auto py-2 px-3">
                <nav className="grid items-start gap-2 text-sm font-medium">
                    {sidebarItems.map((item, index) => {
                        const isActive = pathname === item.href;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 rounded-xl px-4 py-3 transition-all hover:scale-[1.02] relative group",
                                        isActive 
                                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                                            : "text-muted-foreground hover:text-primary hover:bg-muted/50"
                                    )}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="sidebar-active"
                                            className="absolute inset-0 bg-primary rounded-xl"
                                            style={{ zIndex: -1 }}
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <item.icon className={cn(
                                        "h-5 w-5 transition-transform group-hover:scale-110",
                                        isActive ? "text-primary-foreground" : ""
                                    )} />
                                    <span className={cn(
                                        "font-medium",
                                        isActive ? "text-primary-foreground" : ""
                                    )}>
                                        {item.label}
                                    </span>
                                    {isActive && (
                                        <div className="ml-auto h-2 w-2 rounded-full bg-primary-foreground animate-pulse" />
                                    )}
                                </Link>
                            </motion.div>
                        );
                    })}
                </nav>
            </div>

            {/* Footer */}
            <div className="mt-auto border-t-2 p-4 bg-card/50 backdrop-blur-sm">
                <div className="mb-3 px-2">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Active Monitoring</p>
                    <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className="h-full w-4/5 bg-gradient-to-r from-primary to-blue-500 rounded-full animate-pulse" />
                        </div>
                        <span className="text-xs font-bold text-primary">80%</span>
                    </div>
                </div>
                <Button variant="outline" className="w-full justify-start gap-2 hover:bg-destructive hover:text-destructive-foreground transition-colors group">
                    <LogOut className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    Logout
                </Button>
            </div>
        </div>
    );
}
