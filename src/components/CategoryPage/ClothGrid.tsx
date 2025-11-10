import styled from "styled-components";
import ClothCard from "./ClothCard";

export default function ClothGrid({ items }: { items: any[] }) {
  return (
    <Grid>
      {items.map((item) => (
        <ClothCard key={item.id} item={item} />
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
