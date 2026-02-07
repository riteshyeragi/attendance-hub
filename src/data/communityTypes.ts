export type CommunityCategory =
  | "Roads"
  | "Water"
  | "Electricity"
  | "Cleanliness"
  | "Safety"
  | "Education"
  | "Healthcare"
  | "General";

export type PostTag = "Issue" | "Discussion" | "Update";
export type UrgencyLevel = "Low" | "Medium" | "High" | "Critical";

export interface Community {
  id: string;
  name: string;
  description: string;
  category: CommunityCategory;
  location: string;
  memberCount: number;
  icon: string; // lucide icon name
  createdBy: string;
  isJoined: boolean;
}

export interface PostComment {
  id: string;
  authorName: string;
  content: string;
  timestamp: string;
}

export interface CommunityPost {
  id: string;
  communityId: string;
  authorName: string;
  tag: PostTag;
  title: string;
  content: string;
  imageUrl?: string;
  urgencyLevel?: UrgencyLevel;
  likes: number;
  isLiked: boolean;
  comments: PostComment[];
  timestamp: string;
  isReported: boolean;
}

export interface CurrentUser {
  id: string;
  name: string;
}

export const CATEGORIES: CommunityCategory[] = [
  "Roads",
  "Water",
  "Electricity",
  "Cleanliness",
  "Safety",
  "Education",
  "Healthcare",
  "General",
];

export const LOCATIONS = [
  "All Locations",
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Chennai",
  "Hyderabad",
  "Pune",
  "Kolkata",
];

export const POST_TAGS: PostTag[] = ["Issue", "Discussion", "Update"];
export const URGENCY_LEVELS: UrgencyLevel[] = ["Low", "Medium", "High", "Critical"];
