import * as React from "react";
import { cn } from "@/app/utils/utils";
import { AlertTriangle } from "lucide-react";

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive";
}

export default function Alert({
  className,
  variant = "default",
  children,
  ...props
}: AlertProps) {
  return (
    <div
      className={cn(
        "relative w-full rounded-lg border p-4 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4",
        variant === "destructive" &&
          "border-red-500/50 text-red-500 dark:border-red-500 [&>svg]:text-red-500",
        className
      )}
      {...props}
    >
      <AlertTriangle className="h-4 w-4" />
      <div className="pl-7">{children}</div>
    </div>
  );
}
