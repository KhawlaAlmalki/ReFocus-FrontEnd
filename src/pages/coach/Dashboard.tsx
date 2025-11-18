import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Users, TrendingUp, Trophy, ChevronRight } from 'lucide-react';

interface Mentee {
  id: string;
  name: string;
  email: string;
  focusScore: number;
  totalFocusHours: number;
  status: 'Active' | 'At Risk';
  currentStreak: number;
  lastActive: string;
}

const mockMentees: Mentee[] = [
  { id: '1', name: 'Khawla Almaliki', email: 'khawla@example.com', focusScore: 85, totalFocusHours: 45, status: 'Active', currentStreak: 4, lastActive: '2024-01-17' },
  { id: '2', name: 'Sarah Smith', email: 'sarah@example.com', focusScore: 92, totalFocusHours: 120, status: 'Active', currentStreak: 7, lastActive: '2024-01-17' },
  { id: '3', name: 'John Doe', email: 'john@example.com', focusScore: 65, totalFocusHours: 28, status: 'At Risk', currentStreak: 1, lastActive: '2024-01-14' },
  { id: '4', name: 'Emma Wilson', email: 'emma@example.com', focusScore: 78, totalFocusHours: 65, status: 'Active', currentStreak: 5, lastActive: '2024-01-17' },
  { id: '5', name: 'Michael Brown', email: 'michael@example.com', focusScore: 88, totalFocusHours: 95, status: 'Active', currentStreak: 6, lastActive: '2024-01-17' },
  { id: '6', name: 'Lisa Anderson', email: 'lisa@example.com', focusScore: 42, totalFocusHours: 12, status: 'At Risk', currentStreak: 0, lastActive: '2024-01-10' },
];

export default function CoachDashboard() {
  const [mentees, setMentees] = useState(mockMentees);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMentees = mentees.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeMentees = mentees.filter(m => m.status === 'Active').length;
  const atRiskMentees = mentees.filter(m => m.status === 'At Risk').length;
  const avgFocusScore = Math.round(mentees.reduce((sum, m) => sum + m.focusScore, 0) / mentees.length);

  return (
    <div className="min-h-screen bg-white py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">My Mentees</h1>
          </div>
          <p className="text-lg text-muted-foreground">Track your mentees' focus progress and provide guidance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="group rounded-3xl bg-white border border-border/50 p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide">Total Mentees</p>
              <Users className="w-5 h-5 text-primary/30 group-hover:text-primary transition-colors" />
            </div>
            <p className="text-4xl font-bold text-primary">{mentees.length}</p>
          </div>

          <div className="group rounded-3xl bg-white border border-border/50 p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide">Active</p>
              <TrendingUp className="w-5 h-5 text-success/30 group-hover:text-success transition-colors" />
            </div>
            <p className="text-4xl font-bold text-success">{activeMentees}</p>
          </div>

          <div className="group rounded-3xl bg-white border border-border/50 p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide">At Risk</p>
              <Trophy className="w-5 h-5 text-destructive/30 group-hover:text-destructive transition-colors" />
            </div>
            <p className="text-4xl font-bold text-destructive">{atRiskMentees}</p>
          </div>

          <div className="group rounded-3xl bg-white border border-border/50 p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide">Avg Focus Score</p>
              <TrendingUp className="w-5 h-5 text-secondary/30 group-hover:text-secondary transition-colors" />
            </div>
            <p className="text-4xl font-bold text-secondary">{avgFocusScore}</p>
          </div>
        </div>

        {/* Search Bar */}
        <Card className="mb-8 rounded-3xl border border-border/50 shadow-sm">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-4 top-3 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search mentees by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 rounded-xl py-3 h-auto"
              />
            </div>
          </CardContent>
        </Card>

        {/* Mentees List */}
        <div className="space-y-4">
          {filteredMentees.map((mentee) => (
            <Link key={mentee.id} to={`/coach/mentee/${mentee.id}`}>
              <Card className="rounded-3xl border border-border/50 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-foreground">{mentee.name}</h3>
                          <p className="text-sm text-muted-foreground">{mentee.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 flex-wrap">
                        <div>
                          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-1">
                            Focus Score
                          </p>
                          <p className="text-2xl font-bold text-primary">{mentee.focusScore}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-1">
                            Total Hours
                          </p>
                          <p className="text-2xl font-bold text-secondary">{mentee.totalFocusHours}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-1">
                            Streak
                          </p>
                          <p className="text-2xl font-bold text-success">{mentee.currentStreak} days</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-1">
                            Last Active
                          </p>
                          <p className="text-sm text-muted-foreground">{mentee.lastActive}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <Badge variant={mentee.status === 'Active' ? 'default' : 'destructive'}>
                        {mentee.status}
                      </Badge>
                      <ChevronRight className="w-6 h-6 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {filteredMentees.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">No mentees found</p>
          </div>
        )}
      </div>
    </div>
  );
}
