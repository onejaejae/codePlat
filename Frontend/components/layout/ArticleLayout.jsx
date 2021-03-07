import React from "react";
import { Layout } from "antd";
import Header from "../common/Header";
import styled from "styled-components";
import SkillFilterForm from "../common/contents/SkillFilterForm";
import SearchContentForm from "../common/contents/SearchContentForm";

/**
 * @author 박진호
 * @version 1.0
 * @summary 포스트 리스트 뷰어 레이아웃
 */

// style

const Content = Layout.Content;

const ContentWrapper = styled(Content)`
  width: 1300px;

  margin: 0 auto;
  margin-top: 65px;
  @media (max-width: 1368px) {
    width: 100%;
  }
  @media (max-width: 950px) {
    margin-top: 125px;
  }
`;

const ArticleWrapper = styled.div`
  margin: 0 auto;
  width: 900px;
  @media (max-width: 900px) {
    width: 100%;
  }
`;

const ArticleLayout = ({ children, contentType }) => {
  return (
    <Layout>
      <Header />
      <ContentWrapper>
        <SearchContentForm contentType={contentType} />
        {contentType !== "forum" && <SkillFilterForm />}
        <ArticleWrapper>{children}</ArticleWrapper>
      </ContentWrapper>
    </Layout>
  );
};

export default ArticleLayout;
