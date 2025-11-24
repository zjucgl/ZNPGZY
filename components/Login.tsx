import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, XCircle } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate network delay
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 800);
  };

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden">
      {/* Left Side - Image & Branding */}
      <div className="hidden md:flex w-1/2 relative bg-gray-900">
        <img 
          src="https://picsum.photos/id/20/1080/1920" 
          alt="Classroom Background" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 blur-sm"
        />
        <div className="relative z-10 flex items-center justify-center w-full h-full">
           <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-widest drop-shadow-lg">
             作业智能辅助批改系统
           </h1>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-blue-600 tracking-wider">账号登陆</h2>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Username Input */}
            <div className="group relative">
              <div className="absolute inset-y-0 left-0 pl-0 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-blue-500" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full pl-8 pr-8 py-3 border-b border-gray-200 text-gray-900 placeholder-gray-300 focus:outline-none focus:border-blue-500 focus:ring-0 transition-colors bg-transparent"
                placeholder="请输入账号"
                required
              />
               {username && (
                <button 
                  type="button"
                  onClick={() => setUsername('')}
                  className="absolute inset-y-0 right-0 flex items-center text-gray-300 hover:text-gray-500"
                >
                  <XCircle className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Password Input */}
            <div className="group relative">
              <div className="absolute inset-y-0 left-0 pl-0 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-blue-500" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-8 pr-10 py-3 border-b border-gray-200 text-gray-900 placeholder-gray-300 focus:outline-none focus:border-blue-500 focus:ring-0 transition-colors bg-transparent"
                placeholder="请输入密码"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-0 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors mt-8"
            >
              {loading ? '登录中...' : '登 录'}
            </button>

            {/* Forgot Password */}
            <div className="flex justify-center mt-4">
              <a href="#" className="text-sm text-blue-500 hover:text-blue-700">
                忘记密码?
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
