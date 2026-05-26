import React from "react";
import styled from "styled-components";
import { BaseBtn } from "../../common/BaseBtn";

interface ResultButtonGroupProps {
  onRetry: () => void;
  onSave: () => void;
}

const ResultButtonGroup: React.FC<ResultButtonGroupProps> = ({
  onRetry,
  onSave,
}) => {
  return (
    <ButtonGroup>
      <RetryBtn type="button" value="다시 검색하기" onClick={onRetry} />
      <SaveBtn type="button" value="결과 저장하기" onClick={onSave} />
    </ButtonGroup>
  );
};

export default ResultButtonGroup;

const RetryBtn = styled(BaseBtn)`
  flex: 1;
  border: none;
  background-color: #f3f4f6;
  color: #9ca3af;
  text-align: center;
  cursor: pointer;
  &:hover {
    background-color: #e5e7eb;
  }
`;

const SaveBtn = styled(BaseBtn)`
  flex: 1;
  border: none;
  background-color: #4b80fc;
  color: #fff;
  text-align: center;
  cursor: pointer;
  box-shadow: 0px 4px 14px rgba(75, 128, 252, 0.3);
  &:hover {
    background-color: #3b71f3;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  width: 100%;
  max-width: 342px;
  gap: 12px;
  margin: 10px auto 0 auto;
  padding: 0 10px;
  box-sizing: border-box;
  input {
    border-radius: 16px !important;
    height: 54px;
  }
`;
