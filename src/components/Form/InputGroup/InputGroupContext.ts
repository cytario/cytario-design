import { createContext, useContext } from "react";

export type GroupPosition = "start" | "middle" | "end" | "standalone";

interface InputGroupContextValue {
  inGroup: boolean;
  position: GroupPosition;
}

export const InputGroupContext = createContext<InputGroupContextValue>({
  inGroup: false,
  position: "standalone",
});

export function useInputGroup() {
  return useContext(InputGroupContext);
}
