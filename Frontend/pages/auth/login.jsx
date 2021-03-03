import React from "react";
import AuthLayout from "../../components/layout/AuthLayout";
import LoginTemplate from "../../components/auth/LoginTemplate";
import Head from "next/head";

/**
 * @author 박진호
 * @version 1.0
 * @summary 로그인 페이지
 */

const login = () => {
  return (
    <>
      <Head>
        <meta charSet="utf-8"></meta>
        <title>로그인</title>
      </Head>
      <AuthLayout type="login">
        <LoginTemplate />
      </AuthLayout>
    </>
  );
};

export default login;
