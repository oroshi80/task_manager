"use client";
import React, { useState, useEffect, useRef } from "react";
import { Button, Kbd } from "@heroui/react";
import { FaPlus } from "react-icons/fa";
import AddTask from "@/components/AddTaskModal";
import Board from "@/components/Board";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "next-themes";

interface Tasks {
  id: number;
  title: string;
  description: string;
  status: "to-do" | "in-progress" | "done";
}

export default function Home() {
  // Consts
  const [tasks, setTasks] = useState<Tasks[]>([]); // Task state initialized properly
  const [isModalOpen, setIsModalOpen] = useState(false);
  const circleRadius = 500;
  const backgroundRef = useRef<HTMLDivElement | null>(null);
  const mousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  //theme
  const { theme } = useTheme();

  // Fetch tasks when the component mounts or when a new task is added
  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks/get");
      const data = await response.json();
      setTasks(data); // Update state with the new list of tasks
      console.log("Tasks Data: ", data);
    } catch (error) {
      toast.error(`❌ Error fetching tasks. Please try again. Error: ${error}`);
    }
  };

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []); // Fetch tasks once on component mount

  // hover effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      let SpotLight;
      if (theme === "dark") {
        SpotLight = "rgba(255, 255, 255, 0.1)";
      } else {
        SpotLight = "rgba(0, 0, 0, 0.1)";
      }
      mousePositionRef.current = { x: e.pageX, y: e.pageY };
      if (backgroundRef.current) {
        backgroundRef.current.style.background = `radial-gradient(circle ${circleRadius}px at ${mousePositionRef.current.x}px ${mousePositionRef.current.y}px, ${SpotLight} , transparent)`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [theme]);

  const handleAddTask = async (data: {
    title: string;
    description: string;
  }) => {
    try {
      toast
        .promise(
          fetch("/api/tasks/create", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: data.title,
              description: data.description,
              status: "to-do",
            }),
          }).then((response) => {
            if (!response.ok) {
              throw new Error("Failed to create task");
            }
            return response.json();
          }),
          {
            pending: "Creating task...",
            success: "Task added successfully! 🎉",
            error: "Error adding task. Please try again. ❌",
          }
        )
        .then(() => {
          fetchTasks(); // Fetch tasks after adding a new one to update state
        });
    } catch (error) {
      toast.error(`❌ Something went wrong. ${error}`);
    }
  };

  return (
    <main
      ref={backgroundRef}
      className="h-screen BG_EFFECT"
      style={{ maxHeight: "calc(100vh - 70px)" }}
    >
      <div className="flex justify-center items-center pt-5">
        <Button
          endContent={<FaPlus />}
          onPress={() => setIsModalOpen(true)}
          color="primary"
        >
          Add Task
        </Button>
      </div>
      <main className="flex justify-center items-center">
        <Board tasks={tasks} fetchTasks={fetchTasks} />{" "}
        {/* Pass fetchTasks to Board */}
      </main>
      <div className="flex justify-center items-center gap-2">
        <span className="text-lg font-semibold pb-2">
          How to use Drag n Drop
        </span>
      </div>
      <div className="flex justify-center items-center gap-2">
        <div className="flex justify-center items-center gap-2">
          Keyboard: Press <Kbd>Tab</Kbd> to select a card. Then, press{" "}
          <Kbd key="space">Space</Kbd> to pick it up. Use the arrow keys{" "}
          <Kbd keys="up" /> <Kbd keys="down" /> <Kbd keys="left" />{" "}
          <Kbd keys="right" /> to move the card. Press <Kbd>Space</Kbd> again to
          release the card, or press <Kbd key="escape">Esc</Kbd> to cancel.
        </div>
      </div>
      <div className="flex justify-center items-center gap-2">
        Mobile: Use two fingers to drag the card to a different column. To edit
        or delete a card, touch and hold the card with one finger for a few
        seconds. The edit/delete buttons will appear—touch either button to
        perform the action.
      </div>

      <AddTask
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddTask}
      />
    </main>
  );
}
