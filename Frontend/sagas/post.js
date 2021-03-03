import { takeLatest, call, put, throttle, takeEvery } from "redux-saga/effects";
import {
  LOAD_POSTS_REQUEST,
  LOAD_POSTS_SUCCESS,
  LOAD_POSTS_FAILURE,
  MAIN_LOAD_POSTS_REQUEST,
  MAIN_LOAD_POSTS_SUCCESS,
  MAIN_LOAD_POSTS_FAILURE,
  LOAD_POST_REQUEST,
  LOAD_POST_SUCCESS,
  LOAD_POST_FAILURE,
  WRITE_POST_REQUEST,
  WRITE_POST_SUCCESS,
  WRITE_POST_FAILURE,
  POST_SCRAP_REQUEST,
  POST_SCRAP_SUCCESS,
  POST_SCRAP_FAILURE,
  ADD_COMMENT_REQUEST,
  ADD_COMMENT_SUCCESS,
  ADD_COMMENT_FAILURE,
  LOAD_FORUM_POSTS_REQUEST,
  LOAD_FORUM_POSTS_SUCCESS,
  LOAD_FORUM_POSTS_FAILURE,
  DELETE_COMMENT_REQUEST,
  DELETE_COMMENT_SUCCESS,
  DELETE_COMMENT_FAILURE,
  DELETE_POST_REQUEST,
  DELETE_POST_SUCCESS,
  DELETE_POST_FAILURE,
  LIKE_POST_REQUEST,
  LIKE_POST_SUCCESS,
  LIKE_POST_FAILURE,
  UNLIKE_POST_REQUEST,
  UNLIKE_POST_SUCCESS,
  UNLIKE_POST_FAILURE,
  LIKE_COMMENT_REQUEST,
  LIKE_COMMENT_SUCCESS,
  LIKE_COMMENT_FAILURE,
  UNLIKE_COMMENT_REQUEST,
  UNLIKE_COMMENT_SUCCESS,
  UNLIKE_COMMENT_FAILURE,
  POST_UNSCRAP_SUCCESS,
  POST_UNSCRAP_FAILURE,
  POST_UNSCRAP_REQUEST,
} from "../reducers/post";

import {
  mainLoadPosts,
  writePost,
  loadPost,
  loadPosts,
  loadForumPosts,
  addComment,
  deletePost,
  deleteComment,
  deleteCommentWithChildren,
  upLike,
  unLike,
  postScrap,
  postUnScrap,
} from "../lib/api/post";

/**
 * @author 박진호
 * @version 1.0
 * @summary 포스트 관련 사가 설정파일
 * @note deprecated 된 것은 컴포넌트 혹은 페이지 내부에서 axios 직접 요청으로 대체
 */

// saga

function* loadPostSaga(action) {
  try {
    const { postId } = action.payload;
    const res = yield call(loadPost, postId);
    yield put({
      type: LOAD_POST_SUCCESS,
      post: res.data.post,
    });
  } catch (error) {
    console.log(error);
    yield put({
      type: LOAD_POST_FAILURE,
    });
  }
}

function* loadPostsSaga(action) {
  try {
    const res = yield call(loadPosts, action.payload);
    yield put({
      type: LOAD_POSTS_SUCCESS,
      contentType: action.payload.type,
      data: res.data.posts,
      temporalPostsLength: res.data.postSize,
    });
  } catch (error) {
    console.log(error);
    yield put({
      type: LOAD_POSTS_FAILURE,
      contentType: action.payload,
    });
  }
}

function* mainLoadPostsSaga(action) {
  try {
    const res = yield call(mainLoadPosts);
    const { study, project, forum } = res.data.posts;
    yield put({
      type: MAIN_LOAD_POSTS_SUCCESS,
      study,
      project,
      forum,
    });
  } catch (error) {
    console.log(error);
    yield put({
      type: MAIN_LOAD_POSTS_FAILURE,
    });
  }
}

function* writePostSaga(action) {
  try {
    const res = yield call(writePost, action.payload);
    yield put({ type: WRITE_POST_SUCCESS });
    const post = res.data.post;
    window.location.href = `/articles/${post.type}/${post._id}`;
  } catch (error) {
    console.log(error);
    yield put({
      type: WRITE_POST_FAILURE,
    });
  }
}

function* postScrapSaga(action) {
  try {
    const res = yield call(postScrap, action.payload);
    yield put({ type: POST_SCRAP_SUCCESS, scrap: res.data.scrap });
  } catch (error) {
    console.log(error);
    yield put({
      type: POST_SCRAP_FAILURE,
    });
  }
}

