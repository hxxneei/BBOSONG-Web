import styled from "styled-components";

import home from "../assets/navBtnIcon/home.svg";
import map from "../assets/navBtnIcon/map.svg";
import camera from "../assets/navBtnIcon/camera.svg";
import chat from "../assets/navBtnIcon/chat.svg";
import mypage from "../assets/navBtnIcon/mypage.svg";

const BottomNav = () => {
  return (
    <Bar>
      <Item>
        <Icon src={home} />
        <Label>홈 화면</Label>
      </Item>

      <Item>
        <Icon src={map} />
        <Label>지도</Label>
      </Item>

      <CenterWrap>
        <CenterBtn type="button">
          <CenterIcon src={camera} />
        </CenterBtn>
      </CenterWrap>

      <Item>
        <Icon src={chat} />
        <Label>챗봇</Label>
      </Item>

      <Item>
        <Icon src={mypage} />
        <Label>마이 페이지</Label>
      </Item>
    </Bar>
  );
};

export default BottomNav;

const Bar = styled.nav`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;

  height: 80px;
  padding-bottom: env(safe-area-inset-bottom, 0px);

  background: #fff;
  display: grid;
  grid-template-columns: 1fr 1fr 96px 1fr 1fr;
  align-items: center;
  box-shadow: 0 -4px 13px 6px rgba(57, 57, 57, 0.08);

  z-index: 50;
`;

const Item = styled.button`
  appearance: none;
  border: 0;
  background: transparent;
  display: grid;
  justify-items: center;
  gap: 6px;

  color: #aeaeae;

  margin-top: -5px;
`;

const Icon = styled.img`
  width: 27px;
  height: 28px;
  object-fit: contain;
`;

const Label = styled.span`
  font-size: 11px;
  line-height: 1;
  color: #aeaeae;
`;

const CenterWrap = styled.div`
  display: grid;
  place-items: center;
  transform: translateY(-20px);
`;

const CenterBtn = styled.button`
  width: var(--fab-size);
  height: var(--fab-size);
  border: 0;
  border-radius: 50%;

  display: grid;
  place-items: center;
  position: relative;
  color: #fff;
`;

const CenterIcon = styled.img`
  width: 71px;
  height: 71px;
  object-fit: contain;
`;
