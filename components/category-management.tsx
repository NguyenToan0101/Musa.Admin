
"use client"
import { format } from "date-fns"
import {useEffect, useState, useRef } from "react"
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
  Play,
  Pause,
} from "lucide-react"
import Image from 'next/image';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { CldUploadButton, CldUploadWidget } from 'next-cloudinary';
import { toast } from 'react-toastify';
import { X } from 'lucide-react';

import React from 'react';
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import ScaleLoader from 'react-spinners/ScaleLoader'
import axios from "axios"
interface CreateCategoryForm {
  nameRef: React.RefObject<HTMLInputElement | null>;
  parentIdRef: React.RefObject<HTMLSelectElement | null>;
  //  idRef : React.RefObject<HTMLInputElement | null>;
  // statusCategory: true;
  setStatusCategory: React.Dispatch<React.SetStateAction<boolean>>
  imageFile: File | null;
  setImage: React.Dispatch<React.SetStateAction<File | null>>;

  imagePreview: string | null;
  setImagePreview: React.Dispatch<React.SetStateAction<string | null>>;

  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleUploadClick: () => void;

  parentCategory: {
    id: number;
    categoryname: string;
    
  }[];

  handleSubmit: (e: React.FormEvent<HTMLFormElement>, statusUpdateOrAdd: "add" | "update") => void;
  possibleUpload: boolean
  setPossibleUpload: React.Dispatch<React.SetStateAction<boolean>>
}

interface Content {
  contentId: number
  title: string
  slug: string
  status: string
  type: string
  author: string
  updatedDate: string
}

interface ContentDetail {
  contentid: number
  title: string
  slug: string
  type: string
  status: string
  content: string
  author: string
  updatedDate: string
}
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



export function CategoryManagement() {
  // Tabs: Nội dung
  const [contentSearchTerm, setContentSearchTerm] = useState("")
  const [contentFilterStatus, setContentFilterStatus] = useState("all")
  const [contents, setContents] = useState<Content[]>([])

  // Tabs: Danh mục
  const [categorySearchTerm, setCategorySearchTerm] = useState("")
  const [categoryFilterStatus, setCategoryFilterStatus] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false)
  const [isCreateContentOpen, setIsCreateContentOpen] = useState(false)
