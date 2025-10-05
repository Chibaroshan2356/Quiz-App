import { useState, useEffect } from 'react';
import { dashboardAPI } from '../services/dashboardAPI';

export const useDashboardData = () => {
  const [data, setData] = useState({
    stats: null,
    recentActivity: [],
    chartData: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all dashboard data in parallel
      const [stats, recentActivity, chartData] = await Promise.all([
        dashboardAPI.getDashboardStats(),
        dashboardAPI.getRecentActivity(),
        dashboardAPI.getChartData()
      ]);

      setData({
        stats,
        recentActivity,
        chartData
      });
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    fetchDashboardData();
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    data,
    loading,
    error,
    refreshData
  };
};

export default useDashboardData;
