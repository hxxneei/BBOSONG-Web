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
  padding: 16px 0;
`;

const SectionTitle = styled.h2`
  font-size: 14px;
  font-weight: 700;
  color: #111827;
  margin: 0 16px 10px;
`;

const Block = styled.div`
  background: #fff;
  border-top: 1px solid rgba(15, 23, 42, 0.06);
  border-bottom: 1px solid rgba(15, 23, 42, 0.06);
`;
