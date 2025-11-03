import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDiaryById, addComment, deleteComment, deleteDiary, toggleLike, isLikedByUser, getLikeCount, toggleBookmark, isBookmarked } from '../utils/storage';

const DiaryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [diary, setDiary] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    const diaryData = getDiaryById(id);
    if (diaryData) {
      // Check if user can view this diary
      if (!diaryData.isPublic && (!user || diaryData.userId !== user.id)) {
        navigate('/diary');
        return;
      }
      setDiary(diaryData);
      setLikeCount(getLikeCount(id));
      setIsLiked(user ? isLikedByUser(id, user.id) : false);
      setBookmarked(user ? isBookmarked(id, user.id) : false);
    } else {
      navigate('/diary');
    }
    setLoading(false);
  }, [id, user, navigate]);

  const handleAddComment = () => {
    if (!user) {
      navigate('/signin');
      return;
    }

    if (!commentText.trim()) {
      return;
    }

    const comment = {
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar || '',
      text: commentText
    };

    addComment(id, comment);
    const updatedDiary = getDiaryById(id);
    setDiary(updatedDiary);
    setCommentText('');
  };

  const handleDeleteComment = (commentId) => {
    if (window.confirm('Bạn có chắc muốn xóa bình luận này?')) {
      deleteComment(id, commentId);
      const updatedDiary = getDiaryById(id);
      setDiary(updatedDiary);
    }
  };

  const handleDeleteDiary = () => {
    if (window.confirm('Bạn có chắc muốn xóa nhật ký này?')) {
      deleteDiary(id);
      navigate('/diary');
    }
  };

  const handleToggleLike = () => {
    if (!user) {
      navigate('/signin');
      return;
    }
    const updatedDiary = toggleLike(id, user.id);
    if (updatedDiary) {
      setLikeCount(getLikeCount(id));
      setIsLiked(isLikedByUser(id, user.id));
      setDiary(updatedDiary);
    }
  };

  const handleToggleBookmark = () => {
    if (!user) {
      navigate('/signin');
      return;
    }
    toggleBookmark(id, user.id);
    setBookmarked(isBookmarked(id, user.id));
  };

  const formatDate = (dateString) => {
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-body-color dark:text-dark-6">Đang tải...</p>
      </div>
    );
  }

  if (!diary) {
    return null;
  }

  const isOwner = user && diary.userId === user.id;

  return (
    <div>
      {/* Banner Section */}
      <div className="relative z-10 overflow-hidden pt-[120px] pb-[60px] md:pt-[130px] lg:pt-[160px] dark:bg-dark">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center -mx-4">
            <div className="w-full px-4">
              <div className="text-center">
                <h1 className="mb-4 text-3xl font-bold text-dark dark:text-white sm:text-4xl md:text-[40px] md:leading-[1.2]">
                  Chi tiết nhật ký
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <section className="bg-[#F4F7FF] py-14 lg:py-20 dark:bg-dark">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Diary Card */}
            <div className="bg-white dark:bg-dark-2 rounded-lg shadow-sm p-8 mb-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4 flex-wrap">
                  {diary.mood && (
                    <span className="text-2xl" title="Cảm xúc">
                      {getMoodEmoji(diary.mood)}
                    </span>
                  )}
                  <span className={`text-xs px-3 py-1 rounded ${
                    diary.isPublic
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  }`}>
                    {diary.isPublic ? 'Công khai' : 'Riêng tư'}
                  </span>
                  <span className="text-sm text-body-color dark:text-dark-6">
                    {formatDate(diary.createdAt)}
                  </span>
                  {diary.tags && diary.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {diary.tags.map((tag, index) => (
                        <Link
                          key={index}
                          to={`/diary?tag=${encodeURIComponent(tag)}`}
                          className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition"
                        >
                          #{tag}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                {isOwner && (
                  <div className="flex gap-2">
                    <Link
                      to={`/diary/edit/${id}`}
                      className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-md hover:bg-primary hover:text-[#1E40AF] transition"
                    >
                      Sửa
                    </Link>
                    <button
                      onClick={handleDeleteDiary}
                      className="px-4 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-md hover:bg-red-600 hover:text-white transition"
                    >
                      Xóa
                    </button>
                  </div>
                )}
              </div>

              {/* Title */}
              <h2 className="mb-4 text-3xl font-bold text-dark dark:text-white">
                {diary.title}
              </h2>

              {/* Images */}
              {diary.images && diary.images.length > 0 && (
                <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {diary.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${diary.title} - ${index + 1}`}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}

              {/* Content */}
              <div className="mb-6">
                <div 
                  className="text-base leading-relaxed text-body-color dark:text-dark-6 prose prose-sm max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: diary.content }}
                />
              </div>

              {/* Footer */}
              <div className="pt-6 border-t border-stroke dark:border-dark-3">
                <div className="flex items-center gap-6 flex-wrap">
                  <button
                    onClick={handleToggleLike}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${
                      isLiked
                        ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                        : 'bg-gray-100 text-body-color dark:bg-dark-3 dark:text-dark-6 hover:bg-red-50 dark:hover:bg-red-900/10'
                    }`}
                  >
                    <svg
                      className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`}
                      fill={isLiked ? 'currentColor' : 'none'}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    <span className="font-medium">{likeCount}</span>
                  </button>
                  {diary.isPublic && (
                    <button
                      onClick={handleToggleBookmark}
                      className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${
                        bookmarked
                          ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400'
                          : 'bg-gray-100 text-body-color dark:bg-dark-3 dark:text-dark-6 hover:bg-yellow-50 dark:hover:bg-yellow-900/10'
                      }`}
                      title={bookmarked ? 'Bỏ lưu' : 'Lưu vào bộ sưu tập'}
                    >
                      <svg
                        className={`w-5 h-5 ${bookmarked ? 'fill-current' : ''}`}
                        fill={bookmarked ? 'currentColor' : 'none'}
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
                      <span className="font-medium">{bookmarked ? 'Đã lưu' : 'Lưu'}</span>
                    </button>
                  )}
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
                    <span className="text-body-color dark:text-dark-6">
                      {diary.comments?.length || 0} bình luận
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white dark:bg-dark-2 rounded-lg shadow-sm p-8">
              <h3 className="mb-6 text-2xl font-bold text-dark dark:text-white">
                Bình luận ({diary.comments?.length || 0})
              </h3>

              {/* Add Comment Form */}
              {user ? (
                <div className="mb-8">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Viết bình luận của bạn..."
                    rows="4"
                    className="w-full px-5 py-3 mb-4 text-base transition bg-transparent border rounded-md outline-none border-stroke dark:border-dark-3 text-body-color dark:text-dark-6 placeholder:text-dark-6 focus:border-primary dark:focus:border-primary"
                  />
                  <button
                    onClick={handleAddComment}
                    className="px-6 py-3 text-base font-medium text-[#1E40AF] bg-primary rounded-md hover:bg-blue-dark transition"
                  >
                    Gửi bình luận
                  </button>
                </div>
              ) : (
                <div className="mb-8 p-4 bg-gray-100 dark:bg-dark-3 rounded-lg">
                  <p className="text-body-color dark:text-dark-6 mb-2">
                    Vui lòng đăng nhập để bình luận
                  </p>
                  <Link
                    to="/signin"
                    className="text-primary hover:underline"
                  >
                    Đăng nhập
                  </Link>
                </div>
              )}

              {/* Comments List */}
              <div className="space-y-6">
                {diary.comments && diary.comments.length > 0 ? (
                  diary.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="p-4 border border-stroke dark:border-dark-3 rounded-lg"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
                            {comment.userAvatar ? (
                              <img
                                src={comment.userAvatar}
                                alt={comment.userName}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              comment.userName.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-dark dark:text-white">
                              {comment.userName}
                            </p>
                            <p className="text-sm text-body-color dark:text-dark-6">
                              {formatDate(comment.createdAt)}
                            </p>
                          </div>
                        </div>
                        {(isOwner || (user && comment.userId === user.id)) && (
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Xóa
                          </button>
                        )}
                      </div>
                      <p className="text-body-color dark:text-dark-6 whitespace-pre-wrap">
                        {comment.text}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-body-color dark:text-dark-6 py-8">
                    Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
                  </p>
                )}
              </div>
            </div>

            {/* Back Button */}
            <div className="mt-6 text-center">
              <Link
                to="/diary"
                className="inline-block px-6 py-3 text-base font-medium text-dark dark:text-white border border-stroke dark:border-dark-3 rounded-md hover:bg-gray-100 dark:hover:bg-dark-3 transition"
              >
                ← Quay lại danh sách
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DiaryDetail;

