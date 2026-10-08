import styled from "styled-components";

export const BaseBtn = styled.button`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 1vh;
  border: 0.8px solid #000;
  background-color: #fff;
  color: #000;
  border-radius: 15px;
  padding: 14px 16px;
  font-size: 14px;
  font-weight: 700;
  font-family: inherit;
  outline: none;
  box-sizing: border-box;
  cursor: pointer;

  &:focus-visible {
    border: 1px solid #767676;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;
