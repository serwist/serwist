"use client";
import { useState } from "react";

export function Button() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount((_old) => _old + 1)}>{count}</button>;
}
