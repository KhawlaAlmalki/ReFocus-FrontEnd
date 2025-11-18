import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageSquare, Send, Search } from 'lucide-react';
import { toast } from 'sonner';

interface Conversation {
  id: string;
  mentee: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
}

interface Message {
  id: string;
  sender: 'coach' | 'mentee';
  text: string;
  timestamp: string;
}

const mockConversations: Conversation[] = [
  {
    id: '1',
    mentee: 'Khawla Almaliki',
    lastMessage: 'Thanks for the guidance! I will focus more on deep work.',
    timestamp: '2024-01-17 2:30 PM',
    unread: true,
  },
  {
    id: '2',
    mentee: 'Sarah Smith',
    lastMessage: 'I completed the 7-day challenge!',
    timestamp: '2024-01-17 10:15 AM',
    unread: false,
  },
  {
    id: '3',
    mentee: 'John Doe',
    lastMessage: 'Can you help me with my focus issues?',
    timestamp: '2024-01-16 4:00 PM',
    unread: false,
  },
  {
    id: '4',
    mentee: 'Emma Wilson',
    lastMessage: 'Great advice on the focus strategy',
    timestamp: '2024-01-15 3:45 PM',
    unread: false,
  },
];

const mockMessages: Message[] = [
  { id: '1', sender: 'mentee', text: 'Hi coach, how are you?', timestamp: '2024-01-17 1:00 PM' },
  { id: '2', sender: 'coach', text: 'I\'m doing great! How can I help you today?', timestamp: '2024-01-17 1:05 PM' },
  { id: '3', sender: 'mentee', text: 'I\'ve been struggling with my focus lately', timestamp: '2024-01-17 1:10 PM' },
  { id: '4', sender: 'coach', text: 'Let\'s work on improving your focus strategy', timestamp: '2024-01-17 1:15 PM' },
  { id: '5', sender: 'coach', text: 'Try starting with 25-minute focus sessions', timestamp: '2024-01-17 1:16 PM' },
  { id: '6', sender: 'mentee', text: 'Thanks for the guidance! I will focus more on deep work.', timestamp: '2024-01-17 2:30 PM' },
];

export default function Messages() {
  const [selectedConversation, setSelectedConversation] = useState('1');
  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [conversations, setConversations] = useState(mockConversations);

  const filteredConversations = conversations.filter(c =>
    c.mentee.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (messageText.trim()) {
      toast.success('Message sent!');
      setMessageText('');
    }
  };

  return (
    <div className="min-h-screen bg-white py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <MessageSquare className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Messages</h1>
          </div>
          <p className="text-lg text-muted-foreground">Connect with your mentees</p>
        </div>

        {/* Messages Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Conversations Sidebar */}
          <div className="lg:col-span-1 flex flex-col rounded-3xl border border-border/50 shadow-sm overflow-hidden">
            {/* Search */}
            <div className="p-4 border-b border-border/50">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search mentees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-lg py-2 h-9"
                />
              </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation.id)}
                  className={`w-full text-left p-4 border-b border-border/50 hover:bg-muted/50 transition-colors ${
                    selectedConversation === conversation.id ? 'bg-muted/70' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <p className="font-semibold text-foreground">{conversation.mentee}</p>
                    {conversation.unread && (
                      <div className="w-2 h-2 bg-primary rounded-full" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                  <p className="text-xs text-muted-foreground mt-1">{conversation.timestamp}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2 flex flex-col rounded-3xl border border-border/50 shadow-sm overflow-hidden">
            {/* Chat Header */}
            <div className="p-4 border-b border-border/50 bg-muted/20">
              <p className="font-semibold text-foreground">
                {conversations.find(c => c.id === selectedConversation)?.mentee || 'Select a conversation'}
              </p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {mockMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'coach' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs rounded-2xl px-4 py-2 ${
                      msg.sender === 'coach'
                        ? 'bg-primary text-white rounded-br-none'
                        : 'bg-muted rounded-bl-none'
                    }`}
                  >
                    <p className={msg.sender === 'coach' ? 'text-white' : 'text-foreground'}>{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.sender === 'coach' ? 'text-white/70' : 'text-muted-foreground'}`}>
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-border/50 bg-muted/20">
              <div className="flex gap-3">
                <Input
                  placeholder="Type your message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className="rounded-full py-2 h-10"
                />
                <Button
                  onClick={handleSendMessage}
                  className="rounded-full px-4 gap-2"
                  size="sm"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
