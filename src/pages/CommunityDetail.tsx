import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CommunityHeader } from "@/components/community/CommunityHeader";
import { PostCard } from "@/components/community/PostCard";
import { CreatePostModal } from "@/components/community/CreatePostModal";
import { CommunityIcon } from "@/components/community/CommunityIcon";
import { EmptyState } from "@/components/EmptyState";
import { LectureCardSkeleton } from "@/components/Skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  mockCommunities,
  mockPosts,
  currentUser,
} from "@/data/communityMockData";
import {
  Community,
  CommunityPost,
  PostTag,
  UrgencyLevel,
} from "@/data/communityTypes";
import {
  ArrowLeft,
  Users,
  MapPin,
  Plus,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function CommunityDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [community, setCommunity] = useState<Community | null>(null);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [filterTag, setFilterTag] = useState<PostTag | "All">("All");

  useEffect(() => {
    const timer = setTimeout(() => {
      const found = mockCommunities.find((c) => c.id === id) || null;
      setCommunity(found);
      setPosts(mockPosts.filter((p) => p.communityId === id));
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [id]);

  const isAdmin = community?.createdBy === currentUser.id;
  const isJoined = community?.isJoined ?? false;

  const handleJoinToggle = () => {
    if (!community) return;
    setCommunity({
      ...community,
      isJoined: !community.isJoined,
      memberCount: community.isJoined
        ? community.memberCount - 1
        : community.memberCount + 1,
    });
  };

  const handleCreatePost = (postData: {
    title: string;
    content: string;
    tag: PostTag;
    urgencyLevel?: UrgencyLevel;
    imageUrl?: string;
  }) => {
    const newPost: CommunityPost = {
      id: `p-${Date.now()}`,
      communityId: id!,
      authorName: currentUser.name,
      tag: postData.tag,
      title: postData.title,
      content: postData.content,
      urgencyLevel: postData.urgencyLevel,
      imageUrl: postData.imageUrl,
      likes: 0,
      isLiked: false,
      comments: [],
      timestamp: new Date().toISOString(),
      isReported: false,
    };
    setPosts((prev) => [newPost, ...prev]);
  };

  const handleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
  };

  const handleComment = (postId: string, content: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              comments: [
                ...p.comments,
                {
                  id: `cm-${Date.now()}`,
                  authorName: currentUser.name,
                  content,
                  timestamp: new Date().toISOString(),
                },
              ],
            }
          : p
      )
    );
  };

  const handleReport = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, isReported: true } : p))
    );
  };

  const handleDelete = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  const filteredPosts = useMemo(() => {
    if (filterTag === "All") return posts;
    return posts.filter((p) => p.tag === filterTag);
  }, [posts, filterTag]);

  if (!isLoading && !community) {
    return (
      <div className="min-h-screen bg-background">
        <CommunityHeader userName={currentUser.name} />
        <main className="container py-8">
          <div className="rounded-lg border border-border bg-card">
            <EmptyState
              title="Community not found"
              description="This community doesn't exist or may have been removed."
              action={
                <Button variant="secondary" size="sm" onClick={() => navigate("/communities")}>
                  Back to Communities
                </Button>
              }
            />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <CommunityHeader userName={currentUser.name} />

      <main className="container py-8">
        {/* Back button */}
        <button
          onClick={() => navigate("/communities")}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Communities
        </button>

        {isLoading ? (
          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-card p-6 space-y-3">
              <div className="skeleton-shimmer h-6 w-48 rounded" />
              <div className="skeleton-shimmer h-4 w-full rounded" />
              <div className="skeleton-shimmer h-4 w-32 rounded" />
            </div>
            {[1, 2].map((i) => (
              <LectureCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          community && (
            <div className="space-y-6">
              {/* Community Header Card */}
              <div className="rounded-lg border border-border bg-card p-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-secondary p-3 shrink-0">
                    <CommunityIcon
                      name={community.icon}
                      className="h-6 w-6 text-muted-foreground"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <h1 className="text-xl font-semibold text-foreground">
                          {community.name}
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                          {community.description}
                        </p>
                      </div>
                      <Button
                        variant={isJoined ? "secondary" : "default"}
                        size="sm"
                        onClick={handleJoinToggle}
                      >
                        {isJoined ? "Leave" : "Join Community"}
                      </Button>
                    </div>
                    <div className="flex items-center gap-4 mt-3 flex-wrap">
                      <Badge variant="outline" className="text-xs">
                        {community.category}
                      </Badge>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {community.location}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Users className="h-3 w-3" />
                        {community.memberCount.toLocaleString()} members
                      </span>
                      {isAdmin && (
                        <Badge variant="secondary" className="text-xs">
                          Admin
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Post Controls */}
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <div className="flex gap-1">
                    {(["All", "Issue", "Discussion", "Update"] as const).map(
                      (t) => (
                        <Button
                          key={t}
                          variant={filterTag === t ? "default" : "secondary"}
                          size="sm"
                          className="text-xs"
                          onClick={() => setFilterTag(t)}
                        >
                          {t}
                        </Button>
                      )
                    )}
                  </div>
                </div>
                {isJoined && (
                  <Button
                    size="sm"
                    onClick={() => setShowCreatePost(true)}
                    className="gap-1.5"
                  >
                    <Plus className="h-4 w-4" />
                    New Post
                  </Button>
                )}
              </div>

              {/* Posts Feed */}
              {filteredPosts.length === 0 ? (
                <div className="rounded-lg border border-border bg-card">
                  <EmptyState
                    title="No posts yet"
                    description={
                      isJoined
                        ? "Be the first to share an issue, discussion, or update with the community."
                        : "Join this community to see and create posts."
                    }
                    action={
                      isJoined ? (
                        <Button
                          size="sm"
                          onClick={() => setShowCreatePost(true)}
                        >
                          Create First Post
                        </Button>
                      ) : (
                        <Button size="sm" onClick={handleJoinToggle}>
                          Join Community
                        </Button>
                      )
                    }
                  />
                </div>
              ) : (
                <div className="space-y-4 animate-fade-in">
                  {filteredPosts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      isAdmin={isAdmin}
                      currentUserName={currentUser.name}
                      onLike={handleLike}
                      onComment={handleComment}
                      onReport={handleReport}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
            </div>
          )
        )}
      </main>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={showCreatePost}
        onClose={() => setShowCreatePost(false)}
        onSubmit={handleCreatePost}
      />
    </div>
  );
}
