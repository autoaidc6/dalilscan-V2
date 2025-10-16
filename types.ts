
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

export interface Badge {
  id: string;
  nameKey: string;
  descriptionKey: string;
  icon: string; // Name of the icon component
}

export type ChallengeMetric = 'calories' | 'water' | 'meals';

export interface Challenge {
  id: string;
  titleKey: string;
  metric: ChallengeMetric;
  goal: number;
}
