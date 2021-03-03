import React, { useState, useCallback } from "react";

/**
 * @author 박진호
 * @version 1.0
 * @summary toggle 커스텀 훅
 */

const useToggle = (initialValue = false) => {
  const [toggle, setToggle] = useState(initialValue);
  const handler = useCallback(() => {
    setToggle(!toggle);
  }, [toggle]);

  return [toggle, handler];
};

export default useToggle;