const [expandedCateId, setExpandedCateId] = useState<number | null>(null);

  const [imageFile, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEdit, setIsEdit] = useState(false)
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const [possibleUpload, setPossibleUpload] = useState(true)
  const [totalPages, setTotalPages] = useState<number >(10)
  const [currentPage, setCurrentPage] = useState<number>(0)
   const [isLoading, setIsLoading] = useState(false);
  
   const [parentCategory,setParentCategories] = useState([
    {id: 1,
    categoryname: "Thời trang nam"}
   ])


  // Dữ liệu mẫu cho danh mục
  const [categories, setCategory] = useState([
    {
      id: 1,
      categoryname: "Điện tử",


      parentId: 0,
      level: 0,
      status: "ACTIVE",
      productsCount: 1250,
      image: null,

      createAt: "2024-01-15",
    },

    // {
    //   id: "CAT002",
    //   name: "Điện thoại",

    //   description: "Smartphone, điện thoại di động",
    //   parentId: "CAT001",
    //   level: 1,
    //   status: "active",
    //   productsCount: 450,
    //   image: "/placeholder.svg",

    //   createdDate: "2024-01-16",
    // },
    // {
    //   id: "CAT003",
    //   name: "Laptop",

    //   description: "Máy tính xách tay, laptop gaming",
    //   parentId: "CAT001",
    //   level: 1,
    //   status: "active",
    //   productsCount: 320,
    //   image: "/placeholder.svg",

    //   createdDate: "2024-01-17",
    // },
    // {
    //   id: "CAT004",
    //   name: "Thời trang",

    //   description: "Quần áo, phụ kiện thời trang",
    //   parentId: null,
    //   level: 0,
    //   status: "active",
    //   productsCount: 2800,
    //   image: "/placeholder.svg",

    //   createdDate: "2024-01-18",
    // },
    // {
    //   id: "CAT005",
    //   name: "Giày dép",

    //   description: "Giày thể thao, sandal, boot",
    //   parentId: "CAT004",
    //   level: 1,
    //   status: "inactive",
    //   productsCount: 180,
    //   image: "/placeholder.svg",

    //   createdDate: "2024-01-19",
    // },
  ])
 const filteredCategories = categories.filter((category) => {
    const matchesSearch = category.categoryname.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || category.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const filteredContents = contents.filter((content) => {
    const matchesStatus =
      contentFilterStatus === "all" || content.status === contentFilterStatus
    const matchesKeyword =
      contentSearchTerm === "" ||
      content.title.toLowerCase().includes(contentSearchTerm.toLowerCase()) ||
      content.slug.toLowerCase().includes(contentSearchTerm.toLowerCase())

    return matchesStatus && matchesKeyword
  })

  //xem trước
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [previewContent, setPreviewContent] = useState<{ title: string; content: string } | null>(null)

  const handlePreview = async (contentId: number) => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BACKEND}/admin/contents/${contentId}`)
      setPreviewContent({
        title: res.data.title,
        content: res.data.content
      })
      setIsPreviewOpen(true)
    } catch (err) {
      console.error("Lỗi khi load nội dung preview:", err)
    }
  }

  //update
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editData, setEditData] = useState<ContentDetail | null>(null)

  const handleEdit = async (id: number) => {
    try {
      const { data } = await axios.get<ContentDetail>(
        `${process.env.NEXT_PUBLIC_API_BACKEND}/admin/contents/${id}`
      )
      setEditData(data)
      setIsEditOpen(true)
    } catch (err) {
      console.error(err)
    }
  }

  //xóa
  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa nội dung này không?")) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_BACKEND}/admin/contents/${id}`);
      // reload danh sách
      fetchContents();
      alert("Đã xóa thành công");
    } catch (err) {
      console.error("Lỗi khi xóa:", err);
      alert("Xóa không thành công");
    }
  };

  //published
  const handlePublish = async (id: number) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BACKEND}/admin/contents/${id}/publish`,
        null,
        { params: { adminId: 1 } }  // hoặc lấy adminId động từ context/token
      );
      // reload lại danh sách
      fetchContents();
      alert("Đã xuất bản thành công");
    } catch (err) {
      console.error("Lỗi khi xuất bản:", err);
      alert("Xuất bản không thành công");
    }
  };


  //làm mới
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
        updatedDate: format(new Date(c.updatedAt), "HH:mm dd/MM/yyyy")
      }))

      setContents(formatted)
    } catch (err) {
      console.error("Lỗi khi tải danh sách nội dung:", err)
    }
  }



  useEffect(() => {
    fetchContents()
  }, [contentSearchTerm, contentFilterStatus])


  //lọc
 

  const fetchData = async (page : number, size = 10) => {
    setIsLoading(true)
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BACKEND}/category/data?page=${page}&&size=${size}`);
      if (res.data != null) {
        console.log('---------------', res.data)
        setCategory(res.data.content);
        setTotalPages(res.data.totalPages);
        // setCurrentPage(res.data.number);

      } else {
        
        console.error("ERROR: Not information get");
      }
    } catch (err) {
      console.error("API error:", err);
    }finally{
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if(currentPage != undefined && currentPage != null){
      console.log("Current page---------:", currentPage);
fetchData(currentPage);
    }
    
  }, [currentPage]);

