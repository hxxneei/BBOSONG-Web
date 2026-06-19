import React from "react";
import styled from "styled-components";
import RequiredMark from "../../assets/SignupPage/RequiredMark.svg";
import CheckIcon from "../../assets/SignupPage/CheckIcon.svg";

interface IdFieldProps {
  label: string;
  placeholder: string;
  type?: string;
  showCheckBtn?: boolean;
  errorText?: string;
  subText?: string;
  defaultValue?: string;
  onCheck?: () => void;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const IdField: React.FC<IdFieldProps> = ({
  label,
  placeholder,
  type = "text",
  showCheckBtn = false,
  errorText,
  subText,
  defaultValue,
  value,
  onChange,
  onCheck,
}) => {
  return (
    <InputGroupContainer>
      {/* 라벨 영역 */}
      <LabelRow>
        <Label>{label}</Label>
        <RequiredImg src={RequiredMark} alt="필수" />
      </LabelRow>

      {/* 입력 영역 (중복확인 버튼 포함 여부) */}
      <InputRow>
        <StyledInput
          type={type}
          placeholder={placeholder}
          defaultValue={defaultValue}
          value={value}
          onChange={onChange}
        />
        {showCheckBtn && (
          <CheckButton type="button" onClick={onCheck}>
            중복 확인
          </CheckButton>
        )}
      </InputRow>

      {/* 에러 텍스트 (아이콘 포함) */}
      {errorText && (
        <MessageRow>
          <img src={CheckIcon} alt="느낌표" style={{ width: "9px" }} />
          <ErrorText>{errorText}</ErrorText>
        </MessageRow>
      )}

      {/* 보조 안내 텍스트 */}
      {subText && <SubText>{subText}</SubText>}
    </InputGroupContainer>
  );
};

export default IdField;

const InputGroupContainer = styled.div`
  width: 100%;
  max-width: 340px;
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
  padding: 2px;
`;

const LabelRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

const Label = styled.label`
  font-size: 15px;
  font-weight: 700;
`;

const RequiredImg = styled.img`
  width: 6px;
  height: 6px;
  margin-left: 4px;
  position: relative;
  top: -1px;
  object-fit: contain;
`;

const InputRow = styled.div`
  display: flex;
  gap: 9px;
`;

const StyledInput = styled.input`
  flex: 1;
  border: 1px solid #999;
  border-radius: 20px;
  padding: 14px 16px;
  font-size: 14px;
  background-color: #fff;
  color: #000;
  outline: none;
  transition: border-color 0.2s ease;

  &::placeholder {
    color: #767676;
    font-weight: 400;
  }

  &:focus {
    border: 1px solid #767676;
  }
`;

const CheckButton = styled.button`
  background-color: #000000;
  color: white;
  border: none;
  border-radius: 15px;
  padding: 0 14px;
  font-size: 12px;
  cursor: pointer;
  white-space: nowrap; /* 글자 줄바꿈 방지 */

  &:hover {
    background-color: #b3b3b3;
  }
`;

const MessageRow = styled.div`
  display: flex;
  align-items: center;
  margin-top: 5px;
  padding: 0 11px;
`;

const ErrorText = styled.p`
  color: #fd5b4a;
  font-size: 9px;
  font-weight: 500;
  margin-left: 4px;
`;

const SubText = styled.p`
  color: #888;
  font-size: 9.5px;
  margin-top: 1px;
  padding: 0 11px;
  font-weight: 400;
`;

