import { Icon } from "@iconify/react";
import styled from "styled-components";

type Props = {
  title: string;
  icon: string;
};

const IconTitle = ({ title, icon }: Props) => {
  return (
    <Wrap>
      <h2>{title}</h2>
      <Icon icon={icon} width="30" height="30" color="#4B80FC" />
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
