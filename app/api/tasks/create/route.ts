import db from "@/lib/mysql";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { title, description } = body;

        if (!title || !description) {
            return NextResponse.json(
                { error: "Title and description are required." },
                { status: 400 }
            );
        }

        const query = "INSERT INTO tasks (title, description, status) VALUES (?, ?, ?)";
        const values = [title, description, "to-do"];

        return new Promise((resolve) => {
            db.query(query, values, (err, result) => {
                if (err) {
                    console.error("MySQL Insert Error:", err);
                    return resolve(
                        NextResponse.json({ error: "Failed to create task" }, { status: 500 })
                    );
                }

                return resolve(
                    NextResponse.json(
                        { id: result.insertId, title, description, status: "to-do" }, // MySQL auto-generates ID
                        { status: 201 }
                    )
                );
            });
        });
    } catch (error) {
        console.error("Unexpected Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
