"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Search,
  MoreHorizontal,
  Plus,
  Eye,
  Edit,
  Trash2,
  Copy,
  Play,
  Pause,
  TrendingUp,
  Users,
  ShoppingCart,
  Calendar,
  Target,
  Gift,
  Tag,
  DollarSign,
  Truck,
  Package,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts"

// Dữ liệu mẫu cho khuyến mãi
const promotions = [
  {
    id: "PROMO001",
    name: "Giảm giá mùa hè",
    type: "percentage",
    value: 20,
    code: "SUMMER20",
    status: "active",
    startDate: "2024-06-01",
    endDate: "2024-08-31",
    usageLimit: 1000,
    usageCount: 245,
    minOrderValue: 500000,
    maxDiscount: 200000,
    categories: ["Thời trang", "Giày dép"],
    revenue: 125000000,
    orders: 245,
  },
  {
    id: "PROMO002",
    name: "Miễn phí vận chuyển",
    type: "shipping",
    value: 0,
    code: "FREESHIP",
    status: "active",
    startDate: "2024-03-01",
    endDate: "2024-12-31",
    usageLimit: 5000,
    usageCount: 1250,
    minOrderValue: 300000,
    maxDiscount: 50000,
    categories: ["Tất cả"],
    revenue: 85000000,
    orders: 1250,
  },
  {
    id: "PROMO003",
    name: "Flash Sale cuối tuần",
    type: "fixed",
    value: 100000,
    code: "FLASH100",
    status: "scheduled",
    startDate: "2024-04-06",
    endDate: "2024-04-07",
    usageLimit: 500,
    usageCount: 0,
    minOrderValue: 200000,
    maxDiscount: 100000,
    categories: ["Điện tử"],
    revenue: 0,
    orders: 0,
  },
  {
    id: "PROMO004",
    name: "Khuyến mãi sinh nhật",
    type: "percentage",
    value: 15,
    code: "BIRTHDAY15",
    status: "expired",
    startDate: "2024-01-01",
    endDate: "2024-02-29",
    usageLimit: 2000,
    usageCount: 1850,
    minOrderValue: 400000,
    maxDiscount: 150000,
    categories: ["Mỹ phẩm", "Thời trang"],
    revenue: 180000000,
    orders: 1850,
  },
]

// Dữ liệu thống kê hiệu quả khuyến mãi
const promotionEffectivenessData = [
  { month: "01/2024", revenue: 180000000, orders: 1850, discount: 25000000 },
  { month: "02/2024", revenue: 165000000, orders: 1650, discount: 22000000 },
  { month: "03/2024", revenue: 210000000, orders: 2100, discount: 28000000 },
  { month: "04/2024", revenue: 195000000, orders: 1950, discount: 26000000 },
  { month: "05/2024", revenue: 225000000, orders: 2250, discount: 30000000 },
  { month: "06/2024", revenue: 240000000, orders: 2400, discount: 32000000 },
]

// Dữ liệu phân bố loại khuyến mãi
const promotionTypeData = [
  { name: "Giảm giá %", value: 45, color: "#001F54" },
  { name: "Giảm giá cố định", value: 25, color: "#4DD0E1" },
  { name: "Miễn phí vận chuyển", value: 20, color: "#81C784" },
  { name: "Mua 1 tặng 1", value: 10, color: "#FFB74D" },
]

// Dữ liệu top khuyến mãi hiệu quả
const topPromotionsData = [
  { name: "SUMMER20", orders: 245, revenue: 125000000, conversion: 8.5 },
  { name: "FREESHIP", orders: 1250, revenue: 85000000, conversion: 12.3 },
  { name: "BIRTHDAY15", orders: 1850, revenue: 180000000, conversion: 15.2 },
  { name: "NEWUSER10", orders: 890, revenue: 95000000, conversion: 9.8 },
]

