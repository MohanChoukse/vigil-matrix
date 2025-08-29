export type Classification = 'Safe' | 'Suspicious' | 'Highly Suspicious';

export interface Post {
  id: number;
  user: string;
  avatar: string;
  content: string;
  hashtags: string[];
  timestamp: string;
  classification: Classification;
  location: string;
  platform?: string;
  engagement?: {
    likes: number;
    shares: number;
    comments: number;
  };
}

export interface DashboardStats {
  totalPosts: number;
  safePosts: number;
  suspiciousPosts: number;
  highlySuspiciousPosts: number;
  alertsToday: number;
}

export interface FilterState {
  searchTerm: string;
  hashtag: string;
  classification: string;
  dateRange: string;
  platform: string;
}