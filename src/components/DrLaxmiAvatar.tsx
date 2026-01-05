import { cn } from "@/lib/utils";
import drLaxmiAvatar from "@/assets/dr-laxmi-avatar.jpg";

export type AvatarState = "idle" | "listening" | "speaking" | "concerned" | "reassuring";

interface DrLaxmiAvatarProps {
  state?: AvatarState;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  sm: "w-24 h-24",
  md: "w-40 h-40",
  lg: "w-56 h-56",
  xl: "w-72 h-72",
};

export function DrLaxmiAvatar({ state = "idle", className, size = "lg" }: DrLaxmiAvatarProps) {
  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      {/* Glow effect behind avatar */}
      <div 
        className={cn(
          "absolute inset-0 rounded-full blur-2xl transition-all duration-500",
          state === "listening" && "bg-primary/30 animate-listening-pulse",
          state === "speaking" && "bg-primary/40 scale-110",
          state === "concerned" && "bg-destructive/20",
          state === "reassuring" && "bg-accent/20",
          (state === "idle") && "bg-primary/20"
        )}
      />
      
      {/* Main avatar container */}
      <div 
        className={cn(
          "relative w-full h-full rounded-full overflow-hidden shadow-glow transition-transform duration-300 border-4 border-card",
          state === "idle" && "animate-breathe",
          state === "speaking" && "scale-105",
          state === "listening" && "ring-4 ring-primary/50 animate-pulse"
        )}
      >
        {/* Avatar image */}
        <img
          src={drLaxmiAvatar}
          alt="Dr. Laxmi AI"
          className={cn(
            "w-full h-full object-cover transition-transform duration-300",
            state === "speaking" && "scale-105"
          )}
        />
        
        {/* State overlay */}
        <div
          className={cn(
            "absolute inset-0 transition-opacity duration-300 pointer-events-none",
            state === "listening" && "bg-primary/10",
            state === "speaking" && "bg-accent/10 animate-pulse",
            state === "concerned" && "bg-destructive/10",
            state === "reassuring" && "bg-accent/10"
          )}
        />
      </div>
    </div>
  );
}
