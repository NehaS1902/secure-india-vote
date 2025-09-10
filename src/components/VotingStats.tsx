import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, Vote, AlertTriangle, CheckCircle } from "lucide-react";

interface VotingStatsProps {
  totalVoters: number;
  votedCount: number;
  duplicateAttempts: number;
  verificationFailures: number;
}

export const VotingStats = ({ 
  totalVoters, 
  votedCount, 
  duplicateAttempts, 
  verificationFailures 
}: VotingStatsProps) => {
  const turnoutPercentage = (votedCount / totalVoters) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Registered</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalVoters.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Eligible voters</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Votes Cast</CardTitle>
          <Vote className="h-4 w-4 text-success" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-success">{votedCount.toLocaleString()}</div>
          <div className="flex items-center space-x-2 mt-2">
            <Progress value={turnoutPercentage} className="flex-1 h-2" />
            <Badge variant="secondary" className="text-xs">
              {turnoutPercentage.toFixed(1)}%
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Duplicate Attempts</CardTitle>
          <AlertTriangle className="h-4 w-4 text-warning" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-warning">{duplicateAttempts}</div>
          <p className="text-xs text-muted-foreground">Security alerts triggered</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Verification Rate</CardTitle>
          <CheckCircle className="h-4 w-4 text-success" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-success">
            {((votedCount / (votedCount + verificationFailures)) * 100).toFixed(1)}%
          </div>
          <p className="text-xs text-muted-foreground">Successful authentications</p>
        </CardContent>
      </Card>
    </div>
  );
};