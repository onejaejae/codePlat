import React, { useEffect } from "react";
import WriteLayout from "../../../components/layout/WriteLayout";
import WriteForm from "../../../components/common/contents/WriteForm";
import Head from "next/head";
import { useDispatch, useSelector } from "react-redux";
import {
  loadPostRequestAction,
  initializePostAction,
} from "../../../reducers/post";
import { withRouter } from "next/router";
import wrapper from "../../../store/configureStore";
import { setUserRequestAction } from "../../../reducers/user";
import { END } from "redux-saga";
import client from "../../../lib/api/client";

/**
 * @author 박진호
 * @version 1.0
 * @summary 포스트 수정 페이지
 */

const PostEdit = ({ router }) => {
  // redux

  const dispatch = useDispatch();
  const { post } = useSelector((state) => state.post);

  // hooks

  useEffect(() => {
    dispatch(
      loadPostRequestAction({
        postId: router.query.id,
      }),
    );
    return () => {
      dispatch(initializePostAction());
    };
  }, [router]);

  if (!post) return null;

  return (
    <>
      <Head>
        <meta charSet="utf-8"></meta>
        <title>글수정</title>
      </Head>
      <WriteLayout>
        <WriteForm contentType={post.type} isEdit={true} />
      </WriteLayout>
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

export default withRouter(PostEdit);
