"use client";

import * as React from "react";

interface ButtonProps extends React.InputHTMLAttributes<HTMLInputElement> {
  children: React.ReactNode;
  type: "button" | "reset" | "submit" | undefined;
}

const Button: React.FC<ButtonProps> = ({ children, type, ...props }) => {
  return (
    <button
      type={type || "submit"}
      disabled={props.disabled}
      className={props.className}
    >
      {children}
    </button>
  );
};

export default React.memo(Button);
