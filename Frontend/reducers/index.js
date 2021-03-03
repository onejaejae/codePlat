import { HYDRATE } from "next-redux-wrapper";
import { combineReducers } from "redux";
import user from "./user";
import post from "./post";
import skill from "./skill";
import chat from "./chat";

/**
 * @author 박진호
 * @version 1.0
 * @summary 루트 리덕스 설정파일
 */

const rootReducer = (state, action) => {
  switch (action.type) {
    case HYDRATE:
      return action.payload;

    default: {
      const combineReducer = combineReducers({
        user,
        post,
        skill,
        chat,
      });
      return combineReducer(state, action);
    }
  }
};

export default rootReducer;
