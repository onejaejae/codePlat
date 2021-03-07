import React, { useEffect, useCallback, useState } from "react";
import ArticleLayout from "../../../components/layout/ArticleLayout";
import { useDispatch, useSelector } from "react-redux";
import {
  initializePostsAction,
  loadForumPostsRequestAction,
} from "../../../reducers/post";
import List from "../../../components/common/contents/List";
import { Spin, Radio, Select } from "antd";
import styled from "styled-components";
import Router, { withRouter } from "next/router";
import Head from "next/head";
import wrapper from "../../../store/configureStore";
import { setUserRequestAction } from "../../../reducers/user";
import { END } from "redux-saga";
import client from "../../../lib/api/client";

/**
 * @author 박진호
 * @version 1.0
 * @summary 포럼 포스트 리스트 뷰어 페이지
 */

// style

const SpinWrapper = styled.div`
  text-align: center;
  margin: 100px 0;
`;

const ForumFilterWrapper = styled.div`
  margin-bottom: 10px;
  .ant-radio-button-wrapper-checked {
    color: #888;
    text-decoration: underline;
    &:hover {
      color: #888;
    }
  }
  .ant-radio-button-wrapper {
    transition: none;
    &::before {
      display: none;
    }
    &:hover {
      text-decoration: underline;
    }
    background: transparent;
    color: #888;
    border: none;
    font-size: 12px;
    .ant-radio-button {
    }
    .ant-radio-button-checked {
      display: none;
    }
  }
`;

// helper variables

let skip = 0;

const Forum = ({ router }) => {
  // redux

  const dispatch = useDispatch();
  const { forumPosts, loadPostsLoading } = useSelector((state) => state.post);
  const { temporalPostsLength } = useSelector((state) => state.post);

  // local state

  const [radioValue, setRadioValue] = useState("latest");
  const [field, setField] = useState("전체");
  const { term } = router.query;

  // event listener

  const onChangeField = useCallback(
    (e) => {
      setField(e);
      if (term) {
        Router.push(`/articles/forum?term=${term}`);
      } else {
        Router.push(`/articles/forum`);
      }
    },
    [router],
  );

  const onClickRadio = useCallback((e) => {
    setRadioValue(e.target.value);
  }, []);

  const onClickSort = useCallback(
    (e) => {
      if (term) {
        Router.push(`/articles/forum?term=${term}`);
      } else {
        Router.push(`/articles/forum`);
      }
    },
    [router],
  );

  // helper method

  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;
    if (window.pageYOffset + clientHeight >= scrollHeight && !loadPostsLoading) {
      if (temporalPostsLength >= 10) {
        dispatch(
          loadForumPostsRequestAction({
            type: radioValue,
            skip,
            term: router.query.term,
            field,
          }),
        );
      }
      skip += 10;
    }
  };

  // hooks

  useEffect(() => {
    dispatch(
      loadForumPostsRequestAction({
        type: radioValue,
        term: router.query.term,
        skip,
        field,
      }),
    );
    skip += 10;

    return () => {
      skip = 0;
      dispatch(initializePostsAction());
    };
  }, [router]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [temporalPostsLength]);

  return (
    <>
      <Head>
        <meta charSet="utf-8"></meta>
        <title>포럼</title>
      </Head>
      <ArticleLayout contentType="forum">
        <ForumFilterWrapper>
          <Select defaultValue="전체" onChange={onChangeField}>
            <Select.Option value="전체">전체</Select.Option>
            <Select.Option value="자유">자유</Select.Option>
            <Select.Option value="QnA">QnA</Select.Option>
          </Select>
          <Radio.Group onChange={onClickRadio} defaultValue="latest">
            <Radio.Button value="latest" onClick={onClickSort}>
              최신순
            </Radio.Button>
            <Radio.Button value="likes" onClick={onClickSort}>
              추천순
            </Radio.Button>
            <Radio.Button value="comments" onClick={onClickSort}>
              댓글순
            </Radio.Button>
            <Radio.Button value="scraps" onClick={onClickSort}>
              스크랩순
            </Radio.Button>
            <Radio.Button value="views" onClick={onClickSort}>
              조회순
            </Radio.Button>
          </Radio.Group>
        </ForumFilterWrapper>
        <List data={forumPosts} type="forum" />
        {loadPostsLoading && (
          <SpinWrapper>
            <Spin tip="불러오는중..." />
          </SpinWrapper>
        )}
      </ArticleLayout>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  async (context) => {
    const cookie = context.req ? context.req.headers.cookie : "";
    client.defaults.headers.Cookie = "";
    if (context.req && cookie) {
      client.defaults.withCredentials = true;
      client.defaults.headers.Cookie = cookie;
    }
    context.store.dispatch(setUserRequestAction());
    // context.store.dispatch(
    //   loadForumPostsRequestAction({
    //     type: "latest",
    //     term: "",
    //     skip: 0,
    //     field: "QnA",
    //   }),
    // );
    context.store.dispatch(END);
    await context.store.sagaTask.toPromise();
  },
);

export default withRouter(Forum);
