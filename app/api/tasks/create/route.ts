import { NextRequest, NextResponse } from "next/server";
import redis from "@/lib/redis"; // Assuming you have a Redis helper

interface Task {
    id: string;
    title: string;
    description: string;
    status: string;
}

export async function POST(req: NextRequest) {
    try {
        const { title, description, status }: Task = await req.json(); // parse the request body

        // Validate data
        if (!title || !description || !status) {
            return NextResponse.json(
                { error: "Title, description, and status are required." },
                { status: 400 }
            );
        }

        // Generate a unique ID for the new task
        const newTask: Task = {
            id: new Date().toISOString(), // You can also use a UUID generator here
            title,
            description,
            status,
        };

        // Save the task to Redis (or your preferred storage solution)
        await redis.rpush("tasks", JSON.stringify(newTask));

        // Return success response with the created task
        return NextResponse.json(newTask, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Something went wrong while creating the task." },
            { status: 500 }
        );
    }
}
