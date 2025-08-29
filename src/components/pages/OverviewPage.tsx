import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Post } from '../../types';
import { generateChartData } from '../../data/mockData';
import { FiTrendingUp, FiShield, FiAlertTriangle, FiAlertCircle } from 'react-icons/fi';

interface OverviewPageProps {
  posts: Post[];
  filters?: any;
  setFilters?: any;
  updatePostClassification?: any;
  clearFilters?: any;
  isLoading?: boolean;
  setIsLoading?: any;
}

export function OverviewPage({ posts }: OverviewPageProps) {
  const stats = useMemo(() => {
    const safe = posts.filter(p => p.classification === 'Safe').length;
    const suspicious = posts.filter(p => p.classification === 'Suspicious').length;
    const highlySuspicious = posts.filter(p => p.classification === 'Highly Suspicious').length;
    
    return {
      totalPosts: posts.length,
      safePosts: safe,
      suspiciousPosts: suspicious,
      highlySuspiciousPosts: highlySuspicious,
      threatLevel: highlySuspicious > 5 ? 'High' : suspicious > 10 ? 'Medium' : 'Low'
    };
  }, [posts]);

  const chartData = generateChartData();
  
  const pieData = [
    { name: 'Safe', value: stats.safePosts, color: 'hsl(var(--success))' },
    { name: 'Suspicious', value: stats.suspiciousPosts, color: 'hsl(var(--warning))' },
    { name: 'Highly Suspicious', value: stats.highlySuspiciousPosts, color: 'hsl(var(--danger))' }
  ];

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    trend, 
    color,
    description 
  }: {
    title: string;
    value: number;
    icon: any;
    trend?: string;
    color: string;
    description?: string;
  }) => (
    <div className="glass-card p-6 rounded-2xl hover:scale-105 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <span className="text-xs font-medium text-success flex items-center gap-1">
            <FiTrendingUp className="w-3 h-3" />
            {trend}
          </span>
        )}
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <p className="text-3xl font-bold text-foreground">{value.toLocaleString()}</p>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Threat Level Alert */}
      <div className={`glass-card p-4 rounded-2xl border-2 ${
        stats.threatLevel === 'High' 
          ? 'border-danger bg-danger/5 animate-pulse-danger' 
          : stats.threatLevel === 'Medium'
          ? 'border-warning bg-warning/5 animate-pulse-warning'
          : 'border-success bg-success/5'
      }`}>
        <div className="flex items-center gap-3">
          <FiAlertCircle className={`w-6 h-6 ${
            stats.threatLevel === 'High' ? 'text-danger' :
            stats.threatLevel === 'Medium' ? 'text-warning' : 'text-success'
          }`} />
          <div>
            <h3 className="font-semibold text-foreground">
              Current Threat Level: {stats.threatLevel}
            </h3>
            <p className="text-sm text-muted-foreground">
              {stats.threatLevel === 'High' 
                ? 'Multiple high-risk posts detected. Immediate attention required.'
                : stats.threatLevel === 'Medium'
                ? 'Moderate suspicious activity. Continue monitoring.'
                : 'Activity levels are normal. System operating optimally.'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Posts Analyzed"
          value={stats.totalPosts}
          icon={FiTrendingUp}
          trend="+12%"
          color="bg-primary/20 text-primary"
          description="Last 24 hours"
        />
        <StatCard
          title="Safe Content"
          value={stats.safePosts}
          icon={FiShield}
          trend="+5%"
          color="bg-success/20 text-success"
          description="Verified clean posts"
        />
        <StatCard
          title="Suspicious Activity"
          value={stats.suspiciousPosts}
          icon={FiAlertTriangle}
          color="bg-warning/20 text-warning"
          description="Requires review"
        />
        <StatCard
          title="High-Risk Alerts"
          value={stats.highlySuspiciousPosts}
          icon={FiAlertCircle}
          color="bg-danger/20 text-danger"
          description="Immediate action needed"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Chart */}
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Post Activity Trends
            </h3>
            <p className="text-sm text-muted-foreground">
              7-day analysis of content classification patterns
            </p>
          </div>
          <div className="h-80">
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
                  stroke="hsl(var(--success))" 
                  strokeWidth={3}
                  name="Safe Posts"
                />
                <Line 
                  type="monotone" 
                  dataKey="suspicious" 
                  stroke="hsl(var(--warning))" 
                  strokeWidth={3}
                  name="Suspicious"
                />
                <Line 
                  type="monotone" 
                  dataKey="highlySuspicious" 
                  stroke="hsl(var(--danger))" 
                  strokeWidth={3}
                  name="High-Risk"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Classification Distribution */}
        <div className="glass-card p-6 rounded-2xl">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Content Classification
            </h3>
            <p className="text-sm text-muted-foreground">
              Current distribution breakdown
            </p>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
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
          <div className="space-y-2 mt-4">
            {pieData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium text-foreground">{item.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Summary */}
      <div className="glass-card p-6 rounded-2xl">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Recent High-Risk Activity
        </h3>
        <div className="space-y-3">
          {posts
            .filter(p => p.classification === 'Highly Suspicious')
            .slice(0, 3)
            .map(post => (
              <div key={post.id} className="flex items-center gap-4 p-3 rounded-lg bg-danger/5 border border-danger/20">
                <img 
                  src={post.avatar} 
                  alt={post.user}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <p className="font-medium text-foreground">@{post.user}</p>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {post.content}
                  </p>
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(post.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}