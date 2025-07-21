"use client"

import { useEffect, useState } from "react"
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
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  MoreHorizontal,
  Plus,
  Edit,
  Trash2,
  Shield,
  Users,
  Key,
  Eye,
  UserPlus,
  Lock,
  Unlock,
  Crown,
  Star,
} from "lucide-react"

// Dữ liệu mẫu cho vai trò
const roles = [
  {
    id: "ROLE001",
    name: "Super Admin",
    description: "Quyền cao nhất, quản lý toàn bộ hệ thống",
    level: 1,
    usersCount: 2,
    permissions: ["all"],
    color: "bg-red-500",
    createdDate: "2024-01-01",
  },
  {
    id: "ROLE002",
    name: "Admin",
    description: "Quản lý hệ thống, không thể thay đổi cài đặt bảo mật",
    level: 2,
    usersCount: 5,
    permissions: ["dashboard", "users", "products", "orders", "categories", "promotions"],
    color: "bg-blue-500",
    createdDate: "2024-01-15",
  },
  {
    id: "ROLE003",
    name: "Moderator",
    description: "Kiểm duyệt nội dung, quản lý khiếu nại",
    level: 3,
    usersCount: 8,
    permissions: ["dashboard", "products", "complaints", "content"],
    color: "bg-green-500",
    createdDate: "2024-02-01",
  },
  {
    id: "ROLE004",
    name: "Sales Manager",
    description: "Quản lý bán hàng, theo dõi đơn hàng và khuyến mãi",
    level: 4,
    usersCount: 12,
    permissions: ["dashboard", "orders", "promotions", "analytics"],
    color: "bg-orange-500",
    createdDate: "2024-02-15",
  },
  {
    id: "ROLE005",
    name: "Customer Support",
    description: "Hỗ trợ khách hàng, xử lý khiếu nại",
    level: 5,
    usersCount: 15,
    permissions: ["dashboard", "complaints", "messages", "users_view"],
    color: "bg-purple-500",
    createdDate: "2024-03-01",
  },
]

// Dữ liệu mẫu cho người dùng có quyền
const adminUsers = [
  {
    id: "USER001",
    name: "Nguyễn Văn Admin",
    email: "admin@ecommerce.vn",
    phone: "0123456789",
    avatar: "/placeholder.svg",
    role: "Super Admin",
    roleId: "ROLE001",
    status: "active",
    lastLogin: "2024-03-20 14:30",
    createdDate: "2024-01-01",
    permissions: ["all"],
  },
  {
    id: "USER002",
    name: "Trần Thị Manager",
    email: "manager@ecommerce.vn",
    phone: "0987654321",
    avatar: "/placeholder.svg",
    role: "Admin",
    roleId: "ROLE002",
    status: "active",
    lastLogin: "2024-03-20 10:15",
    createdDate: "2024-01-15",
    permissions: ["dashboard", "users", "products", "orders"],
  },
  {
    id: "USER003",
    name: "Lê Văn Moderator",
    email: "mod@ecommerce.vn",
    phone: "0456789123",
    avatar: "/placeholder.svg",
    role: "Moderator",
    roleId: "ROLE003",
    status: "active",
    lastLogin: "2024-03-19 16:45",
    createdDate: "2024-02-01",
    permissions: ["dashboard", "products", "complaints"],
  },
  {
    id: "USER004",
    name: "Phạm Thị Sales",
    email: "sales@ecommerce.vn",
    phone: "0789123456",
    avatar: "/placeholder.svg",
    role: "Sales Manager",
    roleId: "ROLE004",
    status: "inactive",
    lastLogin: "2024-03-18 09:20",
    createdDate: "2024-02-15",
    permissions: ["dashboard", "orders", "promotions"],
  },
]

// Danh sách quyền có thể có
const availablePermissions = [
  { id: "dashboard", name: "Dashboard", description: "Xem trang tổng quan" },
  { id: "users", name: "Quản lý người dùng", description: "Thêm, sửa, xóa người dùng" },
  { id: "users_view", name: "Xem người dùng", description: "Chỉ xem thông tin người dùng" },
  { id: "products", name: "Quản lý sản phẩm", description: "Thêm, sửa, xóa sản phẩm" },
  { id: "orders", name: "Quản lý đơn hàng", description: "Xem và xử lý đơn hàng" },
  { id: "categories", name: "Quản lý danh mục", description: "Thêm, sửa, xóa danh mục" },
  { id: "promotions", name: "Quản lý khuyến mãi", description: "Tạo và quản lý khuyến mãi" },
  { id: "complaints", name: "Quản lý khiếu nại", description: "Xử lý khiếu nại khách hàng" },
  { id: "messages", name: "Tin nhắn", description: "Gửi và nhận tin nhắn" },
  { id: "analytics", name: "Thống kê báo cáo", description: "Xem báo cáo và thống kê" },
  { id: "settings", name: "Cài đặt hệ thống", description: "Thay đổi cài đặt hệ thống" },
  { id: "security", name: "Bảo mật", description: "Quản lý bảo mật hệ thống" },
]

