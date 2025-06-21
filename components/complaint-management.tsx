"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  MoreHorizontal,
  Eye,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Star,
  TrendingUp,
  MessageCircle,
  Filter,
  Send,
  Phone,
  Mail,
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
} from "recharts"

// Dữ liệu mẫu cho khiếu nại
const complaints = [
  {
    id: "CP001",
    customer: {
      name: "Nguyễn Văn A",
      email: "nguyenvana@email.com",
      phone: "0123456789",
      avatar: "/placeholder.svg",
    },
    subject: "Sản phẩm không đúng mô tả",
    category: "product",
    priority: "high",
    status: "pending",
    createdDate: "2024-03-20",
    orderId: "ORD-12345",
    description: "Sản phẩm nhận được không giống như hình ảnh mô tả trên website. Màu sắc và chất liệu hoàn toàn khác.",
    responses: 2,
    rating: 1,
  },
  {
    id: "CP002",
    customer: {
      name: "Trần Thị B",
      email: "tranthib@email.com",
      phone: "0987654321",
      avatar: "/placeholder.svg",
    },
    subject: "Giao hàng chậm trễ",
    category: "shipping",
    priority: "medium",
    status: "in_progress",
    createdDate: "2024-03-19",
    orderId: "ORD-12346",
    description: "Đơn hàng đã quá thời gian giao hàng cam kết nhưng vẫn chưa nhận được hàng.",
    responses: 5,
    rating: 2,
  },
  {
    id: "CP003",
    customer: {
      name: "Lê Văn C",
      email: "levanc@email.com",
      phone: "0456789123",
      avatar: "/placeholder.svg",
    },
    subject: "Vấn đề thanh toán",
    category: "payment",
    priority: "high",
    status: "resolved",
    createdDate: "2024-03-18",
    orderId: "ORD-12347",
    description: "Đã thanh toán nhưng đơn hàng vẫn hiển thị chưa thanh toán.",
    responses: 8,
    rating: 5,
  },
  {
    id: "CP004",
    customer: {
      name: "Phạm Thị D",
      email: "phamthid@email.com",
      phone: "0789123456",
      avatar: "/placeholder.svg",
    },
    subject: "Dịch vụ khách hàng kém",
    category: "service",
    priority: "low",
    status: "closed",
    createdDate: "2024-03-17",
    orderId: "ORD-12348",
    description: "Nhân viên tư vấn không nhiệt tình, thái độ không thân thiện.",
    responses: 3,
    rating: 3,
  },
]

// Dữ liệu thống kê khiếu nại
const complaintStatsData = [
  { month: "01/2024", total: 45, resolved: 38, pending: 7 },
  { month: "02/2024", total: 52, resolved: 45, pending: 7 },
  { month: "03/2024", total: 38, resolved: 32, pending: 6 },
  { month: "04/2024", total: 41, resolved: 35, pending: 6 },
  { month: "05/2024", total: 35, resolved: 30, pending: 5 },
  { month: "06/2024", total: 29, resolved: 25, pending: 4 },
]

// Dữ liệu phân loại khiếu nại
const complaintCategoryData = [
  { name: "Sản phẩm", value: 35, color: "#001F54" },
  { name: "Vận chuyển", value: 28, color: "#4DD0E1" },
  { name: "Thanh toán", value: 20, color: "#81C784" },
  { name: "Dịch vụ", value: 17, color: "#FFB74D" },
]

// Dữ liệu thời gian phản hồi
const responseTimeData = [
  { time: "< 1h", count: 45 },
  { time: "1-4h", count: 32 },
  { time: "4-24h", count: 18 },
  { time: "> 24h", count: 5 },
]

