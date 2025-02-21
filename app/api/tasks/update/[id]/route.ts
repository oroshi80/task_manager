import db from "@/lib/mysql"; // MySQL pool connection
import dbConnect from "@/lib/mongoDB"; // MongoDB connection
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb"; // Import ObjectId from mongodb

interface QueryResult {
    affectedRows: number;
}

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
    // Await the params object
    const { id } = await context.params;
    const { title, description, status } = await req.json(); // Parse the JSON body

    // Validate input fields
    if (!title || !description || !status) {
        return NextResponse.json(
            { error: "Title, description, and status are required." },
            { status: 400 }
        );
    }

    const databaseType = process.env.DATABASE; // Get the database type from .env

    try {
        if (databaseType === "mongoDB") {
            // MongoDB query
            const { db: mdb } = await dbConnect(); // Connect to MongoDB

            // Update task in MongoDB
            const result = await mdb
                .collection("tasks")
                .updateOne({ _id: new ObjectId(id) }, { $set: { title, description, status } });

            if (result.modifiedCount === 0) {
                return NextResponse.json({ error: "Task not found" }, { status: 404 });
            }

            return NextResponse.json({ id, title, description, status });

        } else if (databaseType === "MySQL") {
            // MySQL query using connection pool
            const query = "UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?";
            const values = [title, description, status, id];

            // Execute the query using the connection pool
            const [result] = await db.execute(query, values) as QueryResult[];

            if ((result).affectedRows === 0) {
                return NextResponse.json({ error: "Task not found" }, { status: 404 });
            }

            return NextResponse.json({ id, title, description, status });

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
