// Utility functions for managing diary data in JSON

export const getDiaries = () => {
  try {
    const diaries = localStorage.getItem('diaries');
    return diaries ? JSON.parse(diaries) : [];
  } catch (error) {
    console.error('Error reading diaries:', error);
    return [];
  }
};

export const saveDiaries = (diaries) => {
  try {
    localStorage.setItem('diaries', JSON.stringify(diaries));
    return true;
  } catch (error) {
    console.error('Error saving diaries:', error);
    return false;
  }
};

export const getDiaryById = (id) => {
  const diaries = getDiaries();
  return diaries.find(d => d.id === id);
};

export const createDiary = (diaryData) => {
  const diaries = getDiaries();
  const newDiary = {
    id: Date.now().toString(),
    ...diaryData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    comments: []
  };
  diaries.push(newDiary);
  saveDiaries(diaries);
  return newDiary;
};

export const updateDiary = (id, updates) => {
  const diaries = getDiaries();
  const index = diaries.findIndex(d => d.id === id);
  if (index !== -1) {
    diaries[index] = {
      ...diaries[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    saveDiaries(diaries);
    return diaries[index];
  }
  return null;
};

export const deleteDiary = (id) => {
  const diaries = getDiaries();
  const filtered = diaries.filter(d => d.id !== id);
  saveDiaries(filtered);
  return true;
};

export const addComment = (diaryId, comment) => {
  const diaries = getDiaries();
  const index = diaries.findIndex(d => d.id === diaryId);
  if (index !== -1) {
    const newComment = {
      id: Date.now().toString(),
      ...comment,
      createdAt: new Date().toISOString()
    };
    diaries[index].comments = diaries[index].comments || [];
    diaries[index].comments.push(newComment);
    saveDiaries(diaries);
    return newComment;
  }
  return null;
};

export const deleteComment = (diaryId, commentId) => {
  const diaries = getDiaries();
  const index = diaries.findIndex(d => d.id === diaryId);
  if (index !== -1) {
    diaries[index].comments = (diaries[index].comments || []).filter(c => c.id !== commentId);
    saveDiaries(diaries);
    return true;
  }
  return false;
};

// Get public diaries (for guests and all users to view)
export const getPublicDiaries = () => {
  const diaries = getDiaries();
  return diaries.filter(d => d.isPublic === true);
};

// Get user's own diaries (including private ones)
export const getUserDiaries = (userId) => {
  const diaries = getDiaries();
  return diaries.filter(d => d.userId === userId);
};

// Tags functions
export const getAllTags = () => {
  const diaries = getDiaries();
  const tagsSet = new Set();
  diaries.forEach(diary => {
    if (diary.tags && Array.isArray(diary.tags)) {
      diary.tags.forEach(tag => tagsSet.add(tag.toLowerCase()));
    }
  });
  return Array.from(tagsSet);
};

export const getDiariesByTag = (tag) => {
  const diaries = getDiaries();
  return diaries.filter(diary => 
    diary.tags && 
    Array.isArray(diary.tags) && 
    diary.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  );
};

// Like functions
export const toggleLike = (diaryId, userId) => {
  const diaries = getDiaries();
  const index = diaries.findIndex(d => d.id === diaryId);
  if (index !== -1) {
    if (!diaries[index].likes) {
      diaries[index].likes = [];
    }
    const likeIndex = diaries[index].likes.findIndex(l => l.userId === userId);
    if (likeIndex !== -1) {
      // Unlike
      diaries[index].likes.splice(likeIndex, 1);
    } else {
      // Like
      diaries[index].likes.push({
        userId,
        likedAt: new Date().toISOString()
      });
    }
    saveDiaries(diaries);
    return diaries[index];
  }
  return null;
};

export const isLikedByUser = (diaryId, userId) => {
  const diary = getDiaryById(diaryId);
  if (!diary || !diary.likes || !userId) return false;
  return diary.likes.some(l => l.userId === userId);
};

export const getLikeCount = (diaryId) => {
  const diary = getDiaryById(diaryId);
  return diary && diary.likes ? diary.likes.length : 0;
};

// Bookmark functions
export const toggleBookmark = (diaryId, userId) => {
  try {
    const bookmarks = JSON.parse(localStorage.getItem(`bookmarks_${userId}`) || '[]');
    const index = bookmarks.indexOf(diaryId);
    if (index !== -1) {
      bookmarks.splice(index, 1);
    } else {
      bookmarks.push(diaryId);
    }
    localStorage.setItem(`bookmarks_${userId}`, JSON.stringify(bookmarks));
    return bookmarks;
  } catch (error) {
    console.error('Error toggling bookmark:', error);
    return [];
  }
};

export const isBookmarked = (diaryId, userId) => {
  if (!userId) return false;
  try {
    const bookmarks = JSON.parse(localStorage.getItem(`bookmarks_${userId}`) || '[]');
    return bookmarks.includes(diaryId);
  } catch (error) {
    return false;
  }
};

export const getBookmarkedDiaries = (userId) => {
  if (!userId) return [];
  try {
    const bookmarks = JSON.parse(localStorage.getItem(`bookmarks_${userId}`) || '[]');
    const diaries = getDiaries();
    return diaries.filter(diary => bookmarks.includes(diary.id) && diary.isPublic);
  } catch (error) {
    console.error('Error getting bookmarked diaries:', error);
    return [];
  }
};

// Statistics functions
export const getDiaryStats = (userId) => {
  const diaries = getUserDiaries(userId);
  
  // Stats by month (last 12 months)
  const monthlyStats = {};
  const now = new Date();
  for (let i = 0; i < 12; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    monthlyStats[monthKey] = 0;
  }
  
  diaries.forEach(diary => {
    const date = new Date(diary.createdAt);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (monthlyStats[monthKey] !== undefined) {
      monthlyStats[monthKey]++;
    }
  });
  
  // Mood statistics
  const moodStats = {};
  diaries.forEach(diary => {
    if (diary.mood) {
      moodStats[diary.mood] = (moodStats[diary.mood] || 0) + 1;
    }
  });
  
  // Tag statistics
  const tagStats = {};
  diaries.forEach(diary => {
    if (diary.tags && Array.isArray(diary.tags)) {
      diary.tags.forEach(tag => {
        tagStats[tag] = (tagStats[tag] || 0) + 1;
      });
    }
  });
  
  // Calculate streak (consecutive days with diary entries)
  const sortedDiaries = [...diaries].sort((a, b) => 
    new Date(a.createdAt) - new Date(b.createdAt)
  );
  
  let streak = 0;
  if (sortedDiaries.length > 0) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let checkDate = new Date(today);
    let foundToday = false;
    
    // Check if there's an entry today
    const todayStr = today.toISOString().split('T')[0];
    foundToday = sortedDiaries.some(d => {
      const diaryDate = new Date(d.createdAt).toISOString().split('T')[0];
      return diaryDate === todayStr;
    });
    
    if (foundToday) {
      streak = 1;
      checkDate.setDate(checkDate.getDate() - 1);
      
      while (true) {
        const checkDateStr = checkDate.toISOString().split('T')[0];
        const hasEntry = sortedDiaries.some(d => {
          const diaryDate = new Date(d.createdAt).toISOString().split('T')[0];
          return diaryDate === checkDateStr;
        });
        
        if (hasEntry) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }
  }
  
  // Most used words (simple)
  const wordCount = {};
  diaries.forEach(diary => {
    const text = diary.content.replace(/<[^>]*>/g, ' ').toLowerCase();
    const words = text.split(/\s+/).filter(w => w.length > 3);
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });
  });
  
  const topWords = Object.entries(wordCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word, count]) => ({ word, count }));
  
  return {
    total: diaries.length,
    public: diaries.filter(d => d.isPublic).length,
    private: diaries.filter(d => !d.isPublic).length,
    monthlyStats,
    moodStats,
    tagStats,
    streak,
    topWords,
    totalLikes: diaries.reduce((sum, d) => sum + (d.likes?.length || 0), 0),
    totalComments: diaries.reduce((sum, d) => sum + (d.comments?.length || 0), 0)
  };
};

