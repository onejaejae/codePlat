import bcrypt from "bcrypt";

// eslint-disable-next-line import/prefer-default-export
export const generateHash = async (password) => {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};
