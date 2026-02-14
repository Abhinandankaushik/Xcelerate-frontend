import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr] bg-gradient-to-br from-background via-background to-muted/20">
            <div className="hidden lg:block">
                <Sidebar />
            </div>
            <div className="flex flex-col">
                <Header />
                <main className="flex flex-1 flex-col overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
