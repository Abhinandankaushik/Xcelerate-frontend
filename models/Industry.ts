
import mongoose, { Schema, Document } from 'mongoose';

export interface IIndustry extends Document {
    name: string;
    bounds: number[][]; // [[lat, lng], [lat, lng]]
    blueprintUrl: string;
    complianceScore: number;
    progressPhotos: string[];
}

const IndustrySchema: Schema = new Schema({
    name: { type: String, required: true },
    bounds: { type: [[Number]], required: true }, // Array of arrays of numbers
    blueprintUrl: { type: String, required: true },
    complianceScore: { type: Number, default: 0 },
    progressPhotos: { type: [String], default: [] },
}, { timestamps: true });

export default mongoose.models.Industry || mongoose.model<IIndustry>('Industry', IndustrySchema);
