"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { AdminDashboard } from "@/components/admin-dashboard"
import { Eye, EyeOff, Shield, Lock, Mail } from "lucide-react"
import axios from 'axios';

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [error, setError] = useState("")

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsLoading(true)
  setError("")

  try {
    // Gửi dữ liệu đến Spring Boot backend
     // Gửi dữ liệu đến Spring Boot backend
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BACKEND}/admin/login`, {
      email, 
      password
    })

    // Axios tự động parse JSON, data nằm trong response.data
    const data = response.data
    
    // Lưu token nếu cần
    if (typeof window !== 'undefined' && data.token) {
      localStorage.setItem("adminToken", data.token)
    }
    setIsAuthenticated(true)

  } catch (error: any) {
    // Xử lý error từ axios
    if (error.response) {
      // Server trả về error response
      const errorData = error.response.data
      setError(errorData.message || "Đăng nhập thất bại")
    } else if (error.request) {
      // Request được gửi nhưng không nhận được response
      setError("Lỗi kết nối. Vui lòng thử lại.")
    } else {
      // Lỗi khác
      setError("Có lỗi xảy ra. Vui lòng thử lại.")
    }
  } finally {
    setIsLoading(false)
  }
}

  // Nếu đã đăng nhập thành công, hiển thị AdminDashboard
  if (isAuthenticated) {
    return <AdminDashboard />
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Full Screen Background Video/Image */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          // poster="/placeholder.svg?height=1080&width=1920"
           onError={(e) => console.error('Video error:', e) }
      onLoadStart={() => console.log('Video loading started')}
     onLoadedData={() => console.log('Video loaded')}
  onCanPlay={() => console.log('Video can play')}
        >
          <source src="/videoLogin.mp4" type="video/mp4" />
          
        </video>
        {/* Fallback Background Image */}
        {/* <div className="absolute inset-0 bg-gradient-to-br from-[#001F54] via-[#001F54] to-[#4DD0E1]">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#81C784]/20 via-transparent to-[#4DD0E1]/30"></div>   */}
                
          {/* Animated background elements */}
          {/* <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#81C784]/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#4DD0E1]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-[#81C784]/8 rounded-full blur-2xl animate-bounce delay-500"></div>
          <div className="absolute top-3/4 left-1/3 w-48 h-48 bg-[#4DD0E1]/15 rounded-full blur-xl animate-pulse delay-2000"></div>
          <div className="absolute top-1/6 right-1/3 w-72 h-72 bg-[#81C784]/6 rounded-full blur-3xl animate-pulse delay-1500"></div>
        </div> */}

        {/* Dark overlay for better contrast */}
        {/* <div className="absolute inset-0 bg-black/30"></div> */}
      </div>

      {/* Musa Logo - Top Left */}
      <div className="absolute top-8 left-8 z-20">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Musa</h1>
        </div>
      </div>

      {/* Login Form - Right Side Overlay */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2  -translate-y-1/2 z-20 w-full max-w-lg">
        <div className="space-y-6">
          {/* Login Header */}
          <div className="text-center space-y-2">
            <h2 className="text-4xl font-bold text-white">Đăng nhập Admin</h2>
            <p className=" text-white/80">Truy cập vào bảng điều khiển quản trị</p>
          </div>

          {/* Login Form with Glass Effect */}
          <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
            <CardContent className="p-8">
              <form onSubmit={handleLogin} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white font-medium">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@musa.com"
                      required
                      className="pl-12 bg-white/5 border-white/20 text-white placeholder:text-white/60 focus:border-[#81C784] focus:ring-[#81C784]/50 h-12 backdrop-blur-sm"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white font-medium">
                    Mật khẩu
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="pl-12 pr-12 bg-white/5 border-white/20 text-white placeholder:text-white/60 focus:border-[#81C784] focus:ring-[#81C784]/50 h-12 backdrop-blur-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-200 text-sm backdrop-blur-sm">
                    {error}
                  </div>
                )}

                {/* Login Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-[#81C784] to-[#4DD0E1] hover:from-[#66BB6A] hover:to-[#26C6DA] text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Đang đăng nhập...</span>
                    </div>
                  ) : (
                    "Đăng nhập"
                  )}
                </Button>
              </form>

              {/* Admin Notice */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-center text-white/70 text-sm flex items-center justify-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>Chỉ dành cho quản trị viên được ủy quyền</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mobile Responsive - Center the form on small screens */}
      <div className="lg:hidden absolute inset-0 flex items-center justify-center p-6 z-20">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile Login Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white">Musa Admin</h2>
            <p className="text-white/80">Truy cập vào bảng điều khiển quản trị</p>
          </div>

          {/* Mobile Login Form */}
          <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
            <CardContent className="p-6">
              <form onSubmit={handleLogin} className="space-y-4">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="mobile-email" className="text-white font-medium">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                    <Input
                      id="mobile-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@musa.com"
                      required
                      className="pl-12 bg-white/5 border-white/20 text-white placeholder:text-white/60 focus:border-[#81C784] focus:ring-[#81C784]/50 h-12 backdrop-blur-sm"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="mobile-password" className="text-white font-medium">
                    Mật khẩu
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                    <Input
                      id="mobile-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="pl-12 pr-12 bg-white/5 border-white/20 text-white placeholder:text-white/60 focus:border-[#81C784] focus:ring-[#81C784]/50 h-12 backdrop-blur-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-200 text-sm backdrop-blur-sm">
                    {error}
                  </div>
                )}

                {/* Login Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-[#81C784] to-[#4DD0E1] hover:from-[#66BB6A] hover:to-[#26C6DA] text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Đang đăng nhập...</span>
                    </div>
                  ) : (
                    "Đăng nhập"
                  )}
                </Button>
              </form>

              {/* Admin Notice */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-center text-white/70 text-sm flex items-center justify-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>Chỉ dành cho quản trị viên được ủy quyền</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
