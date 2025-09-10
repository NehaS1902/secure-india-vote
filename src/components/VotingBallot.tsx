import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Vote, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Candidate {
  id: string;
  name: string;
  party: string;
  symbol: string;
  avatar?: string;
}

interface VotingBallotProps {
  onVoteSubmit: (candidateId: string) => void;
  voterInfo: { id: string; name: string } | null;
}

const candidates: Candidate[] = [
  {
    id: "BJP001",
    name: "Dr. Rajesh Gupta",
    party: "Bharatiya Janata Party",
    symbol: "🪷", // Lotus
  },
  {
    id: "INC001", 
    name: "Smt. Priya Mehta",
    party: "Indian National Congress",
    symbol: "✋", // Hand
  },
  {
    id: "AAP001",
    name: "Sh. Vikram Singh",
    party: "Aam Aadmi Party", 
    symbol: "🧹", // Broom
  },
  {
    id: "BSP001",
    name: "Km. Sunita Devi",
    party: "Bahujan Samaj Party",
    symbol: "🐘", // Elephant
  },
];

export const VotingBallot = ({ onVoteSubmit, voterInfo }: VotingBallotProps) => {
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const handleVoteConfirm = () => {
    if (selectedCandidate) {
      setIsConfirming(true);
      // Simulate vote processing
      setTimeout(() => {
        onVoteSubmit(selectedCandidate);
      }, 1500);
    }
  };

  if (!voterInfo) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Please verify your fingerprint to access the ballot</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Voter Info */}
      <Card className="bg-gradient-tricolor">
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-white">
            <div>
              <h3 className="font-semibold">Verified Voter</h3>
              <p className="text-sm opacity-90">ID: {voterInfo.id}</p>
            </div>
            <div className="text-right">
              <p className="font-medium">{voterInfo.name}</p>
              <Badge variant="secondary" className="bg-white/20 text-white">
                <CheckCircle className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ballot */}
      <Card>
        <CardHeader className="text-center bg-gradient-saffron text-primary-foreground">
          <CardTitle className="text-2xl">
            लोकसभा चुनाव 2024 • Lok Sabha Election 2024
          </CardTitle>
          <p className="text-sm opacity-90">निर्वाचन क्षेत्र: दिल्ली उत्तर • Constituency: North Delhi</p>
        </CardHeader>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-center">
            अपना उम्मीदवार चुनें • Choose Your Candidate
          </h3>
          
          <div className="grid gap-4">
            {candidates.map((candidate) => (
              <Card 
                key={candidate.id}
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:shadow-md",
                  selectedCandidate === candidate.id 
                    ? "ring-2 ring-primary bg-primary/5" 
                    : "hover:bg-accent/50"
                )}
                onClick={() => setSelectedCandidate(candidate.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl">{candidate.symbol}</div>
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-gradient-saffron text-white">
                          {candidate.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{candidate.name}</h4>
                      <p className="text-muted-foreground">{candidate.party}</p>
                    </div>
                    
                    <div className="flex items-center">
                      {selectedCandidate === candidate.id && (
                        <CheckCircle className="w-6 h-6 text-primary" />
                      )}
                      <div className="w-8 h-8 ml-2 border-2 border-primary rounded-full flex items-center justify-center">
                        {selectedCandidate === candidate.id && (
                          <div className="w-4 h-4 bg-primary rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button 
              onClick={handleVoteConfirm}
              disabled={!selectedCandidate || isConfirming}
              size="lg"
              className="bg-gradient-secure hover:opacity-90 transition-opacity px-8"
            >
              {isConfirming ? (
                <>
                  <Vote className="w-5 h-5 mr-2 animate-pulse" />
                  Recording Vote...
                </>
              ) : (
                <>
                  <Vote className="w-5 h-5 mr-2" />
                  Cast Vote • मतदान करें
                </>
              )}
            </Button>
            
            {selectedCandidate && !isConfirming && (
              <p className="text-sm text-muted-foreground mt-2">
                You have selected: {candidates.find(c => c.id === selectedCandidate)?.name}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};