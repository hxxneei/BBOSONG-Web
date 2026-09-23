import styled from "styled-components";
import type { LucideIcon } from "lucide-react";

type Props = {
  title: string;
  icon: LucideIcon;
};

const IconTitle = ({ title, icon: SectionIcon }: Props) => {
  return (
    <Wrap>
      <h2>{title}</h2>
      <SectionIcon size={30} color="#4B80FC" />
    </Wrap>
  );
};

export default IconTitle;

const Wrap = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 5px;

  color: #111827;

  h2 {
    font-size: 24px;
    font-weight: 700;
  }
`;