const fetchParentCategories = async () => {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BACKEND}/category/parent-list`);
    if (res.data) {
      setParentCategories(res.data); 
    }
  } catch (err) {
    console.error("Lỗi khi lấy danh sách parent category:", err);
  }
};

useEffect(()=>{
  fetchParentCategories();
},[])

  const nameRef = useRef<HTMLInputElement>(null);
  const parentIdRef = useRef<HTMLSelectElement>(null);
  const idRef = useRef<HTMLInputElement>(null);
  const [statusCategory, setStatusCategory] = useState(false)
  const [statusActive, setStatusActive] = useState<string | null>("INACTIVE")
  const [imageDefault, setImageDefault] = useState<string |null>(null)
  // const imageRef = useRef<HTMLButtonElement>(null);
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    statusUpdateOrAdd: "add" | "update"
  ) => {
    e.preventDefault();

    if (
      !nameRef.current ||
      !parentIdRef.current


    ) {

      toast.error("Missing input values");
      return;
    }
    if (!statusCategory) {
      setStatusActive("ACTIVE")
    } else {
      setStatusActive("INACTIVE")
    }
    const payload = {
      id: expandedCateId,
      categoryname: nameRef.current.value,
      parentId: parentIdRef.current.value,

      status: statusActive,
      image: imageFile ? await convertFileToBase64(imageFile) : imageDefault
    };
    console.log('Test-------------------------', payload)
    
    try {


      await axios.post(`${process.env.NEXT_PUBLIC_API_BACKEND}/category/${statusUpdateOrAdd}`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      toast.success(statusUpdateOrAdd === "add" ? "Tạo thư mục thành công!" : "Cập nhật thư mục thành công!");
      setTimeout(() => {
        fetchData(currentPage);
      }, 1000);
      setIsEdit(false)
      setExpandedCateId(null);
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || "Đã có lỗi xảy ra.";
      toast.error(errorMsg);
    } 
  };


  const handlePauseCategory = async (id: number) => {

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BACKEND}/category/setStatusInactive`, {
        id,
        status: "INACTIVE",
      });
      console.log("Pause response:", res.data);
      toast.success("Lưu trữ danh mục thành công!");
      setTimeout(() => {
        fetchData(currentPage);
      }, 1000);
    } catch (error) {
      toast.error("Lưu trữ thất bại")
      console.error("Error pausing promotion:", error);
    }
  };
  const handleActivateCategory = async (id: number) => {

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BACKEND}/category/setStatusActive`, {
        id,
        status: "ACTIVE",
      });
      console.log("Activate response:", res.data);

      toast.success("Kích hoạt danh mục thành công!");


      // Reset the form and close the dialog
      setTimeout(() => {
        fetchData(currentPage);
      }, 1000);
    } catch (error) {
      toast.error("Kích hoạt thất bại")
      console.error("Error activating promotion:", error);
    }
  };
  const deleteCategory = async (id: number) => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BACKEND}/category/delete`, {
        id,
        status: "DELETE",
      });
      console.log("Activate response:", res.data);
      toast.success("Xóa danh mục thành công!");
      setTimeout(() => {
        fetchData(currentPage);
      }, 1000);
    } catch (error) {
      toast.error("Xóa thất bại")
      console.error("Error activating category:", error);
    }
  };
  // Utility function to convert File to base64
  // Helper function để convert file thành base64
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Loại bỏ prefix "data:image/...;base64," nếu cần
        // const base64 = result.split(',')[1];
        resolve(result);
      };
      reader.onerror = error => reject(error);
    });
  };

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [imagePreview])

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
                 <CreateCategoryForm
                  nameRef={nameRef}
                  parentIdRef={parentIdRef}
                  imageFile={imageFile}
                  setImage={setImage}
                  imagePreview={imagePreview}
                  setImagePreview={setImagePreview}
                  setStatusCategory={setStatusCategory}

                  fileInputRef={fileInputRef}
                  handleUploadClick={handleUploadClick}
                  handleSubmit={handleSubmit}
                  parentCategory={parentCategory}
                  possibleUpload={possibleUpload}
                  setPossibleUpload={setPossibleUpload}
                />
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Danh sách Danh mục</CardTitle>
              <CardDescription>Tổng cộng {filteredCategories.length} danh mục</CardDescription>
            </CardHeader>
            <CardContent>
              {!isLoading ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Danh mục</TableHead>
                    <TableHead>Cấp độ</TableHead>
                    <TableHead>Sản phẩm</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    {/* <TableHead>Thứ tự</TableHead> */}
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.map((category) => (
                    <React.Fragment key={category.id}>
                      <TableRow >
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Image
                              src={category.image || "/categoryimage.jpg"}
                              alt={category.categoryname}
                              width={40}
                              height={40}
                              className="rounded-lg object-cover"
                            />
                            <div>
                              <div className="font-medium" style={{ paddingLeft: `${category.level * 20}px` }}>
                                {category.level > 0 && "└─ "}
                                {category.categoryname}
                              </div>
                              <div className="text-sm text-gray-500">{category.id}</div>
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
                            variant={category.status === "ACTIVE" ? "default" : "secondary"}
                            className={category.status === "ACTIVE" ? "bg-[#81C784] text-white" : ""}
                          >
                            {category.status === "ACTIVE" ? "Hoạt động" : "Không hoạt động"}
                          </Badge>
                        </TableCell>
                        {/* <TableCell>{category.sortOrder}</TableCell> */}
                        <TableCell >{category.createAt}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Hành động</DropdownMenuLabel>

                              <DropdownMenuItem
                                onClick={() => {
                                  setExpandedCateId((prev) => (prev === category.id ? null : category.id));
                                  if (isEdit) return;
                                  setIsEdit(true)
                                  { category.parentId === null ? setPossibleUpload(true) : setPossibleUpload(false) }
                                }

                                }
                                disabled={isEdit}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Chỉnh sửa
                              </DropdownMenuItem>
                              {isEdit && (
                                <DropdownMenuItem className="text-red-600"
                                  onClick={() => {
                                    setIsEdit(false);
                                    setExpandedCateId(null);
                                    setImageDefault(category.image)
                                  }}

                                >
                                  <X className="mr-2 h-4 w-4" />
                                  Hủy
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              {category.status === "ACTIVE" ? (
                                <DropdownMenuItem className="text-orange-600"
                                  onClick={() => handlePauseCategory(category.id)}
                                >
                                  <Pause className="mr-2 h-4 w-4" />
                                  Lưu trữ
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem className="text-green-600"
                                  onClick={() => handleActivateCategory(category.id)}
                                >
                                  <Play className="mr-2 h-4 w-4" />
                                  Kích hoạt
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem className="text-red-600"
                                onClick={() => deleteCategory(category.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Xóa
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                      {expandedCateId === category.id && (
                        <TableRow>
                          <TableCell colSpan={8} className="bg-gray-50">
                            {isEdit && (
                              <form onSubmit={(e) => handleSubmit(e, "update")} className="grid grid-cols-3 gap-6 text-sm bg-white p-6 rounded-lg border shadow-sm">
                                <div >
                                  <label className="block text-gray-600 mb-1 font-medium">Tên thư mục</label>
                                  <input
                                    ref={nameRef}
                                    defaultValue={category.categoryname}
                                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                  />
                                </div>

                                <div >
                                  <label className="block text-gray-600 mb-1 font-medium">Danh mục cha</label>
                                  <select ref={parentIdRef} defaultValue={category.parentId}
                                    onChange={(e) => {
                                      const selectedValue = e.target.value;
                                      if (selectedValue === "0") {
                                        setPossibleUpload(true);
                                      } else {
                                        setPossibleUpload(false);
                                      }
                                    }}
                                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
                                    <option value="0">Không có (Danh mục gốc)</option>

                                    {parentCategory
                                      .map((category) => (
                                        <option key={category.id} value={category.id}>
                                          {category.categoryname}
                                        </option>
                                      ))}
                                  </select>
                                </div>

                                <div className="grid grid-cols-4 items-start gap-4">
                                  {/* Label bên trái */}
                                  <Label htmlFor="categoryImage" className="text-right font-semibold">
                                    Hình ảnh
                                  </Label>

                                  {/* Cột bên phải chiếm 3 cột */}
                                  <div className="col-span-3 space-y-2">
                                    <div className="flex gap-6 items-start">
                                      {/* Ảnh hiện tại */}
                                      <div className="space-y-1 text-center">
                                        <p className="text-sm text-gray-500">Hình ảnh hiện tại</p>
                                        <Image
                                          src={category.image || "/categoryimage.jpg"}
                                          alt={category.categoryname}
                                          width={128}
                                          height={128}
                                          className="rounded-lg object-cover w-32 h-32 border"
                                          
                                        />
                                      </div>

                                      {/* Ảnh sau thay đổi */}
                                      {imagePreview && (
                                        <div className="space-y-1 text-center">
                                          <p className="text-sm text-gray-500">Hình ảnh sau thay đổi</p>
                                          <img
                                            src={imagePreview}
                                            alt="Xem trước"
                                            className="rounded-lg object-cover w-32 h-32 border"
                                          />
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                              if (imagePreview != null) {
                                                URL.revokeObjectURL(imagePreview);
                                              }
                                              setImage(null);
                                              setImagePreview(null);
                                            }}
                                          >
                                            <X className="h-4 w-4 mr-1" />
                                            Xóa
                                          </Button>
                                        </div>
                                      )}
                                    </div>

                                    {/* Nút thay đổi ảnh */}
                                    {possibleUpload ? (
                                      <div>
                                        <input
                                          id="categoryImage"
                                          type="file"
                                          accept="image/*"
                                          className="hidden"
                                          ref={fileInputRef}
                                          onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                              setImage(file);
                                              setImagePreview(URL.createObjectURL(file));
                                            }
                                          }}
                                        />
                                        <Label htmlFor="categoryImage">
                                          <Button
                                            type="button"
                                            variant="outline"
                                            className="mt-1"
                                            onClick={handleUploadClick}
                                          >
                                            <Upload className="mr-2 h-4 w-4" />
                                            Thay đổi
                                          </Button>
                                        </Label>
                                      </div>) : (<div>
                                        <input
                                          id="categoryImage"
                                          type="file"
                                          accept="image/*"
                                          className="hidden"
                                          ref={fileInputRef}
                                          onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                              setImage(file);
                                              setImagePreview(URL.createObjectURL(file));
                                            }
                                          }}
                                          disabled
                                        />
                                        <Label htmlFor="categoryImage">
                                          <Button
                                            type="button"
                                            variant="outline"
                                            className="mt-1"
                                            onClick={handleUploadClick}
                                            disabled
                                          >
                                            <Upload className="mr-2 h-4 w-4" />
                                            Thay đổi (Chỉ dành cho danh mục gốc)
                                          </Button>
                                        </Label>
                                      </div>)}

                                  </div>
                                </div>

                                <div className="col-span-4 flex justify-end mt-4">
                                  <button
                                    type="submit"
                                    className="bg-gradient-to-r from-[#001F54] to-[#4DD0E1] text-white py-2 px-6 rounded-lg hover:shadow-md transition-all"
                                 
                                  >
                                    Cập nhật
                                  </button>
                                </div>

                              </form>
                            )}

                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody></Table>) : ((
                 
                    
 
  <div className="fixed inset-0 bg-white/70 flex items-center justify-center z-50">
          <ScaleLoader color="#001F54"  speedMultiplier={1.2} />
        </div>
  
))}
                
                
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          currentPage > 0 && setCurrentPage(currentPage - 1)}}
                      >

                      </PaginationPrevious>
                    </PaginationItem>
                      
                        {[...Array(totalPages)].map((_, i) => (
                          <PaginationItem key={i}>
                            <PaginationLink
                            href="#"
                            
                            onClick={(e)=> {
                               e.preventDefault()
                              setCurrentPage(i)}}
                            isActive={i === currentPage}
                            
                            >
                              {i+1}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        

                        
                       <PaginationItem>
      <PaginationNext
        href="#"
        onClick={(e) => {
          e.preventDefault()
          currentPage < totalPages - 1 && setCurrentPage(currentPage + 1)}}
      />
    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              
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
                          {content.type === "policy" ? "Chính sách" : content.type === "guide" ? "Hướng dẫn" : "Tin Tức"}
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
                            <DropdownMenuItem
                              onClick={() => handlePreview(content.contentId)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Xem trước
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(content.contentId)}>
                              <Edit className="mr-2 h-4 w-4" /> Chỉnh sửa
                            </DropdownMenuItem>


                            <DropdownMenuSeparator />
                            {content.status === "draft" && (
                              <DropdownMenuItem
                                className="text-green-600"
                                onClick={() => handlePublish(content.contentId)}
                              >
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
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDelete(content.contentId)}
                            >
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
              <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{previewContent?.title}</DialogTitle>
                  </DialogHeader>
                  <div
                    className="prose max-h-[60vh] overflow-auto"
                    dangerouslySetInnerHTML={{ __html: previewContent?.content || "" }}
                  />
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
                      Đóng
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Chỉnh sửa nội dung</DialogTitle>
                  </DialogHeader>
                  {editData && (
                    <EditContentForm
                      data={editData}
                      onSuccess={() => {
                        fetchContents()
                        setIsEditOpen(false)
                      }}
                    />
                  )}
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  )
}

function CreateCategoryForm({
  nameRef,
  parentIdRef,

  imageFile,
  setImage,
  imagePreview,
  setImagePreview,
  setStatusCategory,
  fileInputRef,
  handleUploadClick,
  handleSubmit,
  possibleUpload,
  setPossibleUpload,
  parentCategory }: CreateCategoryForm) {




  return (
    <form onSubmit={(e) => handleSubmit(e, "add")}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="categoryName" className="text-right">
            Tên danh mục
          </Label>
          <Input id="categoryName" ref={nameRef} placeholder="Nhập tên danh mục" className="col-span-3" />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="parentCategory" className="text-right">
            Danh mục cha
          </Label>
          <select ref={parentIdRef}
            onChange={(e) => {
              const selectedValue = e.target.value;
              if (selectedValue === "0") {
                setPossibleUpload(true);
              } else {
                setPossibleUpload(false);
              }
            }}
            className="col-span-3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4DD0E1]">
            <option value="0" >Không có (Danh mục gốc)</option>

            {parentCategory
              .map((category) => (
                <option key={category.id} value={category.id}>
                  {category.categoryname}
                </option>
              ))}
          </select>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          {/* input file ẩn */}
          <input
            id="categoryImage"
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setImage(file);
                setImagePreview(URL.createObjectURL(file));
              }
            }}
          />

          {/* Label bên trái */}
          <Label htmlFor="categoryImage" className="text-right">
            Hình ảnh
          </Label>

          {possibleUpload ? (
            <div className="col-span-3">
              {!imagePreview ? (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-center"
                  onClick={handleUploadClick}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Tải lên hình ảnh
                </Button>
              ) : (
                <div className="space-y-2">
                  <img
                    src={imagePreview}
                    alt="Xem trước"
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                  <div className="flex gap-2 justify-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setImage(file);
                          setImagePreview(URL.createObjectURL(file));
                        }
                      }}
                      className="hidden"
                      id="categoryImage"
                    />
                    <Label htmlFor="categoryImage" className="cursor-pointer">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full justify-center"
                        onClick={handleUploadClick}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Thay đổi
                      </Button>
                    </Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (imagePreview != null) {
                          URL.revokeObjectURL(imagePreview);
                        }

                        setImage(null)
                        setImagePreview(null)
                      }}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Xóa
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="col-span-3">
              <Button
                type="button"
                variant="outline"
                className="w-full justify-center"

                disabled
              >
                <Upload className="mr-2 h-4 w-4" />
                Tải lên hình ảnh (Chỉ dành cho danh mục gốc)
              </Button>
            </div>

          )}



        </div>


        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right">Trạng thái</Label>
          <div className="col-span-3 flex items-center space-x-2">
            <Switch onCheckedChange={setStatusCategory} />
            <span className="text-sm">Hoạt động</span>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" className="bg-[#001F54] hover:bg-[#001F54]/90">
            Tạo danh mục
          </Button>
        </DialogFooter>
      </div>
    </form>
  )
}
//     <form onSubmit={handleSubmit} className="grid gap-4 py-4">
//       <div className="grid grid-cols-4 items-center gap-4">
//         <Label htmlFor="contentTitle" className="text-right">Tiêu đề</Label>
//         <Input id="contentTitle" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" />
//       </div>

