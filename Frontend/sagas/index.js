import { all, fork } from "redux-saga/effects";
import { watchUser } from "./user";
import { watchPost } from "./post";

/**
 * @author 박진호
 * @version 1.0
 * @summary 루트 사가 설정파일
 */

function* rootSaga() {
  yield all([fork(watchUser), fork(watchPost)]);
}

export default rootSaga;
