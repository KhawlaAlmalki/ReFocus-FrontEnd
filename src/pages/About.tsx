import { Card, CardContent } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl text-center">
          <h1 className="text-6xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
            About ReFocus
          </h1>
          <p className="text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed font-light">
            We're on a mission to help you reclaim your focus and unlock your true potential 
            in a world full of digital distractions.
          </p>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h2 className="text-5xl font-bold text-foreground mb-6">The Digital Fatigue Crisis</h2>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                The average person loses over 2 hours per day to digital distractions. We're constantly 
                juggling notifications, social media, and an endless stream of information. This constant 
                distraction is eroding our ability to focus, think deeply, and accomplish meaningful work.
              </p>
              <p>
                Students struggle to concentrate on their studies. Young professionals find it hard to 
                deliver their best work. Even coaches and mentors need tools to help their mentees develop 
                focus skills.
              </p>
              <p>
                ReFocus was born from this realization: we need a platform that doesn't just help us 
                track time, but actually coaches us towards better focus habits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Solution */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-foreground mb-4">Our Solution</h2>
            <p className="text-xl text-muted-foreground">Three pillars of our platform</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                emoji: '🎯',
                title: 'Personalized Coaching',
                description: 'Get guidance tailored to your specific challenges and goals.',
              },
              {
                emoji: '⏱️',
                title: 'Smart Focus Sessions',
                description: 'Built-in timers and distraction tracking to keep you on track.',
              },
              {
                emoji: '📊',
                title: 'Progress Insights',
                description: 'Detailed analytics to understand your focus patterns and growth.',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="group cursor-pointer rounded-3xl bg-white border border-border/50 p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 text-center"
              >
                <div className="text-6xl mb-4 transition-transform duration-300 group-hover:scale-125">
                  {item.emoji}
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-foreground mb-8 text-center">Our Team</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            ReFocus was built by a team of educators, technologists, and focus enthusiasts who understand 
            the challenges of maintaining deep work in the digital age. We're committed to creating a 
            platform that genuinely helps people reclaim their focus and achieve their best work.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed mt-6">
            Every feature in ReFocus is designed with input from users like you. We're constantly listening 
            and improving based on your feedback.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="rounded-3xl bg-white border border-border/50 p-8 md:p-12 shadow-sm">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-b border-border/50">
                <AccordionTrigger className="text-lg font-semibold text-foreground hover:text-primary transition-colors py-4">
                  Is ReFocus free?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  Yes! ReFocus is completely free to get started. We offer a free tier with all essential
                  features for individuals. Premium features and team management are available through our
                  subscription plans.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border-b border-border/50">
                <AccordionTrigger className="text-lg font-semibold text-foreground hover:text-primary transition-colors py-4">
                  How do focus sessions work?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  Focus sessions are timed blocks where you dedicate yourself to a specific task. You can
                  choose the duration (25, 45, or 60 minutes) and the focus category. ReFocus tracks your
                  session and helps you stay accountable.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border-b border-border/50">
                <AccordionTrigger className="text-lg font-semibold text-foreground hover:text-primary transition-colors py-4">
                  Can I join challenges?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  Absolutely! We offer various challenges like "7-Day Consistency" and "No Social Media after
                  10PM". These are designed to help build focus habits over time. You can join, leave, and
                  track your progress.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border-b border-border/50">
                <AccordionTrigger className="text-lg font-semibold text-foreground hover:text-primary transition-colors py-4">
                  How do coaches use ReFocus?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  Coaches can create accounts and manage mentees. They can assign challenges, track progress,
                  and provide guidance through the platform. ReFocus gives coaches visibility into their
                  mentees' focus journeys.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border-b border-border/50">
                <AccordionTrigger className="text-lg font-semibold text-foreground hover:text-primary transition-colors py-4">
                  Is my data private?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  Yes, we take privacy seriously. Your focus data and personal information are private and
                  never shared without your consent. Coaches only see the data you explicitly share with them.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="border-b border-border/50">
                <AccordionTrigger className="text-lg font-semibold text-foreground hover:text-primary transition-colors py-4">
                  Can I export my data?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  Yes. You can export your session logs and progress reports at any time. We believe your
                  data belongs to you.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7" className="border-b border-border/50">
                <AccordionTrigger className="text-lg font-semibold text-foreground hover:text-primary transition-colors py-4">
                  Do you have a mobile app?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  ReFocus is fully responsive and works great on mobile devices. A dedicated mobile app is
                  coming soon!
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-8">
                <AccordionTrigger className="text-lg font-semibold text-foreground hover:text-primary transition-colors py-4">
                  How can I get help?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  You can reach our support team at support@refocus.com. We also have documentation and
                  tutorials on our website. If you have a coach, they can provide personalized guidance.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-foreground mb-6">Ready to get started?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of people who are reclaiming their focus with ReFocus.
          </p>
          <Link to="/signup">
            <Button size="lg" className="rounded-full px-8 py-6 text-base font-semibold transition-all duration-300 hover:scale-105">
              Start Your Journey
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
