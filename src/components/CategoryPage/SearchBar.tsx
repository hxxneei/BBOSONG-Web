// src/components/Closet/SearchBar.tsx
import styled from "styled-components";
import { Icon } from "@iconify/react";

type Props = {
  value?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  onSubmit?: () => void;
};

export default function SearchBar({
  value,
  onChange,
  placeholder = "검색어를 입력하세요.",
  onSubmit,
}: Props) {
  return (
    <CenterRow>
      <SearchBox role="search">
        <Input
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => e.key === "Enter" && onSubmit?.()}
        />
        <IconBtn aria-label="검색" onClick={onSubmit}>
          <Icon icon="mingcute:search-line" width={22} height={22} />
        </IconBtn>
      </SearchBox>
    </CenterRow>
  );
}

const CenterRow = styled.div`
  display: flex;
  justify-content: center;
  padding: 12px 16px;
`;

const SearchBox = styled.div`
  /* 가운데 위치 + 최대 너비 제어 (모바일/웹 공용) */
  position: relative;
  width: 348px;
`;

const Input = styled.input`
  width: 100%;
  height: 46px;
  border: 0;
  outline: 0;
  border-radius: 14px;
  background: #f9f9f9;

  font-size: 13px;
  color: #111827;

  box-shadow: 0 5px 4px rgba(100, 100, 100, 0.11);

  &::placeholder {
    color: #b7bfcc;
  }

  text-align: center;
  &:focus {
    text-align: left;
  }
`;

const IconBtn = styled.button`
  all: unset;
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 17px;
  height: 17px;
  color: #4b80fc;

  &:active {
    transform: translateY(-50%) scale(0.96);
  }
`;
