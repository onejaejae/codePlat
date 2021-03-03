import React from "react";
import styled from "styled-components";
import { List, Avatar, Tag, Popover, Comment, Divider } from "antd";
import ProfileModal from "../../modal/ProfileModal";
import { UserOutlined } from "@ant-design/icons";
import CommentForm from "./CommentForm";
import { useSelector } from "react-redux";
import CommentListItem from "./CommentListItem";
import { SERVER_URL } from "../../../lib/constant/constant";

/**
 * @author 박진호
 * @version 1.0
 * @summary 포스트 뷰어 컨텐트 컴포넌트
 */

// style

const PostViewerContentWrapper = styled.div`
  background: #fff;
  padding: 20px 40px;

  .post-summary {
    padding: 20px 0;
    .label {
      color: #888;
      flex: 1;
    }
    .content {
      flex: 10;
    }
    .summary-row {
      display: flex;
      padding: 5px 0;
    }
    @media (max-width: 768px) {
      .label {
        flex: 1;
      }
      .content {
        flex: 3;
      }
    }
  }
  .post-content {
    font-weight: 400;
    font-size: 16px;
    padding: 20px 0;

    .ql-syntax {
      background: #111;
      color: #fff;
      padding: 20px;
      border-radius: 4px;
      font-family: "Liberation Mono", Menlo, Courier, monospace;
    }
  }

  .comment-form {
    padding: 15px 0;
  }
`;

const PostViewerContent = ({ post, contentType }) => {
  // redux

  const { me } = useSelector((state) => state.user);

  // helper method

  const mergeFiles = () => {
    let mergedFiles = [];
    for (let i = 0; i < post.fileUrl.length; i++) {
      let newFile = {};
      newFile.url = `${SERVER_URL}/${post.fileUrl[i]}`;
      newFile.thumbUrl = `${SERVER_URL}/${post.fileUrl[i]}`;
      newFile.name = post.fileName[i];
      newFile.uid = i;
      newFile.status = "done";
      mergedFiles.push(newFile);
    }
    return mergedFiles;
  };

  return (
    <PostViewerContentWrapper>
      <div className="post-title">
        <h2>{post.title}</h2>
      </div>
      {contentType == "forum" && (
        <div className="post-summary">
          <div className="summary-row">
            <div className="label">
              <span>태그</span>
            </div>
            <div className="content">
              {post.tag.map((v, i) => (
                <Tag color="magenta" key={v}>
                  {v}
                </Tag>
              ))}
            </div>
          </div>
        </div>
      )}
      {(contentType == "study" || contentType === "project") && (
        <div className="post-summary">
          <div className="summary-row">
            <div className="label">
              <span>활용 기술</span>
            </div>
            <div className="content">
              {post.techStack.map((v, i) => (
                <Tag color="magenta" key={v}>
                  {v}
                </Tag>
              ))}
            </div>
          </div>
          <div className="summary-row">
            <div className="label">
              <span>지역</span>
            </div>
            <div className="content">
              <Tag color="geekblue">{post.location}</Tag>
            </div>
          </div>
          <div className="summary-row">
            <div className="label">
              <span>모집 인원</span>
            </div>
            <div className="content">
              <Tag color="gold">{post.recruitment}</Tag>
            </div>
          </div>
          <div className="summary-row">
            <div className="label">
              <span>진행 여부</span>
            </div>
            <div className="content">
              <Tag color="volcano">모집중</Tag>
            </div>
          </div>
        </div>
      )}

      <div className="post-content">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
      <div>
        <div>
          {mergeFiles().length > 0 && (
            <div style={{ textAlign: "right", color: "#999" }}>첨부파일</div>
          )}
          {mergeFiles().map((v, i) => (
            <div key={i} style={{ textAlign: "right", fontSize: "13px" }}>
              <a href={v.url} download>
                {v.name}
              </a>
            </div>
          ))}
        </div>
      </div>

      <div className="comment-list-wrapper">
        {post && (
          <List
            className="comment-list"
            header={`${post.comments.length}개의 댓글이 있습니다.`}
            itemLayout="horizontal"
            dataSource={post.comments}
            renderItem={(item) =>
              !item.commentTo && <CommentListItem item={item} post={post} />
            }
          />
        )}

        <div className="comment-form">
          <Divider />
          <Comment
            post={post}
            avatar={
              <Popover
                content={
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    {me && <ProfileModal writer={me}></ProfileModal>}
                  </div>
                }
              >
                <Avatar
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  style={{ cursor: "pointer" }}
                  icon={<UserOutlined />}
                  size={32}
                  src={
                    me &&
                    me.avatarUrl && (
                      <img
                        src={`${SERVER_URL}/${me.avatarUrl}`}
                        width={32}
                        hieght={32}
                      />
                    )
                  }
                />{" "}
              </Popover>
            }
            content={<CommentForm post={post} />}
          />
        </div>
      </div>
    </PostViewerContentWrapper>
  );
};

export default PostViewerContent;
