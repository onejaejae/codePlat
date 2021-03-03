// eslint-disable-next-line import/prefer-default-export
export const jsonParse = (json) => {
  const tmp = json;
  const curr = JSON.parse(tmp);
  return curr;
};
