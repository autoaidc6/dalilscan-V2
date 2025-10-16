import React, { createContext, useState, useContext, ReactNode, useEffect, useMemo, useCallback } from 'react';
import type { Meal, WaterLog, LogEntry } from '../types';
import { useUser } from './UserContext';
import { useToast } from './ToastContext';
import { useI18n } from './I18nContext';

interface WeekChartData {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
}

interface LogContextType {
  logEntries: LogEntry[];
  addMeal: (meal: Meal) => void;
  updateMeal: (updatedMeal: Meal) => void;
  addWaterEntry: () => void;
  resetLog: () => void;
  totalCaloriesToday: number;
  totalMacrosToday: { protein: number; carbs: number; fat: number };
  totalWaterToday: number;
  weekChartData: WeekChartData[];
}

const LogContext = createContext<LogContextType | undefined>(undefined);

export const LogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [logEntries, setLogEntries] = useState<LogEntry[]>(() => {
    try {
      const storedLog = localStorage.getItem('dalilscan-log');
      if (storedLog) {
        // We need to parse dates back into Date objects
        return JSON.parse(storedLog).map((entry: any) => ({
          ...entry,
          timestamp: new Date(entry.timestamp),
        }));
      }
    } catch (error) {
      console.error("Failed to parse log from localStorage", error);
    }
    return [];
  });

  const { user, updateUser } = useUser();
  const { showToast } = useToast();
  const { t, language } = useI18n();


  useEffect(() => {
    try {
      localStorage.setItem('dalilscan-log', JSON.stringify(logEntries));
    } catch (error) {
      console.error("Failed to save log to localStorage", error);
    }
  }, [logEntries]);

  const performGamificationUpdate = useCallback((isNewMeal: boolean) => {
    const today = new Date().toISOString().split('T')[0];
    let updatedFields: Partial<typeof user> = {};
    let currentBadges = [...user.earnedBadges];
    let currentPoints = user.points;

    // --- Streak Logic ---
    if (user.lastLogDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      const newStreak = user.lastLogDate === yesterday ? user.streak + 1 : 1;
      currentPoints += 10;
      updatedFields = { ...updatedFields, streak: newStreak, lastLogDate: today };
      
      if (newStreak >= 3 && !currentBadges.includes('streak_3')) {
          currentBadges.push('streak_3');
          currentPoints += 30;
          showToast(t('badgeUnlocked', { name: t('badgeNameStreak3') }), 'success');
      }
      if (newStreak >= 7 && !currentBadges.includes('streak_7')) {
          currentBadges.push('streak_7');
          currentPoints += 70;
          showToast(t('badgeUnlocked', { name: t('badgeNameStreak7') }), 'success');
      }
    }

    // --- First Scan Badge ---
    if (isNewMeal && !currentBadges.includes('first_scan')) {
      currentBadges.push('first_scan');
      currentPoints += 20;
      showToast(t('badgeUnlocked', { name: t('badgeNameFirstScan') }), 'success');
    }
    
    updatedFields.points = currentPoints;
    updatedFields.earnedBadges = currentBadges;

    if (Object.keys(updatedFields).length > 0) {
      updateUser(updatedFields);
    }
  }, [user, updateUser, showToast, t]);

  const addMeal = useCallback((meal: Meal) => {
    setLogEntries(prevEntries => [...prevEntries, meal]);
    performGamificationUpdate(true);
  }, [performGamificationUpdate]);

  const updateMeal = useCallback((updatedMeal: Meal) => {
    setLogEntries(prevEntries =>
      prevEntries.map(entry => (entry.id === updatedMeal.id ? updatedMeal : entry))
    );
  }, []);
  
  const addWaterEntry = useCallback(() => {
    const newWaterLog: WaterLog = {
      type: 'Water',
      id: new Date().toISOString(),
      amount: 250,
      timestamp: new Date()
    };
    setLogEntries(prevEntries => [...prevEntries, newWaterLog]);
    performGamificationUpdate(false);
  }, [performGamificationUpdate]);

  const resetLog = useCallback(() => {
    setLogEntries([]);
  }, []);

  const { totalCaloriesToday, totalMacrosToday, totalWaterToday } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaysEntries = logEntries.filter(entry => entry.timestamp >= today);
    
    const todaysMeals = todaysEntries.filter((e): e is Meal => e.type === 'Meal');
    const todaysWaterLogs = todaysEntries.filter((e): e is WaterLog => e.type === 'Water');

    const calories = todaysMeals.reduce((sum, meal) => sum + meal.calories, 0);
    const macros = todaysMeals.reduce((sum, meal) => ({
      protein: sum.protein + meal.protein,
      carbs: sum.carbs + meal.carbs,
      fat: sum.fat + meal.fat,
    }), { protein: 0, carbs: 0, fat: 0 });
    const water = todaysWaterLogs.reduce((sum, log) => sum + log.amount, 0);

    return { totalCaloriesToday: calories, totalMacrosToday: macros, totalWaterToday: water };
  }, [logEntries]);
  
  const weekChartData = useMemo(() => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        return d;
    }).reverse();

    return last7Days.map(date => {
        const dayStr = date.toLocaleDateString(language, { weekday: 'short' });
        const entriesForDay = logEntries.filter(entry => entry.timestamp.toDateString() === date.toDateString());
        const mealsForDay = entriesForDay.filter((e): e is Meal => e.type === 'Meal');
        
        const calories = mealsForDay.reduce((sum, meal) => sum + meal.calories, 0);
        const protein = mealsForDay.reduce((sum, meal) => sum + meal.protein, 0);
        const carbs = mealsForDay.reduce((sum, meal) => sum + meal.carbs, 0);
        const fat = mealsForDay.reduce((sum, meal) => sum + meal.fat, 0);
        
        return { name: dayStr, calories, protein, carbs, fat };
    });
  }, [logEntries, language]);

  const value = useMemo(() => ({ 
    logEntries, 
    addMeal, 
    updateMeal, 
    addWaterEntry, 
    resetLog,
    totalCaloriesToday, 
    totalMacrosToday, 
    totalWaterToday,
    weekChartData
  }), [logEntries, addMeal, updateMeal, addWaterEntry, resetLog, totalCaloriesToday, totalMacrosToday, totalWaterToday, weekChartData]);

  return (
    <LogContext.Provider value={value}>
      {children}
    </LogContext.Provider>
  );
};

export const useLog = (): LogContextType => {
  const context = useContext(LogContext);
  if (!context) {
    throw new Error('useLog must be used within a LogProvider');
  }
  return context;
};