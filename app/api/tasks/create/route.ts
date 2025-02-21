import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/mysql"; // MySQL connection
import dbConnect from "@/lib/mongoDB"; // MongoDB connection
import { ResultSetHeader } from "mysql2"; // Import the correct type from the MySQL library

export async function POST(req: NextRequest) {
    const databaseType = process.env.DATABASE; // Get the database type from .env
    const body = await req.json();
    const { title, description } = body;

    // Validation for title and description
    if (!title || !description) {
        return NextResponse.json(
            { error: "Title and description are required." },
            { status: 400 }
        );
    }

    try {
        if (databaseType === "mongoDB") {
            // MongoDB query
            const { db: mdb } = await dbConnect(); // Connect to MongoDB

            // Insert task into MongoDB
            const result = await mdb.collection("tasks").insertOne({
                title,
                description,
                status: "to-do", // Default status
            });

            // Return the created task
            return NextResponse.json(
                { id: result.insertedId, title, description, status: "to-do" },
                { status: 201 }
            );
        } else if (databaseType === "MySQL") {
            // MySQL query using connection pool (returns a Promise)
            const query = "INSERT INTO tasks (title, description, status) VALUES (?, ?, ?)";
            const values = [title, description, "to-do"];

            // Execute the query using the connection pool
            const [result] = await db.execute(query, values); // Wait for result

            // Type assertion for the result
            const resultSet = result as ResultSetHeader;

            return NextResponse.json(
                { id: resultSet.insertId, title, description, status: "to-do" },
                { status: 201 }
            );
        } else {
            throw new Error("Unsupported database type in .env");
        }
    } catch (error) {
        console.error("Unexpected Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
