"use client"


import { useState, useEffect } from "react"
import axios from "axios"
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



interface Complaint {
  complaintId: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  reasonDescription: string;
  rawProductId?: number;
  rawReviewId?: number;
  rawPaymentId?: number;
  rawShippingOrderId?: number
  categoryName: 'product' | 'shipping' | 'payment' | 'feedback';
  status: 'pending' | 'in_progress' | 'resolved';
  createdAt: string;
}

const CATEGORY_LABEL: Record<Complaint['categoryName'], string> = {
  product: 'Sản phẩm',
  feedback: 'Review',
  shipping: 'Vận chuyển',
  payment: 'Thanh toán',
};

const STATUS_LABEL: Record<Complaint['status'], string> = {
  pending: 'Chờ xử lý',
  in_progress: 'Đang xử lý',
  resolved: 'Đã giải quyết',
}

export function ComplaintManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterPriority, setFilterPriority] = useState("all")
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null)
  const [complaints, setComplaints] = useState<Complaint[]>([])


  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)



  const filtered = complaints.filter(c => {
    const nameMatch = `${c.firstname} ${c.lastname}`.toLowerCase().includes(searchTerm.toLowerCase())
    const subjectMatch = c.reasonDescription.toLowerCase().includes(searchTerm.toLowerCase())
    const codeMatch = c.complaintId.toString().includes(searchTerm)
    const statusMatch = filterStatus === "all" || c.status === filterStatus
    const categoryMatch = filterCategory === "all" || c.categoryName === filterCategory

    return (nameMatch || subjectMatch || codeMatch) && statusMatch && categoryMatch
  })

  useEffect(() => {
    setLoading(true)
    axios.get<Complaint[]>(`${process.env.NEXT_PUBLIC_API_BACKEND}/admin/complaints`)
      .then(res => setComplaints(res.data))
      .catch(() => setError("Không tải được khiếu nại."))
      .finally(() => setLoading(false))
  }, [])



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
        </TabsList>



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
                    <SelectItem value="all">Trạng Thái</SelectItem>
                    <SelectItem value="pending">Chờ xử lý</SelectItem>
                    <SelectItem value="in_progress">Đang xử lý</SelectItem>
                    <SelectItem value="resolved">Đã giải quyết</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Danh Mục</SelectItem>
                    <SelectItem value="product">Sản phẩm</SelectItem>
                    <SelectItem value="shipping">Vận chuyển</SelectItem>
                    <SelectItem value="payment">Thanh toán</SelectItem>
                    <SelectItem value="feedback">Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Danh sách Khiếu nại</CardTitle>
              <CardDescription>
                Tổng cộng {filtered.length} khiếu nại
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Khách hàng</TableHead>
                    <TableHead>Chủ đề</TableHead>
                    <TableHead>Danh mục</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((c) => {
                    const refId =
                      c.categoryName === 'product'
                        ? `SP-${c.rawProductId}`
                        : c.categoryName === 'feedback'
                          ? `RV-${c.rawReviewId}`
                          : c.categoryName === 'payment'
                            ? `PM-${c.rawPaymentId}`
                            : c.categoryName === 'shipping'
                              ? `OD-${c.rawShippingOrderId}`  // OD = Order-Dispatch
                              : '';
                    return (
                      <TableRow key={c.complaintId}>
                        {/* Khách hàng */}
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-10 h-10">
                              <AvatarFallback className="bg-[#4DD0E1] text-white">
                                {c.firstname.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">
                                {c.firstname} {c.lastname}
                              </div>
                              <div className="text-sm text-gray-500">{c.email}</div>
                              <div className="text-sm text-gray-500">{c.phone}</div>
                            </div>
                          </div>
                        </TableCell>

                        {/* Chủ đề */}
                        <TableCell>
                          <div className="font-medium">{c.reasonDescription}</div>
                          <div className="text-sm text-gray-400">{refId}</div>
                        </TableCell>

                        {/* Danh mục */}
                        <TableCell>
                          <Badge variant="outline">
                            {CATEGORY_LABEL[c.categoryName]}
                          </Badge>
                        </TableCell>

                        {/* Trạng thái */}
                        <TableCell>
                          <Badge
                            className={
                              c.status === 'pending'
                                ? 'bg-red-500 text-white'
                                : c.status === 'in_progress'
                                  ? 'bg-yellow-500 text-white'
                                  : 'bg-green-500 text-white'
                            }
                          >
                            {STATUS_LABEL[c.status]}
                          </Badge>
                        </TableCell>

                        {/* Ngày tạo */}
                        <TableCell>
                          {new Date(c.createdAt).toLocaleDateString("vi-VN")}
                        </TableCell>

                        {/* Hành động */}
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => setSelectedComplaint(c)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Xem chi tiết
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
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
                                : "Review"}
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
