
export type MealCategory = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';

export interface Meal {
  type: 'Meal';
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  timestamp: Date;
  image?: string;
  mealType: MealCategory;
}

export interface WaterLog {
  type: 'Water';
  id: string;
  amount: number; // in ml
  timestamp: Date;
}

export type LogEntry = Meal | WaterLog;
