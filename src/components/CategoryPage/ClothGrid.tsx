import styled from "styled-components";
import ClothCard from "./ClothCard";
interface ClothGridProps {
  items: any[];
  onItemClick: (clothesId: number) => void;
}

export default function ClothGrid({ items, onItemClick }: ClothGridProps) {
  return (
    <Grid>
      {items.map((cloth) => (
        <CardWrapper key={cloth.id} onClick={() => onItemClick(cloth.id)}>
          <ClothCard item={cloth} onToggleFavorite={cloth.onToggleFavorite} />
        </CardWrapper>
      ))}
    </Grid>
  );
}
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
