import React from "react";
import styled from "styled-components";
import { ChevronRight } from "lucide-react";

interface InfoRowProps {
  icon: React.ReactNode;
  label?: string;
  value?: React.ReactNode;
  hint?: string;
  onClick?: () => void;
}

export const InfoRow: React.FC<InfoRowProps> = ({
  icon,
  label,
  value,
  hint,
  onClick,
}) => {
  const clickable = Boolean(onClick);
  return (
    <Row
      as={clickable ? "button" : "div"}
      onClick={onClick}
      aria-label={label}
      $clickable={clickable}
    >
      <LeftWrap>
        {icon && <IconWrap>{icon}</IconWrap>}
        <Label>{label}</Label>
      </LeftWrap>
      <RightWrap>
        {value && <Value>{value}</Value>}
        {hint && <Hint>{hint}</Hint>}
        {clickable && <ChevronRight size={18} aria-hidden />}
      </RightWrap>
    </Row>
  );
};

const Row = styled.div<{ $clickable?: boolean }>`
  width: 100%;
  min-height: 52px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid rgba(15, 23, 42, 0.06);
  background: #fff;
  ${(p) => p.$clickable && `cursor:pointer;`}
  &:first-child {
    border-top: 0;
  }
  &:active {
    ${(p) => p.$clickable && "background: rgba(0,0,0,.03);"}
  }
`;

const LeftWrap = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
`;

const RightWrap = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #374151;
`;

const IconWrap = styled.span`
  width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
`;

const Label = styled.span`
  font-size: 15px;
  color: #111827;
`;

const Value = styled.span`
  font-size: 14px;
  color: #2563eb; // blue like the mockup
`;

const Hint = styled.span`
  font-size: 12px;
  color: #9ca3af;
`;
