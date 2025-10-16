import React, { createContext, useState, useContext, ReactNode, useEffect, useMemo, useCallback } from 'react';
import type { Meal, WaterLog, LogEntry } from '../types';

interface LogContextType {
  logEntries: LogEntry[];
  addMeal: (meal: Meal) => void;
  updateMeal: (updatedMeal: Meal) => void;
  addWaterEntry: () => void;
  resetLog: () => void;
  totalCaloriesToday: number;
  totalMacrosToday: { protein: number; carbs: number; fat: number };
  totalWaterToday: number;
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

  useEffect(() => {
    try {
      localStorage.setItem('dalilscan-log', JSON.stringify(logEntries));
    } catch (error) {
      console.error("Failed to save log to localStorage", error);
    }
  }, [logEntries]);

  const addMeal = useCallback((meal: Meal) => {
    setLogEntries(prevEntries => [...prevEntries, meal]);
  }, []);

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
  }, []);

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

  const value = useMemo(() => ({ 
    logEntries, 
    addMeal, 
    updateMeal, 
    addWaterEntry, 
    resetLog,
    totalCaloriesToday, 
    totalMacrosToday, 
    totalWaterToday 
  }), [logEntries, addMeal, updateMeal, addWaterEntry, resetLog, totalCaloriesToday, totalMacrosToday, totalWaterToday]);

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
