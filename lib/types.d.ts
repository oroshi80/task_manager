// lib/types.d.ts

declare global {
    interface Task {
        id: string | number; // Can be a string (_id from MongoDB) or a number (MySQL)
        _id?: string; // Only for MongoDB, optional
        title: string;
        description: string;
        status: "to-do" | "in-progress" | "done";
    }
}

export { }; 