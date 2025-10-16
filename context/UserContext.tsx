import React, { createContext, useState, useContext, ReactNode, useMemo, useCallback, useEffect } from 'react';

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
  streak: number;
  lastLogDate: string | null;
  earnedBadges: string[];
  points: number;
}

interface UserContextType {
  user: User;
  updateUser: (user: Partial<User>) => void;
  resetUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const initialUser: User = {
  name: 'Guest',
  email: 'guest@dalilscan.app',
  calorieGoal: 2000,
  proteinGoal: 150,
  carbsGoal: 250,
  fatGoal: 65,
  waterGoal: 2000,
  weight: 70,
  height: 180,
  age: 30,
  activityLevel: 'moderate',
  avatarInitial: 'G',
  streak: 0,
  lastLogDate: null,
  earnedBadges: [],
  points: 0,
};

// Helper function to safely parse the avatar initial
const getAvatarInitial = (name: string) => (name ? name.charAt(0).toUpperCase() : 'G');

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(() => {
    try {
      const storedUser = localStorage.getItem('dalilscan-user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        // Ensure avatar initial is correctly set on load
        parsedUser.avatarInitial = getAvatarInitial(parsedUser.name);
        // ensure gamification fields exist
        return { ...initialUser, ...parsedUser };
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
    }
    return initialUser;
  });

  useEffect(() => {
    try {
      localStorage.setItem('dalilscan-user', JSON.stringify(user));
    } catch (error) {
      console.error("Failed to save user to localStorage", error);
    }
  }, [user]);

  const updateUser = useCallback((updatedFields: Partial<User>) => {
    setUser(prevUser => {
      const newUser = { ...prevUser, ...updatedFields };
      // If the name is updated, also update the avatar initial
      if (updatedFields.name) {
        newUser.avatarInitial = getAvatarInitial(updatedFields.name);
      }
      return newUser;
    });
  }, []);

  const resetUser = useCallback(() => {
    setUser(initialUser);
  }, []);

  const value = useMemo(() => ({ user, updateUser, resetUser }), [user, updateUser, resetUser]);

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