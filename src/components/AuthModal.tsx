import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock, User, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { loginSuccess, loginFailure } from "@/store/slices/authSlice";
import { authAPI } from "@/services/api";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess?: () => void;
  defaultTab?: "login" | "signup";
}

const AuthModal = ({ isOpen, onClose, onAuthSuccess, defaultTab = "login" }: AuthModalProps) => {
  const [activeTab, setActiveTab] = useState<"login" | "signup">(defaultTab);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (activeTab === "login") {
        // Handle login
        const response = await authAPI.login(formData.email, formData.password);

        if (response.success && response.user && response.token) {
          console.log('Login API response:', response);
          dispatch(loginSuccess({
            user: response.user,
            token: response.token
          }));
          console.log('Login success dispatched, user:', response.user);
          
          toast({
            title: "Login successful",
            description: `Welcome back, ${response.user.firstName}!`,
          });

          onClose();
          onAuthSuccess?.();
        }
      } else {
        // Handle signup
        if (formData.password !== formData.confirmPassword) {
          toast({
            title: "Password mismatch",
            description: "Passwords do not match. Please try again.",
            variant: "destructive",
          });
          return;
        }

        const response = await authAPI.signup(
          formData.firstName,
          formData.lastName,
          formData.email,
          formData.password
        );

        if (response.success && response.user && response.token) {
          dispatch(loginSuccess({
            user: response.user,
            token: response.token
          }));

          toast({
            title: "Account created successfully",
            description: `Welcome to Speedy Sell Flow, ${response.user.firstName}!`,
          });

          onClose();
          onAuthSuccess?.();
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      dispatch(loginFailure(error.message || 'Authentication failed'));

      toast({
        title: "Authentication failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
    });
    setShowPassword(false);
  };

  const handleTabChange = (tab: "login" | "signup") => {
    setActiveTab(tab);
    resetForm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden border-0 bg-transparent">
        <Card className="glass border-border/20 shadow-custom-xl">
          <CardHeader className="space-y-4 pb-6">
            <div className="flex items-center justify-center">
              <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
                <User className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>

            <DialogHeader className="text-center space-y-2">
              <DialogTitle className="text-2xl font-bold">
                {activeTab === "login" ? "Welcome back" : "Create account"}
              </DialogTitle>
              <p className="text-muted-foreground">
                {activeTab === "login"
                  ? "Sign in to your account to continue"
                  : "Join our community of shoppers"
                }
              </p>
            </DialogHeader>

            {/* Tab Switcher */}
            <div className="flex space-x-1 bg-secondary/50 rounded-lg p-1">
              <Button
                variant={activeTab === "login" ? "default" : "ghost"}
                className={`flex-1 ${activeTab === "login" ? "bg-primary text-primary-foreground shadow-sm" : ""}`}
                onClick={() => handleTabChange("login")}
                disabled={isLoading}
              >
                Login
              </Button>
              <Button
                variant={activeTab === "signup" ? "default" : "ghost"}
                className={`flex-1 ${activeTab === "signup" ? "bg-primary text-primary-foreground shadow-sm" : ""}`}
                onClick={() => handleTabChange("signup")}
                disabled={isLoading}
              >
                Sign Up
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {activeTab === "signup" && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      className="bg-secondary/20 border-border/50 focus:border-primary"
                      required={activeTab === "signup"}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      className="bg-secondary/20 border-border/50 focus:border-primary"
                      required={activeTab === "signup"}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="pl-10 bg-secondary/20 border-border/50 focus:border-primary"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="pl-10 pr-10 bg-secondary/20 border-border/50 focus:border-primary"
                    required
                    disabled={isLoading}
                    minLength={6}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              {activeTab === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="pl-10 bg-secondary/20 border-border/50 focus:border-primary"
                      required={activeTab === "signup"}
                      disabled={isLoading}
                      minLength={6}
                    />
                  </div>
                </div>
              )}

              {activeTab === "login" && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="remember"
                      className="rounded border-border/50"
                      disabled={isLoading}
                    />
                    <Label htmlFor="remember" className="text-sm">
                      Remember me
                    </Label>
                  </div>
                  <Button variant="link" className="px-0 text-primary hover:text-primary-dark" disabled={isLoading}>
                    Forgot password?
                  </Button>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary-dark shadow-custom-md animate-fade-in"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {activeTab === "login" ? "Signing in..." : "Creating account..."}
                  </>
                ) : (
                  activeTab === "login" ? "Sign in" : "Create account"
                )}
              </Button>
            </form>

            {/* Terms for signup */}
            {activeTab === "signup" && (
              <p className="text-xs text-center text-muted-foreground">
                By creating an account, you agree to our{" "}
                <Button variant="link" className="px-0 text-xs text-primary hover:text-primary-dark">
                  Terms of Service
                </Button>{" "}
                and{" "}
                <Button variant="link" className="px-0 text-xs text-primary hover:text-primary-dark">
                  Privacy Policy
                </Button>
              </p>
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;