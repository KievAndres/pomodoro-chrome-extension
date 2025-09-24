import { DEFAULT_POMODORO_CONFIG } from '@shared/config/defaults';
import { PomodoroConfig } from '@shared/interfaces/PomodoroConfig';
import { configUtils } from '@shared/utils/config';
import { useEffect, useState } from 'react';
export const usePomodoroConfig = () => {
  const [config, setConfig] = useState<PomodoroConfig>(DEFAULT_POMODORO_CONFIG);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      setLoading(true);
      setError(null);
      const configData = await configUtils.getConfig();
      setConfig(configData);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error loading config');
      console.error('Error loading config:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async (newConfig: PomodoroConfig) => {
    try {
      setError(null);
      await configUtils.saveConfig(newConfig);
      setConfig(newConfig);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error saving config');
      console.error('Error saving config:', error);
    }
  };

  const resetConfig = async () => {
    try {
      setError(null);
      await configUtils.resetConfig();
      await loadConfig();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error resetting config');
      console.error('Error resetting config:', error);
      throw error;
    }
  };

  return {
    config,
    loading,
    error,
    saveConfig,
    resetConfig,
    loadConfig,
  };
};
