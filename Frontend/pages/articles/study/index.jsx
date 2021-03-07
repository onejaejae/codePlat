import React, { useEffect, useCallback, useState } from "react";
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
 * @summary 스터디 포스트 리스트 뷰어 페이지
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

const Study = ({ router }) => {
  // redux

  const dispatch = useDispatch();
  const { skill } = useSelector((state) => state.skill);
  const { studyPosts, loadPostsLoading } = useSelector((state) => state.post);
  const { temporalPostsLength } = useSelector((state) => state.post);

  // local state

  const [location, setLocation] = useState("전체");

  // event listener

  const onChangeLocation = useCallback((value) => {
    setLocation(value);
  }, []);

  // helper method

  // const handleScroll = () => {
  //   const scrollHeight = document.documentElement.scrollHeight - 300;
  //   const scrollTop = document.documentElement.scrollTop;
  //   const clientHeight = document.documentElement.clientHeight;

  //   if (window.scrollY + clientHeight >= scrollHeight && !loadPostsLoading) {
  //     if (temporalPostsLength >= 10) {
  //       dispatch(
  //         loadPostsReqeustAction({
  //           type: "study",
  //           skip,
  //           techStack: skill,
  //           term: router.query.term,
  //           location,
  //         }),
  //       );
  //       skip += 10;
  //     }
  //   }
  // };

  // hooks

  useEffect(() => {
    dispatch(
      loadPostsReqeustAction({
        type: "study",
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

  // useEffect(() => {
    
  //   window.addEventListener("scroll", handleScroll);
  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, [temporalPostsLength]);

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
                type: "study",
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
  }, [temporalPostsLength, loadPostsLoading, studyPosts]);

  return (
    <>
      <Head>
        <meta charSet="utf-8"></meta>
        <title>스터디</title>
      </Head>
      <ArticleLayout contentType="study">
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
        <List data={studyPosts} type="study" />
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
    //console.log(context);

    const cookie = context.req ? context.req.headers.cookie : "";
    client.defaults.headers.Cookie = "";
    if (context.req && cookie) {
      //console.log("fuckcookie", cookie);
      client.defaults.withCredentials = true;
      client.defaults.headers.Cookie = cookie;
    }
    context.store.dispatch(setUserRequestAction());
    //context.store.dispatch(mainLoadPostsReqeustAction());
    //context.store.dispatch(END);
    context.store.dispatch(END);
    await context.store.sagaTask.toPromise();
  },
);

export default withRouter(Study);
