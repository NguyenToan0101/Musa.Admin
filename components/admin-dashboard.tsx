"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import {
  BarChart3,
  Users,
  Package,
  Settings,
  Shield,
  AlertTriangle,
  Bell,
  Search,
  Menu,
  Home,
  Truck,
  FolderOpen,
  HelpCircle,
  Percent,
  Mail,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { DashboardStats } from "@/components/dashboard-stats"
import { RecentActivity } from "@/components/recent-activity"
import { UserManagement } from "@/components/user-management"
import { ProductManagement } from "@/components/product-management"
import { OrderManagement } from "@/components/order-management"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { PromotionManagement } from "@/components/promotion-management"
import { SystemSettings } from "@/components/system-settings"
import { ComplaintManagement } from "@/components/complaint-management"
import { CategoryManagement } from "@/components/category-management"
import { PermissionManagement } from "@/components/permission-management"
import { MessageCenter } from "@/components/message-center"

const menuItems = [
  {
    title: "Dashboard",
    icon: Home,
    id: "dashboard",
    description: "Tổng quan hệ thống",
  },
  {
    title: "Thống kê & Báo cáo",
    icon: BarChart3,
    id: "analytics",
    description: "Doanh thu, người dùng, sản phẩm",
  },
  {
    title: "Quản lý Quyền",
    icon: Shield,
    id: "permissions",
    description: "Admin, mod",
  },
  {
    title: "Quản lý Người dùng",
    icon: Users,
    id: "users",
    description: "Danh sách, tìm kiếm, khóa tài khoản",
  },
  {
    title: "Quản lý Shop & Sản phẩm",
    icon: Package,
    id: "products",
    description: "Thao tác với shop & sản phẩm",
  },
  {
    title: "Đơn hàng & Vận chuyển",
    icon: Truck,
    id: "orders",
    description: "Giám sát đơ hàng, vận chuyển",
  },
  {
    title: "Danh mục & Nội dung",
    icon: FolderOpen,
    id: "categories",
    description: "Danh mục, trang, chính sách",
  },
  {
    title: "Khuyến mãi",
    icon: Percent,
    id: "promotions",
    description: "Mã giảm giá, flash sale",
  },
  {
    title: "Khiếu nại & Phản hồi",
    icon: HelpCircle,
    id: "complaints",
    description: "Xử lý khiếu nại khách hàng",
  },
  {
    title: "Trung tâm Tin nhắn",
    icon: Mail,
    id: "messages",
    description: "Hỗ trợ người bán",
  },
  {
    title: "Cài đặt Hệ thống",
    icon: Settings,
    id: "settings",
    description: "Cấu hình, bảo mật, thanh toán",
  },
]

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(true)



  const [currentAdminId, setCurrentAdminId] = useState<number | null>(null);
  const [allowedTabs, setAllowedTabs] = useState<string[]>([]);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/admin/me`)
      .then(res => setCurrentAdminId(res.data.adminid))
      .catch(() => setCurrentAdminId(1));
  }, []);

  useEffect(() => {
    if (currentAdminId !== null) {
      if (currentAdminId === 1) {
        setAllowedTabs(menuItems.map(m => m.id));
      } else {
        axios
          .get<string[]>(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/admin/permissions/${currentAdminId}`)
          .then(res => {
            console.log("API permissions response:", res.data);
            setAllowedTabs(res.data);
          })
          .catch(() => setAllowedTabs([]));
      }
    }
  }, [currentAdminId]);

  useEffect(() => {
  console.log("currentAdminId:", currentAdminId);
}, [currentAdminId]);


