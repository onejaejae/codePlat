import React, { Component } from "react";
import Link from "next/link";
import { Layout, Menu, Button, Badge } from "antd";
import { BellOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { logoutRequestAction } from "../../reducers/user";
import firebase from "../../firebase";
import { connect } from "react-redux";

/**
 * @author 박진호
 * @version 1.0
 * @summary 헤더 컴포넌트(클래스형)
 * @note deprecated
 */

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
  @media (max-width: 950px) {
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

const MenuWrapper = styled(Menu)`
  background: #16172b;
  font-size: 18px;
  margin: 0 auto;
  height: 64px;

  .ant-menu-item-active {
    a:hover {
      color: #188fffad;
    }
    border-bottom: 2px solid transparent !important;
  }

  .ant-menu-submenu-title > span {
    color: white;
  }
  .ant-menu-item {
    a {
      color: white;
      font-weight: bold;
      margin: 0 40px;
    }
  }
  .ant-menu-item-selected {
    border-bottom: 2px solid transparent !important;
    a {
      color: #1890ff;
    }
  }
  @media (max-width: 950px) {
    display: none;
  }
`;

const MenuItemWrapper = styled(Menu.Item)``;

const ButtonGroup = styled.div`
  .btn-register {
    margin-left: 10px;
  }
  .btn-logout {
    margin-left: 10px;
  }
  @media (max-width: 768px) {
    .btn-logout {
      display: none;
    }
  }
`;

const BadgeWrapper = styled.div`
  margin-right: 60px;
`;

const MobileMenuWrapper = styled(Menu)`
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
  .ant-menu-item-active {
    a:hover {
      color: #188fffad;
    }
  }
  .ant-menu-item {
    a {
      color: white;
      font-weight: bold;
    }
  }
  .ant-menu-item-selected {
    a {
      color: #1890ff;
    }
  }
  @media (min-width: 950px) {
    display: none;
  }
`;

class Header extends Component {
  state = {
    currentMenu: null,
    globalCount: 0,
    chatRoomsRef: firebase.database().ref("chatRooms"),
  };

  onLogout = async () => {
    let user = firebase.auth().currentUser;
    if (user) {
      await firebase
        .auth()
        .signOut()
        .then(() => {
          console.log("firebase logout 성공");
        });
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

    this.props.dispatch(logoutRequestAction());
  };

  async componentDidMount() {
    let globalCount = 0;
    this.props.me &&
      this.state.chatRoomsRef.on("child_added", (DataSnapshot) => {
        if (DataSnapshot.val()[this.props.me.nickname]) {
          globalCount += DataSnapshot.val()[this.props.me.nickname].count;

          this.setState({ globalCount });
        }
      });
    this.props.me &&
      this.state.chatRoomsRef.on("child_changed", (DataSnapshot) => {
        console.log(DataSnapshot.val());
        if (DataSnapshot.val()[this.props.me.nickname]) {
          //console.log(DataSnapshot.val());
          //console.log(DataSnapshot.val()[me.nickname].count);

          //globalCount += DataSnapshot.val()[me.nickname].count;
          globalCount++;
          //setGlobalCount(globalCount);
          this.setState({ globalCount });
        }
        //globalCount = 0;
      });
    this.props.me &&
      this.state.chatRoomsRef.on("child_removed", (DataSnapshot) => {
        console.log("removed", DataSnapshot);
      });
  }

  componentWillUnmount() {
    this.state.chatRoomsRef.off();
  }

  render() {
    return (
      <HeaderWrapper>
        <InnerHeader>
          <Link href="/">
            <a>
              <LogoWrapper>Logo</LogoWrapper>
            </a>
          </Link>

          <MenuWrapper
            mode="horizontal"
            selectedKeys={[this.state.currentMenu]}
          >
            <MenuItemWrapper key="/articles/study" className="menu-study">
              <Link href="/articles/study">
                <a>스터디</a>
              </Link>
            </MenuItemWrapper>

            <MenuItemWrapper key="/articles/project" className="menu-project">
              <Link href="/articles/project">
                <a>프로젝트</a>
              </Link>
            </MenuItemWrapper>

            <MenuItemWrapper key="/articles/forum" className="menu-forum">
              <Link href="/articles/forum">
                <a>포럼</a>
              </Link>
            </MenuItemWrapper>
          </MenuWrapper>
          {this.props.me && (
            <BadgeWrapper>
              <Badge count={this.state.globalCount} offset={[20, 0]}>
                <Link href="/mypage">
                  <a className="head-example">
                    <BellOutlined />
                  </a>
                </Link>
              </Badge>
            </BadgeWrapper>
          )}

          {!this.props.me ? (
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
                onClick={this.onLogout}
                //loading={logoutLoading}
              >
                로그아웃
              </Button>
            </ButtonGroup>
          )}
        </InnerHeader>
        <MobileMenuWrapper selectedKeys={[this.state.currentMenu]}>
          <MenuItemWrapper key="/articles/study" className="menu-study">
            <Link href="/articles/study">
              <a>스터디</a>
            </Link>
          </MenuItemWrapper>

          <MenuItemWrapper key="/articles/project" className="menu-project">
            <Link href="/articles/project">
              <a>프로젝트</a>
            </Link>
          </MenuItemWrapper>

          <MenuItemWrapper key="/articles/forum" className="menu-forum">
            <Link href="/articles/forum">
              <a>포럼</a>
            </Link>
          </MenuItemWrapper>
        </MobileMenuWrapper>
      </HeaderWrapper>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    me: state.user.me,
    //chatRoom: state.chat.currentChatRoom,
  };
};

export default connect(mapStateToProps)(Header);
