
export const parseEmailValue = (value: string) => {
  return value.split("@")?.[0] ?? "";
};
