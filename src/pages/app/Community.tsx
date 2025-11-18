import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Users,
  Globe2,
  Crown,
  Timer,
  UserPlus,
  Check,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

interface LeaderboardUser {
  id: number;
  name: string;
  username: string;
  avatarInitials: string;
  totalHours: number;
  isYou?: boolean;
}

// Mock data for friends leaderboard
const mockFriends: LeaderboardUser[] = [
  {
    id: 1,
    name: "You",
    username: "@raghad",
    avatarInitials: "RA",
    totalHours: 124.5,
    isYou: true,
  },
  {
    id: 2,
    name: "Khawlah Almalki",
    username: "@khawla",
    avatarInitials: "KA",
    totalHours: 110.2,
  },
  {
    id: 3,
    name: "Aleen Alghamdi",
    username: "@aleen",
    avatarInitials: "AA",
    totalHours: 97.8,
  },
  {
    id: 4,
    name: "Shahad Alhasan",
    username: "@shahad",
    avatarInitials: "SA",
    totalHours: 82.1,
  },
  {
    id: 5,
    name: "Abeer Alqahtani",
    username: "@Abeer",
    avatarInitials: "AB",
    totalHours: 65.4,
  },
];

// Mock data for global leaderboard
const mockGlobal: LeaderboardUser[] = [
  {
    id: 1,
    name: "You",
    username: "@raghad",
    avatarInitials: "RA",
    totalHours: 124.5,
    isYou: true,
  },
  {
    id: 6,
    name: "Focus Ninja",
    username: "@deepwork",
    avatarInitials: "FN",
    totalHours: 210.3,
  },
  {
    id: 7,
    name: "Zen Coder",
    username: "@zenmode",
    avatarInitials: "ZC",
    totalHours: 198.7,
  },
  {
    id: 8,
    name: "Study Storm",
    username: "@storm",
    avatarInitials: "SS",
    totalHours: 176.9,
  },
  {
    id: 9,
    name: "No-Scroll Queen",
    username: "@nosocial",
    avatarInitials: "NQ",
    totalHours: 160.4,
  },
  {
    id: 10,
    name: "Midnight Owl",
    username: "@nightfocus",
    avatarInitials: "MO",
    totalHours: 145.2,
  },
];

