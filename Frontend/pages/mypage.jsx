import React, { Component } from "react";
import { Menu, Badge } from "antd";
import {
  AppstoreOutlined,
  MailOutlined,
  UserOutlined,
} from "@ant-design/icons";
import MypageLayout from "../components/layout/MypageLayout";
import MyActivityTemplate from "../components/mypage/MyActivityTemplate";
import styled from "styled-components";
import Head from "next/head";
import EditProfile from "../components/mypage/EditProfile";
import ChatContainer from "../components/chat/ChatContainer";
import wrapper from "../store/configureStore";
import { setUserRequestAction } from "../reducers/user";
import { END } from "redux-saga";
import client from "../lib/api/client";
import firebase from "../firebase";
import { setCurrentChatRoomAction } from "../reducers/chat";
import { connect } from "react-redux";

/**
 * @author 박진호
 * @version 1.0
 * @summary 마이페이지 - 프로필수정, 내 활동, 채팅 기능 구현.
 * @note 함수형 컴포넌트와 firebase realtime database가 충돌하는 이슈가 있어 클래스형으로 리팩토링
 */

// style

const { SubMenu } = Menu;

const MenuWrapper = styled.div`
  display: flex;
  .menu-bar {
    flex: 1;
    width: 200px;
    height: 90vh;
    .ant-menu-item {
      &:hover {
        color: #111;
      }
    }
    .ant-menu-item-selected {
      background: #4f528a;
      color: #fff;
      &::after {
        border-right: none;
      }
      &:hover {
        color: #fff;
      }
    }
    .ant-menu-submenu-title {
      &:hover {
        color: #111;
        .ant-menu-submenu-arrow {
          color: #111;
        }
      }
    }
  }
  .menu-content {
    flex: 4;
  }
  @media (max-width: 768px) {
    flex-direction: column;
    .menu-bar {
      height: 100%;
      width: 100%;
    }
    .menu-content {
      margin-bottom: 3rem;
    }
  }
`;

class mypage extends Component {
  constructor(props, context) {
    super(props, context);
    this.componentCleanup = this.componentCleanup.bind(this);
  }

  // local state

  state = {
    chatRoomsRef: firebase.database().ref("chatRooms"),
    messagesRef: firebase.database().ref("messages"),
    chatRooms: [],
    chatRoomsLoading: false,
    firstLoad: true,
    notifications: [],
    currentMenu: "profile",
    chatRoomKey: "",
  };

  // event listener

  onChangeCurrentMenu = (e) => {
    if (e.key === "profile" || e.key == "activity") {
      this.props.dispatch(setCurrentChatRoomAction(null));
    }
    this.setState({ currentMenu: e.key });
  };

  setChatRoomKey = (id) => {
    this.setState({ chatRoomKey: id });
  };

  onSetCurrentChatRoom = (chatRoom) => {
    this.props.dispatch(setCurrentChatRoomAction(chatRoom));
    this.clearNotifications(chatRoom.id);
  };

  addChatRoomListener = () => {
    let chatRoomsArray = [];

    this.state.chatRoomsRef.on("child_added", (DataSnapshot) => {
      let flag = false;
      DataSnapshot.val().users.forEach((v, i) => {
        if (v.nickname === this.props.me.nickname) {
          flag = true;
        }
      });

      if (flag) {
        chatRoomsArray.push(DataSnapshot.val());
        this.setState({ chatRooms: chatRoomsArray });
        this.setState({ chatRoomsLoading: true });
        this.addNotificationListener(DataSnapshot.key, DataSnapshot.val());
      }
    });
    this.setState({ chatRoomsLoading: false });
  };

  addNotificationListener = (chatRoomId, chatRoomInfo) => {
    this.state.messagesRef.child(chatRoomId).on("value", (DataSnapshot) => {
      this.handleNotifications(
        chatRoomId,
        this.props.chatRoom ? this.props.chatRoom.id : "",
        this.state.notifications,
        DataSnapshot,
        chatRoomInfo,
      );
    });
  };

