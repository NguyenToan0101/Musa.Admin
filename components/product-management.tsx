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

type Product = {
  id: number;
  name: string;
  shopName: string;
  categoryName: string;
  status: string;
  createdat: string;
  price: number;
  sold: number;
  thumbnail: string;
}

type MainCategory = {
  categoryid: number
  categoryname: string
}

type InventoryDTO = {
  soldItems: number;
  price: number;
  color: string;
  dimension: string;
  updatedAt: string;
};

type AdminProductDetailDTO = {
  id: number;
  name: string;
  shopName: string;
  categoryName: string;
  description: string;
  status: string;
  createdAt: string;
  inventories: InventoryDTO[];
  images: string[];
};


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
import { Search, MoreHorizontal, Check, X, Lock, Unlock, Eye, Package, Store, Trash2 } from "lucide-react"

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

  //shop
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")
  const [lockUntil, setLockUntil] = useState<Date | null>(null)
  const [selectedShopToLock, setSelectedShopToLock] = useState<Shop | null>(null);
  const [showLockModal, setShowLockModal] = useState(false);
  // const products: any[] = [] 



  const [shopStatusFilter, setShopStatusFilter] = useState("all")
  const [businessTypeFilter, setBusinessTypeFilter] = useState("all")

  const [shopSearch, setShopSearch] = useState("")
  const [sortOrder, setSortOrder] = useState("desc") // hoặc "asc"

  const [shops, setShops] = useState<Shop[]>([
  ])

  //phong to anh
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  //gioi hang trang san pham
  const [productPage, setProductPage] = useState(1);
  const productsPerPage = 10;



  //product
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTermProduct, setSearchTermProduct] = useState("");
  const [filterStatusProduct, setFilterStatusProduct] = useState("all");
  const [filterCategoryProduct, setFilterCategoryProduct] = useState("all");
  const [categories, setCategories] = useState<MainCategory[]>([])

  // Product actions
  const [expandedProductId, setExpandedProductId] = useState<number | null>(null)
  const [showLockModalProduct, setShowLockModalProduct] = useState(false)
  const [selectedProductToLock, setSelectedProductToLock] = useState<Product | null>(null)
  const [showDeleteModalProduct, setShowDeleteModalProduct] = useState(false)
  const [selectedProductToDelete, setSelectedProductToDelete] = useState<Product | null>(null)
  const [lockUntilProduct, setLockUntilProduct] = useState<Date | null>(null)

  // state cho detail modal
  const [selectedProductDetail, setSelectedProductDetail] = useState<AdminProductDetailDTO | null>(null);
  const [isProductDetailOpen, setIsProductDetailOpen] = useState(false);

  //phan trang
  const [inventoryPage, setInventoryPage] = useState(1);
  const itemsPerPage = 5;


  function openProductDetail(id: number) {
    setIsProductDetailOpen(true);
    axios
      .get<AdminProductDetailDTO>(`${process.env.NEXT_PUBLIC_API_BACKEND}/admin/products/detail/${id}`)
      .then(res => setSelectedProductDetail(res.data))
      .catch(() => setIsProductDetailOpen(false));
  }


  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_BACKEND}/admin/shops`)
      .then((res) => setShops(res.data))
      .catch((err) => console.error("Lỗi khi lấy danh sách shop:", err))
  }, [])

  useEffect(() => {
    if (filterCategoryProduct === "all") {
      axios
        .get<Product[]>(`${process.env.NEXT_PUBLIC_API_BACKEND}/admin/products`)
        .then(res => setProducts(res.data))
        .catch(err => console.error("Lỗi khi lấy products:", err))
    }
  }, [filterCategoryProduct])

  //loc categori chinh

  useEffect(() => {
    axios
      .get<MainCategory[]>(`${process.env.NEXT_PUBLIC_API_BACKEND}/category/main`)
      .then(res => setCategories(res.data))
      .catch(err => console.error("Lỗi khi lấy categories:", err))
  }, [])

  useEffect(() => {
    if (filterCategoryProduct !== "all") {
      const selectedCategory = categories.find(c => c.categoryname === filterCategoryProduct)
      if (selectedCategory) {
        axios
          .get<Product[]>(`${process.env.NEXT_PUBLIC_API_BACKEND}/admin/products?mainCategoryId=${selectedCategory.categoryid}`)
          .then(res => setProducts(res.data))
          .catch(err => console.error("Lỗi khi lấy products theo danh mục:", err))
      }
    }
  }, [filterCategoryProduct, categories])

  // Filter logic
  const filteredProducts = products.filter(p => {
    const nm = (p.name || "").toLowerCase()
    const sn = (p.shopName || "").toLowerCase()
    const kw = searchTermProduct.toLowerCase()
    const statusOK = filterStatusProduct === "all" || p.status === filterStatusProduct

    return (nm.includes(kw) || sn.includes(kw)) && statusOK
  })



  const filteredShops = shops
    .filter((shop) => {
      const statusOK = shopStatusFilter === "all" || shop.status === shopStatusFilter
      const typeOK = businessTypeFilter === "all" || shop.businessType === businessTypeFilter

      const nameLower = (shop.shopName || "").toLowerCase()
      const ownerLower = (shop.manageName || "").toLowerCase()
      const searchLower = shopSearch.toLowerCase()

      const searchOK = nameLower.includes(searchLower) || ownerLower.includes(searchLower)

      return statusOK && typeOK && searchOK
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
    if (Array.isArray(date) || date === null) return
    setLockUntil(date)
  }

  const [shopPage, setShopPage] = useState(1)
  const shopsPerPage = 10

  useEffect(() => {
    setShopPage(1)
  }, [shopSearch, shopStatusFilter, businessTypeFilter])

  const pagedShops = filteredShops.slice(
    (shopPage - 1) * shopsPerPage,
    shopPage * shopsPerPage
  )
  const shopPageCount = Math.ceil(filteredShops.length / shopsPerPage)


  //PRODUCT FUNCTION

  // Phê duyệt
  async function handleApproveProduct(productId: number) {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_BACKEND}/admin/products/${productId}/approve`)
      setProducts(prev =>
        prev.map(p => p.id === productId ? { ...p, status: "available" } : p)
      )
    } catch (err) {
      console.error("Lỗi khi phê duyệt sản phẩm:", err)
      alert("Phê duyệt thất bại")
    }
  }

  // Từ chối
  async function handleRejectProduct(productId: number) {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_BACKEND}/admin/products/${productId}/reject`)
      setProducts(prev =>
        prev.map(p => p.id === productId ? { ...p, status: "rejected" } : p)
      )
    } catch (err) {
      console.error("Lỗi khi từ chối sản phẩm:", err)
      alert("Từ chối thất bại")
    }
  }

  // Khóa sản phẩm
  function openLockProductModal(product: Product) {
    setSelectedProductToLock(product);
    setShowLockModalProduct(true);
  }
  async function handleConfirmLockProduct() {
    if (!selectedProductToLock || !lockUntilProduct) return;
    const duration = Math.ceil((lockUntilProduct.getTime() - Date.now()) / 60000);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BACKEND}/admin/products/${selectedProductToLock.id}/lock`,
        { durationMinutes: duration }
      );
      setProducts(prev =>
        prev.map(p =>
          p.id === selectedProductToLock.id ? { ...p, status: "locked" } : p
        )
      );
      setShowLockModalProduct(false);
    } catch (err) {
      console.error(err);
      alert("Khóa thất bại");
    }
  }

  //mo khoa 
  async function handleUnlockProduct(productId: number) {
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_BACKEND}/admin/products/${productId}/unlock`)
      setProducts(prev =>
        prev.map(p => p.id === productId ? { ...p, status: "available" } : p)
      )
    } catch (err) {
      console.error(err)
      alert("Mở khóa thất bại")
    }
  }

  // Xóa sản phẩm
  function openDeleteProductModal(product: Product) {
    setSelectedProductToDelete(product)
    setShowDeleteModalProduct(true)
  }
  async function handleConfirmDeleteProduct() {
    if (!selectedProductToDelete) return
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_BACKEND}/admin/products/${selectedProductToDelete.id}`)
      setProducts(prev => prev.filter(p => p.id !== selectedProductToDelete.id))
      setShowDeleteModalProduct(false)
    } catch (err) {
      console.error(err)
      alert("Xóa thất bại")
    }
  }

  //phan trang xem chi tiet
  const pagedInventories = selectedProductDetail
    ? selectedProductDetail.inventories.slice(
      (inventoryPage - 1) * itemsPerPage,
      inventoryPage * itemsPerPage
    )
    : [];

  const inventoryPageCount = selectedProductDetail
    ? Math.ceil(selectedProductDetail.inventories.length / itemsPerPage)
    : 0;


  //gioi han trang san pham
  const pagedProducts = filteredProducts.slice(
    (productPage - 1) * productsPerPage,
    productPage * productsPerPage
  );

  const productPageCount = Math.ceil(filteredProducts.length / productsPerPage);

  useEffect(() => {
    setProductPage(1);
  }, [searchTermProduct, filterStatusProduct, filterCategoryProduct]);





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
                  <option value="company">Công ty</option>
                  <option value="household">Hộ kinh doanh</option>
                  <option value="individual">Cá nhân</option>
                  <option value="retail">Bán lẻ</option>
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
                  {pagedShops.map((shop) => (
                    <TableRow key={shop.shopId}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-[#4DD0E1] flex items-center justify-center text-white font-bold">
                            {(shop.shopName?.charAt(0) || "").toUpperCase()}
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

                            {shop.status === "PENDING_APPROVAL" && (
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
                            )}

                            {shop.status === "LOCK" && (
                              <DropdownMenuItem onClick={() => handleUnlockShop(shop.shopId)}>
                                <Unlock className="mr-2 text-green-600" />
                                Mở khóa shop
                              </DropdownMenuItem>
                            )}

                            {shop.status === "ACTIVE" && !shop.locked && (
                              <DropdownMenuItem onClick={() => openLockModal(shop)}>
                                <Lock className="mr-2 text-red-600" />
                                Khóa shop
                              </DropdownMenuItem>
                            )}

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

              {/* hiện 1 lần 10 shop */}
              <div className="flex justify-center mt-4 space-x-2">
                {Array.from({ length: shopPageCount }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setShopPage(page)}
                    className={
                      "px-3 py-1 rounded " +
                      (shopPage === page
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
        </div>
      </TabsContent>


      {/* PRODUCT TAB */}
      <TabsContent value="product">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-[#001F54]">Quản lý Sản phẩm</h1>
          <div className="flex space-x-2">
            <Badge className="bg-green-500 text-white">
              {products.filter(p => p.status === "available").length} đang bán
            </Badge>
            <Badge className="bg-yellow-500 text-white">
              {products.filter(p => p.status === "pending_approval").length} chờ duyệt
            </Badge>
            <Badge className="bg-red-500 text-white">
              {products.filter(p => p.status === "rejected").length} từ chối
            </Badge>
            <Badge className="bg-red-600 text-white">
              {products.filter(p => p.status === "locked").length} bị khóa
            </Badge>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Tìm kiếm &amp; Lọc Sản phẩm</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm sản phẩm hoặc shop..."
                  value={searchTermProduct}
                  onChange={e => setSearchTermProduct(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={filterStatusProduct}
                onChange={e => setFilterStatusProduct(e.target.value)}
                className="px-3 py-2 border rounded"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="available">Đang bán</option>
                <option value="pending_approval">Chờ duyệt</option>
                <option value="rejected">Từ Chối</option>
                <option value="locked">Bị khóa</option>
              </select>

              <select
                value={filterCategoryProduct}
                onChange={e => setFilterCategoryProduct(e.target.value)}
                className="px-3 py-2 border rounded"
              >
                <option value="all">Tất cả danh mục</option>
                {categories.map(c => (
                  <option key={c.categoryid} value={c.categoryname}>
                    {c.categoryname}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Product Table */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách Sản phẩm</CardTitle>
            <CardDescription>
              Tổng cộng {filteredProducts.length} sản phẩm
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredProducts.length === 0 ? (
              <div className="text-center text-gray-500 py-6">
                Không có sản phẩm nào.
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sản phẩm</TableHead>
                      <TableHead>Shop</TableHead>
                      <TableHead>Danh mục</TableHead>
                      <TableHead>Giá</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Đã bán</TableHead>
                      <TableHead>Ngày tạo</TableHead>
                      <TableHead className="text-right">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pagedProducts.map(p => (
                      <TableRow key={p.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Image
                              src={p.thumbnail || "/placeholder.svg"}
                              alt={p.name}
                              width={50}
                              height={50}
                              className="rounded-lg object-cover"
                            />
                            <div>
                              <div className="font-medium">{p.name}</div>
                              <div className="text-sm text-gray-500">{p.shopName}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{p.shopName}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{p.categoryName}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {p.price.toLocaleString()}₫
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              p.status === "available"
                                ? "bg-green-500 text-white"
                                : p.status === "pending_approval"
                                  ? "bg-yellow-500 text-white"
                                  : "bg-red-500 text-white"
                            }
                          >
                            {p.status === "available"
                              ? "Đang bán"
                              : p.status === "pending_approval"
                                ? "Chờ duyệt"
                                : p.status === "rejected"
                                  ? "Từ Chối"
                                  : "Bị Khóa"}
                          </Badge>
                        </TableCell>
                        <TableCell>{p.sold}</TableCell>
                        <TableCell>
                          {new Date(p.createdat).toLocaleDateString("vi-VN")}
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

                              <DropdownMenuItem onClick={() => openProductDetail(p.id)}>
                                <Eye className="mr-2 h-4 w-4" /> Xem chi tiết
                              </DropdownMenuItem>

                              {p.status === "pending_approval" && (
                                <>
                                  <DropdownMenuItem onClick={() => handleApproveProduct(p.id)}>
                                    <Check className="mr-2 h-4 w-4" /> Duyệt sản phẩm
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleRejectProduct(p.id)}>
                                    <X className="mr-2 h-4 w-4" /> Từ chối sản phẩm
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                </>
                              )}

                              {p.status === "locked" ? (
                                <DropdownMenuItem className="text-green-600" onClick={() => handleUnlockProduct(p.id)}>
                                  <Unlock className="mr-2 h-4 w-4" /> Mở khóa
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem className="text-red-600" onClick={() => openLockProductModal(p)}>
                                  <Lock className="mr-2 h-4 w-4" /> Khóa sản phẩm
                                </DropdownMenuItem>
                              )}

                              <DropdownMenuSeparator />


                              <DropdownMenuItem className="text-red-600" onClick={() => openDeleteProductModal(p)}>
                                <Trash2 className="mr-2 h-4 w-4" /> Xóa sản phẩm
                              </DropdownMenuItem>
                            </DropdownMenuContent>

                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination controls */}
                <div className="flex justify-center mt-4 space-x-2">
                  {Array.from({ length: productPageCount }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setProductPage(page)}
                      className={
                        "px-3 py-1 rounded " +
                        (productPage === page
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-700")
                      }
                    >
                      {page}
                    </button>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
        <Dialog open={isProductDetailOpen} onOpenChange={setIsProductDetailOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Chi tiết sản phẩm</DialogTitle>
              <DialogClose asChild>
                <Button variant="ghost" className="absolute top-4 right-4">
                  ✕
                </Button>
              </DialogClose>
            </DialogHeader>

            {selectedProductDetail ? (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">{selectedProductDetail.name}</h2>
                <p className="text-sm text-gray-600">
                  Shop: {selectedProductDetail.shopName} — Danh mục: {selectedProductDetail.categoryName}
                </p>
                <p>{selectedProductDetail.description}</p>
                <div className="flex items-center space-x-4">
                  <Badge
                    className={
                      selectedProductDetail.status === "available"
                        ? "bg-green-500"
                        : selectedProductDetail.status === "pending_approval"
                          ? "bg-yellow-500"
                          : selectedProductDetail.status === "rejected"
                            ? "bg-red-500"
                            : "bg-red-600"
                    }
                  >
                    {selectedProductDetail.status === "available"
                      ? "Đang bán"
                      : selectedProductDetail.status === "pending_approval"
                        ? "Chờ duyệt"
                        : selectedProductDetail.status === "locked"
                          ? "Từ chối"
                          : "Bị khóa"}
                  </Badge>
                  <span className="text-gray-500">
                    Ngày tạo: {new Date(selectedProductDetail.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>

                <div className="flex space-x-2 overflow-x-auto">
                  {selectedProductDetail.images.map((url, i) => (
                    <button
                      key={i}
                      onClick={() => setLightboxSrc(url)}
                      className="focus:outline-none"
                    >
                      <Image
                        src={url}
                        alt={`Ảnh ${i + 1}`}
                        width={120}
                        height={120}
                        className="rounded-lg object-cover hover:opacity-80 transition-opacity"
                      />
                    </button>
                  ))}
                </div>

                <div>
                  <h3 className="font-medium mb-2">Thông tin kho</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <div className="max-h-64 overflow-y-auto">
                      <Table>
                        {/* Header sticky */}
                        <TableHeader className="sticky top-0 bg-white z-10">
                          <TableRow>
                            <TableHead>Màu/Loại</TableHead>
                            <TableHead>Kích thước</TableHead>
                            <TableHead>Giá</TableHead>
                            <TableHead>Đã bán</TableHead>
                            <TableHead>Ngày cập nhật</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {pagedInventories.map((inv, idx) => (
                            <TableRow key={idx}>
                              <TableCell>{inv.color}</TableCell>
                              <TableCell>{inv.dimension}</TableCell>
                              <TableCell>{inv.price.toLocaleString()}₫</TableCell>
                              <TableCell>{inv.soldItems}</TableCell>
                              <TableCell>
                                {new Date(inv.updatedAt).toLocaleTimeString("vi-VN")}{" "}
                                {new Date(inv.updatedAt).toLocaleDateString("vi-VN")}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                  <div className="flex justify-center mt-4 space-x-2">
                    {Array.from({ length: inventoryPageCount }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setInventoryPage(page)}
                        className={
                          "px-3 py-1 rounded " +
                          (inventoryPage === page
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-700")
                        }
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">Đang tải...</div>
            )}


          </DialogContent>
        </Dialog>

        {/* zoom ảnh    */}
        <Dialog open={!!lightboxSrc} onOpenChange={() => setLightboxSrc(null)}>
          <DialogContent className="bg-black/80 p-0 flex items-center justify-center">
            <DialogHeader>
              <DialogTitle className="sr-only">Xem ảnh</DialogTitle>
              <DialogClose asChild>
                <button className="absolute top-4 right-4 text-white text-2xl">✕</button>
              </DialogClose>
            </DialogHeader>

            {lightboxSrc && (
              <Image
                src={lightboxSrc}
                alt="Preview"
                width={800}
                height={800}
                className="max-w-full max-h-[90vh] object-contain"
              />
            )}
          </DialogContent>
        </Dialog>


        {/* khóa sản phẩm */}
        <Dialog open={showLockModalProduct} onOpenChange={setShowLockModalProduct}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Chọn thời gian khóa sản phẩm</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p>
                Khóa sản phẩm <strong>{selectedProductToLock?.name}</strong> đến:
              </p>
              <DatePicker
                selected={lockUntilProduct}
                onChange={(d) => Array.isArray(d) || !d ? null : setLockUntilProduct(d)}
                showTimeSelect
                dateFormat="Pp"
                className="w-full border px-2 py-1 rounded"
              />
              <Button
                className="bg-red-600 text-white"
                onClick={handleConfirmLockProduct}
                disabled={!lockUntilProduct}
              >
                Xác nhận khóa
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete confirmation */}
        <Dialog open={showDeleteModalProduct} onOpenChange={setShowDeleteModalProduct}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Xác nhận xóa sản phẩm</DialogTitle>
              <DialogClose asChild>
                <Button variant="ghost" className="absolute top-2 right-2">✕</Button>
              </DialogClose>
            </DialogHeader>
            <p>
              Bạn có chắc chắn muốn xóa sản phẩm{" "}
              <strong>{selectedProductToDelete?.name}</strong>?
              Hành động này không thể hoàn tác.
            </p>
            <div className="mt-4 flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowDeleteModalProduct(false)}>
                Hủy
              </Button>
              <Button
                className="bg-red-600 text-white"
                onClick={handleConfirmDeleteProduct}
                disabled={!selectedProductToDelete}
              >
                Xác nhận
              </Button>
            </div>
          </DialogContent>
        </Dialog>


      </TabsContent>

    </Tabs>


  )

}



