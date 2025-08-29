import { Post, FilterState } from '../types';

export interface PageProps {
  posts: Post[];
  filters?: FilterState;
  setFilters?: (filters: FilterState) => void;
  updatePostClassification?: (id: number, classification: Post['classification']) => void;
  clearFilters?: () => void;
  isLoading?: boolean;
  setIsLoading?: (loading: boolean) => void;
}

export type PageType = 'overview' | 'posts' | 'alerts' | 'analytics' | 'settings';