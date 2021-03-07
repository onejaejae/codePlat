import React, { useEffect } from "react";
import { Layout, Row, Col, Skeleton } from "antd";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import styled from "styled-components";
import MyProfile from "../components/home/MyProfile";
import ContentTemplate from "../components/home/ContentTemplate";
import { useDispatch, useSelector } from "react-redux";
import List from "../components/common/contents/List";
import {
  mainLoadPostsReqeustAction,
  initializePostsAction,
} from "../reducers/post";
import { END } from "redux-saga";
import wrapper from "../store/configureStore";
import { setUserRequestAction } from "../reducers/user";
import firebase from "../firebase";
import client from "../lib/api/client";
import logo from "../statics/logo.png";

/**
 * @author 박진호
 * @version 1.0
 * @summary 메인페이지 - 커뮤니티 인기글, 스터디 및 프로젝트 최신글, 유저정보를
 * getServerSideProps SSR로 불러온다
 */

// style

const Content = Layout.Content;

const ContentWrapper = styled(Content)`
  width: 1300px;
  margin: 100px auto;

  @media (max-width: 1368px) {
    & {
      width: 100%;
    }
  }
  @media (max-width: 950px) {
    & {
      margin: 125px auto;
    }
  }
`;

const ListWrapper = styled.div`
  padding: 20px;
`;

const MainLoadingSkeleton = styled(Skeleton)`
  margin-bottom: 10px;
`;

const MainInfoWrapper = styled.div`
  padding: 20px;
  width: 100%;
 
  position: relative;

  @media (max-width: 1368px) {
    .main-info-content {
      position: relative;
      width: 100%;
      height: 100%;
    }
    .main-info-back {
      display: none;
    }
  }
`;

const MainInfoContent = styled.div`
  padding: 20px;
  
  background: #fff;
  z-index: 2;
  .logo-image {
    width: 90%;
  }
  @media (max-width: 1368px){
  
    .logo-image {
      width: 75%;
    }
  }
`;

const MainInfoBackground = styled.div`
  position: absolute;
  top: 90px;
  left: 60px;
  width: 340px;
  height: 400px;
  background: #16172a;
  z-index: 1;
`;

const index = () => {
  // redux

  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  const {
    studyPosts,
    projectPosts,
    forumPosts,
    mainLoadPostsLoading,
  } = useSelector((state) => state.post);

  // hooks

  useEffect(() => {
    return () => {
      dispatch(initializePostsAction());
    };
  }, []);

  useEffect(async () => {
    if (me) {
      await firebase.auth().signInWithEmailAndPassword(me.email, me.email);
    }
  }, [me]);

  return (
    <Layout>
      <Header />
      <ContentWrapper>
        <Row>
          {me ? (
            <Col xs={24} sm={8} md={8}>
              <Row>
                <Col xs={24} sm={24} md={24}>
                  <MyProfile me={me} />
                </Col>
              </Row>
              <Row>
                <MainInfoWrapper>
                  <MainInfoContent className="main-info-content">
                    <div style={{ textAlign: "center" }}>
                      <img className="logo-image" src={logo} alt="logo" />
                    </div>
                    <p
                      style={{
                        color: "#999",
                        fontSize: "12px",
                        marginTop: "20px",
                        textAlign: "center",
                      }}
                    >
                      "학생, 직장인, 프리랜서, 디자이너 등에게 프로젝트 혹은
                      스터디 및 커뮤니티 기능을 제공하는 서비스 플랫폼입니다."
                    </p>
                  </MainInfoContent>
                  
                </MainInfoWrapper>
              </Row>
              <Row>
                <Col xs={24} sm={24} md={24}>
                  {mainLoadPostsLoading ? (
                    <ListWrapper>
                      {Array(8)
                        .fill(null)
                        .map((v, i) => (
                          <MainLoadingSkeleton active loading key={i} />
                        ))}
                    </ListWrapper>
                  ) : (
                    <ContentTemplate forumData={forumPosts} />
                  )}
                </Col>
              </Row>
            </Col>
          ) : (
            <Col xs={24} sm={8} md={8}>
              <Row>
                <MainInfoWrapper>
                  <MainInfoContent className="main-info-content">
                    <div style={{ textAlign: "center" }}>
                      <img className="logo-image" src={logo} alt="logo" />
                    </div>
                    <p
                      style={{
                        color: "#999",
                        fontSize: "12px",
                        marginTop: "20px",
                        textAlign: "center",
                      }}
                    >
                      "학생, 직장인, 프리랜서, 디자이너 등에게 프로젝트 혹은
                      스터디 및 커뮤니티 기능을 제공하는 서비스 플랫폼입니다."
                    </p>
                  </MainInfoContent>
                  
                </MainInfoWrapper>
              </Row>
              {mainLoadPostsLoading ? (
                <ListWrapper>
                  {Array(8)
                    .fill(null)
                    .map((v, i) => (
                      <MainLoadingSkeleton active loading key={i} />
                    ))}
                </ListWrapper>
              ) : (
                <ContentTemplate forumData={forumPosts} />
              )}
            </Col>
          )}

          <Col xs={24} sm={16} md={16}>
            <Row>
              <Col xs={24} sm={24} md={24}>
                <div
                  style={{
                    padding: "20px",
                    paddingBottom: "0",
                  }}
                >
                  <div>
                    <span style={{ fontSize: "18px", fontWeight: "600" }}>
                      스터디
                    </span>
                  </div>
                  <div>
                    <span style={{ fontSize: "12px", color: "#999" }}>
                      스터디 모집, 참여 공간입니다. 관심있는 스터디에 지원하거나
                      팀원을 모집해보세요.
                    </span>
                  </div>
                </div>
                {mainLoadPostsLoading ? (
                  <ListWrapper>
                    {Array(5)
                      .fill(null)
                      .map((v, i) => (
                        <MainLoadingSkeleton active loading key={i} />
                      ))}
                  </ListWrapper>
                ) : (
                  <ListWrapper>
                    <List data={studyPosts} type="study"></List>
                  </ListWrapper>
                )}
              </Col>
            </Row>
            <Row>
              <Col xs={24} sm={24} md={24}>
                <div
                  style={{
                    padding: "20px",
                    paddingBottom: "0",
                  }}
                >
                  <div>
                    <span style={{ fontSize: "18px", fontWeight: "600" }}>
                      프로젝트
                    </span>
                  </div>
                  <div>
                    <span style={{ fontSize: "12px", color: "#999" }}>
                      프로젝트 모집, 참여 공간입니다. 관심있는 프로젝트에
                      지원하거나 팀원을 모집해보세요.
                    </span>
                  </div>
                </div>
                {mainLoadPostsLoading ? (
                  <ListWrapper>
                    {Array(5)
                      .fill(null)
                      .map((v, i) => (
                        <MainLoadingSkeleton active loading key={i} />
                      ))}
                  </ListWrapper>
                ) : (
                  <ListWrapper>
                    <List data={projectPosts} type="project"></List>
                  </ListWrapper>
                )}
              </Col>
            </Row>
          </Col>
        </Row>
      </ContentWrapper>
      <Footer />
    </Layout>
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
    context.store.dispatch(mainLoadPostsReqeustAction());
    context.store.dispatch(END);
    await context.store.sagaTask.toPromise();
  },
);

export default index;
