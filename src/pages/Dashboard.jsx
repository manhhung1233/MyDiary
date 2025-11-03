import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDiaryStats } from '../utils/storage';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }
    const statistics = getDiaryStats(user.id);
    setStats(statistics);
    setLoading(false);
  }, [user, navigate]);

  if (!user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-body-color dark:text-dark-6">Đang tải...</p>
      </div>
    );
  }

  const moodEmojis = {
    'happy': '😊',
    'sad': '😢',
    'angry': '😡',
    'tired': '😴',
    'excited': '🎉',
    'calm': '😌',
    'anxious': '😰',
    'loved': '😍',
    'thoughtful': '🤔',
    'cool': '😎'
  };

  const moodLabels = {
    'happy': 'Vui vẻ',
    'sad': 'Buồn',
    'angry': 'Tức giận',
    'tired': 'Mệt mỏi',
    'excited': 'Hứng khởi',
    'calm': 'Bình yên',
    'anxious': 'Lo lắng',
    'loved': 'Yêu thương',
    'thoughtful': 'Suy tư',
    'cool': 'Tuyệt vời'
  };

  // Prepare monthly data for chart
  const monthlyData = Object.entries(stats.monthlyStats)
    .reverse()
    .slice(-6)
    .map(([month, count]) => {
      const [year, monthNum] = month.split('-');
      const monthName = new Date(year, parseInt(monthNum) - 1).toLocaleDateString('vi-VN', { month: 'short' });
      return { month: monthName, count };
    });

  const maxCount = Math.max(...monthlyData.map(d => d.count), 1);

  // Prepare mood data
  const moodData = Object.entries(stats.moodStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Prepare tag data
  const tagData = Object.entries(stats.tagStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  return (
    <div>
      {/* Banner Section */}
      <div className="relative z-10 overflow-hidden pt-[120px] pb-[60px] md:pt-[130px] lg:pt-[160px] dark:bg-dark">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center -mx-4">
            <div className="w-full px-4">
              <div className="text-center">
                <h1 className="mb-4 text-3xl font-bold text-dark dark:text-white sm:text-4xl md:text-[40px] md:leading-[1.2]">
                  Dashboard Thống Kê
                </h1>
                <p className="mb-5 text-base text-body-color dark:text-dark-6">
                  Xem thống kê và phân tích nhật ký của bạn
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <section className="bg-[#F4F7FF] py-14 lg:py-20 dark:bg-dark">
        <div className="container mx-auto px-4">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-dark-2 rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-body-color dark:text-dark-6">Tổng số nhật ký</span>
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-dark dark:text-white">{stats.total}</div>
            </div>

            <div className="bg-white dark:bg-dark-2 rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-body-color dark:text-dark-6">Chuỗi ngày liên tiếp</span>
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-dark dark:text-white">{stats.streak} ngày</div>
            </div>

            <div className="bg-white dark:bg-dark-2 rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-body-color dark:text-dark-6">Tổng lượt thích</span>
                <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-dark dark:text-white">{stats.totalLikes}</div>
            </div>

            <div className="bg-white dark:bg-dark-2 rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-body-color dark:text-dark-6">Tổng bình luận</span>
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-dark dark:text-white">{stats.totalComments}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Monthly Chart */}
            <div className="bg-white dark:bg-dark-2 rounded-lg shadow-sm p-6">
              <h3 className="mb-4 text-xl font-bold text-dark dark:text-white">Nhật ký theo tháng (6 tháng gần nhất)</h3>
              <div className="space-y-4">
                {monthlyData.map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-body-color dark:text-dark-6">{item.month}</span>
                      <span className="text-sm font-medium text-dark dark:text-white">{item.count}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-dark-3 rounded-full h-4">
                      <div
                        className="bg-primary rounded-full h-4 transition-all"
                        style={{ width: `${(item.count / maxCount) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mood Statistics */}
            <div className="bg-white dark:bg-dark-2 rounded-lg shadow-sm p-6">
              <h3 className="mb-4 text-xl font-bold text-dark dark:text-white">Cảm xúc phổ biến</h3>
              {moodData.length > 0 ? (
                <div className="space-y-4">
                  {moodData.map(([mood, count]) => (
                    <div key={mood} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{moodEmojis[mood] || '😊'}</span>
                        <span className="text-base text-body-color dark:text-dark-6">
                          {moodLabels[mood] || mood}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 dark:bg-dark-3 rounded-full h-3">
                          <div
                            className="bg-primary rounded-full h-3"
                            style={{ width: `${(count / stats.total) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-dark dark:text-white w-8 text-right">
                          {count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-body-color dark:text-dark-6">Chưa có dữ liệu cảm xúc</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tag Statistics */}
            <div className="bg-white dark:bg-dark-2 rounded-lg shadow-sm p-6">
              <h3 className="mb-4 text-xl font-bold text-dark dark:text-white">Tags phổ biến</h3>
              {tagData.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {tagData.map(([tag, count]) => (
                    <Link
                      key={tag}
                      to={`/diary?tag=${encodeURIComponent(tag)}`}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary/20 transition"
                    >
                      #{tag} <span className="text-xs bg-primary/20 px-1.5 rounded-full">{count}</span>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-body-color dark:text-dark-6">Chưa có tags</p>
              )}
            </div>

            {/* Top Words */}
            <div className="bg-white dark:bg-dark-2 rounded-lg shadow-sm p-6">
              <h3 className="mb-4 text-xl font-bold text-dark dark:text-white">Từ khóa xuất hiện nhiều</h3>
              {stats.topWords.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {stats.topWords.map(({ word, count }, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-dark-3 text-body-color dark:text-dark-6 rounded-full text-sm"
                    >
                      {word} <span className="text-xs text-primary">({count})</span>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-body-color dark:text-dark-6">Chưa có dữ liệu</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link
              to="/diary"
              className="px-6 py-3 text-base font-medium text-[#1E40AF] bg-primary rounded-md hover:bg-blue-dark transition"
            >
              Xem tất cả nhật ký
            </Link>
            <Link
              to="/diary/new"
              className="px-6 py-3 text-base font-medium text-dark dark:text-white border border-stroke dark:border-dark-3 rounded-md hover:bg-gray-100 dark:hover:bg-dark-3 transition"
            >
              Viết nhật ký mới
            </Link>
            <Link
              to="/memory-lane"
              className="px-6 py-3 text-base font-medium text-dark dark:text-white border border-stroke dark:border-dark-3 rounded-md hover:bg-gray-100 dark:hover:bg-dark-3 transition"
            >
              Nhớ lại ngày này
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;

