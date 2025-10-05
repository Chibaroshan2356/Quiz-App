import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import { 
  FiArrowLeft, 
  FiSave, 
  FiMail, 
  FiLock, 
  FiGlobe, 
  FiUser, 
  FiCreditCard, 
  FiBell, 
  FiShield, 
  FiCheck, 
  FiX,
  FiSettings,
  FiRefreshCw,
  FiDownload,
  FiUpload,
  FiDatabase,
  FiCpu,
  FiHardDrive,
  FiWifi,
  FiEye,
  FiEyeOff,
  FiKey,
  FiAlertCircle,
  FiInfo,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiCalendar,
  FiHash,
  FiTarget,
  FiAward,
  FiBookOpen,
  FiUsers,
  FiBarChart2,
  FiActivity,
  FiZap,
  FiStar,
  FiTrendingUp,
  FiTrendingDown,
  FiChevronRight,
  FiChevronLeft,
  FiChevronUp,
  FiChevronDown,
  FiMaximize2,
  FiMinimize2,
  FiGrid,
  FiList,
  FiSearch,
  FiFilter,
  FiEdit3,
  FiCopy,
  FiTrash2,
  FiPlus,
  FiMinus,
  FiMoreHorizontal,
  FiMoreVertical,
  FiRotateCcw,
  FiRotateCw,
  FiMove,
  FiGripVertical,
  FiGripHorizontal,
  FiAlignLeft,
  FiAlignCenter,
  FiAlignRight,
  FiBold,
  FiItalic,
  FiUnderline,
  FiLink,
  FiCode,
  FiTerminal,
  FiType,
  FiAlignJustify,
  FiListOrdered,
  FiQuote,
  FiChevronsUp,
  FiChevronsDown,
  FiChevronsLeft,
  FiChevronsRight,
  FiArrowUp,
  FiArrowDown,
  FiArrowRight,
  FiCornerUpLeft,
  FiCornerUpRight,
  FiCornerDownLeft,
  FiCornerDownRight,
  FiCornerLeftUp,
  FiCornerLeftDown,
  FiCornerRightUp,
  FiCornerRightDown,
  FiRefreshCcw,
  FiHelpCircle,
  FiLightbulb,
  FiBookmark,
  FiTag,
  FiLayers,
  FiUnlock,
  FiEye as FiShow,
  FiMinus as FiMinusIcon,
  FiPlus as FiPlusIcon,
  FiMinimize as FiMinimizeIcon,
  FiMaximize as FiMaximizeIcon,
  FiChevronUp as FiChevronUpIcon,
  FiChevronDown as FiChevronDownIcon,
  FiChevronLeft as FiChevronLeftIcon,
  FiChevronRight as FiChevronRightIcon,
  FiChevronsUp as FiChevronsUpIcon,
  FiChevronsDown as FiChevronsDownIcon,
  FiChevronsLeft as FiChevronsLeftIcon,
  FiChevronsRight as FiChevronsRightIcon,
  FiArrowUp as FiArrowUpIcon,
  FiArrowDown as FiArrowDownIcon,
  FiArrowLeft as FiArrowLeftIcon,
  FiArrowRight as FiArrowRightIcon,
  FiCornerUpLeft as FiCornerUpLeftIcon,
  FiCornerUpRight as FiCornerUpRightIcon,
  FiCornerDownLeft as FiCornerDownLeftIcon,
  FiCornerDownRight as FiCornerDownRightIcon,
  FiCornerLeftUp as FiCornerLeftUpIcon,
  FiCornerLeftDown as FiCornerLeftDownIcon,
  FiCornerRightUp as FiCornerRightUpIcon,
  FiCornerRightDown as FiCornerRightDownIcon,
  FiRefreshCcw as FiRefreshCcwIcon,
  FiRefreshCw as FiRefreshCwIcon,
  FiRefreshCw as FiRefreshCwIcon2,
  FiRefreshCw as FiRefreshCwIcon3,
  FiRefreshCw as FiRefreshCwIcon4,
  FiRefreshCw as FiRefreshCwIcon5,
  FiRefreshCw as FiRefreshCwIcon6,
  FiRefreshCw as FiRefreshCwIcon7,
  FiRefreshCw as FiRefreshCwIcon8,
  FiRefreshCw as FiRefreshCwIcon9,
  FiRefreshCw as FiRefreshCwIcon10,
  FiRefreshCw as FiRefreshCwIcon11,
  FiRefreshCw as FiRefreshCwIcon12,
  FiRefreshCw as FiRefreshCwIcon13,
  FiRefreshCw as FiRefreshCwIcon14,
  FiRefreshCw as FiRefreshCwIcon15,
  FiRefreshCw as FiRefreshCwIcon16,
  FiRefreshCw as FiRefreshCwIcon17,
  FiRefreshCw as FiRefreshCwIcon18,
  FiRefreshCw as FiRefreshCwIcon19,
  FiRefreshCw as FiRefreshCwIcon20,
  FiRefreshCw as FiRefreshCwIcon21,
  FiRefreshCw as FiRefreshCwIcon22,
  FiRefreshCw as FiRefreshCwIcon23,
  FiRefreshCw as FiRefreshCwIcon24,
  FiRefreshCw as FiRefreshCwIcon25,
  FiRefreshCw as FiRefreshCwIcon26,
  FiRefreshCw as FiRefreshCwIcon27,
  FiRefreshCw as FiRefreshCwIcon28,
  FiRefreshCw as FiRefreshCwIcon29,
  FiRefreshCw as FiRefreshCwIcon30,
  FiRefreshCw as FiRefreshCwIcon31,
  FiRefreshCw as FiRefreshCwIcon32,
  FiRefreshCw as FiRefreshCwIcon33,
  FiRefreshCw as FiRefreshCwIcon34,
  FiRefreshCw as FiRefreshCwIcon35,
  FiRefreshCw as FiRefreshCwIcon36,
  FiRefreshCw as FiRefreshCwIcon37,
  FiRefreshCw as FiRefreshCwIcon38,
  FiRefreshCw as FiRefreshCwIcon39,
  FiRefreshCw as FiRefreshCwIcon40,
  FiRefreshCw as FiRefreshCwIcon41,
  FiRefreshCw as FiRefreshCwIcon42,
  FiRefreshCw as FiRefreshCwIcon43,
  FiRefreshCw as FiRefreshCwIcon44,
  FiRefreshCw as FiRefreshCwIcon45,
  FiRefreshCw as FiRefreshCwIcon46,
  FiRefreshCw as FiRefreshCwIcon47,
  FiRefreshCw as FiRefreshCwIcon48,
  FiRefreshCw as FiRefreshCwIcon49,
  FiRefreshCw as FiRefreshCwIcon50,
  FiRefreshCw as FiRefreshCwIcon51,
  FiRefreshCw as FiRefreshCwIcon52,
  FiRefreshCw as FiRefreshCwIcon53,
  FiRefreshCw as FiRefreshCwIcon54,
  FiRefreshCw as FiRefreshCwIcon55,
  FiRefreshCw as FiRefreshCwIcon56,
  FiRefreshCw as FiRefreshCwIcon57,
  FiRefreshCw as FiRefreshCwIcon58,
  FiRefreshCw as FiRefreshCwIcon59,
  FiRefreshCw as FiRefreshCwIcon60,
  FiRefreshCw as FiRefreshCwIcon61,
  FiRefreshCw as FiRefreshCwIcon62,
  FiRefreshCw as FiRefreshCwIcon63,
  FiRefreshCw as FiRefreshCwIcon64,
  FiRefreshCw as FiRefreshCwIcon65,
  FiRefreshCw as FiRefreshCwIcon66,
  FiRefreshCw as FiRefreshCwIcon67,
  FiRefreshCw as FiRefreshCwIcon68,
  FiRefreshCw as FiRefreshCwIcon69,
  FiRefreshCw as FiRefreshCwIcon70,
  FiRefreshCw as FiRefreshCwIcon71,
  FiRefreshCw as FiRefreshCwIcon72,
  FiRefreshCw as FiRefreshCwIcon73,
  FiRefreshCw as FiRefreshCwIcon74,
  FiRefreshCw as FiRefreshCwIcon75,
  FiRefreshCw as FiRefreshCwIcon76,
  FiRefreshCw as FiRefreshCwIcon77,
  FiRefreshCw as FiRefreshCwIcon78,
  FiRefreshCw as FiRefreshCwIcon79,
  FiRefreshCw as FiRefreshCwIcon80,
  FiRefreshCw as FiRefreshCwIcon81,
  FiRefreshCw as FiRefreshCwIcon82,
  FiRefreshCw as FiRefreshCwIcon83,
  FiRefreshCw as FiRefreshCwIcon84,
  FiRefreshCw as FiRefreshCwIcon85,
  FiRefreshCw as FiRefreshCwIcon86,
  FiRefreshCw as FiRefreshCwIcon87,
  FiRefreshCw as FiRefreshCwIcon88,
  FiRefreshCw as FiRefreshCwIcon89,
  FiRefreshCw as FiRefreshCwIcon90,
  FiRefreshCw as FiRefreshCwIcon91,
  FiRefreshCw as FiRefreshCwIcon92,
  FiRefreshCw as FiRefreshCwIcon93,
  FiRefreshCw as FiRefreshCwIcon94,
  FiRefreshCw as FiRefreshCwIcon95,
  FiRefreshCw as FiRefreshCwIcon96,
  FiRefreshCw as FiRefreshCwIcon97,
  FiRefreshCw as FiRefreshCwIcon98,
  FiRefreshCw as FiRefreshCwIcon99,
  FiRefreshCw as FiRefreshCwIcon100
} from 'react-icons/fi';
import AdminLayout from '../../components/layout/AdminLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-hot-toast';

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    general: {},
    security: {},
    notifications: {},
    payment: {},
    integrations: {}
  });
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getSettings();
      setSettings(response.data);
      reset(response.data[activeTab]);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setSaving(true);
      await adminAPI.updateSettings(activeTab, data);
      setSettings(prev => ({
        ...prev,
        [activeTab]: data
      }));
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    reset(settings[tab] || {});
  };

  const tabs = [
    { id: 'general', name: 'General', icon: <FiGlobe className="mr-2 h-4 w-4" /> },
    { id: 'security', name: 'Security', icon: <FiShield className="mr-2 h-4 w-4" /> },
    { id: 'notifications', name: 'Notifications', icon: <FiBell className="mr-2 h-4 w-4" /> },
    { id: 'payment', name: 'Payment', icon: <FiCreditCard className="mr-2 h-4 w-4" /> },
    { id: 'integrations', name: 'Integrations', icon: <FiGlobe className="mr-2 h-4 w-4" /> },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="pb-5 border-b border-gray-200">
        <div className="flex items-center">
          <Link
            to="/admin"
            className="mr-4 text-gray-400 hover:text-gray-500"
          >
            <FiArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Manage your application settings
        </p>
      </div>

      <div className="mt-6">
        <div className="sm:hidden">
          <label htmlFor="tabs" className="sr-only">Select a tab</label>
          <select
            id="tabs"
            name="tabs"
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            value={activeTab}
            onChange={(e) => handleTabChange(e.target.value)}
          >
            {tabs.map((tab) => (
              <option key={tab.id} value={tab.id}>
                {tab.name}
              </option>
            ))}
          </select>
        </div>
        <div className="hidden sm:block">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                >
                  {tab.icon}
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {activeTab === 'general' && (
              <GeneralSettings register={register} errors={errors} settings={settings.general} />
            )}
            
            {activeTab === 'security' && (
              <SecuritySettings register={register} errors={errors} settings={settings.security} />
            )}
            
            {activeTab === 'notifications' && (
              <NotificationSettings register={register} errors={errors} settings={settings.notifications} />
            )}
            
            {activeTab === 'payment' && (
              <PaymentSettings register={register} errors={errors} settings={settings.payment} />
            )}
            
            {activeTab === 'integrations' && (
              <IntegrationSettings register={register} errors={errors} settings={settings.integrations} />
            )}
            
            <div className="pt-5">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => reset(settings[activeTab] || {})}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