//       <div className="grid grid-cols-4 items-center gap-4">
//         <Label htmlFor="contentSlug" className="text-right">Slug</Label>
//         <Input id="contentSlug" value={slug} onChange={(e) => setSlug(e.target.value)} className="col-span-3" />
//       </div>

//       <div className="grid grid-cols-4 items-center gap-4">
//         <Label htmlFor="contentType" className="text-right">Loại nội dung</Label>
//         <select value={type} onChange={(e) => setType(e.target.value)} className="col-span-3 px-3 py-2 border rounded-md">
//           <option value="policy">Chính sách</option>
//           <option value="guide">Hướng dẫn</option>
//           <option value="news">Tin tức</option>
//         </select>
//       </div>

//       <div className="grid grid-cols-4 items-start gap-4">
//         <Label htmlFor="contentBody" className="text-right mt-2">Nội dung</Label>
//         <Textarea id="contentBody" value={content} onChange={(e) => setContent(e.target.value)} className="col-span-3" rows={8} />
//       </div>

//       <div className="grid grid-cols-4 items-center gap-4">
//         <Label className="text-right">Trạng thái</Label>
//         <select value={status} onChange={(e) => setStatus(e.target.value)} className="col-span-3 px-3 py-2 border rounded-md">
//           <option value="draft">Bản nháp</option>
//           <option value="published">Xuất bản</option>
//         </select>
//       </div>

