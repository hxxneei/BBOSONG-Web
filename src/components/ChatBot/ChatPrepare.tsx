import React from "react";
import styled from "styled-components";

interface ChatPrepareProps {
  onGoChat: () => void;
}

const ChatPrepare: React.FC<ChatPrepareProps> = ({ onGoChat }) => {
  return (
    <Container>
      {/* 상단 프로필 헤더 */}
      <Header>
        <ProfileImg src="/bbosong5.png" alt="프로필" />
        <NameArea>
          <div className="name">뽀송이</div>
          <div className="desc">스마트 챗봇</div>
        </NameArea>
      </Header>

      <BotBubble>홍길동님 안녕하세요! 무엇을 도와드릴까요? 😊</BotBubble>

      <SelectBox>
        <div className="select-title">뽀송이에게 뭐라고 말할까요?</div>
        {/* $primary를 넣어서 파란색 버튼으로! */}
        <SelectBtn $primary onClick={onGoChat}>
          뽀송아 안녕! 👋
        </SelectBtn>
        {/* $primary를 안 넣어서 회색 버튼으로! */}
        <SelectBtn onClick={onGoChat}>직접 채팅 입력하기</SelectBtn>
      </SelectBox>
    </Container>
  );
};

export default ChatPrepare;

const Container = styled.div`
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ProfileImg = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
`;

const NameArea = styled.div`
  .name {
    font-size: 18px;
    font-weight: 700;
  }
  .desc {
    font-size: 13px;
    color: #777;
  }
`;

const BotBubble = styled.div`
  background: #f1f5ff;
  padding: 12px 16px;
  border-radius: 16px;
  width: fit-content;
  max-width: 80%;
  font-size: 14px;
  margin-top: 20px;
  position: relative;
`;

const SelectBox = styled.div`
  margin-top: 30px;
  padding: 18px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 10px;
  .select-title {
    text-align: center;
    font-size: 14px;
    margin-bottom: 4px;
    color: #444;
  }
`;

const SelectBtn = styled.button<{ $primary?: boolean }>`
  width: 100%;
  padding: 14px;
  background: ${(props) => (props.$primary ? "#4B80FC" : "#eee")};
  color: ${(props) => (props.$primary ? "white" : "#888")};
  border-radius: 12px;
  border: none;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;

  &:active {
    opacity: 0.8;
  }
`;
