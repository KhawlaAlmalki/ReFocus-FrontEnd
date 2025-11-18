import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Settings, Mail, Globe, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function CoachSettings() {
  const [settings, setSettings] = useState({
    name: 'Ahmed Hassan',
    email: 'ahmed@example.com',
    bio: 'Certified productivity coach specializing in student success.',
    specialization: 'Academic Focus, Time Management',
    calendlyUrl: 'https://calendly.com/ahmedhasan',
    maxMentees: '10',
    yearsExperience: '5',
  });

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(settings);

  const handleSave = () => {
    setSettings(formData);
    setEditMode(false);
    toast.success('Settings updated successfully!');
  };

  const handleCancel = () => {
    setFormData(settings);
    setEditMode(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="min-h-screen bg-white py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Settings className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground">Coach Settings</h1>
                <p className="text-lg text-muted-foreground">Manage your profile and preferences</p>
              </div>
            </div>
            {!editMode && (
              <Button
                onClick={() => setEditMode(true)}
                className="rounded-full gap-2"
              >
                Edit Settings
              </Button>
            )}
          </div>
        </div>

        {/* Profile Information */}
        <Card className="rounded-3xl border border-border/50 shadow-sm mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>Profile Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {editMode ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Full Name</label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Email</label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary outline-none transition-colors h-24"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Specialization</label>
                  <Input
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    placeholder="e.g., Academic Focus, Time Management"
                    className="rounded-xl"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide mb-1">Name</p>
                  <p className="text-lg font-semibold text-foreground">{settings.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide mb-1">Email</p>
                  <p className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" />
                    {settings.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide mb-1">Bio</p>
                  <p className="text-lg text-foreground">{settings.bio}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide mb-1">Specialization</p>
                  <div className="flex flex-wrap gap-2">
                    {settings.specialization.split(',').map((spec, i) => (
                      <Badge key={i} variant="outline" className="bg-blue-50">
                        {spec.trim()}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Coaching Preferences */}
        <Card className="rounded-3xl border border-border/50 shadow-sm mb-8">
          <CardHeader>
            <CardTitle>Coaching Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {editMode ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Calendly URL (Scheduling Link)</label>
                  <Input
                    name="calendlyUrl"
                    value={formData.calendlyUrl}
                    onChange={handleChange}
                    placeholder="https://calendly.com/yourname"
                    className="rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Maximum Mentees</label>
                    <Input
                      name="maxMentees"
                      type="number"
                      value={formData.maxMentees}
                      onChange={handleChange}
                      className="rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Years of Experience</label>
                    <Input
                      name="yearsExperience"
                      type="number"
                      value={formData.yearsExperience}
                      onChange={handleChange}
                      className="rounded-xl"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide mb-1">Scheduling Link</p>
                  <p className="text-lg font-semibold text-primary flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <a href={settings.calendlyUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {settings.calendlyUrl}
                    </a>
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide mb-1">Maximum Mentees</p>
                    <p className="text-lg font-semibold text-foreground">{settings.maxMentees}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide mb-1">Experience</p>
                    <p className="text-lg font-semibold text-foreground">{settings.yearsExperience} years</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Statistics */}
        <Card className="rounded-3xl border border-border/50 shadow-sm mb-8">
          <CardHeader>
            <CardTitle>Coaching Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border border-primary/20">
                <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide mb-2">Active Mentees</p>
                <p className="text-4xl font-bold text-primary">6</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-success/10 to-success/5 rounded-2xl border border-success/20">
                <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide mb-2">Total Mentees</p>
                <p className="text-4xl font-bold text-success">15</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-2xl border border-secondary/20">
                <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide mb-2">Avg Rating</p>
                <p className="text-4xl font-bold text-secondary">4.8⭐</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="rounded-3xl border border-destructive/20 bg-destructive/5 shadow-sm">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              These actions are irreversible. Please proceed with caution.
            </p>
            <div className="flex flex-col md:flex-row gap-4">
              <Button variant="outline" className="rounded-full flex-1">
                Deactivate Account
              </Button>
              <Button variant="destructive" className="rounded-full flex-1">
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        {editMode && (
          <div className="mt-8 flex gap-4">
            <Button
              onClick={handleSave}
              className="flex-1 rounded-full py-3 gap-2 bg-primary hover:bg-primary/90"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              className="flex-1 rounded-full py-3"
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
