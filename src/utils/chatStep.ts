export type ChatStep = 1 | 2 | 3;

export const getChatStepFromSearch = (search: string): ChatStep => {
  const step = new URLSearchParams(search).get("step");

  if (step === "2") return 2;
  if (step === "3") return 3;

  return 1;
};
