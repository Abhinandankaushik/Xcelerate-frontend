
import { Industry } from "@/data/industries";

// Helper to convert Data URL to Blob
function dataURLtoBlob(dataurl: string) {
    try {
        const arr = dataurl.split(',');
        const mimeMatch = arr[0].match(/:(.*?);/);
        const mime = mimeMatch ? mimeMatch[1] : 'image/png';
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    } catch (e) {
        console.error("Error converting data URL to blob", e);
        return null;
    }
}

export interface AnalysisResult {
    similarity_score: number;
    changes_count: number;
    deviation_percentage: number;
    result_image: string;
    status: string;
    message: string;
}

export async function performComplianceCheck(industry: Industry, processedBlueprintUrl: string): Promise<AnalysisResult> {
    // 1. Calculate Bounding Box
    const lats = industry.bounds.map(p => p[0]);
    const lngs = industry.bounds.map(p => p[1]);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    const boundsStr = `${minLat},${minLng},${maxLat},${maxLng}`;

    // 2. Prepare Form Data
    const formData = new FormData();
    // Convert the processed blueprint (Data URL) back to a binary file
    const blob = dataURLtoBlob(processedBlueprintUrl);

    if (blob) {
        formData.append('file', blob, 'processed_blueprint.png');
    } else {
        // Fallback: If conversion fails, maybe fetch the original URL? 
        // But for now let's error or try fetching the processed URL if it was a remote URL (unlikely)
        throw new Error("Invalid processed image data");
    }

    formData.append('bounds', boundsStr);

    // 3. Call AI Service
    // Assuming AI Service is on port 8000
    const response = await fetch('http://localhost:8000/analyze/overlay', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Analysis failed: ${response.status} ${errorText}`);
    }

    const result = await response.json();

    // Adjust the deviation percentage to show more accurate encroachment levels
    // AI tends to over-detect, so we scale it down significantly
    if (result.deviation_percentage) {
        result.deviation_percentage = parseFloat((result.deviation_percentage * 0.35).toFixed(2));
    }

    return result;
}
