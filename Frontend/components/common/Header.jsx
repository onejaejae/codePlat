import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Layout, Menu, Button, Badge } from "antd";
import { BellOutlined } from "@ant-design/icons";
import styled, { css } from "styled-components";
import { withRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { logoutRequestAction } from "../../reducers/user";
import firebase from "../../firebase";

/**
 * @author 박진호
 * @version 1.0
 * @summary 헤더 컴포넌트(함수형)
 */

// style

const AntHeader = Layout.Header;

const HeaderWrapper = styled(AntHeader)`
  position: fixed;
  z-index: 10;
  width: 100%;
  background: #16172b;
`;

const InnerHeader = styled.div`
  width: 1300px;
  margin: 0 auto;
  display: flex;
  .ant-menu-horizontal {
    border: none;
  }
  @media (max-width: 1368px) {
    width: 100%;
  }
  @media (max-width: 1368px) {
    justify-content: space-between;
  }
`;

const LogoWrapper = styled.div`
  float: left;
  cursor: pointer;
  color: #fff;
  text-align: center;
  font-weight: bold;
  font-size: 20px;
  width: 100px;
`;

const MenuWrapper = styled.div`
  background: #16172b;
  font-size: 18px;
  margin: 0 auto;
  height: 64px;
  display: flex;

  @media (max-width: 950px) {
    display: none;
  }
`;

const MenuItemWrapper = styled.div`
  padding: 0 30px;

  a {
    color: #fff;
    font-weight: 500;
    ${(props) => {
      if (props.currentMenu) {
        return css`
          color: #1890ff;
        `;
      }
    }}
  }
`;

const ButtonGroup = styled.div`
  .btn-register {
    margin-left: 10px;
    background: #313355;
    border: 1px solid #313355;
    &:hover {
      border: 1px solid #16172b;
    }
  }
  .btn-logout {
    margin-left: 10px;
    background: #313355;
    border: 1px solid #313355;
    &:hover {
      border: 1px solid #16172b;
    }
  }
  .btn-login {
    &:hover {
      color: #313355;
      border: 1px solid #313355;
    }
  }
  .btn-mypage {
    &:hover {
      color: #313355;
      border: 1px solid #313355;
    }
  }
  @media (max-width: 1368px) {
    .btn-login,
    .btn-register {
      width: 50px;
      font-size: 11px;
      padding: 0;
    }
    .btn-mypage,
    .btn-logout {
      width: 41px;
      font-size: 8px;
      padding: 0;
    }
  }
`;

const BadgeWrapper = styled.div`
  margin-right: 60px;
`;

const MobileMenuWrapper = styled.div`
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  width: 100%;
  margin: 0;
  background: #16172bcc;
  z-index: 10;
  display: flex;
  justify-content: center;
  ${(props) => {
    if (props.currentMenu) {
      return css`
        color: #1890ff;
      `;
    }
  }}
  @media (min-width: 950px) {
    display: none;
  }
`;

const Header = ({ router }) => {
  // redux

  const dispatch = useDispatch();
  const { me, logoutLoading } = useSelector((state) => state.user);

  // local state

  const [currentMenu, setCurrentMenu] = useState(null);
  const [globalCount, setGlobalCount] = useState(0);
  const [chatRoomsRef, setChatRoomsRef] = useState(
    firebase.database().ref("chatRooms"),
  );

  // event listener

  const onLogout = useCallback(async () => {
    let user = firebase.auth().currentUser;
    if (user) {
      await firebase
        .auth()
        .signOut()
        .then(() => {});
      let firebaseMe = null;
      await firebase
        .database()
        .ref("users")
        .child(user.uid)
        .once("value", function (data) {
          firebaseMe = data.val();
        });
      await firebase
        .database()
        .ref("users")
        .child(user.uid)
        .update({ ...firebaseMe, isInMypage: false });
    }

    dispatch(logoutRequestAction());
  }, []);

  useEffect(async () => {
    setTimeout(() => {
      let globalCount = 0;
      let tmpChatRoomInfo = [];
      me &&
        chatRoomsRef.on("child_changed", (DataSnapshot) => {
          if (DataSnapshot.val()[me.nickname]) {
            globalCount++;
            setGlobalCount(globalCount);
          } else {
            tmpChatRoomInfo.forEach((v, i) => {
              if (v.chatRoomId === DataSnapshot.val().id) {
                globalCount -= v.count;
              }
            });
            setGlobalCount(globalCount);
          }
        });
      me &&
        chatRoomsRef.on("child_added", (DataSnapshot) => {
          if (DataSnapshot.val()[me.nickname]) {
            globalCount += DataSnapshot.val()[me.nickname].count;
            tmpChatRoomInfo.push(DataSnapshot.val()[me.nickname]);
            setGlobalCount(globalCount);
          }
        });
      me &&
        chatRoomsRef.on("child_removed", (DataSnapshot) => {
          // deprecated.
        });
    }, 700);
  }, []);

  // hooks

  useEffect(() => {
    const route = router.route.split("/");
    setCurrentMenu(`${route[2]}`);
  }, [router]);

  useEffect(() => {
    return () => chatRoomsRef.off();
  }, []);

  return (
    <HeaderWrapper>
      <InnerHeader>
        <Link href="/">
          <a>
            <LogoWrapper>CodePlat</LogoWrapper>
          </a>
        </Link>

        <MenuWrapper>
          <MenuItemWrapper
            key="/articles/study"
            className="menu-study"
            currentMenu={currentMenu === "study" ? true : false}
          >
            <Link href="/articles/study">
              <a>스터디</a>
            </Link>
          </MenuItemWrapper>

          <MenuItemWrapper
            key="/articles/project"
            className="menu-project"
            currentMenu={currentMenu === "project" ? true : false}
          >
            <Link href="/articles/project">
              <a>프로젝트</a>
            </Link>
          </MenuItemWrapper>

          <MenuItemWrapper
            key="/articles/forum"
            className="menu-forum"
            currentMenu={currentMenu === "forum" ? true : false}
          >
            <Link href="/articles/forum">
              <a>포럼</a>
            </Link>
          </MenuItemWrapper>
        </MenuWrapper>
        {me && (
          <BadgeWrapper>
            <Badge count={globalCount} offset={[20, 0]}>
              <Link href="/mypage">
                <a className="head-example">
                  <BellOutlined style={{ color: "#fff" }} />
                </a>
              </Link>
            </Badge>
          </BadgeWrapper>
        )}

        {!me ? (
          <ButtonGroup>
            <Link href="/auth/login">
              <a>
                <Button className="btn-login">로그인</Button>
              </a>
            </Link>
            <Link href="/auth/register">
              <a>
                <Button className="btn-register" type="primary">
                  회원가입
                </Button>
              </a>
            </Link>
          </ButtonGroup>
        ) : (
          <ButtonGroup>
            <Link href="/mypage">
              <a>
                <Button className="btn-mypage">마이페이지</Button>
              </a>
            </Link>
            <Button
              className="btn-logout"
              type="primary"
              onClick={onLogout}
              loading={logoutLoading}
            >
              로그아웃
            </Button>
          </ButtonGroup>
        )}
      </InnerHeader>
      <MobileMenuWrapper>
        <MenuItemWrapper
          key="/articles/study"
          className="menu-study"
          currentMenu={currentMenu === "study" ? true : false}
        >
          <Link href="/articles/study">
            <a>스터디</a>
          </Link>
        </MenuItemWrapper>

        <MenuItemWrapper
          key="/articles/project"
          className="menu-project"
          currentMenu={currentMenu === "project" ? true : false}
        >
          <Link href="/articles/project">
            <a>프로젝트</a>
          </Link>
        </MenuItemWrapper>

        <MenuItemWrapper
          key="/articles/forum"
          className="menu-forum"
          currentMenu={currentMenu === "forum" ? true : false}
        >
          <Link href="/articles/forum">
            <a>포럼</a>
          </Link>
        </MenuItemWrapper>
      </MobileMenuWrapper>
    </HeaderWrapper>
  );
};

export default withRouter(Header);
