"use client"

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
import { Search, MoreHorizontal, Check, X, Lock, Eye, Trash2, Store, Package } from "lucide-react"
import Image from "next/image"

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


  const products: any[] = [] // TODO: replace with fetched data

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


  const [shops, setShops] = useState([
    {
      id: 1,
      shopname: "TechZone",
      sellerid: { username: "techadmin" },
      businessAddress: "123 Lê Lợi, Hà Nội",
      createdat: "2024-03-10T00:00:00Z",
      invoiceEmail: "invoice@techzone.vn",
      phone: "0909000001",
      businessType: "Công ty TNHH",
      status: "PENDING_APPROVAL"
    },
    {
      id: 2,
      shopname: "Thời Trang Trẻ",
      sellerid: { username: "fashionqueen" },
      businessAddress: "99 Nguyễn Huệ, TP.HCM",
      createdat: "2024-02-05T00:00:00Z",
      invoiceEmail: "contact@thoitrangtre.vn",
      phone: "0909000002",
      businessType: "Hộ kinh doanh",
      status: "ACTIVE"
    },
    {
      id: 3,
      shopname: "Điện máy xanh",
      sellerid: { username: "dienmayboss" },
      businessAddress: "1A Cách Mạng Tháng 8, Cần Thơ",
      createdat: "2024-01-01T00:00:00Z",
      invoiceEmail: "sales@dienmayxanh.vn",
      phone: "0909000003",
      businessType: "Doanh nghiệp tư nhân",
      status: "LOCK"
    }
  ])

  const filteredShops = shops
  .filter((shop) => {
    const matchStatus = shopStatusFilter === "all" || shop.status === shopStatusFilter
    const matchBusinessType = businessTypeFilter === "all" || shop.businessType === businessTypeFilter
    const searchMatch =
      shop.shopname.toLowerCase().includes(shopSearch.toLowerCase()) ||
      shop.sellerid?.username.toLowerCase().includes(shopSearch.toLowerCase())
    return matchStatus && matchBusinessType && searchMatch
  })
  .sort((a, b) => {
    const dateA = new Date(a.createdat).getTime()
    const dateB = new Date(b.createdat).getTime()
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA
  })


  




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
                    <TableRow key={shop.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-[#4DD0E1] flex items-center justify-center text-white font-bold">
                            {shop.shopname.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium">{shop.shopname}</div>
                            <div className="text-sm text-gray-500">{shop.invoiceEmail}</div>
                            <div className="text-sm text-gray-500">{shop.phone}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{shop.sellerid?.username}</TableCell>
                      <TableCell>{shop.businessAddress}</TableCell>
                      <TableCell>{shop.businessType}</TableCell>
                      <TableCell>{formatDate(shop.createdat)}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            shop.status === "ACTIVE"
                              ? "bg-[#81C784] text-white"
                              : shop.status === "PENDING_APPROVAL"
                                ? "bg-yellow-500 text-white"
                                : "bg-red-500 text-white"
                          }
                        >
                          {shop.status === "ACTIVE"
                            ? "Hoạt động"
                            : shop.status === "LOCK"
                              ? "Bị khóa"
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
                            <DropdownMenuItem>
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
                              <Trash2 className="mr-2 h-4 w-4" />
                              Xóa sản phẩm
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
