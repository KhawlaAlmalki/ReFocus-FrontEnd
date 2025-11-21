import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, User } from 'lucide-react';
import { toast } from 'sonner';

interface CoachRequest {
  id: string;
  name: string;
  email: string;
  experience: string;
  bio: string;
  specialization: string;
  menteeCount: number;
  submittedDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

const mockRequests: CoachRequest[] = [
  {
    id: '1',
    name: 'Ahmed Hassan',
    email: 'ahmed@example.com',
    experience: '3 years of coaching experience in productivity and focus management',
    bio: 'Certified productivity coach with expertise in helping students achieve their academic goals.',
    specialization: 'Academic Focus, Time Management',
    menteeCount: 0,
    submittedDate: '2024-01-15',
    status: 'Pending',
  },
  {
    id: '2',
    name: 'Emma Wilson',
    email: 'emma@example.com',
    experience: '8 years of corporate training and professional development',
    bio: 'Former HR manager passionate about helping professionals develop focus and productivity habits.',
    specialization: 'Professional Development, Deep Work',
    menteeCount: 0,
    submittedDate: '2024-01-12',
    status: 'Pending',
  },
  {
    id: '3',
    name: 'Marcus Johnson',
    email: 'marcus@example.com',
    experience: '3 years of mentoring students in STEM fields',
    bio: 'STEM educator focused on helping students maintain focus during challenging coursework.',
    specialization: 'STEM Education, Student Coaching',
    menteeCount: 0,
    submittedDate: '2024-01-10',
    status: 'Approved',
  },
  {
    id: '4',
    name: 'Sophie Taylor',
    email: 'sophie@example.com',
    experience: '4 years of wellness coaching',
    bio: 'Wellness coach interested in digital well-being and focus management.',
    specialization: 'Digital Wellness',
    menteeCount: 0,
    submittedDate: '2024-01-08',
    status: 'Rejected',
  },
];

export default function CoachRequests() {
  const [requests, setRequests] = useState(mockRequests);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleApprove = (id: string) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: 'Approved' } : r));
    toast.success('Coach request approved!');
  };

  const handleReject = (id: string) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: 'Rejected' } : r));
    toast.success('Coach request rejected');
  };

  const pendingCount = requests.filter(r => r.status === 'Pending').length;
  const approvedCount = requests.filter(r => r.status === 'Approved').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-white py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <User className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Coach Verification Requests</h1>
          </div>
          <p className="text-lg text-muted-foreground">Review and approve pending coach applications</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="rounded-3xl bg-white border border-border/50 p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide mb-2">Pending</p>
            <p className="text-4xl font-bold text-warning">{pendingCount}</p>
          </div>
          <div className="rounded-3xl bg-white border border-border/50 p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide mb-2">Approved</p>
            <p className="text-4xl font-bold text-success">{approvedCount}</p>
          </div>
          <div className="rounded-3xl bg-white border border-border/50 p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide mb-2">Total Requests</p>
            <p className="text-4xl font-bold text-primary">{requests.length}</p>
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-6">
          {requests.map((request) => (
            <Card
              key={request.id}
              className="rounded-3xl border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-2xl font-bold text-foreground">{request.name}</h3>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status === 'Pending' && (
                          <>
                            <Clock className="w-3 h-3 mr-1" />
                            {request.status}
                          </>
                        )}
                        {request.status === 'Approved' && (
                          <>
                            <CheckCircle className="w-3 h-3 mr-1" />
                            {request.status}
                          </>
                        )}
                        {request.status === 'Rejected' && (
                          <>
                            <XCircle className="w-3 h-3 mr-1" />
                            {request.status}
                          </>
                        )}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm mb-4">{request.email}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">Submitted: {request.submittedDate}</p>
                </div>

                {/* Experience and Bio */}
                <div className="space-y-3 mb-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-1">Experience</p>
                    <p className="text-muted-foreground">{request.experience}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-1">Bio</p>
                    <p className="text-muted-foreground">{request.bio}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-1">Specialization</p>
                    <div className="flex flex-wrap gap-2">
                      {request.specialization.split(',').map((spec, i) => (
                        <Badge key={i} variant="outline" className="bg-blue-50 border-blue-200">
                          {spec.trim()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons - Only for Pending */}
                {request.status === 'Pending' && (
                  <div className="flex gap-3 pt-4 border-t border-border/50">
                    <Button
                      onClick={() => handleApprove(request.id)}
                      className="flex-1 rounded-full bg-success hover:bg-success/90 text-white gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleReject(request.id)}
                      variant="outline"
                      className="flex-1 rounded-full gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </Button>
                  </div>
                )}

                {/* Approved/Rejected Badge */}
                {request.status !== 'Pending' && (
                  <div className="pt-4 border-t border-border/50">
                    {request.status === 'Approved' && (
                      <p className="text-sm text-success font-semibold">✓ Approved - Coach can now mentor students</p>
                    )}
                    {request.status === 'Rejected' && (
                      <p className="text-sm text-destructive font-semibold">✗ Rejected - Coach application declined</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {pendingCount === 0 && (
          <div className="text-center py-16">
            <CheckCircle className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">All pending requests have been reviewed!</p>
          </div>
        )}
      </div>
    </div>
  );
}
