import React from "react";
import styled from "styled-components";
import PostViewerHeader from "./PostViewerHeader";
import PostViewerContent from "./PostViewerContent";

/**
 * @author 박진호
 * @version 1.0
 * @summary 포스트 뷰어 컨테이너
 */

// style

const PostWrapper = styled.div`
  margin-top: 30px;
`;

const FillingFooter = styled.div`
  background: #f0f2f6;
  height: 350px;
`;

const PostViewer = ({ post, contentType }) => {
  return (
    <PostWrapper>
      <PostViewerHeader post={post} contentType={contentType} />
      <PostViewerContent post={post} contentType={contentType} />
      <FillingFooter />
    </PostWrapper>
  );
};

export default PostViewer;
