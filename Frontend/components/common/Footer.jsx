import React from "react";
import { Layout } from "antd";
import { Card } from "antd";
import styled from "styled-components";
import { Row, Col } from "antd";
import Link from "next/link";

/**
 * @author 박진호
 * @version 1.0
 * @summary 푸터 컴포넌트
 */

// style

const AntFooter = Layout.Footer;

const FooterWrapper = styled(AntFooter)`
  padding: 30px 50px;
  background: #16172b;
  color: #fff;
`;

const PartialStyle = {
  margin: "0 auto 24px",
  fontWeight: "bold",
};

const FooterAnchor = {
  color: "#D6D7D9",
};

const Footer = () => {
  return (
    <FooterWrapper>
      <div>
        <Row>
          <Col xs={0} lg={{ span: 6, offset: 2 }}>
            <div style={PartialStyle}>소개</div>
            <Card style={{ width: 250 }}>
              <p>
                <span
                  style={{
                    fontSize: "18px",
                    fontWeight: "500",
                    marginRight: "5px",
                  }}
                >
                  CodePlat
                </span>
                은 학생, 직장인, 프리랜서, 디자이너 등에게 프로젝트 혹은 스터디
                및 커뮤니티 기능을 제공하는 서비스 플랫폼입니다
              </p>
            </Card>
          </Col>

          <Col xs={12} lg={{ span: 6, offset: 2 }}>
            <div style={PartialStyle}>바로가기</div>
            <Link href="/articles/project">
              <a style={FooterAnchor}>프로젝트</a>
            </Link>
            <br />
            <Link href="/articles/study">
              <a style={FooterAnchor}>스터디</a>
            </Link>
            <br />
            <Link href="/articles/forum">
              <a style={FooterAnchor}>포럼</a>
            </Link>
          </Col>
          <Col xs={12} lg={{ span: 6, offset: 2 }}>
            <div style={PartialStyle}>고객센터</div>
            <Link href="#">
              <a style={FooterAnchor}>이용약관</a>
            </Link>
            <br />
            <Link href="#">
              <a style={FooterAnchor}>개인정보처리취급방침</a>
            </Link>
            <br />
            <Link href="#">
              <a style={FooterAnchor}>쿠키환경설정</a>
            </Link>
          </Col>
        </Row>
      </div>
      <div style={{ border: "0.5px solid gray", margin: "20px" }}></div>
      <div style={{ textAlign: "center" }}>@2021 Copyright all reserved</div>
    </FooterWrapper>
  );
};

export default Footer;
