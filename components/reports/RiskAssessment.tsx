
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Zap, Factory, Trash2, AlertTriangle, ShieldCheck, Info } from 'lucide-react';

interface RiskAssessmentProps {
    bounds: number[][]; // [[lat, lng], ...]
}

interface RiskNode {
    id: number;
    lat: number;
    lon: number;
    tags: {
        name?: string;
        power?: string;
        industrial?: string;
        man_made?: string;
        amenity?: string;
        landuse?: string;
        [key: string]: string | undefined;
    };
    category: 'Energy' | 'Chemical' | 'Waste';
}

export default function RiskAssessment({ bounds }: RiskAssessmentProps) {
    const [risks, setRisks] = useState<RiskNode[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRisks = async () => {
            if (!bounds || bounds.length === 0) {
                setLoading(false);
                return;
            }

            try {
                // Calculate center of bounds
                const lats = bounds.map(p => p[0]);
                const lngs = bounds.map(p => p[1]);
                const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
                const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;
                const radius = 5000; // 5km radius

                // Overpass QL Query with timeout
                const query = `
                    [out:json][timeout:15];
                    (
                      node["power"="plant"](around:${radius},${centerLat},${centerLng});
                      way["power"="plant"](around:${radius},${centerLat},${centerLng});
                      
                      node["industrial"~"chemical|textile|tannery"](around:${radius},${centerLat},${centerLng});
                      way["industrial"~"chemical|textile|tannery"](around:${radius},${centerLat},${centerLng});
                      node["man_made"="works"](around:${radius},${centerLat},${centerLng});
                      way["man_made"="works"](around:${radius},${centerLat},${centerLng});

                      node["amenity"="waste_disposal"](around:${radius},${centerLat},${centerLng});
                      way["landuse"="landfill"](around:${radius},${centerLat},${centerLng});
                      node["landuse"="landfill"](around:${radius},${centerLat},${centerLng});
                    );
                    out center;
                `;

                // Create fetch with timeout
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

                const response = await fetch('https://overpass-api.de/api/interpreter', {
                    method: 'POST',
                    body: query,
                    signal: controller.signal,
                    headers: {
                        'Content-Type': 'text/plain',
                    }
                }).finally(() => clearTimeout(timeoutId));

                if (!response.ok) {
                    throw new Error(`API returned ${response.status}`);
                }

                const data = await response.json();
                const processedRisks: RiskNode[] = [];

                if (data.elements && Array.isArray(data.elements)) {
                    data.elements.forEach((el: any) => {
                        let category: RiskNode['category'] | undefined;

                        if (el.tags?.power === 'plant') category = 'Energy';
                        else if (el.tags?.industrial && /chemical|textile|tannery/.test(el.tags.industrial)) category = 'Chemical';
                        else if (el.tags?.man_made === 'works') category = 'Chemical';
                        else if (el.tags?.amenity === 'waste_disposal' || el.tags?.landuse === 'landfill') category = 'Waste';

                        if (category && (el.lat || el.center?.lat)) {
                            processedRisks.push({
                                id: el.id,
                                lat: el.lat || el.center?.lat,
                                lon: el.lon || el.center?.lon,
                                tags: el.tags,
                                category
                            });
                        }
                    });
                }

                setRisks(processedRisks);

            } catch (err: any) {
                console.error('Risk assessment fetch error:', err);
                if (err.name === 'AbortError') {
                    setError("Request timed out. Environmental risk data temporarily unavailable.");
                } else {
                    setError("Unable to load environmental risk data at this time. This feature requires an external API connection.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchRisks();
    }, [bounds]);

    const getRiskLevel = (count: number) => {
        if (count === 0) return { label: 'Low Risk', color: 'text-green-600', bg: 'bg-green-100', icon: ShieldCheck };
        if (count < 3) return { label: 'Moderate Risk', color: 'text-yellow-600', bg: 'bg-yellow-100', icon: AlertTriangle };
        return { label: 'High Risk', color: 'text-red-600', bg: 'bg-red-100', icon: AlertTriangle };
    };

    const energyRisks = risks.filter(r => r.category === 'Energy');
    const chemicalRisks = risks.filter(r => r.category === 'Chemical');
    const wasteRisks = risks.filter(r => r.category === 'Waste');

    const renderRiskSection = (title: string, items: RiskNode[], icon: React.ElementType, description: string) => {
        const level = getRiskLevel(items.length);
        const Icon = icon;

        return (
            <div className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-full bg-muted`}>
                            <Icon className="h-5 w-5 text-foreground" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-sm">{title}</h4>
                            <p className="text-xs text-muted-foreground">{items.length} facilities detected</p>
                        </div>
                    </div>
                    <Badge variant="outline" className={`${level.bg} ${level.color} border-none`}>
                        {level.label}
                    </Badge>
                </div>

                <p className="text-xs text-muted-foreground bg-muted/30 p-2 rounded border border-muted/50">
                    <Info className="h-3 w-3 inline mr-1" />
                    {description}
                </p>

                {items.length > 0 && (
                    <div className="space-y-2 mt-2">
                        {items.slice(0, 3).map(item => (
                            <div key={item.id} className="text-xs flex justify-between border-b pb-1 last:border-0 last:pb-0">
                                <span className="font-medium truncate max-w-[180px]">{item.tags.name || "Unnamed Facility"}</span>
                                <span className="text-muted-foreground">
                                    {item.tags.fuel || item.tags.industrial || item.tags.man_made || " Facility"}
                                </span>
                            </div>
                        ))}
                        {items.length > 3 && <p className="text-xs text-center text-muted-foreground pt-1">+ {items.length - 3} more</p>}
                    </div>
                )}
            </div>
        );
    };

    if (loading) return (
        <Card>
            <CardHeader><CardTitle>Environmental Risk Assessment</CardTitle></CardHeader>
            <CardContent className="flex justify-center p-8"><Loader2 className="animate-spin" /></CardContent>
        </Card>
    );

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    <CardTitle>Environmental Risk Assessment (5km Radius)</CardTitle>
                </div>
                <CardDescription>
                    Automated scan of potential "Big Polluter" activities using public infrastructure data.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {error ? (
                    <Alert className="border-amber-200 bg-amber-50">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                        <AlertTitle className="text-amber-800">Environmental Data Unavailable</AlertTitle>
                        <AlertDescription className="text-amber-700">
                            {error}
                            <br />
                            <span className="text-xs text-muted-foreground">This is an optional feature and does not affect compliance reports.</span>
                        </AlertDescription>
                    </Alert>
                ) : risks.length === 0 ? (
                    <Alert className="border-green-200 bg-green-50">
                        <ShieldCheck className="h-4 w-4 text-green-600" />
                        <AlertTitle className="text-green-800">No Significant Risks Detected</AlertTitle>
                        <AlertDescription className="text-green-700">
                            No major polluting facilities identified within a 5km radius of this location.
                        </AlertDescription>
                    </Alert>
                ) : (
                    <div className="grid md:grid-cols-3 gap-4">
                        {renderRiskSection(
                            "Energy Sector",
                            energyRisks,
                            Zap,
                            "Potential High NOx/SOx & PM emissions. Coal/Thermal plants are major contributors."
                        )}
                        {renderRiskSection(
                            "Heavy Industry",
                            chemicalRisks,
                            Factory,
                            "Risk of effluent discharge (heavy metals, dyes) into local water bodies."
                        )}
                        {renderRiskSection(
                            "Waste & Landfills",
                            wasteRisks,
                            Trash2,
                            "Potential for groundwater contamination via leachate runoff."
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
