import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-blue-50 to-green-50">
      <div className="text-center">
        <div className="text-6xl font-bold text-primary mb-4">404</div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Page Not Found</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          Oops! It looks like this page doesn't exist. Let's get you back on track.
        </p>
        <Link to="/">
          <Button className="gap-2">
            <Home size={20} />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
