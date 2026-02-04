import { Link, useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  userName: string;
  userRole: "student" | "teacher";
}

export function Header({ userName, userRole }: HeaderProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // In a real app, this would clear auth state
    navigate("/login");
  };

  return (
    <header className="border-b border-border bg-card">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-lg font-semibold text-foreground hover:text-primary transition-colors">
            AttendanceMS
          </Link>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-2 py-0.5 rounded-md bg-secondary">
            {userRole}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground">{userName}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign out
          </Button>
        </div>
      </div>
    </header>
  );
}