export function PermissionManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const [isCreateRoleOpen, setIsCreateRoleOpen] = useState(false)
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false)

  const filteredUsers = adminUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === "all" || user.roleId === filterRole
    return matchesSearch && matchesRole
  })
    //  const [email, setEmail] = useState("");
      console.log("-----------Email", localStorage.getItem("adminEmail"));
    
     useEffect(() => {
        if (typeof window !== "undefined") {
          const storedEmail = localStorage.getItem("adminEmail");
          console.log("-----------Email from localStorage", storedEmail);
          // if (storedEmail) {
          //   setEmail(storedEmail);
          // }
        }
      }, []);
    
    //   useEffect(() => {
    //     // Theo dõi khi email thực sự thay đổi
    //     if (email) {
    //       console.log("-----------Updated email state:", email);
    //     }
    //   }, [email]);
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#001F54] to-[#4DD0E1] bg-clip-text text-transparent">
            Quản lý Quyền Tài khoản
          </h1>
          <p className="text-gray-500 mt-1">Phân quyền và quản lý tài khoản admin, moderator</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-red-100 text-red-800">
            {adminUsers.filter((u) => u.role === "Super Admin").length} Super Admin
          </Badge>
          <Badge className="bg-blue-100 text-blue-800">
            {adminUsers.filter((u) => u.role === "Admin").length} Admin
          </Badge>
          <Badge className="bg-green-100 text-green-800">
            {adminUsers.filter((u) => u.role === "Moderator").length} Moderator
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-white shadow-lg">
          <TabsTrigger value="users" className="data-[state=active]:bg-[#001F54] data-[state=active]:text-white">
            <Users className="w-4 h-4 mr-2" />
            Người dùng
          </TabsTrigger>
          <TabsTrigger value="roles" className="data-[state=active]:bg-[#4DD0E1] data-[state=active]:text-white">
            <Shield className="w-4 h-4 mr-2" />
            Vai trò
          </TabsTrigger>
          <TabsTrigger value="permissions" className="data-[state=active]:bg-[#81C784] data-[state=active]:text-white">
            <Key className="w-4 h-4 mr-2" />
            Quyền hạn
          </TabsTrigger>
        </TabsList>

        {/* Tab Người dùng */}
        <TabsContent value="users" className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm người dùng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4DD0E1]"
              >
                <option value="all">Tất cả vai trò</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
            <Dialog open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#001F54] hover:bg-[#001F54]/90">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Thêm người dùng
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Thêm người dùng mới</DialogTitle>
                  <DialogDescription>Tạo tài khoản admin/moderator mới</DialogDescription>
                </DialogHeader>
                <CreateUserForm />
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Danh sách Người dùng có Quyền</CardTitle>
              <CardDescription>Tổng cộng {filteredUsers.length} người dùng</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Người dùng</TableHead>
                    <TableHead>Vai trò</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Đăng nhập cuối</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={user.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="bg-[#4DD0E1] text-white">{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium flex items-center space-x-2">
                              <span>{user.name}</span>
                              {user.role === "Super Admin" && <Crown className="w-4 h-4 text-yellow-500" />}
                              {user.role === "Admin" && <Star className="w-4 h-4 text-blue-500" />}
                            </div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                            <div className="text-sm text-gray-500">{user.phone}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            user.role === "Super Admin"
                              ? "bg-red-500 text-white"
                              : user.role === "Admin"
                                ? "bg-blue-500 text-white"
                                : user.role === "Moderator"
                                  ? "bg-green-500 text-white"
                                  : user.role === "Sales Manager"
                                    ? "bg-orange-500 text-white"
                                    : "bg-purple-500 text-white"
                          }
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={user.status === "active" ? "default" : "secondary"}
                          className={user.status === "active" ? "bg-[#81C784] text-white" : ""}
                        >
                          {user.status === "active" ? "Hoạt động" : "Không hoạt động"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{user.lastLogin}</div>
                      </TableCell>
                      <TableCell>{user.createdDate}</TableCell>
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
                              <Key className="mr-2 h-4 w-4" />
                              Đổi quyền
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {user.status === "active" ? (
                              <DropdownMenuItem className="text-orange-600">
                                <Lock className="mr-2 h-4 w-4" />
                                Vô hiệu hóa
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem className="text-green-600">
                                <Unlock className="mr-2 h-4 w-4" />
                                Kích hoạt
                              </DropdownMenuItem>
                            )}
                            {user.role !== "Super Admin" && (
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Xóa tài khoản
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

        {/* Tab Vai trò */}
        <TabsContent value="roles" className="space-y-6">
          <div className="flex justify-end">
            <Dialog open={isCreateRoleOpen} onOpenChange={setIsCreateRoleOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#4DD0E1] hover:bg-[#4DD0E1]/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Tạo vai trò mới
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Tạo vai trò mới</DialogTitle>
                  <DialogDescription>Định nghĩa vai trò và quyền hạn mới</DialogDescription>
                </DialogHeader>
                <CreateRoleForm />
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((role) => (
              <Card key={role.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${role.color}`} />
                      <CardTitle className="text-lg">{role.name}</CardTitle>
                    </div>
                    <Badge variant="outline">Cấp {role.level}</Badge>
                  </div>
                  <CardDescription>{role.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Số người dùng:</span>
                      <span className="font-medium">{role.usersCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Số quyền:</span>
                      <span className="font-medium">
                        {role.permissions.includes("all") ? "Tất cả" : role.permissions.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Ngày tạo:</span>
                      <span className="font-medium">{role.createdDate}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="mr-2 h-3 w-3" />
                        Sửa
                      </Button>
                      {role.name !== "Super Admin" && (
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab Quyền hạn */}
        <TabsContent value="permissions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ma trận Quyền hạn</CardTitle>
              <CardDescription>Xem và quản lý quyền hạn theo vai trò</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-medium">Quyền hạn</th>
                      {roles.map((role) => (
                        <th key={role.id} className="text-center p-4 font-medium min-w-[120px]">
                          <div className="flex flex-col items-center space-y-1">
                            <div className={`w-3 h-3 rounded-full ${role.color}`} />
                            <span className="text-xs">{role.name}</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {availablePermissions.map((permission) => (
                      <tr key={permission.id} className="border-b hover:bg-gray-50">
                        <td className="p-4">
                          <div>
                            <div className="font-medium">{permission.name}</div>
                            <div className="text-sm text-gray-500">{permission.description}</div>
                          </div>
                        </td>
                        {roles.map((role) => (
                          <td key={`${role.id}-${permission.id}`} className="text-center p-4">
                            <Checkbox
                              checked={role.permissions.includes("all") || role.permissions.includes(permission.id)}
                              disabled={role.permissions.includes("all")}
                              className="mx-auto"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Nhật ký Phân quyền</CardTitle>
              <CardDescription>Lịch sử thay đổi quyền hạn</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <div>
                      <p className="font-medium">Cấp quyền Admin cho Trần Thị Manager</p>
                      <p className="text-sm text-gray-500">Bởi: Nguyễn Văn Admin</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">2 giờ trước</span>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                    <div>
                      <p className="font-medium">Thay đổi quyền cho vai trò Moderator</p>
                      <p className="text-sm text-gray-500">Bởi: Nguyễn Văn Admin</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">1 ngày trước</span>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    <div>
                      <p className="font-medium">Thu hồi quyền Admin của Lê Văn Test</p>
                      <p className="text-sm text-gray-500">Bởi: Nguyễn Văn Admin</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">3 ngày trước</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function CreateUserForm() {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="userName" className="text-right">
          Họ và tên
        </Label>
        <Input id="userName" placeholder="Nhập họ và tên" className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="userEmail" className="text-right">
          Email
        </Label>
        <Input id="userEmail" type="email" placeholder="email@example.com" className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="userPhone" className="text-right">
          Số điện thoại
        </Label>
        <Input id="userPhone" placeholder="0123456789" className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="userPassword" className="text-right">
          Mật khẩu
        </Label>
        <Input id="userPassword" type="password" placeholder="Mật khẩu tạm thời" className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="userRole" className="text-right">
          Vai trò
        </Label>
        <select className="col-span-3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4DD0E1]">
          {roles
            .filter((role) => role.name !== "Super Admin")
            .map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
        </select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right">Trạng thái</Label>
        <div className="col-span-3 flex items-center space-x-2">
          <Switch defaultChecked />
          <span className="text-sm">Hoạt động</span>
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" className="bg-[#001F54] hover:bg-[#001F54]/90">
          Tạo tài khoản
        </Button>
      </DialogFooter>
    </div>
  )
}

function CreateRoleForm() {
  return (
    <div className="grid gap-6 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="roleName" className="text-right">
          Tên vai trò
        </Label>
        <Input id="roleName" placeholder="Nhập tên vai trò" className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="roleDescription" className="text-right">
          Mô tả
        </Label>
        <Input id="roleDescription" placeholder="Mô tả vai trò" className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="roleLevel" className="text-right">
          Cấp độ
        </Label>
        <Input id="roleLevel" type="number" placeholder="1-10" className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-start gap-4">
        <Label className="text-right mt-2">Quyền hạn</Label>
        <div className="col-span-3 space-y-3 max-h-60 overflow-y-auto">
          {availablePermissions.map((permission) => (
            <div key={permission.id} className="flex items-center space-x-2">
              <Checkbox id={permission.id} />
              <div className="flex-1">
                <Label htmlFor={permission.id} className="font-medium">
                  {permission.name}
                </Label>
                <p className="text-sm text-gray-500">{permission.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" className="bg-[#4DD0E1] hover:bg-[#4DD0E1]/90">
          Tạo vai trò
        </Button>
      </DialogFooter>
    </div>
  )
}
