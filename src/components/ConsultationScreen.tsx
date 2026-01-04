import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Send, Keyboard, Loader2 } from "lucide-react";
import { DrLaxmiAvatar, type AvatarState } from "@/components/DrLaxmiAvatar";
import { PushToTalkButton } from "@/components/PushToTalkButton";
import { ChatMessage } from "@/components/ChatMessage";
import { DisclaimerBanner } from "@/components/MedicalDisclaimer";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { useMedicalChat } from "@/hooks/useMedicalChat";
import { useToast } from "@/hooks/use-toast";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

interface ConsultationScreenProps {
  onBack: () => void;
  initialMode?: "voice" | "text";
}

export function ConsultationScreen({ onBack, initialMode = "voice" }: ConsultationScreenProps) {
  const [inputMode, setInputMode] = useState<"voice" | "text">(initialMode);
  const [textInput, setTextInput] = useState("");
  const [avatarState, setAvatarState] = useState<AvatarState>("idle");
  const [transcript, setTranscript] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const { messages, isLoading, sendMessage } = useMedicalChat({
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  const { speak, isSpeaking, isLoading: isTTSLoading } = useTextToSpeech({
    onStart: () => setAvatarState("speaking"),
    onEnd: () => setAvatarState("idle"),
    onError: (error) => {
      console.error("TTS error:", error);
      setAvatarState("idle");
    },
  });

  const handleRecordingComplete = async (audioBlob: Blob) => {
    try {
      setTranscript("Transcribing...");
      
      const formData = new FormData();
      formData.append("audio", audioBlob, "audio.webm");
      
      const response = await fetch(`${SUPABASE_URL}/functions/v1/speech-to-text`, {
        method: "POST",
        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${SUPABASE_KEY}`,
        },
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error("Failed to transcribe audio");
      }
      
      const data = await response.json();
      const text = data.text?.trim();
      
      if (text) {
        setTranscript(text);
        await processUserMessage(text);
      } else {
        setTranscript("");
        toast({
          title: "No speech detected",
          description: "Please try speaking again.",
        });
      }
    } catch (error) {
      console.error("STT error:", error);
      setTranscript("");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process your voice. Please try again.",
      });
    } finally {
      resetProcessing();
    }
  };

  const { isRecording, isProcessing, startRecording, stopRecording, resetProcessing } = useVoiceRecorder({
    onRecordingComplete: handleRecordingComplete,
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Microphone Error",
        description: "Please allow microphone access to use voice input.",
      });
    },
  });

  const processUserMessage = async (text: string) => {
    setAvatarState("listening");
    setTranscript("");
    
    const response = await sendMessage(text);
    
    if (response && inputMode === "voice") {
      // Speak the response
      setAvatarState(response.isEmergency ? "concerned" : "reassuring");
      await speak(response.content);
    } else {
      setAvatarState("idle");
    }
  };

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim() || isLoading) return;
    
    const text = textInput;
    setTextInput("");
    await processUserMessage(text);
  };

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Update avatar state based on recording
  useEffect(() => {
    if (isRecording) {
      setAvatarState("listening");
    } else if (!isProcessing && !isLoading && !isSpeaking) {
      setAvatarState("idle");
    }
  }, [isRecording, isProcessing, isLoading, isSpeaking]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="text-center">
            <h1 className="font-semibold text-foreground">Dr. Laxmi</h1>
            <p className="text-xs text-muted-foreground">
              {isSpeaking ? "Speaking..." : isLoading ? "Thinking..." : "Online"}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setInputMode(inputMode === "voice" ? "text" : "voice")}
          >
            <Keyboard className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full">
        {/* Avatar section */}
        <div className="flex justify-center py-6">
          <DrLaxmiAvatar state={avatarState} size="lg" />
        </div>

        {/* Transcript display */}
        {transcript && (
          <div className="px-4 pb-4">
            <div className="p-3 bg-muted rounded-lg text-center">
              <p className="text-sm text-muted-foreground italic">"{transcript}"</p>
            </div>
          </div>
        )}

        {/* Chat messages */}
        <ScrollArea className="flex-1 px-4" ref={scrollRef}>
          <div className="space-y-4 pb-4">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground text-sm">
                  Hello! I'm Dr. Laxmi. 👋
                  <br />
                  How can I help you today?
                </p>
              </div>
            )}
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3 shadow-soft">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input section */}
        <div className="sticky bottom-0 glass border-t border-border p-4 pb-16">
          {inputMode === "voice" ? (
            <div className="flex justify-center">
              <PushToTalkButton
                isRecording={isRecording}
                isProcessing={isProcessing || isLoading || isTTSLoading}
                onPressStart={startRecording}
                onPressEnd={stopRecording}
              />
            </div>
          ) : (
            <form onSubmit={handleTextSubmit} className="flex gap-2">
              <Input
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Describe your symptoms..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" disabled={!textInput.trim() || isLoading}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
          )}
        </div>
      </div>

      <DisclaimerBanner />
    </div>
  );
}
