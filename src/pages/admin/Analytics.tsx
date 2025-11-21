import { Card, CardContent, CardHeader, CardTitle } from 'src/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Zap, Target } from 'lucide-react';

// Mock data
const dailyData = [
  { date: 'Mon', sessions: 120, users: 45 },
  { date: 'Tue', sessions: 150, users: 52 },
  { date: 'Wed', sessions: 135, users: 48 },
  { date: 'Thu', sessions: 180, users: 62 },
  { date: 'Fri', sessions: 200, users: 71 },
  { date: 'Sat', sessions: 95, users: 35 },
  { date: 'Sun', sessions: 110, users: 40 },
];

const categoryData = [
  { name: 'Study', value: 280, color: '#3b82f6' },
  { name: 'Work', value: 240, color: '#8b5cf6' },
  { name: 'Reading', value: 160, color: '#10b981' },
  { name: 'Deep Work', value: 190, color: '#f59e0b' },
];

const topChallenges = [
  { name: '7-Day Consistency', participants: 145, completed: 89 },
  { name: 'No Social Media After 10PM', participants: 128, completed: 71 },
  { name: '50 Hours This Month', participants: 95, completed: 42 },
  { name: 'Deep Work Sprint', participants: 76, completed: 34 },
];

export default function AdminAnalytics() {
  const totalActiveUsers = 342;
  const totalSessions = 1085;
  const avgSessionLength = 42;
  const totalFocusHours = 756;

  return (
    <div className="min-h-screen bg-white py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Platform Analytics</h1>
          </div>
          <p className="text-lg text-muted-foreground">Monitor ReFocus platform metrics and user activity</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="group rounded-3xl bg-white border border-border/50 p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide">Active Users</p>
              <Users className="w-5 h-5 text-primary/30 group-hover:text-primary transition-colors" />
            </div>
            <p className="text-4xl font-bold text-primary mb-2">{totalActiveUsers}</p>
            <p className="text-xs text-success font-semibold">↑ 12% from last week</p>
          </div>

          <div className="group rounded-3xl bg-white border border-border/50 p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide">Sessions This Week</p>
              <Zap className="w-5 h-5 text-secondary/30 group-hover:text-secondary transition-colors" />
            </div>
            <p className="text-4xl font-bold text-secondary mb-2">{totalSessions}</p>
            <p className="text-xs text-success font-semibold">↑ 8% from last week</p>
          </div>

          <div className="group rounded-3xl bg-white border border-border/50 p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide">Avg Session Length</p>
              <Target className="w-5 h-5 text-success/30 group-hover:text-success transition-colors" />
            </div>
            <p className="text-4xl font-bold text-success mb-2">{avgSessionLength} min</p>
            <p className="text-xs text-warning font-semibold">↓ 3% from last week</p>
          </div>

          <div className="group rounded-3xl bg-white border border-border/50 p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide">Total Focus Hours</p>
              <TrendingUp className="w-5 h-5 text-warning/30 group-hover:text-warning transition-colors" />
            </div>
            <p className="text-4xl font-bold text-warning mb-2">{totalFocusHours}</p>
            <p className="text-xs text-success font-semibold">↑ 15% from last week</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Sessions & Active Users Trend */}
          <Card className="rounded-3xl border border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>Weekly Activity Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyData}>
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
                    dataKey="sessions"
                    stroke="var(--color-primary)"
                    strokeWidth={2}
                    dot={{ fill: 'var(--color-primary)', r: 4 }}
                    name="Sessions"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Focus Category Distribution */}
          <Card className="rounded-3xl border border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>Focus Category Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--color-background)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '0.75rem',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top Challenges */}
        <Card className="rounded-3xl border border-border/50 shadow-sm mb-12">
          <CardHeader>
            <CardTitle>Top Challenges</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topChallenges}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-background)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '0.75rem',
                  }}
                />
                <Bar dataKey="participants" fill="var(--color-primary)" name="Participants" />
                <Bar dataKey="completed" fill="var(--color-success)" name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Detailed Challenge Stats */}
        <Card className="rounded-3xl border border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle>Challenge Participation Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/30">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Challenge</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Participants</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Completed</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Completion Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {topChallenges.map((challenge, i) => (
                    <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4">
                        <p className="font-semibold text-foreground">{challenge.name}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-muted-foreground">{challenge.participants}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-muted-foreground">{challenge.completed}</p>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-muted rounded-full h-2">
                            <div
                              className="h-2 bg-primary rounded-full transition-all"
                              style={{
                                width: `${(challenge.completed / challenge.participants) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-primary">
                            {Math.round((challenge.completed / challenge.participants) * 100)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
