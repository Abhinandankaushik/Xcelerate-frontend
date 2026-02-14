import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Plot from '@/models/Plot';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const plots = await Plot.find({});
        return NextResponse.json(plots);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch plots' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        // @ts-ignore
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const body = await req.json();
        const plot = await Plot.create(body);
        return NextResponse.json(plot, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create plot' }, { status: 500 });
    }
}
