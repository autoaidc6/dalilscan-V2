import React from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '../context/I18nContext';
import { useLog } from '../context/LogContext';
import { useUser } from '../context/UserContext';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

const WeeklyReport = () => {
    const { t } = useI18n();
    const { weekChartData } = useLog();

    return (
        <div className="bg-white p-8 rounded-2xl shadow-subtle">
            <h2 className="text-2xl font-bold text-brand-dark-purple mb-6">{t('weeklyReport')}</h2>
            <div className="mb-8">
                <h3 className="font-semibold text-lg mb-2 text-brand-text">{t('caloriesPerDay')}</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={weekChartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" tick={{ fill: '#6B7280' }} />
                            <YAxis tick={{ fill: '#6B7280' }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'white',
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                                }}
                            />
                            <Bar dataKey="calories" fill="#FB923C" name={t('calories')} radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div>
                 <h3 className="font-semibold text-lg mb-2 text-brand-text">{t('macrosPerDay')}</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={weekChartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" tick={{ fill: '#6B7280' }} />
                            <YAxis tick={{ fill: '#6B7280' }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'white',
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                }}
                            />
                            <Legend />
                            <Bar dataKey="protein" stackId="a" fill="#3B82F6" name={t('protein')} />
                            <Bar dataKey="carbs" stackId="a" fill="#10B981" name={t('carbs')} />
                            <Bar dataKey="fat" stackId="a" fill="#F59E0B" name={t('fat')} radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

const Leaderboard = () => {
    const { t } = useI18n();
    const { user } = useUser();
    // Mock data for the leaderboard
    const leaderboardData = [
        { rank: 1, name: 'Alex', points: 2450 },
        { rank: 2, name: 'Samira', points: 2210 },
        { rank: 3, name: user.name, points: user.points, isCurrentUser: true },
        { rank: 4, name: 'Chris', points: 1890 },
        { rank: 5, name: 'Fatima', points: 1750 },
    ].sort((a,b) => b.points - a.points).map((u, i) => ({...u, rank: i + 1}));

    return (
         <div className="bg-white p-8 rounded-2xl shadow-subtle">
            <h2 className="text-2xl font-bold text-brand-dark-purple mb-6">{t('leaderboard')}</h2>
            <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4 text-sm font-bold text-gray-500 px-4">
                    <span>{t('rank')}</span>
                    <span className="col-span-1">{t('user')}</span>
                    <span className="text-right">{t('points')}</span>
                </div>
                 {leaderboardData.map(item => (
                    <div key={item.name} className={`grid grid-cols-3 gap-4 items-center p-4 rounded-lg ${item.isCurrentUser ? 'bg-brand-light-purple border-2 border-brand-purple' : 'bg-gray-50'}`}>
                        <span className={`font-bold text-lg ${item.rank <= 3 ? 'text-amber-500' : 'text-gray-600'}`}>{item.rank}</span>
                        <span className={`font-semibold ${item.isCurrentUser ? 'text-brand-purple' : 'text-brand-dark-purple'}`}>{item.name}</span>
                        <span className={`text-right font-bold ${item.isCurrentUser ? 'text-brand-purple' : 'text-brand-dark-purple'}`}>{item.points}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const Insights = () => {
  const { t } = useI18n();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-8 bg-background min-h-screen"
    >
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-brand-dark-purple mb-2">{t('insightsTitle')}</h1>
        <p className="text-gray-500">{t('insightsSubtitle')}</p>
      </header>

      <div className="max-w-4xl mx-auto space-y-8">
        <WeeklyReport />
        <Leaderboard />
      </div>
    </motion.div>
  );
};

export default Insights;