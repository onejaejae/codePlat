import React, { Component } from "react";
import styled, { css } from "styled-components";
import firebase from "../../firebase";
import moment from "moment";
import { connect } from "react-redux";

/**
 * @author 박진호
 * @version 1.0
 * @summary 마이페이지 채팅 바디 컴포넌트
 * @note 함수형 컴포넌트와 firebase realtime database가 충돌하는 이슈가 있어 클래스형으로 리팩토링
 */

// style

const ChatContainer = styled.div`
  height: 60vh;
  margin: 30px;
  overflow: auto;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0 5px;
  padding-top: 20px;
  background: #eee;
`;

const MessageWrapper = styled.div`
  padding: 5px;
  .message-timestamp {
    font-size: 10px;
    color: #999;
    margin: 0 5px;
  }
  ${(props) =>
    props.type === "me"
      ? css`
          text-align: right;
          .message-content {
            ${(props) =>
              props.wordbreak === "true" &&
              css`
                display: inline-block;
                width: 200px;
                word-wrap: break-word;
              `}

            text-align: left;
            padding: 5px;
            border-radius: 4px;
            background: #fee500;
          }
        `
      : css`
          .message-content {
            ${(props) =>
              props.wordbreak === "true" &&
              css`
                display: inline-block;
                width: 200px;
                word-wrap: break-word;
              `}

            text-align: left;
            padding: 5px;
            border-radius: 4px;
            background: #fff;
            color: #111;
          }
        `}
`;

export class ChatBody extends Component {
  // local state

  messagesEnd = React.createRef();

  state = {
    messages: [],
    messagesRef: firebase.database().ref("messages"),
  };

  // life cycle method

  componentDidMount() {
    const { chatRoom } = this.props;

    if (chatRoom) {
      this.addMessagesListeners(chatRoom.id);
    }
  }

  componentDidUpdate() {
    if (this.messagesEnd) {
      this.messagesEnd.scrollIntoView({ block: "end", inline: "nearest" });
    }
  }

  componentWillUnmount() {
    this.state.messagesRef.off();
    this.messagesEnd = null;
  }

  // event listener

  addMessagesListeners = (chatRoomId) => {
    let messagesArray = [];
    this.setState({ messages: [] });
    this.state.messagesRef
      .child(chatRoomId)
      .on("child_added", (DataSnapshot) => {
        messagesArray.push(DataSnapshot.val());
        this.setState({
          messages: messagesArray,
        });
      });
  };

  // helper method

  scrollToBottom = () => {
    this.scrollRef.current.scrollIntoView({
      block: "end",
      inline: "nearest",
    });
  };

  renderMessages = (messages) =>
    messages.length > 0 &&
    messages.map((v, i) => {
      const { me } = this.props;
      if (v.user.clientId === me._id) {
        return (
          <MessageWrapper
            type="me"
            key={v.timestamp}
            wordbreak={v.content.length > 10 ? "true" : "false"}
          >
            <span className="message-timestamp">
              {moment(v.timestamp).format("MM/DD HH:mm")}
            </span>
            <span className="message-content">{v.content}</span>
          </MessageWrapper>
        );
      } else {
        return (
          <MessageWrapper
            key={v.timestamp}
            type="opponent"
            wordbreak={v.content.length > 10 ? "true" : "false"}
          >
            <span className="message-content">{v.content}</span>
            <span className="message-timestamp">
              {moment(v.timestamp).format("MM/DD HH:mm")}
            </span>
          </MessageWrapper>
        );
      }
    });
  render() {
    const { messages } = this.state;
    return (
      <ChatContainer>
        {this.renderMessages(messages)}
        <div ref={(node) => (this.messagesEnd = node)} />
      </ChatContainer>
    );
  }
}

// redux

const mapStateToProps = (state) => {
  return {
    me: state.user.me,
    chatRoom: state.chat.currentChatRoom,
  };
};

export default connect(mapStateToProps)(ChatBody);
