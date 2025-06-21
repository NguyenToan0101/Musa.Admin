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
import { Search, MoreHorizontal, Check, X, Lock, Eye, Trash2 } from "lucide-react"
import Image from "next/image"

const products = [
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    seller: "TechStore VN",
    category: "Điện thoại",
    price: "₫29,990,000",
    status: "pending",
    stock: 50,
    sold: 0,
    createdDate: "2024-03-20",
    image: "/placeholder.svg",
  },
  {
    id: 2,
    name: "Áo thun nam basic",
    seller: "Fashion Shop",
    category: "Thời trang",
    price: "₫199,000",
    status: "active",
    stock: 200,
    sold: 45,
    createdDate: "2024-03-15",
    image: "/placeholder.svg",
  },
  {
    id: 3,
    name: "Laptop Gaming ROG",
    seller: "Computer World",
    category: "Máy tính",
    price: "₫35,500,000",
    status: "locked",
    stock: 0,
    sold: 12,
    createdDate: "2024-03-10",
    image: "/placeholder.svg",
  },
  {
    id: 4,
    name: "Giày sneaker Nike",
    seller: "Shoe Paradise",
    category: "Giày dép",
    price: "₫2,890,000",
    status: "active",
    stock: 75,
    sold: 28,
    createdDate: "2024-03-05",
    image: "/placeholder.svg",
  },
]

export function ProductManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.seller.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || product.status === filterStatus
    const matchesCategory = filterCategory === "all" || product.category === filterCategory

    return matchesSearch && matchesStatus && matchesCategory
  })

  return (
    <div className="space-y-6">
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
              <option value="Điện thoại">Điện thoại</option>
              <option value="Thời trang">Thời trang</option>
              <option value="Máy tính">Máy tính</option>
              <option value="Giày dép">Giày dép</option>
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
                      {product.status === "active" ? "Đang bán" : product.status === "locked" ? "Bị khóa" : "Chờ duyệt"}
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
                        {product.status === "pending" && (
                          <>
                            <DropdownMenuItem className="text-green-600">
                              <Check className="mr-2 h-4 w-4" />
                              Duyệt sản phẩm
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <X className="mr-2 h-4 w-4" />
                              Từ chối
                            </DropdownMenuItem>
                          </>
                        )}
                        {product.status === "active" && (
                          <DropdownMenuItem className="text-red-600">
                            <Lock className="mr-2 h-4 w-4" />
                            Khóa sản phẩm
                          </DropdownMenuItem>
                        )}
                        {product.status === "locked" && (
                          <DropdownMenuItem className="text-green-600">
                            <Check className="mr-2 h-4 w-4" />
                            Mở khóa
                          </DropdownMenuItem>
                        )}
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
        </CardContent>
      </Card>
    </div>
  )
}
