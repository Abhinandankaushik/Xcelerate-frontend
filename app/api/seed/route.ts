
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Industry from '@/models/Industry';
import { INDUSTRIES } from '@/data/industries'; // Import hardcoded data for seeding

export async function GET() {
    try {
        await dbConnect();

        // Clear existing data (optional, or just update)
        // await Industry.deleteMany({});

        for (const ind of INDUSTRIES) {
            // Upsert: Update if exists, Insert if not
            await Industry.findOneAndUpdate(
                { name: ind.name },
                {
                    $set: {
                        bounds: ind.bounds,
                        blueprintUrl: ind.blueprintUrl,
                        progressPhotos: ind.progressPhotos,
                        complianceScore: ind.complianceScore
                    }
                },
                { upsert: true, new: true }
            );
        }

        return NextResponse.json({ message: 'Database refreshed and seeded successfully', count: INDUSTRIES.length });
    } catch (error) {
        console.error("Seeding error:", error);
        return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
    }
}
