import React from "react";
import WriteLayout from "../../../components/layout/WriteLayout";
import WriteForm from "../../../components/common/contents/WriteForm";
import Head from "next/head";
import wrapper from "../../../store/configureStore";
import { setUserRequestAction } from "../../../reducers/user";
import { END } from "redux-saga";
import client from "../../../lib/api/client";

/**
 * @author 박진호
 * @version 1.0
 * @summary 프로젝트 포스트 글쓰기 페이지
 */

const ProjectWrite = () => {
  return (
    <>
      <Head>
        <meta charSet="utf-8"></meta>
        <title>프로젝트 | 글쓰기</title>
      </Head>
      <WriteLayout>
        <WriteForm contentType="project" />
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

export default ProjectWrite;
