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
        <ValueHintWrap>
          {value && <Value>{value}</Value>}
          {(hint || clickable) && (
            <BottomRow>
              {hint && <Hint>{hint}</Hint>}
              {clickable && <ChevronRight size={18} aria-hidden="true" />}
            </BottomRow>
          )}
        </ValueHintWrap>
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

  gap: 8x;
  color: #767676;
`;

const IconWrap = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #767676;
`;

const Label = styled.span`
  font-size: 16px;
  color: #767676;
`;

const Value = styled.span`
  font-size: 14px;
  color: #2563eb; // blue like the mockup
`;

const ValueHintWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const Hint = styled.span`
  font-size: 12px;
  color: #767676;
`;
const BottomRow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px; /* '변경하기'와 '>' 사이 간격 */
  margin-top: 2px; /* 위의 value와 살짝 띄우기 */
`;
