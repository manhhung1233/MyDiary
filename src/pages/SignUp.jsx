import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SignUp = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const validateName = (name) => {
    if (!name.trim()) {
      return 'Họ và tên là bắt buộc';
    }
    if (name.trim().length < 2) {
      return 'Họ và tên phải có ít nhất 2 ký tự';
    }
    return '';
  };

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

  const validateConfirmPassword = (confirmPassword, password) => {
    if (!confirmPassword) {
      return 'Xác nhận mật khẩu là bắt buộc';
    }
    if (confirmPassword !== password) {
      return 'Mật khẩu xác nhận không khớp';
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
    
    if (name === 'name') {
      fieldError = validateName(value);
    } else if (name === 'email') {
      fieldError = validateEmail(value);
    } else if (name === 'password') {
      fieldError = validatePassword(value);
      // Re-validate confirm password if it has value
      if (formData.confirmPassword) {
        const confirmError = validateConfirmPassword(formData.confirmPassword, value);
        setErrors(prev => ({
          ...prev,
          confirmPassword: confirmError
        }));
      }
    } else if (name === 'confirmPassword') {
      fieldError = validateConfirmPassword(value, formData.password);
    }
    
    setErrors({
      ...errors,
      [name]: fieldError
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields
    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(formData.confirmPassword, formData.password);
    
    setErrors({
      name: nameError,
      email: emailError,
      password: passwordError,
      confirmPassword: confirmPasswordError
    });
    
    if (nameError || emailError || passwordError || confirmPasswordError) {
      return;
    }

    const result = register(formData.name, formData.email, formData.password);
    if (result.success) {
      navigate('/diary');
    } else {
      setError(result.error || 'Đăng ký thất bại');
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
                  Đăng Ký
                </h1>
                <p className="mb-5 text-base text-body-color dark:text-dark-6">
                  Tạo tài khoản mới để bắt đầu viết nhật ký
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
                      Đăng ký
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forms Section */}
      <section className="bg-[#F4F7FF] py-14 lg:py-[90px] dark:bg-dark">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap -mx-4">
            <div className="w-full px-4">
              <div className="relative mx-auto max-w-[525px] overflow-hidden rounded-xl shadow-form bg-white dark:bg-dark-2 py-14 px-8 text-center sm:px-12 md:px-[60px]">
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
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Họ và tên"
                      className={`w-full px-5 py-3 text-base transition bg-transparent border rounded-md outline-none text-body-color dark:text-dark-6 placeholder:text-dark-6 focus-visible:shadow-none ${
                        errors.name 
                          ? 'border-red-500 dark:border-red-500 focus:border-red-500 dark:focus:border-red-500' 
                          : 'border-stroke dark:border-dark-3 focus:border-primary dark:focus:border-primary'
                      }`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.name}
                      </p>
                    )}
                  </div>
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
                      placeholder="Mật khẩu (ít nhất 6 ký tự)"
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
                  <div className="mb-[22px]">
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Xác nhận mật khẩu"
                      className={`w-full px-5 py-3 text-base transition bg-transparent border rounded-md outline-none text-body-color dark:text-dark-6 placeholder:text-dark-6 focus-visible:shadow-none ${
                        errors.confirmPassword 
                          ? 'border-red-500 dark:border-red-500 focus:border-red-500 dark:focus:border-red-500' 
                          : 'border-stroke dark:border-dark-3 focus:border-primary dark:focus:border-primary'
                      }`}
                    />
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                  <div className="mb-9">
                    <input
                      type="submit"
                      value="Đăng Ký"
                      className="w-full px-5 py-3 text-base text-[#1E40AF] transition duration-300 ease-in-out border rounded-md cursor-pointer border-primary bg-primary hover:bg-blue-dark"
                    />
                  </div>
                </form>
                <p className="text-base text-body-secondary">
                  Đã có tài khoản?
                  <Link to="/signin" className="text-primary hover:underline ml-1">
                    Đăng nhập
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

export default SignUp;
