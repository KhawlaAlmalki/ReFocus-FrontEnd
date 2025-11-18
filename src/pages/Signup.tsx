import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { UserRole } from "@/hooks/useAuth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, ArrowRight, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuthContext();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState<UserRole>("end-user");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const getPasswordStrength = () => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength();

  const getStrengthText = () => {
    if (password.length === 0) return "";
    if (passwordStrength < 2) return "Weak";
    if (passwordStrength < 3) return "Fair";
    if (passwordStrength < 4) return "Good";
    return "Strong";
  };

  const getStrengthColor = () => {
    if (passwordStrength < 2) return "text-destructive";
    if (passwordStrength < 3) return "text-warning";
    return "text-success";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!fullName) newErrors.fullName = "Full name is required";
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    if (!confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (passwordStrength < 2) newErrors.password = "Password is too weak";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    signup(fullName, email, password, role);
    toast.success("Account created successfully!");
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-white">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
        </div>

        <Card className="w-full max-w-md p-8 md:p-12 rounded-3xl border border-border/50 backdrop-blur-sm shadow-lg text-center">
          <div className="mb-6">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-success" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-foreground">
              Account Created!
            </h1>
            <p className="text-muted-foreground mt-2">
              Welcome to ReFocus, {fullName}!
            </p>
          </div>
          <p className="text-muted-foreground mb-8">
            Your account has been created successfully. Let's customize your experience with a quick survey!
          </p>
          <Button
            onClick={() => navigate('/app/kickoff-survey')}
            className="w-full rounded-full py-3 text-base font-semibold transition-all duration-300 hover:scale-105"
          >
            Start Survey
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-white">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-md p-8 md:p-12 rounded-3xl border border-border/50 backdrop-blur-sm shadow-lg">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">RF</span>
            </div>
            <span className="font-bold text-lg text-foreground">ReFocus</span>
          </Link>

          <h1 className="text-3xl font-bold text-foreground">Get Started</h1>
          <p className="text-muted-foreground mt-2">
            Create your ReFocus account today.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name Field */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-sm font-semibold">
              Full Name
            </Label>
            <Input
              id="fullName"
              type="text"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (errors.fullName) setErrors({ ...errors, fullName: "" });
              }}
              className={`rounded-xl py-3 px-4 transition-all duration-200 ${
                errors.fullName
                  ? "border-destructive bg-destructive/5"
                  : "hover:border-primary/30 focus:border-primary"
              }`}
            />
            {errors.fullName && (
              <p className="text-destructive text-sm font-medium">
                {errors.fullName}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-semibold">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: "" });
              }}
              className={`rounded-xl py-3 px-4 transition-all duration-200 ${
                errors.email
                  ? "border-destructive bg-destructive/5"
                  : "hover:border-primary/30 focus:border-primary"
              }`}
            />
            {errors.email && (
              <p className="text-destructive text-sm font-medium">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-semibold">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: "" });
                }}
                className={`rounded-xl py-3 px-4 pr-12 transition-all duration-200 ${
                  errors.password
                    ? "border-destructive bg-destructive/5"
                    : "hover:border-primary/30 focus:border-primary"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {password && (
              <div className="flex items-center gap-2 text-sm pt-2">
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      passwordStrength < 2
                        ? "bg-destructive w-1/4"
                        : passwordStrength < 3
                          ? "bg-warning w-2/4"
                          : "bg-success w-full"
                    }`}
                  />
                </div>
                <span className={`font-medium ${getStrengthColor()}`}>
                  {getStrengthText()}
                </span>
              </div>
            )}
            {errors.password && (
              <p className="text-destructive text-sm font-medium">
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-semibold">
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword)
                    setErrors({ ...errors, confirmPassword: "" });
                }}
                className={`rounded-xl py-3 px-4 pr-12 transition-all duration-200 ${
                  errors.confirmPassword
                    ? "border-destructive bg-destructive/5"
                    : "hover:border-primary/30 focus:border-primary"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {password && confirmPassword && password === confirmPassword && (
              <div className="flex items-center gap-2 text-sm text-success font-medium pt-2">
                <CheckCircle2 size={16} />
                Passwords match
              </div>
            )}
            {errors.confirmPassword && (
              <p className="text-destructive text-sm font-medium">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Role Selector */}
          <div className="space-y-2">
            <Label htmlFor="role" className="text-sm font-semibold">
              I am a...
            </Label>
            <Select
              value={role}
              onValueChange={(value) => setRole(value as UserRole)}
            >
              <SelectTrigger
                id="role"
                className="rounded-xl py-3 px-4 transition-all duration-200 hover:border-primary/30"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="end-user">
                  Student / Professional (End User)
                </SelectItem>
                <SelectItem value="coach">Coach / Mentor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full rounded-full py-3 mt-6 text-base font-semibold transition-all duration-300 hover:scale-105"
          >
            Create Account
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </form>

        {/* Terms and Privacy Note */}
        <p className="mt-8 text-center text-xs text-muted-foreground">
          By signing up, you agree to our{" "}
          <a
            href="#"
            className="text-primary hover:text-primary/80 transition-colors"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="#"
            className="text-primary hover:text-primary/80 transition-colors"
          >
            Privacy Policy
          </a>
        </p>

        {/* Footer Links */}
        <div className="mt-6 pt-6 border-t border-border/50 text-center text-sm">
          <p className="text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary font-semibold hover:text-primary/80 transition-colors"
            >
              Log in
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
