import { Button } from "@/components/ui/button";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PushToTalkButtonProps {
  isRecording: boolean;
  isProcessing: boolean;
  isDisabled?: boolean;
  onPressStart: () => void;
  onPressEnd: () => void;
  className?: string;
}

export function PushToTalkButton({
  isRecording,
  isProcessing,
  isDisabled,
  onPressStart,
  onPressEnd,
  className,
}: PushToTalkButtonProps) {
  const handleMouseDown = () => {
    if (!isDisabled && !isProcessing) {
      onPressStart();
    }
  };

  const handleMouseUp = () => {
    if (isRecording) {
      onPressEnd();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    handleMouseDown();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    handleMouseUp();
  };

  return (
    <div className={cn("relative", className)}>
      {/* Pulsing ring when recording */}
      {isRecording && (
        <div className="absolute inset-0 -m-2 rounded-full bg-primary/20 animate-listening" />
      )}
      
      <Button
        size="lg"
        variant={isRecording ? "default" : "outline"}
        className={cn(
          "w-16 h-16 rounded-full transition-all duration-200 shadow-card",
          isRecording && "gradient-primary scale-110 shadow-glow",
          isProcessing && "opacity-50"
        )}
        disabled={isDisabled || isProcessing}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {isProcessing ? (
          <Loader2 className="w-7 h-7 animate-spin" />
        ) : isRecording ? (
          <Mic className="w-7 h-7 animate-pulse" />
        ) : (
          <MicOff className="w-7 h-7" />
        )}
      </Button>
      
      <p className="text-xs text-center mt-2 text-muted-foreground">
        {isProcessing ? "Processing..." : isRecording ? "Listening..." : "Hold to speak"}
      </p>
    </div>
  );
}
