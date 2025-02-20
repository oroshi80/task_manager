import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  isLoading: boolean; // Add isLoading as a prop
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  title,
  isLoading,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isDismissable={false}>
      <ModalContent>
        <ModalHeader>Confirm Deletion - {title}</ModalHeader>
        <ModalBody>
          <p>
            Are you sure you want to delete this task? This action cannot be
            undone.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onPress={onClose}>
            Cancel
          </Button>
          <Button
            color="danger"
            onPress={onConfirm}
            isLoading={isLoading} // Pass the isLoading state to show loading indicator
          >
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmDeleteModal;
