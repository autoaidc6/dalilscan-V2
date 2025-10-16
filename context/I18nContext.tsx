import React, { createContext, useState, useContext, ReactNode, useCallback, useMemo } from 'react';

// By embedding the translations directly, we avoid module resolution issues
// with JSON files in certain environments.
const enTranslations = {
  appName: "DalilScan",
  appSubtitle: "Smart Nutrition Tracking",
  onboardingTitle: "Your AI Nutrition Guide",
  onboardingSubtitle: "Snap a food photo, instantly analyze its nutrition, and track your daily goals.",
  selectLanguage: "Select your language",
  signInWithGoogle: "Sign in with Google",
  continue: "Continue as Guest",
  logout: "Logout",
  guestName: "Guest",
  navDashboard: "Dashboard",
  navScan: "Scan Food",
  navHistory: "History",
  navGoals: "Goals",
  navProfile: "Profile",
  navInsights: "Insights",
  scanYourFoodTitle: "Scan Your Food",
  scanYourFoodSubtitle: "Here's your nutritional summary for today.",
  dashboardWelcome: "Welcome, {name}!",
  scanFood: "Scan Food",
  todaysSummary: "Today's Summary",
  dailyCalories: "Daily Calories",
  consumed: "Consumed",
  remaining: "Remaining",
  goal: "Goal",
  macroDistribution: "Macro Distribution",
  waterIntake: "Water Intake",
  addGlass: "Add Glass (250ml)",
  ml: "ml",
  protein: "Protein",
  carbs: "Carbs",
  fat: "Fat",
  scanTitle: "Analyze Your Meal",
  scanSubtitle: "Confirm the image to get nutritional insights.",
  analyzeMeal: "Analyze Meal",
  analyzing: "Analyzing...",
  logMeal: "Log Meal",
  errorNoImage: "Please capture an image first.",
  errorAnalysis: "Sorry, I couldn't analyze that image. Please try another one.",
  errorCamera: "Could not access camera. Please check permissions.",
  errorCameraPermissionDenied: "Camera access was denied. Please go to your browser settings and allow camera access for this site.",
  errorCameraGeneric: "An unexpected error occurred while accessing the camera. Please try again.",
  errorCameraNotFound: "No camera was found on your device. Please ensure one is connected and enabled.",
  errorCameraTitle: "Camera Error",
  takePicture: "Take a photo",
  capture: "Capture",
  cancel: "Cancel",
  uploadImage: "Upload Image",
  retake: "Retake",
  historyTitle: "Meal History",
  historySubtitle: "A log of all your tracked meals.",
  historyAll: "All",
  historyBreakfast: "Breakfast",
  historyLunch: "Lunch",
  historyDinner: "Dinner",
  historySnack: "Snack",
  kcal: "kcal",
  noHistory: "No meals logged yet. Use the scan tab to add one!",
  profileTitle: "Profile",
  profileSubtitle: "Manage your personal details and goals.",
  name: "Name",
  calorieGoal: "Daily Calorie Goal",
  saveChanges: "Save Changes",
  profileSaved: "Profile saved successfully!",
  goalsSaved: "Goals saved successfully!",
  saveError: "Could not save. Please try again.",
  calories: "Calories",
  nutritionGoalsTitle: "Nutrition Goals",
  nutritionGoalsSubtitle: "Set your daily targets",
  dailyTargets: "Daily Targets",
  dailyProtein: "Daily Protein (g)",
  dailyCarbs: "Daily Carbs (g)",
  dailyFat: "Daily Fat (g)",
  dailyWater: "Daily Water (ml)",
  personalInformation: "Personal Information",
  weightKg: "Weight (kg)",
  heightCm: "Height (cm)",
  age: "Age",
  activityLevel: "Activity Level",
  activityLevelSedentary: "Sedentary",
  activityLevelLight: "Lightly Active",
  activityLevelModerate: "Moderately Active",
  activityLevelActive: "Active",
  activityLevelVeryActive: "Very Active",
  saveGoals: "Save Goals",
  editMeal: "Edit Meal",
  dayStreak: "Day Streak",
  points: "Points",
  dailyChallenge: "Daily Challenge",
  insightsTitle: "Your Insights",
  insightsSubtitle: "Track your progress and see how you rank!",
  weeklyReport: "Weekly Report",
  leaderboard: "Leaderboard",
  rank: "Rank",
  user: "User",
  caloriesPerDay: "Calories per Day",
  macrosPerDay: "Macros per Day (g)",
  badgeUnlocked: "Badge Unlocked: {name}!",
  badgeNameFirstScan: "First Scan!",
  badgeDescFirstScan: "Log your very first meal.",
  badgeNameStreak3: "On a Roll",
  badgeDescStreak3: "Maintain a 3-day streak.",
  badgeNameStreak7: "Week Warrior",
  badgeDescStreak7: "Maintain a 7-day streak.",
  myBadges: "My Badges",
  challengeTitleDrinkWater: "Hydration Challenge",
  challengeTitleLogMeals: "Consistent Logger",
  challengeTitleStayUnderKcal: "Calorie Control",
  challengeDescDrinkWater: "Drink at least {goal}ml of water.",
  challengeDescLogMeals: "Log at least {goal} meals.",
  challengeDescStayUnderKcal: "Stay under {goal} kcal.",
};

