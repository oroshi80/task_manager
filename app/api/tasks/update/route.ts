import { NextApiRequest, NextApiResponse } from "next";
import redis from "@/lib/redis";

interface Task {
    id: string;
    title: string;
    description: string;
    status: string;
}

export async function PUT(req: NextApiRequest, res: NextApiResponse) {
    const { id, title, description, status }: Task = req.body;

    if (!id || !title || !description || !status) {
        return res.status(400).json({ error: "All fields (id, title, description, and status) are required." });
    }

    // Retrieve the task from Redis by ID
    const tasks = await redis.lrange("tasks", 0, -1);
    const taskIndex = tasks.findIndex((task) => JSON.parse(task as string).id === id);

    if (taskIndex === -1) {
        return res.status(404).json({ error: "Task not found" });
    }

    // Update the task
    const updatedTask = { id, title, description, status };
    tasks[taskIndex] = JSON.stringify(updatedTask);

    // Save updated task list back to Redis
    await redis.del("tasks");
    await redis.rpush("tasks", ...tasks);

    return res.status(200).json(updatedTask);
}
