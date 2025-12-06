import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Zap, Loader2 } from 'lucide-react';
import { sessionService } from '@/lib/services/session.service';
import { toast } from 'sonner';

type FilterPeriod = 'week' | 'month' | 'all';
type FocusCategory = 'Study' | 'Work' | 'Reading' | 'Deep Work';

interface Session {
  id: number;
  date: string;
  startTime: string;
  duration: number;
  category: FocusCategory;
  status: 'completed' | 'interrupted';
}

export default function Log() {
  const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>('week');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const response = await sessionService.getSessions();
      const mappedSessions = response.sessions.map(session => ({
        id: parseInt(session.id),
        date: new Date(session.date || session.createdAt || '').toISOString().split('T')[0],
        startTime: session.startTime || new Date(session.createdAt || '').toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        duration: session.duration,
        category: session.category as FocusCategory,
        status: session.status,
      }));
      setSessions(mappedSessions);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: FocusCategory) => {
    const colors: { [key: string]: string } = {
      Study: 'bg-blue-100 text-blue-800',
      'Deep Work': 'bg-purple-100 text-purple-800',
      Reading: 'bg-green-100 text-green-800',
      Work: 'bg-orange-100 text-orange-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    return status === 'completed' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-yellow-100 text-yellow-800';
  };

  // Filter sessions based on selected period
  const getFilteredSessions = () => {
    const today = new Date();
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    return sessions.filter((session) => {
      const sessionDate = new Date(session.date);

      switch (filterPeriod) {
        case 'week':
          return sessionDate >= oneWeekAgo && sessionDate <= today;
        case 'month':
          return sessionDate >= oneMonthAgo && sessionDate <= today;
        case 'all':
          return true;
        default:
          return true;
      }
    });
  };

  const filteredSessions = getFilteredSessions();

  // Calculate summary stats
  const calculateStats = () => {
    const totalMinutes = filteredSessions.reduce((sum, s) => sum + s.duration, 0);
    const avgDuration = filteredSessions.length > 0 ? Math.round(totalMinutes / filteredSessions.length) : 0;
    
    // Find best streak (simplified - just count consecutive completed sessions)
    let streak = 0;
    let bestStreak = 0;
    const sorted = [...filteredSessions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    for (const session of sorted) {
      if (session.status === 'completed') {
        streak++;
        bestStreak = Math.max(bestStreak, streak);
      } else {
        streak = 0;
      }
    }

    return {
      totalHours: (totalMinutes / 60).toFixed(1),
      avgDuration,
      bestStreak,
    };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-foreground mb-8">Session Log</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Main Content - Table */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                {/* Filter Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                  <CardTitle>Your Sessions</CardTitle>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={filterPeriod === 'week' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilterPeriod('week')}
                    >
                      This Week
                    </Button>
                    <Button
                      variant={filterPeriod === 'month' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilterPeriod('month')}
                    >
                      This Month
                    </Button>
                    <Button
                      variant={filterPeriod === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilterPeriod('all')}
                    >
                      All Time
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {/* Responsive Table for Desktop */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Date</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Start Time</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Duration</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Category</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSessions.map((session) => (
                        <tr
                          key={session.id}
                          className="border-b border-border hover:bg-muted/50 transition"
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              {session.date}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              {session.startTime}
                            </div>
                          </td>
                          <td className="py-3 px-4 font-medium">
                            {session.duration} min
                          </td>
                          <td className="py-3 px-4">
                            <Badge className={getCategoryColor(session.category)}>
                              {session.category}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Badge className={getStatusColor(session.status)}>
                              {session.status === 'completed' ? '✓ Completed' : '⏸ Interrupted'}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile List View */}
                <div className="sm:hidden space-y-3">
                  {filteredSessions.map((session) => (
                    <div
                      key={session.id}
                      className="p-4 bg-muted rounded-lg hover:bg-muted/80 transition border border-border"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-foreground flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {session.date}
                          </p>
                          <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                            <Clock className="w-4 h-4" />
                            {session.startTime}
                          </p>
                        </div>
                        <Badge className={getStatusColor(session.status)}>
                          {session.status === 'completed' ? '✓' : '⏸'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2 items-center">
                          <Badge className={getCategoryColor(session.category)}>
                            {session.category}
                          </Badge>
                          <span className="text-sm font-medium text-foreground">
                            {session.duration} min
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredSessions.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      No sessions found for the selected period.
                    </p>
                  </div>
                )}

                <div className="mt-6 text-xs text-muted-foreground text-center">
                  Showing {filteredSessions.length} sessions
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - Summary Card */}
          <div>
            <Card className="bg-gradient-to-br from-blue-50 to-green-50 border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  Summary
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Total Focused Hours */}
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Total Focused Hours</p>
                  <p className="text-3xl font-bold text-primary">
                    {stats.totalHours}
                    <span className="text-lg font-normal"> hrs</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {filterPeriod === 'week' && 'This week'}
                    {filterPeriod === 'month' && 'This month'}
                    {filterPeriod === 'all' && 'All time'}
                  </p>
                </div>

                <div className="border-t border-border pt-4">
                  {/* Average Session Length */}
                  <p className="text-sm text-muted-foreground mb-2">Avg Session</p>
                  <p className="text-3xl font-bold text-secondary">
                    {stats.avgDuration}
                    <span className="text-lg font-normal"> min</span>
                  </p>
                </div>

                <div className="border-t border-border pt-4">
                  {/* Best Streak */}
                  <p className="text-sm text-muted-foreground mb-2">Best Streak</p>
                  <p className="text-3xl font-bold text-foreground">
                    {stats.bestStreak}
                    <span className="text-lg font-normal"> days</span>
                  </p>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Sessions Logged</p>
                    <p className="text-2xl font-bold text-foreground">
                      {filteredSessions.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
