import { NextResponse } from "next/server";
import db from "@/lib/mysql"; // MySQL connection (promise-compatible)
import dbConnect from "@/lib/mongoDB"; // MongoDB connection


function isTaskArray(result: unknown): result is Task[] {
    return Array.isArray(result) && result.every(item => "id" in item && "title" in item);
}

export async function GET() {
    const databaseType = process.env.DATABASE; // Get database type from .env
    let tasks; // Explicitly type the tasks array

    try {
        if (databaseType === "mongoDB") {
            // MongoDB query
            const { db: mdb } = await dbConnect(); // Connect to MongoDB

            tasks = await mdb.collection("tasks").find({}).toArray(); // Fetch task

        } else if (databaseType === "MySQL") {
            // MySQL query
            const [rows] = await db.query("SELECT * FROM tasks");

            // Type guard to ensure rows is an array of Task objects
            if (isTaskArray(rows)) {
                tasks = rows; // Assign the result to tasks
            } else {
                throw new Error("Unexpected query result: expected an array of tasks");
            }
        } else {
            throw new Error("Unsupported database type in .env");
        }

        return NextResponse.json(tasks, { status: 200 });
    } catch (error) {
        console.error("Database error:", error); // Log the error for debugging
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Internal Server Error" },
            { status: 500 }
        );
    }
}