export function PromotionManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const filteredPromotions = promotions.filter((promo) => {
    const matchesSearch =
      promo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promo.code.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || promo.status === filterStatus
    const matchesType = filterType === "all" || promo.type === filterType

    return matchesSearch && matchesStatus && matchesType
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#001F54] to-[#4DD0E1] bg-clip-text text-transparent">
            Quản lý Khuyến mãi
          </h1>
          <p className="text-gray-500 mt-1">Tạo, quản lý và theo dõi hiệu quả các chương trình khuyến mãi</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-[#81C784] text-white">
            {promotions.filter((p) => p.status === "active").length} đang hoạt động
          </Badge>
          <Badge className="bg-[#4DD0E1] text-white">
            {promotions.filter((p) => p.status === "scheduled").length} đã lên lịch
          </Badge>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#001F54] hover:bg-[#001F54]/90">
                <Plus className="mr-2 h-4 w-4" />
                Tạo khuyến mãi mới
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Tạo khuyến mãi mới</DialogTitle>
                <DialogDescription>Tạo chương trình khuyến mãi mới cho khách hàng</DialogDescription>
              </DialogHeader>
              <CreatePromotionForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white shadow-lg">
          <TabsTrigger value="overview" className="data-[state=active]:bg-[#001F54] data-[state=active]:text-white">
            <TrendingUp className="w-4 h-4 mr-2" />
            Tổng quan
          </TabsTrigger>
          <TabsTrigger value="promotions" className="data-[state=active]:bg-[#4DD0E1] data-[state=active]:text-white">
            <Tag className="w-4 h-4 mr-2" />
            Danh sách
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-[#81C784] data-[state=active]:text-white">
            <Target className="w-4 h-4 mr-2" />
            Phân tích
          </TabsTrigger>
          <TabsTrigger value="templates" className="data-[state=active]:bg-[#FFB74D] data-[state=active]:text-white">
            <Gift className="w-4 h-4 mr-2" />
            Mẫu có sẵn
          </TabsTrigger>
        </TabsList>

        {/* Tab Tổng quan */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
 
          <Card className="relative overflow-hidden bg-gradient-to-br from-white to-blue-50/30 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#001F54]/5 to-[#4DD0E1]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-gray-600">Tổng doanh thu từ KM</CardTitle>
            <div className="p-2 bg-gradient-to-r from-[#001F54] to-[#4DD0E1] rounded-lg">
              <DollarSign className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold bg-gradient-to-r from-[#001F54] to-[#4DD0E1] bg-clip-text text-transparent">
              ₫45,231,000
            </div>
            <div className="flex items-center mt-2">
              <div className="flex items-center text-emerald-600 text-sm font-medium">
                <TrendingUp className="w-4 h-4 mr-1" />
                +20.1%
              </div>
              <span className="text-gray-500 text-sm ml-2">so so với tháng trước</span>
            </div>
            <Progress value={75} className="mt-3 h-2" />
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-white to-cyan-50/30 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#4DD0E1]/5 to-[#81C784]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-gray-600">Đơn hàng có KM</CardTitle>
            <div className="p-2 bg-gradient-to-r from-[#4DD0E1] to-[#81C784] rounded-lg">
              <ShoppingCart className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold bg-gradient-to-r from-[#4DD0E1] to-[#81C784] bg-clip-text text-transparent">
              +2,350
            </div>
            <div className="flex items-center mt-2">
              <div className="flex items-center text-emerald-600 text-sm font-medium">
                <TrendingUp className="w-4 h-4 mr-1" />
                +180.1%
              </div>
              <span className="text-gray-500 text-sm ml-2">so với tháng trước</span>
            </div>
            <Progress value={85} className="mt-3 h-2" />
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-white to-green-50/30 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#81C784]/5 to-[#4DD0E1]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-gray-600">Tỷ lệ chuyển đổi</CardTitle>
            <div className="p-2 bg-gradient-to-r from-[#81C784] to-[#4DD0E1] rounded-lg">
              <Target className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold bg-gradient-to-r from-[#81C784] to-[#4DD0E1] bg-clip-text text-transparent">
              +12,234
            </div>
            <div className="flex items-center mt-2">
              <div className="flex items-center text-emerald-600 text-sm font-medium">
                <TrendingUp className="w-4 h-4 mr-1" />
                +19%
              </div>
              <span className="text-gray-500 text-sm ml-2">so với tháng trước</span>
            </div>
            <Progress value={65} className="mt-3 h-2" />
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-white to-red-50/30 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-gray-600">Khách hàng mới</CardTitle>
            <div className="p-2 bg-gradient-to-r from-[#4DD0E1] to-[#001F54] rounded-lg">
              <Users className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold bg-gradient-to-r from-[#4DD0E1] to-[#001F54] bg-clip-text text-transparent">23</div>
            <div className="flex items-center mt-2">
              <div className="flex items-center text-cyan-500 text-sm font-medium">
                <TrendingUp className="w-4 h-4 mr-1" />
                +1,245
              </div>
              <span className="text-gray-500 text-sm ml-2">Khách hàng mới</span>
            </div>
            <Progress value={30} className="mt-3 h-2" />
          </CardContent>
        </Card>
        </div>        

      

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 bg-gradient-to-br from-white to-blue-50/50 border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-[#001F54]" />
                  <span>Hiệu quả Khuyến mãi theo Tháng</span>
                </CardTitle>
                <CardDescription>Doanh thu và đơn hàng từ các chương trình khuyến mãi</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={promotionEffectivenessData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#666" />
                    <YAxis stroke="#666" tickFormatter={(value) => `₫${value / 1000000}M`} />
                    <Tooltip
                      formatter={(value: any, name: string) => {
                        if (name === "revenue") return [`₫${(value / 1000000).toFixed(0)}M`, "Doanh thu"]
                        if (name === "discount") return [`₫${(value / 1000000).toFixed(0)}M`, "Giảm giá"]
                        return [value, name]
                      }}
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        border: "none",
                        borderRadius: "12px",
                        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Legend />
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#001F54" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#001F54" stopOpacity={0.1} />
                      </linearGradient>
                      <linearGradient id="colorDiscount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4DD0E1" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#4DD0E1" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#001F54"
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                      name="Doanh thu"
                    />
                    <Area
                      type="monotone"
                      dataKey="discount"
                      stroke="#4DD0E1"
                      fillOpacity={1}
                      fill="url(#colorDiscount)"
                      name="Giảm giá"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white to-green-50/50 border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Phân bố Loại Khuyến mãi</CardTitle>
                <CardDescription>Tỷ lệ sử dụng các loại khuyến mãi</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={promotionTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {promotionTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: any) => [`${value}%`, "Tỷ lệ"]}
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        border: "none",
                        borderRadius: "12px",
                        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {promotionTypeData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <span className="text-sm font-medium">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-br from-white to-purple-50/50 border-0 shadow-xl">
            <CardHeader>
              <CardTitle>Top Khuyến mãi Hiệu quả</CardTitle>
              <CardDescription>Các chương trình khuyến mãi có hiệu quả cao nhất</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topPromotionsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip
                    formatter={(value: any, name: string) => {
                      if (name === "orders") return [value, "Đơn hàng"]
                      if (name === "revenue") return [`₫${(value / 1000000).toFixed(0)}M`, "Doanh thu"]
                      if (name === "conversion") return [`${value}%`, "Tỷ lệ chuyển đổi"]
                      return [value, name]
                    }}
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="orders" fill="#001F54" name="Đơn hàng" />
                  <Bar dataKey="conversion" fill="#4DD0E1" name="Tỷ lệ chuyển đổi (%)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Danh sách khuyến mãi */}
        <TabsContent value="promotions" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Tìm kiếm & Lọc Khuyến mãi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Tìm kiếm theo tên hoặc mã khuyến mãi..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    <SelectItem value="active">Đang hoạt động</SelectItem>
                    <SelectItem value="scheduled">Đã lên lịch</SelectItem>
                    <SelectItem value="expired">Đã hết hạn</SelectItem>
                    <SelectItem value="paused">Tạm dừng</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Loại khuyến mãi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả loại</SelectItem>
                    <SelectItem value="percentage">Giảm giá %</SelectItem>
                    <SelectItem value="fixed">Giảm giá cố định</SelectItem>
                    <SelectItem value="shipping">Miễn phí vận chuyển</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Promotions Table */}
          <Card>
            <CardHeader>
              <CardTitle>Danh sách Khuyến mãi</CardTitle>
              <CardDescription>Tổng cộng {filteredPromotions.length} chương trình khuyến mãi</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên & Mã</TableHead>
                    <TableHead>Loại</TableHead>
                    <TableHead>Giá trị</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Thời gian</TableHead>
                    <TableHead>Sử dụng</TableHead>
                    <TableHead>Hiệu quả</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPromotions.map((promo) => (
                    <TableRow key={promo.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{promo.name}</div>
                          <div className="text-sm text-gray-500 font-mono">{promo.code}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {promo.type === "percentage" ? "Giảm %" : promo.type === "fixed" ? "Cố định" : "Vận chuyển"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {promo.type === "percentage"
                            ? `${promo.value}%`
                            : promo.type === "fixed"
                              ? `₫${promo.value.toLocaleString()}`
                              : "Miễn phí"}
                        </div>
                        {promo.maxDiscount > 0 && (
                          <div className="text-xs text-gray-500">Tối đa ₫{promo.maxDiscount.toLocaleString()}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            promo.status === "active"
                              ? "default"
                              : promo.status === "expired"
                                ? "destructive"
                                : "secondary"
                          }
                          className={
                            promo.status === "active"
                              ? "bg-[#81C784] text-white"
                              : promo.status === "scheduled"
                                ? "bg-[#4DD0E1] text-white"
                                : ""
                          }
                        >
                          {promo.status === "active"
                            ? "Hoạt động"
                            : promo.status === "scheduled"
                              ? "Đã lên lịch"
                              : promo.status === "expired"
                                ? "Hết hạn"
                                : "Tạm dừng"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{promo.startDate}</div>
                          <div className="text-gray-500">đến {promo.endDate}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">
                            {promo.usageCount}/{promo.usageLimit}
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                            <div
                              className="bg-[#4DD0E1] h-1.5 rounded-full"
                              style={{ width: `${(promo.usageCount / promo.usageLimit) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">₫{(promo.revenue / 1000000).toFixed(0)}M</div>
                          <div className="text-gray-500">{promo.orders} đơn hàng</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              Xem chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="mr-2 h-4 w-4" />
                              Sao chép
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {promo.status === "active" ? (
                              <DropdownMenuItem className="text-orange-600">
                                <Pause className="mr-2 h-4 w-4" />
                                Tạm dừng
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem className="text-green-600">
                                <Play className="mr-2 h-4 w-4" />
                                Kích hoạt
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Phân tích */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-white to-blue-50/50 border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Xu hướng Sử dụng Khuyến mãi</CardTitle>
                <CardDescription>Số lượng đơn hàng sử dụng khuyến mãi theo tháng</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={promotionEffectivenessData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip
                      formatter={(value: any) => [value, "Đơn hàng"]}
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        border: "none",
                        borderRadius: "12px",
                        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="orders"
                      stroke="#001F54"
                      strokeWidth={3}
                      dot={{ fill: "#001F54", r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white to-green-50/50 border-0 shadow-xl">
              <CardHeader>
                <CardTitle>ROI Khuyến mãi</CardTitle>
                <CardDescription>Tỷ suất sinh lời từ các chương trình khuyến mãi</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#001F54]/10 to-[#4DD0E1]/10 rounded-lg">
                    <div>
                      <div className="text-sm text-gray-600">ROI trung bình</div>
                      <div className="text-2xl font-bold text-[#001F54]">285%</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Tháng này</div>
                      <div className="text-lg font-medium text-[#81C784]">+12.5%</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {topPromotionsData.map((promo, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{promo.name}</div>
                          <div className="text-sm text-gray-500">
                            {promo.orders} đơn hàng • ₫{(promo.revenue / 1000000).toFixed(0)}M
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-[#001F54]">{(promo.conversion * 20).toFixed(0)}%</div>
                          <div className="text-xs text-gray-500">ROI</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab Mẫu có sẵn */}
        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <PromotionTemplate
              title="Flash Sale"
              description="Giảm giá sâu trong thời gian ngắn"
              icon={<Tag className="w-6 h-6" />}
              color="bg-red-500"
            />
            <PromotionTemplate
              title="Miễn phí vận chuyển"
              description="Khuyến khích mua hàng với vận chuyển miễn phí"
              icon={<Truck className="w-6 h-6" />}
              color="bg-blue-500"
            />
            <PromotionTemplate
              title="Mua 1 tặng 1"
              description="Tăng số lượng sản phẩm bán ra"
              icon={<Gift className="w-6 h-6" />}
              color="bg-green-500"
            />
            <PromotionTemplate
              title="Giảm giá sinh nhật"
              description="Chương trình đặc biệt cho khách hàng"
              icon={<Calendar className="w-6 h-6" />}
              color="bg-purple-500"
            />
            <PromotionTemplate
              title="Khuyến mãi khách hàng mới"
              description="Thu hút khách hàng lần đầu mua hàng"
              icon={<Users className="w-6 h-6" />}
              color="bg-orange-500"
            />
            <PromotionTemplate
              title="Combo giảm giá"
              description="Giảm giá khi mua nhiều sản phẩm"
              icon={<Package className="w-6 h-6" />}
              color="bg-indigo-500"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function CreatePromotionForm() {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          Tên khuyến mãi
        </Label>
        <Input id="name" placeholder="Nhập tên khuyến mãi" className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="code" className="text-right">
          Mã khuyến mãi
        </Label>
        <Input id="code" placeholder="VD: SUMMER2024" className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="type" className="text-right">
          Loại khuyến mãi
        </Label>
        <Select>
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Chọn loại khuyến mãi" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="percentage">Giảm giá theo phần trăm</SelectItem>
            <SelectItem value="fixed">Giảm giá cố định</SelectItem>
            <SelectItem value="shipping">Miễn phí vận chuyển</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="value" className="text-right">
          Giá trị
        </Label>
        <Input id="value" placeholder="VD: 20 hoặc 100000" className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="description" className="text-right">
          Mô tả
        </Label>
        <Textarea id="description" placeholder="Mô tả chi tiết về khuyến mãi" className="col-span-3" />
      </div>
      <DialogFooter>
        <Button type="submit" className="bg-[#001F54] hover:bg-[#001F54]/90">
          Tạo khuyến mãi
        </Button>
      </DialogFooter>
    </div>
  )
}

function PromotionTemplate({
  title,
  description,
  icon,
  color,
}: {
  title: string
  description: string
  icon: React.ReactNode
  color: string
}) {
  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${color} text-white`}>{icon}</div>
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Button variant="outline" className="w-full">
          Sử dụng mẫu này
        </Button>
      </CardContent>
    </Card>
  )
}
