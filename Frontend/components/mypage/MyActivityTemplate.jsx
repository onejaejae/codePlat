import React, { useState, useEffect, useCallback } from "react";
import { Card, Radio } from "antd";
import List from "../common/contents/List";
import styled from "styled-components";
import axios from "axios";
import { useSelector } from "react-redux";
import Link from "next/link";
import moment from "moment";

/**
 * @author 박진호
 * @version 1.0
 * @summary 유저 활동 정보(게시글, 댓글, 스크랩) 컴포넌트
 */

// style

const MyActivityWrapper = styled.div`
  display: flex;
  .activity_type {
    flex: 1;
    padding: 20px;
    .ant-radio-group {
      .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):first-child {
        border-color: #4f528a;
      }
      .ant-radio-button-wrapper {
        width: 200px;
        text-align: center;
        border-radius: 0px;
      }
      span {
        color: #111;
      }
    }
  }
  .myActivity {
    flex: 4;
    padding: 20px;
    .ant-tabs-tab-btn {
      color: #111;
    }
    .ant-tabs-ink-bar {
      background: #4f528a;
    }
  }
  @media (max-width: 768px) {
    display: block;
  }
`;

const MyCommentWrapper = styled.div`
  margin: 20px 0;
  padding-bottom: 5px;
  border-bottom: 1px solid #ddd;
`;

const MyActivityTemplate = () => {
  // redux

  const { me } = useSelector((state) => state.user);

  // local state

  const [currentType, setCurrentType] = useState("study");
  const [loading, setLoading] = useState(false);
  const [contents, setContents] = useState(null);
  const [posts, setPosts] = useState(null);
  const [currTab, setCurrTab] = useState({
    key: "post",
    tab: "게시글",
  });

  // event listener

  const onClickTypeBtn = useCallback((e) => {
    setContents(null);
    setPosts(null);
    setCurrentType(e.target.value);
  }, []);

  const onTabChange = (key, type) => {
    setContents(null);
    setPosts(null);
    setCurrTab({ [type]: key });
  };

  // helper variable

  const tabListTitle = [
    {
      key: "post",
      tab: "게시글",
    },
    {
      key: "comments",
      tab: "댓글",
    },
    {
      key: "scraps",
      tab: "스크랩",
    },
  ];

  // hooks

  useEffect(async () => {
    if (me) {
      setLoading(true);
      await axios
        .get(`/api/users/${me._id}?type=${currentType}&sort=${currTab.key}`)
        .then((res) => {
          setContents(res.data.activities);
          if (res.data.posts) {
            setPosts(res.data.posts);
          }
        })
        .catch((err) => {
          console.log(err);
        });

      setLoading(false);
    }
  }, [currentType, currTab, me]);

  if (!contents) return null;
  if (loading) return null;

  return (
    <MyActivityWrapper>
      <div className="activity_type">
        <Radio.Group onChange={onClickTypeBtn} defaultValue={currentType}>
          <div>
            <Radio.Button value="study" onChange={onClickTypeBtn}>
              스터디
            </Radio.Button>
          </div>
          <div>
            <Radio.Button value="project" onChange={onClickTypeBtn}>
              프로젝트
            </Radio.Button>
          </div>
          <div>
            <Radio.Button value="forum" onChange={onClickTypeBtn}>
              포럼
            </Radio.Button>
          </div>
        </Radio.Group>
      </div>
      <div className="myActivity">
        <Card
          style={{ width: "100%" }}
          tabList={tabListTitle}
          activeTabKey={currTab.key}
          onTabChange={(key) => {
            onTabChange(key, "key");
          }}
        >
          {currTab.key === "post" && (
            <div
              style={{
                overflow: "auto",
                height: "59vh",
              }}
            >
              <List data={contents} type={currentType} />
            </div>
          )}
          {currTab.key === "comments" && (
            <div
              style={{
                overflow: "auto",
                height: "59vh",
              }}
            >
              {contents.map((v, i) => {
                let flag = false;
                let post = null;
                posts.forEach((s, j) => {
                  if (v.postId === s._id) {
                    flag = true;
                    post = s;
                  }
                });
                if (flag) {
                  return (
                    <MyCommentWrapper key={i}>
                      <div>
                        <span style={{ fontSize: "16px", fontWeight: "500" }}>
                          {v.content}
                        </span>
                      </div>
                      <div>
                        <Link href={`articles/${post.type}/${post._id}`}>
                          <a>{post.title}</a>
                        </Link>{" "}
                        글에 남긴 댓글
                      </div>
                      <div>
                        <span style={{ color: "#999", fontSize: "10px" }}>
                          {moment(v.createdAt).format("MM/DD HH:mm")}
                        </span>
                      </div>
                    </MyCommentWrapper>
                  );
                }
              })}
            </div>
          )}
          {currTab.key === "scraps" && (
            <div
              style={{
                overflow: "auto",
                height: "59vh",
              }}
            >
              <List data={posts} type={currentType} />
            </div>
          )}
        </Card>
      </div>
    </MyActivityWrapper>
  );
};

export default MyActivityTemplate;
