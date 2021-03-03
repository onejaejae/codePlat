import React, { useCallback } from "react";
import { Card, Avatar, Button, Image, Popover } from "antd";
import styled from "styled-components";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { logoutRequestAction } from "../../reducers/user";
import { SERVER_URL } from "../../lib/constant/constant";
import ProfileModal from "../modal/ProfileModal";
import { UserOutlined } from "@ant-design/icons";
import firebase from "../../firebase";

/**
 * @author 박진호
 * @version 1.0
 * @summary 메인 페이지 내 프로필 컴포넌트
 */

// style

const CardWrapper = styled.div`
  padding: 20px;
`;

const ButtonsWrapper = styled.div`
  margin-top: 30px;
  text-align: center;
  .mypage {
    &:hover {
      color: #313355;
      border: 1px solid #313355;
    }
  }
  .logout {
    margin-left: 10px;
    background: #313355;
    color: #fff;
    &:hover {
      border: 1px solid #313355;
    }
  }
`;

const MyProfile = ({ me }) => {
  // redux

  const dispatch = useDispatch();
  const { logoutLoading } = useSelector((state) => state.user);

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

  return (
    <CardWrapper>
      <Card>
        <Card.Meta
          title={me.nickname}
          avatar={
            <Popover
              content={
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <ProfileModal writer={me}></ProfileModal>
                </div>
              }
            >
              <Avatar
                style={{ cursor: "pointer" }}
                size={32}
                src={
                  me.avatarUrl !== "" &&
                  me.avatarUrl && (
                    <Image
                      width={32}
                      height={32}
                      src={`${SERVER_URL}/${me.avatarUrl}`}
                    />
                  )
                }
                icon={<UserOutlined />}
              ></Avatar>
            </Popover>
          }
        ></Card.Meta>
        <ButtonsWrapper>
          <Link href="/mypage">
            <a>
              <Button className="mypage">마이페이지</Button>
            </a>
          </Link>
          <Button className="logout" onClick={onLogout} loading={logoutLoading}>
            로그아웃
          </Button>
        </ButtonsWrapper>
      </Card>
    </CardWrapper>
  );
};

export default MyProfile;
