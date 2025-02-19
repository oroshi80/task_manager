import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
} from "@heroui/react";
import { useForm } from "react-hook-form";

interface TaskFormData {
  title: string;
  description: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => void;
}

export default function AddTask({ isOpen, onClose, onSubmit }: ModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormData>();
  const [isLoading, setIsLoading] = useState(false);

  const onFormSubmit = async (data: TaskFormData) => {
    setIsLoading(true);
    // Call the parent onSubmit to send the data to API
    await onSubmit(data);
    setIsLoading(false); // Stop loading once done
    onClose(); // Close the modal after submission
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        <ModalHeader>Add new task</ModalHeader>
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
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onClick={onClose}>
            Close
          </Button>
          <Button
            color="primary"
            type="submit"
            form="task-form" // Ensure the form is triggered on button click
            isLoading={isLoading}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
