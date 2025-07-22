// Settings Service for BIM 3.0 Viewer
// Handles user account management, preferences, and app configuration

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  subscription: {
    type: 'free' | 'pro' | 'enterprise';
    expiresAt?: Date;
    features: string[];
  };
  preferences: UserPreferences;
  security: SecuritySettings;
  notifications: NotificationSettings;
  data: DataSettings;
}

export interface UserPreferences {
  theme: 'dark' | 'light' | 'auto';
  language: 'zh-CN' | 'en-US' | 'es-ES';
  autoSave: boolean;
  hardwareAcceleration: boolean;
  defaultViewport: 'perspective' | 'orthographic';
  gridEnabled: boolean;
  gridSize: number;
  gridColor: string;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  sessionTimeout: number; // minutes
  maxDevices: number;
  passwordLastChanged?: Date;
  loginHistory: LoginRecord[];
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  updateReminders: boolean;
  projectShares: boolean;
  collaborationUpdates: boolean;
}

export interface DataSettings {
  storageUsed: number; // bytes
  storageLimit: number; // bytes
  autoBackup: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  retentionPeriod: number; // days
}

export interface LoginRecord {
  timestamp: Date;
  device: string;
  location: string;
  ipAddress: string;
  success: boolean;
}

export interface AppSettings {
  version: string;
  buildNumber: string;
  lastUpdateCheck: Date;
  updateChannel: 'stable' | 'beta' | 'alpha';
}

export class SettingsService {
  private static instance: SettingsService;
  private userProfile: UserProfile | null = null;
  private appSettings: AppSettings;
  private listeners: Map<string, Function[]> = new Map();

  private constructor() {
    this.appSettings = this.loadAppSettings();
    this.userProfile = this.loadUserProfile();
  }

  public static getInstance(): SettingsService {
    if (!SettingsService.instance) {
      SettingsService.instance = new SettingsService();
    }
    return SettingsService.instance;
  }

  // User Profile Management
  public async getUserProfile(): Promise<UserProfile | null> {
    if (!this.userProfile) {
      // In the future, this would fetch from API
      this.userProfile = this.createDefaultProfile();
    }
    return this.userProfile;
  }

  public async updateUserProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    if (!this.userProfile) {
      throw new Error('No user profile found');
    }

