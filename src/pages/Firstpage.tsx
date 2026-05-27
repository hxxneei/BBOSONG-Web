import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as S from "../components/FirstPage/OnboardingTitle";

import preview from "../assets/FirstPage/preview.webp";
import bbosongFinal from "../assets/FirstPage/bbosongFinal.svg";
import cameraPreview from "../assets/FirstPage/cameraPreview.webp";

const FirstPage: React.FC = () => {
  const [page, setPage] = useState(0);
  const navigate = useNavigate();

  // 1페이지용 말풍선 데이터
  const bubbles = [
    "옷이 왜 줄어들었지?!",
    "세탁을 해도 얼룩이 그대로야!",
    "세탁 후에 옷이 손상됐어...",
    "세탁 방법이 너무 헷갈려...",
  ];

  return (
    <S.Container>
      <div style={{ width: "100%", zIndex: 10, marginTop: "83px" }}>
        {page === 0 && (
          <S.Title>
            세탁을 하며 <span className="highlight">이런 경험</span>,
            <br />
            있지 않으세요?
          </S.Title>
        )}
        {page === 1 && (
          <S.Title>
            이제, 세탁메이트 <span className="highlight">뽀송이</span>와
            <br />
            <span className="highlight">스마트</span>하게 빨래해요
          </S.Title>
        )}
        {page === 2 && (
          <S.Title>
            <span className="highlight">사진 한 장</span>으로 세탁 끝!
            <br />
            나만의 <span className="highlight">맞춤 옷장</span>에 저장!
          </S.Title>
        )}
        {page === 3 && (
          <S.Title>
            뽀송이와 함께
            <br />
            세탁하러 가볼까요?
          </S.Title>
        )}
      </div>

      <S.PageWrapper>
        {page === 0 && (
          <S.BubbleList>
            {bubbles.map((text, i) => (
              <S.Bubble key={i} $delay={i * 0.2}>
                {text}
              </S.Bubble>
            ))}
          </S.BubbleList>
        )}

        {page === 1 && (
          <S.ImageGrid>
            <img
              src={preview}
              alt="preview"
              style={{ width: "95%", height: "auto" }}
            />
          </S.ImageGrid>
        )}

        {page === 2 && (
          <S.ImageGrid>
            <img
              src={cameraPreview}
              alt="cameraPreview"
              style={{ width: "290px", height: "auto" }}
            />
          </S.ImageGrid>
        )}

        {page === 3 && (
          <S.ImageGrid>
            <img
              src={bbosongFinal}
              alt="final"
              style={{
                width: "114px",
                height: "auto",
                display: "block",
                margin: "0 auto",
              }}
            />
          </S.ImageGrid>
        )}
      </S.PageWrapper>

      <S.BottomBtnWrap>
        <S.IndicatorContainer>
          {[0, 1, 2, 3].map((i) => (
            <S.Dot key={i} $active={page === i} onClick={() => setPage(i)} />
          ))}
        </S.IndicatorContainer>

        <S.StyledButton
          $isStart={page === 3}
          onClick={() => (page < 3 ? setPage(page + 1) : navigate("/login"))}
        >
          {page === 3 ? "시작하기" : "다음"}
        </S.StyledButton>
      </S.BottomBtnWrap>
    </S.Container>
  );
};

export default FirstPage;