const arTranslations = {
  appName: "دليل سكان",
  appSubtitle: "تتبع التغذية الذكي",
  onboardingTitle: "دليلك الغذائي الذكي",
  onboardingSubtitle: "التقط صورة لطعامك، وحلل مكوناته الغذائية فورًا، وتتبع أهدافك اليومية.",
  selectLanguage: "اختر لغتك",
  signInWithGoogle: "تسجيل الدخول باستخدام جوجل",
  continue: "المتابعة كضيف",
  logout: "تسجيل الخروج",
  guestName: "ضيف",
  navDashboard: "الرئيسية",
  navScan: "مسح الطعام",
  navHistory: "السجل",
  navGoals: "الأهداف",
  navProfile: "ملفي",
  navInsights: "إحصائياتي",
  scanYourFoodTitle: "مسح طعامك",
  scanYourFoodSubtitle: "هذا هو ملخصك الغذائي لليوم.",
  dashboardWelcome: "أهلاً، {name}!",
  scanFood: "مسح الطعام",
  todaysSummary: "ملخص اليوم",
  dailyCalories: "السعرات الحرارية اليومية",
  consumed: "المستهلك",
  remaining: "المتبقي",
  goal: "الهدف",
  macroDistribution: "توزيع المغذيات الكبرى",
  waterIntake: "كمية الماء",
  addGlass: "أضف كوب (250 مل)",
  ml: "مل",
  protein: "بروتين",
  carbs: "كربوهيدرات",
  fat: "دهون",
  scanTitle: "تحليل وجبتك",
  scanSubtitle: "أكّد الصورة للحصول على معلوماتها الغذائية.",
  analyzeMeal: "تحليل الوجبة",
  analyzing: "جاري التحليل...",
  logMeal: "تسجيل الوجبة",
  errorNoImage: "يرجى التقاط صورة أولاً.",
  errorAnalysis: "عذرًا، لم أتمكن من تحليل هذه الصورة. يجربة صورة أخرى.",
  errorCamera: "تعذر الوصول إلى الكاميرا. يرجى التحقق من الأذونات.",
  errorCameraPermissionDenied: "تم رفض الوصول إلى الكاميرا. يرجى الانتقال إلى إعدادات متصفحك والسماح بالوصول إلى الكاميرا لهذا الموقع.",
  errorCameraGeneric: "حدث خطأ غير متوقع أثناء الوصول إلى الكاميرا. الرجاء المحاولة مرة أخرى.",
  errorCameraNotFound: "لم يتم العثور على كاميرا على جهازك. يرجى التأكد من توصيل واحدة وتمكينها.",
  errorCameraTitle: "خطأ في الكاميرا",
  takePicture: "التقط صورة",
  capture: "التقاط",
  cancel: "إلغاء",
  uploadImage: "رفع صورة",
  retake: "إعادة",
  historyTitle: "سجل الوجبات",
  historySubtitle: "سجل بجميع وجباتك التي تتبعتها.",
  historyAll: "الكل",
  historyBreakfast: "فطور",
  historyLunch: "غداء",
  historyDinner: "عشاء",
  historySnack: "وجبة خفيفة",
  kcal: "سعر حراري",
  noHistory: "لم يتم تسجيل أي وجبات بعد. استخدم علامة التبويب 'مسح' لإضافة واحدة!",
  profileTitle: "الملف الشخصي",
  profileSubtitle: "إدارة تفاصيلك الشخصية وأهدافك.",
  name: "الاسم",
  calorieGoal: "هدف السعرات الحرارية اليومي",
  saveChanges: "حفظ التغييرات",
  profileSaved: "تم حفظ الملف الشخصي بنجاح!",
  goalsSaved: "تم حفظ الأهداف بنجاح!",
  saveError: "تعذر الحفظ. يرجى المحاولة مرة أخرى.",
  calories: "سعرات حرارية",
  nutritionGoalsTitle: "الأهداف الغذائية",
  nutritionGoalsSubtitle: "حدد أهدافك اليومية",
  dailyTargets: "الأهداف اليومية",
  dailyProtein: "البروتين اليومي (جم)",
  dailyCarbs: "الكربوهيدرات اليومية (جم)",
  dailyFat: "الدهون اليومية (جم)",
  dailyWater: "الماء اليومي (مل)",
  personalInformation: "المعلومات الشخصية",
  weightKg: "الوزن (كجم)",
  heightCm: "الطول (سم)",
  age: "العمر",
  activityLevel: "مستوى النشاط",
  activityLevelSedentary: "خامل",
  activityLevelLight: "نشاط خفيف",
  activityLevelModerate: "نشاط معتدل",
  activityLevelActive: "نشيط",
  activityLevelVeryActive: "نشيط جداً",
  saveGoals: "حفظ الأهداف",
  editMeal: "تعديل الوجبة",
  dayStreak: "أيام متتالية",
  points: "نقاط",
  dailyChallenge: "تحدي اليوم",
  insightsTitle: "إحصائياتك",
  insightsSubtitle: "تتبع تقدمك وانظر كيف ترتيبك!",
  weeklyReport: "التقرير الأسبوعي",
  leaderboard: "لوحة المتصدرين",
  rank: "الترتيب",
  user: "المستخدم",
  caloriesPerDay: "السعرات الحرارية في اليوم",
  macrosPerDay: "المغذيات الكبرى في اليوم (جم)",
  badgeUnlocked: "تم فتح الشارة: {name}!",
  badgeNameFirstScan: "المسح الأول!",
  badgeDescFirstScan: "سجل وجبتك الأولى.",
  badgeNameStreak3: "على الطريق الصحيح",
  badgeDescStreak3: "حافظ على 3 أيام متتالية.",
  badgeNameStreak7: "محارب الأسبوع",
  badgeDescStreak7: "حافظ على 7 أيام متتالية.",
  myBadges: "شاراتي",
  challengeTitleDrinkWater: "تحدي الترطيب",
  challengeTitleLogMeals: "المسجل المستمر",
  challengeTitleStayUnderKcal: "التحكم في السعرات",
  challengeDescDrinkWater: "اشرب {goal} مل من الماء على الأقل.",
  challengeDescLogMeals: "سجل {goal} وجبات على الأقل.",
  challengeDescStayUnderKcal: "ابقَ تحت {goal} سعر حراري.",
};


