
'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, Download, AlertTriangle, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { INDUSTRIES } from '@/data/industries';
import RiskAssessment from '@/components/reports/RiskAssessment';

export default function ReportDetailPage() {
    const params = useParams();
    const [report, setReport] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [timelineIndex, setTimelineIndex] = useState(2);

    useEffect(() => {
        const fetchReport = async () => {
            if (!params.id) return;
            try {
                const res = await fetch(`/api/reports/${params.id}`);
                if (!res.ok) {
                    const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
                    console.error('API Error:', res.status, errorData);
                    throw new Error(`Failed to fetch report: ${res.status}`);
                }
                const data = await res.json();
                setReport(data);
            } catch (error) {
                console.error('Fetch Report Error:', error);
                setReport(null);
            } finally {
                setLoading(false);
            }
        };
        fetchReport();
    }, [params.id]);

    if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>;
    if (!report) return <div className="p-8">Report not found</div>;

    const analysis = report.ai_analysis_result;
    const categories = analysis.categories || [];

    // Generate 12 months timeline with Real Sentinel-2 API
    const generateTimeline = () => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentYear = new Date().getFullYear();

        let bbox = '';
        if (report.bounds && report.bounds.length === 2 && Array.isArray(report.bounds[0])) {
            // report.bounds is [[lat, lng], [lat, lng]]
            const lats = [report.bounds[0][0], report.bounds[1][0]];
            const lngs = [report.bounds[0][1], report.bounds[1][1]];
            // Sentinel WMS bbox: minX,minY,maxX,maxY (lng,lat,lng,lat)
            bbox = `${Math.min(...lngs)},${Math.min(...lats)},${Math.max(...lngs)},${Math.max(...lats)}`;
        }

        return months.map((month, index) => {
            // Labels based on index for demo continuity
            let label = 'Clear Land';
            let statusColor = 'text-green-500';

            if (index >= 4 && index < 8) {
                label = 'Foundation Work';
                statusColor = 'text-amber-500';
            } else if (index >= 8) {
                label = 'Structure Detected';
                statusColor = 'text-red-500';
            }

            const monthNum = String(index + 1).padStart(2, '0');
            // Default to static image
            let url = report.satellite_image_url || analysis.heatmap_url;

            if (bbox) {
                // Fetch real Sentinel-2 image for that month in 2024 (Historical Data)
                const year = 2024;
                url = `/api/sentinel?bbox=${bbox}&time=${year}-${monthNum}-01/${year}-${monthNum}-28`;
            }

            return {
                date: `${month} ${currentYear}`,
                label: label,
                statusColor: statusColor,
                url: url
            };
        });
    };

    const timelineImages = generateTimeline();
    const currentImage = timelineImages[timelineIndex];

    console.log("Report Data:", report);
    console.log("Static Industries:", INDUSTRIES);

    // Find industry from static data
    // Priority: 1. Exact Name match 2. Bounds match (approx)
    let industryData = INDUSTRIES.find(ind => ind.name === report.industry_name || (report.plot_id && report.plot_id.name === ind.name));

    if (!industryData && report.bounds && report.bounds.length > 0) {
        // Fallback: Try to match by bounds (check if first point matches roughly)
        // This helps for old reports that have bounds but no name
        const rLat = report.bounds[0][0];
        const rLng = report.bounds[0][1];
        industryData = INDUSTRIES.find(ind => {
            const iLat = ind.bounds[0][0];
            const iLng = ind.bounds[0][1];
            return Math.abs(rLat - iLat) < 0.0001 && Math.abs(rLng - iLng) < 0.0001;
        });
    }

    console.log("Matched Industry:", industryData);

    // Fallback progress photos if found
    const progressPhotos = industryData?.progressPhotos || (report.plot_id?.progressPhotos) || [];



    return (
        <div className="space-y-6 max-w-6xl mx-auto p-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Link href="/dashboard/reports">
                        <Button variant="outline" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Compliance Analysis Report</h1>
                        <p className="text-muted-foreground text-sm">Report ID: {report._id} • Date: {new Date(report.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Badge className="text-lg px-4 py-1" variant={report.status.includes('Violation') ? 'destructive' : 'default'}>
                        {report.status}
                    </Badge>

                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Visual Proof */}
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-lg">Satellite Evidence</CardTitle>
                        <CardDescription>AI-detected deviations highlighted in red box.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-lg overflow-hidden border">
                            <img src={analysis.heatmap_url} alt="Evidence" className="w-full h-auto object-cover" />
                        </div>
                        <div className="mt-4 space-y-2">
                            <div className="flex justify-between text-sm border-b pb-2">
                                <span>Total Encroachment Area</span>
                                <span className="font-bold text-red-600">{analysis.deviation_percentage}%</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Detailed Analysis Table */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-lg">Detailed Discrepancy Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Category</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Drone Survey / AI</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Recommended Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.map((cat: any, i: number) => (
                                        <tr key={i} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="p-4 font-medium">{cat.category}</td>
                                            <td className="p-4 text-muted-foreground">{cat.drone_survey}</td>
                                            <td className="p-4">
                                                <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${cat.discrepancy.includes('Major') || cat.discrepancy.includes('New') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                                    }`}>
                                                    {cat.discrepancy.includes('Major') || cat.discrepancy.includes('New') ? <AlertTriangle className="h-3 w-3 mr-1" /> : <CheckCircle className="h-3 w-3 mr-1" />}
                                                    {cat.discrepancy}
                                                </div>
                                            </td>
                                            <td className="p-4 text-muted-foreground">{cat.action}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Progress Monitoring Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Loader2 className="h-5 w-5 text-primary" /> Construction Progress Monitoring
                    </CardTitle>
                    <CardDescription>
                        Visual comparison of site development over time using verified progress photos.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {progressPhotos.length >= 2 ? (
                        <div className="space-y-6">
                            {/* Side-by-Side Comparison */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <div className="relative rounded-xl overflow-hidden border shadow-sm aspect-video bg-muted">
                                        <img
                                            src={progressPhotos[0]}
                                            alt="Previous State"
                                            className="w-full h-full object-contain"
                                        />
                                        <div className="absolute top-2 left-2 bg-black/60 text-white px-3 py-1 rounded text-xs backdrop-blur-md border border-white/10 uppercase font-bold">
                                            Previous State
                                        </div>
                                    </div>
                                    <p className="text-xs text-center text-muted-foreground">Baseline Reference Image</p>
                                </div>

                                <div className="space-y-2">
                                    <div className="relative rounded-xl overflow-hidden border shadow-sm aspect-video bg-muted">
                                        <img
                                            src={progressPhotos[1]}
                                            alt="Current State"
                                            className="w-full h-full object-contain"
                                        />
                                        <div className="absolute top-2 right-2 bg-blue-600/90 text-white px-3 py-1 rounded text-xs backdrop-blur-md border border-white/10 uppercase font-bold">
                                            Current Status
                                        </div>
                                    </div>
                                    <p className="text-xs text-center text-muted-foreground">Latest Site Inspection</p>
                                </div>
                            </div>

                            {/* Progress Analysis Table */}
                            <div className="rounded-md border bg-card">
                                <div className="bg-muted/50 px-4 py-3 border-b">
                                    <h4 className="text-sm font-semibold">Development Progress Analysis</h4>
                                </div>
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="h-10 px-4 text-left font-medium text-muted-foreground w-1/4">Feature</th>
                                            <th className="h-10 px-4 text-left font-medium text-muted-foreground w-1/4">Previous State</th>
                                            <th className="h-10 px-4 text-left font-medium text-muted-foreground w-1/4">Current State</th>
                                            <th className="h-10 px-4 text-left font-medium text-muted-foreground w-1/4">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b hover:bg-muted/30">
                                            <td className="p-4 font-medium">Land Clearing</td>
                                            <td className="p-4 text-muted-foreground">Vegetation present</td>
                                            <td className="p-4">Cleared / Leveled</td>
                                            <td className="p-4"><Badge variant="default" className="bg-green-600">Completed</Badge></td>
                                        </tr>
                                        <tr className="border-b hover:bg-muted/30">
                                            <td className="p-4 font-medium">Foundation Work</td>
                                            <td className="p-4 text-muted-foreground">Not Started</td>
                                            <td className="p-4">Pilling / Excavation Visible</td>
                                            <td className="p-4"><Badge variant="secondary" className="bg-blue-100 text-blue-700">In Progress</Badge></td>
                                        </tr>
                                        <tr className="hover:bg-muted/30">
                                            <td className="p-4 font-medium">Structure Erection</td>
                                            <td className="p-4 text-muted-foreground">Vacant</td>
                                            <td className="p-4 text-muted-foreground">No vertical structure</td>
                                            <td className="p-4"><Badge variant="outline">Pending</Badge></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground bg-muted/20 rounded-lg border-2 border-dashed">
                            <Loader2 className="h-10 w-10 mb-4 opacity-20" />
                            <h3 className="text-lg font-semibold">Insufficient Progress Data</h3>
                            <p className="max-w-sm mt-2">
                                Progress photos are not available for this industrial unit. Please update the industry details with valid progress imagery.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Environmental Risk Assessment */}
            {report.bounds && report.bounds.length > 0 && (
                <RiskAssessment bounds={report.bounds} />
            )}
        </div>
    );
}
