// Settings Manager Component
// Handles UI interactions and state management for settings

import { settingsService, UserPreferences, SecuritySettings, NotificationSettings, DataSettings } from '../services/settings';

export interface SettingsState {
  currentTab: string;
  isLoading: boolean;
  error: string | null;
  userProfile: any;
  preferences: UserPreferences;
  security: SecuritySettings;
  notifications: NotificationSettings;
  data: DataSettings;
}

export class SettingsManager {
  private state: SettingsState;
  private listeners: Function[] = [];

  constructor() {
    this.state = {
      currentTab: 'account',
      isLoading: false,
      error: null,
      userProfile: null,
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
        storageUsed: 2.4 * 1024 * 1024 * 1024,
        storageLimit: 10 * 1024 * 1024 * 1024,
        autoBackup: true,
        backupFrequency: 'weekly',
        retentionPeriod: 30
      }
    };

    this.initialize();
  }

  private async initialize() {
    try {
      this.setState({ isLoading: true });
      
      const userProfile = await settingsService.getUserProfile();
      if (userProfile) {
        this.setState({
          userProfile,
          preferences: userProfile.preferences,
          security: userProfile.security,
          notifications: userProfile.notifications,
          data: userProfile.data
        });
      }

      // Listen for settings changes
      settingsService.addListener('preferences', (preferences: UserPreferences) => {
        this.setState({ preferences });
      });

      settingsService.addListener('security', (security: SecuritySettings) => {
        this.setState({ security });
      });

      settingsService.addListener('notifications', (notifications: NotificationSettings) => {
        this.setState({ notifications });
      });

      settingsService.addListener('data', (data: DataSettings) => {
        this.setState({ data });
      });

    } catch (error) {
      this.setState({ error: 'Failed to load settings' });
    } finally {
      this.setState({ isLoading: false });
    }
  }

  // Tab Management
  public setCurrentTab(tab: string) {
    this.setState({ currentTab: tab });
  }

  public getCurrentTab(): string {
    return this.state.currentTab;
  }

  // Preferences Management
  public async updatePreference(key: keyof UserPreferences, value: any) {
    try {
      this.setState({ isLoading: true });
      const updatedPreferences = await settingsService.updatePreferences({ [key]: value });
      this.setState({ preferences: updatedPreferences });
    } catch (error) {
      this.setState({ error: 'Failed to update preference' });
    } finally {
      this.setState({ isLoading: false });
    }
  }

  // Security Management
  public async updateSecuritySetting(key: keyof SecuritySettings, value: any) {
    try {
      this.setState({ isLoading: true });
      const updatedSecurity = await settingsService.updateSecuritySettings({ [key]: value });
      this.setState({ security: updatedSecurity });
    } catch (error) {
      this.setState({ error: 'Failed to update security setting' });
    } finally {
      this.setState({ isLoading: false });
    }
  }

  public async changePassword(currentPassword: string, newPassword: string): Promise<boolean> {
    try {
      this.setState({ isLoading: true });
      const success = await settingsService.changePassword(currentPassword, newPassword);
      if (success) {
        this.setState({ error: null });
      } else {
        this.setState({ error: 'Failed to change password' });
      }
      return success;
    } catch (error) {
      this.setState({ error: 'Failed to change password' });
      return false;
    } finally {
      this.setState({ isLoading: false });
    }
  }

  public async enableTwoFactor() {
    try {
      this.setState({ isLoading: true });
      const result = await settingsService.enableTwoFactor();
      return result;
    } catch (error) {
      this.setState({ error: 'Failed to enable two-factor authentication' });
      return null;
    } finally {
      this.setState({ isLoading: false });
    }
  }

  public async disableTwoFactor(code: string): Promise<boolean> {
    try {
      this.setState({ isLoading: true });
      const success = await settingsService.disableTwoFactor(code);
      if (success) {
        this.setState({ error: null });
      } else {
        this.setState({ error: 'Failed to disable two-factor authentication' });
      }
      return success;
    } catch (error) {
      this.setState({ error: 'Failed to disable two-factor authentication' });
      return false;
    } finally {
      this.setState({ isLoading: false });
    }
  }

  // Notification Management
  public async updateNotificationSetting(key: keyof NotificationSettings, value: boolean) {
    try {
      this.setState({ isLoading: true });
      const updatedNotifications = await settingsService.updateNotificationSettings({ [key]: value });
      this.setState({ notifications: updatedNotifications });
    } catch (error) {
      this.setState({ error: 'Failed to update notification setting' });
    } finally {
      this.setState({ isLoading: false });
    }
  }

  // Data Management
  public async updateDataSetting(key: keyof DataSettings, value: any) {
    try {
      this.setState({ isLoading: true });
      const updatedData = await settingsService.updateDataSettings({ [key]: value });
      this.setState({ data: updatedData });
    } catch (error) {
      this.setState({ error: 'Failed to update data setting' });
    } finally {
      this.setState({ isLoading: false });
    }
  }

  public async exportData(format: 'json' | 'csv' | 'tsv'): Promise<Blob | null> {
    try {
      this.setState({ isLoading: true });
      const blob = await settingsService.exportData(format);
      return blob;
    } catch (error) {
      this.setState({ error: 'Failed to export data' });
      return null;
    } finally {
      this.setState({ isLoading: false });
    }
  }

  public async importData(file: File): Promise<boolean> {
    try {
      this.setState({ isLoading: true });
      const success = await settingsService.importData(file);
      if (success) {
        this.setState({ error: null });
      } else {
        this.setState({ error: 'Failed to import data' });
      }
      return success;
    } catch (error) {
      this.setState({ error: 'Failed to import data' });
      return false;
    } finally {
      this.setState({ isLoading: false });
    }
  }

  public async clearCache(): Promise<boolean> {
    try {
      this.setState({ isLoading: true });
      const success = await settingsService.clearCache();
      if (success) {
        this.setState({ error: null });
      } else {
        this.setState({ error: 'Failed to clear cache' });
      }
      return success;
    } catch (error) {
      this.setState({ error: 'Failed to clear cache' });
      return false;
    } finally {
      this.setState({ isLoading: false });
    }
  }

  public async deleteAccount(password: string): Promise<boolean> {
    try {
      this.setState({ isLoading: true });
      const success = await settingsService.deleteAccount(password);
      if (success) {
        this.setState({ error: null });
      } else {
        this.setState({ error: 'Failed to delete account' });
      }
      return success;
    } catch (error) {
      this.setState({ error: 'Failed to delete account' });
      return false;
    } finally {
      this.setState({ isLoading: false });
    }
  }

  // State Management
  public getState(): SettingsState {
    return { ...this.state };
  }

  private setState(updates: Partial<SettingsState>) {
    this.state = { ...this.state, ...updates };
    this.notifyListeners();
  }

  // Event Listeners
  public addListener(callback: Function) {
    this.listeners.push(callback);
  }

  public removeListener(callback: Function) {
    const index = this.listeners.indexOf(callback);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  private notifyListeners() {
    this.listeners.forEach(callback => callback(this.state));
  }

  // Utility Methods
  public formatStorageSize(bytes: number): string {
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  }

  public getStoragePercentage(): number {
    return (this.state.data.storageUsed / this.state.data.storageLimit) * 100;
  }

  public clearError() {
    this.setState({ error: null });
  }
}

// Export singleton instance
export const settingsManager = new SettingsManager(); 