import { NextResponse } from "next/server";
import redis from "@/lib/redis"; // Assuming you have a Redis helper

export async function GET() {

    try {
        const tasks = await redis.lrange("tasks", 0, -1); // Fetch tasks from Redis
        const parsedTasks = tasks.map((task) => JSON.parse(task as string)); // Parse the task data

        // Return the tasks as JSON response
        return NextResponse.json(parsedTasks, { status: 200 });
    } catch (error) {
        console.error(error);

        // Return error response if something went wrong
        return NextResponse.json(
            { error: "Failed to fetch tasks." },
            { status: 500 }
        );
    }
}
