import { Link, useNavigate } from 'react-router-dom';
import { User } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/utils/cn';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const getNavLinks = () => {
    if (!user) {
      return (
        <>
          <Link to="/" className="text-foreground hover:text-primary font-medium">
            Home
          </Link>
          <Link to="/about" className="text-foreground hover:text-primary font-medium">
            About
          </Link>
        </>
      );
    }

    switch (user.role) {
      case 'end-user':
        return (
          <>
            <Link to="/app/dashboard" className="text-foreground hover:text-primary font-medium">
              Dashboard
            </Link>
            <Link to="/app/session" className="text-foreground hover:text-primary font-medium">
              Focus Session
            </Link>
            <Link to="/app/challenges" className="text-foreground hover:text-primary font-medium">
              Challenges
            </Link>
            <Link to="/app/log" className="text-foreground hover:text-primary font-medium">
              Session Log
            </Link>
            <Link to="/app/community" className="text-foreground hover:text-primary font-medium">
              Community
            </Link>
          </>
        );
      case 'coach':
        return (
          <>
            <Link to="/coach/dashboard" className="text-foreground hover:text-primary font-medium">
              Mentees
            </Link>
            <Link to="/coach/challenges" className="text-foreground hover:text-primary font-medium">
              Challenges
            </Link>
            <Link to="/coach/messages" className="text-foreground hover:text-primary font-medium">
              Messages
            </Link>
          </>
        );
      case 'admin':
        return (
          <>
            <Link to="/admin/users" className="text-foreground hover:text-primary font-medium">
              Users
            </Link>
            <Link to="/admin/coach-requests" className="text-foreground hover:text-primary font-medium">
              Coach Requests
            </Link>
            <Link to="/admin/analytics" className="text-foreground hover:text-primary font-medium">
              Analytics
            </Link>
          </>
        );
      case 'developer':
        return (
          <>
            <Link to="/dev/games" className="text-foreground hover:text-primary font-medium">
              Games
            </Link>
            <Link to="/dev/versions" className="text-foreground hover:text-primary font-medium">
              Versions
            </Link>
            <Link to="/dev/analytics" className="text-foreground hover:text-primary font-medium">
              Analytics
            </Link>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">RF</span>
          </div>
          <span className="font-bold text-lg text-foreground">ReFocus</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {getNavLinks()}
        </nav>

        {/* Desktop User Menu */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  {user.name}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to={user.role === 'end-user' ? '/app/profile' : '/settings'}>
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline">Log In</Button>
              </Link>
              <Link to="/signup">
                <Button>Get Started</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-white">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {getNavLinks()}
            <div className="border-t border-border pt-4 flex flex-col gap-2">
              {user ? (
                <>
                  <Link to={user.role === 'end-user' ? '/app/profile' : '/settings'}>
                    <Button variant="outline" className="w-full">
                      Settings
                    </Button>
                  </Link>
                  <Button onClick={handleLogout} variant="outline" className="w-full">
                    Log Out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" className="w-full">
                    <Button variant="outline" className="w-full">
                      Log In
                    </Button>
                  </Link>
                  <Link to="/signup" className="w-full">
                    <Button className="w-full">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
