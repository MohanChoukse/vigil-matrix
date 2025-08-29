import { FiBell, FiUser, FiSun, FiMoon } from 'react-icons/fi';
import { Post } from '../types';
import { Badge } from './ui/badge';

interface HeaderProps {
  currentPage: string;
  posts: Post[];
}

export function Header({ currentPage, posts }: HeaderProps) {
  const alertCount = posts.filter(p => p.classification === 'Highly Suspicious').length;
  
  const getPageTitle = (page: string) => {
    const titles = {
      overview: 'Overview Dashboard',
      posts: 'Posts Analysis',
      alerts: 'Security Alerts',
      analytics: 'Advanced Analytics',
      settings: 'System Settings'
    };
    return titles[page as keyof typeof titles] || 'Dashboard';
  };

  const getPageDescription = (page: string) => {
    const descriptions = {
      overview: 'Real-time monitoring and threat assessment',
      posts: 'Comprehensive social media post analysis',
      alerts: 'Critical security alerts and high-risk content',
      analytics: 'Detailed insights and trend analysis',
      settings: 'System configuration and preferences'
    };
    return descriptions[page as keyof typeof descriptions] || '';
  };

  return (
    <header className="glass-card m-2 rounded-2xl p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {getPageTitle(currentPage)}
          </h1>
          <p className="text-sm text-muted-foreground">
            {getPageDescription(currentPage)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Live Status Indicator */}
        <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-success/10 border border-success/30">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
          <span className="text-sm font-medium text-success">Live Monitoring</span>
        </div>

        {/* Alerts Bell */}
        <div className="relative">
          <button className="p-3 rounded-xl hover:bg-accent transition-colors relative">
            <FiBell className="w-5 h-5 text-foreground" />
            {alertCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 px-2 py-1 text-xs animate-pulse-danger"
              >
                {alertCount}
              </Badge>
            )}
          </button>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="hidden md:block text-right">
            <p className="text-sm font-semibold text-foreground">Security Admin</p>
            <p className="text-xs text-muted-foreground">Administrator</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <FiUser className="w-5 h-5 text-primary" />
          </div>
        </div>
      </div>
    </header>
  );
}