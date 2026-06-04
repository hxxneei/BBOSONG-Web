import styled from "styled-components";
import { memo, useCallback } from "react";
import CategoryCard from "./Card";
import IconTitle from "./IconTitle";

type Item = {
  icon: string;
  label: string;
};

type Props = {
  title: string;
  icon: string;
  items: Item[];
  onItemClick: (label: string) => void;
};

const CategorySection = ({ title, icon, items, onItemClick }: Props) => {
  const handleItemClick = useCallback(
    (label: string) => {
      onItemClick(label);
    },
    [onItemClick],
  );

  return (
    <Section>
      <IconTitle title={title} icon={icon} />
      <Grid>
        {items.map((item) => (
          <CategoryCard
            key={item.label}
            icon={item.icon}
            label={item.label}
            onClick={() => handleItemClick(item.label)}
          />
        ))}
      </Grid>
    </Section>
  );
};

export default memo(CategorySection);

const Section = styled.div`
  &:not(:first-of-type) {
    margin-top: 36px;
  }

  margin-bottom: 0px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
`;
