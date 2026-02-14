'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, AlertTriangle, FileText, ArrowRight, TrendingUp, Shield, MapPin, Clock } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Line, LineChart } from 'recharts';

export default function ViolationsPage() {
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const res = await fetch('/api/reports');
                if (res.ok) {
                    const data = await res.json();
                    // Filter specifically for confirmed violations
                    const violations = data.filter((r: any) =>
                        r.status === 'Verified - Violation' ||
                        (r.ai_analysis_result?.deviation_percentage > 5)
                    );
                    setReports(violations);
                }
            } catch (error) {
                console.error("Failed to fetch reports", error);
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    const filteredReports = reports.filter(report =>
        report.industry_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report._id.includes(searchTerm)
    );

    // Analytics data
    const severityData = [
        { severity: 'Critical', count: filteredReports.filter(r => r.ai_analysis_result?.deviation_percentage > 15).length },
        { severity: 'High', count: filteredReports.filter(r => r.ai_analysis_result?.deviation_percentage > 10 && r.ai_analysis_result?.deviation_percentage <= 15).length },
        { severity: 'Medium', count: filteredReports.filter(r => r.ai_analysis_result?.deviation_percentage > 5 && r.ai_analysis_result?.deviation_percentage <= 10).length },
        { severity: 'Low', count: filteredReports.filter(r => r.ai_analysis_result?.deviation_percentage <= 5).length },
    ];

    const trendData = [
        { week: 'Week 1', violations: 8 },
        { week: 'Week 2', violations: 12 },
        { week: 'Week 3', violations: 15 },
        { week: 'Week 4', violations: filteredReports.length || 12 },
    ];

    const getRiskLevel = (deviation: number) => {
        if (deviation > 15) return { label: 'Critical', variant: 'destructive' as const, color: 'bg-red-500' };
        if (deviation > 10) return { label: 'High', variant: 'destructive' as const, color: 'bg-orange-500' };
        if (deviation > 5) return { label: 'Medium', variant: 'default' as const, color: 'bg-yellow-500' };
        return { label: 'Low', variant: 'secondary' as const, color: 'bg-blue-500' };
    };

    const criticalCount = filteredReports.filter(r => r.ai_analysis_result?.deviation_percentage > 15).length;
    const avgDeviation = filteredReports.length > 0 
        ? (filteredReports.reduce((sum, r) => sum + (r.ai_analysis_result?.deviation_percentage || 0), 0) / filteredReports.length).toFixed(1)
        : '0';

    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
                    <div className="p-3 bg-red-500/10 rounded-xl">
                        <AlertTriangle className="h-8 w-8 text-red-500" />
                    </div>
                    <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                        Compliance Violations
                    </span>
                </h1>
                <p className="text-muted-foreground text-lg">
                    Active monitoring of industries flagged for non-compliance and encroachment issues.
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                {[
                    { title: 'Total Violations', value: filteredReports.length, icon: AlertTriangle, color: 'text-red-500', bgColor: 'bg-red-500/10' },
                    { title: 'Critical Cases', value: criticalCount, icon: Shield, color: 'text-orange-500', bgColor: 'bg-orange-500/10' },
                    { title: 'Avg. Deviation', value: `${avgDeviation}%`, icon: TrendingUp, color: 'text-yellow-500', bgColor: 'bg-yellow-500/10' },
                    { title: 'Pending Action', value: filteredReports.filter(r => r.status !== 'Notice Sent').length, icon: Clock, color: 'text-blue-500', bgColor: 'bg-blue-500/10' }
                ].map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                        <Card className="border-2 hover:border-primary/50 transition-all">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                                        <p className="text-3xl font-bold mt-2">{stat.value}</p>
                                    </div>
                                    <div className={`${stat.bgColor} p-3 rounded-xl`}>
                                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Analytics Charts */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card className="border-2 hover:border-primary/50 transition-all">
                    <CardHeader>
                        <CardTitle>Violations by Severity</CardTitle>
                        <CardDescription>Distribution of violation severity levels</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer
                            config={{
                                count: { label: "Count", color: "hsl(0, 84%, 60%)" },
                            }}
                        >
                            <BarChart data={severityData}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                <XAxis dataKey="severity" className="text-xs" />
                                <YAxis className="text-xs" />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Bar dataKey="count" fill="hsl(0, 84%, 60%)" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                <Card className="border-2 hover:border-primary/50 transition-all">
                    <CardHeader>
                        <CardTitle>Violation Trend</CardTitle>
                        <CardDescription>Number of violations detected over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer
                            config={{
                                violations: { label: "Violations", color: "hsl(0, 84%, 60%)" },
                            }}
                        >
                            <LineChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                <XAxis dataKey="week" className="text-xs" />
                                <YAxis className="text-xs" />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Line type="monotone" dataKey="violations" stroke="hsl(0, 84%, 60%)" strokeWidth={3} dot={{ r: 6 }} />
                            </LineChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Search and Filter */}
            <Card className="border-2">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Violation Reports</CardTitle>
                            <CardDescription>{filteredReports.length} industries flagged for immediate action</CardDescription>
                        </div>
                        <div className="relative w-80">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search by industry name or ID..."
                                className="pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-lg border-2 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-muted/50">
                                <tr className="border-b-2">
                                    <th className="h-12 px-4 text-left align-middle font-semibold">Industry / Plot</th>
                                    <th className="h-12 px-4 text-left align-middle font-semibold">Violation Date</th>
                                    <th className="h-12 px-4 text-left align-middle font-semibold">Encroachment</th>
                                    <th className="h-12 px-4 text-left align-middle font-semibold">Risk Level</th>
                                    <th className="h-12 px-4 text-right align-middle font-semibold">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={5} className="p-8 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                            Loading violations...
                                        </div>
                                    </td></tr>
                                ) : filteredReports.length === 0 ? (
                                    <tr><td colSpan={5} className="p-8 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <Shield className="h-12 w-12 text-green-500" />
                                            <p className="font-medium">No violations found</p>
                                            <p className="text-sm text-muted-foreground">All monitored areas are currently compliant</p>
                                        </div>
                                    </td></tr>
                                ) : (
                                    filteredReports.map((report, index) => {
                                        const risk = getRiskLevel(report.ai_analysis_result?.deviation_percentage || 0);
                                        return (
                                            <motion.tr 
                                                key={report._id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                                className="border-b transition-colors hover:bg-muted/30"
                                            >
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`h-10 w-10 rounded-lg ${risk.color} flex items-center justify-center`}>
                                                            <MapPin className="h-5 w-5 text-white" />
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold">{report.industry_name || "Unknown Industry"}</div>
                                                            <div className="text-xs text-muted-foreground">ID: {report._id.substring(0, 12)}...</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-muted-foreground">
                                                    {new Date(report.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </td>
                                                <td className="p-4">
                                                    <span className="font-bold text-red-600 text-lg">
                                                        {report.ai_analysis_result?.deviation_percentage || 0}%
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <Badge variant={risk.variant} className="font-semibold">
                                                        {risk.label}
                                                    </Badge>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <Link href={`/dashboard/reports/${report._id}`}>
                                                        <Button variant="default" size="sm" className="gap-2">
                                                            View Details
                                                            <ArrowRight className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                </td>
                                            </motion.tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
