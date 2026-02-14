
export async function processBlueprintImage(imageUrl: string): Promise<string> {
    try {
        // 1. Fetch the image from the URL
        const response = await fetch(imageUrl);
        const blob = await response.blob();

        // 2. Prepare form data
        const formData = new FormData();
        formData.append('file', blob, 'blueprint.png');

        // 3. Send to AI service
        // Assuming AI service is running on port 8000
        const aiResponse = await fetch('http://localhost:8000/analyze/crop-red-border', {
            method: 'POST',
            body: formData,
        });

        if (!aiResponse.ok) {
            throw new Error(`AI Service failed: ${aiResponse.statusText}`);
        }

        const data = await aiResponse.json();

        // 4. Return the processed image (data URL)
        return data.cropped_image;
    } catch (error) {
        console.error("Failed to process blueprint:", error);
        // Fallback to original URL if processing fails
        return imageUrl;
    }
}
