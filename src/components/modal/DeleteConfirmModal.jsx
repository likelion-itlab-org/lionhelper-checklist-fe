import React from "react";
import {
  ModalOverlay,
  ModalContent,
  ModalText,
  ButtonGroup,
  ModalButton,
} from "./styles";

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalText>정말 삭제하시겠습니까?</ModalText>

        <ButtonGroup>
          <ModalButton $confirm onClick={onConfirm}>
            예
          </ModalButton>
          <ModalButton onClick={onClose}>아니오</ModalButton>
        </ButtonGroup>
      </ModalContent>
    </ModalOverlay>
  );
};

export default DeleteConfirmModal;
