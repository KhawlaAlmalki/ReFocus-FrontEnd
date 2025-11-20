import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { ArrowRight, ChevronLeft } from 'lucide-react';

export interface SurveyAnswers {
  mainGoal: string;
  desiredHoursPerDay: string;
  currentHoursPerDay: number;
  distractions: string[];
  loseFocusWhen: string;
  productivityStyle: string;
  upcomingEvents: boolean;
  motivationStyle: string;
  statsVisibility: string;
  consistency: number;
}


export default function KickoffSurvey() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<SurveyAnswers>({
    mainGoal: '',
    desiredHoursPerDay: '',
    currentHoursPerDay: 0,
    distractions: [],
    loseFocusWhen: '',
    productivityStyle: '',
    upcomingEvents: false,
    motivationStyle: '',
    statsVisibility: '',
    consistency: 3,
  });

  const totalQuestions = 10;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSkip = () => {
    navigate('/app/dashboard');
  };

  const handleComplete = () => {
    localStorage.setItem('kickoffSurveyAnswers', JSON.stringify(answers));
    toast.success('Survey completed! Welcome to ReFocus!');
    navigate('/app/dashboard');
  };

  const handleDistractionsChange = (distraction: string) => {
    setAnswers((prev) => {
      const current = prev.distractions;
      if (current.includes(distraction)) {
        return {
          ...prev,
          distractions: current.filter((d) => d !== distraction),
        };
      } else if (current.length < 3) {
        return {
          ...prev,
          distractions: [...current, distraction],
        };
      }
      return prev;
    });
  };

  const isCurrentQuestionAnswered = (): boolean => {
    switch (currentQuestion) {
      case 0:
        return answers.mainGoal !== '';
      case 1:
        return answers.desiredHoursPerDay !== '';
      case 2:
        return answers.currentHoursPerDay > 0 || answers.currentHoursPerDay === 0;
      case 3:
        return answers.distractions.length > 0;
      case 4:
        return answers.loseFocusWhen !== '';
      case 5:
        return answers.productivityStyle !== '';
      case 6:
        return true;
      case 7:
        return answers.motivationStyle !== '';
      case 8:
        return answers.statsVisibility !== '';
      case 9:
        return answers.consistency > 0;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-8 max-w-2xl">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-secondary font-semibold tracking-wide mb-2 uppercase text-sm">
                Welcome to ReFocus
              </p>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Kickoff Survey
              </h1>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground font-medium">
                {currentQuestion + 1} of {totalQuestions}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <Progress value={progress} className="h-2 mb-6" />
          <p className="text-sm text-muted-foreground">
            Help us customize your experience. Skip anytime to get started.
          </p>
        </div>

        {/* Question Card */}
        <Card className="border-0 shadow-md mb-8">
          <CardContent className="p-8 md:p-10">
            {/* Question 1: Main Goal */}
            {currentQuestion === 0 && (
              <div className="space-y-6">
                <h2 className="text-xl md:text-2xl font-bold text-foreground">
                  What is your main focus goal?
                </h2>
                <RadioGroup value={answers.mainGoal} onValueChange={(value) => setAnswers({ ...answers, mainGoal: value })}>
                  <div className="space-y-3">
                    {[
                      { value: 'study', label: 'Study consistently' },
                      { value: 'screen-time', label: 'Reduce screen time' },
                      { value: 'deep-work', label: 'Deep work for career' },
                      { value: 'exams', label: 'Prepare for exams' },
                      { value: 'habit-streaks', label: 'Improve habit streaks' },
                      { value: 'other', label: 'Other' },
                    ].map((option) => (
                      <div key={option.value} className="flex items-center space-x-3">
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label htmlFor={option.value} className="cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            )}

            {/* Question 2: Desired Hours */}
            {currentQuestion === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl md:text-2xl font-bold text-foreground">
                  How many hours per day do you WANT to focus?
                </h2>
                <RadioGroup value={answers.desiredHoursPerDay} onValueChange={(value) => setAnswers({ ...answers, desiredHoursPerDay: value })}>
                  <div className="space-y-3">
                    {[
                      { value: 'under-1', label: '< 1 hour' },
                      { value: '1-2', label: '1–2 hours' },
                      { value: '2-4', label: '2–4 hours' },
                      { value: '4plus', label: '4+ hours' },
                    ].map((option) => (
                      <div key={option.value} className="flex items-center space-x-3">
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label htmlFor={option.value} className="cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            )}

            {/* Question 3: Current Hours */}
            {currentQuestion === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl md:text-2xl font-bold text-foreground">
                  How many hours per day do you CURRENTLY focus?
                </h2>
                <RadioGroup value={String(answers.currentHoursPerDay)} onValueChange={(value) => setAnswers({ ...answers, currentHoursPerDay: parseInt(value) })}>
                  <div className="space-y-3">
                    {[
                      { value: '0', label: '0 hours' },
                      { value: '1', label: '1 hour' },
                      { value: '2', label: '2 hours' },
                      { value: '3', label: '3 hours' },
                      { value: '4', label: '4+ hours' },
                    ].map((option) => (
                      <div key={option.value} className="flex items-center space-x-3">
                        <RadioGroupItem value={option.value} id={`current-${option.value}`} />
                        <Label htmlFor={`current-${option.value}`} className="cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            )}

            {/* Question 4: Distractions */}
            {currentQuestion === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl md:text-2xl font-bold text-foreground">
                  What distracts you the most?
                  <span className="block text-sm text-muted-foreground font-normal mt-2">
                    Choose up to 3
                  </span>
                </h2>
                <div className="space-y-3">
                  {[
                    { value: 'social-media', label: 'Social media' },
                    { value: 'notifications', label: 'Notifications' },
                    { value: 'messages', label: 'Messages' },
                    { value: 'noise', label: 'Noise' },
                    { value: 'procrastination', label: 'Procrastination' },
                    { value: 'multitasking', label: 'Multitasking' },
                    { value: 'overwhelmed', label: 'Feeling overwhelmed' },
                  ].map((option) => (
                    <div key={option.value} className="flex items-center space-x-3">
                      <Checkbox
                        id={option.value}
                        checked={answers.distractions.includes(option.value)}
                        onCheckedChange={() => handleDistractionsChange(option.value)}
                        disabled={answers.distractions.length === 3 && !answers.distractions.includes(option.value)}
                      />
                      <Label htmlFor={option.value} className="cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                  {answers.distractions.length > 0 && (
                    <p className="text-sm text-muted-foreground mt-4">
                      Selected: {answers.distractions.length}/3
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Question 5: Lose Focus When */}
            {currentQuestion === 4 && (
              <div className="space-y-6">
                <h2 className="text-xl md:text-2xl font-bold text-foreground">
                  When do you lose focus the MOST?
                </h2>
                <RadioGroup value={answers.loseFocusWhen} onValueChange={(value) => setAnswers({ ...answers, loseFocusWhen: value })}>
                  <div className="space-y-3">
                    {[
                      { value: 'within-10', label: 'Within 10 minutes' },
                      { value: '20-30', label: 'After 20–30 min' },
                      { value: 'mid-session', label: 'Mid-session' },
                      { value: 'late-night', label: 'Late at night' },
                      { value: 'randomly', label: 'Randomly' },
                    ].map((option) => (
                      <div key={option.value} className="flex items-center space-x-3">
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label htmlFor={option.value} className="cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            )}

            {/* Question 6: Productivity Style */}
            {currentQuestion === 5 && (
              <div className="space-y-6">
                <h2 className="text-xl md:text-2xl font-bold text-foreground">
                  Which productivity style fits you best?
                </h2>
                <RadioGroup value={answers.productivityStyle} onValueChange={(value) => setAnswers({ ...answers, productivityStyle: value })}>
                  <div className="space-y-3">
                    {[
                      { value: 'pomodoro', label: 'Short Pomodoro sessions' },
                      { value: 'deep-work', label: 'Long deep-work blocks' },
                      { value: 'flexible', label: 'Flexible/whenever' },
                      { value: 'not-sure', label: "I'm not sure yet" },
                    ].map((option) => (
                      <div key={option.value} className="flex items-center space-x-3">
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label htmlFor={option.value} className="cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            )}

            {/* Question 7: Upcoming Events */}
            {currentQuestion === 6 && (
              <div className="space-y-6">
                <h2 className="text-xl md:text-2xl font-bold text-foreground">
                  Are you planning for any upcoming important events?
                </h2>
                <RadioGroup
                  value={answers.upcomingEvents ? 'yes' : 'no'}
                  onValueChange={(value) => setAnswers({ ...answers, upcomingEvents: value === 'yes' })}
                >
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="yes" id="events-yes" />
                      <Label htmlFor="events-yes" className="cursor-pointer">
                        Yes, I have exams, projects, or deadlines soon
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="no" id="events-no" />
                      <Label htmlFor="events-no" className="cursor-pointer">
                        No, nothing major soon
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            )}

            {/* Question 8: Motivation Style */}
            {currentQuestion === 7 && (
              <div className="space-y-6">
                <h2 className="text-xl md:text-2xl font-bold text-foreground">
                  How do you prefer to be motivated?
                </h2>
                <RadioGroup value={answers.motivationStyle} onValueChange={(value) => setAnswers({ ...answers, motivationStyle: value })}>
                  <div className="space-y-3">
                    {[
                      { value: 'streaks', label: 'Streaks & badges' },
                      { value: 'messages', label: 'Encouraging messages' },
                      { value: 'competition', label: 'Competition & leaderboards' },
                      { value: 'analytics', label: 'Analytics & stats' },
                      { value: 'accountability', label: 'Accountability partners' },
                    ].map((option) => (
                      <div key={option.value} className="flex items-center space-x-3">
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label htmlFor={option.value} className="cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            )}

            {/* Question 9: Stats Visibility */}
            {currentQuestion === 8 && (
              <div className="space-y-6">
                <h2 className="text-xl md:text-2xl font-bold text-foreground">
                  Do you want your stats visible to friends?
                </h2>
                <RadioGroup value={answers.statsVisibility} onValueChange={(value) => setAnswers({ ...answers, statsVisibility: value })}>
                  <div className="space-y-3">
                    {[
                      { value: 'yes', label: 'Yes' },
                      { value: 'selected', label: 'Only to selected friends' },
                      { value: 'no', label: 'No' },
                    ].map((option) => (
                      <div key={option.value} className="flex items-center space-x-3">
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label htmlFor={option.value} className="cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            )}

            {/* Question 10: Consistency */}
            {currentQuestion === 9 && (
              <div className="space-y-6">
                <h2 className="text-xl md:text-2xl font-bold text-foreground">
                  How consistent are you right now?
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setAnswers({ ...answers, consistency: rating })}
                        className={`w-14 h-14 rounded-lg font-semibold transition-all ${
                          answers.consistency === rating
                            ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                      >
                        {rating}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-4">
                    <span>Not consistent</span>
                    <span>Very consistent</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentQuestion === 0}
            className="gap-2"
          >
            <ChevronLeft size={18} />
            Back
          </Button>

          <Button variant="ghost" onClick={handleSkip} className="text-muted-foreground">
            Skip Survey
          </Button>

          <Button
            onClick={handleNext}
            disabled={!isCurrentQuestionAnswered()}
            className="gap-2"
          >
            {currentQuestion === totalQuestions - 1 ? (
              <>
                Complete <ArrowRight size={18} />
              </>
            ) : (
              <>
                Next <ArrowRight size={18} />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
