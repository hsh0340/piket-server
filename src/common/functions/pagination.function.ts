export const pageTransform = ({ value }: any) => {
  return Number(value) ? Number(value) - 1 : value;
};
