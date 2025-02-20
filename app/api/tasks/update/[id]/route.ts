// In your `api/tasks/update/[id].ts`
import db from "@/lib/mysql"; // Make sure this is the correct import
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params; // Get the `id` from the params
    const { title, description, status } = await req.json(); // Parse the JSON body

    // Validate the input
    if (!title || !description || !status) {
        return NextResponse.json({ error: "Title, description, and status are required." }, { status: 400 });
    }

    try {
        // Update task in the database directly using your db module
        const result = await db.execute(
            "UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?",
            [title, description, status, id]
        );


        // Return the updated task
        return NextResponse.json({ id, title, description, status });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