// Get diaries by date for Memory Lane
export const getDiariesByDate = (userId, targetDate) => {
  const diaries = getUserDiaries(userId);
  const targetMonth = targetDate.getMonth();
  const targetDay = targetDate.getDate();
  
  return diaries.filter(diary => {
    const diaryDate = new Date(diary.createdAt);
    return diaryDate.getMonth() === targetMonth && diaryDate.getDate() === targetDay;
  });
};

// Get diaries for calendar view
export const getDiariesForCalendar = (userId, year, month) => {
  const diaries = getUserDiaries(userId);
  return diaries.filter(diary => {
    const diaryDate = new Date(diary.createdAt);
    return diaryDate.getFullYear() === year && diaryDate.getMonth() === month;
  });
};

// Achievements & Badges functions
export const calculateAchievements = (userId) => {
  const diaries = getUserDiaries(userId);
  const achievements = [];
  
  // Get stats first
  let stats;
  try {
    stats = getDiaryStats(userId);
  } catch (error) {
    // Fallback if getDiaryStats fails
    stats = {
      streak: 0,
      totalLikes: 0,
      totalComments: 0,
      tagStats: {},
      moodStats: {}
    };
  }
  
  // Total diaries achievements
  if (diaries.length >= 1) achievements.push({ id: 'first_diary', name: 'Bước Khởi Đầu', description: 'Viết nhật ký đầu tiên', icon: '🎯' });
  if (diaries.length >= 10) achievements.push({ id: '10_diaries', name: 'Nhà Văn Trẻ', description: 'Viết 10 nhật ký', icon: '📝' });
  if (diaries.length >= 50) achievements.push({ id: '50_diaries', name: 'Người Kể Chuyện', description: 'Viết 50 nhật ký', icon: '📚' });
  if (diaries.length >= 100) achievements.push({ id: '100_diaries', name: 'Nhà Văn Chuyên Nghiệp', description: 'Viết 100 nhật ký', icon: '✍️' });
  
  // Streak achievements
  if (stats.streak >= 3) achievements.push({ id: '3_day_streak', name: 'Kiên Trì', description: 'Viết nhật ký 3 ngày liên tiếp', icon: '🔥' });
  if (stats.streak >= 7) achievements.push({ id: '7_day_streak', name: 'Tuần Lễ Hoàn Hảo', description: 'Viết nhật ký 7 ngày liên tiếp', icon: '🌟' });
  if (stats.streak >= 30) achievements.push({ id: '30_day_streak', name: 'Thói Quen Tốt', description: 'Viết nhật ký 30 ngày liên tiếp', icon: '💫' });
  if (stats.streak >= 100) achievements.push({ id: '100_day_streak', name: 'Bậc Thầy Nhật Ký', description: 'Viết nhật ký 100 ngày liên tiếp', icon: '👑' });
  
  // Public diaries
  const publicCount = diaries.filter(d => d.isPublic).length;
  if (publicCount >= 1) achievements.push({ id: 'first_public', name: 'Chia Sẻ', description: 'Chia sẻ nhật ký đầu tiên', icon: '🌍' });
  if (publicCount >= 10) achievements.push({ id: '10_public', name: 'Cộng Đồng', description: 'Chia sẻ 10 nhật ký công khai', icon: '👥' });
  
  // Likes achievements
  if (stats.totalLikes >= 10) achievements.push({ id: '10_likes', name: 'Được Yêu Thích', description: 'Nhận được 10 lượt thích', icon: '❤️' });
  if (stats.totalLikes >= 50) achievements.push({ id: '50_likes', name: 'Ngôi Sao', description: 'Nhận được 50 lượt thích', icon: '⭐' });
  
  // Comments achievements
  if (stats.totalComments >= 10) achievements.push({ id: '10_comments', name: 'Giao Lưu', description: 'Nhận được 10 bình luận', icon: '💬' });
  
  // Tags achievements
  const tagCount = Object.keys(stats.tagStats).length;
  if (tagCount >= 5) achievements.push({ id: '5_tags', name: 'Tổ Chức Tốt', description: 'Sử dụng 5 tags khác nhau', icon: '🏷️' });
  
  // Mood achievements
  const moodCount = Object.keys(stats.moodStats).length;
  if (moodCount >= 5) achievements.push({ id: '5_moods', name: 'Đa Cảm Xúc', description: 'Ghi lại 5 cảm xúc khác nhau', icon: '😊' });
  
  // Save achievements to localStorage
  try {
    localStorage.setItem(`achievements_${userId}`, JSON.stringify(achievements.map(a => a.id)));
  } catch (error) {
    console.error('Error saving achievements:', error);
  }
  
  return achievements;
};

