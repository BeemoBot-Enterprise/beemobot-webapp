import * as React from "react";
import { twMerge } from "tailwind-merge";

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={twMerge("text-sm font-medium text-text-muted", className)}
      {...props}
    />
  ),
);
Label.displayName = "Label";

export default Label;
