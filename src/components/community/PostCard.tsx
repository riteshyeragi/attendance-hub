import { useState } from "react";
import { CommunityPost, PostTag } from "@/data/communityTypes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ThumbsUp,
  MessageCircle,
  Flag,
  Trash2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CommentSection } from "./CommentSection";

interface PostCardProps {
  post: CommunityPost;
  isAdmin: boolean;
  currentUserName: string;
  onLike: (postId: string) => void;
  onComment: (postId: string, content: string) => void;
  onReport: (postId: string) => void;
  onDelete: (postId: string) => void;
}

const tagStyles: Record<PostTag, string> = {
  Issue: "bg-destructive/15 text-destructive border-destructive/30",
  Discussion: "bg-primary/15 text-primary border-primary/30",
  Update: "bg-success/15 text-success border-success/30",
};

const urgencyStyles: Record<string, string> = {
  Low: "text-muted-foreground",
  Medium: "text-warning",
  High: "text-destructive",
  Critical: "text-destructive font-semibold",
};

function formatTimestamp(ts: string): string {
  const date = new Date(ts);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export function PostCard({
  post,
  isAdmin,
  currentUserName,
  onLike,
  onComment,
  onReport,
  onDelete,
}: PostCardProps) {
  const [showComments, setShowComments] = useState(false);

  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
            <span className="text-xs font-medium text-foreground">
              {post.authorName.split(" ").map((n) => n[0]).join("")}
            </span>
          </div>
          <div className="min-w-0">
            <span className="text-sm font-medium text-foreground">{post.authorName}</span>
            <span className="text-xs text-muted-foreground ml-2">{formatTimestamp(post.timestamp)}</span>
          </div>
        </div>
        <Badge variant="outline" className={cn("text-xs shrink-0", tagStyles[post.tag])}>
          {post.tag}
        </Badge>
      </div>

      {/* Title & Content */}
      <div>
        <h3 className="text-sm font-semibold text-foreground">{post.title}</h3>
        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{post.content}</p>
      </div>

      {/* Urgency */}
      {post.urgencyLevel && (
        <div className={cn("flex items-center gap-1.5 text-xs", urgencyStyles[post.urgencyLevel])}>
          <AlertTriangle className="h-3.5 w-3.5" />
          <span>Urgency: {post.urgencyLevel}</span>
        </div>
      )}

      {/* Image placeholder */}
      {post.imageUrl && (
        <div className="rounded-md bg-secondary border border-border h-48 flex items-center justify-center">
          <span className="text-xs text-muted-foreground">Image attachment</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1 pt-1 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          className={cn("text-xs gap-1.5", post.isLiked && "text-primary")}
          onClick={() => onLike(post.id)}
        >
          <ThumbsUp className="h-3.5 w-3.5" />
          {post.likes}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs gap-1.5"
          onClick={() => setShowComments(!showComments)}
        >
          <MessageCircle className="h-3.5 w-3.5" />
          {post.comments.length}
          {showComments ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </Button>
        <div className="flex-1" />
        {!post.isReported && (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs gap-1.5 text-muted-foreground hover:text-warning"
            onClick={() => onReport(post.id)}
          >
            <Flag className="h-3.5 w-3.5" />
            Report
          </Button>
        )}
        {post.isReported && (
          <span className="text-xs text-warning px-2">Reported</span>
        )}
        {isAdmin && (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs gap-1.5 text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(post.id)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      {/* Comments */}
      {showComments && (
        <CommentSection
          comments={post.comments}
          onAddComment={(content) => onComment(post.id, content)}
          currentUserName={currentUserName}
        />
      )}
    </div>
  );
}
