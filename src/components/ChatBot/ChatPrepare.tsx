import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import BSProfile from "../../assets/ChatPage/BSProfile.webp";

interface ChatPrepareProps {
  onGoChat: (initialMessage?: string) => void;
}

const ChatPrepare: React.FC<ChatPrepareProps> = ({ onGoChat }) => {
  const navigate = useNavigate();
  const userNickname = localStorage.getItem("nickname") || "보송이";
  return (
    <PageWrapper>
      <TopAppBar>
        <BackButton onClick={() => navigate(-1)}>
          <ChevronLeft size={24} color="#777777" />
        </BackButton>
        <HeaderProfile>
          <ProfileImg src={BSProfile} alt="프로필" />{" "}
          <NameArea>
            <div className="name">뽀송이</div>
            <div className="desc">스마트 챗봇</div>
          </NameArea>
        </HeaderProfile>
        <EmptySpace />
      </TopAppBar>

      <MainChatZone>
        <DividerRow>
          <Line />
          <NoticeText>뽀송이와 {userNickname}님이 입장했어요</NoticeText>
          <Line />
        </DividerRow>

        <BotBubble>
          <span className="highlight">{userNickname}</span>님 안녕하세요! 무엇을
          도와드릴까요?
        </BotBubble>
      </MainChatZone>

      <BottomCardZone>
        <SelectBox>
          <div className="select-title">뽀송이에게 뭐라고 말할까요?</div>

          <SelectBtn
            type="button"
            $primary
            onClick={() => onGoChat("뽀송아 안녕! 👋")}
          >
            뽀송아 안녕! 👋
          </SelectBtn>

          <SelectBtn type="button" onClick={() => onGoChat()}>
            직접 채팅 입력하기
          </SelectBtn>
        </SelectBox>
      </BottomCardZone>
    </PageWrapper>
  );
};
export default ChatPrepare;
const PageWrapper = styled.div`
  width: 100%;
  max-width: 430px;

  margin: 0 auto;
  min-height: 100vh;
  min-height: 100dvh;
  background: linear-gradient(180deg, #b3d3f9 0%, #b9d9ff 40%, #e2efff 100%);

  display: flex;
  flex-direction: column;
  position: relative;
`;

const TopAppBar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
`;

const BackButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
`;

const HeaderProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  margin-left: 16px;
`;

const ProfileImg = styled.img`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: contain;
  background: #e2e8f0;
`;

const NameArea = styled.div`
  display: flex;
  flex-direction: column;
  .name {
    font-size: 16px;
    font-weight: 700;
    color: #1e293b;
  }
  .desc {
    font-size: 12px;
    color: #94a3b8;
    margin-top: 2px;
  }
`;

const EmptySpace = styled.div`
  width: 24px;
`;
const MainChatZone = styled.div`
  flex: 1;
  padding: 18px 20px;
`;
const DividerRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 18px;
  margin-top: 0px;
`;
const Line = styled.div`
  flex: 1;
  height: 1px;
  background: #94a3b8;
  opacity: 0.5;
`;
const NoticeText = styled.span`
  font-size: 12px;
  color: #64748b;
`;

const BotBubble = styled.div`
  background: #ffffff;
  padding: 10px 20px;
  border-radius: 40px;
  width: fit-content;
  max-width: 85%;
  font-size: 12px;
  font-weight: 500;
  color: #4b4b4b;
  box-shadow: 0px 4px 5px 0px rgba(75, 128, 252, 0.3);

  .highlight {
    color: #4b80fc;
    font-weight: 700;
  }
`;

const BottomCardZone = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding-bottom: 30px;
  background: transparent;
`;

const SelectBox = styled.div`
  width: 332px;
  min-height: 245px;

  background: #ffffff;
  border-radius: 16px;

  padding: 36px 38px;

  display: flex;
  flex-direction: column;
  gap: 10px;

  box-shadow: 0px 4px 5px 0px rgba(75, 128, 252, 0.3);

  box-sizing: border-box;
  opacity: 1;

  .select-title {
    text-align: center;
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 12px;
    color: #4b4b4b;
  }
`;

const SelectBtn = styled.button<{ $primary?: boolean }>`
  width: 100%;
  padding: 16px;
  background: ${(props) => (props.$primary ? "#4B80FC" : "#E2E8F0")};
  color: ${(props) => (props.$primary ? "white" : "#64748b")};
  border-radius: 5px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.1s ease;

  &:active {
    transform: scale(0.99);
    opacity: 0.9;
  }
`;
