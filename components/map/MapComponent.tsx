'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polygon, Popup, useMap, ImageOverlay } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { LatLngBoundsExpression } from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon.src,
    iconRetinaUrl: markerIcon2x.src,
    shadowUrl: markerShadow.src,
});

// Helper component to resize map on mount
function MapResize() {
    const map = useMap();
    useEffect(() => {
        map.invalidateSize();
    }, [map]);
    return null;
}

interface PlotData {
    _id: string;
    plot_id: string;
    owner_name: string;
    status: string;
    location: {
        coordinates: number[][][]; // GeoJSON Polygon
    };
}

interface BlueprintOverlay {
    url: string;
    bounds: LatLngBoundsExpression; // This is the polygon array of points
}

// Helper component to handle flying to bounds
function MapFlyTo({ bounds }: { bounds: LatLngBoundsExpression }) {
    const map = useMap();
    useEffect(() => {
        if (bounds) {
            // Calculate bounds from the polygon points to fly to the correct area
            const latLngBounds = L.latLngBounds(bounds as L.LatLngTuple[]);
            map.flyToBounds(latLngBounds);
        }
    }, [bounds, map]);
    return null;
}

export default function MapComponent({ activeBlueprint, opacity }: { activeBlueprint?: BlueprintOverlay | null, opacity?: number }) {
    const [mounted, setMounted] = useState(false);
    const [plots, setPlots] = useState<PlotData[]>([]);

    useEffect(() => {
        setMounted(true);
        // Fetch plots
        fetch('/api/plots')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setPlots(data);
                }
            })
            .catch(err => console.error("Failed to load plots", err));
    }, []);

    if (!mounted) {
        return <div className="h-[600px] w-full bg-muted flex items-center justify-center">Loading Map...</div>;
    }

    // Centered on Raipur, Chhattisgarh
    const center = { lat: 21.2514, lng: 81.6296 };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Allocated': return 'blue';
            case 'Vacant': return 'green';
            case 'Under Construction': return 'orange';
            case 'Operational': return 'purple';
            case 'Disputed': return 'red';
            default: return 'gray';
        }
    };

    const tileUrl = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";

    return (
        <MapContainer center={center} zoom={13} scrollWheelZoom={true} className="h-[600px] w-full rounded-lg z-0">
            <MapResize />
            {activeBlueprint && activeBlueprint.bounds && <MapFlyTo bounds={activeBlueprint.bounds} />}

            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url={tileUrl}
            />

            {activeBlueprint && (
                <ImageOverlay
                    key={activeBlueprint.url}
                    url={activeBlueprint.url}
                    // Calculate the rectangular bounding box that contains all the polygon points
                    bounds={L.latLngBounds(activeBlueprint.bounds as L.LatLngTuple[])}
                    opacity={opacity ?? 0.7}
                />
            )}

            {plots.map(plot => {
                const polygonCoords = plot.location.coordinates[0].map(coord => [coord[1], coord[0]] as [number, number]);
                return (
                    <Polygon
                        key={plot._id}
                        positions={polygonCoords}
                        pathOptions={{ color: getStatusColor(plot.status), fillOpacity: 0.1 }}
                    >
                        <Popup>
                            <div className="p-2">
                                <h3 className="font-bold">Plot: {plot.plot_id}</h3>
                                <p>Owner: {plot.owner_name}</p>
                                <p>Status: {plot.status}</p>
                            </div>
                        </Popup>
                    </Polygon>
                );
            })}
        </MapContainer>
    );
}
