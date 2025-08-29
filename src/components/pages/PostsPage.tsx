import { useState, useMemo } from 'react';
import { FiSearch, FiFilter, FiX, FiExternalLink } from 'react-icons/fi';
import { Post, FilterState } from '../../types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';

interface PostsPageProps {
  posts: Post[];
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  updatePostClassification: (id: number, classification: Post['classification']) => void;
  clearFilters: () => void;
}

export function PostsPage({ 
  posts, 
  filters, 
  setFilters, 
  updatePostClassification, 
  clearFilters 
}: PostsPageProps) {
  const [showFilters, setShowFilters] = useState(false);

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = !filters.searchTerm || 
        post.content.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        post.user.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        post.hashtags.some(tag => tag.toLowerCase().includes(filters.searchTerm.toLowerCase()));

      const matchesClassification = !filters.classification || 
        post.classification === filters.classification;

      const matchesPlatform = !filters.platform || 
        post.platform === filters.platform;

      const matchesHashtag = !filters.hashtag || 
        post.hashtags.includes(filters.hashtag);

      return matchesSearch && matchesClassification && matchesPlatform && matchesHashtag;
    });
  }, [posts, filters]);

  const allHashtags = useMemo(() => {
    const hashtags = new Set<string>();
    posts.forEach(post => {
      post.hashtags.forEach(tag => hashtags.add(tag));
    });
    return Array.from(hashtags).sort();
  }, [posts]);

  const platforms = useMemo(() => {
    const platformSet = new Set(posts.map(p => p.platform).filter(Boolean));
    return Array.from(platformSet).sort();
  }, [posts]);

  const getClassificationColor = (classification: Post['classification']) => {
    switch (classification) {
      case 'Safe': return 'text-success bg-success/10 border-success/30';
      case 'Suspicious': return 'text-warning bg-warning/10 border-warning/30';
      case 'Highly Suspicious': return 'text-danger bg-danger/10 border-danger/30';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getClassificationIcon = (classification: Post['classification']) => {
    switch (classification) {
      case 'Safe': return '🛡️';
      case 'Suspicious': return '⚠️';
      case 'Highly Suspicious': return '🚨';
      default: return '❓';
    }
  };

  const PostCard = ({ post }: { post: Post }) => (
    <Card className="glass-card hover:scale-[1.01] transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex gap-4">
          <img 
            src={post.avatar} 
            alt={post.user}
            className="w-12 h-12 rounded-full flex-shrink-0"
          />
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-foreground">@{post.user}</h4>
                <p className="text-sm text-muted-foreground">
                  {new Date(post.timestamp).toLocaleString()} • {post.location}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getClassificationColor(post.classification)}>
                  {getClassificationIcon(post.classification)} {post.classification}
                </Badge>
                {post.platform && (
                  <Badge variant="outline" className="text-xs">
                    {post.platform}
                  </Badge>
                )}
              </div>
            </div>

            <p className="text-foreground leading-relaxed">{post.content}</p>

            <div className="flex flex-wrap gap-2">
              {post.hashtags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setFilters({ ...filters, hashtag: tag })}
                  className="text-xs px-2 py-1 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>

            {post.engagement && (
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>❤️ {post.engagement.likes.toLocaleString()}</span>
                <span>🔄 {post.engagement.shares.toLocaleString()}</span>
                <span>💬 {post.engagement.comments.toLocaleString()}</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={post.classification === 'Safe' ? 'default' : 'outline'}
                  onClick={() => updatePostClassification(post.id, 'Safe')}
                  className="text-xs"
                >
                  Mark Safe
                </Button>
                <Button
                  size="sm"
                  variant={post.classification === 'Suspicious' ? 'default' : 'outline'}
                  onClick={() => updatePostClassification(post.id, 'Suspicious')}
                  className="text-xs"
                >
                  Suspicious
                </Button>
                <Button
                  size="sm"
                  variant={post.classification === 'Highly Suspicious' ? 'destructive' : 'outline'}
                  onClick={() => updatePostClassification(post.id, 'Highly Suspicious')}
                  className="text-xs"
                >
                  High Risk
                </Button>
              </div>
              <Button size="sm" variant="ghost" className="text-xs">
                <FiExternalLink className="w-3 h-3 mr-1" />
                View Source
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header and Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Social Media Posts Analysis
          </h2>
          <p className="text-muted-foreground">
            Showing {filteredPosts.length} of {posts.length} posts
          </p>
        </div>
        <Button
          onClick={() => setShowFilters(!showFilters)}
          variant="outline"
          className="gap-2"
        >
          <FiFilter className="w-4 h-4" />
          Filters
        </Button>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search posts, users, hashtags..."
                  value={filters.searchTerm}
                  onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                  className="pl-10"
                />
              </div>

              <Select 
                value={filters.classification} 
                onValueChange={(value) => setFilters({ ...filters, classification: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Classifications" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Classifications</SelectItem>
                  <SelectItem value="Safe">Safe</SelectItem>
                  <SelectItem value="Suspicious">Suspicious</SelectItem>
                  <SelectItem value="Highly Suspicious">Highly Suspicious</SelectItem>
                </SelectContent>
              </Select>

              <Select 
                value={filters.platform} 
                onValueChange={(value) => setFilters({ ...filters, platform: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Platforms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Platforms</SelectItem>
                  {platforms.map(platform => (
                    <SelectItem key={platform} value={platform}>{platform}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select 
                value={filters.hashtag} 
                onValueChange={(value) => setFilters({ ...filters, hashtag: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Hashtags" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Hashtags</SelectItem>
                  {allHashtags.slice(0, 20).map(hashtag => (
                    <SelectItem key={hashtag} value={hashtag}>{hashtag}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex flex-wrap gap-2">
                {filters.searchTerm && (
                  <Badge variant="secondary" className="gap-1">
                    Search: {filters.searchTerm}
                    <button onClick={() => setFilters({ ...filters, searchTerm: '' })}>
                      <FiX className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {filters.classification && (
                  <Badge variant="secondary" className="gap-1">
                    {filters.classification}
                    <button onClick={() => setFilters({ ...filters, classification: '' })}>
                      <FiX className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {filters.platform && (
                  <Badge variant="secondary" className="gap-1">
                    {filters.platform}
                    <button onClick={() => setFilters({ ...filters, platform: '' })}>
                      <FiX className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {filters.hashtag && (
                  <Badge variant="secondary" className="gap-1">
                    {filters.hashtag}
                    <button onClick={() => setFilters({ ...filters, hashtag: '' })}>
                      <FiX className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
              </div>
              <Button 
                onClick={clearFilters} 
                variant="ghost" 
                size="sm"
                className="text-xs"
              >
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Posts Grid */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <Card className="glass-card">
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">No posts match your current filters.</p>
              <Button onClick={clearFilters} variant="outline" className="mt-4">
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>
    </div>
  );
}