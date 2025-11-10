import React, { useState } from "react";
import styled from "styled-components";
import DeleteIcon from "../assets/DeleteIcon.png";

export default function DeleteModal() {
  const [step, setStep] = useState<"confirm" | "done">("confirm");

  return (
    <Layer>
      <Dim />
      <Card>
        {step === "confirm" ? (
          <>
            <Text>정말 삭제 하시겠습니까?</Text>
            <BtnCol>
              <PrimaryBtn onClick={() => setStep("done")}>확인</PrimaryBtn>
              <GhostBtn>취소</GhostBtn>
            </BtnCol>
          </>
        ) : (
          <>
            <Emoji src={DeleteIcon} alt="완료" />
            <Text>삭제가 완료되었습니다.</Text>
            <BtnCol>
              <PrimaryBtn>확인</PrimaryBtn>
            </BtnCol>
          </>
        )}
      </Card>
    </Layer>
  );
}

const Layer = styled.div`
  position: fixed;
  inset: 0;
  z-index: 999;
  display: grid;
  place-items: center;
`;

const Dim = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(17, 24, 39, 0.45);
  backdrop-filter: blur(1.5px);
`;
const Card = styled.div`
  position: relative;
  width: min(320px, calc(100% - 48px));
  height: 188px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.06);
  padding: 24px 20px 20px;
  text-align: center;
  z-index: 1;
`;

const Emoji = styled.img`
  display: block; /* inline-block 기본 정렬 문제 방지 */
  margin: 0 auto 12px auto; /* 가운데 정렬 */
  width: 48px;
  height: 48px;
  object-fit: contain;
`;
const Text = styled.p`
  color: #111827;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 20px;
`;

const BtnCol = styled.div`
  display: grid;
  gap: 10px;
`;

const BaseBtn = styled.button`
  width: 100%;
  height: 44px;
  border: 0;
  border-radius: 5px;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
`;

const PrimaryBtn = styled(BaseBtn)`
  background: #4b80fc;
  color: #fff;
  font-weight: 400;
`;

const GhostBtn = styled(BaseBtn)`
  background: #eef2ff;
  color: #9aa3b2;
`;
