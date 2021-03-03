import React, { useState } from "react";
import styled from "styled-components";
import { Card } from "antd";
import HotContent from "./HotContent";

/**
 * @author 박진호
 * @version 1.0
 * @summary 메인 페이지 포럼 인기글 컨테이너
 */

// style

const ContentTemplateWrapper = styled.div`
  padding: 20px;
  .ant-card-body {
    background: #f0f2f6;
    padding: 10px 0;
  }
  .ant-tabs-tab-btn {
    color: #16172b !important;
  }
  .ant-tabs-ink-bar {
    background: #999;
  }
`;

const ContentTemplate = ({ forumData }) => {
  // local state
  const [currTab, setCurrTab] = useState({
    key: "hot",
    tab: "커뮤니티 인기글",
  });

  // event listener

  const onChangeTap = (key, type) => {
    setCurrTab({ [type]: key });
  };

  return (
    <ContentTemplateWrapper>
      <Card
        style={{ width: "100%" }}
        tabList={[{ key: "hot", tab: "포럼 인기글" }]}
        activeTabKey={currTab.key}
        onTabChange={(key) => {
          onChangeTap(key, "key");
        }}
      >
        <HotContent forumData={forumData} />
      </Card>
    </ContentTemplateWrapper>
  );
};

export default ContentTemplate;
