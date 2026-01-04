import { cn } from "@/lib/utils";

export type AvatarState = "idle" | "listening" | "speaking" | "concerned" | "reassuring";

interface DrLaxmiAvatarProps {
  state: AvatarState;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  sm: "w-24 h-24",
  md: "w-40 h-40",
  lg: "w-56 h-56",
  xl: "w-72 h-72",
};

export function DrLaxmiAvatar({ state, className, size = "lg" }: DrLaxmiAvatarProps) {
  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      {/* Glow effect behind avatar */}
      <div 
        className={cn(
          "absolute inset-0 rounded-full blur-2xl transition-all duration-500",
          state === "listening" && "bg-primary/30 animate-listening",
          state === "speaking" && "bg-primary/40 scale-110",
          state === "concerned" && "bg-warning/20",
          state === "reassuring" && "bg-success/20",
          (state === "idle") && "bg-primary/20"
        )}
      />
      
      {/* Main avatar container */}
      <div 
        className={cn(
          "relative w-full h-full rounded-full overflow-hidden shadow-card transition-transform duration-300",
          state === "idle" && "animate-breathe",
          state === "speaking" && "scale-105"
        )}
      >
        {/* Avatar SVG */}
        <svg 
          viewBox="0 0 200 200" 
          className="w-full h-full"
          style={{ background: "linear-gradient(135deg, hsl(200 40% 97%), hsl(174 30% 92%))" }}
        >
          {/* Hair - Black Indian style */}
          <ellipse cx="100" cy="85" rx="65" ry="70" fill="#1a1a2e" />
          <path d="M35 85 Q35 140 60 160 Q45 120 50 90 Q50 50 100 40 Q150 50 150 90 Q155 120 140 160 Q165 140 165 85 Q165 35 100 25 Q35 35 35 85" fill="#1a1a2e" />
          
          {/* Face */}
          <ellipse cx="100" cy="100" rx="55" ry="60" fill="#d4a574" />
          
          {/* Neck */}
          <rect x="85" y="150" width="30" height="30" fill="#d4a574" />
          
          {/* White Coat */}
          <path d="M50 175 Q50 200 70 200 L130 200 Q150 200 150 175 L145 165 Q100 180 55 165 Z" fill="white" />
          <path d="M55 165 L70 200 M145 165 L130 200" stroke="#e8e8e8" strokeWidth="2" fill="none" />
          
          {/* Collar */}
          <path d="M75 160 L85 175 L100 165 L115 175 L125 160" fill="white" stroke="#e8e8e8" strokeWidth="1" />
          
          {/* Stethoscope */}
          <path d="M80 170 Q75 185 85 195" stroke="#2d3748" strokeWidth="3" fill="none" strokeLinecap="round" />
          <circle cx="85" cy="195" r="4" fill="#4a5568" />
          <path d="M80 175 L78 178" stroke="#4a5568" strokeWidth="2" />
          
          {/* Eyes */}
          <g className={cn(state !== "speaking" && "animate-blink")} style={{ transformOrigin: "100px 95px" }}>
            {/* Left eye */}
            <ellipse cx="80" cy="95" rx="10" ry="8" fill="white" />
            <circle 
              cx={state === "listening" ? "82" : "80"} 
              cy="95" 
              r="5" 
              fill="#2d1810"
              className="transition-all duration-300"
            />
            <circle cx={state === "listening" ? "83" : "81"} cy="93" r="2" fill="white" />
            
            {/* Right eye */}
            <ellipse cx="120" cy="95" rx="10" ry="8" fill="white" />
            <circle 
              cx={state === "listening" ? "122" : "120"} 
              cy="95" 
              r="5" 
              fill="#2d1810"
              className="transition-all duration-300"
            />
            <circle cx={state === "listening" ? "123" : "121"} cy="93" r="2" fill="white" />
          </g>
          
          {/* Eyebrows */}
          <path 
            d={state === "concerned" 
              ? "M68 82 Q80 78 92 82" 
              : "M68 85 Q80 80 92 85"
            } 
            stroke="#1a1a2e" 
            strokeWidth="2.5" 
            fill="none" 
            strokeLinecap="round"
            className="transition-all duration-300"
          />
          <path 
            d={state === "concerned" 
              ? "M108 82 Q120 78 132 82" 
              : "M108 85 Q120 80 132 85"
            } 
            stroke="#1a1a2e" 
            strokeWidth="2.5" 
            fill="none" 
            strokeLinecap="round"
            className="transition-all duration-300"
          />
          
          {/* Nose */}
          <path d="M100 100 Q105 110 100 118 Q97 118 98 115" stroke="#c49a6c" strokeWidth="2" fill="none" />
          
          {/* Mouth */}
          {state === "speaking" ? (
            <ellipse 
              cx="100" 
              cy="135" 
              rx="12" 
              ry="6" 
              fill="#c44d56"
              className="animate-speaking"
              style={{ transformOrigin: "100px 135px" }}
            />
          ) : state === "reassuring" || state === "idle" ? (
            <path d="M88 132 Q100 142 112 132" stroke="#c44d56" strokeWidth="3" fill="none" strokeLinecap="round" />
          ) : state === "concerned" ? (
            <path d="M90 135 Q100 132 110 135" stroke="#c44d56" strokeWidth="3" fill="none" strokeLinecap="round" />
          ) : (
            <path d="M90 133 Q100 138 110 133" stroke="#c44d56" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          )}
          
          {/* Bindi */}
          <circle cx="100" cy="72" r="3" fill="#c44d56" />
          
          {/* Earrings */}
          <circle cx="43" cy="105" r="4" fill="#ffd700" />
          <circle cx="157" cy="105" r="4" fill="#ffd700" />
          
          {/* Subtle blush */}
          <ellipse cx="70" cy="115" rx="10" ry="5" fill="#e8a090" opacity="0.3" />
          <ellipse cx="130" cy="115" rx="10" ry="5" fill="#e8a090" opacity="0.3" />
        </svg>
      </div>
      
      {/* Status indicator */}
      <div 
        className={cn(
          "absolute bottom-2 right-2 w-4 h-4 rounded-full border-2 border-white transition-colors duration-300",
          state === "idle" && "bg-success",
          state === "listening" && "bg-primary animate-pulse",
          state === "speaking" && "bg-accent-foreground",
          state === "concerned" && "bg-warning",
          state === "reassuring" && "bg-success"
        )}
      />
    </div>
  );
}
