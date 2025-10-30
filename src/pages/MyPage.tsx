import { useViewportVH } from "../hooks/useViewportVH";

import React from "react";
import styled from "styled-components";
import {
  Calendar,
  Mail,
  User2,
  Heart,
  Shirt,
  Store,
  LogOut,
  UserX,
} from "lucide-react";
import { HeaderWrapper } from "../components/HeaderWrapper";
import { SectionWrapper } from "../components/SectionWrapper";
import { InfoRow } from "../components/Row";

const MyPage: React.FC = () => {
  const handleBack = () => window.history.back();
  useViewportVH();

  return (
    <Screen>
      <HeaderWrapper title="마이 페이지" onBack={handleBack} />

      {/* 내 정보 */}
      <SectionWrapper title="내 정보">
        <InfoRow
          icon={<User2 size={18} />}
          label="닉네임"
          value={<Strong>홍길동</Strong>}
        />
        <InfoRow
          icon={<Mail size={18} />}
          label="이메일"
          value="*****@naver.com"
        />
        <InfoRow
          icon={<Calendar size={18} />}
          label="생년월일"
          value="2000.00.00"
          hint="변경하기"
          onClick={() => {
            /* open dialog */
          }}
        />
      </SectionWrapper>

      {/* 옷장 관리 */}
      <SectionWrapper title="옷장 관리">
        <InfoRow
          icon={<Shirt size={18} />}
          label="저장한 옷"
          hint="더보기"
          onClick={() => {
            /* navigate */
          }}
        />
      </SectionWrapper>

      {/* 내 세탁소 관리 */}
      <SectionWrapper title="내 세탁소 관리">
        <InfoRow
          icon={<Heart size={18} />}
          label="즐겨찾는 매장"
          hint="더보기"
          onClick={() => {
            /* navigate */
          }}
        />
      </SectionWrapper>

      {/* 계정 관리 */}
      <SectionWrapper title="계정 관리">
        <InfoRow
          icon={<LogOut size={18} />}
          label="로그아웃"
          onClick={() => {
            /* logout */
          }}
        />
        <InfoRow
          icon={<UserX size={18} />}
          label="회원 탈퇴"
          onClick={() => {
            /* withdraw */
          }}
        />
      </SectionWrapper>
    </Screen>
  );
};

export default MyPage;

const Screen = styled.main`
  background: #f3f5f7;
  min-height: 100dvh;
  color: #111827;
  /* iOS safe area */
  padding-bottom: env(safe-area-inset-bottom);
`;

const Strong = styled.strong`
  font-weight: 600;
  color: #2563eb;
`;
