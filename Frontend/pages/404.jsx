import React from "react";
import Link from "next/link";
import Head from "next/head";
import styled from "styled-components";
import Footer from "../components/common/Footer";

/**
 * @author 박진호
 * @version 1.0
 * @summary 커스텀 404 error page
 */

const ErrorPageWrapper = styled.div`
  width: 400px;
  height: 300px;
  border: 1px solid #eee;
  margin: 290px auto;
  border-radius: 5px;
`;

const ErrorPage = () => {
  return (
    <>
      <ErrorPageWrapper>
        <Head>
          <meta charSet="utf-8"></meta>
          <title>Page Not Found</title>
        </Head>
        <div
          style={{
            fontSize: "20px",
            fontWeight: "500",
            textAlign: "center",
            padding: "30px",
          }}
        >
          404 Not Found.
        </div>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          😵 요청하신 페이지가 존재하지 않습니다.
        </div>
        <div style={{ textAlign: "center" }}>
          <Link href="/">
            <a style={{ color: "#999", textDecoration: "underline" }}>홈으로</a>
          </Link>
        </div>
      </ErrorPageWrapper>
      <Footer />
    </>
  );
};

export default ErrorPage;
