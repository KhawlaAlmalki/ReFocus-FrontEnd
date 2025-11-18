import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Mail, Phone, Calendar, Trophy, Clock } from 'lucide-react';
import { toast } from 'sonner';

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock user data
  const user = {
    id: id,
    name: 'Khawla Almaliki',
    email: 'khawla@example.com',
    phone: '+1 (555) 123-4567',
    role: 'End User',
    status: 'Active',
    joinDate: '2024-01-10',
    lastActive: '2024-01-17 2:30 PM',
    focusSessions: 24,
    totalFocusHours: 45,
    currentStreak: 4,
    bestStreak: 7,
    completedChallenges: 2,
    joinedChallenges: 3,
  };

  const handleResetPassword = () => {
    toast.success('Password reset email sent to user');
  };

  const handleChangeRole = () => {
    toast.success('User role updated');
  };

  return (
    <div className="min-h-screen bg-white py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/admin/users')}
          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8 font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Users
        </button>

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">{user.name}</h1>
              <Badge className="bg-blue-100 text-blue-800">{user.role}</Badge>
            </div>
            <Badge variant={user.status === 'Active' ? 'default' : 'outline'}>
              {user.status}
            </Badge>
          </div>
        </div>

        {/* User Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Contact Information */}
          <Card className="rounded-3xl border border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-semibold text-foreground">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-semibold text-foreground">{user.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Calendar className="w-5 h-5 text-primary flex-shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground">Joined</p>
                  <p className="font-semibold text-foreground">{user.joinDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground">Last Active</p>
                  <p className="font-semibold text-foreground">{user.lastActive}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Statistics */}
          <Card className="rounded-3xl border border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>Account Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <p className="text-muted-foreground">Focus Sessions</p>
                <p className="text-2xl font-bold text-primary">{user.focusSessions}</p>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <p className="text-muted-foreground">Total Focus Hours</p>
                <p className="text-2xl font-bold text-primary">{user.totalFocusHours}</p>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <p className="text-muted-foreground">Current Streak</p>
                <p className="text-2xl font-bold text-success">{user.currentStreak} days</p>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <p className="text-muted-foreground">Best Streak</p>
                <p className="text-2xl font-bold text-secondary">{user.bestStreak} days</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Challenges Information */}
        <Card className="rounded-3xl border border-border/50 shadow-sm mb-12">
          <CardHeader>
            <CardTitle>Challenge Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-gradient-to-br from-success/10 to-success/5 rounded-2xl border border-success/20">
                <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide mb-2">
                  Completed Challenges
                </p>
                <p className="text-4xl font-bold text-success">{user.completedChallenges}</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border border-primary/20">
                <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide mb-2">
                  Joined Challenges
                </p>
                <p className="text-4xl font-bold text-primary">{user.joinedChallenges}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Admin Actions */}
        <Card className="rounded-3xl border border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle>Admin Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={handleResetPassword}
                variant="outline"
                className="rounded-full py-3 text-base font-semibold transition-all duration-300"
              >
                Reset Password
              </Button>
              <Button
                onClick={handleChangeRole}
                variant="outline"
                className="rounded-full py-3 text-base font-semibold transition-all duration-300"
              >
                Change Role
              </Button>
              <Button
                variant="outline"
                className="rounded-full py-3 text-base font-semibold transition-all duration-300"
              >
                View Full Activity
              </Button>
              <Button
                variant="destructive"
                className="rounded-full py-3 text-base font-semibold transition-all duration-300"
              >
                Suspend Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