export default function Community() {
  const [friends] = useState<LeaderboardUser[]>(mockFriends);
  const [globalUsers] = useState<LeaderboardUser[]>(mockGlobal);

  // Who you clicked "Start session" with
  const [selectedFriend, setSelectedFriend] = useState<LeaderboardUser | null>(
    null,
  );
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);

  // Global connection requests state
  const [connectionRequests, setConnectionRequests] = useState<
    Record<number, boolean>
  >({});

  const sortedFriends = useMemo(
    () => [...friends].sort((a, b) => b.totalHours - a.totalHours),
    [friends],
  );

  const sortedGlobal = useMemo(
    () => [...globalUsers].sort((a, b) => b.totalHours - a.totalHours),
    [globalUsers],
  );

  const youInFriends = sortedFriends.find((u) => u.isYou);
  const youInGlobal = sortedGlobal.find((u) => u.isYou);
  const yourFriendsRank =
    youInFriends !== undefined ? sortedFriends.indexOf(youInFriends) + 1 : "-";
  const yourGlobalRank =
    youInGlobal !== undefined ? sortedGlobal.indexOf(youInGlobal) + 1 : "-";

  const handleOpenSessionModal = (friend: LeaderboardUser) => {
    setSelectedFriend(friend);
    setIsSessionModalOpen(true);
  };

  const handleConfirmSession = () => {
    if (selectedFriend) {
      // later you can navigate or call backend here
      console.log("Starting focus session with:", selectedFriend.username);
    }
    setIsSessionModalOpen(false);
    setSelectedFriend(null);
  };

  const handleCancelSession = () => {
    setIsSessionModalOpen(false);
    setSelectedFriend(null);
  };

  const handleSendConnectionRequest = (user: LeaderboardUser) => {
    if (user.isYou) return;
    setConnectionRequests((prev) => ({
      ...prev,
      [user.id]: true,
    }));
    // later: call backend / API here
  };

  return (
    <div className="min-h-screen bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="mb-12 md:mb-16 text-center">
          <p className="text-secondary font-semibold tracking-wide mb-3 uppercase text-sm">
            Your Focus Community
          </p>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 md:mb-6 leading-tight">
            Community & Leaderboards
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            See how your focus stacks up against friends and the global ReFocus
            community. Celebrate the wins, challenge each other, and start
            shared focus sessions.
          </p>
        </div>

        {/* Your stats summary */}
        <div className="mb-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-md bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardContent className="p-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase text-secondary mb-1">
                  Your Focus Hours
                </p>
                <p className="text-3xl font-bold">
                  {youInFriends ? youInFriends.totalHours.toFixed(1) : "—"}
                  <span className="text-sm text-muted-foreground ml-1">
                    hrs
                  </span>
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-primary text-primary-foreground">
                <Timer className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase text-secondary mb-1">
                  Friends Rank
                </p>
                <p className="text-3xl font-bold">
                  #{yourFriendsRank}
                  <span className="text-sm text-muted-foreground ml-1">
                    of {sortedFriends.length}
                  </span>
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-muted">
                <Users className="w-6 h-6 text-secondary" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase text-secondary mb-1">
                  Global Rank
                </p>
                <p className="text-3xl font-bold">
                  #{yourGlobalRank}
                  <span className="text-sm text-muted-foreground ml-1">
                    of {sortedGlobal.length}
                  </span>
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-muted">
                <Globe2 className="w-6 h-6 text-secondary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for leaderboards */}
        <Tabs defaultValue="friends" className="w-full">
          <div className="flex justify-center mb-10">
            <TabsList className="bg-muted/40 backdrop-blur-sm p-1 rounded-full inline-flex gap-1 border border-muted">
              <TabsTrigger
                value="friends"
                className="px-6 py-2 rounded-full text-sm font-semibold transition-all data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-lg flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                Friends
              </TabsTrigger>
              <TabsTrigger
                value="global"
                className="px-6 py-2 rounded-full text-sm font-semibold transition-all data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-lg flex items-center gap-2"
              >
                <Globe2 className="w-4 h-4" />
                Community
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Friends leaderboard */}
          <TabsContent value="friends" className="space-y-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="px-3 py-1 text-xs font-semibold"
                >
                  Friends Leaderboard
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Start shared focus sessions with your mutual connections.
                </span>
              </div>
              <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
                <Timer className="w-3 h-3" />
                <span>Ranking by total focus hours</span>
              </div>
            </div>

            <Card className="border-0 shadow-md overflow-hidden">
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {sortedFriends.map((user, index) => (
                    <div
                      key={user.id}
                      className={`flex items-center justify-between px-4 md:px-6 py-4 md:py-5 transition-colors ${
                        user.isYou ? "bg-muted/60" : "hover:bg-muted/40"
                      }`}
                    >
                      {/* Left: rank + avatar + names */}
                      <div className="flex items-center gap-4">
                        <div className="w-8 text-sm font-semibold text-muted-foreground flex items-center justify-center">
                          {index + 1 === 1 ? (
                            <Crown className="w-5 h-5 text-warning" />
                          ) : (
                            <span>#{index + 1}</span>
                          )}
                        </div>

                        <div className="relative">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                            {user.avatarInitials}
                          </div>
                          {user.isYou && (
                            <span className="absolute -bottom-1 -right-1 rounded-full bg-primary text-primary-foreground text-[9px] px-1.5 py-0.5 flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              You
                            </span>
                          )}
                        </div>

                        <div>
                          <p className="text-sm md:text-base font-semibold text-foreground leading-tight">
                            {user.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {user.username}
                          </p>
                        </div>
                      </div>

                      {/* Right: hours + action */}
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm md:text-base font-semibold text-foreground">
                            {user.totalHours.toFixed(1)} hrs
                          </p>
                          <p className="text-[11px] text-muted-foreground uppercase tracking-wide">
                            Focused
                          </p>
                        </div>

                        <Button
                          size="icon"
                          variant="ghost"
                          className="rounded-full hover:bg-primary hover:text-primary-foreground"
                          onClick={() => handleOpenSessionModal(user)}
                        >
                          <Timer className="w-4 h-4" />
                          <span className="sr-only">
                            Start focus session with {user.name}
                          </span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Global leaderboard */}
          <TabsContent value="global" className="space-y-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="px-3 py-1 text-xs font-semibold"
                >
                  Global Community
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Connect with highly focused people from all around the world.
                </span>
              </div>
              <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
                <Globe2 className="w-3 h-3" />
                <span>Tap the icon to send a connection request</span>
              </div>
            </div>

            <Card className="border-0 shadow-md overflow-hidden">
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {sortedGlobal.map((user, index) => {
                    const requested = connectionRequests[user.id] === true;
                    const isTop = index + 1 === 1;

                    return (
                      <div
                        key={user.id}
                        className={`flex items-center justify-between px-4 md:px-6 py-4 md:py-5 transition-colors ${
                          user.isYou ? "bg-muted/60" : "hover:bg-muted/40"
                        }`}
                      >
                        {/* Left: rank + avatar + names */}
                        <div className="flex items-center gap-4">
                          <div className="w-8 text-sm font-semibold text-muted-foreground flex items-center justify-center">
                            {isTop ? (
                              <Crown className="w-5 h-5 text-warning" />
                            ) : (
                              <span>#{index + 1}</span>
                            )}
                          </div>

                          <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-sm font-semibold text-accent-foreground">
                              {user.avatarInitials}
                            </div>
                            {user.isYou && (
                              <span className="absolute -bottom-1 -right-1 rounded-full bg-primary text-primary-foreground text-[9px] px-1.5 py-0.5 flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                You
                              </span>
                            )}
                          </div>

                          <div>
                            <p className="text-sm md:text-base font-semibold text-foreground leading-tight">
                              {user.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {user.username}
                            </p>
                          </div>
                        </div>

                        {/* Right: hours + action */}
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm md:text-base font-semibold text-foreground">
                              {user.totalHours.toFixed(1)} hrs
                            </p>
                            <p className="text-[11px] text-muted-foreground uppercase tracking-wide">
                              Focused
                            </p>
                          </div>

                          <Button
                            size="icon"
                            variant="ghost"
                            disabled={user.isYou || requested}
                            className={`rounded-full transition-all ${
                              requested
                                ? "text-success hover:text-success"
                                : "hover:bg-secondary hover:text-secondary-foreground"
                            }`}
                            onClick={() => handleSendConnectionRequest(user)}
                          >
                            {requested ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <UserPlus className="w-4 h-4" />
                            )}
                            <span className="sr-only">
                              {requested
                                ? `Connection request already sent to ${user.name}`
                                : `Send connection request to ${user.name}`}
                            </span>
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* CTA bottom */}
        <div className="mt-16 md:mt-20 text-center">
          <div className="bg-gradient-to-r from-primary to-secondary rounded-3xl p-10 md:p-14 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-left">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                Turn your focus into a team sport.
              </h2>
              <p className="text-sm md:text-base opacity-90 max-w-xl">
                Invite friends, start shared sessions, and climb the
                leaderboards together. Tiny consistent focus blocks → huge
                long-term change.
              </p>
            </div>
            <Button className="bg-white text-primary hover:bg-white/90 rounded-full px-8 py-3 text-sm md:text-base font-semibold inline-flex items-center gap-2">
              Explore Challenges
              <ArrowUpRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Simple custom modal for starting a focus session */}
        {isSessionModalOpen && selectedFriend && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-background rounded-3xl shadow-xl max-w-md w-full mx-4 p-6 md:p-8 relative">
              <div className="mb-4">
                <h3 className="text-xl md:text-2xl font-bold mb-2">
                  Start a focus session?
                </h3>
                <p className="text-sm text-muted-foreground">
                  You&apos;re about to start a shared focus session with{" "}
                  <span className="font-semibold text-foreground">
                    {selectedFriend.name}
                  </span>{" "}
                  {selectedFriend.isYou ? "(yes, that’s you 🤍)" : ""}. You can
                  later decide how long the session will be inside the focus
                  screen.
                </p>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                  {selectedFriend.avatarInitials}
                </div>
                <div>
                  <p className="text-sm font-semibold">
                    {selectedFriend.username}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Total focus: {selectedFriend.totalHours.toFixed(1)} hrs
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="ghost" onClick={handleCancelSession}>
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmSession}
                  className="inline-flex items-center gap-2"
                >
                  <Timer className="w-4 h-4" />
                  Start Session
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