export const getUnlockedAchievements = (userId) => {
  try {
    return JSON.parse(localStorage.getItem(`achievements_${userId}`) || '[]');
  } catch {
    return [];
  }
};

// Get random diary
export const getRandomDiary = (userId) => {
  const diaries = getUserDiaries(userId);
  if (diaries.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * diaries.length);
  return diaries[randomIndex];
};

// Get all images from diaries
export const getAllDiaryImages = (userId) => {
  const diaries = getUserDiaries(userId);
  const images = [];
  
  diaries.forEach(diary => {
    if (diary.images && Array.isArray(diary.images)) {
      diary.images.forEach((image, index) => {
        images.push({
          id: `${diary.id}_${index}`,
          url: image,
          diaryId: diary.id,
          diaryTitle: diary.title,
          diaryDate: diary.createdAt
        });
      });
    }
  });
  
  return images.sort((a, b) => new Date(b.diaryDate) - new Date(a.diaryDate));
};

// Export functions
export const exportDiariesToJSON = (userId) => {
  const diaries = getUserDiaries(userId);
  const exportData = {
    exportDate: new Date().toISOString(),
    totalDiaries: diaries.length,
    diaries: diaries
  };
  return JSON.stringify(exportData, null, 2);
};

export const exportDiariesToCSV = (userId) => {
  const diaries = getUserDiaries(userId);
  const headers = ['Ngày', 'Tiêu đề', 'Nội dung', 'Công khai', 'Cảm xúc', 'Tags', 'Lượt thích', 'Bình luận'];
  
  const rows = diaries.map(diary => {
    const date = new Date(diary.createdAt).toLocaleDateString('vi-VN');
    const content = diary.content.replace(/<[^>]*>/g, '').replace(/"/g, '""');
    const isPublic = diary.isPublic ? 'Có' : 'Không';
    const mood = diary.mood || '';
    const tags = diary.tags ? diary.tags.join(', ') : '';
    const likes = diary.likes ? diary.likes.length : 0;
    const comments = diary.comments ? diary.comments.length : 0;
    
    return `"${date}","${diary.title}","${content}","${isPublic}","${mood}","${tags}",${likes},${comments}`;
  });
  
  return headers.join(',') + '\n' + rows.join('\n');
};

// Initialize sample data if empty
export const initializeSampleData = () => {
  const diaries = getDiaries();
  if (diaries.length === 0) {
    const sampleDiaries = [
      {
        id: '1',
        userId: 'sample-user',
        title: 'Chào mừng đến với Nhật ký Cá nhân',
        content: 'Đây là ứng dụng nhật ký cá nhân của bạn. Bạn có thể viết, chỉnh sửa và quản lý các bài nhật ký của mình.',
        images: [],
        isPublic: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        comments: []
      }
    ];
    saveDiaries(sampleDiaries);
  }
};