//log
  console.log("Rendering sidebar with allowedTabs:", allowedTabs);
  menuItems.forEach(item => {
    console.log(`menuItem id: "${item.id}", included:`, allowedTabs.includes(item.id));
  });

  allowedTabs.forEach(tab => {
    menuItems.forEach(item => {
      if (item.id.trim().toLowerCase() === tab.trim().toLowerCase()) {
        console.log(`MATCH: "${item.id}" == "${tab}"`);
      }
    });
  });
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <DashboardStats />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <RecentActivity />
              </div>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <AlertTriangle className="w-5 h-5 text-orange-500" />
                      <span>Cảnh báo Hệ thống</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div>
                        <p className="font-medium text-red-800">Server CPU cao</p>
                        <p className="text-sm text-red-600">85% usage</p>
                      </div>
                      <Badge variant="destructive">Nghiêm trọng</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div>
                        <p className="font-medium text-yellow-800">Sản phẩm chờ duyệt</p>
                        <p className="text-sm text-yellow-600">23 sản phẩm</p>
                      </div>
                      <Badge className="bg-yellow-500">Cảnh báo</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p className="font-medium text-blue-800">Cập nhật hệ thống</p>
                        <p className="text-sm text-blue-600">Phiên bản 2.1.4</p>
                      </div>
                      <Badge className="bg-blue-500">Thông tin</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Hiệu suất Hệ thống</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">CPU Usage</span>
                        <span className="text-sm font-medium">85%</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Memory</span>
                        <span className="text-sm font-medium">67%</span>
                      </div>
                      <Progress value={67} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Storage</span>
                        <span className="text-sm font-medium">43%</span>
                      </div>
                      <Progress value={43} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )
      case "analytics":
        return <AnalyticsDashboard />
      case "permissions":
        return <PermissionManagement />
      case "users":
        return <UserManagement />
      case "products":
        return <ProductManagement />
      case "orders":
        return <OrderManagement />
      case "categories":
        return <CategoryManagement />
      case "promotions":
        return <PromotionManagement />
      case "complaints":
        return <ComplaintManagement />
      case "messages":
        return <MessageCenter />
      case "settings":
        return <SystemSettings />
      default:
        return <DashboardStats />
    }
  }

  useEffect(() => {
    console.log("allowedTabs:", allowedTabs);
    console.log("menuItems ids:", menuItems.map(m => m.id));
    if (allowedTabs && allowedTabs.length > 0) {
      allowedTabs.forEach(tab => {
        const found = menuItems.some(m => m.id === tab);
        console.log(`allowedTab "${tab}" match menuItems:`, found);
      });
    }
  }, [allowedTabs]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden">
              <Menu className="h-6 w-6" />
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-[#001F54] to-[#4DD0E1] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-[#001F54] to-[#4DD0E1] bg-clip-text text-transparent">
                  Musa Admin
                </h1>
                <p className="text-sm text-gray-500">Quản trị hệ thống</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input placeholder="Tìm kiếm..." className="pl-10 w-64 bg-gray-50 border-gray-200 focus:bg-white" />
            </div>

            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                3
              </Badge>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/placeholder.svg" alt="Admin" />
                    <AvatarFallback className="bg-[#4DD0E1] text-white">AD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    {/* <p className="text-sm font-medium leading-none">Admin User</p> */}
                    {/* <p className="text-xs leading-none text-muted-foreground">admin@ecommerce.vn</p> */}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuItem>Đăng xuất</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside
          className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"
            } fixed inset-y-0 left-0 z-40 w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 mt-[73px] lg:mt-0`}
        >
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto py-6">
              <nav className="px-4 space-y-2">
                {menuItems
                  .filter(item => allowedTabs.includes(item.id))
                  .map(item => {
                    const Icon = item.icon
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-200 group ${activeTab === item.id
                          ? "bg-gradient-to-r from-[#001F54] to-[#4DD0E1] text-white shadow-lg"
                          : "text-gray-700 hover:bg-gray-100 hover:text-[#001F54]"
                          }`}
                      >
                        <Icon
                          className={`w-5 h-5 mr-3 ${activeTab === item.id
                            ? "text-white"
                            : "text-gray-500 group-hover:text-[#001F54]"
                            }`}
                        />
                        <div className="flex-1">
                          <div className="font-medium">{item.title}</div>
                          <div className={`text-xs ${activeTab === item.id ? "text-gray-200" : "text-gray-500"}`}>
                            {item.description}
                          </div>
                        </div>
                      </button>
                    )
                  })}
              </nav>
            </div>
            <div className="p-4 border-t border-gray-200">…</div>
          </div>
        </aside>

        <main className="flex-1 lg:ml-0">
          <div className="p-6">{renderContent()}</div>
        </main>
      </div>

      {sidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}
    </div>
  )
}
