import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Plus, Edit, Trash2, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

interface Challenge {
  id: string;
  title: string;
  description: string;
  duration: string;
  focusArea: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  participants: number;
}

const mockChallenges: Challenge[] = [
  {
    id: '1',
    title: '7-Day Consistency',
    description: 'Focus for at least 1 hour every day for 7 consecutive days',
    duration: '7 days',
    focusArea: 'Streak Building',
    difficulty: 'Medium',
    participants: 145,
  },
  {
    id: '2',
    title: 'No Social Media After 10PM',
    description: 'Avoid social media platforms after 10 PM for a full week',
    duration: '7 days',
    focusArea: 'Digital Wellness',
    difficulty: 'Easy',
    participants: 128,
  },
  {
    id: '3',
    title: 'Deep Work Sprint',
    description: 'Complete 3 uninterrupted 60-minute focus sessions',
    duration: '14 days',
    focusArea: 'Deep Work',
    difficulty: 'Hard',
    participants: 76,
  },
  {
    id: '4',
    title: '50 Hours This Month',
    description: 'Accumulate 50 hours of focused work time this month',
    duration: '30 days',
    focusArea: 'Productivity',
    difficulty: 'Hard',
    participants: 95,
  },
];

export default function CoachChallenges() {
  const [challenges, setChallenges] = useState(mockChallenges);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const filteredChallenges = challenges.filter(c =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setChallenges(challenges.filter(c => c.id !== id));
    toast.success('Challenge deleted');
  };

  const handleCreate = () => {
    toast.success('Challenge created successfully');
    setShowCreateForm(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: { [key: string]: string } = {
      Easy: 'bg-green-100 text-green-800',
      Medium: 'bg-yellow-100 text-yellow-800',
      Hard: 'bg-red-100 text-red-800',
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-white py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground">Challenge Library</h1>
                <p className="text-lg text-muted-foreground">Create and manage focus challenges for your mentees</p>
              </div>
            </div>
            <Button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="rounded-full gap-2 transition-all duration-300 hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              Create Challenge
            </Button>
          </div>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <Card className="rounded-3xl border border-border/50 shadow-sm mb-12">
            <CardHeader>
              <CardTitle>Create New Challenge</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Challenge Title</label>
                <Input placeholder="Enter challenge title" className="rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Description</label>
                <Input placeholder="Describe the challenge" className="rounded-xl h-24" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Duration</label>
                  <Input placeholder="e.g., 7 days" className="rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Focus Area</label>
                  <Input placeholder="e.g., Streak Building" className="rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Difficulty</label>
                  <select className="w-full px-4 py-2 rounded-xl border border-border bg-white">
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleCreate}
                  className="flex-1 rounded-full bg-primary hover:bg-primary/90"
                >
                  Create Challenge
                </Button>
                <Button
                  onClick={() => setShowCreateForm(false)}
                  variant="outline"
                  className="flex-1 rounded-full"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search */}
        <Card className="mb-8 rounded-3xl border border-border/50 shadow-sm">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-4 top-3 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search challenges..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 rounded-xl py-3 h-auto"
              />
            </div>
          </CardContent>
        </Card>

        {/* Challenges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredChallenges.map((challenge) => (
            <Card key={challenge.id} className="rounded-3xl border border-border/50 shadow-sm hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-2">{challenge.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{challenge.description}</p>
                  </div>
                  <Badge className={getDifficultyColor(challenge.difficulty)}>
                    {challenge.difficulty}
                  </Badge>
                </div>

                <div className="space-y-3 mb-6 py-4 border-t border-b border-border/50">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-semibold text-foreground">{challenge.duration}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Focus Area</span>
                    <span className="font-semibold text-foreground">{challenge.focusArea}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Participants</span>
                    <span className="font-semibold text-primary">{challenge.participants}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 rounded-full gap-2 h-9">
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(challenge.id)}
                    variant="outline"
                    className="flex-1 rounded-full gap-2 h-9 text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredChallenges.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">No challenges found</p>
          </div>
        )}
      </div>
    </div>
  );
}
