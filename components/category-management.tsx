
"use client"
import { format } from "date-fns"
import axios from "axios"
import { useState, useEffect } from "react"
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
  Upload,
  Copy,
  Move,
  Archive,
} from "lucide-react"

interface Content {
  contentId: number
  title: string
  slug: string
  status: string
  type: string
  author: string
  updatedDate: string
}

export function CategoryManagement() {
  // Tabs: Nội dung
  const [contentSearchTerm, setContentSearchTerm] = useState("")
  const [contentFilterStatus, setContentFilterStatus] = useState("all")
  const [contents, setContents] = useState<Content[]>([])

  // Tabs: Danh mục
  const [categorySearchTerm, setCategorySearchTerm] = useState("")
  const [categoryFilterStatus, setCategoryFilterStatus] = useState("all")

  const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false)
  const [isCreateContentOpen, setIsCreateContentOpen] = useState(false)



  useEffect(() => {
    const fetchContents = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BACKEND}/admin/contents`, {
          params: {
            status: contentFilterStatus,
            keyword: contentSearchTerm
          }
        })

        const formatted: Content[] = res.data.map((c: any) => ({
          contentId: c.contentId,
          title: c.title,
          slug: c.slug,
          type: c.type,
          status: c.status,
          author: c.author,
          updatedDate: format(new Date(c.updatedAt), "HH:mm dd/MM/yyyy") // Format ở đây
        }))

        setContents(formatted)
      } catch (err) {
        console.error("Lỗi khi tải danh sách nội dung:", err)
      }
    }

    fetchContents()
  }, [contentSearchTerm, contentFilterStatus])



  const filteredContents = contents.filter((content) => {
    const matchesStatus =
      contentFilterStatus === "all" || content.status === contentFilterStatus
    const matchesKeyword =
      contentSearchTerm === "" ||
      content.title.toLowerCase().includes(contentSearchTerm.toLowerCase()) ||
      content.slug.toLowerCase().includes(contentSearchTerm.toLowerCase())

    return matchesStatus && matchesKeyword
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
            {contents.filter((c) => c.status === "published").length} nội dung đã xuất bản
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="categories" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-white shadow-md rounded-md">
          <TabsTrigger value="categories" className="data-[state=active]:bg-[#001F54] data-[state=active]:text-white">
            <FolderOpen className="w-4 h-4 mr-2" />
            Danh mục
          </TabsTrigger>
          <TabsTrigger value="content" className="data-[state=active]:bg-[#4DD0E1] data-[state=active]:text-white">
            <FileText className="w-4 h-4 mr-2" />
            Nội dung
          </TabsTrigger>

        </TabsList>


        {/* Tab Nội dung */}
        <TabsContent value="content" className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm nội dung..."
                  value={contentSearchTerm}
                  onChange={(e) => setContentSearchTerm(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
              <select
                value={contentFilterStatus}
                onChange={(e) => setContentFilterStatus(e.target.value)}
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
                    <TableHead className="w-1/4">Tiêu đề</TableHead>
                    <TableHead className="w-1/6">Loại</TableHead>
                    <TableHead className="w-1/6">Trạng thái</TableHead>
                    <TableHead className="w-1/6">Tác giả</TableHead>
                    <TableHead className="w-1/4">Cập nhật</TableHead>
                    <TableHead className="w-[40px] text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContents.map((content) => (
                    <TableRow key={content.contentId}>
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

      </Tabs>
    </div>
  )
}




function CreateContentForm({ onSuccess }: { onSuccess?: () => void }) {
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [type, setType] = useState("policy")
  const [body, setBody] = useState("")
  const [status, setStatus] = useState("draft")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_BACKEND}/admin/contents`, {
        title,
        slug,
        type,
        body,
        status,
        adminId: 1
      })

      if (onSuccess) onSuccess()
      alert("✅ Tạo nội dung thành công")
    } catch (error) {
      console.error("Lỗi khi tạo nội dung:", error)
      alert(" Đã xảy ra lỗi khi tạo nội dung")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="contentTitle" className="text-right">Tiêu đề</Label>
        <Input id="contentTitle" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="contentSlug" className="text-right">Slug</Label>
        <Input id="contentSlug" value={slug} onChange={(e) => setSlug(e.target.value)} className="col-span-3" />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="contentType" className="text-right">Loại nội dung</Label>
        <select value={type} onChange={(e) => setType(e.target.value)} className="col-span-3 px-3 py-2 border rounded-md">
          <option value="policy">Chính sách</option>
          <option value="guide">Hướng dẫn</option>
          <option value="news">Tin tức</option>
        </select>
      </div>

      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="contentBody" className="text-right mt-2">Nội dung</Label>
        <Textarea id="contentBody" value={body} onChange={(e) => setBody(e.target.value)} className="col-span-3" rows={8} />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right">Trạng thái</Label>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="col-span-3 px-3 py-2 border rounded-md">
          <option value="draft">Bản nháp</option>
          <option value="published">Xuất bản</option>
        </select>
      </div>

      <DialogFooter>
        <Button
          variant="outline"
          type="button"
          onClick={(e) => {
            setStatus("draft")
            setTimeout(() => handleSubmit(e), 0) // delay 1 tick để chờ state cập nhật
          }}
        >
          Lưu 
        </Button>
      </DialogFooter>
    </form>
  )
}
