const cn = (...inputs) => inputs.filter(Boolean).join(" ");

import * as React from "react";

const Button = React.forwardRef(({ className, variant, size, ...props }, ref) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all hover:scale-105 focus:outline-none disabled:opacity-50",
        "bg-silver text-black hover:bg-white",
        size === "lg" && "px-10 py-6 text-lg",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

export { Button };