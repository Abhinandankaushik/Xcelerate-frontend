import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Report from '@/models/Report';
import Plot from '@/models/Plot';
import User from '@/models/User';
import mongoose from 'mongoose';

// Ensure models are registered
const getModels = () => {
    // Access models to trigger registration
    return {
        Report: mongoose.models.Report || Report,
        Plot: mongoose.models.Plot || Plot,
        User: mongoose.models.User || User
    };
};

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        console.log("=== API Route Called ===");
        await dbConnect();
        console.log("DB Connected");
        
        // Ensure models are registered
        const models = getModels();
        console.log("Models registered:", Object.keys(models));
        
        const { id } = await context.params;
        console.log("Report ID:", id);

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.log("Invalid ObjectId format");
            return NextResponse.json({ error: 'Invalid report ID' }, { status: 400 });
        }

        console.log("Fetching report...");
        const report = await models.Report.findById(id)
            .populate('generated_by', 'name email')
            .populate('plot_id')
            .lean(); // Use lean for better performance

        console.log("Report found:", !!report);

        if (!report) {
            return NextResponse.json({ error: 'Report not found' }, { status: 404 });
        }

        console.log("Returning report successfully");
        return NextResponse.json(report);
    } catch (error: any) {
        console.error("=== DETAILED ERROR ===");
        console.error("Error name:", error.name);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
        return NextResponse.json({ 
            error: 'Internal Server Error',
            message: error.message || 'Unknown error',
            name: error.name || 'Unknown'
        }, { status: 500 });
    }
}
