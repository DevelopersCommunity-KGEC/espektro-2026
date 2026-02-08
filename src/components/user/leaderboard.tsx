import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";

interface LeaderboardProps {
    data: {
        _id: string;
        name: string;
        image?: string;
        collegeName?: string;
        count: number;
    }[];
}

export function Leaderboard({ data }: LeaderboardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    Top Referrers
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {data.length === 0 ? (
                        <div className="text-center text-muted-foreground py-4">
                            No referrals yet. Be the first!
                        </div>
                    ) : (
                        data.map((user, index) => (
                            <div key={user._id} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-6 font-bold text-muted-foreground">
                                        {index + 1}
                                    </div>
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage src={user.image} alt={user.name} />
                                        <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-medium leading-none">{user.name}</p>
                                        {user.collegeName && (
                                            <p className="text-xs text-muted-foreground truncate max-w-37.5">
                                                {user.collegeName}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <Badge variant="secondary" className="ml-auto">
                                    {user.count} Ref
                                </Badge>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
