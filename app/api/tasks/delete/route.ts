import { NextApiRequest, NextApiResponse } from "next";
import redis from "@/lib/redis";

interface Task {
    id: string;
}

export async function DELETE(req: NextApiRequest, res: NextApiResponse) {
    const { id }: Task = req.body;

    if (!id) {
        return res.status(400).json({ error: "Task ID is required." });
    }

    // Retrieve all tasks from Redis
    const tasks = await redis.lrange("tasks", 0, -1);
    const taskIndex = tasks.findIndex((task) => JSON.parse(task as string).id === id);

    if (taskIndex === -1) {
        return res.status(404).json({ error: "Task not found" });
    }

    // Remove the task from the array
    tasks.splice(taskIndex, 1);

    // Save updated task list back to Redis
    await redis.del("tasks");
    await redis.rpush("tasks", ...tasks);

    return res.status(200).json({ message: "Task deleted successfully" });
}
