import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { CommunityHeader } from "@/components/community/CommunityHeader";
import { CommunityCard } from "@/components/community/CommunityCard";
import { CommunityFilters } from "@/components/community/CommunityFilters";
import { EmptyState } from "@/components/EmptyState";
import { CardSkeleton } from "@/components/Skeleton";
import { mockCommunities, currentUser } from "@/data/communityMockData";
import { Community, CommunityCategory } from "@/data/communityTypes";
import { useEffect } from "react";

export default function Communities() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CommunityCategory | "All">("All");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");

  useEffect(() => {
    const timer = setTimeout(() => {
      setCommunities(mockCommunities);
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleJoinToggle = (id: string) => {
    setCommunities((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              isJoined: !c.isJoined,
              memberCount: c.isJoined ? c.memberCount - 1 : c.memberCount + 1,
            }
          : c
      )
    );
  };

  const filteredCommunities = useMemo(() => {
    let result = communities;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== "All") {
      result = result.filter((c) => c.category === selectedCategory);
    }

    if (selectedLocation !== "All Locations") {
      result = result.filter((c) => c.location === selectedLocation);
    }

    // Joined communities first
    return [...result].sort((a, b) => {
      if (a.isJoined && !b.isJoined) return -1;
      if (!a.isJoined && b.isJoined) return 1;
      return 0;
    });
  }, [communities, searchQuery, selectedCategory, selectedLocation]);

  const joinedCount = communities.filter((c) => c.isJoined).length;

  return (
    <div className="min-h-screen bg-background">
      <CommunityHeader userName={currentUser.name} />

      <main className="container py-8">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-foreground">Communities</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Join local civic communities, raise issues, and coordinate action.
            {!isLoading && ` You've joined ${joinedCount} ${joinedCount === 1 ? "community" : "communities"}.`}
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <CommunityFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedLocation={selectedLocation}
            onLocationChange={setSelectedLocation}
          />
        </div>

        {/* Community Grid */}
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : filteredCommunities.length === 0 ? (
          <div className="rounded-lg border border-border bg-card">
            <EmptyState
              title="No communities found"
              description={
                searchQuery || selectedCategory !== "All" || selectedLocation !== "All Locations"
                  ? "Try adjusting your filters or search query."
                  : "No communities are available yet. Check back later!"
              }
            />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 animate-fade-in">
            {filteredCommunities.map((community) => (
              <CommunityCard
                key={community.id}
                community={community}
                onJoinToggle={handleJoinToggle}
                onClick={(id) => navigate(`/community/${id}`)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
