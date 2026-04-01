import React from "react";
import { InputGroupContext, type GroupPosition } from "./InputGroupContext";

export interface InputGroupProps {
  children: React.ReactNode;
  className?: string;
}

export function InputGroup({ children, className }: InputGroupProps) {
  const childArray = React.Children.toArray(children).filter(
    React.isValidElement,
  );

  return (
    <div
      className={["flex items-stretch", className].filter(Boolean).join(" ")}
    >
      {childArray.map((child, index) => {
        const position: GroupPosition =
          childArray.length === 1
            ? "standalone"
            : index === 0
              ? "start"
              : index === childArray.length - 1
                ? "end"
                : "middle";

        return (
          <InputGroupContext.Provider
            key={index}
            value={{ inGroup: true, position }}
          >
            {child}
          </InputGroupContext.Provider>
        );
      })}
    </div>
  );
}
