import styled from "styled-components";
import CategorySection from "../components/Closet/CategorySection";
import BottomBtn from "../components/Closet/BottomBtn";
import { Icon } from "@iconify/react";
// PNG 아이콘 import
import top from "../assets/closetIcon/CategoryCloset/top.png";
import outer from "../assets/closetIcon/CategoryCloset/outer.png";
import pants from "../assets/closetIcon/CategoryCloset/pants.png";
import innerwear from "../assets/closetIcon/CategoryCloset/innerwear.png";
import training from "../assets/closetIcon/CategoryCloset/training.png";
import hat from "../assets/closetIcon/CategoryCloset/hat.png";

import socks from "../assets/closetIcon/CategoryCloset/socks.png";
import bag from "../assets/closetIcon/CategoryCloset/bag.png";
import bedclothes from "../assets/closetIcon/CategoryCloset/bedclothes.png";
import onepiece from "../assets/closetIcon/CategoryCloset/onepiece.png";
import gloves from "../assets/closetIcon/CategoryCloset/gloves.png";
import scarf from "../assets/closetIcon/CategoryCloset/scarf.png";
// 정렬 필요

const ClosetPage = () => {
  const clothing = [
    { icon: top, label: "상의" },
    { icon: outer, label: "아우터" },
    { icon: pants, label: "하의" },
    { icon: onepiece, label: "원피스/세트" },
    { icon: innerwear, label: "이너웨어" },
    { icon: training, label: "트레이닝" },
  ];

  const accessories = [
    { icon: hat, label: "모자" },
    { icon: scarf, label: "스카프/머플러" },
    { icon: socks, label: "양말" },
    { icon: gloves, label: "장갑" },
    { icon: bag, label: "가방" },
    { icon: bedclothes, label: "침구류" },
  ];

  return (
    <Page>
      <Header>
        <BackButton onClick={() => window.history.back()}>
          <Icon
            icon="mdi:chevron-left"
            width="32"
            height="32"
            color="#AEAEAE"
          />
        </BackButton>
      </Header>
      <CategorySection
        title="의류"
        icon="mdi:tshirt-crew-outline"
        items={clothing}
      />
      <CategorySection
        title="잡화"
        icon="mdi:clothes-hanger"
        items={accessories}
      />
      <BottomBtn
        size={42}
        onClick={() => console.log("bag clicked")}
        ariaLabel="장바구니 열기"
      />
    </Page>
  );
};

export default ClosetPage;

const Page = styled.main`
  padding: 24px 20px;
  background: #f9fafb;
  min-height: 100vh;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  gap: px;
  margin-bottom: 10px;
`;

const BackButton = styled.button`
  border: none;
  background: none;
  margin-left: -12px;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  &:active {
    transform: scale(0.96);
  }
`;
