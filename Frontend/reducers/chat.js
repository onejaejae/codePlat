/**
 * @author 박진호
 * @version 1.0
 * @summary 채팅 관련 리덕스 설정파일
 */

import { handleActions, createAction } from "redux-actions";

// initial state

const initialState = {
  currentChatRoom: null,
};

// action type

export const SET_CURRENT_CHAT_ROOM = "chat/SET_CURRENT_CHAT_ROOM";

export const INITIALIZE_CHAT_ROOM = "chat/INITIALIZE_CHAT_ROOM";

// action creator

export const setCurrentChatRoomAction = createAction(
  SET_CURRENT_CHAT_ROOM,
  (data) => data,
);

export const initializeChatRoomAction = createAction(INITIALIZE_CHAT_ROOM);

// reducer

const chatReducer = handleActions(
  {
    [SET_CURRENT_CHAT_ROOM]: (state, action) => ({
      ...state,
      currentChatRoom: action.payload,
    }),
    [INITIALIZE_CHAT_ROOM]: (state, action) => ({
      ...state,
      currentChatRoom: null,
    }),
  },
  initialState,
);

export default chatReducer;
