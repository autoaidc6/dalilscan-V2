import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useLog } from '../context/LogContext';
import { motion } from 'framer-motion';
import { useI18n } from '../context/I18nContext';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { CameraIcon, UploadIcon, FireIcon, WaterDropIcon, PlusIcon } from '../components/icons/Icons';
import ScanModal from '../components/ScanModal';

const Dashboard = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { user } = useUser();
  const { totalCaloriesToday, totalMacrosToday } = useLog();
  
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [waterMl, setWaterMl] = useState(0);
  const totalGlasses = 8;
  const consumedGlasses = Math.floor(waterMl / 250);

  const calorieProgress = user.calorieGoal > 0 ? (totalCaloriesToday / user.calorieGoal) * 100 : 0;
  
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
  
  const addWater = () => {
      setWaterMl(prev => prev + 250);
  };
  
  const macroData = [
    { name: t('protein'), value: totalMacrosToday.protein },
    { name: t('carbs'), value: totalMacrosToday.carbs },
    { name: t('fat'), value: totalMacrosToday.fat },
  ];
  const MACRO_COLORS = ['#3B82F6', '#10B981', '#F59E0B'];
  const hasMacros = totalMacrosToday.protein > 0 || totalMacrosToday.carbs > 0 || totalMacrosToday.fat > 0;

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
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-brand-dark-purple mb-2">{t('scanYourFoodTitle')}</h1>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Daily Calories Card */}
            <div className="bg-calorie-card p-6 rounded-2xl shadow-sm">
              <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
                <FireIcon className="w-6 h-6 text-calorie-progress" />
                <h3 className="font-bold text-lg text-brand-dark-purple">{t('dailyCalories')}</h3>
              </div>
              <div className="flex justify-between items-baseline mb-2">
                  <p><span className="text-3xl font-bold text-brand-dark-purple">{Math.round(totalCaloriesToday)}</span><span className="text-sm text-gray-600"> {t('consumed')}</span></p>
                  <p><span className="text-lg font-bold text-gray-500">{Math.round(user.calorieGoal - totalCaloriesToday)}</span><span className="text-sm text-gray-500"> {t('remaining')}</span></p>
              </div>
              <div className="w-full bg-orange-200 rounded-full h-2.5 mb-2">
                  <div className="bg-calorie-progress h-2.5 rounded-full" style={{ width: `${Math.min(calorieProgress, 100)}%` }}></div>
              </div>
              <p className="text-xs text-center text-gray-500">{t('goal')}: {user.calorieGoal} {t('kcal')}</p>
            </div>
            
            {/* Macro Distribution Card */}
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
            
            {/* Water Intake Card */}
            <div className="bg-water-card p-6 rounded-2xl shadow-sm flex flex-col">
              <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
                <WaterDropIcon className="w-6 h-6 text-brand-accent" />
                <h3 className="font-bold text-lg text-brand-dark-purple">{t('waterIntake')}</h3>
              </div>
              <div className="flex-grow">
                  <p className="text-3xl font-bold text-brand-dark-purple mb-2">{waterMl} <span className="text-lg font-medium text-gray-500">{t('ml')}</span></p>
                  <div className="flex space-x-1 rtl:space-x-reverse mb-3">
                      {Array.from({length: totalGlasses}).map((_, i) => (
                          <div key={i} className={`h-8 flex-1 rounded ${i < consumedGlasses ? 'bg-brand-accent' : 'bg-cyan-200/50'}`}></div>
                      ))}
                  </div>
              </div>
              <button onClick={addWater} className="w-full mt-2 bg-brand-accent hover:bg-teal-500 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 rtl:space-x-reverse">
                  <PlusIcon className="w-5 h-5" />
                  <span>{t('addGlass')}</span>
              </button>
            </div>

          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Dashboard;