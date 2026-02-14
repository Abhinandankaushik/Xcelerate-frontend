'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, Download, Search, Filter, Calendar, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ReportsPage() {
    const [reports, setReports] = React.useState([]);
    const [searchTerm, setSearchTerm] = React.useState('');

    React.useEffect(() => {
        const fetchReports = async () => {
            const res = await fetch('/api/reports');
            if (res.ok) {
                const data = await res.json();
                setReports(data);
            }
        };
        fetchReports();
    }, []);

    const filteredReports = reports.filter((report: any) =>
        report.industry_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report._id.includes(searchTerm)
    );

    const compliantCount = reports.filter((r: any) => r.status === 'Verified - Compliant').length;
    const violationCount = reports.filter((r: any) => r.status === 'Verified - Violation').length;
    const pendingCount = reports.filter((r: any) => r.status === 'Pending Review').length;

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'Verified - Violation':
                return { variant: 'destructive' as const, icon: AlertTriangle, color: 'bg-red-500' };
            case 'Verified - Compliant':
                return { variant: 'default' as const, icon: CheckCircle2, color: 'bg-green-500' };
            case 'Pending Review':
                return { variant: 'secondary' as const, icon: Clock, color: 'bg-yellow-500' };
            default:
                return { variant: 'secondary' as const, icon: FileText, color: 'bg-gray-500' };
        }
    };

    return (
        <div className="flex flex-col gap-6 p-6">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-xl">
                        <FileText className="h-8 w-8 text-primary" />
                    </div>
                    <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                        Compliance Reports
                    </span>
                </h1>
                <p className="text-muted-foreground text-lg">
                    Comprehensive monitoring reports with AI-powered analysis and compliance tracking
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                {[
                    { title: 'Compliant', value: compliantCount, icon: CheckCircle2, color: 'text-green-500', bgColor: 'bg-green-500/10' },
                    { title: 'Violations', value: violationCount, icon: AlertTriangle, color: 'text-red-500', bgColor: 'bg-red-500/10' },
                    { title: 'Pending Review', value: pendingCount, icon: Clock, color: 'text-yellow-500', bgColor: 'bg-yellow-500/10' }
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
                                        <p className="text-4xl font-bold mt-2">{stat.value}</p>
                                    </div>
                                    <div className={`${stat.bgColor} p-4 rounded-xl`}>
                                        <stat.icon className={`h-8 w-8 ${stat.color}`} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Main Reports Card */}
            <Card className="border-2">
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <CardTitle className="text-2xl">All Reports</CardTitle>
                            <CardDescription className="text-base mt-1">
                                {filteredReports.length} reports generated from satellite monitoring and AI analysis
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-3">
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
                            <Button variant="outline" className="gap-2">
                                <Filter className="h-4 w-4" />
                                Filter
                            </Button>
                            <Button className="gap-2 shadow-lg shadow-primary/20">
                                <Download className="h-4 w-4" />
                                Export
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {filteredReports.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                                <p className="text-lg font-medium">No reports found</p>
                                <p className="text-sm text-muted-foreground">Try adjusting your search criteria</p>
                            </div>
                        ) : (
                            filteredReports.map((report: any, index) => {
                                const statusConfig = getStatusConfig(report.status);
                                return (
                                    <motion.div
                                        key={report._id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                    >
                                        <Card 
                                            className="hover:bg-muted/30 transition-all cursor-pointer border-2 hover:border-primary/50 hover:shadow-lg group" 
                                            onClick={() => window.location.href = `/dashboard/reports/${report._id}`}
                                        >
                                            <CardContent className="p-6">
                                                <div className="flex items-center gap-6">
                                                    {/* Icon */}
                                                    <div className={`h-16 w-16 rounded-2xl ${statusConfig.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                                                        <statusConfig.icon className="h-8 w-8 text-white" />
                                                    </div>
                                                    
                                                    {/* Content */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-4">
                                                            <div className="flex-1">
                                                                <h3 className="font-bold text-lg mb-1">
                                                                    {report.industry_name || `Report ${report._id.substring(0, 8)}`}
                                                                </h3>
                                                                <p className="text-sm text-muted-foreground">
                                                                    ID: {report._id.substring(0, 16)}...
                                                                </p>
                                                            </div>
                                                            <Badge variant={statusConfig.variant} className="font-semibold text-xs px-3 py-1">
                                                                {report.status}
                                                            </Badge>
                                                        </div>
                                                        
                                                        <div className="flex items-center gap-6 mt-4 text-sm">
                                                            <div className="flex items-center gap-2">
                                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                                <span className="text-muted-foreground">
                                                                    {new Date(report.createdAt).toLocaleDateString('en-US', { 
                                                                        month: 'short', 
                                                                        day: 'numeric', 
                                                                        year: 'numeric' 
                                                                    })}
                                                                </span>
                                                            </div>
                                                            <div className="h-4 w-px bg-border" />
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-muted-foreground">Deviation:</span>
                                                                <span className={`font-bold ${
                                                                    (report.ai_analysis_result?.deviation_percentage || 0) > 5 
                                                                        ? 'text-red-600' 
                                                                        : 'text-green-600'
                                                                }`}>
                                                                    {report.ai_analysis_result?.deviation_percentage || 0}%
                                                                </span>
                                                            </div>
                                                            {report.ai_analysis_result?.confidence_score && (
                                                                <>
                                                                    <div className="h-4 w-px bg-border" />
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-muted-foreground">Confidence:</span>
                                                                        <span className="font-semibold text-primary">
                                                                            {(report.ai_analysis_result.confidence_score * 100).toFixed(0)}%
                                                                        </span>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Action Button */}
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm" 
                                                        className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                                                    >
                                                        View Details
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                );
                            })
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
