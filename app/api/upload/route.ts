import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = `${uuidv4()}_${file.name.replace(/\s/g, '_')}`;
        const uploadDir = path.join(process.cwd(), 'public/uploads');

        // Ensure directory exists
        try {
            await require('fs').promises.mkdir(uploadDir, { recursive: true });
        } catch (e) {
            // Ignore if exists
        }

        try {
            await writeFile(path.join(uploadDir, filename), buffer);
        } catch (error) {
            // Fallback or detailed error logging
            console.error("Error saving file:", error);
            return NextResponse.json({ error: 'Failed to save file' }, { status: 500 });
        }

        const fileUrl = `/uploads/${filename}`;
        return NextResponse.json({ url: fileUrl }, { status: 201 });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
