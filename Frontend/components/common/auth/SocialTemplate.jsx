import React from "react";
import styled from "styled-components";
import { Button } from "antd";
import Link from "next/link";
import { SERVER_URL } from "../../../lib/constant/constant";

/**
 * @author 박진호
 * @version 1.0
 * @summary 소셜 로그인 컴포넌트
 */

// style

const SocialLoginWrapper = styled.div`
  display: flex;
  margin-bottom: 3px;
  font-weight: 300;
  .login-google {
    flex: 1;
  }
  .login-naver {
    margin-left: 3px;
    flex: 1;
  }
  .login-github {
    flex: 1;
  }
  .login-kakao {
    margin-left: 3px;

    flex: 1;
  }
`;

const SocialLoginButton = styled(Button)`
  width: 100%;
  color: #fff;
  font-size: 12px;
  &:hover {
    color: #fff;
    border: 1px solid #fff;
  }
`;

const SocialTemplate = () => {
  return (
    <>
      <SocialLoginWrapper>
        <div className="login-google">
          <Link href={`${SERVER_URL}/api/google`}>
            <a>
              <SocialLoginButton style={{ background: "#dd4b39" }}>
                Google
              </SocialLoginButton>
            </a>
          </Link>
        </div>
        <div className="login-naver">
          <Link href={`${SERVER_URL}/api/naver`}>
            <a>
              <SocialLoginButton style={{ background: "#00c300" }}>
                Naver
              </SocialLoginButton>
            </a>
          </Link>
        </div>
      </SocialLoginWrapper>
      <SocialLoginWrapper>
        <div className="login-github">
          <Link href={`${SERVER_URL}/api/github`}>
            <a>
              <SocialLoginButton style={{ background: "#333" }}>
                Github
              </SocialLoginButton>
            </a>
          </Link>
        </div>
        <div className="login-kakao">
          <Link href={`${SERVER_URL}/api/kakao`}>
            <a>
              <SocialLoginButton
                style={{ background: "#fee500", color: "black" }}
              >
                Kakao
              </SocialLoginButton>
            </a>
          </Link>
        </div>
      </SocialLoginWrapper>
    </>
  );
};

export default SocialTemplate;
