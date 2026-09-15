import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';
import { HealthResponse } from '../types/api';

export function useApiStatus() {
  const [isConnected, setIsConnected] = useState<boolean>(apiService.isBackendConnected());
  const [baseUrl, setBaseUrlState] = useState<string>(apiService.getBaseUrl());
  const [healthData, setHealthData] = useState<HealthResponse | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkStatus = useCallback(async () => {
    setIsChecking(true);
    try {
      const health = await apiService.checkHealth();
      setHealthData(health);
      setIsConnected(apiService.isBackendConnected());
      setLastCheck(new Date());
    } finally {
      setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    // Initial check
    checkStatus();

    // Subscribe to apiService connection updates
    const unsubscribe = apiService.subscribeConnection((connected, url) => {
      setIsConnected(connected);
      setBaseUrlState(url);
    });

    // Periodic gentle heartbeat every 30 seconds
    const interval = setInterval(() => {
      checkStatus();
    }, 30000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [checkStatus]);

  const updateBaseUrl = (newUrl: string) => {
    apiService.setBaseUrl(newUrl);
    setBaseUrlState(newUrl);
    checkStatus();
  };

  return {
    isConnected,
    baseUrl,
    healthData,
    isChecking,
    lastCheck,
    refreshStatus: checkStatus,
    updateBaseUrl
  };
}
