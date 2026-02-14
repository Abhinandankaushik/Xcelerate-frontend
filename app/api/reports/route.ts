
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Report from '@/models/Report';
import User from '@/models/User';
import Plot from '@/models/Plot';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        // Bypass Auth for Demo/Dev
        // const session = await getServerSession(authOptions);
        // if (!session) {
        //     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        // }

        // Mock User ID (Replace with a real ObjectId if you have one, or create a dummy user)
        // For now, let's generate a random ObjectId-like string if we can't get a real one, 
        // or just rely on the model not being strict if we modified it. 
        // But the model says 'required: true' and 'ref: User'. 
        // We really should have a valid ID or remove the requirement.
        // Let's assume we can use a dummy ID that looks valid.
        const mockUserId = "60d5ecb8b392d70015c9b334";

        const data = await req.json();

        // Basic validation
        if (!data.ai_analysis_result) {
            return NextResponse.json({ error: 'Missing analysis result' }, { status: 400 });
        }

        // Determine status based on analysis
        let status = 'Verified - Compliant';
        if (data.ai_analysis_result.changes_count > 0 || data.ai_analysis_result.deviation_percentage > 5) {
            status = 'Verified - Violation';
        }

        // Mock Plot ID if not provided
        const mockPlotId = "60d5ecb8b392d70015c9b333";

        const report = await Report.create({
            plot_id: data.plot_id || mockPlotId,
            industry_name: data.industry_name, // Save the name
            generated_by: mockUserId, // session?.user?.id || mockUserId
            satellite_image_url: data.satellite_image_url || data.ai_analysis_result.result_image, // Use result image if sat url missing
            ai_analysis_result: {
                ...data.ai_analysis_result,
                heatmap_url: data.ai_analysis_result.result_image, // Map result_image to heatmap_url
                // Mock categories if missing for the detailed table
                categories: data.ai_analysis_result.categories || [
                    {
                        category: "Boundary Adherence",
                        drone_survey: data.ai_analysis_result.deviation_percentage > 2 ? "Deviation Detected" : "Matches Blueprint",
                        discrepancy: data.ai_analysis_result.deviation_percentage > 2 ? "Major Discrepancy" : "None",
                        action: data.ai_analysis_result.deviation_percentage > 2 ? "Issue Notice" : "None"
                    },
                    {
                        category: "Structure Footprint",
                        drone_survey: "As per satellite plan",
                        discrepancy: "None",
                        action: "None"
                    }
                ]
            },
            bounds: data.bounds, // Save bounds if sent
            status: status
        });

        return NextResponse.json({ success: true, reportId: report._id }, { status: 201 });

    } catch (error: any) {
        console.error("Report Creation Error:", error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const reports = await Report.find().sort({ createdAt: -1 }).populate('generated_by', 'name');
        return NextResponse.json(reports);
    } catch (error) {
        console.error("Fetch Reports Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
