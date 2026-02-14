
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, ScanEye, Building2, RefreshCw, Wand2 } from 'lucide-react';
import { Industry, INDUSTRIES } from '@/data/industries';
import { processBlueprintImage } from '@/lib/process-image';
import { performComplianceCheck, AnalysisResult } from '@/lib/analysis';
import { FileText } from 'lucide-react';

// Extend AnalysisResult to include optional reportId
interface ExtendedAnalysisResult extends AnalysisResult {
    reportId?: string;
}

interface IndustryControlProps {
    onSelectIndustry: (industry: Industry) => void;
    selectedIndustryId?: string;
    onOpacityChange: (opacity: number) => void;
    currentOpacity: number;
}

export default function IndustryControl({ onSelectIndustry, selectedIndustryId, onOpacityChange, currentOpacity }: IndustryControlProps) {
    const router = useRouter();
    const [industries, setIndustries] = useState<Industry[]>([]);
    const [loading, setLoading] = useState(true);
    const [analyzing, setAnalyzing] = useState(false);
    const [processingImage, setProcessingImage] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<ExtendedAnalysisResult | null>(null);

    const fetchIndustries = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            setIndustries(INDUSTRIES);
        } catch (error) {
            console.error("Failed to load industries:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIndustries();
    }, []);

    const handleSelect = async (industry: Industry) => {
        setProcessingImage(true);
        setAnalysisResult(null); // Clear previous results
        try {
            console.log("Processing image for", industry.name);
            const processedUrl = await processBlueprintImage(industry.blueprintUrl);

            const industryWithProcessedImage = {
                ...industry,
                blueprintUrl: processedUrl
            };

            onSelectIndustry(industryWithProcessedImage);
        } catch (error) {
            console.error("Error selecting industry:", error);
            onSelectIndustry(industry);
        } finally {
            setProcessingImage(false);
        }
    };

    const handleAnalyze = async (industry: Industry) => {
        setAnalyzing(true);
        setAnalysisResult(null);
        try {
            // Use the currently overlaid image (which should be processed)
            // But we need to make sure we use the same URL we passed to onSelectIndustry
            // If the industry object here doesn't have the processed URL, we might need to re-process or store it.
            // However, handleSelect updates the parent, but 'industry' here comes from the mapping of 'industries' state which is static.

            // Re-process to be safe/consistent or use a cache. 
            // For now, let's re-process quickly (it might be cached by browser if it was a GET, but here it's an AI call).
            // Better: Store processed URL in local state? No, let's just call process again or pass the processed one.
            // Actually, waiting for process again is safer to ensure we have the clean image data URL.

            const processedUrl = await processBlueprintImage(industry.blueprintUrl); // Get the data URL
            const result = await performComplianceCheck(industry, processedUrl);

            setAnalysisResult(result);
            let savedReportId: string | undefined;

            // Auto-save report
            try {
                const saveResponse = await fetch('/api/reports', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ai_analysis_result: result,
                        bounds: industry.bounds,
                        industry_name: industry.name,
                        // Passing static data as much as possible
                        plot_id: undefined, // Let API use mock
                    })
                });

                if (saveResponse.ok) {
                    const data = await saveResponse.json();
                    setAnalysisResult(prev => prev ? { ...prev, reportId: data.reportId } : null);
                    savedReportId = data.reportId;
                }
            } catch (err) {
                console.error("Failed to save report automatically", err);
            }

            // Redirect to report if ID exists
            if (savedReportId) {
                router.push(`/dashboard/reports/${savedReportId}`);
            }

        } catch (error) {
            console.error("Analysis failed", error);
            // Mock result on failure for demo if AI service is down
            const mockResult = {
                status: "Error",
                changes_count: 0,
                deviation_percentage: 0,
                similarity_score: 0,
                result_image: "",
                message: "Analysis service unavailable"
            };
            setAnalysisResult(mockResult);
        } finally {
            setAnalyzing(false);
        }
    };

    const handleViewReport = (reportId: string) => {
        router.push(`/dashboard/reports/${reportId}`);
    };

    const handleOpacityChange = (value: number[]) => {
        onOpacityChange(value[0] / 100);
    };

    return (
        <Card className="h-full flex flex-col border-none shadow-none bg-transparent">
            {/* Header */}
            <CardHeader className="px-0 pt-0 pb-4">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-blue-600" />
                        Industrial Zones
                    </CardTitle>
                    <Button variant="ghost" size="icon" onClick={fetchIndustries} title="Reload Data">
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
                <CardDescription>Select an industry to monitor.</CardDescription>
            </CardHeader>

            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : (
                <ScrollArea className="flex-1 -mx-2 px-2">
                    <div className="space-y-3 pb-4">
                        {industries.map((industry) => (
                            <div
                                key={industry.name}
                                onClick={() => !processingImage && handleSelect(industry)}
                                className={`
                                    cursor-pointer rounded-lg border p-3 transition-all hover:bg-accent
                                    ${selectedIndustryId === (industry._id || industry.id || industry.name) ? 'bg-accent border-blue-500 ring-1 ring-blue-500' : 'bg-card'}
                                    ${processingImage ? 'opacity-50 pointer-events-none' : ''}
                                `}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-semibold text-sm">{industry.name}</h3>
                                    {selectedIndustryId === (industry._id || industry.id || industry.name) && processingImage && (
                                        <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                                    )}
                                </div>

                                {selectedIndustryId === (industry._id || industry.id || industry.name) && !processingImage && (
                                    <div className="mt-3 pt-3 border-t space-y-3">
                                        <div className="text-xs text-green-600 flex items-center gap-1 mb-2">
                                            <Wand2 className="h-3 w-3" />
                                            AI Enhanced Overlay Active
                                        </div>
                                        <Button
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAnalyze(industry);
                                            }}
                                            disabled={analyzing}
                                            className="w-full"
                                            variant={analyzing ? "secondary" : "default"}
                                        >
                                            {analyzing ? (
                                                <>
                                                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                                                    Generating Report...
                                                </>
                                            ) : (
                                                <>
                                                    <ScanEye className="mr-2 h-3 w-3" />
                                                    Run Compliance Check
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            )}

            {/* Opacity Control at Bottom */}
            <div className="pt-4 mt-2 border-t px-1">
                <div className="flex justify-between mb-2">
                    <span className="text-xs font-semibold text-muted-foreground">Map Overlay Opacity</span>
                    <span className="text-xs font-bold">{(currentOpacity * 100).toFixed(0)}%</span>
                </div>
                <Slider
                    value={[currentOpacity * 100]}
                    onValueChange={handleOpacityChange}
                    max={100}
                    step={1}
                    className="cursor-pointer"
                />
            </div>
        </Card>
    );
}
