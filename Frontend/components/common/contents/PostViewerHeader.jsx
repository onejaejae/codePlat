import React, { useCallback, useState } from "react";
import styled from "styled-components";
import {
  MessageOutlined,
  LikeOutlined,
  EyeOutlined,
  UserOutlined,
  TagsOutlined,
  LikeFilled,
  TagsFilled,
} from "@ant-design/icons";
import { Avatar, Popover, Button, Image } from "antd";
import ProfileModal from "../../modal/ProfileModal";
import {
  postScrapRequestAction,
  deletePostRequestAction,
  likePostRequestAction,
  unLikePostRequestAction,
  postUnScrapRequestAction,
} from "../../../reducers/post";
import { useDispatch, useSelector } from "react-redux";
import { SERVER_URL } from "../../../lib/constant/constant";
import Router from "next/router";
import { message } from "antd";

/**
 * @author 박진호
 * @version 1.0
 * @summary 포스트 뷰어 헤더 컴포넌트
 */

// style

const PostViewerHeaderWrapper = styled.div`
  justify-content: space-between;
  font-size: 18px;
  font-weight: 300;
  background: #fff;
  padding: 20px 40px;

  .user-profile {
    flex: 1;
    padding: 5px 0;
    .user-nickname {
      margin: 0 5px;
    }
  }
  .post-desc {
    font-size: 12px;
    color: #888;
    flex: 1;
    text-align: left;

    line-height: 30px;
    display: flex;
    @media(max-width:1368px){
      flex-direction:column
    }
    .post-summary {
    }
    .post-btns {
      text-align: right;

      flex: 1;
    }
    .create-date {
      margin-right: 10px;
    }
    .create-time {
      margin-right: 10px;
    }
    .post-views,
    .post-comments,
    .post-forum-likes,
    .post-forum-scraps {
      margin: 0 7px;
    }
    .scrap-btn,
    .delete-btn,
    .like-btn,
    .revise-btn {
      padding: 5px;
      margin: 0 5px;
      border: none;
      text-align: center;
    }
  }
`;

