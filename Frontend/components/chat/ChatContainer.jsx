import React from "react";
import ChatBody from "./ChatBody";
import ChatForm from "./ChatForm";
import shortid from "shortid";

/**
 * @author 박진호
 * @version 1.0
 * @summary 마이페이지 채팅 컨테이너
 */

const ChatContainer = ({ chatRoomKey }) => {
  return (
    <div>
      <ChatBody key={shortid.generate()} chatRoomKey={chatRoomKey} />
      <ChatForm />
    </div>
  );
};

export default ChatContainer;
