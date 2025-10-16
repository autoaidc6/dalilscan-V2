
import React, { useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useLog } from '../context/LogContext';
import { motion } from 'framer-motion';
import { useI18n } from '../context/I18nContext';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { CameraIcon, UploadIcon, FireIcon, WaterDropIcon, PlusIcon, TargetIcon } from '../components/icons/Icons';
import ScanModal from '../components/ScanModal';
import { getDailyChallenge } from '../gamification/challenges';

// --- Memoized Card Components for Performance Optimization ---

const DailyCaloriesCard = React.memo(() => {
    const { t } = useI18n();
    const { user } = useUser();
    const { totalCaloriesToday } = useLog();
    const calorieProgress = user.calorieGoal > 0 ? (totalCaloriesToday / user.calorieGoal) * 100 : 0;
    const remainingCalories = user.calorieGoal - totalCaloriesToday;

    return (
        <div className="bg-calorie-card p-6 rounded-2xl shadow-sm">
            <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
                <FireIcon className="w-6 h-6 text-calorie-progress" />
                <h3 className="font-bold text-lg text-brand-dark-purple">{t('dailyCalories')}</h3>
            </div>
            <div className="flex justify-between items-baseline mb-2">
                <p><span className="text-3xl font-bold text-brand-dark-purple">{Math.round(totalCaloriesToday)}</span><span className="text-sm text-gray-600"> {t('consumed')}</span></p>
                <p><span className="text-lg font-bold text-gray-500">{Math.round(remainingCalories)}</span><span className="text-sm text-gray-500"> {t('remaining')}</span></p>
            </div>
            <div className="w-full bg-orange-200 rounded-full h-2.5 mb-2">
                <div className="bg-calorie-progress h-2.5 rounded-full" style={{ width: `${Math.min(calorieProgress, 100)}%` }}></div>
            </div>
            <p className="text-xs text-center text-gray-500">{t('goal')}: {user.calorieGoal} {t('kcal')}</p>
        </div>
    );
});

