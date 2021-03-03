import React from "react";
import RegisterInputForm from "./RegisterInputForm";
import styled from "styled-components";

/**
 * @author 박진호
 * @version 1.0
 * @summary 회원가입 컴포넌트 컨테이너
 */

// style

const RegisterTemplateWrapper = styled.div`
  background: #fff;
  border-radius: 5px;
  padding: 40px;
  margin-top: 40px;
  margin-bottom: 180px;
`;

const RegisterTemplate = () => {
  return (
    <RegisterTemplateWrapper>
      <RegisterInputForm />
    </RegisterTemplateWrapper>
  );
};

export default RegisterTemplate;
