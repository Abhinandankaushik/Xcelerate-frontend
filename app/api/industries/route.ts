
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Industry from '@/models/Industry';

export async function GET() {
    try {
        await dbConnect();
        const industries = await Industry.find({});
        return NextResponse.json(industries);
    } catch (error) {
        console.error("Fetch error:", error);
        return NextResponse.json({ error: 'Failed to fetch industries' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const industry = await Industry.create(body);
        return NextResponse.json(industry, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create industry' }, { status: 500 });
    }
}
