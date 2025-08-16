import { NextResponse } from 'next/server';

export async function GET() {
    try {
        return NextResponse.json({
            status: 'ok',
            env: {
                NODE_ENV: process.env.NODE_ENV,
                DATABASE_URL: process.env.DATABASE_URL ? 'set' : 'missing',
                NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'set' : 'missing',
                NEXTAUTH_URL: process.env.NEXTAUTH_URL,
            }
        });
    } catch (error) {
        return NextResponse.json({ error: 'Debug failed', details: error }, { status: 500 });
    }
}