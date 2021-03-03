import React, { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import { Input, Button } from "antd";
import { useSelector } from "react-redux";
import firebase from "../../firebase";

/**
 * @author 박진호
 * @version 1.0
 * @summary 마이페이지 채팅 폼 컴포넌트
 */

// style

const ChatFormWrapper = styled.div`
  margin: 30px;
  display: flex;
`;

const InputWrapper = styled.div`
  flex: 7;
  .chat-input {
  }
`;

const ButtonWrapper = styled.div`
  flex: 1;
  .submit-btn {
    &:hover {
      color: #111;
      border: 1px solid #313355;
    }
  }
`;

const ChatForm = ({ chatRoomKey }) => {
  // redux

  const { me } = useSelector((state) => state.user);
  const { currentChatRoom } = useSelector((state) => state.chat);

  // local state

  const [content, setContent] = useState("");
  const [messagesRef, setMessagesRef] = useState(
    firebase.database().ref("messages"),
  );

  // helper method

  const createMessage = () => {
    const message = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        clientId: currentChatRoom.users.filter((v, i) => {
          if (v.clientId === me._id) {
            return v;
          }
        })[0].clientId,
        name: me.nickname,
      },
      content,
    };
    return message;
  };

  const handleEnterPress = (e) => {
    if (e.key === "Enter") {
      onSubmit();
    }
  };

  // event listener

  const onChangeContent = useCallback((e) => {
    setContent(e.target.value);
  }, []);

  const onSubmit = useCallback(async () => {
    if (content === "") {
      alert("메시지를 입력해주세요.");
      return;
    }
    try {
      await messagesRef.child(currentChatRoom.id).push().set(createMessage());
      setContent("");
      let opponentNickname = null;
      await firebase
        .database()
        .ref(`chatRooms`)
        .child(currentChatRoom.id)
        .once("value", function (data) {
          data.val().users.forEach((v, i) => {
            if (v.nickname !== me.nickname) {
              opponentNickname = v.nickname;
            }
          });
        });

      let opponentUid = null;

      await firebase
        .database()
        .ref(`users`)
        .orderByChild("nickname")
        .equalTo(opponentNickname)
        .once("value", function (data) {
          opponentUid = Object.keys(data.val())[0];
        });

      let opponentInfo = null;
      await firebase
        .database()
        .ref("users")
        .child(opponentUid)
        .once("value", function (data) {
          opponentInfo = data.val();
        });

      let isExistOpponentLeave = null;
      await firebase
        .database()
        .ref("chatRooms")
        .child(currentChatRoom.id)
        .once("value", function (data) {
          if (data.val()[opponentNickname]) {
            isExistOpponentLeave = data.val()[opponentNickname];
          }
        });

      if (!opponentInfo.isInMypage) {
        if (isExistOpponentLeave) {
          await firebase
            .database()
            .ref("chatRooms")
            .child(currentChatRoom.id)
            .child(opponentNickname)
            .update({
              ...isExistOpponentLeave,
              count: isExistOpponentLeave.count + 1,
              total: isExistOpponentLeave.total + 1,
              lastKnownTotal: isExistOpponentLeave.lastKnownTotal,
            });
        } else {
          await firebase
            .database()
            .ref("chatRooms")
            .child(currentChatRoom.id)
            .child(opponentNickname)
            .update({
              chatRoomId: currentChatRoom.id,
              user: opponentNickname,
              total: 1,
              lastKnownTotal: 0,
              count: 1,
            });
        }
      }
    } catch (error) {
      console.log(error);
      alert("오류 발생");
      setContent("");
    }
  }, [content, messagesRef, chatRoomKey]);

  // hooks

  useEffect(() => {
    return () => messagesRef.off();
  }, []);

  return (
    <ChatFormWrapper>
      <InputWrapper>
        <Input
          className="chat-input"
          onChange={onChangeContent}
          value={content}
          onKeyPress={handleEnterPress}
        />
      </InputWrapper>
      <ButtonWrapper>
        <Button
          className="submit-btn"
          style={{ width: "100%" }}
          onClick={onSubmit}
        >
          전송
        </Button>
      </ButtonWrapper>
    </ChatFormWrapper>
  );
};

export default ChatForm;