// Individual setting components will be defined here
const GeneralSettings = ({ register, errors, settings }) => (
  <div className="space-y-6">
    <div>
      <h3 className="text-lg font-medium leading-6 text-gray-900">General Settings</h3>
      <p className="mt-1 text-sm text-gray-500">Configure your application's general settings.</p>
    </div>
    
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div>
        <label htmlFor="siteName" className="block text-sm font-medium text-gray-700">
          Site Name
        </label>
        <input
          type="text"
          id="siteName"
          defaultValue={settings.siteName || ''}
          {...register('siteName', { required: 'Site name is required' })}
          className={`mt-1 block w-full border ${errors.siteName ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
        />
        {errors.siteName && (
          <p className="mt-1 text-sm text-red-600">{errors.siteName.message}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="siteUrl" className="block text-sm font-medium text-gray-700">
          Site URL
        </label>
        <input
          type="url"
          id="siteUrl"
          defaultValue={settings.siteUrl || ''}
          {...register('siteUrl', { 
            required: 'Site URL is required',
            pattern: {
              value: /^https?:\/\/.+/,
              message: 'Please enter a valid URL with http:// or https://'
            }
          })}
          className={`mt-1 block w-full border ${errors.siteUrl ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
        />
        {errors.siteUrl && (
          <p className="mt-1 text-sm text-red-600">{errors.siteUrl.message}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-700">
          Admin Email
        </label>
        <input
          type="email"
          id="adminEmail"
          defaultValue={settings.adminEmail || ''}
          {...register('adminEmail', { 
            required: 'Admin email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Please enter a valid email address'
            }
          })}
          className={`mt-1 block w-full border ${errors.adminEmail ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
        />
        {errors.adminEmail && (
          <p className="mt-1 text-sm text-red-600">{errors.adminEmail.message}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
          Timezone
        </label>
        <select
          id="timezone"
          defaultValue={settings.timezone || ''}
          {...register('timezone', { required: 'Timezone is required' })}
          className={`mt-1 block w-full border ${errors.timezone ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
        >
          <option value="">Select a timezone</option>
          <option value="UTC">UTC</option>
          <option value="America/New_York">Eastern Time (ET)</option>
          <option value="America/Chicago">Central Time (CT)</option>
          <option value="America/Denver">Mountain Time (MT)</option>
          <option value="America/Los_Angeles">Pacific Time (PT)</option>
        </select>
        {errors.timezone && (
          <p className="mt-1 text-sm text-red-600">{errors.timezone.message}</p>
        )}
      </div>
    </div>
    
    <div>
      <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700">
        Site Description
      </label>
      <textarea
        id="siteDescription"
        rows={3}
        defaultValue={settings.siteDescription || ''}
        {...register('siteDescription')}
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        placeholder="A brief description of your application"
      />
    </div>
    
    <div className="flex items-start">
      <div className="flex items-center h-5">
        <input
          id="maintenanceMode"
          type="checkbox"
          defaultChecked={settings.maintenanceMode || false}
          {...register('maintenanceMode')}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
      </div>
      <div className="ml-3 text-sm">
        <label htmlFor="maintenanceMode" className="font-medium text-gray-700">
          Maintenance Mode
        </label>
        <p className="text-gray-500">When enabled, only administrators can access the site.</p>
      </div>
    </div>
  </div>
);

const SecuritySettings = ({ register, errors, settings }) => (
  <div className="space-y-6">
    <div>
      <h3 className="text-lg font-medium leading-6 text-gray-900">Security Settings</h3>
      <p className="mt-1 text-sm text-gray-500">Configure your application's security settings.</p>
    </div>
    
    <div className="space-y-6">
      <div>
        <h4 className="text-md font-medium text-gray-900 mb-3">Password Policy</h4>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="requireStrongPasswords"
                type="checkbox"
                defaultChecked={settings.requireStrongPasswords || false}
                {...register('requireStrongPasswords')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="requireStrongPasswords" className="font-medium text-gray-700">
                Require Strong Passwords
              </label>
              <p className="text-gray-500">Enforce password complexity requirements</p>
            </div>
          </div>
          
          <div className="pl-7">
            <label htmlFor="passwordExpiryDays" className="block text-sm font-medium text-gray-700">
              Password Expiry (days)
            </label>
            <input
              type="number"
              id="passwordExpiryDays"
              min="0"
              defaultValue={settings.passwordExpiryDays || 90}
              {...register('passwordExpiryDays', { min: 0 })}
              className="mt-1 block w-32 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            <p className="mt-1 text-xs text-gray-500">Set to 0 to disable password expiry</p>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-md font-medium text-gray-900 mb-3">Two-Factor Authentication</h4>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="enable2FA"
                type="checkbox"
                defaultChecked={settings.enable2FA || false}
                {...register('enable2FA')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="enable2FA" className="font-medium text-gray-700">
                Enable Two-Factor Authentication (2FA)
              </label>
              <p className="text-gray-500">Require users to verify their identity using a second factor</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const NotificationSettings = ({ register, errors, settings }) => (
  <div className="space-y-6">
    <div>
      <h3 className="text-lg font-medium leading-6 text-gray-900">Notification Settings</h3>
      <p className="mt-1 text-sm text-gray-500">Configure your application's notification settings.</p>
    </div>
    
    <div className="space-y-6">
      <div>
        <h4 className="text-md font-medium text-gray-900 mb-3">Email Notifications</h4>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="emailNotificationsEnabled"
                type="checkbox"
                defaultChecked={settings.emailNotificationsEnabled || false}
                {...register('emailNotificationsEnabled')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="emailNotificationsEnabled" className="font-medium text-gray-700">
                Enable Email Notifications
              </label>
              <p className="text-gray-500">Allow the system to send email notifications</p>
            </div>
          </div>
          
          <div className="pl-7 space-y-4">
            <div>
              <label htmlFor="fromEmail" className="block text-sm font-medium text-gray-700">
                From Email Address
              </label>
              <input
                type="email"
                id="fromEmail"
                defaultValue={settings.fromEmail || ''}
                {...register('fromEmail', {
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Please enter a valid email address'
                  }
                })}
                className={`mt-1 block w-full border ${errors.fromEmail ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="noreply@example.com"
              />
              {errors.fromEmail && (
                <p className="mt-1 text-sm text-red-600">{errors.fromEmail.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const PaymentSettings = ({ register, errors, settings }) => (
  <div className="space-y-6">
    <div>
      <h3 className="text-lg font-medium leading-6 text-gray-900">Payment Settings</h3>
      <p className="mt-1 text-sm text-gray-500">Configure your application's payment settings.</p>
    </div>
    
    <div className="space-y-6">
      <div>
        <h4 className="text-md font-medium text-gray-900 mb-3">Payment Gateway</h4>
        <div className="space-y-4">
          <div>
            <label htmlFor="paymentGateway" className="block text-sm font-medium text-gray-700">
              Payment Gateway
            </label>
            <select
              id="paymentGateway"
              defaultValue={settings.paymentGateway || 'stripe'}
              {...register('paymentGateway')}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="stripe">Stripe</option>
              <option value="paypal">PayPal</option>
              <option value="none">None (Disable Payments)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const IntegrationSettings = ({ register, errors, settings }) => (
  <div className="space-y-6">
    <div>
      <h3 className="text-lg font-medium leading-6 text-gray-900">Integrations</h3>
      <p className="mt-1 text-sm text-gray-500">Connect with third-party services.</p>
    </div>
    
    <div className="space-y-6">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex items-center justify-between">
          <div>
            <h4 className="text-md font-medium text-gray-900">Google Analytics</h4>
            <p className="mt-1 text-sm text-gray-500">Track visitor behavior and traffic sources</p>
          </div>
          <button
            type="button"
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              settings.googleAnalytics?.enabled ? 'bg-blue-600' : 'bg-gray-200'
            }`}
            role="switch"
            onClick={() => {
              // Toggle functionality would be implemented here
            }}
          >
            <span
              aria-hidden="true"
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                settings.googleAnalytics?.enabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
        {settings.googleAnalytics?.enabled && (
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="gaTrackingId" className="block text-sm font-medium text-gray-700">
                  Tracking ID
                </label>
                <input
                  type="text"
                  id="gaTrackingId"
                  defaultValue={settings.googleAnalytics?.trackingId || ''}
                  {...register('gaTrackingId')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="UA-XXXXXXXXX-X"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default Settings;
