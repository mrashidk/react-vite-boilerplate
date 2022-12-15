import { useRef, useEffect } from 'react';

const usePrevious = (value: never) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export default usePrevious;