  // helper method

  handleNotifications = async (
    chatRoomId,
    currentChatRoomId,
    notifications,
    DataSnapshot,
    chatRoomInfo,
  ) => {
    let lastTotal = 0;

    let index = notifications.findIndex(
      (notification) => notification.id === chatRoomId,
    );

    if (index === -1) {
      let firebaseSnapshot = null;
      await firebase
        .database()
        .ref(`/chatRooms/${chatRoomId}/${this.props.me.nickname}`)
        .once("value")
        .then((snapshot) => {
          firebaseSnapshot = snapshot.val();
        });

      if (firebaseSnapshot) {
        notifications.push({
          id: chatRoomId,
          total: firebaseSnapshot.total,
          lastKnownTotal: firebaseSnapshot.lastKnownTotal,
          count: firebaseSnapshot.count,
        });
      } else {
        notifications.push({
          id: chatRoomId,
          total: DataSnapshot.numChildren(),
          lastKnownTotal: DataSnapshot.numChildren(),
          count: 0,
        });
      }
    } else {
      if (chatRoomId !== currentChatRoomId) {
        lastTotal = notifications[index].lastKnownTotal;

        if (DataSnapshot.numChildren() - lastTotal > 0) {
          notifications[index].count = DataSnapshot.numChildren() - lastTotal;
        }
      } else {
        notifications[index].lastKnownTotal = DataSnapshot.numChildren();
      }
      notifications[index].total = DataSnapshot.numChildren();
    }
    this.setState({ notifications });
  };

  clearNotifications = async (currentChatRoomId) => {
    let index = this.state.notifications.findIndex(
      (notification) => notification.id === currentChatRoomId,
    );

    if (index !== -1) {
      let updatedNotifications = [...this.state.notifications];
      updatedNotifications[index].lastKnownTotal = this.state.notifications[
        index
      ].total;
      updatedNotifications[index].count = 0;
      this.setState({ notifications: updatedNotifications });
      await this.state.chatRoomsRef
        .child(currentChatRoomId)
        .child(this.props.me.nickname)
        .remove();
    }
  };

  getNotificationCount = (chatRoom) => {
    let count = 0;

    this.state.notifications.forEach((notification) => {
      if (notification.id === chatRoom.id) {
        count = notification.count;
      }
    });

    if (count > 0) {
      return count;
    }
  };

  setFirstChatRoom = () => {
    const firstChatRoom = this.state.chatRooms[0];
    if (this.state.firstLoad && this.state.chatRooms.length > 0) {
      this.props.dispatch(setCurrentChatRoomAction(firstChatRoom));
    }
    this.setState({ firstLoad: false });
  };

  // life cycle method

  componentCleanup = () => {
    let lastKnown = [];
    this.state.notifications.forEach((notification, i) => {
      if (notification.total !== notification.lastKnownTotal) {
        lastKnown.push({
          chatRoomId: notification.id,
          user: this.props.me.nickname,
          total: notification.total,
          lastKnownTotal: notification.lastKnownTotal,
          count: notification.count,
        });
      }
    });
    if (lastKnown) {
      lastKnown.forEach(async (v, i) => {
        await this.state.chatRoomsRef
          .child(v.chatRoomId)
          .child(this.props.me.nickname)
          .update({ ...v });
      });
    }
  };

  async componentDidMount() {
    await firebase
      .auth()
      .signInWithEmailAndPassword(this.props.me.email, this.props.me.email);
    let firebaseMe = null;
    let user = firebase.auth().currentUser;
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
      .update({ ...firebaseMe, isInMypage: true });

    window.addEventListener("beforeunload", this.componentCleanup);

    this.addChatRoomListener();
  }

