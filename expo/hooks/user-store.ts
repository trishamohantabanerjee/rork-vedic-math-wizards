import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { User, UserRole } from '@/types/user';
import { ModuleProgress } from '@/types/module';

const STORAGE_KEYS = {
  USER: 'vedic_math_user',
  PROGRESS: 'vedic_math_progress',
};

export const [UserProvider, useUser] = createContextHook(() => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [moduleProgress, setModuleProgress] = useState<ModuleProgress[]>([]);

  const loadUserData = useCallback(async () => {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      const progressData = await AsyncStorage.getItem(STORAGE_KEYS.PROGRESS);
      
      if (userData) {
        setUser(JSON.parse(userData));
      }
      if (progressData) {
        setModuleProgress(JSON.parse(progressData));
      }
    } catch (error) {
      console.log('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const createUser = useCallback(async (name: string, role: UserRole, avatar?: string) => {
    const newUser: User = {
      id: Date.now().toString(),
      name,
      role,
      avatar,
      points: 0,
      level: 1,
      streak: 0,
      completedModules: [],
      badges: [],
      hasPremiumAccess: false,
    };

    setUser(newUser);
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
    return newUser;
  }, []);

  const updateUserPoints = useCallback(async (points: number) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      points: user.points + points,
      level: Math.floor((user.points + points) / 500) + 1,
    };

    setUser(updatedUser);
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
  }, [user]);

  const completeModule = useCallback(async (moduleId: string) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      completedModules: [...user.completedModules, moduleId],
    };

    setUser(updatedUser);
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
  }, [user]);

  const updateModuleProgress = useCallback(async (progress: ModuleProgress) => {
    const existingIndex = moduleProgress.findIndex(p => p.moduleId === progress.moduleId);
    let updatedProgress;

    if (existingIndex >= 0) {
      updatedProgress = [...moduleProgress];
      updatedProgress[existingIndex] = progress;
    } else {
      updatedProgress = [...moduleProgress, progress];
    }

    setModuleProgress(updatedProgress);
    await AsyncStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(updatedProgress));
  }, [moduleProgress]);

  const getModuleProgress = useCallback((moduleId: string): ModuleProgress | undefined => {
    return moduleProgress.find(p => p.moduleId === moduleId);
  }, [moduleProgress]);

  const purchasePremium = useCallback(async () => {
    if (!user) return false;

    const updatedUser = {
      ...user,
      hasPremiumAccess: true,
      purchaseDate: new Date().toISOString(),
    };

    setUser(updatedUser);
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
    return true;
  }, [user]);

  const logout = useCallback(async () => {
    setUser(null);
    setModuleProgress([]);
    await AsyncStorage.multiRemove([STORAGE_KEYS.USER, STORAGE_KEYS.PROGRESS]);
  }, []);

  return useMemo(() => ({
    user,
    isLoading,
    moduleProgress,
    createUser,
    updateUserPoints,
    completeModule,
    updateModuleProgress,
    getModuleProgress,
    purchasePremium,
    logout,
  }), [user, isLoading, moduleProgress, createUser, updateUserPoints, completeModule, updateModuleProgress, getModuleProgress, purchasePremium, logout]);
});