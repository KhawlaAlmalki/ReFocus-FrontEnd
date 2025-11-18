import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Target, Trophy, Zap, Award, Star, Lock, ArrowRight } from 'lucide-react';

interface Challenge {
  id: number;
  title: string;
  description: string;
  progress: number;
  total: number;
  category: string;
  joined: boolean;
  icon: React.ReactNode;
  color: string;
}

interface BadgeType {
  id: number;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  color: string;
}

// Mock challenges data
const mockChallenges: Challenge[] = [
  {
    id: 1,
    title: '7-Day Consistency',
    description: 'Focus for at least 1 hour every day for 7 consecutive days',
    progress: 4,
    total: 7,
    category: 'Streak',
    joined: true,
    icon: <Trophy className="w-8 h-8" />,
    color: 'from-orange-400 to-red-500',
  },
  {
    id: 2,
    title: 'No Social Media After 10PM',
    description: 'Avoid social media platforms after 10 PM for a full week',
    progress: 2,
    total: 7,
    category: 'Habit',
    joined: true,
    icon: <Zap className="w-8 h-8" />,
    color: 'from-yellow-400 to-orange-500',
  },
  {
    id: 3,
    title: 'Deep Work Sprint',
    description: 'Complete 3 uninterrupted 60-minute focus sessions',
    progress: 1,
    total: 3,
    category: 'Achievement',
    joined: false,
    icon: <Target className="w-8 h-8" />,
    color: 'from-blue-400 to-cyan-500',
  },
  {
    id: 4,
    title: '50 Hours This Month',
    description: 'Accumulate 50 hours of focused work time this month',
    progress: 32,
    total: 50,
    category: 'Milestone',
    joined: true,
    icon: <Award className="w-8 h-8" />,
    color: 'from-purple-400 to-pink-500',
  },
];

// Mock badges data
const mockBadges: BadgeType[] = [
  {
    id: 1,
    name: 'Focus Rookie',
    description: 'Complete your first focus session',
    icon: '🎯',
    earned: true,
    color: 'from-blue-400 to-blue-600',
  },
  {
    id: 2,
    name: 'Streak Master',
    description: 'Maintain a 7-day focus streak',
    icon: '🔥',
    earned: true,
    color: 'from-orange-400 to-red-600',
  },
  {
    id: 3,
    name: 'Deep Worker',
    description: 'Complete 10 sessions of 60+ minutes',
    icon: '💼',
    earned: true,
    color: 'from-purple-400 to-purple-600',
  },
  {
    id: 4,
    name: 'Night Owl',
    description: 'Focus between 8 PM and midnight',
    icon: '🌙',
    earned: false,
    color: 'from-indigo-400 to-indigo-600',
  },
  {
    id: 5,
    name: 'Speed Demon',
    description: 'Complete 5 focus sessions in one day',
    icon: '⚡',
    earned: false,
    color: 'from-yellow-400 to-yellow-600',
  },
  {
    id: 6,
    name: 'Consistency King',
    description: 'Maintain a 30-day focus streak',
    icon: '👑',
    earned: false,
    color: 'from-pink-400 to-pink-600',
  },
  {
    id: 7,
    name: 'Century Club',
    description: 'Reach 100 hours of focused work',
    icon: '💯',
    earned: false,
    color: 'from-green-400 to-green-600',
  },
  {
    id: 8,
    name: 'Zen Master',
    description: 'Complete all daily goals for a full week',
    icon: '🧘',
    earned: false,
    color: 'from-cyan-400 to-cyan-600',
  },
];

