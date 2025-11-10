import ResultPage from "./ResultPage";
import type { ResultData } from "../components/Result/ResultCard";
import dummyImg from "../assets/ResultDummy.png";

const detailData: ResultData = {
  categoryPath: "의류 / 니트",
  name: "코튼 케이블 니트",
  image: dummyImg,
  material: "피마코튼",
  color: "검정색",
  wash: {
    title: "세탁 방법",
    items: ["드라이", "30도 중성세제", "표백", "140~160도 다림질"],
  },
  caution: { title: "주의사항", items: ["건조기 금지", "뒤집어서 세탁"] },
};

export default function ClosetDetailPage() {
  return (
    <ResultPage
      data={detailData}
      title="상세 보기"
      rightIcon="mdi:trash-can-outline"
      onRightIconClick={() => console.log("삭제")}
      tags={["#니트", "#의류", "#상의", "#검정색"]}
      showButtons={false}
      bookmarked={false}
      showBookmark={false}
    />
  );
}
