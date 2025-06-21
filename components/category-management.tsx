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
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  MoreHorizontal,
  Plus,
  Edit,
  Trash2,
  Eye,
  FolderOpen,
  FileText,
  ImageIcon,
  Settings,
  Save,
  Upload,
  Download,
  Copy,
  Move,
  Archive,
} from "lucide-react"

// Dữ liệu mẫu cho danh mục
const categories = [
  {
    id: "CAT001",
    name: "Điện tử",
    slug: "dien-tu",
    description: "Các sản phẩm điện tử, công nghệ",
    parentId: null,
    level: 0,
    status: "active",
    productsCount: 1250,
    image: "/placeholder.svg",
    seoTitle: "Điện tử - Công nghệ hàng đầu",
    seoDescription: "Khám phá các sản phẩm điện tử, công nghệ mới nhất",
    sortOrder: 1,
    createdDate: "2024-01-15",
  },
  {
    id: "CAT002",
    name: "Điện thoại",
    slug: "dien-thoai",
    description: "Smartphone, điện thoại di động",
    parentId: "CAT001",
    level: 1,
    status: "active",
    productsCount: 450,
    image: "/placeholder.svg",
    seoTitle: "Điện thoại - Smartphone chính hãng",
    seoDescription: "Điện thoại thông minh giá tốt, chính hãng",
    sortOrder: 1,
    createdDate: "2024-01-16",
  },
  {
    id: "CAT003",
    name: "Laptop",
    slug: "laptop",
    description: "Máy tính xách tay, laptop gaming",
    parentId: "CAT001",
    level: 1,
    status: "active",
    productsCount: 320,
    image: "/placeholder.svg",
    seoTitle: "Laptop - Máy tính xách tay",
    seoDescription: "Laptop gaming, văn phòng giá tốt",
    sortOrder: 2,
    createdDate: "2024-01-17",
  },
  {
    id: "CAT004",
    name: "Thời trang",
    slug: "thoi-trang",
    description: "Quần áo, phụ kiện thời trang",
    parentId: null,
    level: 0,
    status: "active",
    productsCount: 2800,
    image: "/placeholder.svg",
    seoTitle: "Thời trang - Xu hướng mới nhất",
    seoDescription: "Thời trang nam nữ, phụ kiện đa dạng",
    sortOrder: 2,
    createdDate: "2024-01-18",
  },
  {
    id: "CAT005",
    name: "Giày dép",
    slug: "giay-dep",
    description: "Giày thể thao, sandal, boot",
    parentId: "CAT004",
    level: 1,
    status: "inactive",
    productsCount: 180,
    image: "/placeholder.svg",
    seoTitle: "Giày dép - Phong cách thời trang",
    seoDescription: "Giày thể thao, sandal, boot chất lượng",
    sortOrder: 1,
    createdDate: "2024-01-19",
  },
]

// Dữ liệu mẫu cho nội dung
const contents = [
  {
    id: "CONTENT001",
    title: "Chính sách bảo hành",
    slug: "chinh-sach-bao-hanh",
    type: "policy",
    status: "published",
    author: "Admin",
    createdDate: "2024-01-15",
    updatedDate: "2024-03-10",
    views: 1250,
  },
  {
    id: "CONTENT002",
    title: "Hướng dẫn đổi trả",
    slug: "huong-dan-doi-tra",
    type: "guide",
    status: "published",
    author: "Admin",
    createdDate: "2024-01-20",
    updatedDate: "2024-02-15",
    views: 890,
  },
  {
    id: "CONTENT003",
    title: "Điều khoản sử dụng",
    slug: "dieu-khoan-su-dung",
    type: "policy",
    status: "draft",
    author: "Admin",
    createdDate: "2024-03-01",
    updatedDate: "2024-03-15",
    views: 0,
  },
  {
    id: "CONTENT004",
    title: "Chính sách vận chuyển",
    slug: "chinh-sach-van-chuyen",
    type: "policy",
    status: "published",
    author: "Admin",
    createdDate: "2024-02-01",
    updatedDate: "2024-03-05",
    views: 650,
  },
]

