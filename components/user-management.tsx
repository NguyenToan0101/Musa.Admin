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
import { Search, MoreHorizontal, UserCheck, UserX, Trash2, Eye } from "lucide-react"

const users = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "nguyenvana@email.com",
    phone: "0123456789",
    role: "customer",
    status: "active",
    joinDate: "2024-01-15",
    orders: 23,
    spent: "₫2,450,000",
  },
  {
    id: 2,
    name: "Trần Thị B",
    email: "tranthib@email.com",
    phone: "0987654321",
    role: "seller",
    status: "active",
    joinDate: "2024-02-20",
    orders: 156,
    spent: "₫15,670,000",
  },
  {
    id: 3,
    name: "Lê Văn C",
    email: "levanc@email.com",
    phone: "0456789123",
    role: "customer",
    status: "lock",
    joinDate: "2024-03-10",
    orders: 5,
    spent: "₫890,000",
  },
  {
    id: 4,
    name: "Phạm Thị D",
    email: "phamthid@email.com",
    phone: "0789123456",
    role: "seller",
    status: "PENDING_APPROVAL",
    joinDate: "2024-03-25",
    orders: 0,
    spent: "₫0",
  },
]

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === "all" || user.role === filterRole
    const matchesStatus = filterStatus === "all" || user.status === filterStatus

    return matchesSearch && matchesRole && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#001F54]">Quản lý Người dùng</h1>
        <Button className="bg-[#001F54] hover:bg-[#001F54]/90">Thêm người dùng mới</Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Tìm kiếm & Lọc</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tìm kiếm theo tên hoặc email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4DD0E1]"
            >
              <option value="all">Tất cả vai trò</option>
              <option value="customer">Người mua</option>
              <option value="seller">Người bán</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4DD0E1]"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="lock">Bị khóa</option>
              <option value="PENDING_APPROVAL">Chờ duyệt</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách Người dùng</CardTitle>
          <CardDescription>Tổng cộng {filteredUsers.length} người dùng</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Người dùng</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày tham gia</TableHead>
                <TableHead>Đơn hàng</TableHead>
                <TableHead>Tổng chi tiêu</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback className="bg-[#4DD0E1] text-white">{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        <div className="text-sm text-gray-500">{user.phone}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={user.role === "seller" ? "bg-[#81C784] text-white" : "bg-[#4DD0E1] text-white"}>
                      {user.role === "seller" ? "Người bán" : "Người mua"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.status === "active" ? "default" : user.status === "lock" ? "destructive" : "secondary"
                      }
                      className={user.status === "active" ? "bg-[#81C784] text-white" : ""}
                    >
                      {user.status === "active" ? "Hoạt động" : user.status === "lock" ? "Bị khóa" : "Chờ duyệt"}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.joinDate}</TableCell>
                  <TableCell>{user.orders}</TableCell>
                  <TableCell>{user.spent}</TableCell>
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
                        {user.status === "active" ? (
                          <DropdownMenuItem className="text-red-600">
                            <UserX className="mr-2 h-4 w-4" />
                            Khóa tài khoản
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem className="text-green-600">
                            <UserCheck className="mr-2 h-4 w-4" />
                            Mở khóa tài khoản
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa tài khoản
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
    </div>
  )
}
