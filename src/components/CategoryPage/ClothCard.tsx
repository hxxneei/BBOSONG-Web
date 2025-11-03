import styled from "styled-components";
import HeartBtn from "../../common/HeartBtn";

export default function ClothCard({ item }: { item: any }) {
  return (
    <Card>
      <Image src={item.image} alt={item.name} />
      <Info>
        <Category>{item.category}</Category>
        <Brand>{item.brand}</Brand>
        <Name>{item.name}</Name>
      </Info>
      <HeartWrapper>
        <HeartBtn />
      </HeartWrapper>
    </Card>
  );
}

const Card = styled.div`
  width: 162px;
  height: 243px;
  position: relative;
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 2px 13px rgba(85, 85, 85, 0.15);
  padding: 12px;
`;

const Image = styled.img`
  width: 100%;
  border-radius: 8px;
`;

const Info = styled.div`
  margin-top: 6px;
`;

const Category = styled.span`
  color: #4b80fc;
  font-size: 12px;

  margin-bottom: 2px;
`;

const Brand = styled.p`
  font-weight: 600;
  margin: 0;
  font-size: 12px;
  color: #767676;
`;

const Name = styled.p`
  font-size: 14px;
  font-weight: 600;
  color: #000000ff;

  margin: 2px 0 0 0;
`;

const HeartWrapper = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
`;
