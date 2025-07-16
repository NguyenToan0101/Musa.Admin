"use client"
interface User {
  id: number
  name: string
  email: string
  phone: string
  role: "Seller" | "Customer"
  status: boolean
  joinDate: string
  orders: number
  spent: string

  // Thông tin bổ sung
  gender?: string
  dateOfBirth?: string
  address?: string

  // Nếu là người bán
  idNumber?: string
  shopName?: string
  fullAddress?: string
  businessType?: string
  phoneShop?: string
  taxCode?: string
  invoiceEmail?: string
  manageName?: string
  statusShop?: string
  express?: boolean
  fast?: boolean
  economy?: boolean
  lockerDelivery?: boolean
  bulkyItems?: boolean
}



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
import { useEffect, useState } from "react"
import axios from "axios"
import React from "react"

import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

function formatDate(dateStr: string | Date) {
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}


export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [users, setUsers] = useState<User[]>([])
  const [expandedUserId, setExpandedUserId] = useState<number | null>(null);
  const [showLockModal, setShowLockModal] = useState(false);
  const [selectedUserToLock, setSelectedUserToLock] = useState<User | null>(null);
  const [lockUntil, setLockUntil] = useState<Date | null>(null);
  const handleDeleteUser = async (id: number, name: string) => {
    const confirmDelete = window.confirm(`Bạn có chắc chắn muốn xóa người dùng "${name}" không?`);
    if (!confirmDelete) return;

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_BACKEND}/admin/users/${id}`);

      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Lỗi khi xóa người dùng:", error);
      alert("Xóa người dùng thất bại. Vui lòng thử lại.");
    }
  };

  // Phân trang
  const [userPage, setUserPage] = useState(1)
  const usersPerPage = 10



  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_BACKEND}/admin/users`)
      .then((res) => {
        const formatted = res.data.map((u: any) => ({
          id: u.customerid,
          name: u.fullName,
          email: u.email,
          phone: u.phone,
          role: u.role,
          status: u.status,
          joinDate: u.joinedDate,
          orders: u.totalOrders,
          spent: new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(u.totalSpending),

          gender: u.gender === 'M' ? "Nam" : u.gender === 'F' ? "Nữ" : "Khác",
          dateOfBirth: u.dateOfBirth,
          address: u.address,

          // Thông tin nếu là người bán
          idNumber: u.idNumber,
          shopName: u.shopName,
          fullAddress: u.fullAddress,
          businessType: u.businessType,
          phoneShop: u.phoneShop,
          taxCode: u.taxCode,
          invoiceEmail: u.invoiceEmail,
          manageName: u.manageName,
          statusShop: u.statusShop,
          express: u.express,
          fast: u.fast,
          economy: u.economy,
          lockerDelivery: u.lockerDelivery,
          bulkyItems: u.bulkyItems
        }));

        setUsers(formatted);
      })
      .catch((err) => console.error("Lỗi tải danh sách người dùng:", err));
  }, []);




  const filteredUsers = users.filter((user) => {
    if (!user || !user.name || !user.email) return false;

    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = filterRole === "all" || user.role === filterRole;

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && user.status === true) ||
      (filterStatus === "lock" && user.status === false);

    return matchesSearch && matchesRole && matchesStatus;
  });

  //Khóa người dùng
  const handleConfirmLockUser = async () => {
    if (!selectedUserToLock || !lockUntil) return;

    const now = new Date();
    const durationMinutes = Math.ceil((lockUntil.getTime() - now.getTime()) / (60 * 1000));

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BACKEND}/admin/users/${selectedUserToLock.id}/lock`,
        { durationMinutes: durationMinutes },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      // cập nhật UI
      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedUserToLock.id ? { ...u, status: false } : u
        )
      );
      setShowLockModal(false);
      setSelectedUserToLock(null);
      setLockUntil(null);
    } catch (error) {
      console.error("Lỗi khi khóa tài khoản:", error);
      alert("Khóa tài khoản thất bại.");
    }
  };


  // Mở khóa Người dùng
  const handleUnlockUser = async (userId: number) => {
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_BACKEND}/admin/users/${userId}/unlock`);
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, status: true } : user
        )
      );
    } catch (error) {
      console.error("Lỗi khi mở khóa người dùng:", error);
      alert("Mở khóa người dùng thất bại.");
    }
  };

  useEffect(() => {
    setUserPage(1)
  }, [searchTerm, filterRole, filterStatus])



  const pagedUsers = filteredUsers.slice((userPage - 1) * usersPerPage, userPage * usersPerPage)





  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#001F54]">Quản lý Người dùng</h1>
        {/* <Button className="bg-[#001F54] hover:bg-[#001F54]/90">Thêm người dùng mới</Button> */}
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
              <option value="Customer">Người mua</option>
              <option value="Seller">Người bán</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4DD0E1]"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="lock">Bị khóa</option>
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
              {pagedUsers.map((user) => (
                <React.Fragment key={user.id}>
                  <TableRow>
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
                      <Badge className={user.role === "Seller" ? "bg-[#81C784] text-white" : "bg-[#4DD0E1] text-white"}>
                        {user.role === "Seller" ? "Người bán" : "Người mua"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.status ? "default" : "destructive"}
                        className={user.status ? "bg-[#81C784] text-white" : ""}
                      >
                        {user.status ? "Hoạt động" : "Bị khóa"}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(user.joinDate)}</TableCell>
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
                          <DropdownMenuItem onClick={() => setExpandedUserId(user.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Xem chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {user.status ? (
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => {
                                setSelectedUserToLock(user);
                                setShowLockModal(true);
                              }}
                            >
                              <UserX className="mr-2 h-4 w-4" />
                              Khóa tài khoản
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              className="text-green-600"
                              onClick={() => handleUnlockUser(user.id)}
                            >
                              <UserCheck className="mr-2 h-4 w-4" />
                              Mở khóa tài khoản
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteUser(user.id, user.name)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Xóa tài khoản
                          </DropdownMenuItem>

                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>

                  {expandedUserId === user.id && (
                    <TableRow>
                      <TableCell colSpan={7}>
                        <div className="p-4 bg-gray-50 rounded-md space-y-2 text-sm">
                          <p><strong>Giới tính:</strong> {user.gender}</p>
                          <p><strong>Ngày sinh:</strong> {user.dateOfBirth}</p>
                          <p><strong>Địa chỉ:</strong> {user.address}</p>
                          {user.role === "Seller" && (
                            <>
                              <p><strong>CCCD:</strong> {user.idNumber}</p>
                              <p><strong>Tên cửa hàng:</strong> {user.shopName}</p>
                              <p><strong>Địa chỉ shop:</strong> {user.fullAddress}</p>
                              <p><strong>Người quản lý:</strong> {user.manageName}</p>
                              <p><strong>SĐT cửa hàng:</strong> {user.phoneShop}</p>
                              <p><strong>Email hóa đơn:</strong> {user.invoiceEmail}</p>
                              <p><strong>Mã số thuế:</strong> {user.taxCode}</p>
                              <p><strong>Loại hình kinh doanh:</strong> {user.businessType}</p>
                              <p><strong>Trạng thái shop:</strong> {user.statusShop}</p>
                              <p><strong>Dịch vụ:</strong>
                                {["express", "fast", "economy", "lockerDelivery", "bulkyItems"]
                                  .filter(service => user[service as keyof User])
                                  .map(service => ` ${service}`)
                                  .join(", ") || "Không có"}
                              </p>
                            </>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setExpandedUserId(null)}
                            className="mt-2"
                          >
                            Đóng chi tiết
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}

                </React.Fragment>
              ))}
            </TableBody>

          </Table>
          <div className="flex justify-center mt-4 space-x-2">
            {Array.from(
              { length: Math.ceil(filteredUsers.length / usersPerPage) },
              (_, i) => i + 1
            ).map(page => (
              <button
                key={page}
                onClick={() => setUserPage(page)}
                className={
                  "px-3 py-1 rounded " +
                  (userPage === page
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700")
                }
              >
                {page}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showLockModal} onOpenChange={setShowLockModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chọn thời gian khóa tài khoản</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              Khóa tài khoản <strong>{selectedUserToLock?.name}</strong> cho đến:
            </p>
            <DatePicker
              selected={lockUntil}
              onChange={(date) => setLockUntil(date)}
              showTimeSelect
              dateFormat="Pp"
              className="w-full border px-2 py-1 rounded"
            />
            <Button
              className="bg-red-600 text-white"
              onClick={handleConfirmLockUser}
              disabled={!lockUntil}
            >
              Xác nhận khóa
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  )
}
