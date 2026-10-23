import styled from "styled-components";
import { memo, useCallback, type ReactNode } from "react";
import ClothCard, { type ClothCardItem } from "./ClothCard";

export type ClothGridItem = ClothCardItem;

interface ClothGridProps {
  items: ClothGridItem[];
  onItemClick: (clothesId: number) => void;
  onToggleFavorite?: (clothesId: number, currentFavorite: boolean) => void;
  emptyState?: ReactNode;
}

function ClothGrid({
  items,
  onItemClick,
  onToggleFavorite,
  emptyState = null,
}: ClothGridProps) {
  if (items.length === 0) {
    return emptyState;
  }

  return (
    <Grid>
      {items.map((cloth) => (
        <ClothGridCard
          key={cloth.id}
          cloth={cloth}
          onItemClick={onItemClick}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </Grid>
  );
}

export default memo(ClothGrid);

interface ClothGridCardProps {
  cloth: ClothGridItem;
  onItemClick: ClothGridProps["onItemClick"];
  onToggleFavorite: ClothGridProps["onToggleFavorite"];
}

const ClothGridCard = memo(function ClothGridCard({
  cloth,
  onItemClick,
  onToggleFavorite,
}: ClothGridCardProps) {
  const handleCardClick = useCallback(() => {
    onItemClick(cloth.id);
  }, [cloth.id, onItemClick]);

  const handleToggleFavorite = useCallback(() => {
    onToggleFavorite?.(cloth.id, Boolean(cloth.isFavorite));
  }, [cloth.id, cloth.isFavorite, onToggleFavorite]);

  return (
    <CardWrapper>
      <CardOpenButton
        type="button"
        aria-label={`${cloth.name} 상세 보기`}
        onClick={handleCardClick}
      />
      <ClothCard
        item={cloth}
        onToggleFavorite={onToggleFavorite ? handleToggleFavorite : undefined}
      />
    </CardWrapper>
  );
});

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
