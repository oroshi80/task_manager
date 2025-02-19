// app/api/tasks/get/route.ts
import { NextResponse } from 'next/server';
import db from '@/lib/mysql';

export async function GET() {
    const query = 'SELECT * FROM tasks';

    return new Promise((resolve) => {
        db.query(query, (err, rows) => {
            if (err) {
                return resolve(NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 }));
            }
            return resolve(NextResponse.json(rows, { status: 200 }));
        });
    });
}
