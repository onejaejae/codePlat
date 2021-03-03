import React from "react";
import AuthLayout from "../../components/layout/AuthLayout";
import RegisterTemplate from "../../components/auth/RegisterTemplate";
import Head from "next/head";

/**
 * @author 박진호
 * @version 1.0
 * @summary 회원가입 페이지
 */

const register = () => {
  return (
    <>
      <Head>
        <meta charSet="utf-8"></meta>
        <title>회원가입</title>
      </Head>
      <AuthLayout type="register">
        <RegisterTemplate />
      </AuthLayout>
    </>
  );
};

export default register;