    this.userProfile = { ...this.userProfile, ...updates };
    this.saveUserProfile();
    this.notifyListeners('profile', this.userProfile);
    return this.userProfile;
  }

  public async updatePreferences(preferences: Partial<UserPreferences>): Promise<UserPreferences> {
    if (!this.userProfile) {
      throw new Error('No user profile found');
    }

    this.userProfile.preferences = { ...this.userProfile.preferences, ...preferences };
    this.saveUserProfile();
    this.notifyListeners('preferences', this.userProfile.preferences);
    return this.userProfile.preferences;
  }

  public async updateSecuritySettings(security: Partial<SecuritySettings>): Promise<SecuritySettings> {
    if (!this.userProfile) {
      throw new Error('No user profile found');
    }

    this.userProfile.security = { ...this.userProfile.security, ...security };
    this.saveUserProfile();
    this.notifyListeners('security', this.userProfile.security);
    return this.userProfile.security;
  }

  public async updateNotificationSettings(notifications: Partial<NotificationSettings>): Promise<NotificationSettings> {
    if (!this.userProfile) {
      throw new Error('No user profile found');
    }

    this.userProfile.notifications = { ...this.userProfile.notifications, ...notifications };
    this.saveUserProfile();
    this.notifyListeners('notifications', this.userProfile.notifications);
    return this.userProfile.notifications;
  }

  public async updateDataSettings(data: Partial<DataSettings>): Promise<DataSettings> {
    if (!this.userProfile) {
      throw new Error('No user profile found');
    }

    this.userProfile.data = { ...this.userProfile.data, ...data };
    this.saveUserProfile();
    this.notifyListeners('data', this.userProfile.data);
    return this.userProfile.data;
  }

  // Account Management
  public async changePassword(currentPassword: string, newPassword: string): Promise<boolean> {
    // In the future, this would call API
    console.log('Changing password...');
    return true;
  }

  public async enableTwoFactor(): Promise<{ qrCode: string; secret: string }> {
    // In the future, this would call API
    return {
      qrCode: 'data:image/png;base64,placeholder',
      secret: 'placeholder-secret'
    };
  }

  public async disableTwoFactor(code: string): Promise<boolean> {
    // In the future, this would call API
    console.log('Disabling 2FA...');
    return true;
  }

  public async logoutAllDevices(): Promise<boolean> {
    // In the future, this would call API
    console.log('Logging out all devices...');
    return true;
  }

  public async deleteAccount(password: string): Promise<boolean> {
    // In the future, this would call API
    console.log('Deleting account...');
    return true;
  }

  // Data Management
  public async exportData(format: 'json' | 'csv' | 'tsv'): Promise<Blob> {
    // In the future, this would call API
    const data = {
      profile: this.userProfile,
      settings: this.appSettings,
      timestamp: new Date().toISOString()
    };
    
    const content = format === 'json' 
      ? JSON.stringify(data, null, 2)
      : this.convertToCSV(data);
    
    return new Blob([content], { 
      type: format === 'json' ? 'application/json' : 'text/csv' 
    });
  }

  public async importData(file: File): Promise<boolean> {
    // In the future, this would call API
    console.log('Importing data...');
    return true;
  }

  public async clearCache(): Promise<boolean> {
    // Clear local storage and cache
    localStorage.clear();
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
    }
    return true;
  }

  // App Settings
  public getAppSettings(): AppSettings {
    return this.appSettings;
  }

  public async updateAppSettings(settings: Partial<AppSettings>): Promise<AppSettings> {
    this.appSettings = { ...this.appSettings, ...settings };
    this.saveAppSettings();
    this.notifyListeners('app', this.appSettings);
    return this.appSettings;
  }

  public async checkForUpdates(): Promise<{ available: boolean; version?: string; changelog?: string }> {
    // In the future, this would call API
    return { available: false };
  }

  // Event Listeners
  public addListener(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  public removeListener(event: string, callback: Function): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private notifyListeners(event: string, data: any): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  // Storage Management
  private loadUserProfile(): UserProfile | null {
    try {
      const stored = localStorage.getItem('bim-user-profile');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error loading user profile:', error);
      return null;
    }
  }

  private saveUserProfile(): void {
    if (this.userProfile) {
      localStorage.setItem('bim-user-profile', JSON.stringify(this.userProfile));
    }
  }

  private loadAppSettings(): AppSettings {
    try {
      const stored = localStorage.getItem('bim-app-settings');
      return stored ? JSON.parse(stored) : this.createDefaultAppSettings();
    } catch (error) {
      console.error('Error loading app settings:', error);
      return this.createDefaultAppSettings();
    }
  }

  private saveAppSettings(): void {
    localStorage.setItem('bim-app-settings', JSON.stringify(this.appSettings));
  }

  private createDefaultProfile(): UserProfile {
    return {
      id: 'default-user',
      username: '用户名',
      email: 'user@example.com',
      subscription: {
        type: 'free',
        features: ['basic-viewer', 'local-storage']
      },
      preferences: {
        theme: 'dark',
        language: 'zh-CN',
        autoSave: true,
        hardwareAcceleration: false,
        defaultViewport: 'perspective',
        gridEnabled: true,
        gridSize: 2,
        gridColor: '#494b50'
      },
      security: {
        twoFactorEnabled: false,
        sessionTimeout: 60,
        maxDevices: 3,
        loginHistory: []
      },
      notifications: {
        emailNotifications: true,
        pushNotifications: false,
        updateReminders: true,
        projectShares: true,
        collaborationUpdates: true
      },
      data: {
        storageUsed: 2.4 * 1024 * 1024 * 1024, // 2.4 GB
        storageLimit: 10 * 1024 * 1024 * 1024, // 10 GB
        autoBackup: true,
        backupFrequency: 'weekly',
        retentionPeriod: 30
      }
    };
  }

  private createDefaultAppSettings(): AppSettings {
    return {
      version: '1.0.0',
      buildNumber: '2024.1.0',
      lastUpdateCheck: new Date(),
      updateChannel: 'stable'
    };
  }

  private convertToCSV(data: any): string {
    // Simple CSV conversion for demo
    const rows = [];
    for (const [key, value] of Object.entries(data)) {
      rows.push(`${key},${JSON.stringify(value)}`);
    }
    return rows.join('\n');
  }
}

// Export singleton instance
export const settingsService = SettingsService.getInstance(); 