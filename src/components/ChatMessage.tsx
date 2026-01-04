import { cn } from "@/lib/utils";
import { AlertTriangle, Check, X, Pill } from "lucide-react";
import type { Message } from "@/hooks/useMedicalChat";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  
  return (
    <div
      className={cn(
        "flex w-full animate-fade-in-up",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-3 shadow-soft",
          isUser 
            ? "bg-primary text-primary-foreground rounded-br-md" 
            : "bg-card border border-border rounded-bl-md",
          message.isEmergency && !isUser && "border-destructive bg-destructive/5"
        )}
      >
        {/* Emergency alert */}
        {message.isEmergency && !isUser && (
          <div className="flex items-center gap-2 text-destructive mb-2 pb-2 border-b border-destructive/20">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm font-semibold">Please seek immediate medical attention</span>
          </div>
        )}
        
        {/* Message content */}
        <p className={cn(
          "text-sm leading-relaxed whitespace-pre-wrap",
          isUser ? "text-primary-foreground" : "text-foreground"
        )}>
          {message.content}
        </p>
        
        {/* Suggestions cards */}
        {message.suggestions && !isUser && (
          <div className="mt-3 space-y-2">
            {/* Medications */}
            {message.suggestions.medications && message.suggestions.medications.length > 0 && (
              <div className="p-2 bg-secondary/50 rounded-lg">
                <div className="flex items-center gap-1.5 text-xs font-medium text-secondary-foreground mb-1.5">
                  <Pill className="w-3.5 h-3.5" />
                  Suggested OTC Medications
                </div>
                <ul className="space-y-1">
                  {message.suggestions.medications.map((med, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                      <span className="text-primary">•</span>
                      {med}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Do's */}
            {message.suggestions.dos && message.suggestions.dos.length > 0 && (
              <div className="p-2 bg-success/10 rounded-lg">
                <div className="flex items-center gap-1.5 text-xs font-medium text-success mb-1.5">
                  <Check className="w-3.5 h-3.5" />
                  Do's
                </div>
                <ul className="space-y-1">
                  {message.suggestions.dos.map((item, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                      <Check className="w-3 h-3 text-success flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Don'ts */}
            {message.suggestions.donts && message.suggestions.donts.length > 0 && (
              <div className="p-2 bg-destructive/10 rounded-lg">
                <div className="flex items-center gap-1.5 text-xs font-medium text-destructive mb-1.5">
                  <X className="w-3.5 h-3.5" />
                  Don'ts
                </div>
                <ul className="space-y-1">
                  {message.suggestions.donts.map((item, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                      <X className="w-3 h-3 text-destructive flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        
        {/* Timestamp */}
        <p className={cn(
          "text-[10px] mt-1.5 opacity-60",
          isUser ? "text-primary-foreground text-right" : "text-muted-foreground"
        )}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}
