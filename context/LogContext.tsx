import React, { createContext, useState, useContext, ReactNode } from 'react';
import type { Meal } from '../types';

interface LogContextType {
  loggedMeals: Meal[];
  addMeal: (meal: Meal) => void;
  totalCaloriesToday: number;
  totalMacrosToday: { protein: number; carbs: number; fat: number };
}

const LogContext = createContext<LogContextType | undefined>(undefined);

const mockLog: Meal[] = [];

export const LogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loggedMeals, setLoggedMeals] = useState<Meal[]>(mockLog);

  const addMeal = (meal: Meal) => {
    setLoggedMeals(prevMeals => [...prevMeals, meal]);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todaysMeals = loggedMeals.filter(meal => meal.timestamp >= today);

  const totalCaloriesToday = todaysMeals.reduce((sum, meal) => sum + meal.calories, 0);
  const totalMacrosToday = todaysMeals.reduce((sum, meal) => ({
    protein: sum.protein + meal.protein,
    carbs: sum.carbs + meal.carbs,
    fat: sum.fat + meal.fat,
  }), { protein: 0, carbs: 0, fat: 0 });

  return (
    <LogContext.Provider value={{ loggedMeals, addMeal, totalCaloriesToday, totalMacrosToday }}>
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
