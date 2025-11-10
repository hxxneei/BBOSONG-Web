import styled from "styled-components";
import HeartBtn from "../../common/HeartBtn";

export type ResultData = {
  categoryPath: string;
  name: string;
  image: string;
  material: string;
  color: string;
  wash: { title: string; items: string[] };
  caution: { title: string; items: string[] };
};

type Props = {
  data: ResultData;
  tags?: string[];
};

const Card = styled.section`
  background: #fff;

  overflow: hidden;

  width: 340px;
`;

const Head = styled.div`
  margin-top: 27px;
`;

const Path = styled.p`
  font-size: 12px;
  font-weight: 600;
  color: #4b80fc;
`;

const ProductTitle = styled.h2`
  font-size: 20px;
  font-weight: 800;
  line-height: 0;
  // ...........................................
  line-height: 1.2;
  margin: 0;
`;

const ImageWrap = styled.div`
  position: relative;
  width: 100%;

  display: grid;
  place-items: center;
`;

const ProductImg = styled.img`
  width: 340px; // 329
  height: 260px;
  margin-top: 22px;
  margin-bottom: 2px;

  object-fit: contain;
  border-radius: 12px;

  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
`;

const List = styled.dl``;

const Row = styled.div`
  display: grid;
  grid-template-columns: 90px 1fr;
  align-items: start;

  padding: 10px 15px;

  @media (max-width: 340px) {
    grid-template-columns: 70px 1fr;
  }
  border-bottom: 0.5px solid #c1c1c5;

  &:last-child {
    border-bottom: none;
  }
`;

// (소재 + 색상 + 세탁방법 + 주의사항)
const Dt = styled.dt`
  margin: 0;
  font-size: 19px;
  font-weight: 600;
  color: #4b80fc;
`;

// (소재 + 색상_right)
const Dd = styled.dd`
  font-size: 14.5px;
  font-weight: 600;
  margin-left: 50px;

  ul {
    list-style: none;

    margin: 0;
    padding-left: 2px;
  }
`;

//(세탁 방법 + 주의사항)

const Bullet = styled.li.withConfig({
  shouldForwardProp: (prop) => prop !== "highlight",
})<{ highlight: boolean }>`
  position: relative;
  list-style: none;
  padding-left: 15px;

  font-size: 14.5px;
  font-weight: 600;
  color: ${({ highlight }) => (highlight ? "#4B80FC" : "#111827")};

  & + & {
    margin-top: 4px;
  }

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0.85em; /* 점의 수직 위치 미세조정 */
    transform: translateY(-50%);
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: #4b80fc;
  }
`;

export default function ResultCard({ data, tags }: Props) {
  const d = data;
  return (
    <Card>
      {/* <Head>
        <Path>{d.categoryPath}</Path>
        <ProductTitle>{d.name}</ProductTitle>
      </Head> */}
      <Head>
        <Path>{d.categoryPath}</Path>
        <TitleRow>
          <ProductTitle>{d.name}</ProductTitle>
          <HeartWrap>
            <HeartBtn />
          </HeartWrap>
        </TitleRow>
      </Head>

      <ImageWrap>
        <ProductImg src={d.image} alt={d.name} />
      </ImageWrap>

      {!!tags?.length && (
        <Tags>
          {tags.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </Tags>
      )}

      <List>
        <Row>
          <Dt>소재</Dt>
          <Dd>{d.material}</Dd>
        </Row>
        <Row>
          <Dt>색상</Dt>
          <Dd>{d.color}</Dd>
        </Row>
        <Row>
          <Dt>{d.wash.title}</Dt>

          <Dd>
            <ul>
              {data.wash.items.map((t, i) => (
                <Bullet key={i} highlight={t.includes("드라이클리닝")}>
                  {t}
                </Bullet>
              ))}
            </ul>
          </Dd>
        </Row>
        <Row>
          <Dt>{d.caution.title}</Dt>

          <Dd>
            <ul>
              {data.caution.items.map((t, i) => (
                <Bullet key={i} highlight={t.includes("건조기")}>
                  {t}
                </Bullet>
              ))}
            </ul>
          </Dd>
        </Row>
      </List>
    </Card>
  );
}

const Tags = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin: 12px 2px 4px;
`;
const Tag = styled.span`
  display: inline-flex;
  padding: 6px 10px;
  border-radius: 999px;
  background: #edf3ff;
  color: #4b80fc;
  font-size: 12px;
  font-weight: 700;
`;
const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const HeartWrap = styled.div`
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
`;
