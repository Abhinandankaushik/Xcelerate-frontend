'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Loader2, Upload, BoxSelect, ScanEye, Crop, Plus, Trash2 } from 'lucide-react';
import { useMap } from 'react-leaflet';

interface BlueprintControlProps {
    onBlueprintAdded: (data: any) => void;
    onOpacityChange: (opacity: number) => void;
}

export default function BlueprintControl({ onBlueprintAdded, onOpacityChange }: BlueprintControlProps) {
    const [uploading, setUploading] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [cropping, setCropping] = useState(false);

    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [currentImage, setCurrentImage] = useState<File | null>(null);

    const [coordinates, setCoordinates] = useState<string[]>(['', '']); // Start empty to force user input
    const [opacity, setOpacity] = useState([70]);
    const [analysisResult, setAnalysisResult] = useState<any>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setPreviewUrl(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleCurrentFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setCurrentImage(e.target.files[0]);
        }
    };

    const handleCropRedBorder = async () => {
        if (!file) return;
        setCropping(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('http://localhost:8000/analyze/crop-red-border', {
                method: 'POST',
                body: formData,
            });
            if (!res.ok) throw new Error('Cropping failed');
            const result = await res.json();

            // Convert base64 to file/blob
            const resLink = result.cropped_image;
            setPreviewUrl(resLink);

            // Convert base64 to File object for upload
            const fetchRes = await fetch(resLink);
            const blob = await fetchRes.blob();
            const croppedFile = new File([blob], "cropped_map.png", { type: "image/png" });
            setFile(croppedFile);

        } catch (error) {
            console.error("Crop Error:", error);
            alert("Failed to crop image. Ensure AI service is running.");
        } finally {
            setCropping(false);
        }
    };

    const handleAddCoordinate = () => {
        setCoordinates([...coordinates, '']);
    };

    const handleRemoveCoordinate = (index: number) => {
        const newCoords = [...coordinates];
        newCoords.splice(index, 1);
        setCoordinates(newCoords);
    };

    const updateCoordinate = (index: number, value: string) => {
        const newCoords = [...coordinates];
        newCoords[index] = value;
        setCoordinates(newCoords);
    };

    const handleOpacityChange = (value: number[]) => {
        setOpacity(value);
        onOpacityChange(value[0] / 100);
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error('Upload failed');
            const data = await res.json();

            // Parse coordinates
            const parsedCoords = coordinates
                .map(c => {
                    const parts = c.split(',').map(s => s.trim());
                    if (parts.length !== 2) return null;
                    const lat = parseFloat(parts[0]);
                    const lng = parseFloat(parts[1]);
                    return (isNaN(lat) || isNaN(lng)) ? null : { lat, lng };
                })
                .filter(c => c !== null) as { lat: number, lng: number }[];

            if (parsedCoords.length < 2) {
                alert("Please provide at least 2 valid 'Lat, Lng' coordinate points.");
                setUploading(false);
                return;
            }

            const lats = parsedCoords.map(c => c.lat);
            const lngs = parsedCoords.map(c => c.lng);

            // Calculate bounding box
            const minLat = Math.min(...lats);
            const maxLat = Math.max(...lats);
            const minLng = Math.min(...lngs);
            const maxLng = Math.max(...lngs);

            // Leaflet defines bounds as [[North, West], [South, East]]
            // MapComponent expects [[lat1, lng1], [lat2, lng2]]
            // We'll give Top-Left (MaxLat, MinLng) and Bottom-Right (MinLat, MaxLng)
            const bounds = [
                [maxLat, minLng], // Top Left
                [minLat, maxLng]  // Bottom Right
            ];

            onBlueprintAdded({
                url: data.url,
                bounds: bounds
            });

        } catch (error) {
            console.error(error);
            alert('Failed to upload blueprint');
        } finally {
            setUploading(false);
        }
    };

    const handleAnalyze = async () => {
        if (!file) {
            alert("Please upload and overlay a blueprint first.");
            return;
        }

        // 1. Get Bounds from coordinates
        const parsedCoords = coordinates
            .map(c => {
                const parts = c.split(',').map(s => s.trim());
                if (parts.length !== 2) return null;
                const lat = parseFloat(parts[0]);
                const lng = parseFloat(parts[1]);
                return (isNaN(lat) || isNaN(lng)) ? null : { lat, lng };
            })
            .filter(c => c !== null) as { lat: number, lng: number }[];

        if (parsedCoords.length < 2) {
            alert("Cannot analyze: No valid coordinates to define the area.");
            return;
        }

        const lats = parsedCoords.map(c => c.lat);
        const lngs = parsedCoords.map(c => c.lng);
        const minLat = Math.min(...lats);
        const maxLat = Math.max(...lats);
        const minLng = Math.min(...lngs);
        const maxLng = Math.max(...lngs);

        // Format: minLat,minLng,maxLat,maxLng
        const boundsStr = `${minLat},${minLng},${maxLat},${maxLng}`;

        // Define bounds array for saving to report
        const bounds = [
            [maxLat, minLng], // Top Left
            [minLat, maxLng]  // Bottom Right
        ];

        setAnalyzing(true);
        const formData = new FormData();
        formData.append('file', file); // The blueprint
        formData.append('bounds', boundsStr); // The area to fetch satellite image for

        try {
            const res = await fetch('http://localhost:8000/analyze/overlay', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error('Analysis failed');
            const result = await res.json();

            // Generate detailed report data (Mocking AI logic for prototype)
            const isViolation = result.changes_count > 0;
            const detailedCategories = [
                {
                    category: "Road Curvature",
                    manual_plan: "Not done/Incorrect",
                    drone_survey: isViolation ? "Identified as non-overlapping" : "Aligned",
                    field_visit: isViolation ? "Confirmed incorrect curvature" : "Verified",
                    discrepancy: isViolation ? "Major Discrepancy" : "Aligned",
                    action: isViolation ? "Update base maps with accurate road networks" : "None"
                },
                {
                    category: "Area Overlap",
                    manual_plan: "Right side did not overlap",
                    drone_survey: "Showed accurate layout",
                    field_visit: "Verified on ground",
                    discrepancy: result.deviation_percentage > 5 ? "Major Discrepancy" : "Minor Deviation",
                    action: "Update plot boundaries and overall layout."
                },
                {
                    category: "Encroachment",
                    manual_plan: "Not reflected/Unknown",
                    drone_survey: "Clear mapping of illegal uses",
                    field_visit: "Verified on ground",
                    discrepancy: result.changes_count > 0 ? "New Findings" : "None",
                    action: result.changes_count > 0 ? "Issue notice for immediate ground-truthing." : "None"
                },
                {
                    category: "Industry Status",
                    manual_plan: "Not recorded",
                    drone_survey: "Not explicitly part of drone outcome",
                    field_visit: "Identified specific units as Running(22) or Closed(8)",
                    discrepancy: "New Insight",
                    action: "Analyze reasons for closures."
                }
            ];

            // Save Report to Database
            const saveRes = await fetch('/api/reports', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    plot_id: null, // Will use mock in backend
                    satellite_image_url: result.result_image,
                    bounds: bounds, // Save bounds for time-lapse overlay
                    ai_analysis_result: {
                        encroachment_detected: isViolation,
                        deviation_percentage: result.deviation_percentage,
                        heatmap_url: result.result_image,
                        confidence_score: result.similarity_score,
                        categories: detailedCategories
                    }
                })
            });

            if (!saveRes.ok) throw new Error('Failed to save report');
            const savedReport = await saveRes.json();

            // Redirect to Report Detail Page
            window.location.href = `/dashboard/reports/${savedReport.reportId}`;

        } catch (error) {
            console.error("Analysis Error:", error);
            alert("Failed to analyze. Ensure AI service is running.");
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <Card className="w-full max-h-[calc(100vh-200px)] overflow-y-auto">
            <CardHeader>
                <CardTitle className="text-sm font-medium">Tools & Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">

                {/* Superimpose Section */}
                <div className="space-y-4 border-b pb-4">
                    <h3 className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-2">
                        <BoxSelect className="h-3 w-3" /> Superimpose
                    </h3>

                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="blueprint" className="text-xs">Reference Map / Blueprint</Label>
                        <Input id="blueprint" type="file" onChange={handleFileChange} className="h-8 text-xs" />
                        {previewUrl && (
                            <div className="relative mt-2 border rounded bg-slate-100">
                                <img src={previewUrl} alt="Preview" className="max-h-32 mx-auto" />
                                <Button size="sm" variant="secondary" className="w-full mt-1" onClick={handleCropRedBorder} disabled={cropping}>
                                    {cropping ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Crop className="h-3 w-3 mr-1" />}
                                    Auto-Crop Red Border
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs">Coordinates (lat, lng)</Label>
                        {coordinates.map((coord, index) => (
                            <div key={index} className="flex gap-2">
                                <Input
                                    placeholder="e.g. 22.97, 82.90"
                                    value={coord}
                                    onChange={(e) => updateCoordinate(index, e.target.value)}
                                    className="h-8 text-xs font-mono"
                                />
                                {coordinates.length > 1 && (
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500" onClick={() => handleRemoveCoordinate(index)}>
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                )}
                            </div>
                        ))}
                        <Button size="sm" variant="outline" className="w-full h-7 text-xs" onClick={handleAddCoordinate}>
                            <Plus className="h-3 w-3 mr-1" /> Add Point
                        </Button>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <Label className="text-xs">Opacity</Label>
                            <span className="text-xs text-muted-foreground">{opacity[0]}%</span>
                        </div>
                        <Slider value={opacity} onValueChange={handleOpacityChange} max={100} step={1} />
                    </div>

                    <Button onClick={handleUpload} disabled={!file || uploading} size="sm" className="w-full">
                        {uploading ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : <Upload className="mr-2 h-3 w-3" />}
                        Overlay Map
                    </Button>
                </div>

                {/* AI Analysis Section */}
                <div className="space-y-4">
                    <h3 className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-2">
                        <ScanEye className="h-3 w-3" /> Smart Analysis
                    </h3>

                    <div className="text-xs text-muted-foreground mb-2">
                        Analyzes the currently overlaid area against live satellite imagery.
                    </div>

                    <Button onClick={handleAnalyze} disabled={!file || analyzing} size="sm" variant="destructive" className="w-full">
                        {analyzing ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : <ScanEye className="mr-2 h-3 w-3" />}
                        Run Compliance Check
                    </Button>

                    {analysisResult && (
                        <div className="rounded-md bg-muted p-3 text-xs space-y-2 mt-2">
                            <div className="flex justify-between items-center border-b pb-2">
                                <span className="font-bold">Analysis Report</span>
                                <span className={`px-2 py-0.5 rounded text-[10px] text-white ${analysisResult.changes_count > 0 ? "bg-red-500" : "bg-green-500"}`}>
                                    {analysisResult.status}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 mt-2">
                                <div>
                                    <span className="text-muted-foreground block">Deviations</span>
                                    <span className="font-semibold text-red-600">{analysisResult.changes_count} Zones</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground block">Encroachment</span>
                                    <span className="font-semibold">{analysisResult.deviation_percentage}% Area</span>
                                </div>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Similarity Score:</span>
                                <span>{(analysisResult.similarity_score * 100).toFixed(1)}%</span>
                            </div>

                            {/*
                            <div className="flex justify-between">
                                <span className="font-semibold">Deviations Found:</span>
                                <span className={analysisResult.changes_count > 0 ? "text-red-500 font-bold" : "text-green-500"}>
                                    {analysisResult.changes_count}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-semibold">Status:</span>
                                <span>{analysisResult.status}</span>
                            </div> 
                            */}

                            {analysisResult.result_image && (
                                <div className="mt-2">
                                    <p className="mb-1 font-semibold">Visual Proof (Red = Deviation)</p>
                                    <img src={analysisResult.result_image} alt="Analysis Result" className="w-full rounded border border-red-200" />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
