import React from "react";
import { Layout } from "antd";
import Header from "../common/Header";
import Footer from "../common/Footer";
import styled from "styled-components";

/**
 * @author 박진호
 * @version 1.0
 * @summary 마이페이지 레이아웃
 */

// style

const Content = Layout.Content;

const ContentWrapper = styled(Content)`
  width: 1300px;
  margin: 0 auto;
  margin-top: 60px;
  @media (max-width: 1368px) {
    width: 100%;
  }
  @media (max-width: 950px) {
    margin-top: 124px;
  }
`;

const MypageLayout = ({ children }) => {
  return (
    <Layout>
      <Header />
      <ContentWrapper>{children}</ContentWrapper>
      <Footer />
    </Layout>
  );
};

export default MypageLayout;
