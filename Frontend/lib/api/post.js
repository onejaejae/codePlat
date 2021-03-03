import client from "./client";

/**
 * @author 박진호
 * @version 1.0
 * @summary 포스트 관련 api 정의 파일
 * @note deprecated 된 것은 컴포넌트 혹은 페이지 내부에서 axios 직접 요청으로 대체
 */

export const mainLoadPosts = () => client.get(`/api/posts`);

export const writePost = (data) => {
  const config = {
    headers: {
      Accept: "application/json",
      enctype: "multipart/form-data",
    },
  };
  return client.post(`/api/posts`, data, config);
};

export const loadPost = (postId) => client.get(`/api/posts/${postId}`);

export const loadPosts = (data) => {
  const filteredTechStack = data.techStack.map((v, i) => {
    if (v === "C++") {
      return "C%2B%2B";
    }
    if (v === "C#") {
      return "C%23";
    } else {
      return v;
    }
  });

  return client.get(
    `/api/posts/getPosts?type=${
      data.type
    }&techStack=${filteredTechStack.toString()}&skip=${data.skip}&term=${
      data.term
    }&location=${data.location}`,
  );
};

export const loadForumPosts = (data) =>
  client.get(
    `/api/posts/getForum?type=${data.type}&term=${data.term}&skip=${data.skip}&field=${data.field}`,
  );

export const postScrap = (data) => client.post(`/api/scraps`, { ...data });

export const postUnScrap = (data) => client.delete(`/api/scraps/${data.id}`);

// -> deprecated
export const addComment = (data) => client.post(`/api/comments`, { ...data });

export const deletePost = (postId) => client.delete(`/api/posts/${postId}`);

// -> deprecated
export const deleteCommentWithChildren = (commentId) =>
  client.put(`/api/comments/parentDelete`, { id: commentId });

// -> deprecated
export const deleteComment = (commentId) =>
  client.delete(`/api/comments/${commentId}`);

export const upLike = (data) =>
  client.post(`/api/likes`, {
    type: data.type,
    id: data.id,
  });

export const unLike = (data) => client.delete(`/api/likes/${data.id}`);
