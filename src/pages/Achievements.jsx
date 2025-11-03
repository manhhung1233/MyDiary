import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { calculateAchievements, getUnlockedAchievements } from '../utils/storage';

const Achievements = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [achievements, setAchievements] = useState([]);
  const [unlockedIds, setUnlockedIds] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }
    const userAchievements = calculateAchievements(user.id);
    setAchievements(userAchievements);
    setUnlockedIds(getUnlockedAchievements(user.id));
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const allAchievements = [
    { id: 'first_diary', name: 'Bước Khởi Đầu', description: 'Viết nhật ký đầu tiên', icon: '🎯', category: 'Viết' },
    { id: '10_diaries', name: 'Nhà Văn Trẻ', description: 'Viết 10 nhật ký', icon: '📝', category: 'Viết' },
    { id: '50_diaries', name: 'Người Kể Chuyện', description: 'Viết 50 nhật ký', icon: '📚', category: 'Viết' },
    { id: '100_diaries', name: 'Nhà Văn Chuyên Nghiệp', description: 'Viết 100 nhật ký', icon: '✍️', category: 'Viết' },
    { id: '3_day_streak', name: 'Kiên Trì', description: 'Viết nhật ký 3 ngày liên tiếp', icon: '🔥', category: 'Streak' },
    { id: '7_day_streak', name: 'Tuần Lễ Hoàn Hảo', description: 'Viết nhật ký 7 ngày liên tiếp', icon: '🌟', category: 'Streak' },
    { id: '30_day_streak', name: 'Thói Quen Tốt', description: 'Viết nhật ký 30 ngày liên tiếp', icon: '💫', category: 'Streak' },
    { id: '100_day_streak', name: 'Bậc Thầy Nhật Ký', description: 'Viết nhật ký 100 ngày liên tiếp', icon: '👑', category: 'Streak' },
    { id: 'first_public', name: 'Chia Sẻ', description: 'Chia sẻ nhật ký đầu tiên', icon: '🌍', category: 'Xã hội' },
    { id: '10_public', name: 'Cộng Đồng', description: 'Chia sẻ 10 nhật ký công khai', icon: '👥', category: 'Xã hội' },
    { id: '10_likes', name: 'Được Yêu Thích', description: 'Nhận được 10 lượt thích', icon: '❤️', category: 'Xã hội' },
    { id: '50_likes', name: 'Ngôi Sao', description: 'Nhận được 50 lượt thích', icon: '⭐', category: 'Xã hội' },
    { id: '10_comments', name: 'Giao Lưu', description: 'Nhận được 10 bình luận', icon: '💬', category: 'Xã hội' },
    { id: '5_tags', name: 'Tổ Chức Tốt', description: 'Sử dụng 5 tags khác nhau', icon: '🏷️', category: 'Khác' },
    { id: '5_moods', name: 'Đa Cảm Xúc', description: 'Ghi lại 5 cảm xúc khác nhau', icon: '😊', category: 'Khác' }
  ];

  const unlocked = achievements.filter(a => unlockedIds.includes(a.id));
  const locked = allAchievements.filter(a => !unlockedIds.includes(a.id));

  const getCategoryColor = (category) => {
    const colors = {
      'Viết': 'bg-primary/10 text-blue-dark dark:bg-primary/20 dark:text-primary',
      'Streak': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
      'Xã hội': 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400',
      'Khác': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
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
                  Thành Tích & Huy Hiệu
                </h1>
                <p className="mb-5 text-base text-body-color dark:text-dark-6">
                  Theo dõi những thành tựu của bạn
                </p>
                <div className="inline-flex items-center gap-2 px-6 py-2 bg-primary/10 rounded-full">
                  <span className="text-2xl">🏆</span>
                  <span className="text-lg font-semibold text-primary">
                    {unlocked.length} / {allAchievements.length} thành tích đã mở khóa
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <section className="bg-[#F4F7FF] py-14 lg:py-20 dark:bg-dark">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Unlocked Achievements */}
            {unlocked.length > 0 && (
              <div className="mb-8">
                <h2 className="mb-6 text-2xl font-bold text-dark dark:text-white">
                  Thành tích đã đạt được ({unlocked.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {unlocked.map((achievement) => {
                    const fullAchievement = allAchievements.find(a => a.id === achievement.id);
                    return (
                      <div
                        key={achievement.id}
                        className="bg-white dark:bg-dark-2 rounded-lg shadow-sm p-6 border-2 border-primary"
                      >
                        <div className="text-center mb-4">
                          <div className="text-6xl mb-3">{achievement.icon}</div>
                          <h3 className="text-xl font-bold text-dark dark:text-white mb-2">
                            {achievement.name}
                          </h3>
                          <p className="text-sm text-body-color dark:text-dark-6 mb-3">
                            {achievement.description}
                          </p>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(fullAchievement?.category || '')}`}>
                            {fullAchievement?.category || 'Khác'}
                          </span>
                        </div>
                        <div className="text-center">
                          <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                            ✓ Đã mở khóa
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Locked Achievements */}
            {locked.length > 0 && (
              <div>
                <h2 className="mb-6 text-2xl font-bold text-dark dark:text-white">
                  Thành tích chưa mở khóa ({locked.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {locked.map((achievement) => (
                    <div
                      key={achievement.id}
                      className="bg-white dark:bg-dark-2 rounded-lg shadow-sm p-6 opacity-60 border border-stroke dark:border-dark-3"
                    >
                      <div className="text-center mb-4">
                        <div className="text-6xl mb-3 filter grayscale">{achievement.icon}</div>
                        <h3 className="text-xl font-bold text-dark dark:text-white mb-2">
                          {achievement.name}
                        </h3>
                        <p className="text-sm text-body-color dark:text-dark-6 mb-3">
                          {achievement.description}
                        </p>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(achievement.category)}`}>
                          {achievement.category}
                        </span>
                      </div>
                      <div className="text-center">
                        <span className="text-xs text-body-color dark:text-dark-6">
                          🔒 Chưa mở khóa
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-8 text-center">
              <Link
                to="/diary"
                className="inline-block px-6 py-3 text-base font-medium text-[#1E40AF] bg-primary rounded-md hover:bg-blue-dark transition mr-4"
              >
                Xem nhật ký
              </Link>
              <Link
                to="/diary/new"
                className="inline-block px-6 py-3 text-base font-medium text-dark dark:text-white border border-stroke dark:border-dark-3 rounded-md hover:bg-gray-100 dark:hover:bg-dark-3 transition"
              >
                Viết nhật ký mới
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Achievements;

