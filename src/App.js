import { useId, useCallback, useRef, useMemo, useEffect } from "react";
import styled from "styled-components";
import "./styles.css";
import { createContext } from "./helpers";
import { useAccordion } from "./use-accordion";

const [AccordionStateContextProvider, useAccordionState] = createContext({
  name: "AccordionStateContext"
});

const Accordion = ({ children }) => {
  const state = useAccordion();
  return (
    <AccordionStateContextProvider value={state}>
      <div>{children}</div>
    </AccordionStateContextProvider>
  );
};

const useAccordionSection = () => {
  const {
    items,
    setItems,
    toggle,
    focus,
    setFocus,
    panelRefs
  } = useAccordionState();

  const triggerId = useId();
  const panelId = useId();
  const sectionId = useId();

  const triggerRef = useRef(null);
  const panelRef = useRef(null);
  const isOpen = useMemo(() => items[sectionId], [items, sectionId]);

  useEffect(() => {
    if (!(sectionId in panelRefs.current) && panelRef.current) {
      panelRefs.current = {
        ...panelRefs.current,
        [sectionId]: panelRef.current
      };
    }

    if (sectionId in items) return;

    setItems((prev) => ({
      ...prev,
      [sectionId]: false
    }));
  }, [sectionId, setItems, items, panelRefs]);

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
    (sId) => () => {
      toggle(sId);
    },
    [toggle]
  );

  const getTriggerProps = useCallback(
    ({ onOpen }) => ({
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

  return {
    triggerId,
    panelId,
    sectionId,
    getTriggerProps,
    getPanelProps,
    isOpen: items[sectionId]
  };
};

export const [
  AccordionSectionStateProvider,
  useAccordionSectionState
] = createContext({
  name: "AccordionSectionContext"
});

const StyledSection = styled.div``;

const AccordionSection = ({ children, ...props }) => {
  const state = useAccordionSection(props);

  return (
    <AccordionSectionStateProvider value={state}>
      <StyledSection {...props} id={state.sectionId}>
        {children}
      </StyledSection>
    </AccordionSectionStateProvider>
  );
};

const StyledTrigger = styled.button``;

export const AccordionTrigger = ({ children, onOpen, ...props }) => {
  const { getTriggerProps } = useAccordionSectionState();

  return (
    <StyledTrigger {...props} {...getTriggerProps({ onOpen })}>
      {children}
    </StyledTrigger>
  );
};

const StyledPanel = styled.div`
  height: ${({ isOpen }) => (isOpen ? "auto" : "0")};
  overflow: hidden;
`;

export const AccordionPanel = ({
  children,
  triggerHeightRecalculation,
  style = {},
  ...props
}) => {
  const { isOpen, getPanelProps } = useAccordionSectionState();

  return (
    <StyledPanel {...props} {...getPanelProps()} isOpen={isOpen}>
      {children}
    </StyledPanel>
  );
};

export default function App() {
  return (
    <div className="App">
      <Accordion>
        <div>cool im some div in middle of accordion</div>
        <AccordionSection>
          <AccordionTrigger>click me to open</AccordionTrigger>
          <AccordionPanel>soem stuff</AccordionPanel>
        </AccordionSection>
        <AccordionSection>
          <AccordionTrigger>click me to another</AccordionTrigger>
          <AccordionPanel>soem stuff 222</AccordionPanel>
        </AccordionSection>
      </Accordion>
    </div>
  );
}
