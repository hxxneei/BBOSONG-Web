import styled from "styled-components";
import { memo, useCallback } from "react";
import ClothCard, { type ClothCardItem } from "./ClothCard";

export type ClothGridItem = ClothCardItem & {
  onToggleFavorite?: () => void;
};

interface ClothGridProps {
  items: ClothGridItem[];
  onItemClick: (clothesId: number) => void;
}

function ClothGrid({ items, onItemClick }: ClothGridProps) {
  const handleCardClick = useCallback(
    (clothesId: number) => {
      onItemClick(clothesId);
    },
    [onItemClick],
  );

  return (
    <Grid>
      {items.map((cloth) => (
        <CardWrapper key={cloth.id} onClick={() => handleCardClick(cloth.id)}>
          <ClothCard item={cloth} onToggleFavorite={cloth.onToggleFavorite} />
        </CardWrapper>
      ))}
    </Grid>
  );
}

export default memo(ClothGrid);
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, calc((100% - 100px) / 2));
  justify-content: center;
  gap: 15px;
  padding: 0px;
`;

const CardWrapper = styled.div`
  cursor: pointer;

  &:active {
    transform: scale(0.98);
    transition: transform 0.1s;
  }
`;
