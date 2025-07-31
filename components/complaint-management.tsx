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
  Lock,
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
  categoryName: 'product' | 'shipping' | 'payment' | 'review';
  status: 'pending' | 'in_progress' | 'resolved';
  createdAt: string;
}

const CATEGORY_LABEL: Record<Complaint['categoryName'], string> = {
  product: 'Sản phẩm',
  review: 'Review',
  shipping: 'Vận chuyển',
  payment: 'Thanh toán',
};

const STATUS_LABEL: Record<Complaint['status'], string> = {
  pending: 'Chờ xử lý',
  in_progress: 'Đang xử lý',
  resolved: 'Đã giải quyết',
}

export interface ComplaintDetailDTO {
  complaintId: number;
  customerId: number;
  customerName: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  reasonDescription: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  status: 'pending' | 'in_progress' | 'resolved';
  categoryName: 'product' | 'shipping' | 'payment' | 'review';
  product?: ProductDetail | null;
  review?: ReviewDetail | null;
  payment?: PaymentDetail | null;
  shipping?: ShippingDetail | null;
  complaintImages?: string[] | null;
}



export interface ProductDetail {
  productId: number;
  shopId: number;
  shopName: string;
  category: string;
  name: string;
  description: string;
  images: string[];
}

export interface ReviewDetail {
  reviewId: number;
  productId: number;
productName: string | null;
  rating: number;
  comment: string;
  images?: string[];
}

export interface PaymentDetail {
  paymentId: number;
  amount: number;
  method: string;
  status: string;
  transactionId: string;
  gateway: string;
  paidAt: string;
}

export interface ShippingDetail {
  orderId: number;
  orderDate: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  address: string;
}


