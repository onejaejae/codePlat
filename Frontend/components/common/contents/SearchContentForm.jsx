import React, { useCallback } from "react";
import styled from "styled-components";
import { Input, Button } from "antd";
import Link from "next/link";
import useInput from "../../../hooks/useInput";
import Router, { withRouter } from "next/router";

/**
 * @author 박진호
 * @version 1.0
 * @summary 글 검색 컴포넌트 in 포스트 리스트 뷰어 페이지
 */

// style

const SearchContentFormWrapper = styled.div`
  margin: 30px auto;
  width: 900px;
  display: flex;
  justify-content: flex-end;
  .write-btn {
    background: #fff;
    color: #313355;
    border: 1px solid #313355;
  }
  .search-form {
    width: 400px;
    margin-right: 10px;

    .ant-input-affix-wrapper {
      &:hover {
        border: 1px solid #ddd;
      }
    }
    .ant-input-affix-wrapper-focused {
      border-color: #fff;
      box-shadow: none;
      border: 1px solid #ddd;
    }
    .ant-input-search-button {
      background: #313355;
      color: #fff;
      border: 1px solid #313355;
    }
  }
  @media (max-width: 900px) {
    width: 100%;
  }
`;

const SearchContentForm = ({ contentType, router }) => {
  // local state

  const [content, onChangeContent] = useInput("");

  // event listener

  const onSubmit = useCallback(
    (value) => {
      if (value === "") {
        Router.push(`${router.route}`);
      } else {
        Router.push(`${router.route}/?term=${value}`);
      }
    },
    [router.route, content],
  );

  return (
    <SearchContentFormWrapper>
      <Input.Search
        className="search-form"
        placeholder="검색"
        allowClear
        enterButton
        onChange={onChangeContent}
        onSearch={onSubmit}
      />
      <Link href={`/articles/${contentType}/write`}>
        <a>
          <Button type="primary" className="write-btn">
            글쓰기
          </Button>
        </a>
      </Link>
    </SearchContentFormWrapper>
  );
};

export default withRouter(SearchContentForm);
