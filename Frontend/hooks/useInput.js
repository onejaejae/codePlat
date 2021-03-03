import React, { useState, useCallback } from "react";

/**
 * @author 박진호
 * @version 1.0
 * @summary input 커스텀 훅
 */

const useInput = (initialValue = "") => {
  const [value, setValue] = useState(initialValue);
  const handler = useCallback((e) => {
    setValue(e.target.value);
  }, []);

  return [value, handler];
};

export default useInput;
