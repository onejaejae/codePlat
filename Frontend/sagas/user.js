import { takeLatest, call, put, delay, throttle } from "redux-saga/effects";
import {
  LOG_IN_REQUEST,
  LOG_IN_SUCCESS,
  LOG_IN_FAILURE,
  LOG_OUT_REQUEST,
  LOG_OUT_SUCCESS,
  LOG_OUT_FAILURE,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  SET_USER_REQUEST,
  SET_USER_SUCCESS,
  SET_USER_FAILURE,
} from "../reducers/user";
import { register, login, setUser, logout } from "../lib/api/user";
import axios from "axios";

/**
 * @author 박진호
 * @version 1.0
 * @summary 유저 관련 사가 설정파일
 * @note deprecated 된 것은 컴포넌트 혹은 페이지 내부에서 axios 직접 요청으로 대체
 */

// saga

function* setUserSaga(action) {
  try {
    const res = yield call(setUser);
    if (!res.data.user) {
      yield put({ type: SET_USER_SUCCESS, user: null });
    } else {
      yield put({ type: SET_USER_SUCCESS, user: res.data.user });
    }
  } catch (error) {
    console.log(error);
    yield put({ type: SET_USER_FAILURE });
  }
}

function* loginSaga(action) {
  try {
    const res = yield call(login, action.payload);
    yield put({ type: LOG_IN_SUCCESS, user: res.data.user });
  } catch (error) {
    console.log(error);
    if (error.response.data !== "Incorrect password.") {
      alert("이메일 인증을 완료해주세요.");
      axios
        .post(`/api/mailAuth`, { email: action.payload.email })
        .then((res) => {
          alert(
            "인증 링크가 포함된 이메일을 다시 보내드렸습니다. 확인해주세요!"
          );
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      yield put({ type: LOG_IN_FAILURE, error: error.response.data });
    }
  }
}

function* logoutSaga(action) {
  try {
    yield call(logout);
    yield put({ type: LOG_OUT_SUCCESS });
    window.location.href = `/`;
  } catch (error) {
    console.log(error);
    yield put({ type: LOG_OUT_FAILURE });
  }
}

// -> deprecated
function* registerSaga(action) {
  try {
    yield call(register, action.data);
    yield put({ type: REGISTER_SUCCESS });
  } catch (error) {
    yield put({ type: REGISTER_FAILURE });
  }
}

// watcher

export function* watchUser() {
  yield takeLatest(SET_USER_REQUEST, setUserSaga);
  yield takeLatest(LOG_IN_REQUEST, loginSaga);
  yield takeLatest(LOG_OUT_REQUEST, logoutSaga);
  yield takeLatest(REGISTER_REQUEST, registerSaga);
}
