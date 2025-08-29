import { useMemo } from 'react';
import { FiAlertTriangle, FiMapPin, FiClock, FiTrendingUp } from 'react-icons/fi';
import { Post } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

interface AlertsPageProps {
  posts: Post[];
  updatePostClassification?: (id: number, classification: Post['classification']) => void;
  filters?: any;
  setFilters?: any;
  clearFilters?: any;
  isLoading?: boolean;
  setIsLoading?: any;
}

export function AlertsPage({ posts, updatePostClassification }: AlertsPageProps) {
  const highRiskPosts = useMemo(() => {
    return posts
      .filter(p => p.classification === 'Highly Suspicious')
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [posts]);

  const alertStats = useMemo(() => {
    const last24h = highRiskPosts.filter(p => {
      const postTime = new Date(p.timestamp).getTime();
      const dayAgo = Date.now() - (24 * 60 * 60 * 1000);
      return postTime > dayAgo;
    }).length;

    const locations = [...new Set(highRiskPosts.map(p => p.location))].filter(l => l !== 'Unknown');
    const platforms = [...new Set(highRiskPosts.map(p => p.platform))];

    return {
      totalAlerts: highRiskPosts.length,
      last24h,
      affectedLocations: locations.length,
      activePlatforms: platforms.length
    };
  }, [highRiskPosts]);

  const AlertCard = ({ post }: { post: Post }) => (
    <Card className="glass-card border-danger/30 hover:border-danger/50 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-danger/20 flex items-center justify-center animate-pulse-danger">
              <FiAlertTriangle className="w-6 h-6 text-danger" />
            </div>
          </div>
          
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  @{post.user}
                  <Badge className="text-danger bg-danger/10 border-danger/30">
                    🚨 HIGH RISK
                  </Badge>
                </h4>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                  <span className="flex items-center gap-1">
                    <FiClock className="w-3 h-3" />
                    {new Date(post.timestamp).toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiMapPin className="w-3 h-3" />
                    {post.location}
                  </span>
                  {post.platform && (
                    <Badge variant="outline" className="text-xs">
                      {post.platform}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-danger/5 border border-danger/20 rounded-lg p-4">
              <p className="text-foreground leading-relaxed">{post.content}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {post.hashtags.map(tag => (
                <Badge key={tag} className="text-xs bg-danger/10 text-danger border-danger/30">
                  {tag}
                </Badge>
              ))}
            </div>

            {post.engagement && (
              <div className="flex items-center gap-4 text-sm">
                <span className="text-danger flex items-center gap-1">
                  <FiTrendingUp className="w-3 h-3" />
                  {post.engagement.likes.toLocaleString()} likes
                </span>
                <span className="text-warning">
                  🔄 {post.engagement.shares.toLocaleString()} shares
                </span>
                <span className="text-muted-foreground">
                  💬 {post.engagement.comments.toLocaleString()} comments
                </span>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updatePostClassification(post.id, 'Suspicious')}
                  className="text-xs"
                >
                  Downgrade to Suspicious
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updatePostClassification(post.id, 'Safe')}
                  className="text-xs"
                >
                  Mark as False Positive
                </Button>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="destructive" className="text-xs">
                  Block User
                </Button>
                <Button size="sm" variant="default" className="text-xs">
                  Investigate
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const StatCard = ({ title, value, icon: Icon, color }: {
    title: string;
    value: number;
    icon: any;
    color: string;
  }) => (
    <Card className="glass-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
          </div>
          <div className={`p-3 rounded-xl ${color}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Alert Header */}
      <div className="glass-card p-6 rounded-2xl border-2 border-danger bg-danger/5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-danger/20 flex items-center justify-center animate-pulse-danger">
            <FiAlertTriangle className="w-6 h-6 text-danger" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Security Alert Center</h2>
            <p className="text-muted-foreground">
              Real-time monitoring of high-risk content and potential threats
            </p>
          </div>
        </div>
      </div>

      {/* Alert Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total High-Risk Alerts"
          value={alertStats.totalAlerts}
          icon={FiAlertTriangle}
          color="bg-danger/20 text-danger"
        />
        <StatCard
          title="Alerts (Last 24h)"
          value={alertStats.last24h}
          icon={FiClock}
          color="bg-warning/20 text-warning"
        />
        <StatCard
          title="Affected Locations"
          value={alertStats.affectedLocations}
          icon={FiMapPin}
          color="bg-primary/20 text-primary"
        />
        <StatCard
          title="Active Platforms"
          value={alertStats.activePlatforms}
          icon={FiTrendingUp}
          color="bg-success/20 text-success"
        />
      </div>

      {/* Active Alerts */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">
            Active High-Risk Alerts ({highRiskPosts.length})
          </h3>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-danger animate-pulse"></div>
            <span className="text-sm text-muted-foreground">Live monitoring active</span>
          </div>
        </div>

        <div className="space-y-4">
          {highRiskPosts.length === 0 ? (
            <Card className="glass-card">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
                  <FiAlertTriangle className="w-8 h-8 text-success" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No Active High-Risk Alerts
                </h3>
                <p className="text-muted-foreground">
                  The system is currently not detecting any high-risk content. 
                  Monitoring continues in the background.
                </p>
              </CardContent>
            </Card>
          ) : (
            highRiskPosts.map(post => (
              <AlertCard key={post.id} post={post} />
            ))
          )}
        </div>
      </div>

      {/* Recent Activity */}
      {highRiskPosts.length > 0 && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-foreground">Alert Activity Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-danger/5">
                <span className="text-sm text-foreground">Most recent alert</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(highRiskPosts[0]?.timestamp).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-warning/5">
                <span className="text-sm text-foreground">Most active location</span>
                <span className="text-sm text-muted-foreground">
                  {Object.entries(
                    highRiskPosts.reduce((acc, post) => {
                      acc[post.location] = (acc[post.location] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  )
                    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Unknown'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}