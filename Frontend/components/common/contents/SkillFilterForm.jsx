import React, { useState, useCallback, useEffect } from "react";
import { Select, Radio, Checkbox } from "antd";
import styled, { css } from "styled-components";
import { StackList } from "../../../lib/constant/constant";
import { useDispatch } from "react-redux";
import {
  skillChangeAction,
  initializeSkillAction,
} from "../../../reducers/skill";

/**
 * @author 박진호
 * @version 1.0
 * @summary 기술 스택 선택 폼 컴포넌트
 */

// style

const SkillFilterFormWrapper = styled.div`
  margin: 0 auto;
  width: 900px;
  ${(props) =>
    (props.type === "register" ||
      props.type === "write" ||
      props.type === "mypage") &&
    css`
      width: 100%;
    `}
  @media (max-width: 1268px) {
    width: 100%;
  }
`;

const RadioWrapper = styled.div`
  .ant-radio-group {
    display: flex;
    justify-content: space-between;

    .ant-radio-button-wrapper {
      flex: 1;
      z-index: 1;
      &:hover {
        color: #313355;
      }
    }
    .ant-radio-button-wrapper-checked {
      color: #fff;
      border: none;
      background: #313355;
      &::selection {
        border: none;
      }
      &::after {
        background: #313355 !important;
      }
      &::before {
        background: none;
      }
      &:hover {
        color: #fff;
      }
    }

    @media (max-width: 768px) {
      flex-direction: column;
    }
  }
`;

const CheckBoxWrapper = styled.div`
  padding: 20px;
  background: #fff;
  .ant-checkbox-wrapper {
    color: #777;
    font-weight: 400;
  }
`;

const SelectWrapper = styled.div`
  padding: 20px 0;
  .ant-select-selection-item-remove {
    display: none;
  }
  .ant-select {
    width: 100%;
  }
`;

const SkillFilterForm = ({ type, isEdit, values }) => {
  // redux

  const dispatch = useDispatch();

  // local state

  const [radioValue, setRadioValue] = useState("language");
  const [checkList, setCheckList] = useState(StackList.language);
  const [checkedValues, setCheckedValues] = isEdit
    ? useState(values)
    : useState([]);

  // event listener

  const onClickRadio = useCallback((e) => {
    setRadioValue(e.target.value);
    setCheckList(StackList[e.target.value]);
  }, []);

  const onClickCheckBox = useCallback(
    (e) => {
      if (checkedValues.includes(e.target.value)) {
        setCheckedValues(
          checkedValues.filter((v, i) => {
            return v !== e.target.value;
          }),
        );
      } else {
        if (!e.target.value) return;
        setCheckedValues(checkedValues.concat(e.target.value));
      }
    },
    [checkedValues, values],
  );

  // hooks

  useEffect(() => {
    dispatch(skillChangeAction(checkedValues));
  }, [checkedValues]);

  useEffect(() => {
    return () => {
      dispatch(initializeSkillAction());
    };
  }, []);

  return (
    <SkillFilterFormWrapper type={type}>
      <RadioWrapper>
        <Radio.Group defaultValue="language">
          <Radio.Button value="language" onClick={onClickRadio}>
            언어
          </Radio.Button>
          <Radio.Button value="framework" onClick={onClickRadio}>
            프레임워크
          </Radio.Button>
          <Radio.Button value="database" onClick={onClickRadio}>
            데이터베이스
          </Radio.Button>
          <Radio.Button value="cloudos" onClick={onClickRadio}>
            클라우드/OS
          </Radio.Button>
          <Radio.Button value="mldl" onClick={onClickRadio}>
            ML/DL
          </Radio.Button>
        </Radio.Group>
      </RadioWrapper>
      <CheckBoxWrapper>
        <Checkbox.Group
          options={checkList}
          defaultValue={isEdit ? values : []}
          onClick={onClickCheckBox}
        />
      </CheckBoxWrapper>
      <SelectWrapper>
        <Select
          mode="tags"
          placeholder={
            type === "register"
              ? "관심 기술을 선택해주세요."
              : "기술을 선택해주세요"
          }
          value={checkedValues}
        />
      </SelectWrapper>
    </SkillFilterFormWrapper>
  );
};

export default React.memo(SkillFilterForm);
