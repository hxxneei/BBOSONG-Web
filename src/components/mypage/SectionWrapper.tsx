import React from "react";
import styled from "styled-components";

interface SectionWrapperProps {
  title: string;
  children: React.ReactNode;
}

export const SectionWrapper: React.FC<SectionWrapperProps> = ({
  title,
  children,
}) => {
  return (
    <Section aria-label={title}>
      <SectionTitle>{title}</SectionTitle>
      <Block>{children}</Block>
    </Section>
  );
};

const Section = styled.section`
  padding: 8px 14px;
`;

const SectionTitle = styled.h2`
  font-size: 19px;
  font-weight: 800;
  padding-bottom: 6px;
  color: #111827;
  margin: 0 16px 0px;
  border-bottom: 1px solid rgba(15, 23, 42, 0.06);
`;

const Block = styled.div`
  background: #fff;
`;
