import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getRandomDiary, getUserDiaries } from '../utils/storage';

const RandomDiary = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [randomDiary, setRandomDiary] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }
    loadRandomDiary();
  }, [user, navigate]);

  const loadRandomDiary = () => {
    if (!user) return;
    setLoading(true);
    const diary = getRandomDiary(user.id);
    setRandomDiary(diary);
    setLoading(false);
  };

  const handleSurpriseMe = () => {
    loadRandomDiary();
  };

  if (!user) {
    return null;
  }

  const diaries = getUserDiaries(user.id);

  if (diaries.length === 0) {
    return (
      <div>
        <div className="relative z-10 overflow-hidden pt-[120px] pb-[60px] md:pt-[130px] lg:pt-[160px] dark:bg-dark">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="mb-4 text-3xl font-bold text-dark dark:text-white sm:text-4xl md:text-[40px] md:leading-[1.2]">
                Nhật Ký Ngẫu Nhiên
              </h1>
            </div>
          </div>
        </div>
        <section className="bg-[#F4F7FF] py-14 lg:py-20 dark:bg-dark">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <div className="text-6xl mb-4">🎲</div>
              <p className="mb-6 text-lg text-body-color dark:text-dark-6">
                Bạn chưa có nhật ký nào. Hãy tạo nhật ký đầu tiên để sử dụng tính năng này!
              </p>
              <Link
                to="/diary/new"
                className="inline-block px-6 py-3 text-base font-medium text-[#1E40AF] bg-primary rounded-md hover:bg-blue-dark transition"
              >
                Tạo nhật ký đầu tiên
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
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

  return (
    <div>
      {/* Banner Section */}
      <div className="relative z-10 overflow-hidden pt-[120px] pb-[60px] md:pt-[130px] lg:pt-[160px] dark:bg-dark">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center -mx-4">
            <div className="w-full px-4">
              <div className="text-center">
                <h1 className="mb-4 text-3xl font-bold text-dark dark:text-white sm:text-4xl md:text-[40px] md:leading-[1.2]">
                  Nhật Ký Ngẫu Nhiên
                </h1>
                <p className="mb-5 text-base text-body-color dark:text-dark-6">
                  Xem lại một nhật ký ngẫu nhiên từ quá khứ của bạn
                </p>
                <button
                  onClick={handleSurpriseMe}
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-8 py-4 text-lg font-medium text-[#1E40AF] bg-gradient-to-r from-primary to-blue-dark rounded-md hover:from-blue-dark hover:to-primary transition shadow-lg disabled:opacity-50"
                >
                  <span className="text-2xl">🎲</span>
                  {loading ? 'Đang tìm...' : 'Surprise Me!'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <section className="bg-[#F4F7FF] py-14 lg:py-20 dark:bg-dark">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {randomDiary ? (
              <div className="bg-white dark:bg-dark-2 rounded-lg shadow-sm p-8">
                <div className="text-center mb-6">
                  <div className="text-5xl mb-4">✨</div>
                  <p className="text-lg text-body-color dark:text-dark-6">
                    Đây là nhật ký được chọn ngẫu nhiên cho bạn!
                  </p>
                </div>

                {/* Diary Card */}
                <div className="border border-stroke dark:border-dark-3 rounded-lg p-6 mb-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {randomDiary.mood && (
                        <span className="text-3xl">{getMoodEmoji(randomDiary.mood)}</span>
                      )}
                      <div>
                        <h2 className="text-2xl font-bold text-dark dark:text-white mb-1">
                          {randomDiary.title}
                        </h2>
                        <p className="text-sm text-body-color dark:text-dark-6">
                          {formatDate(randomDiary.createdAt)}
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded ${
                      randomDiary.isPublic
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}>
                      {randomDiary.isPublic ? 'Công khai' : 'Riêng tư'}
                    </span>
                  </div>

                  {/* Images */}
                  {randomDiary.images && randomDiary.images.length > 0 && (
                    <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {randomDiary.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`${randomDiary.title} - ${index + 1}`}
                          className="w-full h-64 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  )}

                  {/* Content Preview */}
                  <div className="mb-6">
                    <div
                      className="text-base leading-relaxed text-body-color dark:text-dark-6 line-clamp-6"
                      dangerouslySetInnerHTML={{ __html: randomDiary.content }}
                    />
                  </div>

                  {/* Tags */}
                  {randomDiary.tags && randomDiary.tags.length > 0 && (
                    <div className="mb-6 flex flex-wrap gap-2">
                      {randomDiary.tags.map((tag, index) => (
                        <Link
                          key={index}
                          to={`/diary?tag=${encodeURIComponent(tag)}`}
                          className="text-xs px-3 py-1 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition"
                        >
                          #{tag}
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-4">
                    <Link
                      to={`/diary/${randomDiary.id}`}
                      className="flex-1 px-6 py-3 text-base font-medium text-[#1E40AF] bg-primary rounded-md hover:bg-blue-dark transition text-center"
                    >
                      Đọc đầy đủ →
                    </Link>
                    <button
                      onClick={handleSurpriseMe}
                      disabled={loading}
                      className="px-6 py-3 text-base font-medium text-dark dark:text-white border border-stroke dark:border-dark-3 rounded-md hover:bg-gray-100 dark:hover:bg-dark-3 transition disabled:opacity-50"
                    >
                      🎲 Ngẫu nhiên khác
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎲</div>
                <p className="text-lg text-body-color dark:text-dark-6 mb-6">
                  Nhấn nút "Surprise Me!" để xem một nhật ký ngẫu nhiên
                </p>
                <button
                  onClick={handleSurpriseMe}
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-8 py-4 text-lg font-medium text-[#1E40AF] bg-gradient-to-r from-primary to-blue-dark rounded-md hover:from-blue-dark hover:to-primary transition shadow-lg disabled:opacity-50"
                >
                  <span className="text-2xl">🎲</span>
                  {loading ? 'Đang tìm...' : 'Surprise Me!'}
                </button>
              </div>
            )}

            {/* Quick Stats */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-dark-2 rounded-lg shadow-sm p-4 text-center">
                <div className="text-2xl mb-2">📝</div>
                <div className="text-2xl font-bold text-primary mb-1">{diaries.length}</div>
                <div className="text-sm text-body-color dark:text-dark-6">Tổng số nhật ký</div>
              </div>
              <div className="bg-white dark:bg-dark-2 rounded-lg shadow-sm p-4 text-center">
                <div className="text-2xl mb-2">📅</div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                  {new Set(diaries.map(d => new Date(d.createdAt).toDateString())).size}
                </div>
                <div className="text-sm text-body-color dark:text-dark-6">Ngày có nhật ký</div>
              </div>
              <div className="bg-white dark:bg-dark-2 rounded-lg shadow-sm p-4 text-center">
                <div className="text-2xl mb-2">📷</div>
                <div className="text-2xl font-bold text-primary dark:text-blue-dark mb-1">
                  {diaries.reduce((sum, d) => sum + (d.images?.length || 0), 0)}
                </div>
                <div className="text-sm text-body-color dark:text-dark-6">Tổng số ảnh</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RandomDiary;

