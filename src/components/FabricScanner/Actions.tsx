// 하단 버튼(촬영 시작하기 + 갤러리에서 사진 선택)

import styled from "styled-components";
import Button from "./Button";

type ActionsProps = {
  onStartCamera: () => void;
  onPickGallery: () => void;
};

export default function Actions({
  onStartCamera,
  onPickGallery,
}: ActionsProps) {
  return (
    <Wrap>
      <Button label="촬영 시작하기" onClick={onStartCamera} variant="primary" />
      <Button
        label="갤러리에서 사진 선택"
        onClick={onPickGallery}
        variant="secondary"
      />
    </Wrap>
  );
}

const Wrap = styled.div`
  margin-top: 0;
  display: grid;
  gap: 19px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
