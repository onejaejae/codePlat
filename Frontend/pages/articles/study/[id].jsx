import React, { useEffect } from "react";
import PostViewerLayout from "../../../components/layout/PostViewerLayout";
import { useSelector, useDispatch } from "react-redux";
import {
  loadPostRequestAction,
  initializePostAction,
} from "../../../reducers/post";
import { withRouter } from "next/router";
import PostViewer from "../../../components/common/contents/PostViewer";
import Head from "next/head";
import wrapper from "../../../store/configureStore";
import { setUserRequestAction } from "../../../reducers/user";
import { END } from "redux-saga";
import client from "../../../lib/api/client";

/**
 * @author 박진호
 * @version 1.0
 * @summary 스터디 포스트 뷰어 페이지
 */

const StudyDetail = ({ router }) => {
  // redux

  const dispatch = useDispatch();
  const { post } = useSelector((state) => state.post);

  // hooks

  useEffect(() => {
    return () => {
      dispatch(initializePostAction());
    };
  }, [router]);

  return (
    <>
      <Head>
        <meta charSet="utf-8"></meta>
        <title>스터디</title>
      </Head>
      <PostViewerLayout contentType="study">
        {post && <PostViewer post={post} contentType="study" />}
      </PostViewerLayout>
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
    context.store.dispatch(
      loadPostRequestAction({ postId: context.params.id }),
    );
    context.store.dispatch(END);
    await context.store.sagaTask.toPromise();
  },
);

export default withRouter(StudyDetail);
