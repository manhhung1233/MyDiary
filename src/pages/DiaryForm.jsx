import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDiaryById, createDiary, updateDiary } from '../utils/storage';

const DiaryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEdit = !!id;
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    isPublic: true,
    images: [],
    tags: [],
    mood: ''
  });

  const moods = [
    { emoji: '😊', value: 'happy', label: 'Vui vẻ' },
    { emoji: '😢', value: 'sad', label: 'Buồn' },
    { emoji: '😡', value: 'angry', label: 'Tức giận' },
    { emoji: '😴', value: 'tired', label: 'Mệt mỏi' },
    { emoji: '🎉', value: 'excited', label: 'Hứng khởi' },
    { emoji: '😌', value: 'calm', label: 'Bình yên' },
    { emoji: '😰', value: 'anxious', label: 'Lo lắng' },
    { emoji: '😍', value: 'loved', label: 'Yêu thương' },
    { emoji: '🤔', value: 'thoughtful', label: 'Suy tư' },
    { emoji: '😎', value: 'cool', label: 'Tuyệt vời' }
  ];

  const [imagePreviews, setImagePreviews] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const editorRef = React.useRef(null);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }

    if (isEdit) {
      const diary = getDiaryById(id);
      if (!diary) {
        navigate('/diary');
        return;
      }

      // Check if user owns this diary
      if (diary.userId !== user.id) {
        navigate('/diary');
        return;
      }

      setFormData({
        title: diary.title || '',
        content: diary.content || '',
        isPublic: diary.isPublic !== undefined ? diary.isPublic : true,
        images: diary.images || [],
        tags: diary.tags || [],
        mood: diary.mood || ''
      });
      setImagePreviews(diary.images || []);
    }
  }, [id, user, navigate, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const maxImages = 5;
    
    if (files.length + imagePreviews.length > maxImages) {
      alert(`Bạn chỉ có thể upload tối đa ${maxImages} ảnh`);
      return;
    }

    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const imageUrl = reader.result;
          setImagePreviews(prev => [...prev, imageUrl]);
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, imageUrl]
          }));
        };
        reader.readAsDataURL(file);
      } else {
        alert('Vui lòng chọn file ảnh hợp lệ');
      }
    });
  };

  const handleRemoveImage = (index) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault();
      const tag = tagInput.trim();
      if (tag && !formData.tags.includes(tag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tag]
        }));
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleFormatText = (command) => {
    document.execCommand(command, false, null);
    if (editorRef.current) {
      editorRef.current.focus();
      const newContent = editorRef.current.innerHTML;
      setFormData(prev => ({ ...prev, content: newContent }));
    }
  };

  const handleContentChange = (e) => {
    setFormData(prev => ({ ...prev, content: e.target.innerHTML }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Get final content from editor
    const finalContent = editorRef.current ? editorRef.current.innerHTML : formData.content;
    const textContent = editorRef.current ? editorRef.current.textContent || editorRef.current.innerText : formData.content;
    
    if (!formData.title.trim() || !textContent.trim()) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setLoading(true);

    try {
      const diaryData = {
        ...formData,
        content: finalContent,
        userId: user.id
      };
      
      if (isEdit) {
        updateDiary(id, diaryData);
      } else {
        createDiary(diaryData);
      }

      navigate('/diary');
    } catch (error) {
      console.error('Error saving diary:', error);
      alert('Có lỗi xảy ra khi lưu nhật ký');
    } finally {
      setLoading(false);
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
                  {isEdit ? 'Chỉnh sửa nhật ký' : 'Tạo nhật ký mới'}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <section className="bg-[#F4F7FF] py-14 lg:py-20 dark:bg-dark">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-dark-2 rounded-lg shadow-sm p-8">
              {/* Title */}
              <div className="mb-6">
                <label className="block mb-2 text-base font-medium text-dark dark:text-white">
                  Tiêu đề *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-3 text-base transition bg-transparent border rounded-md outline-none border-stroke dark:border-dark-3 text-body-color dark:text-dark-6 placeholder:text-dark-6 focus:border-primary dark:focus:border-primary"
                  placeholder="Nhập tiêu đề nhật ký..."
                />
              </div>

              {/* Content */}
              <div className="mb-6">
                <label className="block mb-2 text-base font-medium text-dark dark:text-white">
                  Nội dung *
                </label>
                {/* Formatting Toolbar */}
                <div className="mb-2 flex gap-2 p-2 bg-gray-50 dark:bg-dark-3 rounded-t-md border border-stroke dark:border-dark-3">
                  <button
                    type="button"
                    onClick={() => handleFormatText('bold')}
                    className="px-3 py-1 text-sm font-bold border border-stroke dark:border-dark-3 rounded hover:bg-primary hover:text-[#1E40AF] transition"
                    title="In đậm"
                  >
                    B
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFormatText('italic')}
                    className="px-3 py-1 text-sm italic border border-stroke dark:border-dark-3 rounded hover:bg-primary hover:text-[#1E40AF] transition"
                    title="In nghiêng"
                  >
                    I
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFormatText('underline')}
                    className="px-3 py-1 text-sm underline border border-stroke dark:border-dark-3 rounded hover:bg-primary hover:text-[#1E40AF] transition"
                    title="Gạch chân"
                  >
                    U
                  </button>
                  <div className="border-l border-stroke dark:border-dark-3 mx-2"></div>
                  <button
                    type="button"
                    onClick={() => handleFormatText('insertUnorderedList')}
                    className="px-3 py-1 text-sm border border-stroke dark:border-dark-3 rounded hover:bg-primary hover:text-[#1E40AF] transition"
                    title="Danh sách"
                  >
                    • Danh sách
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFormatText('insertOrderedList')}
                    className="px-3 py-1 text-sm border border-stroke dark:border-dark-3 rounded hover:bg-primary hover:text-[#1E40AF] transition"
                    title="Danh sách đánh số"
                  >
                    1. Danh sách
                  </button>
                </div>
                <div
                  ref={editorRef}
                  contentEditable
                  onInput={handleContentChange}
                  dangerouslySetInnerHTML={{ __html: formData.content }}
                  className="w-full min-h-[250px] px-5 py-3 text-base transition bg-transparent border border-t-0 rounded-b-md outline-none border-stroke dark:border-dark-3 text-body-color dark:text-dark-6 placeholder:text-dark-6 focus:border-primary dark:focus:border-primary"
                  style={{ 
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}
                  data-placeholder="Viết nội dung nhật ký của bạn..."
                />
                <style>{`
                  [contenteditable][data-placeholder]:empty:before {
                    content: attr(data-placeholder);
                    color: #9ca3af;
                    pointer-events: none;
                  }
                `}</style>
              </div>

              {/* Image Upload */}
              <div className="mb-6">
                <label className="block mb-2 text-base font-medium text-dark dark:text-white">
                  Hình ảnh (tối đa 5 ảnh)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  disabled={imagePreviews.length >= 5}
                  className="w-full px-5 py-3 text-base transition bg-transparent border rounded-md outline-none border-stroke dark:border-dark-3 text-body-color dark:text-dark-6 focus:border-primary dark:focus:border-primary"
                />
                
                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Mood */}
              <div className="mb-6">
                <label className="block mb-2 text-base font-medium text-dark dark:text-white">
                  Cảm xúc hôm nay
                </label>
                <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                  {moods.map((mood) => (
                    <button
                      key={mood.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, mood: prev.mood === mood.value ? '' : mood.value }))}
                      className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition ${
                        formData.mood === mood.value
                          ? 'border-primary bg-primary/10'
                          : 'border-stroke dark:border-dark-3 hover:border-primary/50'
                      }`}
                      title={mood.label}
                    >
                      <span className="text-2xl mb-1">{mood.emoji}</span>
                      <span className="text-xs text-body-color dark:text-dark-6">{mood.label}</span>
                    </button>
                  ))}
                </div>
                {formData.mood && (
                  <p className="mt-2 text-sm text-body-color dark:text-dark-6">
                    Đã chọn: {moods.find(m => m.value === formData.mood)?.emoji} {moods.find(m => m.value === formData.mood)?.label}
                  </p>
                )}
              </div>

              {/* Tags */}
              <div className="mb-6">
                <label className="block mb-2 text-base font-medium text-dark dark:text-white">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-red-600 transition"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleAddTag}
                    placeholder="Nhập tag và nhấn Enter..."
                    className="flex-1 px-5 py-3 text-base transition bg-transparent border rounded-md outline-none border-stroke dark:border-dark-3 text-body-color dark:text-dark-6 placeholder:text-dark-6 focus:border-primary dark:focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-3 text-base font-medium text-[#1E40AF] bg-primary rounded-md hover:bg-blue-dark transition"
                  >
                    Thêm
                  </button>
                </div>
                <p className="mt-2 text-sm text-body-color dark:text-dark-6">
                  Nhập tag và nhấn Enter hoặc click "Thêm" để thêm tag vào nhật ký
                </p>
              </div>

              {/* Public/Private Toggle */}
              <div className="mb-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="isPublic"
                    checked={formData.isPublic}
                    onChange={handleChange}
                    className="w-5 h-5 text-primary border-stroke rounded focus:ring-primary"
                  />
                  <span className="ml-3 text-base text-body-color dark:text-dark-6">
                    Công khai (cho phép người khác xem và bình luận)
                  </span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 text-base font-medium text-[#1E40AF] bg-primary rounded-md hover:bg-blue-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Tạo nhật ký'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/diary')}
                  className="px-6 py-3 text-base font-medium text-dark dark:text-white border border-stroke dark:border-dark-3 rounded-md hover:bg-gray-100 dark:hover:bg-dark-3 transition"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DiaryForm;

