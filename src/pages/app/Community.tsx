import { useState } from 'react';
import { Button } from 'src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from 'src/components/ui/card';
import { Input } from 'src/components/ui/input';
import { Textarea } from 'src/components/ui/textarea';
import { Badge } from 'src/components/ui/badge';
import { Progress } from 'src/components/ui/progress';
import {
    Heart,
    MessageCircle,
    Flag,
    Plus,
    Smile,
    Tag,
    Users,
    Flame,
    AlertCircle,
    MapPin,
} from 'lucide-react';

interface CommunityPost {
    id: string;
    authorName: string;
    authorAvatar: string;
    timestamp: string;
    content: string;
    tags: string[];
    likes: number;
    comments: number;
    liked: boolean;
}

interface Challenge {
    id: string;
    title: string;
    progress: number;
    participants: number;
}

interface Coach {
    id: string;
    name: string;
    specialization: string;
    avatar: string;
}

const mockPosts: CommunityPost[] = [
    {
        id: '1',
        authorName: 'Sarah Chen',
        authorAvatar: '👩‍💼',
        timestamp: '2 hours ago',
        content: 'Just completed my 2-hour deep work session! Using the Pomodoro technique + Focus Quest game really helped me stay on track. Feeling pumped! 🎯',
        tags: ['#Study', '#DeepWork', '#Productivity'],
        likes: 24,
        comments: 5,
        liked: false,
    },
    {
        id: '2',
        authorName: 'Marcus Johnson',
        authorAvatar: '👨‍💼',
        timestamp: '4 hours ago',
        content: 'Struggling today with social media distractions. Already scrolled through TikTok 3 times this morning. Going to use the digital detox challenge to help me reset.',
        tags: ['#Struggling', '#Focus', '#DigitalWellness'],
        likes: 12,
        comments: 8,
        liked: false,
    },
    {
        id: '3',
        authorName: 'Emma Rodriguez',
        authorAvatar: '👩‍🎓',
        timestamp: '6 hours ago',
        content: 'Pro tip: I start my day with a 5-minute Zen Garden session to calm my mind before tackling work. Sets the right mental state for focus. Highly recommend! 🧘',
        tags: ['#Tips', '#Wellness', '#Morning Routine'],
        likes: 156,
        comments: 32,
        liked: false,
    },
];

const mockChallenges: Challenge[] = [
    {
        id: '1',
        title: '7-Day Focus Streak',
        progress: 5,
        participants: 2341,
    },
    {
        id: '2',
        title: 'No Social Media after 10PM',
        progress: 3,
        participants: 1856,
    },
    {
        id: '3',
        title: 'Phone-Free Mornings',
        progress: 6,
        participants: 1203,
    },
];

const mockCoaches: Coach[] = [
    {
        id: '1',
        name: 'Dr. Alex Mitchell',
        specialization: 'ADHD & Focus',
        avatar: '👨‍⚕️',
    },
    {
        id: '2',
        name: 'Priya Patel',
        specialization: 'Study Skills',
        avatar: '👩‍🏫',
    },
];

