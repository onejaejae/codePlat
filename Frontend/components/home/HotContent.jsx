import React from "react";
import styled from "styled-components";
import List from "../common/contents/List";

/**
 * @author 박진호
 * @version 1.0
 * @summary 포럼 인기글 컴포넌트
 */

// style

const HotContentWrapper = styled.div``;

const HotContent = ({ forumData }) => {
  return (
    <HotContentWrapper>
      <List data={forumData} type="forum"></List>
    </HotContentWrapper>
  );
};

export default HotContent;
