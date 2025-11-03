import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <div
        id="home"
        className="relative overflow-hidden bg-primary pt-[120px] md:pt-[130px] lg:pt-[160px]"
      >
        <div className="container px-4 mx-auto">
          <div className="flex flex-wrap items-center -mx-4">
            <div className="w-full px-4">
              <div className="hero-content mx-auto max-w-[780px] text-center">
                <h1 className="mb-6 text-3xl font-bold leading-snug text-white sm:text-4xl sm:leading-snug lg:text-5xl lg:leading-[1.2]">
                  Nhật Ký Cá Nhân - Lưu Giữ Khoảnh Khắc Đáng Nhớ
                </h1>
                <p className="mx-auto mb-9 max-w-[600px] text-base font-medium text-white sm:text-lg sm:leading-[1.44]">
                  Nền tảng viết nhật ký trực tuyến hiện đại, giúp bạn ghi lại những khoảnh khắc quý giá, 
                  chia sẻ câu chuyện và kết nối với cộng đồng.
                </p>
                <ul className="flex flex-wrap items-center justify-center gap-5 mb-10">
                  <li>
                    <Link
                      to="/diary/new"
                      className="inline-flex items-center justify-center rounded-md bg-white px-7 py-[14px] text-center text-base font-medium text-dark shadow-1 transition duration-300 ease-in-out hover:bg-gray-2 hover:text-body-color"
                    >
                      Viết Nhật Ký Ngay
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/diary"
                      className="flex items-center gap-4 rounded-md bg-white/[0.12] px-6 py-[14px] text-base font-medium text-white transition duration-300 ease-in-out hover:bg-white hover:text-dark"
                    >
                      Khám Phá Nhật Ký
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="w-full px-4">
              <div className="relative z-10 mx-auto max-w-[845px]">
                <div className="mt-16">
                  <img
                    src="/assets/images/hero/hero.png"
                    alt="hero"
                    className="max-w-full mx-auto rounded-t-xl rounded-tr-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="pb-8 pt-20 dark:bg-dark lg:pb-[70px] lg:pt-[120px]">
        <div className="container px-4 mx-auto">
          <div className="flex flex-wrap -mx-4">
            <div className="w-full px-4">
              <div className="mx-auto mb-12 max-w-[485px] text-center lg:mb-[70px]">
                <span className="block mb-2 text-lg font-semibold text-primary">
                  Tính Năng
                </span>
                <h2 className="mb-3 text-3xl font-bold text-dark dark:text-white sm:text-4xl md:text-[40px] md:leading-[1.2]">
                  Tính Năng Nổi Bật
                </h2>
                <p className="text-base text-body-color dark:text-dark-6">
                  Nền tảng nhật ký với đầy đủ tính năng hiện đại, giúp bạn viết và quản lý nhật ký một cách dễ dàng
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap -mx-4">
            <div className="w-full px-4 md:w-1/2 lg:w-1/3">
              <div className="mb-8 rounded-lg bg-white p-8 shadow-1 dark:bg-dark-2">
                <div className="mb-6 inline-flex h-[70px] w-[70px] items-center justify-center rounded-md bg-primary/[0.08] text-primary">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="mb-3 text-xl font-semibold text-dark dark:text-white">
                  Viết Nhật Ký Dễ Dàng
                </h3>
                <p className="text-base text-body-color dark:text-dark-6">
                  Trình soạn thảo văn bản phong phú, hỗ trợ định dạng chữ, danh sách và chèn hình ảnh
                </p>
              </div>
            </div>
            
            <div className="w-full px-4 md:w-1/2 lg:w-1/3">
              <div className="mb-8 rounded-lg bg-white p-8 shadow-1 dark:bg-dark-2">
                <div className="mb-6 inline-flex h-[70px] w-[70px] items-center justify-center rounded-md bg-primary/[0.08] text-primary">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <h3 className="mb-3 text-xl font-semibold text-dark dark:text-white">
                  Tags & Phân Loại
                </h3>
                <p className="text-base text-body-color dark:text-dark-6">
                  Gắn thẻ và phân loại nhật ký để dễ dàng tìm kiếm và quản lý theo chủ đề
                </p>
              </div>
            </div>
            
            <div className="w-full px-4 md:w-1/2 lg:w-1/3">
              <div className="mb-8 rounded-lg bg-white p-8 shadow-1 dark:bg-dark-2">
                <div className="mb-6 inline-flex h-[70px] w-[70px] items-center justify-center rounded-md bg-primary/[0.08] text-primary">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </div>
                <h3 className="mb-3 text-xl font-semibold text-dark dark:text-white">
                  Theo Dõi Cảm Xúc
                </h3>
                <p className="text-base text-body-color dark:text-dark-6">
                  Ghi lại cảm xúc mỗi ngày với các emoji biểu cảm đa dạng
                </p>
              </div>
            </div>
            
            <div className="w-full px-4 md:w-1/2 lg:w-1/3">
              <div className="mb-8 rounded-lg bg-white p-8 shadow-1 dark:bg-dark-2">
                <div className="mb-6 inline-flex h-[70px] w-[70px] items-center justify-center rounded-md bg-primary/[0.08] text-primary">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="mb-3 text-xl font-semibold text-dark dark:text-white">
                  Chia Sẻ & Tương Tác
                </h3>
                <p className="text-base text-body-color dark:text-dark-6">
                  Chia sẻ nhật ký công khai, tương tác với người khác qua like và bình luận
                </p>
              </div>
            </div>
            
            <div className="w-full px-4 md:w-1/2 lg:w-1/3">
              <div className="mb-8 rounded-lg bg-white p-8 shadow-1 dark:bg-dark-2">
                <div className="mb-6 inline-flex h-[70px] w-[70px] items-center justify-center rounded-md bg-primary/[0.08] text-primary">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </div>
                <h3 className="mb-3 text-xl font-semibold text-dark dark:text-white">
                  Lưu Vào Bộ Sưu Tập
                </h3>
                <p className="text-base text-body-color dark:text-dark-6">
                  Lưu những nhật ký yêu thích vào bộ sưu tập riêng của bạn
                </p>
              </div>
            </div>
            
            <div className="w-full px-4 md:w-1/2 lg:w-1/3">
              <div className="mb-8 rounded-lg bg-white p-8 shadow-1 dark:bg-dark-2">
                <div className="mb-6 inline-flex h-[70px] w-[70px] items-center justify-center rounded-md bg-primary/[0.08] text-primary">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="mb-3 text-xl font-semibold text-dark dark:text-white">
                  Bảo Mật & Riêng Tư
                </h3>
                <p className="text-base text-body-color dark:text-dark-6">
                  Bảo vệ nhật ký riêng tư của bạn, chỉ bạn mới có thể xem
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="bg-gray-1 pb-8 pt-20 dark:bg-dark-2 lg:pb-[70px] lg:pt-[120px]"
      >
        <div className="container px-4 mx-auto">
          <div className="flex flex-wrap items-center -mx-4">
            <div className="w-full px-4 lg:w-1/2">
              <div className="mb-12 max-w-[540px] lg:mb-0">
                <h2 className="mb-5 text-3xl font-bold leading-tight text-dark dark:text-white sm:text-[40px] sm:leading-[1.2]">
                  Lưu Giữ Những Khoảnh Khắc Đáng Nhớ
                </h2>
                <p className="mb-5 text-base leading-relaxed text-body-color dark:text-dark-6">
                  Nhật ký cá nhân là nơi bạn có thể ghi lại những suy nghĩ, cảm xúc và trải nghiệm của mình một cách tự do. 
                  Với giao diện thân thiện và đầy đủ tính năng, việc viết nhật ký trở nên dễ dàng và thú vị hơn bao giờ hết.
                </p>
                <p className="mb-10 text-base leading-relaxed text-body-color dark:text-dark-6">
                  Chia sẻ câu chuyện của bạn với cộng đồng hoặc giữ riêng tư cho chính mình. 
                  Mỗi nhật ký là một phần của hành trình cuộc sống của bạn.
                </p>
                <Link
                  to="/diary"
                  className="inline-flex items-center justify-center py-3 text-base font-medium text-center text-[#1E40AF] border rounded-md border-primary bg-primary px-7 hover:border-blue-dark hover:bg-blue-dark"
                >
                  Bắt Đầu Ngay
                </Link>
              </div>
            </div>
            <div className="w-full px-4 lg:w-1/2">
              <div className="text-center">
                <div className="mx-auto max-w-[500px] rounded-lg bg-white p-8 shadow-lg dark:bg-dark-2">
                  <div className="mb-4 text-6xl">📔</div>
                  <h3 className="mb-4 text-2xl font-bold text-dark dark:text-white">
                    Viết Nhật Ký Mỗi Ngày
                  </h3>
                  <p className="text-body-color dark:text-dark-6 mb-4">
                    Ghi lại những khoảnh khắc đáng nhớ, suy nghĩ và cảm xúc của bạn
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">Tags</span>
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">Cảm xúc</span>
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">Hình ảnh</span>
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">Chia sẻ</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 overflow-hidden bg-primary py-20 lg:py-[115px]">
        <div className="container px-4 mx-auto">
          <div className="flex flex-wrap items-stretch -mx-4">
            <div className="w-full px-4">
              <div className="mx-auto max-w-[570px] text-center">
                <h2 className="mb-2.5 text-3xl font-bold text-white md:text-[38px] md:leading-[1.44]">
                  <span>Sẵn sàng bắt đầu?</span>
                  <span className="block text-3xl font-normal md:text-[40px] mt-2">
                    Viết Nhật Ký Ngay Hôm Nay
                  </span>
                </h2>
                <p className="mx-auto mb-6 max-w-[515px] text-base leading-[1.5] text-white">
                  Tham gia cộng đồng và bắt đầu viết những câu chuyện của riêng bạn. 
                  Lưu giữ kỷ niệm, chia sẻ trải nghiệm và kết nối với mọi người.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Link
                    to="/signup"
                    className="inline-block rounded-md border border-transparent bg-secondary px-7 py-3 text-base font-medium text-[#1E40AF] transition hover:bg-[#FF91A4]"
                  >
                    Đăng Ký Ngay
                  </Link>
                  <Link
                    to="/diary"
                    className="inline-block rounded-md border-2 border-white bg-transparent px-7 py-3 text-base font-medium text-[#1E40AF] transition hover:bg-white hover:text-primary"
                  >
                    Khám Phá Nhật Ký
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

