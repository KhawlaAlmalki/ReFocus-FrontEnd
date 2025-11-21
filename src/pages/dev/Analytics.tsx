import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from 'src/components/ui/card';
import { Badge } from 'src/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from 'src/components/ui/select';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, } from 'recharts';
import { ArrowLeft, TrendingUp, Download, Users, Clock, Star, Activity, } from 'lucide-react';

const gamePerformanceData = [
  { month: 'Jan', 'Focus Quest': 1245, 'Zen Garden': 432, 'Memory Match': 234 },
  { month: 'Feb', 'Focus Quest': 1450, 'Zen Garden': 589, 'Memory Match': 345 },
  { month: 'Mar', 'Focus Quest': 1890, 'Zen Garden': 754, 'Memory Match': 512 },
  { month: 'Apr', 'Focus Quest': 2100, 'Zen Garden': 921, 'Memory Match': 678 },
];

const engagementData = [
  { name: 'New Users', value: 35 },
  { name: 'Returning Users', value: 65 },
];

const sessionDurationData = [
  { game: 'Focus Quest', avgDuration: 28, target: 30 },
  { game: 'Zen Garden', avgDuration: 22, target: 25 },
  { game: 'Memory Match', avgDuration: 18, target: 20 },
  { game: 'Rhythm Runner', avgDuration: 25, target: 30 },
];

const COLORS = ['#0c2d59', '#6e94ac', '#d4a574', '#5b7c99'];

export default function DeveloperAnalytics() {
  const [selectedGame, setSelectedGame] = useState('all');
  const [timeRange, setTimeRange] = useState('month');

  const totalPlays = gamePerformanceData.reduce(
    (sum, month) => sum + month['Focus Quest'] + month['Zen Garden'] + month['Memory Match'],
    0
  );
  const avgRating = 4.7;
  const activeUsers = 1245;
  const avgSessionDuration = 24;

  return (
    <div className="min-h-screen bg-white py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <Link to="/dev/dashboard">
              <Button variant="outline" size="icon" className="rounded-full">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold text-foreground">Analytics</h1>
              <p className="text-muted-foreground">
                Track performance and user engagement
              </p>
            </div>
          </div>
          <Button variant="outline" className="rounded-full gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="rounded-3xl border border-border/50 shadow-sm hover:shadow-lg transition-all">
            <CardContent className="p-8">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide mb-2">
                    Total Plays
                  </p>
                  <p className="text-4xl font-bold text-foreground">{totalPlays}</p>
                  <p className="text-xs text-green-600 mt-2">+12% vs last month</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-2xl">
                  <Activity className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border border-border/50 shadow-sm hover:shadow-lg transition-all">
            <CardContent className="p-8">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide mb-2">
                    Active Users
                  </p>
                  <p className="text-4xl font-bold text-foreground">
                    {activeUsers}
                  </p>
                  <p className="text-xs text-green-600 mt-2">+8% vs last month</p>
                </div>
                <div className="p-3 bg-secondary/10 rounded-2xl">
                  <Users className="w-6 h-6 text-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border border-border/50 shadow-sm hover:shadow-lg transition-all">
            <CardContent className="p-8">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide mb-2">
                    Avg Rating
                  </p>
                  <p className="text-4xl font-bold text-foreground">{avgRating}</p>
                  <div className="flex gap-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-3 h-3"
                        fill={i < 4 ? '#fbbf24' : 'none'}
                        stroke="#fbbf24"
                      />
                    ))}
                  </div>
                </div>
                <div className="p-3 bg-yellow-100 rounded-2xl">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border border-border/50 shadow-sm hover:shadow-lg transition-all">
            <CardContent className="p-8">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide mb-2">
                    Avg Session
                  </p>
                  <p className="text-4xl font-bold text-foreground">
                    {avgSessionDuration}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">minutes</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-2xl">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <Select value={selectedGame} onValueChange={setSelectedGame}>
            <SelectTrigger className="w-full md:w-60 rounded-2xl">
              <SelectValue placeholder="Select game" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Games</SelectItem>
              <SelectItem value="focus-quest">Focus Quest</SelectItem>
              <SelectItem value="zen-garden">Zen Garden</SelectItem>
              <SelectItem value="memory-match">Memory Match</SelectItem>
            </SelectContent>
          </Select>

          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-full md:w-40 rounded-2xl">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Game Plays Over Time */}
          <Card className="rounded-3xl border border-border/50 shadow-sm">
            <CardHeader className="border-b border-border/50">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Game Plays Over Time
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={gamePerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="Focus Quest"
                    stroke={COLORS[0]}
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="Zen Garden"
                    stroke={COLORS[1]}
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="Memory Match"
                    stroke={COLORS[2]}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* User Engagement */}
          <Card className="rounded-3xl border border-border/50 shadow-sm">
            <CardHeader className="border-b border-border/50">
              <CardTitle>User Engagement</CardTitle>
            </CardHeader>
            <CardContent className="p-8 flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={engagementData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name} (${entry.value}%)`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {engagementData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Session Duration Comparison */}
        <Card className="rounded-3xl border border-border/50 shadow-sm mb-8">
          <CardHeader className="border-b border-border/50">
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-600" />
              Session Duration vs Target
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sessionDurationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="game" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="avgDuration" fill={COLORS[0]} name="Avg Duration" />
                <Bar dataKey="target" fill="#d1d5db" name="Target" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Detailed Metrics Table */}
        <Card className="rounded-3xl border border-border/50 shadow-sm">
          <CardHeader className="border-b border-border/50">
            <CardTitle>Detailed Game Metrics</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-4">
              {[
                {
                  name: 'Focus Quest',
                  plays: 1245,
                  users: 456,
                  rating: 4.8,
                  duration: 28,
                  retention: '85%',
                },
                {
                  name: 'Zen Garden',
                  plays: 432,
                  users: 234,
                  rating: 4.6,
                  duration: 22,
                  retention: '72%',
                },
                {
                  name: 'Memory Match',
                  plays: 234,
                  users: 145,
                  rating: 4.5,
                  duration: 18,
                  retention: '65%',
                },
                {
                  name: 'Rhythm Runner',
                  plays: 856,
                  users: 345,
                  rating: 4.7,
                  duration: 25,
                  retention: '78%',
                },
              ].map((game, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-6 rounded-2xl bg-muted/30 border border-border/50 hover:shadow-md transition-all"
                >
                  <div className="flex-1">
                    <p className="font-bold text-foreground mb-1">{game.name}</p>
                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                      <span>{game.plays} plays</span>
                      <span>{game.users} users</span>
                      <span>{game.duration}m avg</span>
                      <span>{game.retention} retention</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-foreground">{game.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
