import styled from "styled-components";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import HeartBtn from "../../common/HeartBtn";

export type ClothItem = {
  id: number;
  category: string;
  brand: string;
  name: string;
  image: string;
  material?: string;
  color?: string;
  wash?: string[];
  caution?: string[];
  tags?: string[]; // 상세 뷰에서만 필요하면 옵션
};

type Props = {
  title: string; // 헤더 가운데 텍스트
  item: ClothItem; // 렌더링할 아이템
  rightIcon?: string; // 아이콘명 (iconify)
  onRightIconClick?: () => void; // 우측 아이콘 클릭 핸들러
};

export default function ClothDetailView({
  title,
  item,
  rightIcon,
  onRightIconClick,
}: Props) {
  const nav = useNavigate();
  const tags = item.tags ?? ["#니트", "#의류", "#상의", "#검정색"];

  return (
    <Page>
      {/* Header */}
      <Header>
        <IconBtn aria-label="뒤로가기" onClick={() => nav(-1)}>
          <Icon
            icon="mingcute:left-line"
            width={24}
            height={24}
            color="#9ca3af"
          />
        </IconBtn>
        <HeaderTitle>{title}</HeaderTitle>

        <Right>
          {rightIcon && (
            <IconBtn aria-label="right-action" onClick={onRightIconClick}>
              <Icon icon={rightIcon} width={22} height={22} color="#6b7280" />
            </IconBtn>
          )}
        </Right>
      </Header>

      {/* Content */}
      <Content>
        <Card>
          <Row>
            <div>
              <Brand>{item.brand}</Brand>
              <Name>{item.name}</Name>
            </div>
            <HeartSlot>
              <HeartBtn />
            </HeartSlot>
          </Row>

          <ImgWrap>
            <ProductImg src={item.image} alt={item.name} />
          </ImgWrap>
        </Card>

        {/* Tags */}
        <Tags>
          {tags.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </Tags>

        {/* Specs */}
        <SpecList>
          <SpecRow>
            <SpecHead>소재</SpecHead>
            <SpecBody>{item.material ?? "-"}</SpecBody>
          </SpecRow>
          <Divider />
          <SpecRow>
            <SpecHead>색상</SpecHead>
            <SpecBody>{item.color ?? "-"}</SpecBody>
          </SpecRow>
          <Divider />
          <SpecRow alignTop>
            <SpecHead>세탁 방법</SpecHead>
            <SpecBody>
              <ul>
                {(item.wash ?? []).map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </SpecBody>
          </SpecRow>
          <Divider />
          <SpecRow alignTop>
            <SpecHead>주의사항</SpecHead>
            <SpecBody>
              <ul>
                {(item.caution ?? []).map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </SpecBody>
          </SpecRow>
        </SpecList>
      </Content>
    </Page>
  );
}

/* styles */
const Page = styled.div`
  min-height: 100vh;
  background: #fff;
`;
const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 52px;
  background: #fff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
`;
const HeaderTitle = styled.h1`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
`;
const IconBtn = styled.button`
  all: unset;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  cursor: pointer;
  &:active {
    transform: scale(0.96);
  }
`;
const Right = styled.div`
  position: absolute;
  right: 8px;
  display: flex;
`;
const Content = styled.div`
  padding: 14px 14px 28px;
`;
const Card = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 13px rgba(85, 85, 85, 0.12);
  padding: 14px;
`;
const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 8px;
`;
const Brand = styled.p`
  margin: 0 0 2px 0;
  color: #9aa2ad;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.3px;
`;
const Name = styled.h2`
  margin: 0;
  font-size: 20px;
  line-height: 1.25;
  color: #111827;
  font-weight: 800;
`;
const HeartSlot = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const ImgWrap = styled.div`
  border-radius: 12px;
  background: #f3f5f7;
  margin-top: 12px;
  display: grid;
  place-items: center;
  padding: 16px;
`;
const ProductImg = styled.img`
  width: min(70%, 320px);
  height: auto;
  display: block;
`;
const Tags = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin: 14px 2px 8px;
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
const SpecList = styled.div`
  margin-top: 8px;
`;
const SpecRow = styled.div<{ alignTop?: boolean }>`
  display: grid;
  grid-template-columns: 92px 1fr;
  align-items: ${(p) => (p.alignTop ? "start" : "center")};
  gap: 12px;
  padding: 12px 2px;
`;
const Divider = styled.div`
  height: 1px;
  background: rgba(0, 0, 0, 0.06);
  margin-left: 92px;
`;
const SpecHead = styled.div`
  color: #4b80fc;
  font-weight: 700;
  font-size: 14px;
`;
const SpecBody = styled.div`
  color: #111827;
  font-size: 14px;
  ul {
    margin: 0;
    padding-left: 18px;
  }
  li {
    margin: 4px 0;
  }
`;
