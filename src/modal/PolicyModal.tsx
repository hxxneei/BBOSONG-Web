import React from "react";
import styled from "styled-components";

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: React.ReactNode;
}

const PolicyModal: React.FC<PolicyModalProps> = ({
  isOpen,
  onClose,
  title,
  content,
}) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <Title>{title}</Title>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>
        <ModalBody>{content}</ModalBody>
        <ConfirmButton onClick={onClose}>확인</ConfirmButton>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default PolicyModal;

/* --- Styled Components --- */
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
`;

const ModalContainer = styled.div`
  width: 90%;
  max-width: 350px;
  background: white;
  border-radius: 20px;
  padding: 24px;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 700;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
`;

const ModalBody = styled.div`
  font-size: 13px;
  line-height: 1.6;
  color: #333;
  max-height: 350px;
  overflow-y: auto;
  white-space: pre-wrap;

  strong {
    color: #000;
    display: block;
    margin-top: 10px;
  }
`;

const ConfirmButton = styled.button`
  margin-top: 24px;
  width: 100%;
  height: 48px;
  background: #4b80fc;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
`;
