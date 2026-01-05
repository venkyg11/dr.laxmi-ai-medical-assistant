import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, FileText, Info } from "lucide-react";
import { DrLaxmiAvatar } from "@/components/DrLaxmiAvatar";
import { FloatingMedicalIcons } from "@/components/FloatingMedicalIcons";
import { MedicalDisclaimer } from "@/components/MedicalDisclaimer";
import { ConsultationScreen } from "@/components/ConsultationScreen";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

type Screen = "landing" | "consultation";

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>("landing");
  const [inputMode, setInputMode] = useState<"voice" | "text">("voice");
  const [avatarWaved, setAvatarWaved] = useState(false);

  // Trigger wave animation after component mounts
  useState(() => {
    const timer = setTimeout(() => setAvatarWaved(true), 500);
    return () => clearTimeout(timer);
  });

  if (currentScreen === "consultation") {
    return (
      <ConsultationScreen
        onBack={() => setCurrentScreen("landing")}
        initialMode={inputMode}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Theme toggle */}
      <ThemeToggle />
      
      {/* Floating medical icons background */}
      <FloatingMedicalIcons />

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative z-10">
        {/* Avatar with entrance animation */}
        <div 
          className={cn(
            "mb-8 opacity-0 translate-y-8 transition-all duration-700 ease-out",
            avatarWaved && "opacity-100 translate-y-0"
          )}
        >
          <div className={cn(avatarWaved && "animate-wave")} style={{ animationDelay: "0.3s" }}>
            <DrLaxmiAvatar state="reassuring" size="xl" />
          </div>
        </div>

        {/* Title */}
        <div 
          className={cn(
            "text-center mb-10 opacity-0 transition-all duration-700 ease-out delay-300",
            avatarWaved && "opacity-100"
          )}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Dr. Laxmi
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Your AI Medical Assistant
          </p>
          <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
            I'm here to listen, guide, and help you feel better with warmth and care.
          </p>
        </div>

        {/* CTA Buttons */}
        <div 
          className={cn(
            "flex flex-col gap-4 w-full max-w-xs opacity-0 transition-all duration-700 ease-out delay-500",
            avatarWaved && "opacity-100"
          )}
        >
          <Button
            size="lg"
            className="w-full gradient-primary text-white shadow-glow hover:scale-105 transition-transform"
            onClick={() => {
              setInputMode("voice");
              setCurrentScreen("consultation");
            }}
          >
            <Mic className="w-5 h-5 mr-2" />
            Talk to Dr. Laxmi
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="w-full shadow-soft hover:scale-105 transition-transform"
            onClick={() => {
              setInputMode("text");
              setCurrentScreen("consultation");
            }}
          >
            <FileText className="w-5 h-5 mr-2" />
            Describe Symptoms
          </Button>

          <MedicalDisclaimer
            trigger={
              <Button variant="ghost" className="w-full text-muted-foreground">
                <Info className="w-4 h-4 mr-2" />
                Medical Disclaimer
              </Button>
            }
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center">
        <p className="text-xs text-muted-foreground max-w-md mx-auto px-4">
          Dr. Laxmi is an AI assistant for educational purposes. 
          She does not replace licensed medical professionals.
        </p>
      </footer>
    </div>
  );
};

export default Index;
