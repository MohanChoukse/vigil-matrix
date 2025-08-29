import { useState } from 'react';
import { 
  FiHome, 
  FiFileText, 
  FiBell, 
  FiBarChart, 
  FiSettings, 
  FiMenu,
  FiShield 
} from 'react-icons/fi';
import { Post } from '../types';

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  posts: Post[];
}

export function Sidebar({ currentPage, setCurrentPage, posts }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const alertCount = posts.filter(p => p.classification === 'Highly Suspicious').length;

  const navigationItems = [
    { id: 'overview', icon: FiHome, label: 'Overview', count: null },
    { id: 'posts', icon: FiFileText, label: 'Posts', count: posts.length },
    { id: 'alerts', icon: FiBell, label: 'Alerts', count: alertCount },
    { id: 'analytics', icon: FiBarChart, label: 'Analytics', count: null },
    { id: 'settings', icon: FiSettings, label: 'Settings', count: null },
  ];

  return (
    <aside 
      className={`glass-card m-2 rounded-2xl transition-all duration-300 flex flex-col ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <FiShield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Sentinel AI</h1>
              <p className="text-xs text-muted-foreground">Campaign Detection</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-accent transition-colors"
        >
          <FiMenu className="w-5 h-5 text-foreground" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'hover:bg-accent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'animate-glow' : ''}`} />
              {!isCollapsed && (
                <>
                  <span className="font-medium flex-1 text-left">{item.label}</span>
                  {item.count !== null && (
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      isActive 
                        ? 'bg-primary-foreground/20 text-primary-foreground' 
                        : item.id === 'alerts' && item.count > 0
                        ? 'bg-danger text-white animate-pulse-danger'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* Stats Summary */}
      <div className="p-4 border-t border-border">
        <div className="glass-card p-4 rounded-xl bg-primary/5">
          <div className="text-center">
            {!isCollapsed && (
              <h4 className="text-sm font-semibold text-foreground mb-2">
                Posts Analyzed Today
              </h4>
            )}
            <div className="text-2xl font-bold text-primary">
              {posts.length.toLocaleString()}
            </div>
            {!isCollapsed && (
              <div className="text-xs text-muted-foreground mt-1">
                {alertCount} high-risk detected
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}