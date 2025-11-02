import styled from "styled-components";

type ButtonProps = {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
  className?: string;
};

export default function Button({
  label,
  onClick,
  variant = "primary",
  className,
}: ButtonProps) {
  if (variant === "secondary") {
    return (
      <SecondaryBtn onClick={onClick} className={className}>
        {label}
      </SecondaryBtn>
    );
  }
  return (
    <PrimaryBtn onClick={onClick} className={className}>
      {label}
    </PrimaryBtn>
  );
}

const BaseBtn = styled.button`
  height: 61px;
  width: 327px;
  border-radius: 16px;
  border: none;
  cursor: pointer;
  font-size: 18px;
`;

const PrimaryBtn = styled(BaseBtn)`
  background: #4b80fc;
  color: #ffffff;
  font-weight: 500;
  box-shadow: 0 3px 8px rgba(75, 128, 252, 0.4);

  &:active {
    opacity: 0.85;
  }
`;

const SecondaryBtn = styled(BaseBtn)`
  background: #efefef;
  color: #aeaeae;
  font-weight: 500;

  box-shadow: 0 4px 8px rgba(232, 232, 232, 0.8);

  &:active {
    opacity: 0.9;
  }
`;