const PostViewerHeader = ({ post, contentType }) => {
  // redux

  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);

  // local state

  const [like, setLike] = useState(
    post.likes.some((v, i) => {
      if (me && v.userId === me._id) {
        return true;
      }
    })
      ? true
      : false,
  );
  const [isScraped, setIsScraped] = useState(
    post.scraps.some((v, i) => {
      if (me && v.userId === me._id) {
        return true;
      }
    })
      ? true
      : false,
  );

  // helper method

  const scrapDoneMessage = () => {
    message.success({
      content: "스크랩 완료!",
      className: "custom-class",
      style: {
        marginTop: "5vh",
      },
    });
  };

  const unScrapDoneMessage = () => {
    message.success({
      content: "스크랩 취소!",
      className: "custom-class",
      style: {
        marginTop: "5vh",
      },
    });
  };

  // event listener

  const onToggleLike = useCallback(() => {
    setLike(!like);
    if (like) {
      dispatch(
        unLikePostRequestAction({
          user: me,
          id: post.likes.find((v, i) => {
            if (v.userId === me._id) {
              return true;
            }
          })._id,
          type: "forum",
          postId: post._id,
        }),
      );
    } else {
      dispatch(
        likePostRequestAction({
          user: me,
          id: post._id,
          type: "forum",
        }),
      );
    }
  }, [like, me, post]);

  const onScrap = useCallback(() => {
    setIsScraped(!isScraped);
    if (isScraped) {
      unScrapDoneMessage();
      dispatch(
        postUnScrapRequestAction({
          postId: post._id,
          type: contentType,
          id: post.scraps.find((v, i) => {
            if (v.userId === me._id) {
              return true;
            }
          })._id,
          user: me,
        }),
      );
    } else {
      scrapDoneMessage();
      dispatch(
        postScrapRequestAction({ id: post._id, type: contentType, user: me }),
      );
    }
  }, [post, isScraped, me]);

  const onPostDelete = useCallback(
    (deleteType) => {
      let confirmDelete =
        deleteType === "recruitDone"
          ? confirm("게시글이 삭제됩니다. 정말로 모집완료 처리하시겠습니까?")
          : confirm("정말로 삭제하시겠습니까?");
      if (confirmDelete) {
        dispatch(deletePostRequestAction(post._id));
        Router.push(`/articles/${contentType}`);
      } else {
        return;
      }
    },
    [post],
  );

  const onPostRevise = useCallback(() => {
    let confirmRevise = confirm("글을 수정하시겠습니까?");
    if (confirmRevise) {
      Router.push(`/articles/edit/${post._id}`);
    } else {
    }
  }, [post]);

  return (
    <>
      <PostViewerHeaderWrapper>
        <div className="user-profile">
          <Popover
            content={
              <div
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                {post.writer && (
                  <ProfileModal
                    writer={post.writer && post.writer}
                  ></ProfileModal>
                )}
              </div>
            }
          >
            <Avatar
              onClick={(e) => {
                e.stopPropagation();
              }}
              style={{ cursor: "pointer" }}
              size={32}
              icon={<UserOutlined />}
              src={
                post.writer &&
                post.writer.avatarUrl && (
                  <Image
                    src={`${post.writer.avatarUrl}`}
                    width={32}
                    height={32}
                  />
                )
              }
            />{" "}
          </Popover>
          <span className="user-nickname">
            {post.writer ? post.writer.nickname : "탈퇴한 회원"}
          </span>
        </div>
        <div className="post-desc">
          <div className="post-header-summary">
            <span className="create-date">
              {`${new Date(post.createdAt).getFullYear()}.${
                new Date(post.createdAt).getMonth() + 1
              }.${new Date(post.createdAt).getDate()}`}
            </span>
            <span className="create-time">
              {`${new Date(post.createdAt).getHours()}:${
                new Date(post.createdAt).getMinutes() < 10
                  ? "0" + new Date(post.createdAt).getMinutes()
                  : new Date(post.createdAt).getMinutes()
              }:${
                new Date(post.createdAt).getSeconds() < 10
                  ? "0" + new Date(post.createdAt).getSeconds()
                  : new Date(post.createdAt).getSeconds()
              }`}
            </span>
            <EyeOutlined />
            <span className="post-views">{post.views}</span>
            <MessageOutlined />
            <span className="post-comments">{post.comments.length}</span>

            <>
              {contentType === "forum" && (
                <>
                  <LikeOutlined />
                  <span className="post-forum-likes">{post.likes.length}</span>
                </>
              )}
              <TagsOutlined />
              <span className="post-forum-scraps">{post.scraps.length}</span>
            </>
          </div>
          <div className="post-btns">
            {me && (
              <>
                <Button className="scrap-btn" onClick={onScrap}>
                  {isScraped ? (
                    <TagsFilled
                      style={{ marginRight: "3px", color: "#1a91fe" }}
                    />
                  ) : (
                    <TagsOutlined style={{ marginRight: "3px" }} />
                  )}
                </Button>
              </>
            )}
            {me && contentType == "forum" && (
              <Button
                type="ghost"
                className="like-btn"
                onClick={() => {
                  onToggleLike();
                }}
              >
                {like ? (
                  <LikeFilled
                    style={{ marginRight: "3px", color: "#1a91fe" }}
                  />
                ) : (
                  <LikeOutlined style={{ marginRight: "3px" }} />
                )}
              </Button>
            )}
            {me &&
              (contentType === "study" || contentType === "project") &&
              post.writer &&
              me._id === post.writer._id && (
                <>
                  <Button
                    type="ghost"
                    className="revise-btn"
                    onClick={() => {
                      onPostDelete("recruitDone");
                    }}
                  >
                    모집완료
                  </Button>
                  <span>/</span>
                </>
              )}

            {me && post.writer && me._id === post.writer._id && (
              <>
                <Button
                  type="ghost"
                  className="revise-btn"
                  onClick={() => {
                    onPostRevise();
                  }}
                >
                  수정
                </Button>
              </>
            )}

            {me &&
              post.writer &&
              me._id === post.writer._id &&
              contentType === "forum" && (
                <Button
                  type="ghost"
                  style={{ color: "tomato" }}
                  className="delete-btn"
                  onClick={() => {
                    onPostDelete("deletePost");
                  }}
                >
                  삭제
                </Button>
              )}
          </div>
        </div>
      </PostViewerHeaderWrapper>
    </>
  );
};

export default PostViewerHeader;
