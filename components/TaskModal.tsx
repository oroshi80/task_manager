// TaskModal.tsx
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
  id?: number | string;
  title: string;
  description: string;
  status?: "to-do" | "in-progress" | "done";
}

interface AddTaskData {
  title: string;
  description: string;
}

interface EditTaskData {
  id: number | string;
  title: string;
  description: string;
  status: "to-do" | "in-progress" | "done";
}

// Use conditional types to ensure type safety based on mode
type TaskModalProps =
  | {
      isOpen: boolean;
      onClose: () => void;
      onSubmit: (data: AddTaskData) => void | Promise<void>;
      task?: never;
      mode: "add";
      isLoading?: boolean;
    }
  | {
      isOpen: boolean;
      onClose: () => void;
      onSubmit: (data: EditTaskData) => void | Promise<void>;
      task: Task | null;
      mode: "edit";
      isLoading?: boolean;
    };

interface ModalHeaderDBProps {
  databaseType?: string;
  task: {
    id: string | number;
    title: string;
  };
}

const ModalHeaderDB: React.FC<ModalHeaderDBProps> = ({
  databaseType,
  task,
}) => {
  return (
    <>
      {databaseType === "mongoDB" ? `#${task.id} - ${task.title}` : task.title}
    </>
  );
};

const databaseType = process.env.DATABASE;

export default function TaskModal({
  isOpen,
  onClose,
  onSubmit,
  task,
  mode,
  isLoading: externalLoading,
}: Readonly<TaskModalProps>) {
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
      : {
          title: "",
          description: "",
          status: "to-do",
        },
  });

  const [internalLoading, setInternalLoading] = useState(false);
  const isLoadingState = externalLoading ?? internalLoading;

  // Reset form when modal opens or task changes
  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && task) {
        reset({
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.status,
        });
      } else {
        reset({
          title: "",
          description: "",
          status: "to-do",
        });
      }
    }
  }, [isOpen, task, mode, reset]);

  const onFormSubmit = async (data: TaskFormData): Promise<void> => {
    setInternalLoading(true);
    try {
      if (mode === "edit" && task) {
        // For edit mode, ensure all required fields are present
        const editData: EditTaskData = {
          id: task.id,
          title: data.title,
          description: data.description,
          status: data.status || task.status,
        };
        await Promise.resolve(
          (onSubmit as (data: EditTaskData) => void | Promise<void>)(editData)
        );
      } else {
        // For add mode, only send title and description
        const addData: AddTaskData = {
          title: data.title,
          description: data.description,
        };
        await Promise.resolve(
          (onSubmit as (data: AddTaskData) => void | Promise<void>)(addData)
        );
      }
      onClose(); // Close the modal after submission
    } catch (err) {
      console.error("Submission failed", err);
    } finally {
      setInternalLoading(false);
    }
  };

  if (!isOpen) return null;

  // For edit mode, don't render if task is null
  if (mode === "edit" && !task) return null;

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        <ModalHeader>
          {mode === "add" ? (
            "Add new task"
          ) : (
            <ModalHeaderDB databaseType={databaseType} task={task!} />
          )}
        </ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit(onFormSubmit)} id="task-form">
            <div className="flex flex-col gap-4">
              <div>
                <label>
                  Task Title
                  <Input
                    {...register("title", { required: "Title is required" })}
                    placeholder="Enter task title"
                  />
                </label>
                {errors.title && <span>{errors.title.message}</span>}
              </div>

              <div>
                <label>
                  Task Description
                  <Textarea
                    {...register("description", {
                      required: "Description is required",
                    })}
                    placeholder="Enter task description"
                  />
                </label>
                {errors.description && (
                  <span>{errors.description.message}</span>
                )}
              </div>

              {/* Only show status selector in edit mode */}
              {mode === "edit" && task && (
                <div>
                  <label>
                    Task Status
                    <Select
                      {...register("status", {
                        required: "Status is required",
                      })}
                      defaultSelectedKeys={[task.status]}
                    >
                      <SelectItem key="to-do">To Do</SelectItem>
                      <SelectItem key="in-progress">In Progress</SelectItem>
                      <SelectItem key="done">Done</SelectItem>
                    </Select>
                  </label>
                  {errors.status && <span>{errors.status.message}</span>}
                </div>
              )}
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
            isLoading={isLoadingState}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
