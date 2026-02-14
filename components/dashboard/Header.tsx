'use client';

import { Bell, Search, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useState } from 'react';

export function Header() {
    const [notificationCount] = useState(3);

    return (
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b-2 bg-background/80 backdrop-blur-lg px-6 shadow-sm">
            <div className="w-full flex-1">
                <form>
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search plots, reports, violations..."
                            className="w-full bg-muted/50 pl-10 md:w-2/3 lg:w-1/3 border-2 focus:border-primary transition-all"
                        />
                    </div>
                </form>
            </div>
            
            <div className="flex items-center gap-2">
                {/* Theme Toggle */}
                <ThemeToggle />

                {/* Notifications */}
                <Button size="icon" variant="ghost" className="relative rounded-full hover:bg-muted">
                    <Bell className="h-5 w-5" />
                    {notificationCount > 0 && (
                        <Badge 
                            variant="destructive" 
                            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs animate-pulse"
                        >
                            {notificationCount}
                        </Badge>
                    )}
                    <span className="sr-only">Notifications</span>
                </Button>

                {/* User Profile */}
                <Button variant="ghost" className="gap-2 hover:bg-muted rounded-full pl-2 pr-4">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-medium hidden md:block">Admin</span>
                </Button>
            </div>
        </header>
    );
}
