import {
  Construction,
  Droplets,
  Zap,
  Trash2,
  Shield,
  GraduationCap,
  HeartPulse,
  MessagesSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  construction: Construction,
  "trash-2": Trash2,
  droplets: Droplets,
  shield: Shield,
  zap: Zap,
  "graduation-cap": GraduationCap,
  "heart-pulse": HeartPulse,
  "messages-square": MessagesSquare,
};

interface CommunityIconProps {
  name: string;
  className?: string;
}

export function CommunityIcon({ name, className }: CommunityIconProps) {
  const Icon = iconMap[name] || MessagesSquare;
  return <Icon className={cn("h-5 w-5", className)} />;
}
