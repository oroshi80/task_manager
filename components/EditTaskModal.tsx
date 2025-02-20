import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
} from "@heroui/react";
import { useForm } from "react-hook-form";

interface TaskFormData {
  id: number;
  title: string;
  description: string;
  status: "to-do" | "in-progress" | "done";
}

interface EditTaskProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => void;
  task: Task | null; // Receive task object
  isLoading: boolean;
}

export default function EditTask({
  isOpen,
  onClose,
  onSubmit,
  task,
  isLoading,
}: EditTaskProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TaskFormData>({
    defaultValues: task
      ? {
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.status,
        }
      : {}, // Set default values
  });

  const [isEditLoading, setIsEditLoading] = useState(false);

  useEffect(() => {
    if (isOpen && task) {
      reset({
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
      }); // Reset form values
    }
  }, [isOpen, task, reset]);

  const onFormSubmit = async (data: TaskFormData) => {
    setIsEditLoading(true);
    await onSubmit(data); // Call the parent onSubmit to send the data to API
    setIsEditLoading(false); // Stop loading once done
    onClose(); // Close the modal after submission
  };

  if (!isOpen || !task) return null; // Early return if task is null or modal is closed

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        <ModalHeader>
          Edit Task #{task.id} - {task.title}
        </ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit(onFormSubmit)} id="task-form">
            <div className="flex flex-col gap-4">
              <div>
                <label>Task Title</label>
                <Input
                  {...register("title", { required: "Title is required" })}
                  placeholder="Enter task title"
                />
                {errors.title && <span>{errors.title.message}</span>}
              </div>

              <div>
                <label>Task Description</label>
                <Textarea
                  {...register("description", {
                    required: "Description is required",
                  })}
                  placeholder="Enter task description"
                />
                {errors.description && (
                  <span>{errors.description.message}</span>
                )}
              </div>

              <div>
                <label>Task Status</label>
                <Select
                  {...register("status", { required: "Status is required" })}
                  value={task.status} // Ensure the correct status is selected
                >
                  <SelectItem key="to-do">To Do</SelectItem>
                  <SelectItem key="in-progress">In Progress</SelectItem>
                  <SelectItem key="done">Done</SelectItem>
                </Select>
                {errors.status && <span>{errors.status.message}</span>}
              </div>
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Close
          </Button>
          <Button
            color="primary"
            type="submit"
            form="task-form"
            isLoading={isEditLoading}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
