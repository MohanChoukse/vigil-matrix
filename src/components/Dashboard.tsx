import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { OverviewPage } from './pages/OverviewPage';
import { PostsPage } from './pages/PostsPage';
import { AlertsPage } from './pages/AlertsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';
import { mockPosts } from '../data/mockData';
import { Post, FilterState } from '../types';
import { toast } from 'sonner';

type PageType = 'overview' | 'posts' | 'alerts' | 'analytics' | 'settings';

export function Dashboard() {
  const [currentPage, setCurrentPage] = useState<PageType>('overview');
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    hashtag: '',
    classification: '',
    dateRange: '',
    platform: ''
  });

  // Simulate real-time alerts
  useEffect(() => {
    const interval = setInterval(() => {
      // Generate new suspicious post
      const suspiciousContent = [
        'New evidence of systematic oppression discovered. The world must know the truth!',
        'Breaking: Leaked documents show the real agenda behind recent policies.',
        'They are trying to silence us, but we will not be stopped. #TruthWillPrevail',
        'International intervention is needed immediately. Human rights are under attack!'
      ];

      const newPost: Post = {
        id: Date.now(),
        user: `AlertBot_${Math.floor(Math.random() * 1000)}`,
        avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Alert&backgroundColor=ef4444',
        content: suspiciousContent[Math.floor(Math.random() * suspiciousContent.length)],
        hashtags: ['#Alert', '#Breaking', '#TruthWillPrevail'],
        timestamp: new Date().toISOString(),
        classification: 'Highly Suspicious',
        location: 'Unknown',
        platform: 'Telegram',
        engagement: {
          likes: Math.floor(Math.random() * 500) + 100,
          shares: Math.floor(Math.random() * 200) + 50,
          comments: Math.floor(Math.random() * 100) + 20
        }
      };

      setPosts(prev => [newPost, ...prev]);
      
      // Show toast notification
      toast.error('New High-Risk Post Detected!', {
        description: `@${newPost.user}: ${newPost.content.substring(0, 50)}...`,
        action: {
          label: 'View',
          onClick: () => setCurrentPage('alerts'),
        },
      });
    }, 15000); // New alert every 15 seconds

    return () => clearInterval(interval);
  }, []);

  const updatePostClassification = (id: number, classification: Post['classification']) => {
    setPosts(prev => 
      prev.map(post => 
        post.id === id ? { ...post, classification } : post
      )
    );
    toast.success(`Post classification updated to ${classification}`);
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      hashtag: '',
      classification: '',
      dateRange: '',
      platform: ''
    });
  };

  const renderCurrentPage = () => {
    const pageProps = {
      posts,
      filters,
      setFilters,
      updatePostClassification,
      clearFilters,
      isLoading,
      setIsLoading
    };

    switch (currentPage) {
      case 'overview':
        return <OverviewPage {...pageProps} />;
      case 'posts':
        return <PostsPage {...pageProps} />;
      case 'alerts':
        return <AlertsPage {...pageProps} />;
      case 'analytics':
        return <AnalyticsPage {...pageProps} />;
      case 'settings':
        return <SettingsPage {...pageProps} />;
      default:
        return <OverviewPage {...pageProps} />;
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={(page: string) => setCurrentPage(page as PageType)}
        posts={posts}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          currentPage={currentPage}
          posts={posts}
        />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="animate-fade-in">
            {renderCurrentPage()}
          </div>
        </main>
      </div>
    </div>
  );
}