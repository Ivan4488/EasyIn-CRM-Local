import { useEffect, useState } from "react";
import { StoreApi } from "zustand";

export const useIntermediateState = <T>(
  store: StoreApi<T>,
  key = "default"
) => {
  const [initialState, setInitialState] = useState<Record<string, T>>({
    [key]: store.getState(),
  });

  const [isStateChanged, setIsStateChanged] = useState(false);

  const copyState = () => {
    setInitialState({
      [key]: store.getState(),
    });
    setIsStateChanged(false);
  };

  const resetState = () => {
    const initialStateByKey = initialState[key];
    if (!initialStateByKey) return;

    store.setState(initialStateByKey);
    setIsStateChanged(false);
  };

  const commitState = () => {
    setInitialState({
      [key]: store.getState(),
    });
    setIsStateChanged(false);
  };

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      if (
        JSON.stringify(initialState[key]) !== JSON.stringify(store.getState())
      ) {
        setIsStateChanged(true);
      }
    });

    return () => unsubscribe();
  }, [initialState, key, store]);

  return {
    copyState,
    resetState,
    isStateChanged,
    commitState,
    copiedState: initialState[key],
  };
};
