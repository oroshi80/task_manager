import { NextResponse } from "next/server";
import db from "@/lib/mysql";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    // Validate if ID is provided
    if (!id) {
        return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    try {
        // Execute query to delete task
        db.query("DELETE FROM tasks WHERE id = ?", [id]);

        // Return success response
        return NextResponse.json({ message: "Task deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
    }
}
