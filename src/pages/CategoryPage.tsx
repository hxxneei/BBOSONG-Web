import SearchBar from "../common/SearchBar";
import ClothGrid from "../components/CategoryPage/ClothGrid";
import CategoryData from "../data/CategoryData";
import Header from "../components/CategoryPage/Header";
export default function TopPage() {
  return (
    <div>
      <Header title="상의" />
      <SearchBar placeholder="검색어를 입력하세요." />
      <ClothGrid items={CategoryData} />
    </div>
  );
}
