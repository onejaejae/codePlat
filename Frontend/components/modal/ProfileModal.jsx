import React, { useCallback, useState, useEffect } from "react";
import styled from "styled-components";
import { Button, Tag } from "antd";
import { useSelector, useDispatch } from "react-redux";
import firebase from "../../firebase";
import Router, { withRouter } from "next/router";

/**
 * @author 박진호
 * @version 1.0
 * @summary 프로필 모달 창 컴포넌트, 메시지보내기 버튼 클릭 시 파이어베이스 채팅방 생성
 */

// style

const ProfileWrapper = styled.div`
  margin: 0;
  border: 1px solid #ddd;
  padding: 5px;
  .btn-wrapper {
    padding: 5px;
    text-align: center;
  }
`;

const RowWrapper = styled.div`
  padding: 5px;
  .tag-partial {
    width: 55px;
    text-align: center;
  }
`;

const ProfileModal = ({ writer }) => {
  // redux

  const { me } = useSelector((state) => state.user);

  // local state

  const [chatRoomsRef, setChatRoomsRef] = useState(
    firebase.database().ref("chatRooms"),
  );
  const [chatRooms, setChatRooms] = useState([]);

  // event listener

  const addChatRoomListener = () => {
    let chatRoomsArray = [];

    chatRoomsRef.on("child_added", (DataSnapShot) => {
      chatRoomsArray.push(DataSnapShot.val());
      setChatRooms(chatRoomsArray);
    });
  };

  const onCreateChatRoom = useCallback(async () => {
    let user = firebase.auth().currentUser;
    if (user) {
      const key = chatRoomsRef.push().key;
      const newChatRoom = {
        id: key,
        users: [
          { clientId: me._id, nickname: me.nickname },
          { clientId: writer._id, nickname: writer.nickname },
        ],
      };

      let chatRoomExist = false;
      if (chatRooms.length !== 0) {
        chatRooms.forEach((v, i) => {
          let cnt = 0;
          v.users.forEach((s, j) => {
            if (
              s.clientId === newChatRoom.users[0].clientId ||
              s.clientId === newChatRoom.users[1].clientId
            ) {
              cnt++;
            }
          });
          if (cnt === 2) {
            chatRoomExist = true;
          }
        });
      }

      if (chatRoomExist) {
        Router.push(`/mypage`);
      } else {
        try {
          await chatRoomsRef.child(key).update(newChatRoom);
          alert("채팅방 생성완료");
          Router.push(`/mypage`);
        } catch (error) {
          alert("오류발생! 다시 시도해주세요.");
        }
      }
      chatRoomExist = false;
    }
  }, [chatRoomsRef, chatRooms]);

  // hooks

  useEffect(() => {
    addChatRoomListener();
    return () => {
      chatRoomsRef.off();
    };
  }, []);

  return (
    <ProfileWrapper>
      <RowWrapper>
        <span>
          <Tag className="tag-partial" color="#ccc">
            관심기술
          </Tag>
        </span>
        {writer.techStack.map((v, i) => {
          if (i < 3) {
            return (
              <Tag color="blue" key={v}>
                {v}
              </Tag>
            );
          }
        })}
      </RowWrapper>
      <RowWrapper>
        <span>
          <Tag className="tag-partial" color="#ccc">
            가입일
          </Tag>
        </span>
        <span>{`${new Date(writer.createdAt).getFullYear()}.${
          new Date(writer.createdAt).getMonth() + 1
        }.${new Date(writer.createdAt).getDate()}`}</span>
      </RowWrapper>
      <RowWrapper>
        <span>
          <Tag className="tag-partial" color="#ccc">
            Github
          </Tag>
        </span>
        {me && me.secretGithub ? (
          <span style={{ color: "#999" }}>비공개</span>
        ) : (
          <span>{writer.githubUrl}</span>
        )}
      </RowWrapper>

      <RowWrapper className="btn-wrapper">
        {me && me._id !== writer._id && (
          <Button
            type="primary"
            className="note-btn"
            onClick={onCreateChatRoom}
            style={{ marginTop: "20px" }}
          >
            메시지 보내기
          </Button>
        )}
      </RowWrapper>
    </ProfileWrapper>
  );
};

export default withRouter(ProfileModal);
