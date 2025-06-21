"use client"

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
import { Search, MoreHorizontal, Eye, Truck, AlertTriangle, CheckCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"

const orders = [
  {
    id: "ORD-001",
    customer: "Nguyễn Văn A",
    seller: "TechStore VN",
    total: "₫29,990,000",
    status: "processing",
    shipping: "Giao hàng nhanh",
    shippingStatus: "picked_up",
    orderDate: "2024-03-20",
    items: 2,
  },
  {
    id: "ORD-002",
    customer: "Trần Thị B",
    seller: "Fashion Shop",
    total: "₫599,000",
    status: "shipped",
    shipping: "Giao hàng tiêu chuẩn",
    shippingStatus: "in_transit",
    orderDate: "2024-03-19",
    items: 3,
  },
  {
    id: "ORD-003",
    customer: "Lê Văn C",
    seller: "Computer World",
    total: "₫15,500,000",
    status: "delivered",
    shipping: "Giao hàng nhanh",
    shippingStatus: "delivered",
    orderDate: "2024-03-18",
    items: 1,
  },
  {
    id: "ORD-004",
    customer: "Phạm Thị D",
    seller: "Shoe Paradise",
    total: "₫2,890,000",
    status: "cancelled",
    shipping: "Giao hàng tiêu chuẩn",
    shippingStatus: "cancelled",
    orderDate: "2024-03-17",
    items: 1,
  },
]

const shippingPartners = [
  {
    name: "Giao hàng nhanh",
    performance: 95,
    orders: 1250,
    onTime: 92,
    status: "excellent",
  },
  {
    name: "Giao hàng tiêu chuẩn",
    performance: 88,
    orders: 890,
    onTime: 85,
    status: "good",
  },
  {
    name: "Vận chuyển Express",
    performance: 78,
    orders: 456,
    onTime: 75,
    status: "average",
  },
]

export function OrderManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.seller.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || order.status === filterStatus

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#001F54]">Quản lý Đơn hàng & Vận chuyển</h1>
        <div className="flex space-x-2">
          <Badge className="bg-[#4DD0E1] text-white">
            {orders.filter((o) => o.status === "processing").length} đang xử lý
          </Badge>
          <Badge className="bg-yellow-500 text-white">
            {orders.filter((o) => o.status === "shipped").length} đang giao
          </Badge>
        </div>
      </div>

      {/* Shipping Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {shippingPartners.map((partner, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-lg">{partner.name}</CardTitle>
              <CardDescription>Hiệu suất vận chuyển</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Tổng thể</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={partner.performance} className="w-16" />
                    <span className="text-sm font-medium">{partner.performance}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Đúng hẹn</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={partner.onTime} className="w-16" />
                    <span className="text-sm font-medium">{partner.onTime}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Đơn hàng</span>
                  <span className="text-sm font-medium">{partner.orders}</span>
                </div>
                <Badge
                  className={
                    partner.status === "excellent"
                      ? "bg-[#81C784] text-white"
                      : partner.status === "good"
                        ? "bg-[#4DD0E1] text-white"
                        : "bg-yellow-500 text-white"
                  }
                >
                  {partner.status === "excellent" ? "Xuất sắc" : partner.status === "good" ? "Tốt" : "Trung bình"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Order Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Tìm kiếm & Lọc Đơn hàng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tìm kiếm theo mã đơn hàng, khách hàng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4DD0E1]"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="processing">Đang xử lý</option>
              <option value="shipped">Đang giao hàng</option>
              <option value="delivered">Đã giao</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách Đơn hàng</CardTitle>
          <CardDescription>Tổng cộng {filteredOrders.length} đơn hàng</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã đơn hàng</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Người bán</TableHead>
                <TableHead>Tổng tiền</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Vận chuyển</TableHead>
                <TableHead>Ngày đặt</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.seller}</TableCell>
                  <TableCell className="font-medium">{order.total}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        order.status === "delivered"
                          ? "default"
                          : order.status === "cancelled"
                            ? "destructive"
                            : "secondary"
                      }
                      className={
                        order.status === "delivered"
                          ? "bg-[#81C784] text-white"
                          : order.status === "shipped"
                            ? "bg-[#4DD0E1] text-white"
                            : order.status === "processing"
                              ? "bg-yellow-500 text-white"
                              : ""
                      }
                    >
                      {order.status === "processing"
                        ? "Đang xử lý"
                        : order.status === "shipped"
                          ? "Đang giao"
                          : order.status === "delivered"
                            ? "Đã giao"
                            : "Đã hủy"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{order.shipping}</div>
                      <div className="text-gray-500 flex items-center">
                        {order.shippingStatus === "delivered" && (
                          <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                        )}
                        {order.shippingStatus === "in_transit" && <Truck className="w-3 h-3 mr-1 text-blue-500" />}
                        {order.shippingStatus === "cancelled" && (
                          <AlertTriangle className="w-3 h-3 mr-1 text-red-500" />
                        )}
                        {order.shippingStatus === "picked_up" && <Truck className="w-3 h-3 mr-1 text-yellow-500" />}
                        {order.shippingStatus === "delivered"
                          ? "Đã giao"
                          : order.shippingStatus === "in_transit"
                            ? "Đang vận chuyển"
                            : order.shippingStatus === "cancelled"
                              ? "Đã hủy"
                              : "Đã lấy hàng"}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{order.orderDate}</TableCell>
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
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Truck className="mr-2 h-4 w-4" />
                          Cập nhật vận chuyển
                        </DropdownMenuItem>
                        {order.status === "processing" && (
                          <DropdownMenuItem className="text-red-600">
                            <AlertTriangle className="mr-2 h-4 w-4" />
                            Báo lỗi hệ thống
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
    </div>
  )
}
