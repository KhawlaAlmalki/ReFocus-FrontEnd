import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { authService } from '@/lib/services';
import { Loader2, User as UserIcon, Mail, Target } from 'lucide-react';
import { toAppError, getValidationErrors } from '@/lib/errors';
import { showError, showSuccess } from '@/lib/notify';

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [goal, setGoal] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await authService.getCurrentUser();

      // Safe property access with optional chaining
      setName(response?.user?.name || '');
      setEmail(response?.user?.email || '');
      setGoal(response?.user?.goal || '');
    } catch (error) {
      const appError = toAppError(error);
      showError(appError);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!name) newErrors.name = 'Name is required';
    if (!email) newErrors.email = 'Email is required';
    if (goal && goal.length > 200) newErrors.goal = 'Goal must not exceed 200 characters';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    try {
      setSaving(true);
      await authService.updateProfile({ name, email, goal });
      showSuccess('Profile updated successfully!');
    } catch (error) {
      const appError = toAppError(error);

      // Show error toast
      showError(appError);

      // Extract validation errors if present
      const validationErrors = getValidationErrors(error);
      if (validationErrors) {
        setErrors(validationErrors);
      } else {
        setErrors({ email: appError.message });
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-3xl font-bold text-foreground mb-8">Account Settings</h1>

        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold flex items-center gap-2">
                  <UserIcon className="w-4 h-4" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                  className={`rounded-xl py-3 px-4 transition-all duration-200 ${
                    errors.name
                      ? 'border-destructive bg-destructive/5'
                      : 'hover:border-primary/30 focus:border-primary'
                  }`}
                />
                {errors.name && (
                  <p className="text-destructive text-sm font-medium">{errors.name}</p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  className={`rounded-xl py-3 px-4 transition-all duration-200 ${
                    errors.email
                      ? 'border-destructive bg-destructive/5'
                      : 'hover:border-primary/30 focus:border-primary'
                  }`}
                />
                {errors.email && (
                  <p className="text-destructive text-sm font-medium">{errors.email}</p>
                )}
              </div>

              {/* Goal Field */}
              <div className="space-y-2">
                <Label htmlFor="goal" className="text-sm font-semibold flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Your Focus Goal
                </Label>
                <Textarea
                  id="goal"
                  placeholder="e.g., Study 2 hours daily for better grades"
                  value={goal}
                  onChange={(e) => {
                    setGoal(e.target.value);
                    if (errors.goal) setErrors({ ...errors, goal: '' });
                  }}
                  className={`rounded-xl py-3 px-4 transition-all duration-200 min-h-[100px] ${
                    errors.goal
                      ? 'border-destructive bg-destructive/5'
                      : 'hover:border-primary/30 focus:border-primary'
                  }`}
                  maxLength={200}
                />
                <div className="flex items-center justify-between">
                  {errors.goal ? (
                    <p className="text-destructive text-sm font-medium">{errors.goal}</p>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      {goal.length}/200 characters
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={saving}
                className="w-full rounded-full py-3 text-base font-semibold transition-all duration-300 hover:scale-105"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
