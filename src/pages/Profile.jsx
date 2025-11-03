import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserDiaries } from '../utils/storage';

const Profile = () => {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    avatar: user?.avatar || ''
  });

  if (!user) {
    navigate('/signin');
    return null;
  }

  const diaries = getUserDiaries(user.id);
  const publicDiaries = diaries.filter(d => d.isPublic).length;
  const privateDiaries = diaries.filter(d => !d.isPublic).length;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          avatar: reader.result
        }));
      };
      reader.readAsDataURL(file);
    } else {
      alert('Vui lòng chọn file ảnh hợp lệ');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
    setIsEditing(false);
    alert('Cập nhật thông tin thành công!');
  };

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc muốn đăng xuất?')) {
      logout();
      navigate('/');
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
                  Hồ sơ cá nhân
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Section */}
      <section className="bg-[#F4F7FF] py-14 lg:py-20 dark:bg-dark">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Profile Card */}
            <div className="bg-white dark:bg-dark-2 rounded-lg shadow-sm p-8 mb-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full bg-primary flex items-center justify-center text-white text-4xl font-semibold overflow-hidden">
                      {formData.avatar ? (
                        <img
                          src={formData.avatar}
                          alt={formData.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        formData.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    {isEditing && (
                      <label className="absolute bottom-0 right-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-dark transition">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="hidden"
                        />
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </label>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 w-full">
                  {isEditing ? (
                    <form onSubmit={handleSubmit}>
                      <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-dark dark:text-white">
                          Tên
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 text-base border rounded-md border-stroke dark:border-dark-3 bg-transparent text-body-color dark:text-dark-6 focus:border-primary"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-dark dark:text-white">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          disabled
                          className="w-full px-4 py-2 text-base border rounded-md border-stroke dark:border-dark-3 bg-gray-100 dark:bg-dark-3 text-body-color dark:text-dark-6"
                        />
                        <p className="mt-1 text-xs text-body-color dark:text-dark-6">
                          Email không thể thay đổi
                        </p>
                      </div>
                      <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-dark dark:text-white">
                          Giới thiệu
                        </label>
                        <textarea
                          name="bio"
                          value={formData.bio}
                          onChange={handleChange}
                          rows="3"
                          className="w-full px-4 py-2 text-base border rounded-md border-stroke dark:border-dark-3 bg-transparent text-body-color dark:text-dark-6 focus:border-primary"
                          placeholder="Viết vài dòng về bản thân..."
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="px-6 py-2 text-base font-medium text-[#1E40AF] bg-primary rounded-md hover:bg-blue-dark transition"
                        >
                          Lưu
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditing(false);
                            setFormData({
                              name: user?.name || '',
                              email: user?.email || '',
                              bio: user?.bio || '',
                              avatar: user?.avatar || ''
                            });
                          }}
                          className="px-6 py-2 text-base font-medium text-dark dark:text-white border border-stroke dark:border-dark-3 rounded-md hover:bg-gray-100 dark:hover:bg-dark-3 transition"
                        >
                          Hủy
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <h2 className="mb-2 text-2xl font-bold text-dark dark:text-white">
                        {user.name}
                      </h2>
                      <p className="mb-4 text-body-color dark:text-dark-6">
                        {user.email}
                      </p>
                      {user.bio && (
                        <p className="mb-4 text-body-color dark:text-dark-6 whitespace-pre-wrap">
                          {user.bio}
                        </p>
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={() => setIsEditing(true)}
                          className="px-6 py-2 text-base font-medium text-primary border border-primary rounded-md hover:bg-primary hover:text-[#1E40AF] transition"
                        >
                          Chỉnh sửa hồ sơ
                        </button>
                        <button
                          onClick={handleLogout}
                          className="px-6 py-2 text-base font-medium text-red-600 border border-red-600 rounded-md hover:bg-red-600 hover:text-white transition"
                        >
                          Đăng xuất
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white dark:bg-dark-2 rounded-lg shadow-sm p-6 text-center">
                <div className="mb-2 text-3xl font-bold text-primary">
                  {diaries.length}
                </div>
                <div className="text-body-color dark:text-dark-6">
                  Tổng số nhật ký
                </div>
              </div>
              <div className="bg-white dark:bg-dark-2 rounded-lg shadow-sm p-6 text-center">
                <div className="mb-2 text-3xl font-bold text-green-600">
                  {publicDiaries}
                </div>
                <div className="text-body-color dark:text-dark-6">
                  Nhật ký công khai
                </div>
              </div>
              <div className="bg-white dark:bg-dark-2 rounded-lg shadow-sm p-6 text-center">
                <div className="mb-2 text-3xl font-bold text-gray-600">
                  {privateDiaries}
                </div>
                <div className="text-body-color dark:text-dark-6">
                  Nhật ký riêng tư
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Link
                to="/dashboard"
                className="bg-white dark:bg-dark-2 rounded-lg shadow-sm p-4 hover:shadow-md transition text-center"
              >
                <div className="text-3xl mb-2">📊</div>
                <div className="text-sm font-medium text-dark dark:text-white">Thống kê</div>
              </Link>
              <Link
                to="/achievements"
                className="bg-white dark:bg-dark-2 rounded-lg shadow-sm p-4 hover:shadow-md transition text-center"
              >
                <div className="text-3xl mb-2">🏆</div>
                <div className="text-sm font-medium text-dark dark:text-white">Thành tích</div>
              </Link>
              <Link
                to="/gallery"
                className="bg-white dark:bg-dark-2 rounded-lg shadow-sm p-4 hover:shadow-md transition text-center"
              >
                <div className="text-3xl mb-2">📷</div>
                <div className="text-sm font-medium text-dark dark:text-white">Thư viện ảnh</div>
              </Link>
              <Link
                to="/export"
                className="bg-white dark:bg-dark-2 rounded-lg shadow-sm p-4 hover:shadow-md transition text-center"
              >
                <div className="text-3xl mb-2">💾</div>
                <div className="text-sm font-medium text-dark dark:text-white">Xuất & Sao lưu</div>
              </Link>
            </div>

            {/* My Diaries */}
            <div className="bg-white dark:bg-dark-2 rounded-lg shadow-sm p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-dark dark:text-white">
                  Nhật ký của tôi
                </h3>
                <Link
                  to="/diary/new"
                  className="px-4 py-2 text-sm font-medium text-[#1E40AF] bg-primary rounded-md hover:bg-blue-dark transition"
                >
                  + Tạo mới
                </Link>
              </div>

              {diaries.length > 0 ? (
                <div className="space-y-4">
                  {diaries.map((diary) => (
                    <div
                      key={diary.id}
                      className="p-4 border border-stroke dark:border-dark-3 rounded-lg hover:shadow-md transition"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
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
                          <p className="mb-2 text-sm text-body-color dark:text-dark-6 line-clamp-2">
                            {diary.content}
                          </p>
                          <p className="text-xs text-body-color dark:text-dark-6">
                            {new Date(diary.createdAt).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Link
                            to={`/diary/${diary.id}`}
                            className="px-3 py-1 text-sm text-primary hover:underline"
                          >
                            Xem
                          </Link>
                          <Link
                            to={`/diary/edit/${diary.id}`}
                            className="px-3 py-1 text-sm text-primary hover:underline"
                          >
                            Sửa
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="mb-4 text-body-color dark:text-dark-6">
                    Bạn chưa có nhật ký nào
                  </p>
                  <Link
                    to="/diary/new"
                    className="inline-block px-6 py-3 text-base font-medium text-[#1E40AF] bg-primary rounded-md hover:bg-blue-dark transition"
                  >
                    Tạo nhật ký đầu tiên
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

export default Profile;

