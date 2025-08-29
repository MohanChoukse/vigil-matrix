import { useState } from 'react';
import { FiSave, FiRefreshCw, FiShield, FiBell, FiDatabase, FiKey } from 'react-icons/fi';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';

export function SettingsPage(props: any) {
  const [settings, setSettings] = useState({
    // Monitoring Settings
    realTimeMonitoring: true,
    alertThreshold: 'medium',
    autoClassification: true,
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    alertSounds: false,
    
    // Data Settings
    dataRetention: '90',
    exportFormat: 'json',
    backupFrequency: 'daily',
    
    // Security Settings
    apiKey: '****-****-****-****',
    encryptData: true,
    auditLogs: true
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    toast.success('Settings saved successfully!');
  };

  const handleReset = () => {
    // Reset to default values
    setSettings({
      realTimeMonitoring: true,
      alertThreshold: 'medium',
      autoClassification: true,
      emailNotifications: true,
      pushNotifications: true,
      alertSounds: false,
      dataRetention: '90',
      exportFormat: 'json',
      backupFrequency: 'daily',
      apiKey: '****-****-****-****',
      encryptData: true,
      auditLogs: true
    });
    toast.success('Settings reset to defaults');
  };

  const SettingItem = ({ 
    title, 
    description, 
    children 
  }: {
    title: string;
    description: string;
    children: React.ReactNode;
  }) => (
    <div className="flex items-center justify-between py-4">
      <div className="flex-1">
        <h4 className="font-medium text-foreground">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="ml-4">
        {children}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">System Settings</h2>
            <p className="text-muted-foreground">
              Configure monitoring, alerts, and system preferences
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={handleReset} 
              variant="outline"
              className="gap-2"
            >
              <FiRefreshCw className="w-4 h-4" />
              Reset
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={isLoading}
              className="gap-2 btn-cyber"
            >
              <FiSave className="w-4 h-4" />
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>

      {/* Monitoring Settings */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <FiShield className="w-5 h-5 text-primary" />
            Monitoring Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <SettingItem
            title="Real-time Monitoring"
            description="Enable continuous monitoring of social media platforms"
          >
            <Switch
              checked={settings.realTimeMonitoring}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, realTimeMonitoring: checked })
              }
            />
          </SettingItem>
          
          <Separator />
          
          <SettingItem
            title="Alert Sensitivity"
            description="Set the threshold for generating security alerts"
          >
            <Select
              value={settings.alertThreshold}
              onValueChange={(value) =>
                setSettings({ ...settings, alertThreshold: value })
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </SettingItem>
          
          <Separator />
          
          <SettingItem
            title="Auto Classification"
            description="Automatically classify posts using AI models"
          >
            <Switch
              checked={settings.autoClassification}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, autoClassification: checked })
              }
            />
          </SettingItem>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <FiBell className="w-5 h-5 text-warning" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <SettingItem
            title="Email Notifications"
            description="Receive alerts via email when high-risk content is detected"
          >
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, emailNotifications: checked })
              }
            />
          </SettingItem>
          
          <Separator />
          
          <SettingItem
            title="Push Notifications"
            description="Get real-time browser notifications for critical alerts"
          >
            <Switch
              checked={settings.pushNotifications}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, pushNotifications: checked })
              }
            />
          </SettingItem>
          
          <Separator />
          
          <SettingItem
            title="Alert Sounds"
            description="Play audio alerts for high-priority notifications"
          >
            <Switch
              checked={settings.alertSounds}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, alertSounds: checked })
              }
            />
          </SettingItem>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <FiDatabase className="w-5 h-5 text-success" />
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <SettingItem
            title="Data Retention Period"
            description="How long to keep analyzed posts and metadata"
          >
            <Select
              value={settings.dataRetention}
              onValueChange={(value) =>
                setSettings({ ...settings, dataRetention: value })
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 Days</SelectItem>
                <SelectItem value="90">90 Days</SelectItem>
                <SelectItem value="180">6 Months</SelectItem>
                <SelectItem value="365">1 Year</SelectItem>
              </SelectContent>
            </Select>
          </SettingItem>
          
          <Separator />
          
          <SettingItem
            title="Export Format"
            description="Default format for data exports and reports"
          >
            <Select
              value={settings.exportFormat}
              onValueChange={(value) =>
                setSettings({ ...settings, exportFormat: value })
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
              </SelectContent>
            </Select>
          </SettingItem>
          
          <Separator />
          
          <SettingItem
            title="Backup Frequency"
            description="How often to create system backups"
          >
            <Select
              value={settings.backupFrequency}
              onValueChange={(value) =>
                setSettings({ ...settings, backupFrequency: value })
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hourly">Hourly</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </SettingItem>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <FiKey className="w-5 h-5 text-danger" />
            Security Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <SettingItem
            title="API Access Key"
            description="Secure key for external API integrations"
          >
            <div className="flex gap-2">
              <Input
                type="password"
                value={settings.apiKey}
                onChange={(e) =>
                  setSettings({ ...settings, apiKey: e.target.value })
                }
                className="w-48"
              />
              <Button size="sm" variant="outline">
                Regenerate
              </Button>
            </div>
          </SettingItem>
          
          <Separator />
          
          <SettingItem
            title="Data Encryption"
            description="Encrypt stored data and communications"
          >
            <div className="flex items-center gap-2">
              <Switch
                checked={settings.encryptData}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, encryptData: checked })
                }
              />
              <Badge variant="secondary" className="text-xs">
                AES-256
              </Badge>
            </div>
          </SettingItem>
          
          <Separator />
          
          <SettingItem
            title="Audit Logging"
            description="Track all system activities and user actions"
          >
            <Switch
              checked={settings.auditLogs}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, auditLogs: checked })
              }
            />
          </SettingItem>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-foreground">System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-success/10 border border-success/30">
              <div className="w-3 h-3 rounded-full bg-success mx-auto mb-2"></div>
              <p className="font-medium text-success">Monitoring Active</p>
              <p className="text-xs text-muted-foreground">All systems operational</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-primary/10 border border-primary/30">
              <div className="w-3 h-3 rounded-full bg-primary mx-auto mb-2"></div>
              <p className="font-medium text-primary">AI Models Online</p>
              <p className="text-xs text-muted-foreground">Classification running</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-warning/10 border border-warning/30">
              <div className="w-3 h-3 rounded-full bg-warning mx-auto mb-2"></div>
              <p className="font-medium text-warning">Database 98% Full</p>
              <p className="text-xs text-muted-foreground">Cleanup recommended</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}