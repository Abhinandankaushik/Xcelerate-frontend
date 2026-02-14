
'use client';

import { useState } from 'react';
import MapWrapper from '@/components/map/MapWrapper';
import IndustryControl from '@/components/map/IndustryControl';
import { Card, CardContent } from '@/components/ui/card';
import { Industry } from '@/data/industries'; // Keeping type

export default function MapMonitorPage() {
    const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(null);
    const [opacity, setOpacity] = useState(0.7);

    // Transform Industry data to match MapWrapper's expected BlueprintOverlay format
    const activeBlueprint = selectedIndustry ? {
        url: selectedIndustry.blueprintUrl,
        bounds: selectedIndustry.bounds
    } : null;

    return (
        <div className="flex flex-col gap-6 h-[calc(100vh-100px)]">
            <div className="flex items-center justify-between shrink-0">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight">Live Monitoring</h1>
                    <p className="text-sm text-muted-foreground">Real-time satellite surveillance and compliance verification.</p>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-4 flex-1 min-h-0">
                <div className="lg:col-span-3 flex flex-col min-h-0">
                    <Card className="flex-1 overflow-hidden border-0 shadow-lg relative rounded-xl">
                        <CardContent className="p-0 h-full">
                            <MapWrapper activeBlueprint={activeBlueprint} opacity={opacity} />
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-1 flex flex-col min-h-0">
                    <Card className="flex-1 overflow-hidden flex flex-col">
                        <CardContent className="flex-1 p-4 overflow-hidden flex flex-col">
                            <IndustryControl
                                onSelectIndustry={setSelectedIndustry}
                                selectedIndustryId={selectedIndustry?._id || selectedIndustry?.id || selectedIndustry?.name}
                                onOpacityChange={setOpacity}
                                currentOpacity={opacity}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