export function ComplaintManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterPriority, setFilterPriority] = useState("all")
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [selectedComplaint, setSelectedComplaint] = useState<ComplaintDetailDTO | null>(null);

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await axios.get<Complaint[]>(`${process.env.NEXT_PUBLIC_API_BACKEND}/admin/complaints`);
      setComplaints(res.data);
    } catch {
      setError("Không tải được khiếu nại.");
    } finally {
      setLoading(false);
    }
  };



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

  useEffect(() => {
    fetchComplaints();
  }, []);


  //view detail
  const fetchComplaintDetail = async (complaintId: number) => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BACKEND}/admin/complaints/${complaintId}`);
      setSelectedComplaint(res.data);
    } catch (e) {
      setError("Không tải được chi tiết khiếu nại.");
    } finally {
      setLoading(false);
    }
  };

  // 1) Xử lý chuyển trạng thái complaint
  const handleChangeStatus = async (newStatus: 'in_progress' | 'resolved') => {
    if (!selectedComplaint) return;
    await axios.patch(
      `${process.env.NEXT_PUBLIC_API_BACKEND}/admin/complaints/${selectedComplaint.complaintId}/status`,
      { status: newStatus }
    );
    await fetchComplaints();
setSelectedComplaint({
      ...selectedComplaint,
      status: newStatus,
    });
    await fetchComplaintDetail(selectedComplaint.complaintId);
  };

  // 2) Xử lý review: ẩn/xoá
  const handleHideReview = async () => {
    if (!selectedComplaint?.review) return;
    await axios.patch(
      `${process.env.NEXT_PUBLIC_API_BACKEND}/admin/reviews/${selectedComplaint.review.reviewId}/hide`,
      { isHidden: true }
    );
    fetchComplaintDetail(selectedComplaint.complaintId);
  };
  const handleDeleteReview = async () => {
    if (!selectedComplaint?.review) return;
    await axios.delete(
      `${process.env.NEXT_PUBLIC_API_BACKEND}/admin/reviews/${selectedComplaint.review.reviewId}`
    );
    await handleChangeStatus('resolved');
  };

  // 3) Xử lý khóa sản phẩm
  const handleLockProduct = async () => {
    if (!selectedComplaint?.product) return;
    await axios.post(
      `${process.env.NEXT_PUBLIC_API_BACKEND}/admin/products/${selectedComplaint.product.productId}/lock`,
      { durationMinutes: 0 } // hoặc payload phù hợp LockRequest của bạn
    );
    fetchComplaintDetail(selectedComplaint.complaintId);
  };






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
                <SelectItem value="review">Review</SelectItem>
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
                    : c.categoryName === 'review'
                      ? `RV-${c.rawReviewId}`
                      : c.categoryName === 'payment'
                        ? `PM-${c.rawPaymentId}`
                        : c.categoryName === 'shipping'
                          ? `OD-${c.rawShippingOrderId}`
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

                          <DropdownMenuItem onClick={() => fetchComplaintDetail(c.complaintId)}>
                            <Eye className="mr-2 h-4 w-4" /> Xem chi tiết
                          </DropdownMenuItem>

                          {/* Nếu đang pending thì cho “Xử lý” */}
                          {c.status === "pending" && (
                            <DropdownMenuItem onClick={() => {
                              fetchComplaintDetail(c.complaintId)
                              handleChangeStatus("in_progress");
                            }}>
                              <Clock className="mr-2 h-4 w-4" /> Xử lý
                            </DropdownMenuItem>
                          )}

                          {/* Khi đã in_progress thì cho “Đã giải quyết” */}
{c.status === "in_progress" && (
                            <DropdownMenuItem onClick={() => handleChangeStatus("resolved")}>
                              <CheckCircle className="mr-2 h-4 w-4" /> Đánh dấu giải quyết
                            </DropdownMenuItem>
                          )}

                          {/* Nếu category = review và đang in_progress thì thêm Hide/Delete */}
                          {c.status === "in_progress" && c.categoryName === "review" && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={handleHideReview}>
                                <AlertTriangle className="mr-2 h-4 w-4" /> Ẩn review
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={handleDeleteReview}>
                                <XCircle className="mr-2 h-4 w-4" /> Xóa review
                              </DropdownMenuItem>
                            </>
                          )}

                          {/* Nếu category = product thì luôn có nút “Khóa sản phẩm” */}
                          {c.categoryName === "product" && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={handleLockProduct}>
                                <Lock className="mr-2 h-4 w-4" /> Khóa sản phẩm
                              </DropdownMenuItem>
                            </>
                          )}
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


      {/* Dialog chi tiết khiếu nại */}
      <Dialog open={!!selectedComplaint} onOpenChange={() => setSelectedComplaint(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết Khiếu nại #{selectedComplaint?.complaintId}</DialogTitle>
            <DialogDescription>Thông tin chi tiết khiếu nại</DialogDescription>
          </DialogHeader>
          {selectedComplaint && (
            <div className="space-y-6">
              {/* Thông tin chung */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Khách hàng</h3>
                  <div className="p-4 border rounded-lg">
                    <div className="font-medium">{selectedComplaint.customerName}</div>
                    <div className="text-sm text-gray-500">ID: {selectedComplaint.customerId}</div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Lý do</h3>
<div className="p-4 border rounded-lg">
                    <div className="font-medium">{selectedComplaint.reasonDescription}</div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Mô tả khiếu nại</h3>
                <div className="p-4 border rounded-lg bg-gray-50">
                  <p className="text-sm">{selectedComplaint.description}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Chi tiết sản phẩm */}
                {selectedComplaint.product && (
                  <div>
                    <h3 className="font-medium mb-2">Sản phẩm liên quan</h3>
                    <div className="p-4 border rounded-lg space-y-2">
                      <div><b>Tên sản phẩm:</b> {selectedComplaint.product.name}</div>
                      <div><b>Shop:</b> {selectedComplaint.product.shopName}</div>
                      <div><b>Danh mục:</b> {selectedComplaint.product.category}</div>
                      <div><b>Mô tả:</b> {selectedComplaint.product.description}</div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedComplaint.product.images?.map((img: string, idx: number) => (
                          <img key={idx} src={img} alt="product" className="w-24 h-24 object-cover rounded" />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Chi tiết review */}
                {selectedComplaint.review && (
                  <div>
                    <h3 className="font-medium mb-2">Thông tin Review</h3>
                    <div className="p-4 border rounded-lg space-y-2">
                      <div>
                        <b>Mã review:</b> {selectedComplaint.review.reviewId}
                      </div>
                      <div>
                        <b>Sản phẩm:</b> {selectedComplaint.review.productName}
                        {selectedComplaint.review.productId != null && ` (ID: ${selectedComplaint.review.productId})`}
                      </div>
                      <div>
                        <b>Đánh giá:</b> {selectedComplaint.review.rating} sao
                      </div>
                      <div>
                        <b>Bình luận:</b> {selectedComplaint.review.comment}
                      </div>

                      {/* Chỉ hiển thị nếu có ảnh */}
                      {selectedComplaint.review.images && selectedComplaint.review.images.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedComplaint.review.images.map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
alt={`review-img-${idx}`}
                              className="w-24 h-24 object-cover rounded"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Chi tiết payment */}
                {selectedComplaint.payment && (
                  <div>
                    <h3 className="font-medium mb-2">Thông tin thanh toán</h3>
                    <div className="p-4 border rounded-lg space-y-2">
                      <div><b>Mã thanh toán:</b> {selectedComplaint.payment.paymentId}</div>
                      <div><b>Số tiền:</b> {selectedComplaint.payment.amount}</div>
                      <div><b>Phương thức:</b> {selectedComplaint.payment.method}</div>
                      <div><b>Trạng thái:</b> {selectedComplaint.payment.status}</div>
                      <div><b>Transaction ID:</b> {selectedComplaint.payment.transactionId}</div>
                      <div><b>Gateway:</b> {selectedComplaint.payment.gateway}</div>
                      <div><b>Ngày thanh toán:</b> {selectedComplaint.payment.paidAt}</div>
                    </div>
                  </div>
                )}
                {/* Chi tiết shipping */}
                {selectedComplaint.shipping && (
                  <div>
                    <h3 className="font-medium mb-2">Thông tin vận chuyển</h3>
                    <div className="p-4 border rounded-lg space-y-2">
                      <div><b>Mã đơn hàng:</b> {selectedComplaint.shipping.orderId}</div>
                      <div><b>Ngày đặt:</b> {selectedComplaint.shipping.orderDate}</div>
                      <div><b>Số tiền:</b> {selectedComplaint.shipping.totalAmount}</div>
                      <div><b>Trạng thái:</b> {selectedComplaint.shipping.status}</div>
                      <div><b>Trạng thái thanh toán:</b> {selectedComplaint.shipping.paymentStatus}</div>
                      <div><b>Địa chỉ:</b> {selectedComplaint.shipping.address}</div>
                    </div>
                  </div>
                )}
              </div>


            </div>
          )}

          {/* Action buttons */}
          {selectedComplaint && (
            <div className="flex justify-end space-x-2 mt-4">
              {selectedComplaint.status === 'pending' && (
                <>
                  <Button onClick={() => handleChangeStatus('in_progress')}>
                    {selectedComplaint.categoryName === 'review' ? 'Bắt đầu xử lý review' : 'Xử lý'}
                  </Button>
                  {selectedComplaint.categoryName === 'product' && (
                    <Button variant="destructive" onClick={handleLockProduct}>
                      Khóa sản phẩm
                    </Button>
                  )}
                </>
              )}
{selectedComplaint.status === 'in_progress' && (
                <>
                  <Button onClick={() => handleChangeStatus('resolved')}>
                    Đánh dấu đã giải quyết
                  </Button>

                  {selectedComplaint.categoryName === 'review' && (
                    <>
                      <Button variant="outline" onClick={handleHideReview}>
                        Ẩn review
                      </Button>
                      <Button variant="destructive" onClick={handleDeleteReview}>
                        Xóa review
                      </Button>
                    </>
                  )}

                  {selectedComplaint.categoryName === 'product' && (
                    <Button variant="destructive" onClick={handleLockProduct}>
                      Khóa sản phẩm
                    </Button>
                  )}
                </>
              )}

              {selectedComplaint.status === 'resolved' && (
                <Badge className="bg-green-500 text-white">Đã giải quyết</Badge>
              )}
            </div>
          )}

        </DialogContent>
      </Dialog>


    </div>
  )
}