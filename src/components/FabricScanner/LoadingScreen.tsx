import styled, { keyframes } from "styled-components";

type Props = {
  title?: string;
  subtitle?: string;
};

const spin = keyframes`
  to { transform: rotate(-360deg); }
`;

const Page = styled.div`
  min-height: 100dvh;
  display: grid;
  place-items: center;
  background: #ffffff;
  color: #111827;
`;

const Wrap = styled.div`
  display: grid;
  justify-items: center;
`;

const Spinner = styled.div`
  position: relative;
  width: 246px;
  height: 246px;
  animation: ${spin} 2.4s linear infinite;

  /* Motion preference */
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;
const GAP_SLOT = 0;

const Bar = styled.span<{ i: number }>`
  --size: 19px; /* 막대 두께 */
  --len: ${(p) => `${Math.max(10, 60 - p.i * 1)}px`};

  --deg: ${(p) => p.i * 49}deg; /* 회전 각도 변수화 */
  --delay: ${(p) => p.i * 0.08}s; /* 딜레이 변수화 */

  position: absolute;
  inset: 0;
  margin: auto;
  width: var(--size);
  height: var(--len);
  border-radius: 999px;

  transform: rotate(var(--deg)) translateY(-65px);

  --rotIndex: ${(p) => (p.i >= GAP_SLOT ? p.i + 1 : p.i)};

  background: ${(p) =>
    [
      "#2551A8",
      "#2D5FCA",
      "#346EEC",
      "#4C87FA",
      "#6EA2FB",
      "#C0DAFD",
      "#C0DAFD",
    ][p.i]};

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    opacity: 1;
  }
`;

const Title = styled.div`
  font-weight: 800;
  font-size: 24px;
  letter-spacing: 0.2px;
  margin-top: 40px;
`;

const Subtitle = styled.div`
  margin-top: 6px;
  font-size: 15px;
  color: #79797b;
`;
export default function LoadingScreen({
  title = "Loading . . .",
  subtitle = "이미지를 분석하는 중입니다.",
}: Props) {
  return (
    <Page aria-busy aria-live="polite" role="status">
      <Wrap>
        <Spinner>
          {Array.from({ length: 7 }).map((_, i) => (
            <Bar key={i} i={i} />
          ))}
        </Spinner>

        <div style={{ textAlign: "center" }}>
          <Title>{title}</Title>
          <Subtitle>{subtitle}</Subtitle>
        </div>
      </Wrap>
    </Page>
  );
}
