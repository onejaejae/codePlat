import React from "react";
import styled from "styled-components";
import LoginInputForm from "./LoginInputForm";

/**
 * @author 박진호
 * @version 1.0
 * @summary 로그인 컴포넌트 컨테이너
 */

// style

const LoginTemplateWrapper = styled.div`
  background: #fff;
  border-radius: 5px;
  padding: 40px;
  margin: 140px 0;
`;

const LoginTemplate = () => {
  return (
    <LoginTemplateWrapper>
      <LoginInputForm />
    </LoginTemplateWrapper>
  );
};

export default LoginTemplate;
