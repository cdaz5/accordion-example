import {
  createContext as reactCreateContext,
  useContext as reactUseContext
} from "react";

export function createContext(options = {}) {
  const { strict = true, errorMessage = undefined, name } = options;

  const errorMsg =
    errorMessage ?? `use${name} must be used within a ${name}Provider`;

  const Context = reactCreateContext(undefined);

  Context.displayName = name;

  function useContext() {
    const context = reactUseContext(Context);

    if (!context && strict) {
      const error = new Error(errorMsg);
      error.name = "ContextError";
      Error.captureStackTrace?.(error, useContext);
      throw error;
    }

    return context;
  }

  return [Context.Provider, useContext, Context];
}
