import React, { useCallback, useState, useEffect } from "react";
import styled from "styled-components";
import { Avatar, Popover, Comment, Input, Image, Checkbox } from "antd";
import ProfileModal from "../../modal/ProfileModal";
import {
  UserOutlined,
  LockOutlined,
  LikeOutlined,
  LikeFilled,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import useToggle from "../../../hooks/useToggle";
import { SERVER_URL } from "../../../lib/constant/constant";
import {
  likeCommentRequestAction,
  unLikeCommentRequestAction,
} from "../../../reducers/post";
import Router from "next/router";
import axios from "axios";

/**
 * @author 박진호
 * @version 1.0
 * @summary 포스트 대댓글 아이템 컴포넌트
 */

// style

const ReApplyFormWrapper = styled.div`
  width: 800px;
  display: flex;
  @media (max-width: 768px) {
    width: 200px;
    display: block;
  }
`;

const ReApplyInput = styled(Input.TextArea)`
  flex: 7;
`;

const ButtonWrapper = styled.div`
  line-height: 30px;
  flex: 1;
  .cancel-btn {
    cursor: pointer;
    margin-left: 5px;
  }
  .submit-btn {
    cursor: pointer;
    color: #208fff;
    margin-left: 10px;
  }
  .secret-btn {
    margin-left: 10px;
  }
`;

const CommentActivityWrapper = styled.div`
  font-size: 11px;
  padding: 0 3px;
  cursor: pointer;
`;

const ReCommentListItem = ({ reComment, post, me, onDeleteComment }) => {
  // redux

  const dispatch = useDispatch();

  // local state

  const [editReCommentText, setEditReCommentText] = useState("");
  const [isEditReComment, onToggleIsEditReComment] = useToggle(false);
  const [isReEditSecret, setIsReEditSecret] = useState(false);
  const [currentReComment, setCurrentReComment] = useState(null);
  const [like, setLike] = useState(
    reComment.likes.some((v, i) => {
      if (me && v.userId === me._id) {
        return true;
      }
    })
      ? true
      : false,
  );

  // event listener

  const onChangeEditReCommentText = useCallback((e) => {
    setEditReCommentText(e.target.value);
  }, []);

  const onToggleIsReEditSecret = useCallback(() => {
    setIsReEditSecret(!isReEditSecret);
  }, [isReEditSecret]);

  const onUpdateReComment = useCallback(
    (reComment) => {
      if (editReCommentText === "") {
        alert("내용을 입력해주세요.");
        return;
      }
      let updateConfirm = confirm("수정하시겠습니까?");
      if (updateConfirm) {
        axios
          .patch(`/api/comments`, {
            commentId: reComment._id,
            content: editReCommentText,
            secretComment: isReEditSecret,
          })
          .then((res) => {
            onToggleIsEditReComment();
            Router.push(`/articles/${post.type}/${post._id}`);
          })
          .catch((error) => {
            alert("댓글수정 실패");
          });
      } else {
        return;
      }
    },
    [editReCommentText, isReEditSecret],
  );

  const onToggleLike = useCallback(() => {
    setLike(!like);
    if (like) {
      dispatch(
        unLikeCommentRequestAction({
          user: me,
          id: reComment.likes.find((v, i) => {
            if (v.userId === me._id) {
              return true;
            }
          })._id,
          type: "comment",
          commentId: reComment._id,
        }),
      );
    } else {
      dispatch(
        likeCommentRequestAction({
          user: me,
          id: reComment._id,
          type: "comment",
        }),
      );
    }
  }, [like, me, reComment]);

  const onCancelEdit = useCallback(() => {
    setEditReCommentText(reComment.content);
    setIsReEditSecret(reComment.secretComment);
    onToggleIsEditReComment();
  }, [reComment, isEditReComment]);

  const onChangeCurrentReComment = useCallback((reComment) => {
    setCurrentReComment(reComment);
  }, []);

  // hooks

  useEffect(() => {
    setEditReCommentText(reComment.content);
    setIsReEditSecret(reComment.secretComment);
  }, [reComment]);

  return (
    <div key={reComment._id}>
      <Comment
        author={
          !reComment.isDelete &&
          reComment.writer &&
          post.writer &&
          (reComment.writer._id === post.writer._id ? (
            <span style={{ color: "#1a91fe" }}>글쓴이</span>
          ) : (
            reComment.writer.nickname
          ))
        }
        actions={
          me
            ? isEditReComment &&
              currentReComment &&
              currentReComment._id === reComment._id
              ? [
                  <>
                    <ReApplyFormWrapper>
                      <ReApplyInput
                        rows={1}
                        onChange={onChangeEditReCommentText}
                        defaultValue={reComment.content}
                      />

                      <ButtonWrapper>
                        <span
                          className="submit-btn"
                          key="comment-list-reply-to-0"
                          onClick={() => {
                            onUpdateReComment(reComment);
                          }}
                        >
                          수정
                        </span>
                        <span
                          className="cancel-btn"
                          key="comment-list-reply-to-1"
                          onClick={onCancelEdit}
                        >
                          취소
                        </span>
                        <span
                          className="secret-btn"
                          key="comment-list-reply-to-2"
                        >
                          <Checkbox
                            onChange={onToggleIsReEditSecret}
                            style={{ color: "#999" }}
                            defaultChecked={reComment.secretComment}
                          >
                            비밀 댓글
                          </Checkbox>
                        </span>
                      </ButtonWrapper>
                    </ReApplyFormWrapper>
                  </>,
                ]
              : [
                  <CommentActivityWrapper>
                    {me && (
                      <span
                        onClick={onToggleLike}
                        style={{ marginRight: "10px" }}
                      >
                        {like ? (
                          <LikeFilled
                            style={{ marginRight: "3px", color: "#1a91fe" }}
                          />
                        ) : (
                          <LikeOutlined style={{ marginRight: "3px" }} />
                        )}

                        {reComment.likes.length}
                      </span>
                    )}
                  </CommentActivityWrapper>,
                  <CommentActivityWrapper>
                    {reComment.writer && me && me._id === reComment.writer._id && (
                      <span
                        key="comment-list-reply-to-0"
                        onClick={() => {
                          onDeleteComment(reComment._id);
                        }}
                      >
                        삭제
                      </span>
                    )}
                  </CommentActivityWrapper>,
                  <CommentActivityWrapper>
                    {reComment.writer && me._id === reComment.writer._id && (
                      <span>|</span>
                    )}
                  </CommentActivityWrapper>,
                  <CommentActivityWrapper>
                    {reComment.writer && me._id === reComment.writer._id && (
                      <span
                        key="comment-list-reply-to-0"
                        onClick={() => {
                          onToggleIsEditReComment();
                          onChangeCurrentReComment(reComment);
                        }}
                      >
                        수정
                      </span>
                    )}
                  </CommentActivityWrapper>,
                ]
            : []
        }
        avatar={
          <Popover
            content={
              <div
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                {reComment.writer && reComment.writer.constructor == Object && (
                  <ProfileModal writer={reComment.writer}></ProfileModal>
                )}
              </div>
            }
          >
            <Avatar
              onClick={(e) => {
                e.stopPropagation();
              }}
              style={{
                cursor: "pointer",
              }}
              size={28}
              icon={<UserOutlined />}
              src={
                reComment.writer &&
                reComment.writer.avatarUrl && (
                  <Image
                    width={28}
                    height={28}
                    src={`${reComment.writer.avatarUrl}`}
                  />
                )
              }
            />
          </Popover>
        }
        content={
          reComment.writer && reComment.writer.constructor == Object ? (
            reComment.secretComment ? (
              me &&
              ((reComment.writer && reComment.writer._id === me._id) ||
                post.comments.find((v, i) => {
                  if (v._id === reComment.commentTo) {
                    return true;
                  }
                }).writer._id === me._id) ? (
                <>
                  <span>{reComment.content}</span>
                  <span style={{ color: "#999", fontSize: "12px" }}>
                    <LockOutlined style={{ margin: "0 5px", color: "#999" }} />
                    비밀 댓글
                  </span>
                </>
              ) : (
                <>
                  <LockOutlined style={{ margin: "0 5px", color: "#999" }} />
                  <span style={{ color: "#999" }}>비밀 댓글입니다.</span>
                </>
              )
            ) : (
              reComment.content
            )
          ) : (
            "탈퇴한 회원입니다."
          )
        }
        datetime={`${new Date(reComment.createdAt).getMonth() + 1}/${new Date(
          reComment.createdAt,
        ).getDate()}  ${new Date(reComment.createdAt).getHours()}:${
          new Date(reComment.createdAt).getMinutes() < 10
            ? "0" + new Date(reComment.createdAt).getMinutes()
            : new Date(reComment.createdAt).getMinutes()
        }:${
          new Date(reComment.createdAt).getSeconds() < 10
            ? "0" + new Date(reComment.createdAt).getSeconds()
            : new Date(reComment.createdAt).getSeconds()
        }`}
      />
    </div>
  );
};

export default ReCommentListItem;