export function CategoryManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false)
  const [isCreateContentOpen, setIsCreateContentOpen] = useState(false)

  const filteredCategories = categories.filter((category) => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || category.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const filteredContents = contents.filter((content) => {
    const matchesSearch = content.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || content.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#001F54] to-[#4DD0E1] bg-clip-text text-transparent">
            Quản lý Danh mục & Nội dung
          </h1>
          <p className="text-gray-500 mt-1">Quản lý danh mục sản phẩm và nội dung website</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-[#81C784] text-white">
            {categories.filter((c) => c.status === "active").length} danh mục hoạt động
          </Badge>
          <Badge className="bg-[#4DD0E1] text-white">
            {contents.filter((c) => c.status === "published").length} nội dung đã xuất bản
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="categories" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-white shadow-lg">
          <TabsTrigger value="categories" className="data-[state=active]:bg-[#001F54] data-[state=active]:text-white">
            <FolderOpen className="w-4 h-4 mr-2" />
            Danh mục
          </TabsTrigger>
          <TabsTrigger value="content" className="data-[state=active]:bg-[#4DD0E1] data-[state=active]:text-white">
            <FileText className="w-4 h-4 mr-2" />
            Nội dung
          </TabsTrigger>
          <TabsTrigger value="seo" className="data-[state=active]:bg-[#81C784] data-[state=active]:text-white">
            <Settings className="w-4 h-4 mr-2" />
            SEO
          </TabsTrigger>
        </TabsList>

        {/* Tab Danh mục */}
        <TabsContent value="categories" className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm danh mục..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4DD0E1]"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Không hoạt động</option>
              </select>
            </div>
            <Dialog open={isCreateCategoryOpen} onOpenChange={setIsCreateCategoryOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#001F54] hover:bg-[#001F54]/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm danh mục
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Tạo danh mục mới</DialogTitle>
                  <DialogDescription>Thêm danh mục sản phẩm mới vào hệ thống</DialogDescription>
                </DialogHeader>
                <CreateCategoryForm />
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Danh sách Danh mục</CardTitle>
              <CardDescription>Tổng cộng {filteredCategories.length} danh mục</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Danh mục</TableHead>
                    <TableHead>Cấp độ</TableHead>
                    <TableHead>Sản phẩm</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Thứ tự</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <ImageIcon
                            src={category.image || "/placeholder.svg"}
                            alt={category.name}
                            width={40}
                            height={40}
                            className="rounded-lg object-cover"
                          />
                          <div>
                            <div className="font-medium" style={{ paddingLeft: `${category.level * 20}px` }}>
                              {category.level > 0 && "└─ "}
                              {category.name}
                            </div>
                            <div className="text-sm text-gray-500">{category.slug}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">Cấp {category.level + 1}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{category.productsCount}</div>
                        <div className="text-sm text-gray-500">sản phẩm</div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={category.status === "active" ? "default" : "secondary"}
                          className={category.status === "active" ? "bg-[#81C784] text-white" : ""}
                        >
                          {category.status === "active" ? "Hoạt động" : "Không hoạt động"}
                        </Badge>
                      </TableCell>
                      <TableCell>{category.sortOrder}</TableCell>
                      <TableCell>{category.createdDate}</TableCell>
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
                              <Copy className="mr-2 h-4 w-4" />
                              Sao chép
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Move className="mr-2 h-4 w-4" />
                              Di chuyển
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Archive className="mr-2 h-4 w-4" />
                              Lưu trữ
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Xóa
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
        </TabsContent>

        {/* Tab Nội dung */}
        <TabsContent value="content" className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm nội dung..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4DD0E1]"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="published">Đã xuất bản</option>
                <option value="draft">Bản nháp</option>
                <option value="archived">Lưu trữ</option>
              </select>
            </div>
            <Dialog open={isCreateContentOpen} onOpenChange={setIsCreateContentOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#4DD0E1] hover:bg-[#4DD0E1]/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm nội dung
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Tạo nội dung mới</DialogTitle>
                  <DialogDescription>Thêm trang nội dung hoặc chính sách mới</DialogDescription>
                </DialogHeader>
                <CreateContentForm />
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Danh sách Nội dung</CardTitle>
              <CardDescription>Tổng cộng {filteredContents.length} trang nội dung</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tiêu đề</TableHead>
                    <TableHead>Loại</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Tác giả</TableHead>
                    <TableHead>Lượt xem</TableHead>
                    <TableHead>Cập nhật</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContents.map((content) => (
                    <TableRow key={content.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{content.title}</div>
                          <div className="text-sm text-gray-500">{content.slug}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {content.type === "policy" ? "Chính sách" : content.type === "guide" ? "Hướng dẫn" : "Khác"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={content.status === "published" ? "default" : "secondary"}
                          className={
                            content.status === "published"
                              ? "bg-[#81C784] text-white"
                              : content.status === "draft"
                                ? "bg-yellow-500 text-white"
                                : ""
                          }
                        >
                          {content.status === "published"
                            ? "Đã xuất bản"
                            : content.status === "draft"
                              ? "Bản nháp"
                              : "Lưu trữ"}
                        </Badge>
                      </TableCell>
                      <TableCell>{content.author}</TableCell>
                      <TableCell>
                        <div className="font-medium">{content.views}</div>
                        <div className="text-sm text-gray-500">lượt xem</div>
                      </TableCell>
                      <TableCell>{content.updatedDate}</TableCell>
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
                              Xem trước
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="mr-2 h-4 w-4" />
                              Sao chép
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {content.status === "draft" && (
                              <DropdownMenuItem className="text-green-600">
                                <Upload className="mr-2 h-4 w-4" />
                                Xuất bản
                              </DropdownMenuItem>
                            )}
                            {content.status === "published" && (
                              <DropdownMenuItem className="text-yellow-600">
                                <Archive className="mr-2 h-4 w-4" />
                                Lưu trữ
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Xóa
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
        </TabsContent>

        {/* Tab SEO */}
        <TabsContent value="seo" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Cài đặt SEO Chung</CardTitle>
                <CardDescription>Cấu hình SEO cho toàn bộ website</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="siteTitle">Tiêu đề website</Label>
                  <Input id="siteTitle" defaultValue="E-Commerce Platform - Mua sắm trực tuyến" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Mô tả website</Label>
                  <Textarea
                    id="siteDescription"
                    defaultValue="Nền tảng thương mại điện tử hàng đầu với hàng triệu sản phẩm chất lượng"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteKeywords">Từ khóa chính</Label>
                  <Input id="siteKeywords" defaultValue="ecommerce, mua sắm, online, việt nam" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Sitemap tự động</Label>
                    <p className="text-sm text-gray-500">Tự động tạo sitemap.xml</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Robots.txt</Label>
                    <p className="text-sm text-gray-500">Tự động tạo robots.txt</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Phân tích SEO</CardTitle>
                <CardDescription>Thống kê và phân tích SEO</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Trang được index</p>
                    <p className="text-sm text-gray-500">Google Search Console</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[#001F54]">1,245</div>
                    <div className="text-sm text-[#81C784]">+12% tuần này</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Từ khóa xếp hạng</p>
                    <p className="text-sm text-gray-500">Top 10 Google</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[#001F54]">89</div>
                    <div className="text-sm text-[#81C784]">+5 từ khóa mới</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Lưu lượng organic</p>
                    <p className="text-sm text-gray-500">Tháng này</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[#001F54]">15,678</div>
                    <div className="text-sm text-[#81C784]">+8.5% so với tháng trước</div>
                  </div>
                </div>
                <Button className="w-full" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Xuất báo cáo SEO
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Cấu hình Meta Tags</CardTitle>
              <CardDescription>Quản lý meta tags cho các trang quan trọng</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Trang</Label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4DD0E1]">
                      <option>Trang chủ</option>
                      <option>Danh mục sản phẩm</option>
                      <option>Chi tiết sản phẩm</option>
                      <option>Giỏ hàng</option>
                      <option>Thanh toán</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="metaTitle">Meta Title</Label>
                    <Input id="metaTitle" placeholder="Nhập meta title..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="metaKeywords">Meta Keywords</Label>
                    <Input id="metaKeywords" placeholder="Nhập từ khóa..." />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea id="metaDescription" placeholder="Nhập mô tả..." rows={3} />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline">Xem trước</Button>
                  <Button className="bg-[#81C784] hover:bg-[#81C784]/90">
                    <Save className="mr-2 h-4 w-4" />
                    Lưu cấu hình
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function CreateCategoryForm() {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="categoryName" className="text-right">
          Tên danh mục
        </Label>
        <Input id="categoryName" placeholder="Nhập tên danh mục" className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="categorySlug" className="text-right">
          Slug
        </Label>
        <Input id="categorySlug" placeholder="ten-danh-muc" className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="parentCategory" className="text-right">
          Danh mục cha
        </Label>
        <select className="col-span-3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4DD0E1]">
          <option value="">Không có (Danh mục gốc)</option>
          <option value="CAT001">Điện tử</option>
          <option value="CAT004">Thời trang</option>
        </select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="categoryDescription" className="text-right">
          Mô tả
        </Label>
        <Textarea id="categoryDescription" placeholder="Mô tả danh mục" className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="categoryImage" className="text-right">
          Hình ảnh
        </Label>
        <div className="col-span-3">
          <Button variant="outline" className="w-full">
            <Upload className="mr-2 h-4 w-4" />
            Tải lên hình ảnh
          </Button>
        </div>
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
          Tạo danh mục
        </Button>
      </DialogFooter>
    </div>
  )
}

function CreateContentForm() {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="contentTitle" className="text-right">
          Tiêu đề
        </Label>
        <Input id="contentTitle" placeholder="Nhập tiêu đề" className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="contentSlug" className="text-right">
          Slug
        </Label>
        <Input id="contentSlug" placeholder="tieu-de-noi-dung" className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="contentType" className="text-right">
          Loại nội dung
        </Label>
        <select className="col-span-3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4DD0E1]">
          <option value="policy">Chính sách</option>
          <option value="guide">Hướng dẫn</option>
          <option value="page">Trang thông tin</option>
          <option value="news">Tin tức</option>
        </select>
      </div>
      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="contentBody" className="text-right mt-2">
          Nội dung
        </Label>
        <Textarea id="contentBody" placeholder="Nhập nội dung..." className="col-span-3" rows={10} />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="seoTitle" className="text-right">
          SEO Title
        </Label>
        <Input id="seoTitle" placeholder="Tiêu đề SEO" className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="seoDescription" className="text-right">
          SEO Description
        </Label>
        <Textarea id="seoDescription" placeholder="Mô tả SEO" className="col-span-3" rows={3} />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right">Trạng thái</Label>
        <div className="col-span-3">
          <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4DD0E1]">
            <option value="draft">Bản nháp</option>
            <option value="published">Xuất bản</option>
          </select>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline">Lưu nháp</Button>
        <Button type="submit" className="bg-[#4DD0E1] hover:bg-[#4DD0E1]/90">
          Tạo nội dung
        </Button>
      </DialogFooter>
    </div>
  )
}