//       <DialogFooter>
//         <Button
//           variant="outline"
//           type="button"
//           onClick={(e) => {
//             setStatus("draft")
//             setTimeout(() => handleSubmit(e), 0)
//           }}
//         >
//           Lưu
//         </Button>
//       </DialogFooter>
//     </form>
//   )
// }


//function tạo mới
function CreateContentForm({ onSuccess }: { onSuccess?: () => void }) {
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [type, setType] = useState("policy")
  const [content, setContent] = useState("")
  const [status, setStatus] = useState("draft")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_BACKEND}/admin/contents`, {
        title,
        slug,
        type,
        content,
        status,
        adminId: 1
      })

      if (onSuccess) onSuccess()
      alert("Tạo nội dung thành công")
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
        <Textarea id="contentBody" value={content} onChange={(e) => setContent(e.target.value)} className="col-span-3" rows={8} />
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
            setTimeout(() => handleSubmit(e), 0)
          }}
        >
          Lưu
        </Button>
      </DialogFooter>
    </form>
  )
}

//function update
function EditContentForm({
  data,
  onSuccess
}: { data: ContentDetail; onSuccess: () => void }) {
  const [title, setTitle] = useState(data.title)
  const [slug, setSlug] = useState(data.slug)
  const [type, setType] = useState(data.type)
  const [content, setContent] = useState(data.content)
  const [status, setStatus] = useState(data.status)
  const {
    contentid: id,
    title: initialTitle,
    slug: initialSlug,
    type: initialType,
    content: initialContent,
    status: initialStatus
  } = data
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await axios.put(`${process.env.NEXT_PUBLIC_API_BACKEND}/admin/contents/${id}`, {
      title, slug, type, content, status, adminId: 1
    })
    onSuccess()

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
        <Textarea id="contentBody" value={content} onChange={(e) => setContent(e.target.value)} className="col-span-3" rows={8} />
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
            setTimeout(() => handleSubmit(e), 0)
          }}
        >
          Lưu
        </Button>
      </DialogFooter>
    </form>
  )
}
