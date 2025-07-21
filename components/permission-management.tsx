"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  MoreHorizontal,
  Users as UsersIcon,
  Key,
  Edit,
  Lock as LockIcon,
  Unlock as UnlockIcon,
  Trash2,
} from "lucide-react"

interface AdminUser {
  adminid: number
  fullname: string
  email: string
  phone: string
  role: string
  status: string
  lastLogin: string
  createdAt: string
}

const ALL_TABS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "analytics", label: "Thống kê & Báo cáo" },
  { id: "permissions", label: "Quản lý Quyền" },
  { id: "users", label: "Quản lý Người dùng" },
  { id: "products", label: "Quản lý Shop & Sản phẩm" },
  { id: "orders", label: "Đơn hàng & Vận chuyển" },
  { id: "categories", label: "Danh mục & Nội dung" },
  { id: "promotions", label: "Khuyến mãi" },
  { id: "complaints", label: "Khiếu nại & Phản hồi" },
  { id: "messages", label: "Trung tâm Tin nhắn" },
  { id: "settings", label: "Cài đặt Hệ thống" },
]

function formatDate(dateString: string): string {
  const d = new Date(dateString)
  const hh = String(d.getHours()).padStart(2, "0")
  const mm = String(d.getMinutes()).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")
  const mo = String(d.getMonth() + 1).padStart(2, "0")
  const yy = d.getFullYear()
  return `${hh}:${mm} ${dd}/${mo}/${yy}`
}

