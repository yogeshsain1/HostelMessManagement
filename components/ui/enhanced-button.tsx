import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { forwardRef } from "react"
import type { ButtonProps } from "@/components/ui/button"

interface EnhancedButtonProps extends ButtonProps {
  gradient?: boolean
  glow?: boolean
}

const EnhancedButton = forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({ className, gradient = false, glow = false, ...props }, ref) => {
    return (
      <Button
        className={cn(
          "btn-modern transition-all duration-300",
          gradient && "gradient-primary text-primary-foreground border-0",
          glow && "hover:shadow-lg hover:shadow-primary/25",
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
EnhancedButton.displayName = "EnhancedButton"

export { EnhancedButton }
