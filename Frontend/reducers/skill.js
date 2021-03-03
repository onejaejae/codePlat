import { handleActions, createAction } from "redux-actions";

/**
 * @author 박진호
 * @version 1.0
 * @summary 기술스택 관련 리덕스 설정파일
 */

// initial state

const initialState = {
  skill: [],
};

// action type

export const INITIALIZE_SKILL = "skill/INITIALIZE_SKILL";

export const CHANGE_SKILL = "skill/CHANGE_SKILL";

// action creator

export const initializeSkillAction = createAction(INITIALIZE_SKILL);

export const skillChangeAction = createAction(CHANGE_SKILL, (data) => data);

// reducer

const skillReducer = handleActions(
  {
    [INITIALIZE_SKILL]: (state, action) => ({
      ...state,
      skill: [],
    }),
    [CHANGE_SKILL]: (state, action) => ({
      ...state,
      skill: action.payload,
    }),
  },
  initialState,
);

export default skillReducer;
