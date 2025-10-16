import React, { createContext, useState, useContext, ReactNode, useMemo, useCallback } from 'react';

interface User {
  name: string;
  email: string;
  calorieGoal: number;
  proteinGoal: number;
  carbsGoal: number;
  fatGoal: number;
  waterGoal: number;
  weight: number;
  height: number;
  age: number;
  activityLevel: string;
  avatarInitial: string;
}

interface UserContextType {
  user: User;
  updateUser: (user: Partial<User>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>({
    name: 'eddie eChu',
    email: 'autoadic6@gmail.com',
    calorieGoal: 2000,
    proteinGoal: 150,
    carbsGoal: 250,
    fatGoal: 65,
    waterGoal: 2000,
    weight: 70,
    height: 189,
    age: 30,
    activityLevel: 'moderate',
    avatarInitial: 'E',
  });

  const updateUser = useCallback((updatedUser: Partial<User>) => {
    setUser(prevUser => ({ ...prevUser, ...updatedUser }));
  }, []);

  const value = useMemo(() => ({ user, updateUser }), [user, updateUser]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};