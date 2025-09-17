import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Fingerprint, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Capacitor } from '@capacitor/core';
import { BiometricAuth } from '@/utils/biometricAuth';

interface FingerprintScannerProps {
  onScanComplete: (success: boolean, voterId?: string, isDuplicate?: boolean) => void;
  isActive: boolean;
  votedVoters: Set<string>; // Track who has voted
}

export const FingerprintScanner = ({ onScanComplete, isActive, votedVoters }: FingerprintScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<'idle' | 'success' | 'failed' | 'duplicate'>('idle');

  // Create alarm sound for duplicate detection
  const playAlarmSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  };

  // Mock voter database - now properly checks real vote status
  const mockVoters = [
    { id: "IND001", name: "Rajesh Kumar" },
    { id: "IND002", name: "Priya Sharma" },
    { id: "IND003", name: "Amit Singh" },
    { id: "IND004", name: "Sunita Devi" },
    { id: "IND005", name: "Arjun Patel" },
  ];

  const authenticateWithBiometric = async (e?: React.MouseEvent) => {
    e?.preventDefault(); // Prevent any default form submission
    if (!isActive) return;
    
    setIsScanning(true);
    setScanResult('idle');

    try {
      // Check if we're running on a native platform
      if (Capacitor.isNativePlatform()) {
        // Use native biometric authentication (requires plugin setup on native side)
        const result = await requestBiometricAuth();
        
        if (result) {
          handleSuccessfulAuth();
        } else {
          setScanResult('failed');
          setIsScanning(false);
          onScanComplete(false);
        }
      } else {
        // Fallback to simulation for web/development
        simulateScanFallback();
      }
    } catch (error) {
      console.error('Biometric authentication error:', error);
      // Fallback to simulation on error
      simulateScanFallback();
    }
  };

  const handleSuccessfulAuth = () => {
    // Simulate fingerprint selection - higher chance of duplicate for testing
    const random = Math.random();
    let voter;
    
    // 40% chance to select a voter who has already voted (for testing duplicates)
    if (random < 0.4 && votedVoters.size > 0) {
      const votedVoterIds = Array.from(votedVoters);
      voter = mockVoters.find(v => v.id === votedVoterIds[Math.floor(Math.random() * votedVoterIds.length)]);
      console.log('🔍 Simulating duplicate voter attempt:', voter?.id, voter?.name);
    } else {
      // Select random voter
      voter = mockVoters[Math.floor(Math.random() * mockVoters.length)];
      console.log('🔍 Selected voter for authentication:', voter?.id, voter?.name);
    }
    
    if (!voter) {
      setScanResult('failed');
      setIsScanning(false);
      onScanComplete(false);
      return;
    }

    console.log('📊 Current voted voters:', Array.from(votedVoters));
    console.log('❓ Has this voter already voted?', votedVoters.has(voter.id));
    
    // Check if this voter has already voted
    if (votedVoters.has(voter.id)) {
      console.log('🚨 DUPLICATE VOTE DETECTED for voter:', voter.id, voter.name);
      setScanResult('duplicate');
      setIsScanning(false);
      playAlarmSound();
      onScanComplete(false, voter.id, true);
    } else {
      console.log('✅ Valid new voter:', voter.id, voter.name);
      setScanResult('success');
      setIsScanning(false);
      onScanComplete(true, voter.id, false);
    }
  };

  const requestBiometricAuth = async (): Promise<boolean> => {
    try {
      console.log('🔐 Checking if biometric authentication is available...');
      
      // Check if biometric authentication is available
      const isAvailable = await BiometricAuth.isAvailable();
      console.log('📱 Biometric availability:', isAvailable);
      
      if (isAvailable) {
        console.log('🔐 Starting biometric authentication...');
        
        // Request biometric authentication
        const result = await BiometricAuth.authenticate({
          title: 'Biometric Authentication',
          subtitle: 'India Election System',
          description: 'Use your fingerprint or face ID to verify your identity and cast your vote',
          reason: 'Authentication required for voting'
        });
        
        console.log('✅ Biometric authentication result:', result);
        return result.success;
        
      } else {
        console.log('❌ Biometric authentication not available on this device');
        // Fallback to simulation
        return Math.random() > 0.1; // 90% success rate
      }
      
    } catch (error) {
      console.error('❌ Biometric authentication failed:', error);
      return false;
    }
  };

  const simulateScanFallback = () => {
    // Fallback simulation for development/testing
    setTimeout(() => {
      const random = Math.random();
      
      if (random < 0.85) {
        handleSuccessfulAuth();
      } else {
        console.log('❌ Fingerprint authentication failed');
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
          type="button"
          onClick={authenticateWithBiometric}
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