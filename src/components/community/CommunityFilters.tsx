import { CommunityCategory, CATEGORIES, LOCATIONS } from "@/data/communityTypes";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface CommunityFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: CommunityCategory | "All";
  onCategoryChange: (category: CommunityCategory | "All") => void;
  selectedLocation: string;
  onLocationChange: (location: string) => void;
}

export function CommunityFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedLocation,
  onLocationChange,
}: CommunityFiltersProps) {
  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search communities..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 pr-9"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === "All" ? "default" : "secondary"}
          size="sm"
          onClick={() => onCategoryChange("All")}
          className="text-xs"
        >
          All
        </Button>
        {CATEGORIES.map((cat) => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? "default" : "secondary"}
            size="sm"
            onClick={() => onCategoryChange(cat)}
            className="text-xs"
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Location selector */}
      <div className="flex flex-wrap gap-2">
        {LOCATIONS.map((loc) => (
          <Button
            key={loc}
            variant={selectedLocation === loc ? "outline" : "ghost"}
            size="sm"
            onClick={() => onLocationChange(loc)}
            className="text-xs"
          >
            {loc}
          </Button>
        ))}
      </div>
    </div>
  );
}
