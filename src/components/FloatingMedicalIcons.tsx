import { Heart, Pill, Stethoscope, Activity, Shield, Thermometer } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingMedicalIconsProps {
  className?: string;
}

export function FloatingMedicalIcons({ className }: FloatingMedicalIconsProps) {
  const icons = [
    { Icon: Heart, delay: "0s", position: "top-[10%] left-[5%]", size: "w-8 h-8" },
    { Icon: Pill, delay: "1s", position: "top-[20%] right-[8%]", size: "w-6 h-6" },
    { Icon: Stethoscope, delay: "2s", position: "top-[60%] left-[8%]", size: "w-7 h-7" },
    { Icon: Activity, delay: "0.5s", position: "bottom-[25%] right-[5%]", size: "w-8 h-8" },
    { Icon: Shield, delay: "1.5s", position: "top-[40%] right-[12%]", size: "w-6 h-6" },
    { Icon: Thermometer, delay: "2.5s", position: "bottom-[40%] left-[12%]", size: "w-5 h-5" },
  ];

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {icons.map(({ Icon, delay, position, size }, index) => (
        <div
          key={index}
          className={cn(
            "absolute animate-icon-float text-primary/30",
            position
          )}
          style={{ animationDelay: delay }}
        >
          <Icon className={size} />
        </div>
      ))}
    </div>
  );
}
