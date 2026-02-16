import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import ActivityHeatmap from '../components/ActivityHeatmap.jsx';
import CircularGauge from '../components/CircularGauge.jsx';
import { getUserStats, getUserProgress, getCurrentUser } from '../services/api';
import { BentoGrid, BentoCard } from '../components/MagicBento.jsx';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        navigate('/login');
        return;
      }
      setUser(currentUser);

      try {
        const [statsRes, progressRes] = await Promise.all([
          getUserStats(currentUser.uid),
          getUserProgress(currentUser.uid)
        ]);
        setStats(statsRes.stats);
        setProgressData(progressRes.progress);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-cream/90 transition-colors dark:bg-[#050816] text-ink dark:text-cream items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#fdfaf3] text-ink transition-colors dark:bg-[#050816] dark:text-cream font-lexend">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-8">
        <BentoGrid className="dashboard-bento">
          {/* Profile & Main Stats Card */}
          <BentoCard className="col-span-1 md:col-span-3 h-auto min-h-0" enableTilt={false}>
            <div className="flex flex-col md:flex-row items-center gap-8 p-4">
              <div className="relative group">
                <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-orange-500 text-4xl font-black text-white shadow-xl shadow-orange-500/20 transform transition group-hover:scale-105">
                  {user?.displayName?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-green-500 border-4 border-white dark:border-[#0a0f24] flex items-center justify-center text-[10px] text-white font-bold animate-pulse">
                  LVL
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-black tracking-tight">{user?.displayName || 'Learner'}</h1>
                <div className="flex items-center justify-center md:justify-start gap-3 mt-2">
                  <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400 text-[10px] font-black uppercase tracking-wider">Master of Rhythm</span>
                  <span className="text-xs font-bold text-dysGray/60">Top 1% Contributors</span>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-dysGray/50 uppercase">Practice Streak</p>
                    <p className="text-2xl font-black text-orange-500">{stats?.currentStreak || 0} <span className="text-xs italic opacity-60">days</span></p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-dysGray/50 uppercase">Analysis Level</p>
                    <p className="text-2xl font-black">{stats?.averageLevel || 0}<span className="text-xs text-dysGray">.0</span></p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-dysGray/50 uppercase">Vocab Lab</p>
                    <p className="text-2xl font-black text-[#F97316]">{stats?.practiceTypes?.['word-lab'] || 0}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-dysGray/50 uppercase">Rank</p>
                    <p className="text-2xl font-black text-blue-500">{stats?.totalDays > 10 ? 'Advanced' : 'Novice'}</p>
                  </div>
                </div>
              </div>
            </div>
          </BentoCard>

          {/* Progress Gauge Card */}
          <BentoCard className="col-span-1 h-full" glowColor="34, 197, 94">
            <div className="flex flex-col items-center justify-center h-full p-4 space-y-6">
              <CircularGauge solved={stats?.totalSessions || 0} total={365} label="Sessions" />
              {/* Progress Gauges */}
              <div className="w-full space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-black uppercase text-green-500">
                    <span>Reading</span>
                    <span>{stats?.practiceTypes?.reading || 0}/1500</span>
                  </div>
                  <div className="w-full h-1.5 bg-dysGray/10 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${Math.min(((stats?.practiceTypes?.reading || 0) / 1500) * 100, 100)}%` }}></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-black uppercase text-orange-500">
                    <span>Analysis & Word Lab</span>
                    <span>{(stats?.practiceTypes?.analysis || 0) + (stats?.practiceTypes?.['word-lab'] || 0)}/1000</span>
                  </div>
                  <div className="w-full h-1.5 bg-dysGray/10 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 transition-all duration-500" style={{ width: `${Math.min((((stats?.practiceTypes?.analysis || 0) + (stats?.practiceTypes?.['word-lab'] || 0)) / 1000) * 100, 100)}%` }}></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-black uppercase text-red-500">
                    <span>Speech & Quiz</span>
                    <span>{stats?.practiceTypes?.quiz || 0}/500</span>
                  </div>
                  <div className="w-full h-1.5 bg-dysGray/10 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 transition-all duration-500" style={{ width: `${Math.min(((stats?.practiceTypes?.quiz || 0) / 500) * 100, 100)}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </BentoCard>

          {/* Heatmap Card */}
          <BentoCard className="col-span-1 md:col-span-4 h-auto" enableTilt={false} glowColor="59, 130, 246">
            <div className="p-2">
              <ActivityHeatmap
                data={progressData}
                totalActiveDays={stats?.totalDays || 0}
                maxStreak={stats?.currentStreak || 0}
              />
            </div>
          </BentoCard>

          {/* Routine & Tips Cards */}
          <BentoCard className="col-span-1 md:col-span-2" glowColor="139, 92, 246">
            <div className="p-4 space-y-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-dysGray/40">Study Experience</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-dysGray/5 dark:bg-white/5 border border-dysGray/10">
                  <span className="text-2xl">☀️</span>
                  <div>
                    <p className="font-bold text-sm">Morning Flow</p>
                    <p className="text-[10px] font-bold text-dysGray">Peak: 8:30 AM</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-dysGray/5 dark:bg-white/5 border border-dysGray/10">
                  <span className="text-2xl">🎧</span>
                  <div>
                    <p className="font-bold text-sm">Focused Audio</p>
                    <p className="text-[10px] font-bold text-dysGray">Used in 70%</p>
                  </div>
                </div>
              </div>
            </div>
          </BentoCard>

          <BentoCard className="col-span-1 md:col-span-2" glowColor="249, 115, 22">
            <div className="p-6 flex flex-col justify-center h-full space-y-4 bg-orange-500/5">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold">💡</div>
                <h3 className="text-xs font-black uppercase tracking-widest text-orange-500">Quick Growth Tip</h3>
              </div>
              <p className="text-sm leading-relaxed font-bold text-ink/80 dark:text-white/80 italic">
                "You're making great progress! Try using the 'Word Lab' for difficult syllables in your next upload. Small sessions build the strongest habits."
              </p>
              <button className="self-start text-[10px] font-black uppercase text-orange-600 dark:text-orange-400 hover:underline tracking-tighter">
                Tailored Analysis →
              </button>
            </div>
          </BentoCard>
        </BentoGrid>
      </main>
    </div>
  );
};

export default Dashboard;
