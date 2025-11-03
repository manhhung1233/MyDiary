import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SignIn = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return 'Email là bắt buộc';
    }
    if (!emailRegex.test(email)) {
      return 'Email không hợp lệ';
    }
    return '';
  };

  const validatePassword = (password) => {
    if (!password) {
      return 'Mật khẩu là bắt buộc';
    }
    if (password.length < 6) {
      return 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field
    setErrors({
      ...errors,
      [name]: ''
    });
    setError('');
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let fieldError = '';
    
    if (name === 'email') {
      fieldError = validateEmail(value);
    } else if (name === 'password') {
      fieldError = validatePassword(value);
    }
    
    setErrors({
      ...errors,
      [name]: fieldError
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    
    setErrors({
      email: emailError,
      password: passwordError
    });
    
    if (emailError || passwordError) {
      return;
    }
    
    const result = login(formData.email, formData.password);
    if (result.success) {
      navigate('/diary');
    } else {
      setError(result.error || 'Đăng nhập thất bại');
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
                  Đăng Nhập
                </h1>
                <p className="mb-5 text-base text-body-color dark:text-dark-6">
                  Đăng nhập vào tài khoản của bạn
                </p>
                <ul className="flex items-center justify-center gap-[10px]">
                  <li>
                    <Link
                      to="/"
                      className="flex items-center gap-[10px] text-base font-medium text-dark dark:text-white"
                    >
                      Trang chủ
                    </Link>
                  </li>
                  <li>
                    <span className="flex items-center gap-[10px] text-base font-medium text-body-color">
                      <span className="text-body-color dark:text-dark-6"> / </span>
                      Đăng nhập
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forms Section */}
      <section className="bg-[#F4F7FF] py-14 lg:py-20 dark:bg-dark">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap -mx-4">
            <div className="w-full px-4">
              <div className="relative mx-auto max-w-[525px] overflow-hidden rounded-lg bg-white dark:bg-dark-2 py-14 px-8 text-center sm:px-12 md:px-[60px]">
                <div className="mb-10 text-center">
                  <Link
                    to="/"
                    className="mx-auto inline-block max-w-[80px]"
                  >
                    <img
                      src="/logo.png"
                      alt="logo"
                      className="max-w-full"
                    />
                  </Link>
                </div>
                <form onSubmit={handleSubmit}>
                  {error && (
                    <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-md">
                      {error}
                    </div>
                  )}
                  <div className="mb-[22px]">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Email"
                      className={`w-full px-5 py-3 text-base transition bg-transparent border rounded-md outline-none text-body-color dark:text-dark-6 placeholder:text-dark-6 focus-visible:shadow-none ${
                        errors.email 
                          ? 'border-red-500 dark:border-red-500 focus:border-red-500 dark:focus:border-red-500' 
                          : 'border-stroke dark:border-dark-3 focus:border-primary dark:focus:border-primary'
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div className="mb-[22px]">
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Mật khẩu"
                      className={`w-full px-5 py-3 text-base transition bg-transparent border rounded-md outline-none text-body-color dark:text-dark-6 placeholder:text-dark-6 focus-visible:shadow-none ${
                        errors.password 
                          ? 'border-red-500 dark:border-red-500 focus:border-red-500 dark:focus:border-red-500' 
                          : 'border-stroke dark:border-dark-3 focus:border-primary dark:focus:border-primary'
                      }`}
                    />
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.password}
                      </p>
                    )}
                  </div>
                  <div className="mb-9">
                    <input
                      type="submit"
                      value="Đăng Nhập"
                      className="w-full px-5 py-3 text-base text-[#1E40AF] transition duration-300 ease-in-out border rounded-md cursor-pointer border-primary bg-primary hover:bg-blue-dark"
                    />
                  </div>
                </form>
                <p className="text-base text-body-secondary">
                  Chưa có tài khoản?
                  <Link to="/signup" className="text-primary hover:underline ml-1">
                    Đăng ký ngay
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SignIn;
