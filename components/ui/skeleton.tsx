import * as React from "react"

import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("bg-muted/40 animate-pulse rounded-md", className)}
      {...props}
    />
  )
}

export { Skeleton }



