import { useState, useCallback, useEffect } from "react";

export const useFocusIndexTracker = (size) => {
  const [currentFocus, setCurrentFocus] = useState(null);

  const handleKeyDown = useCallback(
    (e) => {
      const { key } = e;

      if (currentFocus === null) return;

      if (key === "ArrowDown") {
        e.preventDefault();
        // eslint-disable-next-line consistent-return
        return setCurrentFocus(
          currentFocus === size - 1 ? 0 : currentFocus + 1
        );
      }

      if (key === "ArrowUp") {
        e.preventDefault();
        setCurrentFocus(currentFocus === 0 ? size - 1 : currentFocus - 1);
      }
    },
    [size, currentFocus, setCurrentFocus]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown, false);
    return () => {
      document.removeEventListener("keydown", handleKeyDown, false);
    };
  }, [handleKeyDown]);

  return [currentFocus, setCurrentFocus];
};
