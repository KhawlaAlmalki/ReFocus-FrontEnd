export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-8 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Privacy Policy
        </h1>
        <p className="text-muted-foreground mb-8">Last updated: January 2024</p>

        <div className="prose prose-invert max-w-none space-y-6 text-foreground">
          <p>
            ReFocus ("we", "our", or "us") is a digital-wellness and
            productivity application designed to help you build better focus
            habits, track your progress, and engage with a positive community.
          </p>

          <p>
            Your privacy is extremely important to us. This Privacy Policy
            explains how we collect, use, and protect your information when you
            use ReFocus.
          </p>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              1. Information We Collect
            </h2>

            <div className="space-y-4 ml-4">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  1.1. Information You Provide
                </h3>
                <p className="text-muted-foreground mb-2">
                  We may collect information that you voluntarily submit when
                  using the app, such as:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Account information (name, email, username, password)</li>
                  <li>Profile details (profile picture, bio, interests)</li>
                  <li>
                    Connections &amp; friends (mutual friends, pending
                    connections)
                  </li>
                  <li>
                    Focus session data (duration, timestamps, session type,
                    streak count)
                  </li>
                  <li>Achievements or challenges joined</li>
                  <li>Feedback or support messages</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  1.2. Automatically Collected Data
                </h3>
                <p className="text-muted-foreground mb-2">
                  When you use ReFocus, we may automatically collect:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>
                    Usage data (pages visited, buttons clicked, time in app)
                  </li>
                  <li>
                    Device information (browser type, device type, operating
                    system)
                  </li>
                  <li>
                    Log data (IP address, approximate location, errors,
                    performance logs)
                  </li>
                  <li>
                    Cookies or local storage data (preferences, theme mode,
                    session state)
                  </li>
                </ul>
                <p className="text-muted-foreground mt-3">
                  We do not collect precise GPS location.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  1.3. Optional Data
                </h3>
                <p className="text-muted-foreground">We may ask to collect:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Focus productivity stats</li>
                  <li>Friends list (if you enable social features)</li>
                  <li>Notifications preferences</li>
                </ul>
                <p className="text-muted-foreground mt-3">
                  You can disable these at any time.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              2. How We Use Your Information
            </h2>
            <p className="text-muted-foreground">We use your data to:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Enable you to create and manage an account</li>
              <li>Display your focus statistics, streaks, and history</li>
              <li>Show you personalized leaderboards</li>
              <li>Match you with friends or mutual connections</li>
              <li>Improve app functionality and user experience</li>
              <li>Provide customer support</li>
              <li>Prevent fraud, abuse, or suspicious activity</li>
              <li>
                Analyze trends and app performance (e.g., feature usage, time
                spent on app)
              </li>
            </ul>
            <p className="text-muted-foreground mt-4 font-semibold">
              We never sell your data to advertisers.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              3. How We Store and Protect Your Data
            </h2>
            <p className="text-muted-foreground">
              We take reasonable steps to safeguard your data:
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Encryption in transit (HTTPS)</li>
              <li>Secure password hashing</li>
              <li>Restricted access to databases</li>
              <li>Regular security monitoring</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              Still, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              4. Cookies and Tracking Technologies
            </h2>
            <p className="text-muted-foreground">
              We may use cookies or local storage to:
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Save your login session</li>
              <li>Remember your theme (light/dark)</li>
              <li>Track streaks and session progress</li>
              <li>Improve performance and analytics</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              You can disable cookies in your browser, but some features may not
              work.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              5. Third-Party Services
            </h2>
            <p className="text-muted-foreground">
              Depending on your build, ReFocus may use services such as:
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Vercel / Netlify – hosting</li>
              <li>Google Analytics – usage analytics</li>
              <li>
                Firebase / Supabase / MongoDB – user accounts &amp; database
              </li>
              <li>Cloudinary – image uploads</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              These services have their own privacy policies.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              6. Sharing Your Information
            </h2>
            <p className="text-muted-foreground">We only share your data if:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>You use social features (friends, community leaderboard)</li>
              <li>You choose to display your profile publicly</li>
              <li>You send a connection request to another user</li>
              <li>Required by law (rare)</li>
            </ul>
            <p className="text-muted-foreground mt-4 font-semibold">
              We do not sell or trade your data to advertisers or marketing
              agencies.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              7. Your Rights &amp; Controls
            </h2>
            <p className="text-muted-foreground">You can:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Update your profile info</li>
              <li>Delete or deactivate your account</li>
              <li>Request a copy of your data</li>
              <li>Opt out of analytics or cookies</li>
              <li>Change your notification settings</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              To request data deletion, contact us at:
              <br />
              📧 support@refocus.app
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              8. Children's Privacy
            </h2>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>ReFocus is not intended for children under 13 years old.</li>
              <li>We do not knowingly collect data from minors.</li>
              <li>
                If such data is discovered, it will be deleted immediately.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              9. Changes to This Privacy Policy
            </h2>
            <p className="text-muted-foreground">
              We may update this policy from time to time.
              <br />
              We will notify you by updating the "Last Updated" date at the top
              of this page.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
