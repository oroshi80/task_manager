import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/mysql"; // MySQL pool connection
import dbConnect from "@/lib/mongoDB"; // MongoDB connection
import { ObjectId } from "mongodb"; // Import ObjectId from mongodb

interface QueryResult {
    affectedRows: number;
}

export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
    const { id } = context.params; // Access id directly from context.params

    const databaseType = process.env.DATABASE; // Get the database type from .env

    // Validate if ID is provided
    if (!id) {
        return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    try {
        if (databaseType === "mongoDB") {
            // MongoDB query
            const { db: mdb } = await dbConnect(); // Connect to MongoDB

            // Delete task from MongoDB
            const result = await mdb.collection("tasks").deleteOne({ _id: new ObjectId(id) });

            if (result.deletedCount === 0) {
                return NextResponse.json({ error: "Task not found" }, { status: 404 });
            }

            // Return success response
            return NextResponse.json({ message: "Task deleted successfully" }, { status: 200 });
        } else if (databaseType === "MySQL") {
            // MySQL query using connection pool
            const query = "DELETE FROM tasks WHERE id = ?";
            const values = [id];

            // Execute the query using the connection pool
            const [result] = await db.execute(query, values) as QueryResult[]; // Destructure the result

            // Check affectedRows in the result
            if (result.affectedRows === 0) {
                return NextResponse.json({ error: "Task not found" }, { status: 404 });
            }

            // Return success response
            return NextResponse.json({ message: "Task deleted successfully" }, { status: 200 });
        } else {
            throw new Error("Unsupported database type in .env");
        }
    } catch (error) {
        console.error("Unexpected Error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Internal Server Error" },
            { status: 500 }
        );
    }
}
