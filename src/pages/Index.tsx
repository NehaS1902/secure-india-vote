import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FingerprintScanner } from "@/components/FingerprintScanner";
import { VotingBallot } from "@/components/VotingBallot";
import { AlertSystem } from "@/components/AlertSystem";
import { VotingStats } from "@/components/VotingStats";
import { Separator } from "@/components/ui/separator";
import { Shield, Vote, Users, RotateCcw } from "lucide-react";

interface VoterInfo {
  id: string;
  name: string;
}

interface Alert {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  isVisible: boolean;
}

const Index = () => {
  const [currentStep, setCurrentStep] = useState<'scanner' | 'ballot' | 'complete'>('scanner');
  const [voterInfo, setVoterInfo] = useState<VoterInfo | null>(null);
  const [alert, setAlert] = useState<Alert>({ type: 'info', title: '', message: '', isVisible: false });
  const [stats, setStats] = useState({
    totalVoters: 1247,
    votedCount: 892,
    duplicateAttempts: 3,
    verificationFailures: 17
  });

  const showAlert = (type: Alert['type'], title: string, message: string) => {
    setAlert({ type, title, message, isVisible: true });
    setTimeout(() => setAlert(prev => ({ ...prev, isVisible: false })), 5000);
  };

  const handleScanComplete = (success: boolean, voterId?: string, isDuplicate?: boolean) => {
    if (isDuplicate) {
      showAlert('warning', 'Duplicate Vote Detected!', 
        `Voter ID ${voterId} has already cast their vote. Multiple voting attempts are strictly prohibited.`);
      setStats(prev => ({ ...prev, duplicateAttempts: prev.duplicateAttempts + 1 }));
      return;
    }

    if (success && voterId) {
      const voterNames: Record<string, string> = {
        'IND001': 'Rajesh Kumar',
        'IND003': 'Amit Singh'
      };
      
      setVoterInfo({ id: voterId, name: voterNames[voterId] || 'Unknown Voter' });
      setCurrentStep('ballot');
      showAlert('success', 'Authentication Successful', 
        `Welcome ${voterNames[voterId]}! Your identity has been verified. Please proceed to cast your vote.`);
    } else {
      showAlert('error', 'Authentication Failed', 
        'Fingerprint verification failed. Please ensure your finger is clean and properly placed on the scanner.');
      setStats(prev => ({ ...prev, verificationFailures: prev.verificationFailures + 1 }));
    }
  };

  const handleVoteSubmit = (candidateId: string) => {
    setCurrentStep('complete');
    setStats(prev => ({ ...prev, votedCount: prev.votedCount + 1 }));
    showAlert('success', 'Vote Recorded Successfully!', 
      'Your vote has been securely recorded and encrypted. Thank you for participating in the democratic process.');
  };

  const resetSystem = () => {
    setCurrentStep('scanner');
    setVoterInfo(null);
    setAlert({ type: 'info', title: '', message: '', isVisible: false });
  };

  const getStepStatus = (step: string) => {
    if (currentStep === step) return 'current';
    if (
      (step === 'scanner' && ['ballot', 'complete'].includes(currentStep)) ||
      (step === 'ballot' && currentStep === 'complete')
    ) return 'completed';
    return 'pending';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background">
      <AlertSystem {...alert} onClose={() => setAlert(prev => ({ ...prev, isVisible: false }))} />
      
      {/* Header */}
      <header className="bg-gradient-tricolor text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold">
                  भारत निर्वाचन प्रणाली • India Election System
                </h1>
                <p className="text-sm opacity-90">Biometric Voting Technology</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <Users className="w-4 h-4 mr-1" />
              Booth #247-A
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Dashboard */}
        <VotingStats {...stats} />

        {/* Progress Steps */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              {[
                { key: 'scanner', label: 'Biometric Verification', icon: Shield },
                { key: 'ballot', label: 'Cast Vote', icon: Vote },
                { key: 'complete', label: 'Confirmation', icon: Users }
              ].map(({ key, label, icon: Icon }, index) => {
                const status = getStepStatus(key);
                return (
                  <div key={key} className="flex items-center">
                    <div className={`flex items-center space-x-2 ${
                      status === 'current' ? 'text-primary' : 
                      status === 'completed' ? 'text-success' : 'text-muted-foreground'
                    }`}>
                      <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                        status === 'current' ? 'border-primary bg-primary/10' :
                        status === 'completed' ? 'border-success bg-success/10' : 'border-muted'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-medium">{label}</span>
                    </div>
                    {index < 2 && (
                      <Separator orientation="horizontal" className="w-12 mx-4" />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="space-y-8">
          {currentStep === 'scanner' && (
            <div className="text-center space-y-6">
              <div className="max-w-md mx-auto">
                <h2 className="text-2xl font-bold mb-4">Biometric Authentication</h2>
                <p className="text-muted-foreground mb-6">
                  Please place your registered finger on the biometric scanner to verify your identity and access the voting system.
                </p>
                <FingerprintScanner 
                  onScanComplete={handleScanComplete}
                  isActive={true}
                />
              </div>
            </div>
          )}

          {currentStep === 'ballot' && (
            <VotingBallot 
              onVoteSubmit={handleVoteSubmit}
              voterInfo={voterInfo}
            />
          )}

          {currentStep === 'complete' && (
            <Card className="max-w-2xl mx-auto">
              <CardHeader className="text-center bg-gradient-secure text-white">
                <CardTitle className="text-2xl">Vote Successfully Recorded</CardTitle>
              </CardHeader>
              <CardContent className="p-8 text-center space-y-6">
                <div className="w-20 h-20 mx-auto bg-success/10 rounded-full flex items-center justify-center">
                  <Vote className="w-10 h-10 text-success" />
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-2">Thank You for Voting!</h3>
                  <p className="text-muted-foreground">
                    Your vote has been securely recorded and encrypted. The system has verified:
                  </p>
                </div>

                <div className="bg-accent/50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span>Voter ID:</span>
                    <span className="font-mono">{voterInfo?.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Timestamp:</span>
                    <span className="font-mono">{new Date().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Booth:</span>
                    <span className="font-mono">#247-A</span>
                  </div>
                </div>

                <Button 
                  onClick={resetSystem}
                  variant="outline"
                  className="w-full"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Ready for Next Voter
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;