export function PermissionManagement() {
  const api = process.env.NEXT_PUBLIC_API_BACKEND!

  const [admins, setAdmins] = useState<AdminUser[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [openCreate, setOpenCreate] = useState(false)
  const [newMod, setNewMod] = useState({
    fullname: "",
    email: "",
    phone: "",
    password: "",
  })

  const [activeTab, setActiveTab] = useState<"users" | "permissions">("users")
  const [selectedForPerm, setSelectedForPerm] = useState<number | null>(null)
  const [allowedTabs, setAllowedTabs] = useState<string[]>([])

  // load list of mods
  useEffect(() => {
    setLoading(true)
    axios
      .get<AdminUser[]>(`${api}/api/admin/admins`)
      .then(res =>
        setAdmins(res.data.filter(u => u.adminid !== 1))
      )
      .catch(() => setError("Không tải được danh sách"))
      .finally(() => setLoading(false))
  }, [api])

  // load permissions when switching to permissions tab
  useEffect(() => {
    if (activeTab === "permissions" && selectedForPerm) {
      axios
        .get<string[]>(
          `${api}/api/admin/permissions/${selectedForPerm}`
        )
        .then(res => setAllowedTabs(res.data))
        .catch(() => setAllowedTabs([]))
    }
  }, [activeTab, selectedForPerm, api])

  const filteredAdmins = admins.filter(u =>
    u.fullname.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.phone.includes(search)
  )

  // create new mod
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await axios.post<AdminUser>(
        `${api}/api/admin/admins`,
        newMod
      )
      setAdmins(prev => [...prev, res.data])
      setOpenCreate(false)
      setNewMod({ fullname: "", email: "", phone: "", password: "" })
    } catch {
      alert("Tạo Mod thất bại")
    }
  }

  // lock/unlock
  const toggleLock = async (id: number, lock: boolean) => {
    try {
      if (lock) {
        await axios.put(`${api}/api/admin/admins/${id}/lock`)
      } else {
        await axios.put(`${api}/api/admin/admins/${id}/unlock`)
      }
      setAdmins(prev =>
        prev.map(u =>
          u.adminid === id ? { ...u, status: lock ? "locked" : "active" } : u
        )
      )
    } catch {
      alert(lock ? "Khóa Mod thất bại" : "Mở khóa Mod thất bại")
    }
  }

  // delete mod
  const handleDeleteMod = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa Mod này?")) return
    try {
      await axios.delete(`${api}/api/admin/admins/${id}`)
      setAdmins(prev => prev.filter(u => u.adminid !== id))
    } catch {
      alert("Xóa Mod thất bại")
    }
  }

  return (
    <div className="space-y-6">
      {/* Header & Thêm Mod */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quản lý Mod</h1>
        <div className="flex items-center space-x-4">
          <Input
            placeholder="Tìm kiếm..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-64"
          />
          <Dialog open={openCreate} onOpenChange={setOpenCreate}>
            <DialogTrigger asChild>
              <Button>Thêm Mod</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tạo Mod mới</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4">
                <Input
                  required
                  placeholder="Họ và tên"
                  value={newMod.fullname}
                  onChange={e =>
                    setNewMod({ ...newMod, fullname: e.target.value })
                  }
                />
                <Input
                  type="email"
                  required
                  placeholder="Email"
                  value={newMod.email}
                  onChange={e =>
                    setNewMod({ ...newMod, email: e.target.value })
                  }
                />
                <Input
                  required
                  placeholder="Điện thoại"
                  value={newMod.phone}
                  onChange={e =>
                    setNewMod({ ...newMod, phone: e.target.value })
                  }
                />
                <Input
                  type="password"
                  required
                  placeholder="Mật khẩu tạm thời"
                  value={newMod.password}
                  onChange={e =>
                    setNewMod({ ...newMod, password: e.target.value })
                  }
                />
                <DialogFooter>
                  <Button type="submit">Tạo</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={val =>
          setActiveTab(val as "users" | "permissions")
        }
      >
        <TabsList className="grid w-full grid-cols-2 bg-white shadow-md rounded-md">
          <TabsTrigger
            value="users"
            className="data-[state=active]:bg-[#001F54] data-[state=active]:text-white"
          >
            <UsersIcon className="inline mr-2" /> Người dùng
          </TabsTrigger>
          <TabsTrigger
            value="permissions"
            className="data-[state=active]:bg-[#4DD0E1] data-[state=active]:text-white"
          >
            <Key className="inline mr-2" /> Quyền hạn
          </TabsTrigger>
        </TabsList>

        {/* Danh sách Mods */}
        <TabsContent value="users">
          {loading ? (
            <div>Đang tải…</div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Danh sách Mod</CardTitle>
                <CardDescription>
                  Tổng {filteredAdmins.length} tài khoản
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Họ & tên</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Điện thoại</TableHead>
                      <TableHead>Quyền</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Đăng nhập cuối</TableHead>
                      <TableHead>Ngày tạo</TableHead>
                      <TableHead className="text-right">
                        Hành động
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAdmins.map(u => (
                      <TableRow key={u.adminid}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Avatar>
                              <AvatarFallback>
                                {u.fullname.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            {u.fullname}
                          </div>
                        </TableCell>
                        <TableCell>{u.email}</TableCell>
                        <TableCell>{u.phone}</TableCell>
                        <TableCell>
                          <Badge>{u.role}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              u.status === "active"
                                ? "default"
                                : "destructive"
                            }
                          >
                            {u.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(u.lastLogin)}</TableCell>
                        <TableCell>{formatDate(u.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-8 w-8 p-0"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>
                                Hành động
                              </DropdownMenuLabel>

                              {u.status === "active" ? (
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() =>
                                    toggleLock(u.adminid, true)
                                  }
                                >
                                  <LockIcon className="mr-2 h-4 w-4" />
                                  Khóa Mod
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  className="text-green-600"
                                  onClick={() =>
                                    toggleLock(u.adminid, false)
                                  }
                                >
                                  <UnlockIcon className="mr-2 h-4 w-4" />
                                  Mở khóa Mod
                                </DropdownMenuItem>
                              )}

                              <DropdownMenuSeparator />

                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedForPerm(u.adminid)
                                  setActiveTab("permissions")
                                }}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Phân quyền
                              </DropdownMenuItem>

                              <DropdownMenuSeparator />

                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() =>
                                  handleDeleteMod(u.adminid)
                                }
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Xóa Mod
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
          )}
        </TabsContent>

        {/* Phân quyền */}
        <TabsContent value="permissions">
          {!selectedForPerm ? (
            <div className="p-4 text-gray-600">
              Chọn một Mod ở tab “Người dùng” để phân quyền
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>
                  Phân quyền Mod #{selectedForPerm}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {ALL_TABS.map(tab => (
                  <div
                    key={tab.id}
                    className="flex items-center"
                  >
                    <input
                      id={tab.id}
                      type="checkbox"
                      checked={allowedTabs.includes(tab.id)}
                      onChange={() => {
                        setAllowedTabs(prev =>
                          prev.includes(tab.id)
                            ? prev.filter(t => t !== tab.id)
                            : [...prev, tab.id]
                        )
                      }}
                      className="mr-2"
                    />
                    <label htmlFor={tab.id}>
                      {tab.label}
                    </label>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() =>
                    axios
                      .put<string[]>(
                        `${api}/api/admin/permissions/${selectedForPerm}`,
                        allowedTabs
                      )
                      .then(res => {
                        setAllowedTabs(res.data)
                        alert("Lưu thành công!")
                      })
                      .catch(() => alert("Lưu thất bại!"))
                  }
                >
                  Lưu thay đổi
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
