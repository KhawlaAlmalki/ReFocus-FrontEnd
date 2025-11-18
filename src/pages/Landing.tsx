import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, CheckCircle2, Zap, Target, Trophy } from 'lucide-react';
import { useState } from 'react';

export default function Landing() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20 bg-gradient-to-br from-[#0c3d5c] to-[#2d7a99] overflow-hidden">
        {/* Decorative gradient elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl text-center">
          <div className="inline-block mb-6 px-4 py-2 bg-white/10 rounded-full border border-white/20 backdrop-blur-sm">
            <p className="text-sm font-semibold text-white/90">Welcome to digital wellness</p>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
            ReFocus
          </h1>

          <p className="text-2xl md:text-3xl text-white/80 mb-4 font-light">
            Clear the Clutter.
            <span className="block text-white/95 font-semibold">Keep the Genius.</span>
          </p>

          <p className="text-lg text-white/75 mb-12 max-w-2xl mx-auto leading-relaxed">
            Reclaim your focus and productivity. Overcome digital distractions with personalized
            coaching, guided focus sessions, and smart progress tracking.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/signup">
              <Button
                size="lg"
                className="rounded-full px-8 py-6 text-base font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl bg-white text-primary hover:bg-white/90"
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/login">
              <Button
                size="lg"
                className="rounded-full px-8 py-6 text-base font-semibold transition-all duration-300 hover:scale-105 bg-white/20 text-white border border-white/30 hover:bg-white/30 backdrop-blur-sm"
              >
                Log In
              </Button>
            </Link>
          </div>

          <p className="text-sm text-white/70">Free to start. No credit card required.</p>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-foreground mb-4">How it works</h2>
            <p className="text-xl text-muted-foreground">Three simple steps to reclaim your focus</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                number: '1',
                title: 'Set Your Goal',
                description: 'Define your focus goals and daily targets. Our smart system learns your patterns.',
                icon: Target,
              },
              {
                number: '2',
                title: 'Focus Sessions',
                description: 'Use guided focus sessions with built-in timers and distraction tracking.',
                icon: Zap,
              },
              {
                number: '3',
                title: 'Track Progress',
                description: 'Monitor your streaks, earned badges, and personalized insights.',
                icon: Trophy,
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="relative group cursor-pointer transition-all duration-300 hover:scale-105"
                  onMouseEnter={() => setHoveredFeature(i)}
                  onMouseLeave={() => setHoveredFeature(null)}
                >
                  <div className="p-8 rounded-3xl bg-gradient-to-br from-white to-muted/30 border border-border/50 backdrop-blur-sm shadow-md hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                        {item.number}
                      </div>
                      <Icon className="w-6 h-6 text-primary transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-3">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-foreground mb-4">Powerful features</h2>
            <p className="text-xl text-muted-foreground">Everything you need to focus better</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { title: 'Focus Timer', description: 'Customizable sessions with pause/resume controls' },
              { title: 'Challenges', description: 'Join challenges and compete with peers' },
              { title: 'Progress Tracking', description: 'Detailed analytics on your focus streaks' },
              { title: 'Mentorship', description: 'Connect with coaches for guidance' },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary/20 group cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1 transition-transform duration-300 group-hover:scale-110" />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who Is It For Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-foreground mb-4">Who is it for?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { emoji: '📚', title: 'Students', description: 'Boost your study sessions and academic performance' },
              { emoji: '💼', title: 'Young Professionals', description: 'Master deep work and increase productivity' },
              { emoji: '🎯', title: 'Coaches', description: 'Guide mentees and track their progress' },
            ].map((item, i) => (
              <div
                key={i}
                className="text-center p-8 rounded-3xl bg-white border border-border/50 shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer hover:scale-105"
              >
                <div className="text-6xl mb-4 transition-transform duration-300 group-hover:scale-125">{item.emoji}</div>
                <h3 className="text-2xl font-bold text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-secondary p-16 md:p-24 text-white">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -ml-48 -mb-48" />

            <div className="relative z-10 text-center">
              <h2 className="text-5xl font-bold mb-6">Ready to reclaim your focus?</h2>
              <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                Join thousands of students and professionals who are taking control of their time.
              </p>
              <Link to="/signup">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 rounded-full px-8 py-6 text-base font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  Get Started Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
