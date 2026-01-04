import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Info } from "lucide-react";

interface MedicalDisclaimerProps {
  trigger?: React.ReactNode;
}

export function MedicalDisclaimer({ trigger }: MedicalDisclaimerProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            <Info className="w-4 h-4 mr-2" />
            Medical Disclaimer
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            Important Medical Disclaimer
          </DialogTitle>
        </DialogHeader>
        <DialogDescription asChild>
          <div className="space-y-4 text-sm">
            <p className="font-medium text-foreground">
              Dr. Laxmi is an AI-powered medical assistant designed for educational and informational purposes only.
            </p>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">What Dr. Laxmi Can Do:</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Provide general health information and guidance</li>
                <li>Suggest over-the-counter medications for common symptoms</li>
                <li>Offer lifestyle and home remedy recommendations</li>
                <li>Share do's and don'ts for various health conditions</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-destructive">What Dr. Laxmi Cannot Do:</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Diagnose medical conditions or diseases</li>
                <li>Prescribe prescription medications</li>
                <li>Provide emergency medical advice</li>
                <li>Replace consultation with a licensed healthcare professional</li>
              </ul>
            </div>
            
            <div className="p-3 bg-destructive/10 rounded-lg border border-destructive/20">
              <p className="font-medium text-destructive flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                In case of emergency, please call your local emergency services or visit the nearest hospital immediately.
              </p>
            </div>
            
            <p className="text-xs text-muted-foreground">
              By using Dr. Laxmi, you acknowledge and agree that this service is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
            </p>
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}

export function DisclaimerBanner() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-muted/80 backdrop-blur-sm border-t border-border py-2 px-4 z-50">
      <p className="text-xs text-center text-muted-foreground max-w-3xl mx-auto">
        <AlertTriangle className="w-3 h-3 inline mr-1" />
        Dr. Laxmi is an AI assistant for educational purposes only. She does not replace a licensed medical professional.{" "}
        <MedicalDisclaimer 
          trigger={
            <button className="text-primary hover:underline font-medium">
              Learn more
            </button>
          } 
        />
      </p>
    </div>
  );
}
