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
  tags?: string[];
  isFavorite: boolean;
};

type Props = {
  title: string;
  item: ClothItem;
  rightIcon?: string;
  onRightIconClick?: () => void;
  onToggleFavorite?: () => void;
};

export default function ClothDetailView({
  title,
  item,
  rightIcon,
  onRightIconClick,
  onToggleFavorite,
}: Props) {
  const nav = useNavigate();
  const tags = item.tags ?? ["#니트", "#의류", "#상의", "#검정색"];

  return (
    <Page>
      {/* Header */}
      <Header>
        <LeftIconBtn aria-label="뒤로가기" onClick={() => nav(-1)}>
          <Icon
            icon="mingcute:left-line"
            width={24}
            height={24}
            color="#9ca3af"
          />
        </LeftIconBtn>

        <TitleContainer>
          <HeaderTitle>{title}</HeaderTitle>
          {rightIcon && (
            <InlineTrashBtn aria-label="삭제" onClick={onRightIconClick}>
              <Icon icon={rightIcon} width={20} height={20} color="#6b7280" />
            </InlineTrashBtn>
          )}
        </TitleContainer>
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
              <HeartBtn
                active={item.isFavorite}
                onClick={(e) => {
                  if (onToggleFavorite) onToggleFavorite();
                }}
              />
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

          <SpecRow $alignTop={true}>
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

          <SpecRow $alignTop={true}>
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

const Page = styled.div`
  min-height: 100vh;
  background: #fff;
  width: 100%;
  max-width: 380px;
  margin: 0 auto;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
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
  width: 100%;
  box-sizing: border-box;
  position: relative;
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
`;

const HeaderTitle = styled.h1`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
`;

const InlineTrashBtn = styled.button`
  all: unset;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 6px;
  border-radius: 4px;

  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);

  &:active {
    transform: translateY(-50%) scale(0.92);
  }
`;

const LeftIconBtn = styled.button`
  all: unset;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  cursor: pointer;
  position: absolute;
  left: 12px;

  &:active {
    transform: scale(0.96);
  }
`;

const Content = styled.div`
  padding: 16px 16px calc(100px + env(safe-area-inset-bottom, 0px));
  width: 100%;
  box-sizing: border-box;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 13px rgba(85, 85, 85, 0.12);
  padding: 14px;
  box-sizing: border-box;
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
  box-sizing: border-box;
`;

const ProductImg = styled.img`
  width: 100%;
  max-width: 240px;
  height: auto;
  display: block;
  object-fit: contain;
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
  width: 100%;
`;

const SpecRow = styled.div<{ $alignTop?: boolean }>`
  display: grid;
  grid-template-columns: 80px 1fr;
  align-items: ${(p) => (p.$alignTop ? "start" : "center")};
  gap: 12px;
  padding: 12px 2px;
  width: 100%;
  box-sizing: border-box;
`;

const Divider = styled.div`
  height: 1px;
  background: rgba(0, 0, 0, 0.06);
  margin-left: 80px;
  width: calc(100% - 80px);
`;

const SpecHead = styled.div`
  color: #4b80fc;
  font-weight: 700;
  font-size: 14px;
  text-align: left;
`;

const SpecBody = styled.div`
  color: #111827;
  font-size: 14px;
  line-height: 1.45;
  word-break: keep-all;

  ul {
    margin: 0;
    padding-left: 18px;
  }
  li {
    margin: 4px 0;
  }
`;
