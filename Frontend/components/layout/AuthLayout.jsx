import React from "react";
import { Layout } from "antd";
import Footer from "../common/Footer";
import styled, { css } from "styled-components";

/**
 * @author 박진호
 * @version 1.0
 * @summary auth 컴포넌트(로그인, 회원가입, 비밀번호 찾기 등) 레이아웃
 */

const Content = Layout.Content;

const ContentWrapper = styled(Content)`
  margin: 0 auto;
  margin-top: 65px;
  ${(props) =>
    props.type === "register"
      ? css`
          width: 600px;
          @media (max-width: 768px) {
            width: 80%;
          }
        `
      : css`
          width: 400px;
        `}
`;

const AuthLayout = ({ children, type }) => {
  return (
    <Layout>
      <ContentWrapper type={type}>{children}</ContentWrapper>
      <Footer />
    </Layout>
  );
};

export default AuthLayout;
