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
import { useSelector, useDispatch } from "react-redux";
import useToggle from "../../../hooks/useToggle";
import { SERVER_URL } from "../../../lib/constant/constant";
import {
  addCommentRequestAction,
  deleteCommentRequestAction,
  likeCommentRequestAction,
  unLikeCommentRequestAction,
} from "../../../reducers/post";
import useInput from "../../../hooks/useInput";
import Router from "next/router";
import axios from "axios";
import ReCommentListItem from "./ReCommentListItem";

/**
 * @author 박진호
 * @version 1.0
 * @summary 댓글 리스트 아이템 컴포넌트
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

const CommentListItem = ({ item, post }) => {
  // redux

  const { me } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // local state
  const [reComment, onChangeReComment] = useInput("");
  const [editCommentText, setEditCommentText] = useState("");
  const [isSecret, onToggleIsSecret] = useToggle(false);
  const [isEdit, onToggleIsEdit] = useToggle(false);
  const [isEditSecret, setIsEditSecret] = useState(false);
  const [applyToggle, onChangeApplyToggle] = useToggle(false);
  const [like, setLike] = useState(
    item.likes.some((v, i) => {
      if (me && v.userId === me._id) {
        return true;
      }
    })
      ? true
      : false,
  );

  // event listener

  const onChangeEditCommentText = useCallback((e) => {
    setEditCommentText(e.target.value);
  }, []);

  const onToggleIsEditSecret = useCallback(() => {
    setIsEditSecret(!isEditSecret);
  }, [isEditSecret]);

  const onToggleLike = useCallback(() => {
    setLike(!like);
    if (like) {
      dispatch(
        unLikeCommentRequestAction({
          user: me,
          id: item.likes.find((v, i) => {
            if (v.userId === me._id) {
              return true;
            }
          })._id,
          type: "comment",
          commentId: item._id,
        }),
      );
    } else {
      dispatch(
        likeCommentRequestAction({
          user: me,
          id: item._id,
          type: "comment",
        }),
      );
    }
  }, [like, me, item]);

  const onCancelEdit = useCallback(() => {
    setEditCommentText(item.content);
    setIsEditSecret(item.secretComment);
    onToggleIsEdit();
  }, [item, isEdit]);

  const onReCommentSubmit = useCallback(async () => {
    if (reComment === "") {
      alert("내용을 입력해주세요.");
      return;
    }
    let submitConfirm = confirm("댓글을 등록하시겠습니까?");
    if (submitConfirm) {
      await axios
        .post(`/api/comments`, {
          postId: post._id,
          type: post.type,
          content: reComment,
          commentTo: item._id,
          secretComment: isSecret,
        })
        .then((res) => {
          onChangeApplyToggle();
          Router.push(`/articles/${post.type}/${post._id}`);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      return;
    }
  }, [post, item, reComment, isSecret]);

  const onUpdateComment = useCallback(
    (comment) => {
      if (editCommentText === "") {
        alert("내용을 입력해주세요.");
        return;
      }
      let updateConfirm = confirm("수정하시겠습니까?");
      if (updateConfirm) {
        axios
          .patch(`/api/comments`, {
            commentId: comment._id,
            content: editCommentText,
            secretComment: isEditSecret,
          })
          .then((res) => {
            onToggleIsEdit();
            Router.push(`/articles/${post.type}/${post._id}`);
          })
          .catch((error) => {
            alert("댓글수정 실패");
          });
      } else {
        return;
      }
    },
    [isEditSecret, editCommentText],
  );

  const onDeleteComment = useCallback(
    async (id) => {
      let confirmDelete = confirm("정말로 삭제하시겠습니까?");
      if (confirmDelete) {
        let flag = false;

        let parentId = null;
        post.comments.forEach((v, i) => {
          if (id === v.commentTo) {
            flag = true;
          }
        });
        if (flag) {
          await axios
            .put(`/api/comments/parentDelete`, { id })
            .then((res) => {
              Router.push(`/articles/${post.type}/${post._id}`);
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          let child;
          let parent;
          let childInParentLength = 0;
          post.comments.forEach((v, i) => {
            if (id === v._id) {
              child = v;
            }
          });
          post.comments.forEach((v, i) => {
            if (child.commentTo === v._id) {
              parent = v;
            }
          });
          post.comments.forEach((v, i) => {
            if (parent && parent._id === v.commentTo) {
              childInParentLength++;
            }
          });

          if (parent && parent.isDelete && childInParentLength === 1) {
            parentId = parent._id;

            axios.delete(`/api/comments/${parentId}`).then(() => {
              axios.delete(`/api/comments/${id}`).then(() => {
                Router.push(`/articles/${post.type}/${post._id}`);
                return;
              });
            });
          } else {
            await axios
              .delete(`/api/comments/${id}`)
              .then((res) => {
                Router.push(`/articles/${post.type}/${post._id}`);
              })
              .catch((err) => {
                console.log(err);
              });
          }
        }
      } else {
        return;
      }
    },
    [item, post],
  );

  // hooks

  useEffect(() => {
    setEditCommentText(item.content);
    setIsEditSecret(item.secretComment);
  }, [item]);

  return (
    <li>
      <Comment
        actions={
          me &&
          !item.isDelete &&
          (!applyToggle
            ? isEdit
              ? [
                  <>
                    <ReApplyFormWrapper>
                      <ReApplyInput
                        rows={1}
                        onChange={onChangeEditCommentText}
                        defaultValue={item.content}
                      />

                      <ButtonWrapper>
                        <span
                          className="submit-btn"
                          key="comment-list-reply-to-0"
                          onClick={() => {
                            onUpdateComment(item);
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
                            onChange={onToggleIsEditSecret}
                            style={{ color: "#999" }}
                            defaultChecked={item.secretComment}
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
                        style={{ marginRight: "10px" }}
                        onClick={onToggleLike}
                      >
                        {like ? (
                          <LikeFilled
                            style={{ marginRight: "3px", color: "#1a91fe" }}
                          />
                        ) : (
                          <LikeOutlined style={{ marginRight: "3px" }} />
                        )}

                        {item.likes.length}
                      </span>
                    )}
                  </CommentActivityWrapper>,
                  <CommentActivityWrapper
                    key="comment-list-reply-to-0"
                    onClick={onChangeApplyToggle}
                  >
                    대댓글 쓰기
                  </CommentActivityWrapper>,
                  <CommentActivityWrapper>
                    {item.writer && me._id === item.writer._id && (
                      <span>|</span>
                    )}
                  </CommentActivityWrapper>,
                  <CommentActivityWrapper>
                    {item.writer && me._id === item.writer._id && (
                      <span
                        key="comment-list-reply-to-0"
                        onClick={() => {
                          onDeleteComment(item._id);
                        }}
                      >
                        삭제
                      </span>
                    )}
                  </CommentActivityWrapper>,
                  <CommentActivityWrapper>
                    {item.writer && me._id === item.writer._id && (
                      <span>|</span>
                    )}
                  </CommentActivityWrapper>,
                  <CommentActivityWrapper>
                    {item.writer && me._id === item.writer._id && (
                      <span
                        key="comment-list-reply-to-0"
                        onClick={onToggleIsEdit}
                      >
                        수정
                      </span>
                    )}
                  </CommentActivityWrapper>,

                  ,
                ]
            : [
                <>
                  <ReApplyFormWrapper>
                    <ReApplyInput rows={1} onChange={onChangeReComment} />
                    <ButtonWrapper>
                      <span
                        className="submit-btn"
                        key="comment-list-reply-to-0"
                        onClick={onReCommentSubmit}
                      >
                        등록
                      </span>
                      <span
                        className="cancel-btn"
                        key="comment-list-reply-to-1"
                        onClick={onChangeApplyToggle}
                      >
                        취소
                      </span>
                      <span
                        className="secret-btn"
                        key="comment-list-reply-to-2"
                      >
                        <Checkbox
                          onChange={onToggleIsSecret}
                          style={{ color: "#999" }}
                        >
                          비밀 댓글
                        </Checkbox>
                      </span>
                    </ButtonWrapper>
                  </ReApplyFormWrapper>
                </>,
              ])
        }
        author={
          !item.isDelete &&
          item.writer &&
          post.writer &&
          (item.writer._id === post.writer._id ? (
            <span style={{ color: "#1a91fe" }}>글쓴이</span>
          ) : (
            item.writer.nickname
          ))
        }
        avatar={
          <Popover
            content={
              <div
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                {item.writer &&
                  !item.isDelete &&
                  item.writer.constructor == Object && (
                    <ProfileModal writer={item.writer}></ProfileModal>
                  )}
              </div>
            }
          >
            <Avatar
              onClick={(e) => {
                e.stopPropagation();
              }}
              style={{ cursor: "pointer" }}
              size={28}
              icon={<UserOutlined />}
              src={
                !item.isDelete &&
                item.writer &&
                item.writer.avatarUrl && (
                  <Image
                    src={`${SERVER_URL}/${item.writer.avatarUrl}`}
                    width={28}
                    height={28}
                  />
                )
              }
            />{" "}
          </Popover>
        }
        content={
          item.writer && item.writer.constructor == Object ? (
            item.secretComment ? (
              me &&
              ((post.writer && me._id === post.writer._id) ||
                item.writer._id === me._id) ? (
                <>
                  <span>{item.content}</span>
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
              item.content
            )
          ) : (
            "탈퇴한 회원입니다."
          )
        }
        datetime={`${new Date(item.createdAt).getMonth() + 1}/${new Date(
          item.createdAt,
        ).getDate()}  ${new Date(item.createdAt).getHours()}:${
          new Date(item.createdAt).getMinutes() < 10
            ? "0" + new Date(item.createdAt).getMinutes()
            : new Date(item.createdAt).getMinutes()
        }:${
          new Date(item.createdAt).getSeconds() < 10
            ? "0" + new Date(item.createdAt).getSeconds()
            : new Date(item.createdAt).getSeconds()
        }`}
      >
        {post.comments.map((reComment, i) => {
          if (reComment.commentTo === item._id) {
            return (
              <ReCommentListItem
                key={reComment._id}
                reComment={reComment}
                post={post}
                me={me}
                onDeleteComment={onDeleteComment}
              />
            );
          }
        })}
      </Comment>
    </li>
  );
};

export default CommentListItem;
