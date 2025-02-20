// In your `api/tasks/update/[id].ts`
import { NextApiRequest, NextApiResponse } from "next";
import redis from "@/lib/redis";

export async function PUT(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    const { title, description, status } = req.body;

    if (!title || !description || !status) {
        return res.status(400).json({ error: "Title, description, and status are required." });
    }

    const updatedTask = { id, title, description, status };

    // Find and update the task in Redis
    const tasks = await redis.lrange("tasks", 0, -1);
    const taskIndex = tasks.findIndex((task) => JSON.parse(task as string).id === id);

    if (taskIndex !== -1) {
        await redis.lset("tasks", taskIndex, JSON.stringify(updatedTask));
        return res.status(200).json(updatedTask);
    }

    return res.status(404).json({ error: "Task not found." });
}
