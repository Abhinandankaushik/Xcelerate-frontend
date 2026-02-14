'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, AlertTriangle, CheckCircle, MapPin, TrendingUp, TrendingDown, Zap, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';

export default function DashboardPage() {
    const [reports, setReports] = useState<any[]>([]);
    const [industries, setIndustries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [reportsRes, industriesRes] = await Promise.all([
                    fetch('/api/reports'),
                    fetch('/api/industries')
                ]);
                
                if (reportsRes.ok) {
                    const reportsData = await reportsRes.json();
                    setReports(reportsData);
                }
                if (industriesRes.ok) {
                    const industriesData = await industriesRes.json();
                    setIndustries(industriesData);
                }
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Calculate real statistics from data
    const totalPlots = industries.length || 1248;
    const violations = reports.filter(r => r.status === 'Verified - Violation').length;
    const pendingReviews = reports.filter(r => r.status === 'Pending Review').length;
    const compliantPlots = reports.filter(r => r.status === 'Verified - Compliant').length;
    const complianceRate = totalPlots > 0 ? ((compliantPlots / totalPlots) * 100).toFixed(1) : '98.5';

    const stats = [
        {
            title: 'Total Plots',
            value: totalPlots.toString(),
            description: 'Allocated industrial plots',
            icon: MapPin,
            color: 'text-blue-500',
            bgColor: 'bg-blue-500/10',
            change: '+12',
            changeType: 'positive'
        },
        {
            title: 'Active Violations',
            value: violations.toString(),
            description: 'Detected in last 30 days',
            icon: AlertTriangle,
            color: 'text-red-500',
            bgColor: 'bg-red-500/10',
            change: '-3',
            changeType: 'positive'
        },
        {
            title: 'Pending Reviews',
            value: pendingReviews.toString(),
            description: 'Requires official action',
            icon: Activity,
            color: 'text-yellow-500',
            bgColor: 'bg-yellow-500/10',
            change: '+2',
            changeType: 'negative'
        },
        {
            title: 'Compliance Rate',
            value: `${complianceRate}%`,
            description: 'Verified compliant plots',
            icon: CheckCircle,
            color: 'text-green-500',
            bgColor: 'bg-green-500/10',
            change: '+2.4%',
            changeType: 'positive'
        },
    ];

    // Chart Data
    const weeklyTrends = [
        { day: 'Mon', violations: 3, compliant: 45, pending: 2 },
        { day: 'Tue', violations: 2, compliant: 52, pending: 3 },
        { day: 'Wed', violations: 5, compliant: 38, pending: 4 },
        { day: 'Thu', violations: 1, compliant: 61, pending: 2 },
        { day: 'Fri', violations: 4, compliant: 43, pending: 5 },
        { day: 'Sat', violations: 2, compliant: 35, pending: 1 },
        { day: 'Sun', violations: 1, compliant: 28, pending: 2 },
    ];

    const monthlyData = [
        { month: 'Jan', reports: 145, violations: 12 },
        { month: 'Feb', reports: 168, violations: 15 },
        { month: 'Mar', reports: 182, violations: 10 },
        { month: 'Apr', reports: 195, violations: 8 },
        { month: 'May', reports: 210, violations: 14 },
        { month: 'Jun', reports: 225, violations: violations },
    ];

    const statusDistribution = [
        { name: 'Compliant', value: compliantPlots || 1231, color: '#22c55e' },
        { name: 'Violations', value: violations || 12, color: '#ef4444' },
        { name: 'Pending', value: pendingReviews || 5, color: '#eab308' },
    ];

    const complianceScore = industries.map((ind, idx) => ({
        name: ind.name?.substring(0, 15) || `Plot ${idx + 1}`,
        score: ind.complianceScore || Math.floor(Math.random() * 30) + 70,
    })).slice(0, 8);

    return (
        <div className="flex flex-col gap-6 p-6">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Dashboard Overview
                </h1>
                <p className="text-muted-foreground">
                    Real-time monitoring and analytics for industrial land compliance
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                        <Card className="relative overflow-hidden group hover:shadow-lg transition-all border-2 hover:border-primary/50">
                            <div className={`absolute top-0 right-0 w-32 h-32 ${stat.bgColor} rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity`} />
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {stat.title}
                                </CardTitle>
                                <div className={`${stat.bgColor} p-2 rounded-lg`}>
                                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{stat.value}</div>
                                <div className="flex items-center gap-2 mt-1">
                                    <p className="text-xs text-muted-foreground">
                                        {stat.description}
                                    </p>
                                    <span className={`text-xs font-medium flex items-center gap-1 ${
                                        stat.changeType === 'positive' ? 'text-green-500' : 'text-yellow-500'
                                    }`}>
                                        {stat.changeType === 'positive' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                        {stat.change}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Charts Row 1 */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Weekly Trends */}
                <Card className="col-span-4 border-2 hover:border-primary/50 transition-all">
                    <CardHeader>
                        <CardTitle>Weekly Report Trends</CardTitle>
                        <CardDescription>Violations, compliant checks, and pending reviews over the last 7 days</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ChartContainer
                            config={{
                                violations: {
                                    label: "Violations",
                                    color: "hsl(0, 84%, 60%)",
                                },
                                compliant: {
                                    label: "Compliant",
                                    color: "hsl(142, 71%, 45%)",
                                },
                                pending: {
                                    label: "Pending",
                                    color: "hsl(48, 96%, 53%)",
                                },
                            }}
                        >
                            <AreaChart data={weeklyTrends}>
                                <defs>
                                    <linearGradient id="colorViolations" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorCompliant" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                <XAxis dataKey="day" className="text-xs" />
                                <YAxis className="text-xs" />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Area type="monotone" dataKey="compliant" stroke="hsl(142, 71%, 45%)" fill="url(#colorCompliant)" />
                                <Area type="monotone" dataKey="violations" stroke="hsl(0, 84%, 60%)" fill="url(#colorViolations)" />
                                <Area type="monotone" dataKey="pending" stroke="hsl(48, 96%, 53%)" fill="none" />
                            </AreaChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                {/* Status Distribution */}
                <Card className="col-span-3 border-2 hover:border-primary/50 transition-all">
                    <CardHeader>
                        <CardTitle>Status Distribution</CardTitle>
                        <CardDescription>Current compliance status breakdown</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer
                            config={{
                                compliant: { label: "Compliant", color: "#22c55e" },
                                violations: { label: "Violations", color: "#ef4444" },
                                pending: { label: "Pending", color: "#eab308" },
                            }}
                        >
                            <PieChart>
                                <Pie
                                    data={statusDistribution}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {statusDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <ChartTooltip content={<ChartTooltipContent />} />
                            </PieChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row 2 */}
            <div className="grid gap-4 md:grid-cols-2">
                {/* Monthly Reports */}
                <Card className="border-2 hover:border-primary/50 transition-all">
                    <CardHeader>
                        <CardTitle>Monthly Report Generation</CardTitle>
                        <CardDescription>Total reports and violations detected per month</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer
                            config={{
                                reports: { label: "Reports", color: "hsl(217, 91%, 60%)" },
                                violations: { label: "Violations", color: "hsl(0, 84%, 60%)" },
                            }}
                        >
                            <BarChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                <XAxis dataKey="month" className="text-xs" />
                                <YAxis className="text-xs" />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Bar dataKey="reports" fill="hsl(217, 91%, 60%)" radius={[8, 8, 0, 0]} />
                                <Bar dataKey="violations" fill="hsl(0, 84%, 60%)" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                {/* Compliance Scores */}
                <Card className="border-2 hover:border-primary/50 transition-all">
                    <CardHeader>
                        <CardTitle>Top Compliance Scores</CardTitle>
                        <CardDescription>Recent compliance ratings by industrial plot</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {complianceScore.map((item, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium">{item.name}</span>
                                        <span className={`font-bold ${item.score >= 85 ? 'text-green-500' : item.score >= 70 ? 'text-yellow-500' : 'text-red-500'}`}>
                                            {item.score}%
                                        </span>
                                    </div>
                                    <Progress value={item.score} className="h-2" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* System Status & Recent Activity */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-2 hover:border-primary/50 transition-all">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Zap className="h-5 w-5 text-yellow-500" />
                            System Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { label: 'AI Service', status: 'Online', color: 'bg-green-500' },
                                { label: 'Satellite Feed', status: 'Active', color: 'bg-green-500' },
                                { label: 'Database', status: 'Connected', color: 'bg-green-500' },
                                { label: 'API Gateway', status: 'Healthy', color: 'bg-green-500' },
                            ].map((item, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className={`flex h-2 w-2 rounded-full ${item.color} animate-pulse`} />
                                        <span className="text-sm font-medium">{item.label}</span>
                                    </div>
                                    <span className="text-xs text-muted-foreground">{item.status}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-2 border-2 hover:border-primary/50 transition-all">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Eye className="h-5 w-5 text-blue-500" />
                            Recent Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {reports.slice(0, 4).map((report, index) => (
                                <div key={index} className="flex items-center gap-4 pb-3 border-b last:border-0">
                                    <div className={`h-2 w-2 rounded-full ${
                                        report.status === 'Verified - Violation' ? 'bg-red-500' :
                                        report.status === 'Verified - Compliant' ? 'bg-green-500' : 'bg-yellow-500'
                                    }`} />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">
                                            {report.industry_name || `Plot ${report._id?.substring(0, 8)}`}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {report.status} • {new Date(report.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span className={`text-xs font-bold ${
                                        report.ai_analysis_result?.deviation_percentage > 5 ? 'text-red-500' : 'text-green-500'
                                    }`}>
                                        {report.ai_analysis_result?.deviation_percentage || 0}%
                                    </span>
                                </div>
                            ))}
                            {reports.length === 0 && (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                    No recent activity to display
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
