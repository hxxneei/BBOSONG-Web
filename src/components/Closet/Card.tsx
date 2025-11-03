import styled from "styled-components";

type Props = {
  icon: string;
  label: string;
};

const CategoryCard = ({ icon, label }: Props) => {
  return (
    <Card>
      <img src={icon} alt={label} />
      <span>{label}</span>
    </Card>
  );
};

export default CategoryCard;

const Card = styled.div`
  gap: 10px;
  display: flex;
  top: 5px;

  place-items: center;

  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 100px;
  height: 100px;
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
  font-size: 11px;
  font-weight: 600;
  color: #000000ff;
  transition: transform 0.15s ease;

  &:active {
    transform: scale(0.96);
  }

  img {
    width: 33px;
    height: 33px;
    object-fit: contain;
  }
`;
