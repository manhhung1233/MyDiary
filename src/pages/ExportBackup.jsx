import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { exportDiariesToJSON, exportDiariesToCSV, getUserDiaries } from '../utils/storage';

const ExportBackup = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [exporting, setExporting] = useState(false);

  if (!user) {
    navigate('/signin');
    return null;
  }

  const diaries = getUserDiaries(user.id);

  const handleExportJSON = () => {
    setExporting(true);
    try {
      const jsonData = exportDiariesToJSON(user.id);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nhật-ký-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      alert('Xuất file JSON thành công!');
    } catch (error) {
      console.error('Export error:', error);
      alert('Có lỗi xảy ra khi xuất file');
    } finally {
      setExporting(false);
    }
  };

  const handleExportCSV = () => {
    setExporting(true);
    try {
      const csvData = exportDiariesToCSV(user.id);
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nhật-ký-backup-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      alert('Xuất file CSV thành công!');
    } catch (error) {
      console.error('Export error:', error);
      alert('Có lỗi xảy ra khi xuất file');
    } finally {
      setExporting(false);
    }
  };

  const handleExportTXT = () => {
    setExporting(true);
    try {
      let txtContent = `BACKUP NHẬT KÝ\n`;
      txtContent += `Ngày xuất: ${new Date().toLocaleString('vi-VN')}\n`;
      txtContent += `Tổng số nhật ký: ${diaries.length}\n`;
      txtContent += `========================================\n\n`;

      diaries.forEach((diary, index) => {
        txtContent += `NHẬT KÝ ${index + 1}\n`;
        txtContent += `Ngày: ${new Date(diary.createdAt).toLocaleString('vi-VN')}\n`;
        txtContent += `Tiêu đề: ${diary.title}\n`;
        txtContent += `Công khai: ${diary.isPublic ? 'Có' : 'Không'}\n`;
        if (diary.mood) txtContent += `Cảm xúc: ${diary.mood}\n`;
        if (diary.tags && diary.tags.length > 0) {
          txtContent += `Tags: ${diary.tags.join(', ')}\n`;
        }
        txtContent += `\nNội dung:\n${diary.content.replace(/<[^>]*>/g, '').replace(/\n/g, '\n')}\n`;
        txtContent += `\n${'='.repeat(40)}\n\n`;
      });

      const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nhật-ký-backup-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      alert('Xuất file TXT thành công!');
    } catch (error) {
      console.error('Export error:', error);
      alert('Có lỗi xảy ra khi xuất file');
    } finally {
      setExporting(false);
    }
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.diaries && Array.isArray(data.diaries)) {
          if (window.confirm(`Bạn có muốn import ${data.diaries.length} nhật ký? Lưu ý: Dữ liệu hiện tại sẽ không bị ghi đè.`)) {
            // Import logic would go here - for now just show message
            alert('Tính năng import sẽ được phát triển trong phiên bản tiếp theo.');
          }
        } else {
          alert('File không hợp lệ. Vui lòng chọn file backup từ hệ thống.');
        }
      } catch (error) {
        console.error('Import error:', error);
        alert('Có lỗi khi đọc file. Vui lòng kiểm tra lại file.');
      }
    };
    reader.readAsText(file);
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
                  Xuất & Sao Lưu
                </h1>
                <p className="mb-5 text-base text-body-color dark:text-dark-6">
                  Xuất và sao lưu nhật ký của bạn
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
            {/* Stats */}
            <div className="mb-8 bg-white dark:bg-dark-2 rounded-lg shadow-sm p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">{diaries.length}</div>
                  <div className="text-sm text-body-color dark:text-dark-6">Tổng số nhật ký</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                    {diaries.filter(d => d.isPublic).length}
                  </div>
                  <div className="text-sm text-body-color dark:text-dark-6">Nhật ký công khai</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary dark:text-blue-dark mb-2">
                    {diaries.reduce((sum, d) => sum + (d.images?.length || 0), 0)}
                  </div>
                  <div className="text-sm text-body-color dark:text-dark-6">Tổng số ảnh</div>
                </div>
              </div>
            </div>

            {/* Export Options */}
            <div className="mb-8 bg-white dark:bg-dark-2 rounded-lg shadow-sm p-6">
              <h2 className="mb-6 text-2xl font-bold text-dark dark:text-white">
                Xuất dữ liệu
              </h2>
              <div className="space-y-4">
                <div className="p-4 border border-stroke dark:border-dark-3 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-dark dark:text-white mb-1">
                        Xuất JSON
                      </h3>
                      <p className="text-sm text-body-color dark:text-dark-6">
                        Xuất toàn bộ dữ liệu nhật ký dưới dạng JSON. Dễ dàng import lại sau này.
                      </p>
                    </div>
                    <button
                      onClick={handleExportJSON}
                      disabled={exporting || diaries.length === 0}
                      className="px-6 py-2 text-base font-medium text-[#1E40AF] bg-primary rounded-md hover:bg-blue-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {exporting ? 'Đang xuất...' : 'Xuất JSON'}
                    </button>
                  </div>
                </div>

                <div className="p-4 border border-stroke dark:border-dark-3 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-dark dark:text-white mb-1">
                        Xuất CSV
                      </h3>
                      <p className="text-sm text-body-color dark:text-dark-6">
                        Xuất dữ liệu dưới dạng CSV để mở bằng Excel hoặc Google Sheets.
                      </p>
                    </div>
                    <button
                      onClick={handleExportCSV}
                      disabled={exporting || diaries.length === 0}
                      className="px-6 py-2 text-base font-medium text-[#1E40AF] bg-primary rounded-md hover:bg-blue-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {exporting ? 'Đang xuất...' : 'Xuất CSV'}
                    </button>
                  </div>
                </div>

                <div className="p-4 border border-stroke dark:border-dark-3 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-dark dark:text-white mb-1">
                        Xuất TXT
                      </h3>
                      <p className="text-sm text-body-color dark:text-dark-6">
                        Xuất dữ liệu dưới dạng văn bản thuần túy, dễ đọc và in ấn.
                      </p>
                    </div>
                    <button
                      onClick={handleExportTXT}
                      disabled={exporting || diaries.length === 0}
                      className="px-6 py-2 text-base font-medium text-[#1E40AF] bg-primary rounded-md hover:bg-blue-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {exporting ? 'Đang xuất...' : 'Xuất TXT'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Import */}
            <div className="mb-8 bg-white dark:bg-dark-2 rounded-lg shadow-sm p-6">
              <h2 className="mb-6 text-2xl font-bold text-dark dark:text-white">
                Import dữ liệu
              </h2>
              <div className="p-4 border border-stroke dark:border-dark-3 rounded-lg">
                <p className="mb-4 text-sm text-body-color dark:text-dark-6">
                  Import dữ liệu từ file backup JSON. Tính năng này đang được phát triển.
                </p>
                <label className="inline-block px-6 py-3 text-base font-medium text-white bg-secondary rounded-md hover:bg-[#FF91A4] transition cursor-pointer">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="hidden"
                  />
                  Chọn file JSON
                </label>
              </div>
            </div>

            {/* Backup Reminder */}
            <div className="bg-primary/5 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="text-3xl">💾</div>
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-primary dark:text-primary">
                    Lời khuyên
                  </h3>
                  <p className="text-sm text-blue-dark dark:text-primary">
                    Nên xuất và sao lưu dữ liệu thường xuyên để tránh mất mát thông tin. 
                    Lưu file backup ở nhiều nơi khác nhau để đảm bảo an toàn.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ExportBackup;

