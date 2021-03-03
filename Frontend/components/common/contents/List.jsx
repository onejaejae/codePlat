import React from "react";
import ListItem from "./ListItem";
import shortId from "shortid";

/**
 * @author 박진호
 * @version 1.0
 * @summary 포스트 리스트 컨테이너
 * @note 렌더링 최적화를 위해 List 컴포넌트와 ListItem 컴포넌트로 분리
 */

const List = ({ data, type }) => {
  return (
    <>
      {data.map((v, i) => (
        <ListItem
          key={v.id + shortId.generate()}
          item={v}
          type={type}
        ></ListItem>
      ))}
    </>
  );
};

export default React.memo(List);
