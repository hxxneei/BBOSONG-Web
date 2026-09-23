import styled from "styled-components";
import { Bookmark, ChevronLeft } from "lucide-react";

const Bar = styled.header`
  display: grid;
  grid-template-columns: 40px 1fr 40px;
  align-items: center;

  margin-bottom: 0px;
`;

const IconBtn = styled.button`
  width: 31px;
  height: 31px;
  border: 0;
  background: transparent;
  display: grid;
  place-items: center;
  border-radius: 10px;
  cursor: pointer;

  &:active {
    background: rgba(17, 24, 39, 0.06);
  }
`;

const Title = styled.h1`
  justify-self: center;
  font-size: 16px;
  font-weight: 700;
  margin: 0;
`;

const BookmarkBtn = styled(IconBtn)<{ $active: boolean }>`
  color: ${(props) => (props.$active ? "#4B80FC" : "#AEAEAE")};
`;

type Props = {
  title?: string;
  onBack?: () => void;
  bookmarked?: boolean;
  onToggleBookmark?: () => void;
  showBookmark?: boolean;
};

export default function TopBar({
  title = "분석 결과",
  onBack,
  bookmarked = false,
  onToggleBookmark,
  showBookmark = true,
}: Props) {
  return (
    <Bar>
      <IconBtn aria-label="뒤로 가기" onClick={onBack}>
        <ChevronLeft size={32} color="#AEAEAE" />
      </IconBtn>

      <Title>{title}</Title>
      <RightBox>
        {showBookmark && (
          <BookmarkBtn
            aria-label="즐겨찾기"
            aria-pressed={bookmarked}
            $active={bookmarked}
            onClick={onToggleBookmark}
          >
            <Bookmark
              size={31}
              fill={bookmarked ? "currentColor" : "none"}
            />
          </BookmarkBtn>
        )}
      </RightBox>
    </Bar>
  );
}
const RightBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
`;
