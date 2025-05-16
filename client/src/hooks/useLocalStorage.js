import { useState } from "react";

export function useLocalStorage (key,value="dark") {

  const [state, setState] = useState(localStorage.getItem(key) || value);

  const handleOnState = (newState) => {
    setState(newState);
    localStorage.setItem(key, newState)
  }

  return [state, handleOnState];
}