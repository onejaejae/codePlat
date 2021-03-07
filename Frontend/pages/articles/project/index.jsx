import React, { useEffect, useState, useCallback } from "react";
import ArticleLayout from "../../../components/layout/ArticleLayout";
import { useDispatch, useSelector } from "react-redux";
import {
  loadPostsReqeustAction,
  initializePostsAction,
} from "../../../reducers/post";
import List from "../../../components/common/contents/List";
import { Spin, Select } from "antd";
import styled from "styled-components";
import { withRouter } from "next/router";
import Head from "next/head";
import { Locations } from "../../../lib/constant/constant";
import wrapper from "../../../store/configureStore";
import { setUserRequestAction } from "../../../reducers/user";
import { END } from "redux-saga";
import client from "../../../lib/api/client";

/**
 * @author 박진호
 * @version 1.0
 * @summary 프로젝트 포스트 리스트 뷰어 페이지
 */

// style

const SelectLocationWrapper = styled.div`
  text-align: right;
  margin-bottom: 10px;
`;

const Label = styled.span`
  font-weight: 500;
`;

const SpinWrapper = styled.div`
  text-align: center;
  margin: 100px 0;
`;

// helper variables

let skip = 0;
const LocationSelectChildren = [];
Locations.forEach((v, i) => {
  LocationSelectChildren.push(
    <Select.Option key={v.key}>{v.value}</Select.Option>,
  );
});

const Project = ({ router }) => {
  // redux

  const dispatch = useDispatch();
  const { skill } = useSelector((state) => state.skill);
  const { projectPosts, loadPostsLoading } = useSelector((state) => state.post);
  const { temporalPostsLength } = useSelector((state) => state.post);

  // local state

  const [location, setLocation] = useState("전체");

  // event listener

  const onChangeLocation = useCallback((value) => {
    setLocation(value);
  }, []);

  // helper method


  // hooks

  useEffect(() => {
    dispatch(
      loadPostsReqeustAction({
        type: "project",
        term: router.query.term,
        skip,
        techStack: skill,
        location,
      }),
    );
    skip += 10;

    return () => {
      skip = 0;
      dispatch(initializePostsAction());
    };
  }, [router, skill, location]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;

      if (scrollTop + clientHeight > scrollHeight - 300) {
        if (!loadPostsLoading) {
          if (temporalPostsLength >= 10) {
            dispatch(
              loadPostsReqeustAction({
                type: "project",
                skip,
                techStack: skill,
                term: router.query.term,
                location,
              }),
            );
            skip += 10;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [temporalPostsLength, loadPostsLoading, projectPosts]);

  return (
    <>
      <Head>
        <meta charSet="utf-8"></meta>
        <title>프로젝트</title>
      </Head>
      <ArticleLayout contentType="project">
        <SelectLocationWrapper>
          <Label style={{ lineHeight: "32px" }}>지역</Label>
          <Select
            defaultValue="전체"
            bordered={false}
            style={{ color: "#999" }}
            onChange={onChangeLocation}
          >
            {LocationSelectChildren}
          </Select>
        </SelectLocationWrapper>
        <List data={projectPosts} type="project" />
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
    context.store.dispatch(END);
    await context.store.sagaTask.toPromise();
  },
);

export default withRouter(Project);
