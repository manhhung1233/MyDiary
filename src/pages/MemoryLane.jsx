import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDiariesByDate } from '../utils/storage';

const MemoryLane = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }
    loadMemories();
  }, [user, navigate, selectedDate]);

  const loadMemories = () => {
    if (!user) return;
    setLoading(true);
    const diaries = getDiariesByDate(user.id, selectedDate);
    setMemories(diaries);
    setLoading(false);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDiaryDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMoodEmoji = (moodValue) => {
    const moodMap = {
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
    return moodMap[moodValue] || '';
  };

  const getYearFromDate = (dateString) => {
    return new Date(dateString).getFullYear();
  };

  const handleDateChange = (e) => {
    const newDate = new Date(e.target.value);
    setSelectedDate(newDate);
  };

  // Get years with memories for today's date
  const getMemoryYears = () => {
    if (!user) return [];
    const today = new Date();
    const todayMonth = today.getMonth();
    const todayDay = today.getDate();
    const allMemories = [];
    
    // Check last 5 years
    for (let i = 1; i <= 5; i++) {
      const checkDate = new Date(today.getFullYear() - i, todayMonth, todayDay);
      const diaries = getDiariesByDate(user.id, checkDate);
      if (diaries.length > 0) {
        allMemories.push({
          year: today.getFullYear() - i,
          diaries
        });
      }
    }
    
    return allMemories;
  };

  const todayMemories = getMemoryYears();

  if (!user) {
    return null;
  }

  return (
    <div>
      {/* Banner Section */}
      <div className="relative z-10 overflow-hidden pt-[120px] pb-[60px] md:pt-[130px] lg:pt-[160px] dark:bg-dark">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center -mx-4">
            <div className="w-full px-4">
              <div className="text-center">
                <h1 className="mb-4 text-3xl font-bold text-dark dark:text-white sm:text-4xl md:text-[40px] md:leading-[1.2]">
                  Nhớ Lại Ngày Này
                </h1>
                <p className="mb-5 text-base text-body-color dark:text-dark-6">
                  Xem lại những khoảnh khắc đáng nhớ trong quá khứ
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <section className="bg-[#F4F7FF] py-14 lg:py-20 dark:bg-dark">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Date Selector */}
            <div className="mb-8 bg-white dark:bg-dark-2 rounded-lg shadow-sm p-6">
              <label className="block mb-4 text-base font-medium text-dark dark:text-white">
                Chọn ngày để xem nhật ký:
              </label>
              <input
                type="date"
                value={selectedDate.toISOString().split('T')[0]}
                onChange={handleDateChange}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-5 py-3 text-base transition bg-transparent border rounded-md outline-none border-stroke dark:border-dark-3 text-body-color dark:text-dark-6 focus:border-primary dark:focus:border-primary"
              />
            </div>

            {/* Today's Memories (if any) */}
            {todayMemories.length > 0 && 
             selectedDate.getDate() === new Date().getDate() && 
             selectedDate.getMonth() === new Date().getMonth() && (
              <div className="mb-8 bg-gradient-to-r from-primary/10 to-blue-dark/10 dark:from-primary/20 dark:to-blue-dark/20 rounded-lg shadow-sm p-6">
                <h2 className="mb-4 text-2xl font-bold text-dark dark:text-white">
                  📅 Nhật ký cùng ngày này trong các năm trước
                </h2>
                <div className="space-y-4">
                  {todayMemories.map(({ year, diaries }) => (
                    <div key={year} className="bg-white/50 dark:bg-dark-2/50 rounded-lg p-4">
                      <h3 className="mb-3 text-lg font-semibold text-dark dark:text-white">
                        Năm {year} ({diaries.length} nhật ký)
                      </h3>
                      <div className="space-y-2">
                        {diaries.map((diary) => (
                          <Link
                            key={diary.id}
                            to={`/diary/${diary.id}`}
                            className="block p-3 bg-white dark:bg-dark-3 rounded hover:shadow-md transition"
                          >
                            <div className="flex items-center gap-3">
                              {diary.mood && (
                                <span className="text-2xl">{getMoodEmoji(diary.mood)}</span>
                              )}
                              <div className="flex-1">
                                <h4 className="font-semibold text-dark dark:text-white">{diary.title}</h4>
                                <p className="text-sm text-body-color dark:text-dark-6">
                                  {formatDiaryDate(diary.createdAt)}
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Selected Date Memories */}
            <div className="bg-white dark:bg-dark-2 rounded-lg shadow-sm p-6">
              <h2 className="mb-6 text-2xl font-bold text-dark dark:text-white">
                {formatDate(selectedDate)}
              </h2>

              {loading ? (
                <div className="text-center py-8">
                  <p className="text-body-color dark:text-dark-6">Đang tải...</p>
                </div>
              ) : memories.length > 0 ? (
                <div className="space-y-4">
                  {memories.map((diary) => {
                    const diaryYear = getYearFromDate(diary.createdAt);
                    const selectedYear = selectedDate.getFullYear();
                    return (
                      <div
                        key={diary.id}
                        className="p-6 border border-stroke dark:border-dark-3 rounded-lg hover:shadow-md transition"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            {diary.mood && (
                              <span className="text-2xl">{getMoodEmoji(diary.mood)}</span>
                            )}
                            <div>
                              <h3 className="mb-1 text-xl font-semibold text-dark dark:text-white">
                                {diary.title}
                              </h3>
                              <p className="text-sm text-body-color dark:text-dark-6">
                                {formatDiaryDate(diary.createdAt)}
                                {diaryYear !== selectedYear && ` (Năm ${diaryYear})`}
                              </p>
                            </div>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded ${
                            diary.isPublic
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                          }`}>
                            {diary.isPublic ? 'Công khai' : 'Riêng tư'}
                          </span>
                        </div>

                        {diary.images && diary.images.length > 0 && (
                          <div className="mb-4">
                            <img
                              src={diary.images[0]}
                              alt={diary.title}
                              className="w-full h-48 object-cover rounded-lg"
                            />
                          </div>
                        )}

                        <p className="mb-4 text-body-color dark:text-dark-6 line-clamp-3">
                          {diary.content.replace(/<[^>]*>/g, '').substring(0, 200)}
                          {diary.content.replace(/<[^>]*>/g, '').length > 200 ? '...' : ''}
                        </p>

                        {diary.tags && diary.tags.length > 0 && (
                          <div className="mb-4 flex flex-wrap gap-2">
                            {diary.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <Link
                          to={`/diary/${diary.id}`}
                          className="inline-block px-4 py-2 text-sm font-medium text-primary border border-primary rounded-md hover:bg-primary hover:text-[#1E40AF] transition"
                        >
                          Đọc thêm →
                        </Link>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="mb-4 text-6xl">📝</div>
                  <p className="mb-4 text-lg text-body-color dark:text-dark-6">
                    Không có nhật ký nào vào ngày {formatDate(selectedDate)}
                  </p>
                  <Link
                    to="/diary/new"
                    className="inline-block px-6 py-3 text-base font-medium text-[#1E40AF] bg-primary rounded-md hover:bg-blue-dark transition"
                  >
                    Viết nhật ký ngay
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MemoryLane;

