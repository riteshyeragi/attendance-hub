import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, UserCog } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md animate-fade-in-up">
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-foreground">AttendanceMS</h1>
          <p className="text-sm text-muted-foreground mt-2">
            A modern attendance management system for educational institutions
          </p>
        </div>

        {/* Quick Access Cards */}
        <div className="space-y-3">
          <div
            onClick={() => navigate("/login")}
            className="rounded-lg border border-border bg-card p-4 cursor-pointer hover:border-primary/50 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-md bg-primary/10 p-2.5">
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="font-medium text-foreground group-hover:text-primary transition-colors">
                  Sign In
                </h2>
                <p className="text-sm text-muted-foreground">
                  Access your dashboard
                </p>
              </div>
            </div>
          </div>

          <div
            onClick={() => navigate("/register")}
            className="rounded-lg border border-border bg-card p-4 cursor-pointer hover:border-primary/50 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-md bg-secondary p-2.5">
                <UserCog className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <h2 className="font-medium text-foreground group-hover:text-primary transition-colors">
                  Create Account
                </h2>
                <p className="text-sm text-muted-foreground">
                  Register as student or teacher
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Access */}
        <div className="mt-8 rounded-lg border border-dashed border-border bg-card/50 p-4">
          <p className="text-xs text-muted-foreground text-center mb-3">Quick Demo Access</p>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="flex-1"
              onClick={() => navigate("/student")}
            >
              Student View
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="flex-1"
              onClick={() => navigate("/teacher")}
            >
              Teacher View
            </Button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-8">
          Built with React • Designed for developers
        </p>
      </div>
    </div>
  );
};

export default Index;
