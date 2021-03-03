import client from "./client";

/**
 * @author 박진호
 * @version 1.0
 * @summary 유저 관련 api 정의 파일
 */

export const register = ({
  useremail,
  confirmUseremail,
  password,
  confirmpassword,
  usernickname,
  userSkill,
  userGithub,
}) =>
  client.post("/api/join", {
    useremail,
    confirmUseremail,
    password,
    confirmpassword,
    usernickname,
    userSkill,
    userGithub,
  });

export const setUser = () => client.get(`/api/setUser`);

export const login = ({ email, password }) =>
  client.post("/api/login", {
    email,
    password,
  });

export const socialLogin = (type) => client.get(`/api/auth/${type}`);

export const logout = (id) => client.get(`/api/logout`);
