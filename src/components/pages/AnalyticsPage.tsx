import { useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { Post } from '../../types';
import { generateChartData, getTopHashtags } from '../../data/mockData';
import { FiTrendingUp, FiUsers, FiGlobe, FiActivity } from 'react-icons/fi';

interface AnalyticsPageProps {
  posts: Post[];
  filters?: any;
  setFilters?: any;
  updatePostClassification?: any;
  clearFilters?: any;
  isLoading?: boolean;
  setIsLoading?: any;
}

export function AnalyticsPage({ posts }: AnalyticsPageProps) {
  const chartData = generateChartData();
  const topHashtags = getTopHashtags();

  const analytics = useMemo(() => {
    const platforms = posts.reduce((acc, post) => {
      if (post.platform) {
        acc[post.platform] = (acc[post.platform] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const locations = posts.reduce((acc, post) => {
      if (post.location && post.location !== 'Unknown') {
        acc[post.location] = (acc[post.location] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const hourlyActivity = posts.reduce((acc, post) => {
      const hour = new Date(post.timestamp).getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    const totalEngagement = posts.reduce((acc, post) => {
      if (post.engagement) {
        acc.likes += post.engagement.likes;
        acc.shares += post.engagement.shares;
        acc.comments += post.engagement.comments;
      }
      return acc;
    }, { likes: 0, shares: 0, comments: 0 });

    return {
      platforms: Object.entries(platforms).map(([name, value]) => ({ name, value })),
      locations: Object.entries(locations).map(([name, value]) => ({ name, value })),
      hourlyActivity: Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        posts: hourlyActivity[i] || 0,
        label: `${i.toString().padStart(2, '0')}:00`
      })),
      totalEngagement
    };
  }, [posts]);

  const threatLevelData = useMemo(() => {
    return chartData.map(day => ({
      ...day,
      threatLevel: (day.suspicious * 2 + day.highlySuspicious * 3) / day.total
    }));
  }, [chartData]);

  const COLORS = {
    safe: 'hsl(var(--success))',
    suspicious: 'hsl(var(--warning))',
    highlySuspicious: 'hsl(var(--danger))',
    danger: 'hsl(var(--danger))',
    primary: 'hsl(var(--primary))',
    secondary: 'hsl(var(--secondary))'
  };

  const StatCard = ({ title, value, subtitle, icon: Icon, color }: {
    title: string;
    value: string | number;
    subtitle: string;
    icon: any;
    color: string;
  }) => (
    <div className="glass-card p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      <h3 className="font-semibold text-foreground">{title}</h3>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Engagement"
          value={analytics.totalEngagement.likes.toLocaleString()}
          subtitle="likes across all posts"
          icon={FiTrendingUp}
          color="bg-primary/20 text-primary"
        />
        <StatCard
          title="Active Platforms"
          value={analytics.platforms.length}
          subtitle="social networks monitored"
          icon={FiGlobe}
          color="bg-success/20 text-success"
        />
        <StatCard
          title="Geographic Spread"
          value={analytics.locations.length}
          subtitle="unique locations"
          icon={FiUsers}
          color="bg-warning/20 text-warning"
        />
        <StatCard
          title="Peak Activity"
          value={`${Math.max(...analytics.hourlyActivity.map(h => h.posts))} posts`}
          subtitle="highest hour"
          icon={FiActivity}
          color="bg-danger/20 text-danger"
        />
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Threat Level Trend */}
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-foreground mb-6">
            Threat Level Analysis
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={threatLevelData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="dateLabel" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="threatLevel"
                  stroke={COLORS.danger}
                  fill={COLORS.danger}
                  fillOpacity={0.3}
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Platform Distribution */}
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-foreground mb-6">
            Platform Distribution
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.platforms}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {analytics.platforms.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={`hsl(${186 + index * 60}, 70%, ${50 + index * 10}%)`}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {analytics.platforms.map((platform, index) => (
              <div key={platform.name} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ 
                    backgroundColor: `hsl(${186 + index * 60}, 70%, ${50 + index * 10}%)` 
                  }}
                />
                <span className="text-sm text-foreground">{platform.name}</span>
                <span className="text-sm text-muted-foreground ml-auto">
                  {platform.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hourly Activity */}
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-foreground mb-6">
            Activity Heatmap (24h)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.hourlyActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="hour"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={10}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={10}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
                  }}
                />
                <Bar 
                  dataKey="posts" 
                  fill={COLORS.primary}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Hostile Hashtags */}
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-foreground mb-6">
            Top Hostile Hashtags
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topHashtags.slice(0, 6)} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  type="number"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={10}
                />
                <YAxis 
                  type="category"
                  dataKey="hashtag"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={10}
                  width={80}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
                  }}
                />
                <Bar 
                  dataKey="count" 
                  fill={COLORS.danger}
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-foreground mb-6">
            Geographic Hotspots
          </h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {analytics.locations
              .sort((a, b) => b.value - a.value)
              .slice(0, 8)
              .map((location, index) => (
                <div 
                  key={location.name} 
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">
                        {index + 1}
                      </span>
                    </div>
                    <span className="font-medium text-foreground">
                      {location.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-500"
                        style={{ 
                          width: `${(location.value / Math.max(...analytics.locations.map(l => l.value))) * 100}%` 
                        }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-foreground min-w-[2rem]">
                      {location.value}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Detailed Classification Trends */}
      <div className="glass-card p-6 rounded-2xl">
        <h3 className="text-lg font-semibold text-foreground mb-6">
          Classification Trends Over Time
        </h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="dateLabel" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="safe" 
                stroke={COLORS.safe} 
                strokeWidth={3}
                name="Safe Posts"
                dot={{ fill: COLORS.safe, strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="suspicious" 
                stroke={COLORS.suspicious} 
                strokeWidth={3}
                name="Suspicious Posts"
                dot={{ fill: COLORS.suspicious, strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="highlySuspicious" 
                stroke={COLORS.highlySuspicious} 
                strokeWidth={3}
                name="High-Risk Posts"
                dot={{ fill: COLORS.highlySuspicious, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}