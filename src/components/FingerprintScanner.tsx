import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Fingerprint, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FingerprintScannerProps {
  onScanComplete: (success: boolean, voterId?: string, isDuplicate?: boolean) => void;
  isActive: boolean;
}

export const FingerprintScanner = ({ onScanComplete, isActive }: FingerprintScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<'idle' | 'success' | 'failed' | 'duplicate'>('idle');

  // Mock voter database
  const mockVoters = [
    { id: "IND001", name: "Rajesh Kumar", hasVoted: false },
    { id: "IND002", name: "Priya Sharma", hasVoted: true }, // Already voted
    { id: "IND003", name: "Amit Singh", hasVoted: false },
  ];

  const simulateScan = () => {
    if (!isActive) return;
    
    setIsScanning(true);
    setScanResult('idle');

    // Simulate scanning delay
    setTimeout(() => {
      // Random selection of voter with 80% success rate
      const random = Math.random();
      
      if (random < 0.8) {
        const voter = mockVoters[Math.floor(Math.random() * mockVoters.length)];
        
        if (voter.hasVoted) {
          setScanResult('duplicate');
          setIsScanning(false);
          onScanComplete(false, voter.id, true);
        } else {
          setScanResult('success');
          setIsScanning(false);
          onScanComplete(true, voter.id, false);
        }
      } else {
        setScanResult('failed');
        setIsScanning(false);
        onScanComplete(false);
      }
    }, 2000);
  };

  const getScannerState = () => {
    if (!isActive) return 'inactive';
    if (isScanning) return 'scanning';
    return scanResult;
  };

  const getStatusColor = () => {
    const state = getScannerState();
    switch (state) {
      case 'success': return 'text-success';
      case 'failed': return 'text-destructive';
      case 'duplicate': return 'text-warning';
      case 'scanning': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusMessage = () => {
    const state = getScannerState();
    switch (state) {
      case 'success': return 'Fingerprint verified successfully';
      case 'failed': return 'Fingerprint not recognized';
      case 'duplicate': return 'Duplicate vote detected!';
      case 'scanning': return 'Scanning fingerprint...';
      case 'inactive': return 'Scanner inactive';
      default: return 'Place finger on scanner';
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-8 text-center">
        <div className="mb-6">
          <div className={cn(
            "relative w-32 h-32 mx-auto mb-4 rounded-full border-4 flex items-center justify-center transition-all duration-300",
            isScanning && "border-primary bg-gradient-saffron animate-pulse-slow",
            scanResult === 'success' && "border-success bg-success/10",
            scanResult === 'failed' && "border-destructive bg-destructive/10",
            scanResult === 'duplicate' && "border-warning bg-warning/10",
            !isActive && "border-muted bg-muted/10"
          )}>
            {isScanning && (
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <div className="w-full h-1 bg-primary/30 animate-scan"></div>
              </div>
            )}
            
            {scanResult === 'success' && <CheckCircle className="w-12 h-12 text-success" />}
            {scanResult === 'failed' && <XCircle className="w-12 h-12 text-destructive" />}
            {scanResult === 'duplicate' && <AlertTriangle className="w-12 h-12 text-warning" />}
            {(scanResult === 'idle' || isScanning) && (
              <Fingerprint className={cn("w-12 h-12", getStatusColor())} />
            )}
          </div>
          
          <h3 className="text-lg font-semibold mb-2">Biometric Verification</h3>
          <p className={cn("text-sm", getStatusColor())}>{getStatusMessage()}</p>
        </div>

        <Button 
          onClick={simulateScan}
          disabled={!isActive || isScanning}
          className="w-full bg-gradient-saffron hover:opacity-90 transition-opacity"
        >
          {isScanning ? (
            <>
              <Fingerprint className="w-4 h-4 mr-2 animate-pulse" />
              Scanning...
            </>
          ) : (
            <>
              <Fingerprint className="w-4 h-4 mr-2" />
              Start Scan
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};