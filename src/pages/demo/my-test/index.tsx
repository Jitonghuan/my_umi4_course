import React, { useState, useEffect, useMemo, useRef } from 'react';

export default function App(porps: any) {
  const [count, setCount] = useState(0);
  const doubleCount = useMemo(() => {
    return 2 * count;
  }, [count]);

  const couterRef = useRef();

  useEffect(() => {
    document.title = `The value is ${count}`;
    console.log(couterRef.current);
  }, [count]);

  return (
    <button
      onClick={() => {
        setCount(count + 1);
      }}
    >
      Count:{count},double:{doubleCount}
    </button>
  );
}