const MacroDistributionCard = React.memo(() => {
    const { t } = useI18n();
    const { totalMacrosToday } = useLog();
    const MACRO_COLORS = ['#3B82F6', '#10B981', '#F59E0B'];

    const macroData = useMemo(() => [
        { name: t('protein'), value: totalMacrosToday.protein },
        { name: t('carbs'), value: totalMacrosToday.carbs },
        { name: t('fat'), value: totalMacrosToday.fat },
    ], [t, totalMacrosToday]);

    const hasMacros = useMemo(() => macroData.some(d => d.value > 0), [macroData]);

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h3 className="font-bold text-lg text-brand-dark-purple mb-2">{t('macroDistribution')}</h3>
            <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={hasMacros ? macroData : [{name: 'empty', value: 1}]} dataKey="value" cx="50%" cy="50%" innerRadius={40} outerRadius={55} fill="#f5f5f5" paddingAngle={hasMacros ? 5 : 0}>
                            {hasMacros && macroData.map((entry, index) => <Cell key={`cell-${index}`} fill={MACRO_COLORS[index % MACRO_COLORS.length]} stroke={MACRO_COLORS[index % MACRO_COLORS.length]} />)}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-4 rtl:space-x-reverse text-xs mt-2">
                {macroData.map((macro, index) => (
                    <div key={macro.name} className="flex items-center space-x-1.5 rtl:space-x-reverse">
                        <div className="w-2 h-2 rounded-full" style={{backgroundColor: MACRO_COLORS[index]}}></div>
                        <span className="text-gray-600">{macro.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
});

const WaterIntakeCard = React.memo(() => {
    const { t } = useI18n();
    const { totalWaterToday, addWaterEntry } = useLog();
    const totalGlasses = 8;
    const consumedGlasses = Math.floor(totalWaterToday / 250);

    return (
        <div className="bg-water-card p-6 rounded-2xl shadow-sm flex flex-col">
            <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
                <WaterDropIcon className="w-6 h-6 text-brand-accent" />
                <h3 className="font-bold text-lg text-brand-dark-purple">{t('waterIntake')}</h3>
            </div>
            <div className="flex-grow">
                <p className="text-3xl font-bold text-brand-dark-purple mb-2">{totalWaterToday} <span className="text-lg font-medium text-gray-500">{t('ml')}</span></p>
                <div className="flex space-x-1 rtl:space-x-reverse mb-3">
                    {Array.from({length: totalGlasses}).map((_, i) => (
                        <div key={i} className={`h-8 flex-1 rounded ${i < consumedGlasses ? 'bg-brand-accent' : 'bg-cyan-200/50'}`}></div>
                    ))}
                </div>
            </div>
            <button onClick={addWaterEntry} className="w-full mt-2 bg-brand-accent hover:bg-teal-500 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 rtl:space-x-reverse">
                <PlusIcon className="w-5 h-5" />
                <span>{t('addGlass')}</span>
            </button>
        </div>
    );
});

const DailyChallengeCard = React.memo(() => {
    const { t } = useI18n();
    const { logEntries, totalCaloriesToday, totalWaterToday } = useLog();
    const { user } = useUser();
    const challenge = getDailyChallenge();

    const { progress, progressText, isCompleted } = useMemo(() => {
        let current = 0;
        switch(challenge.metric) {
            case 'water':
                current = totalWaterToday;
                break;
            case 'calories':
                current = totalCaloriesToday;
                break;
            case 'meals':
                 current = logEntries.filter(e => e.type === 'Meal' && e.timestamp.toDateString() === new Date().toDateString()).length;
                 break;
        }

        const isCompleted = challenge.metric === 'calories' ? current < challenge.goal && current > 0 : current >= challenge.goal;
        const progress = Math.min((current / challenge.goal) * 100, 100);

        const progressText = challenge.metric === 'calories' ? `${Math.round(current)} / < ${challenge.goal}` : `${Math.round(current)} / ${challenge.goal}`;

        return { progress, progressText, isCompleted };

    }, [challenge, logEntries, totalCaloriesToday, totalWaterToday]);

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
                <TargetIcon className="w-6 h-6 text-brand-purple" />
                <h3 className="font-bold text-lg text-brand-dark-purple">{t('dailyChallenge')}</h3>
            </div>
            <p className={`font-semibold mb-2 ${isCompleted ? 'text-green-600' : 'text-gray-700'}`}>{t(challenge.titleKey, { goal: challenge.goal })}</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                 <div className={`${isCompleted ? 'bg-green-500' : 'bg-brand-purple'} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${progress}%` }}></div>
            </div>
            <p className="text-xs text-right text-gray-500">{progressText}</p>
        </div>
    );
});

const Dashboard = () => {
  const { t } = useI18n();
  const { user } = useUser();
  const navigate = useNavigate();
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
          const file = event.target.files[0];
          const reader = new FileReader();
          reader.onload = (e) => {
              if (e.target && typeof e.target.result === 'string') {
                  navigate('/scan', { state: { imageSrc: e.target.result } });
              }
          };
          reader.readAsDataURL(file);
      }
  };
  
  return (
    <>
      <ScanModal 
        isOpen={isScanModalOpen} 
        onClose={() => setIsScanModalOpen(false)} 
        onCapture={(imageSrc) => {
          setIsScanModalOpen(false);
          navigate('/scan', { state: { imageSrc } });
        }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="p-8 bg-gradient-to-br from-indigo-50/50 via-white to-emerald-50/50 min-h-screen"
      >
        <header className="mb-10">
            <div className="flex justify-between items-center mb-2">
                <h1 className="text-4xl font-bold text-brand-dark-purple">{t('dashboardWelcome', { name: user.name })}</h1>
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse text-orange-500 font-bold">
                        <FireIcon className="w-6 h-6" />
                        <span>{user.streak} {t('dayStreak')}</span>
                    </div>
                     <div className="text-sm font-bold text-brand-purple bg-brand-light-purple px-3 py-1 rounded-full">
                        {user.points} {t('points')}
                    </div>
                </div>
            </div>
          <p className="text-gray-500">{t('scanYourFoodSubtitle')}</p>
        </header>

        <div className="flex items-center justify-center space-x-4 rtl:space-x-reverse mb-12 max-w-md mx-auto">
           <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              aria-hidden="true"
          />
          <button onClick={() => setIsScanModalOpen(true)} className="flex-1 flex items-center justify-center space-x-3 rtl:space-x-reverse bg-gradient-to-r from-brand-purple to-indigo-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all">
            <CameraIcon className="w-6 h-6" />
            <span>{t('scanFood')}</span>
          </button>
          <button onClick={handleUploadClick} className="p-4 bg-white border-2 border-brand-light-purple rounded-xl text-brand-purple hover:border-brand-purple hover:bg-brand-light-purple transition-colors shadow-sm">
            <UploadIcon className="w-6 h-6" />
          </button>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-brand-dark-purple mb-6">{t('todaysSummary')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            <DailyChallengeCard />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <MacroDistributionCard />
                 <WaterIntakeCard />
            </div>
            <div className="md:col-span-2 lg:col-span-2">
                <DailyCaloriesCard />
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Dashboard;