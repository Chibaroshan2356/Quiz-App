import React, { useState } from 'react';
import { 
  FiSave, 
  FiRefreshCw, 
  FiShield, 
  FiMail, 
  FiGlobe,
  FiDatabase,
  FiBell,
  FiLock
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import AdminLayout from '../../components/layout/AdminLayout';

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'Quiz Platform',
    siteDescription: 'A comprehensive quiz platform for learning and assessment',
    siteUrl: 'https://quiz-platform.com',
    
    // Email Settings
    emailNotifications: true,
    emailFrom: 'noreply@quiz-platform.com',
    emailTemplate: 'default',
    
    // Security Settings
    passwordMinLength: 8,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    requireEmailVerification: true,
    
    // Quiz Settings
    defaultTimeLimit: 600,
    maxQuestionsPerQuiz: 50,
    allowRetakes: true,
    showCorrectAnswers: true,
    
    // Database Settings
    backupFrequency: 'daily',
    retentionPeriod: 90,
    autoCleanup: true
  });

  const handleSettingChange = (category, field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all settings to default values?')) {
      // Reset to default values
      setSettings({
        siteName: 'Quiz Platform',
        siteDescription: 'A comprehensive quiz platform for learning and assessment',
        siteUrl: 'https://quiz-platform.com',
        emailNotifications: true,
        emailFrom: 'noreply@quiz-platform.com',
        emailTemplate: 'default',
        passwordMinLength: 8,
        sessionTimeout: 30,
        maxLoginAttempts: 5,
        requireEmailVerification: true,
        defaultTimeLimit: 600,
        maxQuestionsPerQuiz: 50,
        allowRetakes: true,
        showCorrectAnswers: true,
        backupFrequency: 'daily',
        retentionPeriod: 90,
        autoCleanup: true
      });
      toast.success('Settings reset to defaults');
    }
  };

  const SettingSection = ({ title, icon: Icon, children }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-6">
        <Icon className="h-5 w-5 text-gray-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      {children}
    </div>
  );

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600">Configure your quiz platform settings</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleReset}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <FiRefreshCw className="h-4 w-4 mr-2" />
                Reset to Defaults
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                <FiSave className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {/* General Settings */}
            <SettingSection title="General Settings" icon={FiGlobe}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site Name
                  </label>
                  <input
                    type="text"
                    value={settings.siteName}
                    onChange={(e) => handleSettingChange('general', 'siteName', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site URL
                  </label>
                  <input
                    type="url"
                    value={settings.siteUrl}
                    onChange={(e) => handleSettingChange('general', 'siteUrl', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site Description
                  </label>
                  <textarea
                    value={settings.siteDescription}
                    onChange={(e) => handleSettingChange('general', 'siteDescription', e.target.value)}
                    rows={3}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </SettingSection>

            {/* Email Settings */}
            <SettingSection title="Email Settings" icon={FiMail}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="emailNotifications"
                    checked={settings.emailNotifications}
                    onChange={(e) => handleSettingChange('email', 'emailNotifications', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-700">
                    Enable email notifications
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From Email Address
                  </label>
                  <input
                    type="email"
                    value={settings.emailFrom}
                    onChange={(e) => handleSettingChange('email', 'emailFrom', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Template
                  </label>
                  <select
                    value={settings.emailTemplate}
                    onChange={(e) => handleSettingChange('email', 'emailTemplate', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="default">Default</option>
                    <option value="modern">Modern</option>
                    <option value="minimal">Minimal</option>
                  </select>
                </div>
              </div>
            </SettingSection>

            {/* Security Settings */}
            <SettingSection title="Security Settings" icon={FiShield}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Password Length
                  </label>
                  <input
                    type="number"
                    min="6"
                    max="20"
                    value={settings.passwordMinLength}
                    onChange={(e) => handleSettingChange('security', 'passwordMinLength', parseInt(e.target.value))}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session Timeout (minutes)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="120"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Login Attempts
                  </label>
                  <input
                    type="number"
                    min="3"
                    max="10"
                    value={settings.maxLoginAttempts}
                    onChange={(e) => handleSettingChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="requireEmailVerification"
                    checked={settings.requireEmailVerification}
                    onChange={(e) => handleSettingChange('security', 'requireEmailVerification', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="requireEmailVerification" className="ml-2 block text-sm text-gray-700">
                    Require email verification
                  </label>
                </div>
              </div>
            </SettingSection>

            {/* Quiz Settings */}
            <SettingSection title="Quiz Settings" icon={FiLock}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Time Limit (seconds)
                  </label>
                  <input
                    type="number"
                    min="60"
                    max="3600"
                    value={settings.defaultTimeLimit}
                    onChange={(e) => handleSettingChange('quiz', 'defaultTimeLimit', parseInt(e.target.value))}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Questions Per Quiz
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={settings.maxQuestionsPerQuiz}
                    onChange={(e) => handleSettingChange('quiz', 'maxQuestionsPerQuiz', parseInt(e.target.value))}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="allowRetakes"
                    checked={settings.allowRetakes}
                    onChange={(e) => handleSettingChange('quiz', 'allowRetakes', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="allowRetakes" className="ml-2 block text-sm text-gray-700">
                    Allow quiz retakes
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showCorrectAnswers"
                    checked={settings.showCorrectAnswers}
                    onChange={(e) => handleSettingChange('quiz', 'showCorrectAnswers', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="showCorrectAnswers" className="ml-2 block text-sm text-gray-700">
                    Show correct answers after completion
                  </label>
                </div>
              </div>
            </SettingSection>

            {/* Database Settings */}
            <SettingSection title="Database Settings" icon={FiDatabase}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Backup Frequency
                  </label>
                  <select
                    value={settings.backupFrequency}
                    onChange={(e) => handleSettingChange('database', 'backupFrequency', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data Retention Period (days)
                  </label>
                  <input
                    type="number"
                    min="30"
                    max="365"
                    value={settings.retentionPeriod}
                    onChange={(e) => handleSettingChange('database', 'retentionPeriod', parseInt(e.target.value))}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="autoCleanup"
                    checked={settings.autoCleanup}
                    onChange={(e) => handleSettingChange('database', 'autoCleanup', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="autoCleanup" className="ml-2 block text-sm text-gray-700">
                    Enable automatic data cleanup
                  </label>
                </div>
              </div>
            </SettingSection>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Settings;