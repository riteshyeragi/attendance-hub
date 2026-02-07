import { useState } from "react";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { POST_TAGS, URGENCY_LEVELS, PostTag, UrgencyLevel } from "@/data/communityTypes";
import { ImagePlus } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (post: {
    title: string;
    content: string;
    tag: PostTag;
    urgencyLevel?: UrgencyLevel;
    imageUrl?: string;
  }) => void;
}

const MAX_CHARS = 500;

export function CreatePostModal({ isOpen, onClose, onSubmit }: CreatePostModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState<PostTag>("Discussion");
  const [urgency, setUrgency] = useState<UrgencyLevel>("Medium");
  const [hasImage, setHasImage] = useState(false);

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;
    onSubmit({
      title: title.trim(),
      content: content.trim(),
      tag,
      urgencyLevel: tag === "Issue" ? urgency : undefined,
      imageUrl: hasImage ? "placeholder" : undefined,
    });
    setTitle("");
    setContent("");
    setTag("Discussion");
    setUrgency("Medium");
    setHasImage(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Post" className="max-w-lg">
      <div className="space-y-4">
        {/* Tag selector */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Post Type</Label>
          <div className="flex gap-2">
            {POST_TAGS.map((t) => (
              <Button
                key={t}
                variant={tag === t ? "default" : "secondary"}
                size="sm"
                className="text-xs"
                onClick={() => setTag(t)}
              >
                {t}
              </Button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div className="space-y-1.5">
          <Label htmlFor="post-title" className="text-xs text-muted-foreground">
            Title
          </Label>
          <Input
            id="post-title"
            placeholder="Give your post a clear title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
          />
        </div>

        {/* Content */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="post-content" className="text-xs text-muted-foreground">
              Content
            </Label>
            <span
              className={cn(
                "text-[10px]",
                content.length > MAX_CHARS ? "text-destructive" : "text-muted-foreground"
              )}
            >
              {content.length}/{MAX_CHARS}
            </span>
          </div>
          <Textarea
            id="post-content"
            placeholder="Describe the issue, discussion topic, or update..."
            value={content}
            onChange={(e) => setContent(e.target.value.slice(0, MAX_CHARS))}
            className="min-h-[100px] resize-none"
          />
        </div>

        {/* Urgency (only for Issues) */}
        {tag === "Issue" && (
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Urgency Level</Label>
            <div className="flex gap-2">
              {URGENCY_LEVELS.map((u) => (
                <Button
                  key={u}
                  variant={urgency === u ? "default" : "secondary"}
                  size="sm"
                  className="text-xs"
                  onClick={() => setUrgency(u)}
                >
                  {u}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Image upload placeholder */}
        <button
          type="button"
          onClick={() => setHasImage(!hasImage)}
          className={cn(
            "w-full rounded-md border-2 border-dashed p-3 flex items-center justify-center gap-2 text-xs transition-colors",
            hasImage
              ? "border-primary/40 bg-primary/5 text-primary"
              : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
          )}
        >
          <ImagePlus className="h-4 w-4" />
          {hasImage ? "Image attached (mock)" : "Attach an image"}
        </button>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="flex-1"
            onClick={handleSubmit}
            disabled={!title.trim() || !content.trim() || content.length > MAX_CHARS}
          >
            Post
          </Button>
        </div>
      </div>
    </Modal>
  );
}