  async componentWillUnmount() {
    let firebaseMe = null;
    let user = firebase.auth().currentUser;
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

    window.removeEventListener("beforeunload", this.componentCleanup);

    let lastKnown = [];
    this.state.notifications.forEach((notification, i) => {
      if (notification.total !== notification.lastKnownTotal) {
        lastKnown.push({
          chatRoomId: notification.id,
          user: this.props.me.nickname,
          total: notification.total,
          lastKnownTotal: notification.lastKnownTotal,
          count: notification.count,
        });
      }
    });
    if (lastKnown) {
      lastKnown.forEach(async (v, i) => {
        await this.state.chatRoomsRef
          .child(v.chatRoomId)
          .child(this.props.me.nickname)
          .update({ ...v });
      });
    }

    this.state.chatRoomsRef.off();
    this.state.chatRooms.forEach((chatRoom) => {
      this.state.messagesRef.child(chatRoom.id).off();
    });
  }

  render() {
    const { chatRooms } = this.state;
    const { me } = this.props;
    return (
      <>
        <Head>
          <meta charSet="utf-8"></meta>
          <title>마이페이지</title>
        </Head>

        <MypageLayout>
          <MenuWrapper>
            <div className="menu-bar">
              <Menu
                mode="inline"
                style={{ height: "100%" }}
                defaultSelectedKeys={["profile"]}
                onClick={this.onChangeCurrentMenu}
              >
                <Menu.Item key="profile" icon={<UserOutlined />}>
                  프로필 수정
                </Menu.Item>
                <Menu.Item key="activity" icon={<AppstoreOutlined />}>
                  내 활동
                </Menu.Item>

                <SubMenu
                  key="note"
                  icon={<MailOutlined />}
                  title="채팅"
                  onClick={this.onChangeCurrentMenu}
                >
                  <>
                    {<span style={{ color: "transparent" }}>loading</span>}
                    {chatRooms &&
                      chatRooms.map((v, i) => {
                        let flag = false;
                        v.users.forEach((s, j) => {
                          if (me && s.clientId === me._id) flag = true;
                        });
                        if (flag) {
                          return (
                            <Menu.Item
                              key={
                                v.users.filter((s, j) => {
                                  if (me && s.nickname !== me.nickname) {
                                    return s;
                                  }
                                })[0].nickname
                              }
                              onClick={(e) => {
                                this.setChatRoomKey(v.id);
                                this.onSetCurrentChatRoom(v);
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <span style={{}}>
                                  {
                                    v.users.filter((s, j) => {
                                      if (me && s.nickname !== me.nickname) {
                                        return s;
                                      }
                                    })[0].nickname
                                  }
                                </span>
                                <span>
                                  <Badge
                                    count={this.getNotificationCount(v)}
                                    style={{
                                      borderRadius: "3px",
                                      fontSize: "9px",
                                      padding: "0 2px",
                                      height: "13px",
                                      minWidth: "13px",
                                      lineHeight: "13px",
                                    }}
                                  />
                                </span>
                              </div>
                            </Menu.Item>
                          );
                        }
                        flag = false;
                      })}
                  </>
                </SubMenu>
              </Menu>
            </div>
            <div className="menu-content">
              {this.state.currentMenu === "profile" && <EditProfile />}
              {this.state.currentMenu === "activity" && <MyActivityTemplate />}
              {this.state.currentMenu !== "profile" &&
                this.state.currentMenu !== "activity" && (
                  <ChatContainer chatRoomKey={this.state.chatRoomKey} />
                )}
            </div>
          </MenuWrapper>
        </MypageLayout>
      </>
    );
  }
}

export const getServerSideProps = wrapper.getServerSideProps(
  async (context) => {
    const cookie = context.req ? context.req.headers.cookie : "";
    client.defaults.headers.Cookie = "";
    if (context.req && cookie) {
      client.defaults.withCredentials = true;
      client.defaults.headers.Cookie = cookie;
    }
    context.store.dispatch(setUserRequestAction());
    context.store.dispatch(END);
    await context.store.sagaTask.toPromise();
  },
);

// redux

const mapStateToProps = (state) => {
  return {
    me: state.user.me,
    chatRoom: state.chat.currentChatRoom,
  };
};

export default connect(mapStateToProps)(mypage);
