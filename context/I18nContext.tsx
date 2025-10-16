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
  navDashboard: "Dashboard",
  navScan: "Scan Food",
  navHistory: "History",
  navGoals: "Goals",
  navProfile: "Profile",
  scanYourFoodTitle: "Scan Your Food",
  scanYourFoodSubtitle: "Take a photo or upload an image to track nutrition",
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
};

const arTranslations = {
  appName: "دليل سكان",
  appSubtitle: "تتبع التغذية الذكي",
  onboardingTitle: "دليلك الغذائي الذكي",
  onboardingSubtitle: "التقط صورة لطعامك، وحلل مكوناته الغذائية فورًا، وتتبع أهدافك اليومية.",
  selectLanguage: "اختر لغتك",
  signInWithGoogle: "تسجيل الدخول باستخدام جوجل",
  continue: "المتابعة كضيف",
  navDashboard: "الرئيسية",
  navScan: "مسح الطعام",
  navHistory: "السجل",
  navGoals: "الأهداف",
  navProfile: "ملفي",
  scanYourFoodTitle: "مسح طعامك",
  scanYourFoodSubtitle: "التقط صورة أو ارفع صورة لتتبع التغذية",
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
  errorAnalysis: "عذرًا، لم أتمكن من تحليل هذه الصورة. يرجى تجربة صورة أخرى.",
  errorCamera: "تعذر الوصول إلى الكاميرا. يرجى التحقق من الأذونات.",
  errorCameraPermissionDenied: "تم رفض الوصول إلى الكاميرا. يرجى الانتقال إلى إعدادات متصفحك والسماح بالوصول إلى الكاميرا لهذا الموقع.",
  errorCameraGeneric: "حدث خطأ غير متوقع أثناء الوصول إلى الكاميرا. الرجاء المحاولة مرة أخرى.",
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
  activityLevelSedentary: "خامل (تمرين قليل أو معدوم)",
  activityLevelLight: "نشاط خفيف (تمرين 1-3 أيام/أسبوع)",
  activityLevelModerate: "نشاط معتدل (تمرين 3-5 أيام/أسبوع)",
  activityLevelActive: "نشيط (تمرين 6-7 أيام/أسبوع)",
  activityLevelVeryActive: "نشيط جداً (تمرين شاق وعمل بدني)",
  saveGoals: "حفظ الأهداف",
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
  const detectedLang = localStorage.getItem('i18nextLng') || navigator.language;
  const initialLang = detectedLang.startsWith('ar') ? 'ar' : 'en';
  const [language, setLanguage] = useState<Language>(initialLang);

  const changeLanguage = useCallback((lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('i18nextLng', lang);
  }, []);

  const t = useCallback((key: string, options?: { [key: string]: string | number }): string => {
    let translation = resources[language].translation[key as keyof typeof enTranslations] || key;
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