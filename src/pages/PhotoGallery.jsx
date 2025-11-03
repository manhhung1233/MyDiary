import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllDiaryImages } from '../utils/storage';

const PhotoGallery = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }
    const userImages = getAllDiaryImages(user.id);
    setImages(userImages);
    setLoading(false);
  }, [user, navigate]);

  if (!user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-body-color dark:text-dark-6">Đang tải...</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
                  Thư Viện Ảnh
                </h1>
                <p className="mb-5 text-base text-body-color dark:text-dark-6">
                  Xem tất cả ảnh từ nhật ký của bạn
                </p>
                <div className="inline-flex items-center gap-2 px-6 py-2 bg-primary/10 rounded-full">
                  <span className="text-2xl">📷</span>
                  <span className="text-lg font-semibold text-primary">
                    {images.length} ảnh
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
          {images.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="relative group cursor-pointer overflow-hidden rounded-lg bg-white dark:bg-dark-2 shadow-sm hover:shadow-lg transition"
                  onClick={() => setSelectedImage(image)}
                >
                  <img
                    src={image.url}
                    alt={image.diaryTitle}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition">
                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white opacity-0 group-hover:opacity-100 transition">
                      <p className="text-sm font-medium truncate mb-1">{image.diaryTitle}</p>
                      <p className="text-xs">{formatDate(image.diaryDate)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mb-4 text-6xl">📷</div>
              <p className="mb-4 text-lg text-body-color dark:text-dark-6">
                Bạn chưa có ảnh nào trong nhật ký
              </p>
              <Link
                to="/diary/new"
                className="inline-block px-6 py-3 text-base font-medium text-[#1E40AF] bg-primary rounded-md hover:bg-blue-dark transition"
              >
                Tạo nhật ký với ảnh
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/40 text-white rounded-full flex items-center justify-center transition z-10"
            >
              ✕
            </button>
            <img
              src={selectedImage.url}
              alt={selectedImage.diaryTitle}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <div
              className="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-dark-2/90 rounded-lg p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-dark dark:text-white mb-2">
                {selectedImage.diaryTitle}
              </h3>
              <p className="text-sm text-body-color dark:text-dark-6 mb-3">
                {formatDate(selectedImage.diaryDate)}
              </p>
              <Link
                to={`/diary/${selectedImage.diaryId}`}
                className="inline-block px-4 py-2 text-sm font-medium text-[#1E40AF] bg-primary rounded-md hover:bg-blue-dark transition"
                onClick={() => setSelectedImage(null)}
              >
                Xem nhật ký →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;