export default function Challenges() {
  const [challenges, setChallenges] = useState(mockChallenges);
  const [hoveredChallenge, setHoveredChallenge] = useState<number | null>(null);
  const [hoveredBadge, setHoveredBadge] = useState<number | null>(null);

  const toggleChallenge = (id: number) => {
    setChallenges(
      challenges.map((challenge) =>
        challenge.id === id
          ? { ...challenge, joined: !challenge.joined }
          : challenge
      )
    );
  };

  const earnedCount = mockBadges.filter((b) => b.earned).length;
  const joinedCount = challenges.filter((c) => c.joined).length;

  return (
    <div className="min-h-screen bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-8">
        {/* Header Section */}
        <div className="mb-16 text-center">
          <p className="text-secondary font-semibold tracking-wide mb-3 uppercase text-sm">
            Level Up Your Focus
          </p>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Challenges & Badges
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Take on challenges to build better focus habits. Earn badges as you reach milestones 
            and unlock achievements on your focus journey.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-16">
          <Tabs defaultValue="challenges" className="w-full">
            <div className="flex justify-center mb-12">
              <TabsList className="bg-muted/30 backdrop-blur-sm p-1 rounded-full inline-flex gap-1 border border-muted">
                <TabsTrigger
                  value="challenges"
                  className="px-6 py-2 rounded-full text-sm font-semibold transition-all data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-lg"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Challenges ({joinedCount})
                </TabsTrigger>
                <TabsTrigger
                  value="badges"
                  className="px-6 py-2 rounded-full text-sm font-semibold transition-all data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-lg"
                >
                  <Star className="w-4 h-4 mr-2" />
                  Badges ({earnedCount}/{mockBadges.length})
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Challenges Tab */}
            <TabsContent value="challenges" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {challenges.map((challenge) => (
                  <div
                    key={challenge.id}
                    onMouseEnter={() => setHoveredChallenge(challenge.id)}
                    onMouseLeave={() => setHoveredChallenge(null)}
                    className="group cursor-pointer transition-transform duration-300 hover:scale-105"
                  >
                    <Card className="h-full border-0 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                      {/* Gradient Top Bar */}
                      <div
                        className={`h-1 bg-gradient-to-r ${challenge.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                      />

                      <CardContent className="p-8">
                        {/* Icon and Header */}
                        <div className="flex items-start justify-between mb-6">
                          <div
                            className={`p-4 rounded-2xl bg-gradient-to-br ${challenge.color} text-white shadow-lg transform transition-transform duration-300 group-hover:scale-110`}
                          >
                            {challenge.icon}
                          </div>
                          <Badge
                            variant="outline"
                            className="text-xs font-semibold px-3 py-1 bg-muted/50"
                          >
                            {challenge.category}
                          </Badge>
                        </div>

                        {/* Content */}
                        <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                          {challenge.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                          {challenge.description}
                        </p>

                        {/* Progress Section */}
                        <div className="space-y-3 mb-6">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-foreground">Progress</p>
                            <p className="text-sm font-bold text-primary">
                              {challenge.progress}/{challenge.total}
                            </p>
                          </div>
                          <Progress
                            value={(challenge.progress / challenge.total) * 100}
                            className="h-2.5 bg-muted rounded-full"
                          />
                        </div>

                        {/* Status */}
                        <p className="text-xs text-muted-foreground mb-6 font-medium">
                          {challenge.total - challenge.progress === 0 ? (
                            <span className="text-success">✓ Completed!</span>
                          ) : (
                            `${challenge.total - challenge.progress} ${
                              challenge.total - challenge.progress === 1 ? 'day' : 'days'
                            } to go`
                          )}
                        </p>

                        {/* Button */}
                        <Button
                          onClick={() => toggleChallenge(challenge.id)}
                          className={`w-full rounded-full font-semibold transition-all duration-300 ${
                            challenge.joined
                              ? `bg-gradient-to-r ${challenge.color} text-white hover:shadow-lg`
                              : 'bg-muted text-foreground hover:bg-primary hover:text-white'
                          }`}
                        >
                          {challenge.joined ? (
                            <span className="flex items-center justify-center gap-2">
                              ✓ Joined
                              <ArrowRight className="w-4 h-4" />
                            </span>
                          ) : (
                            'Join Challenge'
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Badges Tab */}
            <TabsContent value="badges" className="space-y-12">
              {/* Stats Card */}
              <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl p-8 md:p-12 border border-primary/10 backdrop-blur-sm">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                  <div>
                    <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide mb-2">
                      Your Achievement
                    </p>
                    <p className="text-5xl md:text-6xl font-bold text-primary">
                      {earnedCount}
                      <span className="text-2xl font-normal text-muted-foreground ml-3">
                        of {mockBadges.length} badges
                      </span>
                    </p>
                  </div>
                  <div className="text-7xl md:text-8xl">🏆</div>
                </div>
              </div>

              {/* Badges Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {mockBadges.map((badge) => (
                  <div
                    key={badge.id}
                    onMouseEnter={() => setHoveredBadge(badge.id)}
                    onMouseLeave={() => setHoveredBadge(null)}
                    className={`group relative cursor-pointer transition-all duration-300 ${
                      badge.earned ? 'hover:scale-110' : 'hover:scale-105'
                    }`}
                  >
                    <Card
                      className={`h-full border-0 rounded-3xl p-8 flex flex-col items-center text-center transition-all duration-300 shadow-md hover:shadow-xl ${
                        badge.earned
                          ? 'bg-white'
                          : 'bg-muted/30 backdrop-blur-sm opacity-50'
                      }`}
                    >
                      {/* Lock Icon for Locked Badges */}
                      {!badge.earned && (
                        <div className="absolute top-4 right-4 p-2 bg-muted rounded-full">
                          <Lock className="w-4 h-4 text-muted-foreground" />
                        </div>
                      )}

                      {/* Gradient Background Effect */}
                      {badge.earned && (
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${badge.color} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-300`}
                        />
                      )}

                      <div className="relative z-10 flex flex-col items-center gap-4">
                        {/* Icon */}
                        <div
                          className={`text-6xl transform transition-transform duration-300 ${
                            hoveredBadge === badge.id && badge.earned ? 'scale-125 rotate-12' : ''
                          }`}
                        >
                          {badge.icon}
                        </div>

                        {/* Name */}
                        <h3 className="font-bold text-lg text-foreground leading-tight">
                          {badge.name}
                        </h3>

                        {/* Description */}
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {badge.description}
                        </p>

                        {/* Status */}
                        <div className="mt-2 pt-4 border-t border-border w-full">
                          {badge.earned ? (
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-2 h-2 bg-success rounded-full" />
                              <span className="text-xs font-semibold text-success">Earned</span>
                            </div>
                          ) : (
                            <span className="text-xs font-semibold text-muted-foreground">
                              Locked
                            </span>
                          )}
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-primary to-secondary rounded-3xl p-12 md:p-16 text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Level Up?</h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Start your first focus session and unlock achievements along the way.
            </p>
            <Button className="bg-white text-primary hover:bg-white/90 rounded-full px-8 py-3 text-base font-semibold shadow-lg">
              Start Focusing Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
