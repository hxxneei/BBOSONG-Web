import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import BSProfile from "../../assets/ChatPage/BSProfile.webp";

interface ChatPrepareProps {
  onGoChat: () => void;
}

const ChatPrepare: React.FC<ChatPrepareProps> = ({ onGoChat }) => {
  const navigate = useNavigate();
  const userNickname = localStorage.getItem("nickname") || "보송이";
  return (
    <PageWrapper>
      <TopAppBar>
        <BackButton onClick={() => navigate(-1)}>
          <Icon
            icon="mingcute:left-line"
            width={24}
            height={24}
            color="#777777"
          />
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

          <SelectBtn $primary onClick={onGoChat}>
            뽀송아 안녕! 👋
          </SelectBtn>

          <SelectBtn onClick={onGoChat}>직접 채팅 입력하기</SelectBtn>
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

// const BottomCardZone = styled.div`
//   padding: 20px;
//   background: transparent;
// `;

const BottomCardZone = styled.div`
  width: 100%;
  display: flex;
  justify-content: center; // 가로 정중앙 정렬
  padding-bottom: 30px; // 화면 맨 밑바닥과 카드 사이의 안전 마진
  background: transparent; // 배경은 투명하게 해서 그라데이션이 다 보이도록!
`;

// const SelectBox = styled.div`
//   background: #ffffff;
//   border-radius: 24px;
//   padding: 28px 22px 24px;
//   box-shadow: 0 -4px 24px rgba(15, 23, 42, 0.08);
//   display: flex;
//   flex-direction: column;
//   gap: 12px;

//   .select-title {
//     text-align: center;
//     font-size: 16px;
//     font-weight: 700;
//     margin-bottom: 12px;
//     color: #4b4b4b;
//   }
// `;

const SelectBox = styled.div`
  width: 332px; // figma 스펙
  /* height: 245px; -> 🚨 고정 높이를 주면 닉네임이 길어질 때 글자가 터지므로 
  최소 높이(min-height)로 잡거나 패딩에 맡기는 게 프론트엔드 정석입니다! */
  min-height: 245px;

  background: #ffffff;
  border-radius: 16px; // figma 스펙

  padding: 36px 38px;

  display: flex;
  flex-direction: column;
  gap: 10px;

  box-shadow: 0px 4px 5px 0px rgba(75, 128, 252, 0.3);

  box-sizing: border-box; // 패딩 때문에 가로가 332px보다 커지는 현상 원천 방어!
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
