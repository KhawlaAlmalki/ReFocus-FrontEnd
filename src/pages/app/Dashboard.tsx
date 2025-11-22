import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Zap, Target, Trophy, Clock, ArrowRight, ChevronRight } from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';
// Mock data
const mockSessions = [
  { id: 1, date: '2024-01-15', startTime: '09:00 AM', duration: 45, category: 'Study', status: 'completed' },
  { id: 2, date: '2024-01-14', startTime: '02:30 PM', duration: 60, category: 'Deep Work', status: 'completed' },
  { id: 3, date: '2024-01-14', startTime: '10:15 AM', duration: 25, category: 'Reading', status: 'completed' },
];

const mockChallenges = [
  { id: 1, title: '7-Day Consistency', progress: 4, total: 7 },
  { id: 2, title: 'No Social Media after 10PM', progress: 2, total: 7 },
];

export default function EndUserDashboard() {
  const { user } = useAuthContext();
  const userName = user?.name ?? 'Friend';
  const todayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Study: 'bg-blue-100 text-blue-800',
      'Deep Work': 'bg-purple-100 text-purple-800',
      Reading: 'bg-green-100 text-green-800',
      Work: 'bg-orange-100 text-orange-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-white py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-8">
        {/* Header Section */}
        <div className="mb-12">
          <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-2">
            Welcome back, {userName}! 👋
          </h2>
          <p className="text-lg text-muted-foreground">{todayDate}</p>
        </div>

        {/* Current Focus Goal Banner */}
        <div className="mb-12 p-8 rounded-3xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10 backdrop-blur-sm">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide mb-2">
                Your Focus Goal
              </p>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Study 2 hours daily for better grades
              </h3>
              <p className="text-muted-foreground">
                Daily Target: <span className="font-semibold text-foreground">120 minutes</span>
              </p>
            </div>
            <Target className="w-12 h-12 text-primary flex-shrink-0" />
          </div>
        </div>

        {/* Summary Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Today's Focus */}
          <div className="group cursor-pointer rounded-3xl bg-white border border-border/50 p-8 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300 hover:scale-105">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide mb-2">
                  Today's Focus
                </p>
                <p className="text-4xl font-bold text-primary">65 min</p>
              </div>
              <Clock className="w-8 h-8 text-primary/30 group-hover:text-primary/60 transition-colors" />
            </div>
            <Progress value={54} className="h-2" />
            <p className="text-xs text-muted-foreground mt-3">54% of 120 min goal</p>
          </div>

          {/* Current Streak */}
          <div className="group cursor-pointer rounded-3xl bg-white border border-border/50 p-8 shadow-sm hover:shadow-lg hover:border-secondary/20 transition-all duration-300 hover:scale-105">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide mb-2">
                  Current Streak
                </p>
                <p className="text-4xl font-bold text-secondary">4 days</p>
              </div>
              <Trophy className="w-8 h-8 text-secondary/30 group-hover:text-secondary/60 transition-colors" />
            </div>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex-1 h-2 bg-secondary rounded-full" />
              ))}
              {[1, 2].map((i) => (
                <div key={`empty-${i}`} className="flex-1 h-2 bg-muted rounded-full" />
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">Keep it going! 🔥</p>
          </div>

          {/* Reclaimed Time */}
          <div className="group cursor-pointer rounded-3xl bg-white border border-border/50 p-8 shadow-sm hover:shadow-lg hover:border-success/20 transition-all duration-300 hover:scale-105">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide mb-2">
                  Reclaimed This Week
                </p>
                <p className="text-4xl font-bold text-success">3.5 hrs</p>
              </div>
              <Zap className="w-8 h-8 text-success/30 group-hover:text-success/60 transition-colors" />
            </div>
            <p className="text-xs text-muted-foreground">Time saved from distractions</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Recent Sessions */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl bg-white border border-border/50 p-8 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-foreground">Recent Sessions</h3>
                <Link to="/app/log">
                  <ChevronRight className="w-6 h-6 text-muted-foreground hover:text-primary transition-colors" />
                </Link>
              </div>

              <div className="space-y-3">
                {mockSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 hover:bg-muted/60 transition-colors group cursor-pointer"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {session.category}
                        </p>
                        <Badge variant="outline" className={getCategoryColor(session.category)}>
                          {session.duration} min
                        </Badge>
                      </div>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>{session.date}</span>
                        <span>{session.startTime}</span>
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-success">✓</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Active Challenges */}
          <div>
            <div className="rounded-3xl bg-white border border-border/50 p-8 shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-foreground">Active Challenges</h3>
                <Link to="/app/challenges">
                  <ChevronRight className="w-6 h-6 text-muted-foreground hover:text-primary transition-colors" />
                </Link>
              </div>

              <div className="space-y-4 flex-1">
                {mockChallenges.map((challenge) => (
                  <div key={challenge.id} className="group cursor-pointer">
                    <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                      {challenge.title}
                    </p>
                    <Progress value={(challenge.progress / challenge.total) * 100} className="h-2 mb-1" />
                    <p className="text-xs text-muted-foreground">
                      {challenge.progress} of {challenge.total} completed
                    </p>
                  </div>
                ))}
              </div>

              <Link to="/app/challenges" className="mt-6 block">
                <Button variant="outline" className="w-full rounded-full transition-all duration-300 hover:scale-105">
                  View All Challenges
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* CTA Card */}
        <Link to="/app/session">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-secondary p-12 md:p-16 text-white group cursor-pointer transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -ml-48 -mb-48" />

            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80 font-semibold uppercase tracking-wide mb-2">
                  Start Now
                </p>
                <h2 className="text-4xl font-bold">Start Your Focus Session</h2>
              </div>
              <ArrowRight className="w-8 h-8 flex-shrink-0 transition-transform duration-300 group-hover:translate-x-2" />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
