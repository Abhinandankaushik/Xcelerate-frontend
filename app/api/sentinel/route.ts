
import { NextRequest, NextResponse } from 'next/server';

const CLIENT_ID = 'ff26b4c0-f191-4269-b119-a5cad34de28b';
const CLIENT_SECRET = 'J6LrduWXjSA9RN3P29XNGjbLflfaPUns';

let cachedToken: string | null = null;
let tokenExpiry: number = 0;

async function getAccessToken() {
    if (cachedToken && Date.now() < tokenExpiry) {
        return cachedToken;
    }

    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', CLIENT_ID);
    params.append('client_secret', CLIENT_SECRET);

    try {
        const res = await fetch('https://services.sentinel-hub.com/oauth/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params
        });

        if (!res.ok) {
            const error = await res.text();
            throw new Error(`Failed to get token: ${error}`);
        }

        const data = await res.json();
        cachedToken = data.access_token;
        tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; // Buffer 1 min
        return cachedToken;
    } catch (error) {
        console.error('Sentinel Auth Error:', error);
        throw error;
    }
}

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const bbox = searchParams.get('bbox'); // minX,minY,maxX,maxY
    const time = searchParams.get('time'); // e.g., 2026-01-01/2026-01-31

    if (!bbox || !time) {
        return NextResponse.json({ error: 'Missing bbox or time parameter' }, { status: 400 });
    }

    try {
        const token = await getAccessToken();

        // Construct WMS URL
        // Using Sentinel-2 L2A (Atmospherically Corrected)
        const wmsUrl = `https://services.sentinel-hub.com/ogc/wms/b2a76f2f-1246-4cb4-9d47-6902271811e8`;

        // Note: The UUID above is a standard public instance or we can use the token directly with the base URL.
        // Better: Use Process API or simple WMS with auth header.
        // Sentinel Hub WMS with OAuth token requires standard WMS endpoint.

        const wmsParams = new URLSearchParams({
            SERVICE: 'WMS',
            REQUEST: 'GetMap',
            LAYERS: 'TRUE-COLOR-L2A', // or B04,B03,B02 for True Color
            MAXCC: '20', // Max cloud cover 20%
            TIME: time,
            BBOX: bbox,
            WIDTH: '512',
            HEIGHT: '512',
            FORMAT: 'image/jpeg',
            CRS: 'EPSG:4326',
        });

        const response = await fetch(`${wmsUrl}?${wmsParams.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            // Fallback for empty results or errors
            return NextResponse.json({ error: 'Failed to fetch image from Sentinel' }, { status: response.status });
        }

        const imageBuffer = await response.arrayBuffer();

        return new NextResponse(imageBuffer, {
            headers: {
                'Content-Type': 'image/jpeg',
                'Cache-Control': 'public, max-age=86400'
            }
        });

    } catch (error) {
        console.error('Sentinel API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
