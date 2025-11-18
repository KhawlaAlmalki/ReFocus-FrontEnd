import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { PlayCircle, PauseCircle, RotateCcw, CheckCircle, Zap } from 'lucide-react';
import { toast } from 'sonner';

type FocusCategory = 'Study' | 'Work' | 'Reading' | 'Deep Work';
type SessionState = 'idle' | 'running' | 'paused' | 'completed';

export default function Session() {
  const navigate = useNavigate();
  const [sessionDuration, setSessionDuration] = useState(25);
  const [category, setCategory] = useState<FocusCategory>('Study');
  const [sessionState, setSessionState] = useState<SessionState>('idle');
  const [timeRemaining, setTimeRemaining] = useState(25 * 60);
  const [sessionStarted, setSessionStarted] = useState(false);

  const minutesRemaining = Math.floor(timeRemaining / 60);
  const secondsRemaining = timeRemaining % 60;
  const progressPercent = ((sessionDuration * 60 - timeRemaining) / (sessionDuration * 60)) * 100;

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (sessionState === 'running' && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setSessionState('completed');
            toast.success('Focus session completed! Great work! 🎉');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [sessionState, timeRemaining]);

  const handleStart = () => {
    if (!sessionStarted) {
      setSessionStarted(true);
      setTimeRemaining(sessionDuration * 60);
    }
    setSessionState('running');
  };

  const handlePause = () => {
    setSessionState('paused');
  };

  const handleResume = () => {
    setSessionState('running');
  };

  const handleReset = () => {
    setSessionState('idle');
    setSessionStarted(false);
    setTimeRemaining(sessionDuration * 60);
  };

  const handleEndSession = () => {
    setSessionState('completed');
    toast.success('Session ended. You did great! 💪');
  };

  const handleSaveSession = () => {
    const focusedMinutes = sessionDuration - minutesRemaining;
    toast.success(`Session saved! You focused for ${focusedMinutes} minutes.`);
    setTimeout(() => navigate('/app/dashboard'), 1500);
  };

  const handleDurationChange = (duration: string) => {
    const newDuration = parseInt(duration);
    setSessionDuration(newDuration);
    if (!sessionStarted) {
      setTimeRemaining(newDuration * 60);
    }
  };

  const getCategoryColor = (cat: FocusCategory) => {
    const colors: { [key: string]: string } = {
      Study: 'bg-blue-100 text-blue-800',
      'Deep Work': 'bg-purple-100 text-purple-800',
      Reading: 'bg-green-100 text-green-800',
      Work: 'bg-orange-100 text-orange-800',
    };
    return colors[cat] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-muted py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-foreground mb-8">Focus Session</h1>

        {/* Main Timer Card */}
        <div className="flex flex-col items-center mb-8">
          <Card className="w-full max-w-md bg-gradient-to-br from-blue-50 to-green-50 border-primary/20 shadow-lg">
            <CardContent className="p-8">
              {/* Timer Display */}
              <div className="relative flex flex-col items-center justify-center mb-8">
                <div className="relative w-64 h-64 flex items-center justify-center mb-4">
                  {/* Progress Ring Background */}
                  <svg className="absolute w-64 h-64 -rotate-90" viewBox="0 0 256 256">
                    <circle
                      cx="128"
                      cy="128"
                      r="120"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-muted"
                    />
                    <circle
                      cx="128"
                      cy="128"
                      r="120"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeDasharray={`${(progressPercent / 100) * 753.98} 753.98`}
                      className="text-primary transition-all duration-500"
                    />
                  </svg>

                  {/* Timer Text */}
                  <div className="text-center z-10">
                    <div className="text-6xl font-bold text-foreground font-mono">
                      {String(minutesRemaining).padStart(2, '0')}:
                      {String(secondsRemaining).padStart(2, '0')}
                    </div>
                    <p className="text-muted-foreground text-sm mt-2">
                      {sessionState === 'idle' && !sessionStarted && 'Ready to focus?'}
                      {sessionState === 'running' && 'Keep focusing!'}
                      {sessionState === 'paused' && 'Paused'}
                      {sessionState === 'completed' && 'Completed!'}
                    </p>
                  </div>
                </div>

                {/* Category Badge */}
                <Badge className={getCategoryColor(category)}>
                  {category}
                </Badge>
              </div>

              {/* Duration and Category Selectors */}
              <div className="space-y-4 mb-8">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Session Duration
                  </label>
                  <Select value={String(sessionDuration)} onValueChange={handleDurationChange} disabled={sessionStarted}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="25">25 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Focus Category
                  </label>
                  <Select value={category} onValueChange={(value) => setCategory(value as FocusCategory)} disabled={sessionStarted}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Study">Study</SelectItem>
                      <SelectItem value="Work">Work</SelectItem>
                      <SelectItem value="Reading">Reading</SelectItem>
                      <SelectItem value="Deep Work">Deep Work</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  {sessionState === 'idle' && !sessionStarted && (
                    <Button onClick={handleStart} className="col-span-2 gap-2 bg-primary hover:bg-primary/90">
                      <PlayCircle size={20} />
                      Start Session
                    </Button>
                  )}

                  {sessionState === 'running' && (
                    <>
                      <Button onClick={handlePause} variant="outline" className="gap-2">
                        <PauseCircle size={20} />
                        Pause
                      </Button>
                      <Button onClick={handleEndSession} variant="destructive" className="gap-2">
                        End
                      </Button>
                    </>
                  )}

                  {sessionState === 'paused' && (
                    <>
                      <Button onClick={handleResume} className="gap-2 bg-primary hover:bg-primary/90">
                        <PlayCircle size={20} />
                        Resume
                      </Button>
                      <Button onClick={handleEndSession} variant="destructive" className="gap-2">
                        End
                      </Button>
                    </>
                  )}
                </div>

                <Button onClick={handleReset} variant="outline" className="w-full gap-2">
                  <RotateCcw size={20} />
                  Reset
                </Button>

                {sessionState === 'completed' && (
                  <Button onClick={handleSaveSession} className="w-full gap-2 bg-success hover:bg-success/90">
                    <CheckCircle size={20} />
                    Save Session & Back to Dashboard
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tips and Status Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* Tips Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Focus Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                  1
                </div>
                <p className="text-sm text-muted-foreground">
                  Silence your phone and close unnecessary tabs
                </p>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                  2
                </div>
                <p className="text-sm text-muted-foreground">
                  Set a clear goal for what you want to accomplish
                </p>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                  3
                </div>
                <p className="text-sm text-muted-foreground">
                  Take a break after your session to recharge
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Today's Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Total Focused Time</p>
                <p className="text-3xl font-bold text-primary">65 min</p>
                <p className="text-xs text-muted-foreground mt-1">of 120 min goal</p>
              </div>
              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground mb-2">Sessions Today</p>
                <p className="text-3xl font-bold text-secondary">2</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