function* postUnScrapSaga(action) {
  try {
    yield call(postUnScrap, action.payload);
    yield put({ type: POST_UNSCRAP_SUCCESS, scrapId: action.payload.id });
  } catch (error) {
    console.log(error);
    yield put({
      type: POST_UNSCRAP_FAILURE,
    });
  }
}

// -> deprecated
function* addCommentSaga(action) {
  try {
    const res = yield call(addComment, action.payload);
    yield put({
      type: ADD_COMMENT_SUCCESS,
    });
  } catch (error) {
    console.log(error);
    yield put({
      type: ADD_COMMENT_FAILURE,
    });
  }
}

function* loadForumPostsSaga(action) {
  try {
    const res = yield call(loadForumPosts, action.payload);
    yield put({
      type: LOAD_FORUM_POSTS_SUCCESS,
      forumPosts: res.data.posts,
      temporalPostsLength: res.data.postSize,
    });
  } catch (error) {
    yield put({
      type: LOAD_FORUM_POSTS_FAILURE,
    });
  }
}

function* deletePostSaga(action) {
  try {
    yield call(deletePost, action.payload);
    yield put({ type: DELETE_POST_SUCCESS });
  } catch (error) {
    console.log(error);
    yield put({ type: DELETE_POST_FAILURE });
  }
}

// -> deprecated
function* deleteCommentSaga(action) {
  try {
    if (action.payload.type === "children") {
      yield call(deleteCommentWithChildren, action.payload.id);
    } else {
      yield call(deleteComment, action.payload.id);
    }
    yield put({ type: DELETE_COMMENT_SUCCESS });
  } catch (error) {
    console.log(error);
    yield put({ type: DELETE_COMMENT_FAILURE });
  }
}

function* upLikePostSaga(action) {
  try {
    const res = yield call(upLike, action.payload);
    yield put({
      type: LIKE_POST_SUCCESS,
      user: action.payload.user,
      postId: action.payload.id,
      like: res.data.like,
    });
  } catch (error) {
    console.log(error);
    yield put({ type: LIKE_POST_FAILURE });
  }
}

function* unLikePostSaga(action) {
  try {
    yield call(unLike, action.payload);
    yield put({
      type: UNLIKE_POST_SUCCESS,
      user: action.payload.user,
      likeId: action.payload.id,
      postId: action.payload.id,
    });
  } catch (error) {
    console.log(error);
    yield put({ type: UNLIKE_POST_FAILURE });
  }
}

function* upLikeCommentSaga(action) {
  try {
    const res = yield call(upLike, action.payload);
    yield put({
      type: LIKE_COMMENT_SUCCESS,
      user: action.payload.user,
      commentId: action.payload.id,
      like: res.data.like,
    });
  } catch (error) {
    console.log(error);
    yield put({ type: LIKE_COMMENT_FAILURE });
  }
}

function* unLikeCommentSaga(action) {
  try {
    yield call(unLike, action.payload);
    yield put({
      type: UNLIKE_COMMENT_SUCCESS,
      user: action.payload.user,
      likeId: action.payload.id,
      commentId: action.payload.commentId,
    });
  } catch (error) {
    console.log(error);
    yield put({ type: UNLIKE_COMMENT_FAILURE });
  }
}

// watcher

export function* watchPost() {
  yield takeLatest(MAIN_LOAD_POSTS_REQUEST, mainLoadPostsSaga);
  yield takeLatest(LOAD_POSTS_REQUEST, loadPostsSaga);
  yield takeLatest(LOAD_POST_REQUEST, loadPostSaga);
  yield throttle(2000, WRITE_POST_REQUEST, writePostSaga);
  yield takeLatest(POST_SCRAP_REQUEST, postScrapSaga);
  yield takeLatest(POST_UNSCRAP_REQUEST, postUnScrapSaga);
  yield throttle(2000, ADD_COMMENT_REQUEST, addCommentSaga);
  yield takeLatest(LOAD_FORUM_POSTS_REQUEST, loadForumPostsSaga);
  yield takeLatest(DELETE_POST_REQUEST, deletePostSaga);
  yield takeEvery(DELETE_COMMENT_REQUEST, deleteCommentSaga);
  yield takeLatest(LIKE_POST_REQUEST, upLikePostSaga);
  yield takeLatest(UNLIKE_POST_REQUEST, unLikePostSaga);
  yield takeLatest(LIKE_COMMENT_REQUEST, upLikeCommentSaga);
  yield takeLatest(UNLIKE_COMMENT_REQUEST, unLikeCommentSaga);
}
