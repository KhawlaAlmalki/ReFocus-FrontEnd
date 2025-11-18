import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowLeft, TrendingUp, Trophy, MessageSquare, Target } from 'lucide-react';
import { toast } from 'sonner';

const focusTrendData = [
  { date: 'Mon', hours: 2.5 },
  { date: 'Tue', hours: 3 },
  { date: 'Wed', hours: 2 },
  { date: 'Thu', hours: 3.5 },
  { date: 'Fri', hours: 4 },
  { date: 'Sat', hours: 1.5 },
  { date: 'Sun', hours: 2.5 },
];

const sessionData = [
  { date: 'Study', count: 12 },
  { date: 'Work', count: 8 },
  { date: 'Reading', count: 5 },
  { date: 'Deep Work', count: 6 },
];

export default function MenteeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock mentee data
  const mentee = {
    id: id,
    name: 'Khawla Almaliki',
    email: 'khawla@example.com',
    focusScore: 85,
    totalFocusHours: 45,
    currentStreak: 4,
    bestStreak: 7,
    status: 'Active',
    recentSessions: 12,
    completedChallenges: 2,
  };

  const handleAssignChallenge = () => {
    toast.success('Challenge assigned to mentee!');
  };

  const handleSendMessage = () => {
    navigate('/coach/messages');
  };

  return (
    <div className="min-h-screen bg-white py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/coach/dashboard')}
          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8 font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Mentees
        </button>

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">{mentee.name}</h1>
              <p className="text-muted-foreground">{mentee.email}</p>
            </div>
            <Badge variant={mentee.status === 'Active' ? 'default' : 'destructive'}>
              {mentee.status}
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="rounded-3xl bg-white border border-border/50 p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide mb-2">Focus Score</p>
            <p className="text-4xl font-bold text-primary">{mentee.focusScore}</p>
            <p className="text-xs text-success font-semibold mt-2">Above average</p>
          </div>

          <div className="rounded-3xl bg-white border border-border/50 p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide mb-2">Total Hours</p>
            <p className="text-4xl font-bold text-secondary">{mentee.totalFocusHours}</p>
            <p className="text-xs text-muted-foreground font-semibold mt-2">Hours focused</p>
          </div>

          <div className="rounded-3xl bg-white border border-border/50 p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide mb-2">Current Streak</p>
            <p className="text-4xl font-bold text-success">{mentee.currentStreak}</p>
            <p className="text-xs text-muted-foreground font-semibold mt-2">Days</p>
          </div>

          <div className="rounded-3xl bg-white border border-border/50 p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide mb-2">Best Streak</p>
            <p className="text-4xl font-bold text-warning">{mentee.bestStreak}</p>
            <p className="text-xs text-muted-foreground font-semibold mt-2">Days</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Focus Trend */}
          <Card className="rounded-3xl border border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>Weekly Focus Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={focusTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="date" stroke="var(--color-muted-foreground)" />
                  <YAxis stroke="var(--color-muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--color-background)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '0.75rem',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="hours"
                    stroke="var(--color-primary)"
                    strokeWidth={2}
                    dot={{ fill: 'var(--color-primary)', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Session Categories */}
          <Card className="rounded-3xl border border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>Focus Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sessionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="date" stroke="var(--color-muted-foreground)" />
                  <YAxis stroke="var(--color-muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--color-background)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '0.75rem',
                    }}
                  />
                  <Bar dataKey="count" fill="var(--color-primary)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Challenges Section */}
        <Card className="rounded-3xl border border-border/50 shadow-sm mb-12">
          <CardHeader>
            <CardTitle>Challenge Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-gradient-to-br from-success/10 to-success/5 rounded-2xl border border-success/20">
                <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide mb-2">
                  Completed
                </p>
                <p className="text-3xl font-bold text-success">{mentee.completedChallenges}</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border border-primary/20">
                <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide mb-2">
                  In Progress
                </p>
                <p className="text-3xl font-bold text-primary">1</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-2xl border border-secondary/20">
                <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide mb-2">
                  Available
                </p>
                <p className="text-3xl font-bold text-secondary">5</p>
              </div>
            </div>
            <Button
              onClick={handleAssignChallenge}
              className="w-full rounded-full bg-primary hover:bg-primary/90 text-white py-3 font-semibold transition-all duration-300"
            >
              <Target className="w-4 h-4 mr-2" />
              Assign New Challenge
            </Button>
          </CardContent>
        </Card>

        {/* Recent Sessions */}
        <Card className="rounded-3xl border border-border/50 shadow-sm mb-12">
          <CardHeader>
            <CardTitle>Recent Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              This mentee has completed {mentee.recentSessions} sessions in the last 30 days
            </p>
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl">
              <div>
                <p className="text-sm text-muted-foreground font-semibold mb-1">Average session duration</p>
                <p className="text-2xl font-bold text-primary">42 minutes</p>
              </div>
              <TrendingUp className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            onClick={handleSendMessage}
            variant="outline"
            className="rounded-full py-3 text-base font-semibold transition-all duration-300"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Send Message
          </Button>
          <Button
            className="rounded-full py-3 text-base font-semibold transition-all duration-300"
          >
            <Trophy className="w-4 h-4 mr-2" />
            View Full Report
          </Button>
        </div>
      </div>
    </div>
  );
}
