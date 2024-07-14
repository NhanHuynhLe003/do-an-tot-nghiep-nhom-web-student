import clsx from "clsx";
import React, { forwardRef } from "react";

import styles from "./Action.module.css";

export const Action = forwardRef(
  ({ children, active, className, cursor, style, ...props }, ref) => {
    return (
      <button
        ref={ref}
        {...props}
        className={clsx(styles.Action, className)}
        tabIndex={0}
        style={{
          ...style,
          cursor,
          "--fill": active?.fill,
          "--background": active?.background,
        }}
      >
        {children}
      </button>
    );
  }
);
