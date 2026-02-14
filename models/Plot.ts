import mongoose from 'mongoose';

const PlotSchema = new mongoose.Schema({
    plot_id: {
        type: String,
        required: true,
        unique: true,
    },
    owner_name: {
        type: String,
        required: true,
    },
    allotted_date: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['Allocated', 'Vacant', 'Under Construction', 'Operational', 'Disputed'],
        default: 'Allocated',
    },
    location: {
        type: {
            type: String,
            enum: ['Polygon'],
            required: true,
        },
        coordinates: {
            type: [[[Number]]], // Array of arrays of arrays of numbers
            required: true,
        },
    },
    area_sqm: {
        type: Number,
        required: true,
    },
    blueprint_url: {
        type: String, // URL to the uploaded blueprint image
    },
    blueprint_coordinates: {
        // Stores the corner coordinates for image overlay [TopLeft, TopRight, BottomRight, BottomLeft]
        type: [[Number]],
        default: [],
    },
}, { timestamps: true });

PlotSchema.index({ location: '2dsphere' });

export default mongoose.models.Plot || mongoose.model('Plot', PlotSchema);
