import type { Challenge } from '../types';

const challenges: Challenge[] = [
  { id: 'drink_water', titleKey: 'challengeDescDrinkWater', metric: 'water', goal: 2000 },
  { id: 'log_meals', titleKey: 'challengeDescLogMeals', metric: 'meals', goal: 3 },
  { id: 'stay_under_kcal', titleKey: 'challengeDescStayUnderKcal', metric: 'calories', goal: 2000 },
];

/**
 * Gets a new challenge for the day based on the day of the year.
 * This ensures every user gets the same challenge on the same day,
 * and that it changes daily.
 */
export const getDailyChallenge = (): Challenge => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = (now.getTime() - start.getTime()) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  
  return challenges[dayOfYear % challenges.length];
};
