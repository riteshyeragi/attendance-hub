import { Community, CommunityCategory } from "@/data/communityTypes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { CommunityIcon } from "./CommunityIcon";

interface CommunityCardProps {
  community: Community;
  onJoinToggle: (id: string) => void;
  onClick: (id: string) => void;
}

const categoryColors: Record<CommunityCategory, string> = {
  Roads: "bg-warning/15 text-warning border-warning/30",
  Water: "bg-primary/15 text-primary border-primary/30",
  Electricity: "bg-warning/15 text-warning border-warning/30",
  Cleanliness: "bg-success/15 text-success border-success/30",
  Safety: "bg-destructive/15 text-destructive border-destructive/30",
  Education: "bg-primary/15 text-primary border-primary/30",
  Healthcare: "bg-destructive/15 text-destructive border-destructive/30",
  General: "bg-muted text-muted-foreground border-border",
};

export function CommunityCard({ community, onJoinToggle, onClick }: CommunityCardProps) {
  return (
    <div
      className="rounded-lg border border-border bg-card p-4 cursor-pointer hover:border-primary/40 transition-colors group"
      onClick={() => onClick(community.id)}
    >
      <div className="flex items-start gap-3">
        <div className="rounded-md bg-secondary p-2.5 shrink-0">
          <CommunityIcon name={community.icon} className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
            {community.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {community.description}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-3 flex-wrap">
        <Badge
          variant="outline"
          className={cn("text-xs", categoryColors[community.category])}
        >
          {community.category}
        </Badge>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" />
          {community.location}
        </span>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Users className="h-3 w-3" />
          {community.memberCount.toLocaleString()}
        </span>
      </div>

      <div className="mt-3 pt-3 border-t border-border">
        <Button
          variant={community.isJoined ? "secondary" : "default"}
          size="sm"
          className="w-full"
          onClick={(e) => {
            e.stopPropagation();
            onJoinToggle(community.id);
          }}
        >
          {community.isJoined ? "Leave Community" : "Join Community"}
        </Button>
      </div>
    </div>
  );
}