export default function Community() {
    const [posts, setPosts] = useState<CommunityPost[]>(mockPosts);
    const [newPost, setNewPost] = useState('');
    const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
    const [activeTab, setActiveTab] = useState('feed');

    const handlePost = () => {
        if (newPost.trim()) {
            const post: CommunityPost = {
                id: Date.now().toString(),
                authorName: 'You',
                authorAvatar: '👤',
                timestamp: 'just now',
                content: newPost,
                tags: [],
                likes: 0,
                comments: 0,
                liked: false,
            };
            setPosts([post, ...posts]);
            setNewPost('');
        }
    };

    const handleLike = (postId: string) => {
        const newLiked = new Set(likedPosts);
        if (newLiked.has(postId)) {
            newLiked.delete(postId);
        } else {
            newLiked.add(postId);
        }
        setLikedPosts(newLiked);

        setPosts(
            posts.map((post) =>
                post.id === postId
                    ? {
                        ...post,
                        likes: newLiked.has(postId) ? post.likes + 1 : post.likes - 1,
                        liked: newLiked.has(postId),
                    }
                    : post
            )
        );
    };

    return (
        <div className="min-h-screen bg-white py-8 md:py-12">
            <div className="container mx-auto px-4 md:px-8">
                {/* Community Rules Banner */}
                <div className="mb-8 p-6 rounded-2xl bg-blue-50 border border-blue-200 flex items-start gap-4">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <p className="font-semibold text-blue-900 mb-1">Community Guidelines</p>
                        <p className="text-sm text-blue-800 mb-3">
                            Keep our community supportive and professional. Respect others' journeys and focus on growth.
                        </p>
                        <Button variant="outline" size="sm" className="rounded-full text-blue-600 border-blue-300 hover:bg-blue-50">
                            View Full Guidelines
                        </Button>
                    </div>
                </div>

                {/* Main Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {/* Left Sidebar - User Profile */}
                    <div className="md:col-span-1">
                        {/* User Profile Card */}
                        <Card className="rounded-3xl border border-border/50 shadow-sm sticky top-24 mb-6">
                            <CardContent className="p-8">
                                <div className="text-center mb-6">
                                    <div className="text-6xl mb-4">👤</div>
                                    <h3 className="text-lg font-bold text-foreground">You</h3>
                                    <p className="text-sm text-muted-foreground">Focus Enthusiast</p>
                                </div>

                                <div className="space-y-4 py-4 border-y border-border/50">
                                    <div>
                                        <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">
                                            Focus Score
                                        </p>
                                        <p className="text-3xl font-bold text-primary">87</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">
                                            Current Streak
                                        </p>
                                        <p className="text-2xl font-bold text-secondary">8 days</p>
                                    </div>
                                </div>

                                <div className="mt-6 space-y-2">
                                    <Button
                                        variant={activeTab === 'feed' ? 'default' : 'outline'}
                                        className="w-full rounded-full justify-start"
                                        onClick={() => setActiveTab('feed')}
                                    >
                                        My Feed
                                    </Button>
                                    <Button
                                        variant={activeTab === 'groups' ? 'default' : 'outline'}
                                        className="w-full rounded-full justify-start"
                                        onClick={() => setActiveTab('groups')}
                                    >
                                        My Groups
                                    </Button>
                                    <Button
                                        variant={activeTab === 'challenges' ? 'default' : 'outline'}
                                        className="w-full rounded-full justify-start"
                                        onClick={() => setActiveTab('challenges')}
                                    >
                                        Challenges
                                    </Button>
                                    <Button
                                        variant={activeTab === 'messages' ? 'default' : 'outline'}
                                        className="w-full rounded-full justify-start"
                                        onClick={() => setActiveTab('messages')}
                                    >
                                        Messages
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Middle Content - Feed */}
                    <div className="md:col-span-2 lg:col-span-2">
                        {/* Post Composer */}
                        <Card className="rounded-3xl border border-border/50 shadow-sm mb-6">
                            <CardContent className="p-8">
                                <p className="font-semibold text-foreground mb-4">Share a focus win or tip…</p>
                                <Textarea
                                    value={newPost}
                                    onChange={(e) => setNewPost(e.target.value)}
                                    placeholder="What's your focus achievement or insight today?"
                                    className="rounded-2xl mb-4 min-h-24"
                                />
                                <div className="flex items-center justify-between">
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" className="rounded-full gap-2">
                                            <Smile className="w-4 h-4" />
                                            Add Emoji
                                        </Button>
                                        <Button variant="outline" size="sm" className="rounded-full gap-2">
                                            <Tag className="w-4 h-4" />
                                            Add Tag
                                        </Button>
                                    </div>
                                    <Button
                                        onClick={handlePost}
                                        disabled={!newPost.trim()}
                                        className="rounded-full gap-2"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Post
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Posts Feed */}
                        <div className="space-y-6">
                            {posts.map((post) => (
                                <Card
                                    key={post.id}
                                    className="rounded-3xl border border-border/50 shadow-sm hover:shadow-lg transition-all"
                                >
                                    <CardContent className="p-8">
                                        {/* Post Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="text-3xl">{post.authorAvatar}</div>
                                                <div>
                                                    <p className="font-bold text-foreground">{post.authorName}</p>
                                                    <p className="text-xs text-muted-foreground">{post.timestamp}</p>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="sm" className="rounded-full">
                                                ⋯
                                            </Button>
                                        </div>

                                        {/* Post Content */}
                                        <p className="text-foreground mb-4 leading-relaxed">{post.content}</p>

                                        {/* Tags */}
                                        {post.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-6">
                                                {post.tags.map((tag, idx) => (
                                                    <Badge
                                                        key={idx}
                                                        variant="outline"
                                                        className="rounded-full cursor-pointer hover:bg-primary/10"
                                                    >
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}

                                        {/* Post Actions */}
                                        <div className="flex items-center gap-4 pt-4 border-t border-border/50 text-muted-foreground">
                                            <button
                                                onClick={() => handleLike(post.id)}
                                                className="flex items-center gap-2 hover:text-primary transition-colors"
                                            >
                                                <Heart
                                                    className="w-4 h-4"
                                                    fill={likedPosts.has(post.id) ? 'currentColor' : 'none'}
                                                    stroke={likedPosts.has(post.id) ? '#e63946' : 'currentColor'}
                                                    color={likedPosts.has(post.id) ? '#e63946' : 'inherit'}
                                                />
                                                <span className="text-sm font-medium">{post.likes}</span>
                                            </button>
                                            <button className="flex items-center gap-2 hover:text-primary transition-colors">
                                                <MessageCircle className="w-4 h-4" />
                                                <span className="text-sm font-medium">{post.comments}</span>
                                            </button>
                                            <button className="flex items-center gap-2 ml-auto hover:text-destructive transition-colors">
                                                <Flag className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="md:col-span-1 lg:col-span-1">
                        {/* Trending Challenges */}
                        <Card className="rounded-3xl border border-border/50 shadow-sm sticky top-24 mb-6">
                            <CardHeader className="border-b border-border/50">
                                <div className="flex items-center gap-2">
                                    <Flame className="w-5 h-5 text-orange-500" />
                                    <CardTitle>Trending Challenges</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                {mockChallenges.map((challenge) => (
                                    <div key={challenge.id}>
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="font-semibold text-foreground text-sm">
                                                {challenge.title}
                                            </p>
                                            <span className="text-xs text-muted-foreground">
                        {challenge.participants.toLocaleString()}
                      </span>
                                        </div>
                                        <Progress value={(challenge.progress / 7) * 100} className="h-2 mb-1" />
                                        <p className="text-xs text-muted-foreground">
                                            {challenge.progress}/7 completed
                                        </p>
                                    </div>
                                ))}
                                <Button variant="outline" className="w-full rounded-full mt-4">
                                    View All Challenges
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Suggested Coaches */}
                        <Card className="rounded-3xl border border-border/50 shadow-sm">
                            <CardHeader className="border-b border-border/50">
                                <div className="flex items-center gap-2">
                                    <Users className="w-5 h-5 text-primary" />
                                    <CardTitle>Suggested Coaches</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                {mockCoaches.map((coach) => (
                                    <div
                                        key={coach.id}
                                        className="p-4 rounded-2xl bg-muted/30 border border-border/50"
                                    >
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="text-2xl">{coach.avatar}</div>
                                            <div className="flex-1">
                                                <p className="font-bold text-foreground text-sm">{coach.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {coach.specialization}
                                                </p>
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm" className="w-full rounded-full">
                                            View Profile
                                        </Button>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