export function ComplaintManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterPriority, setFilterPriority] = useState("all")
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null)

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch =
      complaint.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || complaint.status === filterStatus
    const matchesCategory = filterCategory === "all" || complaint.category === filterCategory
    const matchesPriority = filterPriority === "all" || complaint.priority === filterPriority

    return matchesSearch && matchesStatus && matchesCategory && matchesPriority
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#001F54] to-[#4DD0E1] bg-clip-text text-transparent">
            Quản lý Khiếu nại & Phản hồi
          </h1>
          <p className="text-gray-500 mt-1">Xử lý và theo dõi khiếu nại từ khách hàng</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-red-100 text-red-800">
            {complaints.filter((c) => c.status === "pending").length} chờ xử lý
          </Badge>
          <Badge className="bg-yellow-100 text-yellow-800">
            {complaints.filter((c) => c.status === "in_progress").length} đang xử lý
          </Badge>
          <Badge className="bg-green-100 text-green-800">
            {complaints.filter((c) => c.status === "resolved").length} đã giải quyết
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white shadow-lg">
          <TabsTrigger value="overview" className="data-[state=active]:bg-[#001F54] data-[state=active]:text-white">
            <TrendingUp className="w-4 h-4 mr-2" />
            Tổng quan
          </TabsTrigger>
          <TabsTrigger value="complaints" className="data-[state=active]:bg-[#4DD0E1] data-[state=active]:text-white">
            <MessageCircle className="w-4 h-4 mr-2" />
            Danh sách
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-[#81C784] data-[state=active]:text-white">
            <BarChart className="w-4 h-4 mr-2" />
            Phân tích
          </TabsTrigger>
          <TabsTrigger value="feedback" className="data-[state=active]:bg-[#FFB74D] data-[state=active]:text-white">
            <Star className="w-4 h-4 mr-2" />
            Đánh giá
          </TabsTrigger>
        </TabsList>

        {/* Tab Tổng quan */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-l-4 border-l-red-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Khiếu nại mới</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">23</div>
                <p className="text-xs text-red-500 flex items-center mt-1">
                  <span className="mr-1">↗</span>
                  +3 so với hôm qua
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-yellow-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Đang xử lý</CardTitle>
                <Clock className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">15</div>
                <p className="text-xs text-yellow-500 flex items-center mt-1">
                  <span className="mr-1">↘</span>
                  -2 so với hôm qua
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Đã giải quyết</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">187</div>
                <p className="text-xs text-green-500 flex items-center mt-1">
                  <span className="mr-1">↗</span>
                  +12 so với hôm qua
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#4DD0E1]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Thời gian phản hồi TB</CardTitle>
                <MessageSquare className="h-4 w-4 text-[#4DD0E1]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#001F54]">2.4h</div>
                <p className="text-xs text-[#81C784] flex items-center mt-1">
                  <span className="mr-1">↘</span>
                  -0.3h so với tuần trước
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 bg-gradient-to-br from-white to-blue-50/50 border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-[#001F54]" />
                  <span>Xu hướng Khiếu nại</span>
                </CardTitle>
                <CardDescription>Thống kê khiếu nại theo tháng</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={complaintStatsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        border: "none",
                        borderRadius: "12px",
                        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="total"
                      stroke="#001F54"
                      strokeWidth={3}
                      dot={{ fill: "#001F54", r: 6 }}
                      name="Tổng khiếu nại"
                    />
                    <Line
                      type="monotone"
                      dataKey="resolved"
                      stroke="#81C784"
                      strokeWidth={3}
                      dot={{ fill: "#81C784", r: 6 }}
                      name="Đã giải quyết"
                    />
                    <Line
                      type="monotone"
                      dataKey="pending"
                      stroke="#E57373"
                      strokeWidth={3}
                      dot={{ fill: "#E57373", r: 6 }}
                      name="Chờ xử lý"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white to-green-50/50 border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Phân loại Khiếu nại</CardTitle>
                <CardDescription>Phân bố theo danh mục</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={complaintCategoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {complaintCategoryData.map((entry, index) => (
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
                  {complaintCategoryData.map((item, index) => (
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
              <CardTitle>Thời gian Phản hồi</CardTitle>
              <CardDescription>Phân bố thời gian phản hồi khiếu nại</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={responseTimeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="time" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip
                    formatter={(value: any) => [value, "Số lượng"]}
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Bar dataKey="count" name="Số lượng">
                    {responseTimeData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === 0 ? "#81C784" : index === 1 ? "#4DD0E1" : index === 2 ? "#FFB74D" : "#E57373"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Danh sách khiếu nại */}
        <TabsContent value="complaints" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="w-5 h-5" />
                <span>Tìm kiếm & Lọc</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Tìm kiếm theo tên, chủ đề hoặc mã khiếu nại..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="pending">Chờ xử lý</SelectItem>
                    <SelectItem value="in_progress">Đang xử lý</SelectItem>
                    <SelectItem value="resolved">Đã giải quyết</SelectItem>
                    <SelectItem value="closed">Đã đóng</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="product">Sản phẩm</SelectItem>
                    <SelectItem value="shipping">Vận chuyển</SelectItem>
                    <SelectItem value="payment">Thanh toán</SelectItem>
                    <SelectItem value="service">Dịch vụ</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Độ ưu tiên" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="high">Cao</SelectItem>
                    <SelectItem value="medium">Trung bình</SelectItem>
                    <SelectItem value="low">Thấp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Complaints Table */}
          <Card>
            <CardHeader>
              <CardTitle>Danh sách Khiếu nại</CardTitle>
              <CardDescription>Tổng cộng {filteredComplaints.length} khiếu nại</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Khách hàng</TableHead>
                    <TableHead>Chủ đề</TableHead>
                    <TableHead>Danh mục</TableHead>
                    <TableHead>Độ ưu tiên</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead>Phản hồi</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredComplaints.map((complaint) => (
                    <TableRow key={complaint.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={complaint.customer.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="bg-[#4DD0E1] text-white">
                              {complaint.customer.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{complaint.customer.name}</div>
                            <div className="text-sm text-gray-500">{complaint.customer.email}</div>
                            <div className="text-sm text-gray-500">{complaint.customer.phone}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{complaint.subject}</div>
                          <div className="text-sm text-gray-500">#{complaint.id}</div>
                          <div className="text-sm text-gray-500">Đơn hàng: {complaint.orderId}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {complaint.category === "product"
                            ? "Sản phẩm"
                            : complaint.category === "shipping"
                              ? "Vận chuyển"
                              : complaint.category === "payment"
                                ? "Thanh toán"
                                : "Dịch vụ"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            complaint.priority === "high"
                              ? "bg-red-100 text-red-800"
                              : complaint.priority === "medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                          }
                        >
                          {complaint.priority === "high"
                            ? "Cao"
                            : complaint.priority === "medium"
                              ? "Trung bình"
                              : "Thấp"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            complaint.status === "resolved"
                              ? "default"
                              : complaint.status === "closed"
                                ? "secondary"
                                : "destructive"
                          }
                          className={
                            complaint.status === "resolved"
                              ? "bg-[#81C784] text-white"
                              : complaint.status === "in_progress"
                                ? "bg-[#4DD0E1] text-white"
                                : complaint.status === "pending"
                                  ? "bg-red-500 text-white"
                                  : ""
                          }
                        >
                          {complaint.status === "pending"
                            ? "Chờ xử lý"
                            : complaint.status === "in_progress"
                              ? "Đang xử lý"
                              : complaint.status === "resolved"
                                ? "Đã giải quyết"
                                : "Đã đóng"}
                        </Badge>
                      </TableCell>
                      <TableCell>{complaint.createdDate}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <MessageSquare className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{complaint.responses}</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < complaint.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
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
                            <DropdownMenuItem onClick={() => setSelectedComplaint(complaint)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Xem chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Phản hồi
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Phone className="mr-2 h-4 w-4" />
                              Gọi điện
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="mr-2 h-4 w-4" />
                              Gửi email
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {complaint.status === "pending" && (
                              <DropdownMenuItem className="text-blue-600">
                                <Clock className="mr-2 h-4 w-4" />
                                Bắt đầu xử lý
                              </DropdownMenuItem>
                            )}
                            {complaint.status === "in_progress" && (
                              <DropdownMenuItem className="text-green-600">
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Đánh dấu đã giải quyết
                              </DropdownMenuItem>
                            )}
                            {complaint.status === "resolved" && (
                              <DropdownMenuItem className="text-gray-600">
                                <XCircle className="mr-2 h-4 w-4" />
                                Đóng khiếu nại
                              </DropdownMenuItem>
                            )}
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
                <CardTitle>Hiệu quả Giải quyết</CardTitle>
                <CardDescription>Tỷ lệ giải quyết khiếu nại theo thời gian</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={complaintStatsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip
                      formatter={(value: any, name: string) => {
                        if (name === "resolved") return [value, "Đã giải quyết"]
                        if (name === "total") return [value, "Tổng số"]
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
                    <Bar dataKey="total" fill="#E0E7FF" name="Tổng số" />
                    <Bar dataKey="resolved" fill="#001F54" name="Đã giải quyết" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white to-green-50/50 border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Mức độ Hài lòng</CardTitle>
                <CardDescription>Đánh giá của khách hàng sau khi giải quyết</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#001F54]/10 to-[#4DD0E1]/10 rounded-lg">
                    <div>
                      <div className="text-sm text-gray-600">Điểm trung bình</div>
                      <div className="text-2xl font-bold text-[#001F54]">4.2/5</div>
                    </div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-6 h-6 ${i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const count = complaints.filter((c) => c.rating === rating).length
                      const percentage = (count / complaints.length) * 100
                      return (
                        <div key={rating} className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1 w-12">
                            <span className="text-sm">{rating}</span>
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          </div>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="h-2 rounded-full bg-gradient-to-r from-[#001F54] to-[#4DD0E1]"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 w-12">{count}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab Đánh giá */}
        <TabsContent value="feedback" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Phản hồi Tích cực</CardTitle>
                <CardDescription>Những đánh giá tốt từ khách hàng</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg bg-green-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">Lê Văn C</div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    "Vấn đề thanh toán được giải quyết rất nhanh chóng và chuyên nghiệp. Nhân viên hỗ trợ rất nhiệt
                    tình."
                  </p>
                  <div className="text-xs text-gray-500 mt-2">2024-03-18</div>
                </div>
                <div className="p-4 border rounded-lg bg-green-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">Nguyễn Thị E</div>
                    <div className="flex">
                      {[...Array(4)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                      <Star className="w-4 h-4 text-gray-300" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    "Dịch vụ khách hàng tốt, phản hồi nhanh. Sẽ tiếp tục mua sắm tại đây."
                  </p>
                  <div className="text-xs text-gray-500 mt-2">2024-03-16</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Phản hồi Cần cải thiện</CardTitle>
                <CardDescription>Những góp ý để cải thiện dịch vụ</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg bg-red-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">Nguyễn Văn A</div>
                    <div className="flex">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      {[...Array(4)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-gray-300" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    "Sản phẩm không đúng mô tả, cần cải thiện việc kiểm tra chất lượng trước khi giao hàng."
                  </p>
                  <div className="text-xs text-gray-500 mt-2">2024-03-20</div>
                </div>
                <div className="p-4 border rounded-lg bg-yellow-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">Phạm Thị D</div>
                    <div className="flex">
                      {[...Array(3)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                      {[...Array(2)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-gray-300" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    "Nhân viên cần được đào tạo thêm về kỹ năng giao tiếp và thái độ phục vụ."
                  </p>
                  <div className="text-xs text-gray-500 mt-2">2024-03-17</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog chi tiết khiếu nại */}
      <Dialog open={!!selectedComplaint} onOpenChange={() => setSelectedComplaint(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết Khiếu nại #{selectedComplaint?.id}</DialogTitle>
            <DialogDescription>Thông tin chi tiết và lịch sử xử lý khiếu nại</DialogDescription>
          </DialogHeader>
          {selectedComplaint && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Thông tin khách hàng</h3>
                    <div className="flex items-center space-x-3 p-4 border rounded-lg">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={selectedComplaint.customer.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-[#4DD0E1] text-white">
                          {selectedComplaint.customer.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{selectedComplaint.customer.name}</div>
                        <div className="text-sm text-gray-500">{selectedComplaint.customer.email}</div>
                        <div className="text-sm text-gray-500">{selectedComplaint.customer.phone}</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Thông tin đơn hàng</h3>
                    <div className="p-4 border rounded-lg">
                      <div className="text-sm">
                        <div className="flex justify-between">
                          <span>Mã đơn hàng:</span>
                          <span className="font-medium">{selectedComplaint.orderId}</span>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span>Ngày đặt:</span>
                          <span>{selectedComplaint.createdDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Chi tiết khiếu nại</h3>
                    <div className="p-4 border rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Chủ đề:</span>
                        <span className="font-medium">{selectedComplaint.subject}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Danh mục:</span>
                        <Badge variant="outline">
                          {selectedComplaint.category === "product"
                            ? "Sản phẩm"
                            : selectedComplaint.category === "shipping"
                              ? "Vận chuyển"
                              : selectedComplaint.category === "payment"
                                ? "Thanh toán"
                                : "Dịch vụ"}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Độ ưu tiên:</span>
                        <Badge
                          className={
                            selectedComplaint.priority === "high"
                              ? "bg-red-100 text-red-800"
                              : selectedComplaint.priority === "medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                          }
                        >
                          {selectedComplaint.priority === "high"
                            ? "Cao"
                            : selectedComplaint.priority === "medium"
                              ? "Trung bình"
                              : "Thấp"}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Trạng thái:</span>
                        <Badge
                          className={
                            selectedComplaint.status === "resolved"
                              ? "bg-[#81C784] text-white"
                              : selectedComplaint.status === "in_progress"
                                ? "bg-[#4DD0E1] text-white"
                                : "bg-red-500 text-white"
                          }
                        >
                          {selectedComplaint.status === "pending"
                            ? "Chờ xử lý"
                            : selectedComplaint.status === "in_progress"
                              ? "Đang xử lý"
                              : selectedComplaint.status === "resolved"
                                ? "Đã giải quyết"
                                : "Đã đóng"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Mô tả khiếu nại</h3>
                <div className="p-4 border rounded-lg bg-gray-50">
                  <p className="text-sm">{selectedComplaint.description}</p>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Phản hồi mới</h3>
                <div className="space-y-3">
                  <Textarea placeholder="Nhập phản hồi của bạn..." rows={4} />
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline">Lưu nháp</Button>
                    <Button className="bg-[#001F54] hover:bg-[#001F54]/90">
                      <Send className="mr-2 h-4 w-4" />
                      Gửi phản hồi
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
