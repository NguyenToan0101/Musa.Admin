"use client"

type Shop = {
  shopId: number
  shopName: string
  manageName: string
  businessAddress: string
  createdAt: string
  status: string
  invoiceEmail?: string
  phone?: string
  businessType?: string
  locked: boolean
  lockedUntil?: string
}

type ShopDetailDTO = Shop & {
  description: string
  imageShop: string
  taxCode: string
  mainCategory: string
  customerEmail: string
  gender: string
  dob: string
  address: string
  idNumber: string
  frontIdImage: string
  backIdImage: string
  locked: boolean
  lockedUntil?: string
}

import { ShopDetailModal } from "@/components/ShopDetailModal"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Search, MoreHorizontal, Check, X, Lock, Unlock, Eye, Package, Store } from "lucide-react"

import Image from "next/image"

import axios from "axios"
import { useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog"
import DatePicker from "react-datepicker"



function formatDate(dateStr: string | Date) {
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}


export function ProductManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")
  const [lockUntil, setLockUntil] = useState<Date | null>(null)
  const [selectedShopToLock, setSelectedShopToLock] = useState<Shop | null>(null);
  const [showLockModal, setShowLockModal] = useState(false);
  const products: any[] = [] 

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.seller.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || product.status === filterStatus
    const matchesCategory = filterCategory === "all" || product.category === filterCategory
    return matchesSearch && matchesStatus && matchesCategory
  })

  const [shopStatusFilter, setShopStatusFilter] = useState("all")
  const [businessTypeFilter, setBusinessTypeFilter] = useState("all")

  const [shopSearch, setShopSearch] = useState("")
  const [sortOrder, setSortOrder] = useState("desc") // hoặc "asc"

  const [shops, setShops] = useState<Shop[]>([
  ])

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_BACKEND}/admin/shops`)
      .then((res) => setShops(res.data))
      .catch((err) => console.error("Lỗi khi lấy danh sách shop:", err))
  }, [])




  const filteredShops = shops
    .filter((shop) => {
      const matchStatus = shopStatusFilter === "all" || shop.status === shopStatusFilter
      const matchBusinessType = businessTypeFilter === "all" || shop.businessType === businessTypeFilter
      const searchMatch =
        shop.shopName.toLowerCase().includes(shopSearch.toLowerCase()) ||
        shop.manageName?.toLowerCase().includes(shopSearch.toLowerCase())
      return matchStatus && matchBusinessType && searchMatch
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA
    })

  const [selectedShop, setSelectedShop] = useState<ShopDetailDTO | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  function openDetail(shopId: number) {
    setIsDetailOpen(true)
    axios
      .get<ShopDetailDTO>(`${process.env.NEXT_PUBLIC_API_BACKEND}/admin/shops/${shopId}`)
      .then(res => setSelectedShop(res.data))
      .catch(() => setIsDetailOpen(false))
  }

  //ham phe duyet
  async function approveShop(shopId: number) {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BACKEND}/admin/shops/${shopId}/approve`
      );
      // Cập nhật trạng thái trên UI
      setShops(prev =>
        prev.map(s =>
          s.shopId === shopId ? { ...s, status: "ACTIVE" } : s
        )
      );
    } catch (err) {
      console.error("Lỗi phê duyệt shop:", err);
    }
  }


  //tu choi
  async function rejectShop(shopId: number) {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BACKEND}/admin/shops/${shopId}/reject`
      );
      setShops(prev =>
        prev.map(s =>
          s.shopId === shopId ? { ...s, status: "REJECTED" } : s
        )
      );
    } catch (err) {
      console.error("Lỗi từ chối shop:", err);
    }
  }

  //khoa shop
  const handleConfirmLockShop = async () => {
    if (!selectedShopToLock || !lockUntil) return;

    const now = new Date();
    const durationMinutes = Math.ceil((lockUntil.getTime() - now.getTime()) / (60 * 1000));

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BACKEND}/admin/shops/${selectedShopToLock.shopId}/lock`,
        { durationMinutes },
        { headers: { "Content-Type": "application/json" } }
      );
      // cập nhật UI
      setShops(prev =>
        prev.map(s =>
          s.shopId === selectedShopToLock!.shopId
            ? {
              ...s,
              status: "LOCK",
              locked: true,
              lockedUntil: lockUntil!.toISOString(),
            }
            : s
        )
      );

      setShowLockModal(false);
      setSelectedShopToLock(null);
      setLockUntil(null);

    } catch (error) {
      console.error("Lỗi khi khóa shop:", error);
      alert("Khóa shop thất bại.");
    }
  };

  //mo khoa
  async function handleUnlockShop(shopId: number) {
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_BACKEND}/admin/shops/${shopId}/unlock`);
      setShops(prev =>
        prev.map(s => s.shopId === shopId ? { ...s, locked: false, status: "ACTIVE" } : s)
      );
    } catch (err) {
      console.error("Lỗi khi mở khóa shop:", err);
      alert("Mở khóa shop thất bại.");
    }
  }

  function openLockModal(shop: Shop) {
    setSelectedShopToLock(shop);
    setShowLockModal(true);
  }

  function handleLockUntilChange(
    date: Date | Date[] | null,
    _?: React.SyntheticEvent<any>
  ) {
    // nếu nó là mảng (dạng range) thì bỏ qua
    if (Array.isArray(date) || date === null) return
    // còn lại là 1 Date thì set
    setLockUntil(date)
  }






  return (
    <Tabs defaultValue="shop" className="space-y-6">
      <TabsList className="grid w-full grid-cols-2 bg-white shadow-md rounded-md">
        <TabsTrigger value="shop" className="data-[state=active]:bg-[#001F54] data-[state=active]:text-white">
          <Store className="w-4 h-4 mr-2" />
          Shop
        </TabsTrigger>
        <TabsTrigger value="product" className="data-[state=active]:bg-[#4DD0E1] data-[state=active]:text-white">
          <Package className="w-4 h-4 mr-2" />
          Sản phẩm
        </TabsTrigger>
      </TabsList>

      {/* SHOP TAB */}
      <TabsContent value="shop">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-[#001F54]">Quản lý Shop</h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Danh sách Shop</CardTitle>
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
                {/* SEARCH */}
                <div className="relative w-full md:w-1/2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Tìm kiếm theo tên shop hoặc chủ shop..."
                    value={shopSearch}
                    onChange={(e) => setShopSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>


              </div>

              {/* <CardDescription>Hiển thị tất cả các shop trên hệ thống</CardDescription> */}
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <select
                  value={shopStatusFilter}
                  onChange={(e) => setShopStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001F54]"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="ACTIVE">Hoạt động</option>
                  <option value="PENDING_APPROVAL">Chờ duyệt</option>
                  <option value="REJECTED">Từ Chối</option>
                  <option value="LOCK">Bị khóa</option>
                </select>
                <select
                  value={businessTypeFilter}
                  onChange={(e) => setBusinessTypeFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001F54]"
                >
                  <option value="all">Tất cả loại hình</option>
                  <option value="Công ty TNHH">Công ty TNHH</option>
                  <option value="Hộ kinh doanh">Hộ kinh doanh</option>
                  <option value="Doanh nghiệp tư nhân">Doanh nghiệp tư nhân</option>
                </select>

                {/* SORT */}
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001F54]"
                >
                  <option value="desc">Mới nhất</option>
                  <option value="asc">Cũ nhất</option>
                </select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên shop</TableHead>
                    <TableHead>Chủ shop</TableHead>
                    <TableHead>Địa chỉ kinh doanh</TableHead>
                    <TableHead>Loại hình kinh doanh</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredShops.map((shop) => (
                    <TableRow key={shop.shopId}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-[#4DD0E1] flex items-center justify-center text-white font-bold">
                            {shop.shopName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium">{shop.shopName}</div>
                            <div className="text-sm text-gray-500">{shop.invoiceEmail}</div>
                            <div className="text-sm text-gray-500">{shop.phone}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{shop.manageName}</TableCell>
                      <TableCell>{shop.businessAddress}</TableCell>
                      <TableCell>{shop.businessType}</TableCell>
                      <TableCell>{formatDate(shop.createdAt)}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            shop.status === "ACTIVE"
                              ? "bg-[#81C784] text-white"
                              : shop.status === "PENDING_APPROVAL"
                                ? "bg-yellow-500 text-white"
                                : shop.status === "REJECTED"
                                  ? "bg-red-600 text-white"
                                  : "bg-red-500 text-white"
                          }
                        >
                          {shop.status === "ACTIVE"
                            ? "Hoạt động"
                            : shop.status === "LOCK"
                              ? "Bị khóa"
                              : shop.status === "REJECTED"
                                ? "Từ chối"
                                : "Chờ duyệt"}
                        </Badge>
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

                            {/* Khi đang chờ duyệt */}
                            {shop.status === "PENDING_APPROVAL" ? (
                              <>
                                <DropdownMenuItem onClick={() => approveShop(shop.shopId)}>
                                  <Check className="mr-2 text-green-600" />
                                  Phê duyệt
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => rejectShop(shop.shopId)}>
                                  <X className="mr-2 text-red-600" />
                                  Từ chối
                                </DropdownMenuItem>
                              </>
                            ) : shop.locked ? (
                              /* Khi đã bị khóa */
                              <DropdownMenuItem onClick={() => handleUnlockShop(shop.shopId)}>
                                <Unlock className="mr-2 text-green-600" />
                                Mở khóa shop
                              </DropdownMenuItem>
                            ) : (
                              /* Khi active bình thường */
                              <DropdownMenuItem onClick={() => openLockModal(shop)}>
                                <Lock className="mr-2 text-red-600" />
                                Khóa shop
                              </DropdownMenuItem>
                            )}

                            {/*  nút xem chi tiết */}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => openDetail(shop.shopId)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Xem chi tiết
                            </DropdownMenuItem>
                          </DropdownMenuContent>


                        </DropdownMenu>

                      </TableCell>
                    </TableRow>

                  ))}
                </TableBody>
              </Table>
              <ShopDetailModal
                shop={selectedShop}
                open={isDetailOpen}
                onOpenChange={setIsDetailOpen}
              />

              <Dialog open={showLockModal} onOpenChange={setShowLockModal}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Chọn thời gian khóa shop</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p>
                      Khóa shop <strong>{selectedShopToLock?.shopName}</strong> đến:
                    </p>
                    <DatePicker
                      selected={lockUntil}
                      onChange={handleLockUntilChange}
                      showTimeSelect
                      dateFormat="Pp"
                      className="w-full border px-2 py-1 rounded"
                    />

                    <Button
                      className="bg-red-600 text-white"
                      onClick={handleConfirmLockShop}
                      disabled={!lockUntil}
                    >
                      Xác nhận khóa
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

            </CardContent>
          </Card>
        </div>
      </TabsContent>


      {/* PRODUCT TAB */}
      <TabsContent value="product">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-[#001F54]">Quản lý Sản phẩm</h1>
          <div className="flex space-x-2">
            <Badge className="bg-yellow-500 text-white">
              {products.filter((p) => p.status === "pending").length} chờ duyệt
            </Badge>
            <Badge className="bg-red-500 text-white">
              {products.filter((p) => p.status === "locked").length} bị khóa
            </Badge>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Tìm kiếm & Lọc Sản phẩm</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm sản phẩm hoặc người bán..."
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
                <option value="active">Đang bán</option>
                <option value="pending">Chờ duyệt</option>
                <option value="locked">Bị khóa</option>
              </select>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4DD0E1]"
              >
                <option value="all">Tất cả danh mục</option>
                {/* TODO: danh mục thật */}
              </select>
            </div>
          </CardContent>
        </Card>



        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách Sản phẩm</CardTitle>
            <CardDescription>Tổng cộng {filteredProducts.length} sản phẩm</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredProducts.length === 0 ? (
              <div className="text-center text-gray-500 py-6">Không có sản phẩm nào.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sản phẩm</TableHead>
                    <TableHead>Người bán</TableHead>
                    <TableHead>Danh mục</TableHead>
                    <TableHead>Giá</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Kho/Đã bán</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            width={50}
                            height={50}
                            className="rounded-lg object-cover"
                          />
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-gray-500">ID: #{product.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{product.seller}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.category}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{product.price}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            product.status === "active"
                              ? "default"
                              : product.status === "locked"
                                ? "destructive"
                                : "secondary"
                          }
                          className={
                            product.status === "active"
                              ? "bg-[#81C784] text-white"
                              : product.status === "pending"
                                ? "bg-yellow-500 text-white"
                                : ""
                          }
                        >
                          {product.status === "active"
                            ? "Đang bán"
                            : product.status === "locked"
                              ? "Bị khóa"
                              : "Chờ duyệt"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>Kho: {product.stock}</div>
                          <div className="text-gray-500">Đã bán: {product.sold}</div>
                        </div>
                      </TableCell>
                      <TableCell>{product.createdDate}</TableCell>
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
                            {/* Tùy chọn theo status */}
                            <DropdownMenuItem className="text-red-600">
                              {/* <Trash2 className="mr-2 h-4 w-4" />
                              Xóa sản phẩm */}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