type Language = 'en' | 'ar';
type Direction = 'ltr' | 'rtl';

interface I18nContextType {
  language: Language;
  dir: Direction;
  t: (key: string, options?: { [key: string]: string | number }) => string;
  changeLanguage: (lang: Language) => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const resources = {
  en: { translation: enTranslations },
  ar: { translation: arTranslations },
};

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const storedLang = localStorage.getItem('dalilscan-lang');
      if (storedLang === 'ar' || storedLang === 'en') {
        return storedLang;
      }
    } catch (e) { console.error(e); }
    const detectedLang = navigator.language;
    return detectedLang.startsWith('ar') ? 'ar' : 'en';
  });

  const changeLanguage = useCallback((lang: Language) => {
    setLanguage(lang);
    try {
      localStorage.setItem('dalilscan-lang', lang);
    } catch (e) { console.error(e); }
  }, []);

  const t = useCallback((key: string, options?: { [key: string]: string | number }): string => {
    const translationKey = key as keyof typeof enTranslations;
    let translation = (resources[language]?.translation?.[translationKey]) || key;
    if (options) {
      Object.keys(options).forEach(optKey => {
        translation = translation.replace(`{${optKey}}`, String(options[optKey]));
      });
    }
    return translation;
  }, [language]);

  const dir = useMemo<Direction>(() => (language === 'ar' ? 'rtl' : 'ltr'), [language]);

  const value = { language, dir, t, changeLanguage };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};