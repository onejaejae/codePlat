import React from "react";
import styled from "styled-components";

/**
 * @author 박진호
 * @version 1.0
 * @summary deprecated.
 */

const ScrapNeedLoginWrapper = styled.div`
  background: #fff;
  padding: 50px;
  text-align: center;
`;

const ScrapNeedLogin = () => {
  return (
    <ScrapNeedLoginWrapper>
      <h3>로그인이 필요한 서비스입니다.</h3>
    </ScrapNeedLoginWrapper>
  );
};

export default ScrapNeedLogin;
