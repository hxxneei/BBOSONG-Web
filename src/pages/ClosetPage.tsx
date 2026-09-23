import styled from "styled-components";
import CategorySection from "../components/Closet/CategorySection";
import { ChevronLeft, Shirt, Tags } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import {
  ACCESSORY_CATEGORIES,
  CLOTHING_CATEGORIES,
  type ClothesCategory,
} from "../constants/clothesCategories";

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

const categoryIcons: Record<ClothesCategory, string> = {
  상의: top,
  아우터: outer,
  하의: pants,
  "원피스/세트": onepiece,
  이너웨어: innerwear,
  트레이닝: training,
  모자: hat,
  "스카프/머플러": scarf,
  양말: socks,
  장갑: gloves,
  가방: bag,
  침구류: bedclothes,
};

const clothing = CLOTHING_CATEGORIES.map((label) => ({
  icon: categoryIcons[label],
  label,
}));

const accessories = ACCESSORY_CATEGORIES.map((label) => ({
  icon: categoryIcons[label],
  label,
}));

const ClosetPage = () => {
  const navigate = useNavigate();

  const handleCategoryClick = useCallback(
    (category: ClothesCategory) => {
      navigate(`/closet/category/${encodeURIComponent(category)}`);
    },
    [navigate],
  );

  return (
    <Page>
      <Header>
        <BackButton aria-label="뒤로가기" onClick={() => window.history.back()}>
          <ChevronLeft size={32} color="#AEAEAE" />
        </BackButton>
      </Header>

      <CategorySection
        title="의류"
        icon={Shirt}
        items={clothing}
        onItemClick={handleCategoryClick}
      />

      <CategorySection
        title="잡화"
        icon={Tags}
        items={accessories}
        onItemClick={handleCategoryClick}
      />
    </Page>
  );
};

export default ClosetPage;

const Page = styled.main`
  padding: 24px 20px;
  background: #f9fafb;
  min-height: 100vh;
  min-height: 100dvh;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  gap: 0px;
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
