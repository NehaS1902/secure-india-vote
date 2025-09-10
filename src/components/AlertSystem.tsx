import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle, XCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlertSystemProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  isVisible: boolean;
  onClose?: () => void;
}

export const AlertSystem = ({ type, title, message, isVisible, onClose }: AlertSystemProps) => {
  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success': return CheckCircle;
      case 'error': return XCircle;
      case 'warning': return AlertTriangle;
      case 'info': return Info;
    }
  };

  const getVariant = () => {
    switch (type) {
      case 'error': return 'destructive';
      case 'warning': return 'default';
      default: return 'default';
    }
  };

  const getColorClasses = () => {
    switch (type) {
      case 'success': return 'border-success bg-success/10 text-success-foreground';
      case 'warning': return 'border-warning bg-warning/10 text-warning-foreground';
      case 'info': return 'border-primary bg-primary/10 text-primary-foreground';
      default: return '';
    }
  };

  const Icon = getIcon();

  return (
    <div className="fixed top-4 right-4 z-50 w-96 animate-in slide-in-from-right-full">
      <Alert 
        variant={getVariant()}
        className={cn(
          "shadow-lg border-2",
          type !== 'error' && getColorClasses()
        )}
      >
        <Icon className="h-4 w-4" />
        <AlertTitle className="font-semibold">{title}</AlertTitle>
        <AlertDescription className="mt-2">
          {message}
        </AlertDescription>
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
          >
            ×
          </button>
        )}
      </Alert>
    </div>
  );
};