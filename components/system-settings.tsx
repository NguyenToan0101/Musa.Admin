"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Settings,
  Globe,
  Shield,
  Mail,
  Bell,
  CreditCard,
  Truck,
  Database,
  Server,
  Key,
  Palette,
  Save,
  RefreshCw,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"

export function SystemSettings() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#001F54] to-[#4DD0E1] bg-clip-text text-transparent">
            Cài đặt Hệ thống
          </h1>
          <p className="text-gray-500 mt-1">Quản lý cấu hình và thiết lập hệ thống</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Khôi phục mặc định
          </Button>
          <Button onClick={handleSave} disabled={isLoading} className="bg-[#001F54] hover:bg-[#001F54]/90">
            {isLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Lưu thay đổi
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 bg-white shadow-lg">
          <TabsTrigger value="general" className="data-[state=active]:bg-[#001F54] data-[state=active]:text-white">
            <Settings className="w-4 h-4 mr-2" />
            Chung
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-[#4DD0E1] data-[state=active]:text-white">
            <Shield className="w-4 h-4 mr-2" />
            Bảo mật
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="data-[state=active]:bg-[#81C784] data-[state=active]:text-white"
          >
            <Bell className="w-4 h-4 mr-2" />
            Thông báo
          </TabsTrigger>
          <TabsTrigger value="payment" className="data-[state=active]:bg-[#FFB74D] data-[state=active]:text-white">
            <CreditCard className="w-4 h-4 mr-2" />
            Thanh toán
          </TabsTrigger>
          <TabsTrigger value="shipping" className="data-[state=active]:bg-[#E57373] data-[state=active]:text-white">
            <Truck className="w-4 h-4 mr-2" />
            Vận chuyển
          </TabsTrigger>
          <TabsTrigger value="system" className="data-[state=active]:bg-[#9C27B0] data-[state=active]:text-white">
            <Server className="w-4 h-4 mr-2" />
            Hệ thống
          </TabsTrigger>
        </TabsList>

        {/* Tab Cài đặt chung */}
        <TabsContent value="general" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="w-5 h-5 text-[#001F54]" />
                  <span>Thông tin Website</span>
                </CardTitle>
                <CardDescription>Cấu hình thông tin cơ bản của website</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Tên website</Label>
                  <Input id="siteName" defaultValue="E-Commerce Platform" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Mô tả website</Label>
                  <Textarea
                    id="siteDescription"
                    defaultValue="Nền tảng thương mại điện tử hàng đầu Việt Nam"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteUrl">URL website</Label>
                  <Input id="siteUrl" defaultValue="https://ecommerce.vn" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email liên hệ</Label>
                  <Input id="contactEmail" type="email" defaultValue="contact@ecommerce.vn" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Palette className="w-5 h-5 text-[#4DD0E1]" />
                  <span>Giao diện</span>
                </CardTitle>
                <CardDescription>Tùy chỉnh giao diện và hiển thị</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Chế độ tối</Label>
                    <p className="text-sm text-gray-500">Bật/tắt chế độ giao diện tối</p>
                  </div>
                  <Switch />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="language">Ngôn ngữ mặc định</Label>
                  <Select defaultValue="vi">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vi">Tiếng Việt</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="zh">中文</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Múi giờ</Label>
                  <Select defaultValue="asia/ho_chi_minh">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asia/ho_chi_minh">Asia/Ho_Chi_Minh (UTC+7)</SelectItem>
                      <SelectItem value="utc">UTC (UTC+0)</SelectItem>
                      <SelectItem value="america/new_york">America/New_York (UTC-5)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Tiền tệ mặc định</Label>
                  <Select defaultValue="vnd">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vnd">VND (₫)</SelectItem>
                      <SelectItem value="usd">USD ($)</SelectItem>
                      <SelectItem value="eur">EUR (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Cài đặt SEO</CardTitle>
              <CardDescription>Tối ưu hóa công cụ tìm kiếm</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="metaTitle">Meta Title</Label>
                  <Input id="metaTitle" defaultValue="E-Commerce Platform - Mua sắm trực tuyến" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metaKeywords">Meta Keywords</Label>
                  <Input id="metaKeywords" defaultValue="ecommerce, mua sắm, online, việt nam" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  defaultValue="Nền tảng thương mại điện tử hàng đầu với hàng triệu sản phẩm chất lượng"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Bảo mật */}
        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Key className="w-5 h-5 text-[#4DD0E1]" />
                  <span>Xác thực</span>
                </CardTitle>
                <CardDescription>Cài đặt bảo mật đăng nhập</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Xác thực 2 bước (2FA)</Label>
                    <p className="text-sm text-gray-500">Bắt buộc 2FA cho admin</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Đăng nhập bằng Google</Label>
                    <p className="text-sm text-gray-500">Cho phép đăng nhập qua Google</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Thời gian hết phiên (phút)</Label>
                  <Input id="sessionTimeout" type="number" defaultValue="30" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">Số lần đăng nhập tối đa</Label>
                  <Input id="maxLoginAttempts" type="number" defaultValue="5" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-[#81C784]" />
                  <span>Bảo mật dữ liệu</span>
                </CardTitle>
                <CardDescription>Cài đặt bảo vệ dữ liệu</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Mã hóa dữ liệu</Label>
                    <p className="text-sm text-gray-500">Mã hóa dữ liệu nhạy cảm</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Sao lưu tự động</Label>
                    <p className="text-sm text-gray-500">Sao lưu dữ liệu hàng ngày</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="backupRetention">Lưu trữ sao lưu (ngày)</Label>
                  <Input id="backupRetention" type="number" defaultValue="30" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ipWhitelist">IP Whitelist</Label>
                  <Textarea id="ipWhitelist" placeholder="192.168.1.1&#10;10.0.0.1" rows={3} />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Nhật ký bảo mật</CardTitle>
              <CardDescription>Theo dõi các hoạt động bảo mật</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="font-medium">Đăng nhập thành công</p>
                      <p className="text-sm text-gray-500">Admin đăng nhập từ 192.168.1.100</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">2 phút trước</span>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    <div>
                      <p className="font-medium">Thử đăng nhập thất bại</p>
                      <p className="text-sm text-gray-500">IP: 203.162.4.191 (5 lần)</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">15 phút trước</span>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="font-medium">Sao lưu hoàn thành</p>
                      <p className="text-sm text-gray-500">Sao lưu dữ liệu tự động</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">1 giờ trước</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Thông báo */}
        <TabsContent value="notifications" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mail className="w-5 h-5 text-[#81C784]" />
                  <span>Email</span>
                </CardTitle>
                <CardDescription>Cài đặt gửi email</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input id="smtpHost" defaultValue="smtp.gmail.com" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtpPort">Port</Label>
                    <Input id="smtpPort" defaultValue="587" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpSecurity">Bảo mật</Label>
                    <Select defaultValue="tls">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tls">TLS</SelectItem>
                        <SelectItem value="ssl">SSL</SelectItem>
                        <SelectItem value="none">Không</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpUsername">Username</Label>
                  <Input id="smtpUsername" defaultValue="noreply@ecommerce.vn" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPassword">Password</Label>
                  <Input id="smtpPassword" type="password" defaultValue="••••••••" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="w-5 h-5 text-[#FFB74D]" />
                  <span>Thông báo tự động</span>
                </CardTitle>
                <CardDescription>Cài đặt thông báo hệ thống</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Đơn hàng mới</Label>
                    <p className="text-sm text-gray-500">Thông báo khi có đơn hàng mới</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Sản phẩm hết hàng</Label>
                    <p className="text-sm text-gray-500">Cảnh báo khi sản phẩm hết hàng</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Khiếu nại mới</Label>
                    <p className="text-sm text-gray-500">Thông báo khiếu nại từ khách hàng</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Báo cáo hàng ngày</Label>
                    <p className="text-sm text-gray-500">Gửi báo cáo tổng kết hàng ngày</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab Thanh toán */}
        <TabsContent value="payment" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5 text-[#FFB74D]" />
                  <span>Cổng thanh toán</span>
                </CardTitle>
                <CardDescription>Cấu hình các phương thức thanh toán</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">VNPay</p>
                      <p className="text-sm text-gray-500">Cổng thanh toán VNPay</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-green-100 text-green-800">Hoạt động</Badge>
                    <Switch defaultChecked />
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium">MoMo</p>
                      <p className="text-sm text-gray-500">Ví điện tử MoMo</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-green-100 text-green-800">Hoạt động</Badge>
                    <Switch defaultChecked />
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium">ZaloPay</p>
                      <p className="text-sm text-gray-500">Ví điện tử ZaloPay</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">Tạm dừng</Badge>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cài đặt thanh toán</CardTitle>
                <CardDescription>Cấu hình chung cho thanh toán</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="minOrderValue">Giá trị đơn hàng tối thiểu (VND)</Label>
                  <Input id="minOrderValue" type="number" defaultValue="50000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxOrderValue">Giá trị đơn hàng tối đa (VND)</Label>
                  <Input id="maxOrderValue" type="number" defaultValue="50000000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentTimeout">Thời gian chờ thanh toán (phút)</Label>
                  <Input id="paymentTimeout" type="number" defaultValue="15" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Thanh toán khi nhận hàng (COD)</Label>
                    <p className="text-sm text-gray-500">Cho phép thanh toán COD</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Tự động xác nhận thanh toán</Label>
                    <p className="text-sm text-gray-500">Tự động xác nhận khi nhận webhook</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab Vận chuyển */}
        <TabsContent value="shipping" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Truck className="w-5 h-5 text-[#E57373]" />
                  <span>Đối tác vận chuyển</span>
                </CardTitle>
                <CardDescription>Quản lý các đối tác vận chuyển</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Truck className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Giao hàng nhanh</p>
                      <p className="text-sm text-gray-500">Giao hàng trong ngày</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-green-100 text-green-800">Hoạt động</Badge>
                    <Switch defaultChecked />
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Truck className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium">Giao hàng tiết kiệm</p>
                      <p className="text-sm text-gray-500">Giao hàng tiết kiệm</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-green-100 text-green-800">Hoạt động</Badge>
                    <Switch defaultChecked />
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <Truck className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium">Viettel Post</p>
                      <p className="text-sm text-gray-500">Bưu điện Viettel</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">Tạm dừng</Badge>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cài đặt vận chuyển</CardTitle>
                <CardDescription>Cấu hình chung cho vận chuyển</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="freeShippingThreshold">Miễn phí vận chuyển từ (VND)</Label>
                  <Input id="freeShippingThreshold" type="number" defaultValue="500000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="defaultShippingFee">Phí vận chuyển mặc định (VND)</Label>
                  <Input id="defaultShippingFee" type="number" defaultValue="30000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="processingTime">Thời gian xử lý đơn hàng (giờ)</Label>
                  <Input id="processingTime" type="number" defaultValue="24" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Tự động tạo vận đơn</Label>
                    <p className="text-sm text-gray-500">Tự động tạo vận đơn khi xác nhận</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Thông báo trạng thái vận chuyển</Label>
                    <p className="text-sm text-gray-500">Gửi SMS/Email cập nhật trạng thái</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab Hệ thống */}
        <TabsContent value="system" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="w-5 h-5 text-[#9C27B0]" />
                  <span>Cơ sở dữ liệu</span>
                </CardTitle>
                <CardDescription>Quản lý và bảo trì cơ sở dữ liệu</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Kích thước database</p>
                    <p className="text-sm text-gray-500">2.4 GB</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Bình thường</Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Lần sao lưu cuối</p>
                    <p className="text-sm text-gray-500">2 giờ trước</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Tải xuống
                  </Button>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Button className="w-full" variant="outline">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Tối ưu hóa database
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Khôi phục từ sao lưu
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Server className="w-5 h-5 text-[#FF5722]" />
                  <span>Hiệu suất hệ thống</span>
                </CardTitle>
                <CardDescription>Theo dõi hiệu suất server</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">CPU Usage</span>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: "45%" }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Memory Usage</span>
                    <span className="text-sm font-medium">68%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-600 h-2 rounded-full" style={{ width: "68%" }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Disk Usage</span>
                    <span className="text-sm font-medium">32%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: "32%" }}></div>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Uptime</p>
                    <p className="text-sm text-gray-500">15 ngày 4 giờ</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Ổn định</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Nhật ký hệ thống</CardTitle>
              <CardDescription>Theo dõi hoạt động hệ thống</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="font-medium">Sao lưu tự động hoàn thành</p>
                      <p className="text-sm text-gray-500">Database backup completed successfully</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">2 giờ trước</span>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    <div>
                      <p className="font-medium">Cảnh báo memory cao</p>
                      <p className="text-sm text-gray-500">Memory usage reached 85%</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">4 giờ trước</span>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="font-medium">Cập nhật hệ thống</p>
                      <p className="text-sm text-gray-500">System updated to version 2.1.4</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">1 ngày trước</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
