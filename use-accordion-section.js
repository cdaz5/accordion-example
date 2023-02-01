import { useId } from "react";
const useAccordionSection = () => {
  const {
    items,
    setItems,
    toggle,
    focus,
    setFocus,
    panelRefs,
    animatePanelHeight,
    maxPanelHeight,
    fixedPanelHeight
  } = useAccordionState();

  const triggerId = useId();
  const panelId = useId();
  const sectionId = useId();

  const triggerRef = useRef < HTMLButtonElement > null;
  const panelRef = useRef < HTMLDivElement > null;
  const isOpen = useMemo(() => items[sectionId], [items, sectionId]);

  useEffect(() => {
    if (!(sectionId in panelRefs.current) && panelRef.current) {
      panelRefs.current = {
        ...panelRefs.current,
        [sectionId]: panelRef.current
      };
    }

    if (sectionId in items) return;

    if (initIsOpen) {
      animateHeight({
        variant: "open",
        el: panelRef.current,
        maxPanelHeight,
        fixedPanelHeight
      });
    }
    setItems((prev) => ({
      ...prev,
      [sectionId]: initIsOpen
    }));
  }, [
    sectionId,
    setItems,
    items,
    panelRefs,
    initIsOpen,
    maxPanelHeight,
    fixedPanelHeight
  ]);

  useEffect(() => {
    const idx = Object.keys(items).indexOf(sectionId);
    if (focus !== idx) return;

    triggerRef.current?.focus();
  }, [focus, items, sectionId]);

  const getPanelProps = useCallback(
    () => ({
      id: panelId,
      "aria-labelledby": triggerId,
      role: "region",
      isOpen,
      ref: panelRef
    }),
    [panelId, triggerId, isOpen]
  );

  const handleClick = useCallback(
    (sId: string, { onOpen }: { onOpen?: () => void }) => () => {
      if (isDisabled) return;

      if (onOpen && !items[sId]) {
        onOpen();
      }

      toggle(sId);
    },
    [toggle, isDisabled, items]
  );

  const getTriggerProps = useCallback(
    ({ onOpen }: { onOpen?: () => void }) => ({
      id: triggerId,
      "aria-expanded": isOpen,
      "aria-controls": panelId,
      onClick: handleClick(sectionId, { onOpen }),
      ref: triggerRef,
      onFocus: () => {
        // object insertion order is preserved now since ES15 C.D. 6/23/21
        const idx = Object.keys(items).indexOf(sectionId);
        setFocus(idx);
      },
      isOpen
    }),
    [items, panelId, sectionId, triggerId, handleClick, isOpen, setFocus]
  );

  const animate = useCallback(() => animatePanelHeight(sectionId), [
    sectionId,
    animatePanelHeight
  ]);

  return {
    triggerId,
    panelId,
    sectionId,
    getTriggerProps,
    getPanelProps,
    isOpen: items[sectionId],
    animatePanelHeight: animate
  };
};
