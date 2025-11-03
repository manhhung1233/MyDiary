import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getPublicDiaries, getUserDiaries, getDiariesByTag, getAllTags, getLikeCount, isBookmarked, toggleBookmark, getBookmarkedDiaries } from '../utils/storage';

const DiaryList = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [diaries, setDiaries] = useState([]);
  const [filteredDiaries, setFilteredDiaries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filter, setFilter] = useState('all'); // all, my, public
  const [selectedTag, setSelectedTag] = useState(searchParams.get('tag') || '');
  const [allTags, setAllTags] = useState([]);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);

  useEffect(() => {
    const tag = searchParams.get('tag');
    if (tag) {
      setSelectedTag(tag);
      setFilter('all');
    }
    if (showBookmarks && user) {
      setDiaries(getBookmarkedDiaries(user.id));
    } else {
      loadDiaries();
    }
    setAllTags(getAllTags());
  }, [user, filter, searchParams, showBookmarks]);

  useEffect(() => {
    filterAndSortDiaries();
  }, [diaries, searchTerm, sortBy, selectedTag]);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch weather for Hanoi
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Using OpenWeatherMap API (free tier)
        // Note: You'll need to get your own API key from openweathermap.org
        // For now, we'll use a mock/cached approach or a simple fetch
        // Since we don't have API key, I'll create a simple mock weather display
        const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
        
        if (apiKey) {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=Hanoi,VN&units=metric&appid=${apiKey}`
          );
          if (response.ok) {
            const data = await response.json();
            setWeather({
              temp: Math.round(data.main.temp),
              description: data.weather[0].description,
              icon: data.weather[0].icon
            });
          }
        } else {
          // Mock weather data when no API key
          setWeather({
            temp: 28,
            description: 'nắng',
            icon: '01d'
          });
        }
      } catch (error) {
        console.error('Error fetching weather:', error);
        // Fallback mock data
        setWeather({
          temp: 28,
          description: 'nắng',
          icon: '01d'
        });
      } finally {
        setWeatherLoading(false);
      }
    };

    fetchWeather();
  }, []);

  const loadDiaries = () => {
    let loadedDiaries = [];
    if (filter === 'my' && user) {
      loadedDiaries = getUserDiaries(user.id);
    } else if (filter === 'public') {
      loadedDiaries = getPublicDiaries();
    } else {
      // Show all public diaries
      loadedDiaries = getPublicDiaries();
    }

    // Filter by tag if selected
    if (selectedTag) {
      loadedDiaries = loadedDiaries.filter(diary =>
        diary.tags && 
        Array.isArray(diary.tags) && 
        diary.tags.some(tag => tag.toLowerCase() === selectedTag.toLowerCase())
      );
    }

    setDiaries(loadedDiaries);
  };

  const filterAndSortDiaries = () => {
    let filtered = [...diaries];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        diary =>
          diary.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          diary.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (diary.tags && diary.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    setFilteredDiaries(filtered);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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

  const getTextPreview = (htmlContent, maxLength = 150) => {
    if (!htmlContent) return '';
    try {
      // Remove HTML tags and get plain text
      const text = htmlContent.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength) + '...';
    } catch (error) {
      // Fallback: return as is if parsing fails
      return htmlContent.substring(0, maxLength);
    }
  };

  return (
    <div>
      {/* Banner Section */}
      <div className="relative z-10 overflow-hidden pt-[120px] pb-[60px] md:pt-[130px] lg:pt-[160px] dark:bg-dark">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center -mx-4">
            <div className="w-full px-4">
              <div className="text-center">
                <h1 className="mb-4 text-3xl font-bold text-dark dark:text-white sm:text-4xl md:text-[40px] md:leading-[1.2]">
                  Nhật Ký Cá Nhân
                </h1>
                <p className="mb-5 text-base text-body-color dark:text-dark-6">
                  Xem và quản lý các bài nhật ký của bạn và người khác
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <section className="bg-[#F4F7FF] py-14 lg:py-20 dark:bg-dark">
        <div className="container mx-auto px-4">
          {/* Date, Time & Weather Widget */}
          <div className="mb-6 bg-white dark:bg-dark-2 rounded-lg shadow-sm p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <div>
                  <div className="text-sm text-body-color dark:text-dark-6 mb-1">Hôm nay</div>
                  <div className="text-2xl font-bold text-dark dark:text-white">
                    {currentTime.toLocaleDateString('vi-VN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
                <div className="h-12 w-px bg-stroke dark:bg-dark-3"></div>
                <div>
                  <div className="text-sm text-body-color dark:text-dark-6 mb-1">Giờ hiện tại</div>
                  <div className="text-2xl font-bold text-primary">
                    {currentTime.toLocaleTimeString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </div>
                </div>
              </div>
              {weather && (
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm text-body-color dark:text-dark-6 mb-1">Hà Nội</div>
                    {weatherLoading ? (
                      <div className="text-lg text-body-color dark:text-dark-6">Đang tải...</div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-dark dark:text-white">
                          {weather.temp}°C
                        </span>
                        <span className="text-sm text-body-color dark:text-dark-6 capitalize">
                          {weather.description}
                        </span>
                      </div>
                    )}
                  </div>
                  {weather.icon && (
                    <div className="text-4xl">
                      {weather.icon.includes('01') && '☀️'}
                      {weather.icon.includes('02') && '⛅'}
                      {weather.icon.includes('03') || weather.icon.includes('04') ? '☁️' : ''}
                      {weather.icon.includes('09') || weather.icon.includes('10') ? '🌧️' : ''}
                      {weather.icon.includes('11') && '⛈️'}
                      {weather.icon.includes('13') && '❄️'}
                      {weather.icon.includes('50') && '🌫️'}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="mb-8 bg-white dark:bg-dark-2 rounded-lg p-6 shadow-sm">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              {/* Search */}
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Tìm kiếm nhật ký..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-5 py-3 text-base transition bg-transparent border rounded-md outline-none border-stroke dark:border-dark-3 text-body-color dark:text-dark-6 placeholder:text-dark-6 focus:border-primary dark:focus:border-primary"
                />
              </div>

              {/* Filter */}
              {user && (
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => {
                      setFilter('all');
                      setShowBookmarks(false);
                    }}
                    className={`px-4 py-3 rounded-md transition ${
                      filter === 'all' && !showBookmarks
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 dark:bg-dark-3 text-dark dark:text-white'
                    }`}
                  >
                    Tất cả
                  </button>
                  <button
                    onClick={() => {
                      setFilter('my');
                      setShowBookmarks(false);
                    }}
                    className={`px-4 py-3 rounded-md transition ${
                      filter === 'my' && !showBookmarks
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 dark:bg-dark-3 text-dark dark:text-white'
                    }`}
                  >
                    Của tôi
                  </button>
                  <button
                    onClick={() => {
                      setFilter('public');
                      setShowBookmarks(false);
                    }}
                    className={`px-4 py-3 rounded-md transition ${
                      filter === 'public' && !showBookmarks
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 dark:bg-dark-3 text-dark dark:text-white'
                    }`}
                  >
                    Công khai
                  </button>
                  <button
                    onClick={() => {
                      setShowBookmarks(true);
                      setFilter('all');
                    }}
                    className={`px-4 py-3 rounded-md transition flex items-center gap-2 ${
                      showBookmarks
                        ? 'bg-yellow-500 text-white'
                        : 'bg-gray-100 dark:bg-dark-3 text-dark dark:text-white'
                    }`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill={showBookmarks ? 'currentColor' : 'none'}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                      />
                    </svg>
                    Đã lưu
                  </button>
                </div>
              )}

              {/* Sort */}
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-5 py-3 text-base transition bg-transparent border rounded-md outline-none border-stroke dark:border-dark-3 text-body-color dark:text-dark-6 focus:border-primary dark:focus:border-primary"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="oldest">Cũ nhất</option>
                  <option value="title">Theo tiêu đề</option>
                </select>
              </div>
            </div>

            {/* Selected Tag */}
            {selectedTag && (
              <div className="mb-4 flex items-center gap-2">
                <span className="text-sm text-body-color dark:text-dark-6">Đang lọc theo tag:</span>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  #{selectedTag}
                </span>
                <button
                  onClick={() => {
                    setSelectedTag('');
                    setSearchTerm('');
                  }}
                  className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition"
                >
                  Xóa bộ lọc
                </button>
              </div>
            )}

            {/* Popular Tags */}
            {allTags.length > 0 && !selectedTag && (
              <div className="mb-4">
                <p className="mb-2 text-sm font-medium text-dark dark:text-white">Tags phổ biến:</p>
                <div className="flex flex-wrap gap-2">
                  {allTags.slice(0, 10).map((tag, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedTag(tag)}
                      className="px-3 py-1 bg-gray-100 dark:bg-dark-3 text-body-color dark:text-dark-6 rounded-full text-sm hover:bg-primary/10 hover:text-primary transition"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {user && (
              <Link
                to="/diary/new"
                className="inline-block px-6 py-3 text-base font-medium text-[#1E40AF] bg-primary rounded-md hover:bg-blue-dark transition"
              >
                + Tạo nhật ký mới
              </Link>
            )}
          </div>

          {/* Diaries Grid */}
          {filteredDiaries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDiaries.map((diary) => (
                <div
                  key={diary.id}
                  className="bg-white dark:bg-dark-2 rounded-lg shadow-sm hover:shadow-md transition overflow-hidden"
                >
                  {diary.images && diary.images.length > 0 && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={diary.images[0]}
                        alt={diary.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {diary.mood && (
                          <span className="text-xl" title="Cảm xúc">
                            {getMoodEmoji(diary.mood)}
                          </span>
                        )}
                        <span className="text-sm text-body-color dark:text-dark-6">
                          {formatDate(diary.createdAt)}
                        </span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        diary.isPublic
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                      }`}>
                        {diary.isPublic ? 'Công khai' : 'Riêng tư'}
                      </span>
                    </div>
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="flex-1 text-xl font-semibold text-dark dark:text-white line-clamp-2">
                        {diary.title}
                      </h3>
                      {user && diary.isPublic && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            toggleBookmark(diary.id, user.id);
                            if (showBookmarks) {
                              loadDiaries();
                            }
                          }}
                          className="ml-2 p-2 hover:bg-gray-100 dark:hover:bg-dark-3 rounded transition"
                          title={isBookmarked(diary.id, user.id) ? 'Bỏ lưu' : 'Lưu'}
                        >
                          <svg
                            className={`w-5 h-5 ${isBookmarked(diary.id, user.id) ? 'fill-yellow-500 text-yellow-500' : 'text-body-color dark:text-dark-6'}`}
                            fill={isBookmarked(diary.id, user.id) ? 'currentColor' : 'none'}
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                    <p className="mb-4 text-base text-body-color dark:text-dark-6 line-clamp-3">
                      {getTextPreview(diary.content)}
                    </p>
                    {diary.tags && diary.tags.length > 0 && (
                      <div className="mb-4 flex flex-wrap gap-2">
                        {diary.tags.map((tag, tagIndex) => (
                          <button
                            key={tagIndex}
                            onClick={() => setSelectedTag(tag)}
                            className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition"
                          >
                            #{tag}
                          </button>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <svg
                            className="w-4 h-4 text-red-500"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          <span className="text-sm text-body-color dark:text-dark-6">
                            {getLikeCount(diary.id)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg
                            className="w-5 h-5 text-body-color dark:text-dark-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                          </svg>
                          <span className="text-sm text-body-color dark:text-dark-6">
                            {diary.comments?.length || 0}
                          </span>
                        </div>
                      </div>
                      <Link
                        to={`/diary/${diary.id}`}
                        className="text-primary hover:underline font-medium"
                      >
                        Đọc thêm →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-body-color dark:text-dark-6 mb-4">
                {searchTerm
                  ? 'Không tìm thấy nhật ký nào phù hợp'
                  : user && filter === 'my'
                  ? 'Bạn chưa có nhật ký nào. Hãy tạo nhật ký đầu tiên!'
                  : 'Chưa có nhật ký nào'}
              </p>
              {user && (!searchTerm || filter === 'my') && (
                <Link
                  to="/diary/new"
                  className="inline-block px-6 py-3 text-base font-medium text-[#1E40AF] bg-primary rounded-md hover:bg-blue-dark transition"
                >
                  Tạo nhật ký mới
                </Link>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default DiaryList;

