import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDiariesForCalendar } from '../utils/storage';

const CalendarView = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [diaries, setDiaries] = useState([]);
  const [selectedDiary, setSelectedDiary] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }
    loadDiaries();
  }, [user, navigate, currentDate]);

  const loadDiaries = () => {
    if (!user) return;
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const monthDiaries = getDiariesForCalendar(user.id, year, month);
    setDiaries(monthDiaries);
  };

  const getMonthName = (date) => {
    return date.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getDiariesForDay = (date) => {
    if (!date) return [];
    const dateStr = date.toISOString().split('T')[0];
    return diaries.filter(diary => {
      const diaryDate = new Date(diary.createdAt).toISOString().split('T')[0];
      return diaryDate === dateStr;
    });
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
    setSelectedDiary(null);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDiary(null);
  };

  const days = getDaysInMonth();
  const weekDays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

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
                  Xem Nhật Ký Theo Lịch
                </h1>
                <p className="mb-5 text-base text-body-color dark:text-dark-6">
                  Xem tất cả nhật ký của bạn trong tháng
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <section className="bg-[#F4F7FF] py-14 lg:py-20 dark:bg-dark">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Calendar Controls */}
            <div className="mb-6 bg-white dark:bg-dark-2 rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => navigateMonth('prev')}
                  className="px-4 py-2 text-base font-medium text-dark dark:text-white border border-stroke dark:border-dark-3 rounded-md hover:bg-gray-100 dark:hover:bg-dark-3 transition"
                >
                  ← Tháng trước
                </button>
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-dark dark:text-white">
                    {getMonthName(currentDate)}
                  </h2>
                  <button
                    onClick={goToToday}
                    className="mt-2 text-sm text-primary hover:underline"
                  >
                    Hôm nay
                  </button>
                </div>
                <button
                  onClick={() => navigateMonth('next')}
                  className="px-4 py-2 text-base font-medium text-dark dark:text-white border border-stroke dark:border-dark-3 rounded-md hover:bg-gray-100 dark:hover:bg-dark-3 transition"
                >
                  Tháng sau →
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="bg-white dark:bg-dark-2 rounded-lg shadow-sm p-6 mb-6">
              {/* Week Days Header */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {weekDays.map((day, index) => (
                  <div
                    key={index}
                    className="text-center py-2 text-sm font-semibold text-body-color dark:text-dark-6"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-2">
                {days.map((date, index) => {
                  const dayDiaries = getDiariesForDay(date);
                  const isToday = date && date.toDateString() === new Date().toDateString();
                  const isCurrentMonth = date && date.getMonth() === currentDate.getMonth();

                  return (
                    <div
                      key={index}
                      className={`min-h-[80px] p-2 border border-stroke dark:border-dark-3 rounded-lg ${
                        !date || !isCurrentMonth
                          ? 'bg-gray-50 dark:bg-dark-3 opacity-50'
                          : 'bg-white dark:bg-dark-2 hover:bg-gray-50 dark:hover:bg-dark-3'
                      } ${
                        isToday ? 'ring-2 ring-primary' : ''
                      } transition cursor-pointer`}
                      onClick={() => {
                        if (date && dayDiaries.length > 0) {
                          setSelectedDiary(dayDiaries[0]);
                        }
                      }}
                    >
                      {date && (
                        <>
                          <div
                            className={`text-sm font-medium mb-1 ${
                              isToday
                                ? 'text-primary font-bold'
                                : 'text-dark dark:text-white'
                            }`}
                          >
                            {date.getDate()}
                          </div>
                          {dayDiaries.length > 0 && (
                            <div className="space-y-1">
                              {dayDiaries.slice(0, 2).map((diary) => (
                                <div
                                  key={diary.id}
                                  className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded truncate"
                                  title={diary.title}
                                >
                                  {diary.title.substring(0, 15)}
                                  {diary.title.length > 15 ? '...' : ''}
                                </div>
                              ))}
                              {dayDiaries.length > 2 && (
                                <div className="text-xs text-body-color dark:text-dark-6 text-center">
                                  +{dayDiaries.length - 2} nữa
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Day Diaries */}
            {selectedDiary && (
              <div className="bg-white dark:bg-dark-2 rounded-lg shadow-sm p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-dark dark:text-white">
                    Nhật ký ngày {selectedDiary && new Date(selectedDiary.createdAt).toLocaleDateString('vi-VN')}
                  </h3>
                  <button
                    onClick={() => setSelectedDiary(null)}
                    className="text-body-color dark:text-dark-6 hover:text-dark dark:hover:text-white"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-4">
                  {getDiariesForDay(new Date(selectedDiary.createdAt)).map((diary) => (
                    <Link
                      key={diary.id}
                      to={`/diary/${diary.id}`}
                      className="block p-4 border border-stroke dark:border-dark-3 rounded-lg hover:shadow-md transition"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-lg font-semibold text-dark dark:text-white">
                          {diary.title}
                        </h4>
                        <span className={`text-xs px-2 py-1 rounded ${
                          diary.isPublic
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                        }`}>
                          {diary.isPublic ? 'Công khai' : 'Riêng tư'}
                        </span>
                      </div>
                      <p className="text-body-color dark:text-dark-6 line-clamp-2">
                        {diary.content.replace(/<[^>]*>/g, '').substring(0, 150)}
                        {diary.content.replace(/<[^>]*>/g, '').length > 150 ? '...' : ''}
                      </p>
                      {diary.tags && diary.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {diary.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Month Summary */}
            <div className="bg-white dark:bg-dark-2 rounded-lg shadow-sm p-6">
              <h3 className="mb-4 text-xl font-bold text-dark dark:text-white">
                Tóm tắt tháng
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-primary/10 rounded-lg">
                  <div className="text-2xl font-bold text-primary mb-1">{diaries.length}</div>
                  <div className="text-sm text-body-color dark:text-dark-6">Tổng số nhật ký</div>
                </div>
                <div className="text-center p-4 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                    {new Set(diaries.map(d => new Date(d.createdAt).getDate())).size}
                  </div>
                  <div className="text-sm text-body-color dark:text-dark-6">Ngày có nhật ký</div>
                </div>
                <div className="text-center p-4 bg-primary/10 dark:bg-primary/20 rounded-lg">
                  <div className="text-2xl font-bold text-primary dark:text-blue-dark mb-1">
                    {diaries.filter(d => d.isPublic).length}
                  </div>
                  <div className="text-sm text-body-color dark:text-dark-6">Nhật ký công khai</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CalendarView;

