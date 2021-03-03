import React, { useCallback, useState } from "react";
import { Form, Button, Input, Checkbox } from "antd";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import Router, { withRouter } from "next/router";
import useToggle from "../../../hooks/useToggle";
import axios from "axios";

/**
 * @author 박진호
 * @version 1.0
 * @summary 댓글 작성 폼 컴포넌트
 */

// style

const CommentFormWrapper = styled.div`
  .comment-input {
    &:hover {
      border: 1px solid #ddd;
    }
  }
  .comment-btn {
    background: #313355;
    color: #fff;
    border: 1px solid #313355;
  }
`;

const TextAreaWrapper = styled(Input.TextArea)`
  width: 94%;
`;

const CommentForm = ({ post, router }) => {
  // redux

  const { me } = useSelector((state) => state.user);

  // local state

  const [comment, setComment] = useState("");
  const [isSecret, onToggleIsSecret] = useToggle(false);

  // event listener

  const onChangeComment = useCallback((e) => {
    setComment(e.target.value);
  }, []);

  const onSubmit = useCallback(() => {
    let sumbitConfirm = confirm("댓글을 등록하시겠습니까?");
    if (sumbitConfirm) {
      setComment("");
      axios
        .post(`/api/comments`, {
          postId: post._id,
          type: post.type,
          content: comment,
          secretComment: isSecret,
        })
        .then((res) => {
          Router.push(`/articles/${post.type}/${post._id}`);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      return;
    }
  }, [comment, post, isSecret]);

  return (
    <CommentFormWrapper>
      <Form>
        <Form.Item>
          <TextAreaWrapper
            className="comment-input"
            rows={3}
            onChange={onChangeComment}
            value={comment}
            placeholder={
              me ? "댓글을 작성해보세요." : "로그인이 필요한 서비스입니다."
            }
          />
          <Checkbox
            style={{ marginTop: "5px", color: "#999" }}
            onChange={onToggleIsSecret}
            disabled={me ? false : true}
          >
            비밀 댓글
          </Checkbox>
        </Form.Item>
        <Form.Item>
          <Button
            className="comment-btn"
            htmlType="submit"
            onClick={onSubmit}
            type="primary"
            disabled={me ? false : true}
          >
            등록
          </Button>
        </Form.Item>
      </Form>
    </CommentFormWrapper>
  );
};

export default withRouter(CommentForm);
