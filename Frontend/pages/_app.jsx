import React from "react";
import PropTypes from "prop-types";
import "antd/dist/antd.css";
import Head from "next/head";
import wrapper from "../store/configureStore";
import withReduxSaga from "next-redux-saga";

/**
 * @author 박진호
 * @version 1.0
 * @summary 공통 페이지 정의 + title 정의
 */

const App = ({ Component }) => {
  return (
    <>
      <Head>
        <meta charSet="utf-8"></meta>
        <title>CodePlat</title>
      </Head>
      <Component></Component>
    </>
  );
};

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
};

export default wrapper.withRedux(withReduxSaga(App));
