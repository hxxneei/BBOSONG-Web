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
        <CardWrapper key={cloth.id}>
          <CardOpenButton
            type="button"
            aria-label={`${cloth.name} 상세 보기`}
            onClick={() => handleCardClick(cloth.id)}
          />
          <ClothCard item={cloth} onToggleFavorite={cloth.onToggleFavorite} />
        </CardWrapper>
      ))}
    </Grid>
  );
}

export default memo(ClothGrid);
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 162px));
  justify-content: center;
  gap: 12px;
  width: 100%;
  padding: 0 16px;
`;

const CardWrapper = styled.div`
  position: relative;
  min-width: 0;

  &:active {
    transform: scale(0.98);
    transition: transform 0.1s;
  }
`;

const CardOpenButton = styled.button`
  position: absolute;
  inset: 0;
  z-index: 1;
  width: 100%;
  border-radius: 15px;
`;
