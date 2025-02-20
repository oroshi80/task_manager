// lib/types.d.ts

declare global {
    interface Task {
        id: number;
        title: string;
        description: string;
        status: "to-do" | "in-progress" | "done";
    }
}

export { }; 