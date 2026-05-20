import styled from "styled-components";

export const BaseBtn = styled.input`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 1vh;
  border: 0.8px solid #000;
  background-color: #fff;
  color: #000;
  border-radius: 15px;
  padding: 14px 16px;
  font-size: 14px;
  font-weight: 600;
  outline: none;
  box-sizing: border-box;

  &::placeholder {
    color: #767676;
    font-weight: 400;
  }

  &:focus {
    border: 1px solid #767676;
  }
`;
