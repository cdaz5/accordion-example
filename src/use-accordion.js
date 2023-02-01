import { useState, useRef, useCallback } from "react";

import { useFocusIndexTracker } from "./use-focus-tracker";

export const useAccordion = () => {
  const panelRefs = useRef({});
  const [items, setItems] = useState({});
  const [focus, setFocus] = useFocusIndexTracker(Object.keys(items).length);

  const toggle = useCallback(
    (id) => {
      if (!id || !(id in items)) return;

      setItems((prev) => ({
        ...prev,
        [id]: !prev[id]
      }));
    },
    [items, setItems]
  );

  return {
    items,
    setItems,
    toggle,
    focus,
    setFocus,
    panelRefs
  };
};
