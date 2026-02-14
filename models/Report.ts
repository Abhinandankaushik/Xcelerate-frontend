import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema({
    plot_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plot',
        required: false, // Make optional since we might use industry_name
    },
    industry_name: {
        type: String,
        required: false
    },
    generated_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    survey_date: {
        type: Date,
        default: Date.now,
    },
    satellite_image_url: {
        type: String,
        required: true,
    },
    bounds: {
        type: [[Number]], // [[lat, lng], [lat, lng]]
        required: false,
    },
    ai_analysis_result: {
        encroachment_detected: Boolean,
        deviation_percentage: Number,
        heatmap_url: String,
        confidence_score: Number,
        // Detailed breakdown for the report table
        categories: [{
            category: String, // e.g., "Road Curvature", "Area Overlap"
            manual_plan: String,
            drone_survey: String,
            field_visit: String,
            discrepancy: String, // e.g., "Major Discrepancy", "New Findings"
            action: String,
        }]
    },
    status: {
        type: String,
        enum: ['Pending Review', 'Verified - Compliant', 'Verified - Violation', 'Notice Sent'],
        default: 'Pending Review',
    },
    comments: {
        type: String,
    },
}, { timestamps: true });

export default mongoose.models.Report || mongoose.model('Report', ReportSchema);
