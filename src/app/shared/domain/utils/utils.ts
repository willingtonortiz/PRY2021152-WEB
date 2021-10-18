export const delayed = (time: number) => {
  return new Promise((res, _) => setTimeout(() => res(time), time));
};
