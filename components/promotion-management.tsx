"use client"

import React from "react";

import { useEffect, useState, useRef } from "react"
import { Check, ChevronDown, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import CategoryMultiSelect from '@/components/CategoryMultiSelect';
import { useRouter } from 'next/navigation';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Search,
  MoreHorizontal,
  Plus,
  Eye,
  Edit,
  Trash2,
  Copy,
  Play,
  Pause,
  TrendingUp,
  Users,
  ShoppingCart,
  Calendar,
  Target,
  Gift,
  Tag,
  DollarSign,
  Truck,
  Package,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts"
import axios from "axios"
import ScaleLoader from 'react-spinners/ScaleLoader'

interface CreatePromotionFormProps {
  nameRef: React.RefObject<HTMLInputElement | null>;
  codeRef: React.RefObject<HTMLInputElement | null>;
  typeRef: React.RefObject<HTMLSelectElement | null>;
  valueRef: React.RefObject<HTMLInputElement | null>;
  statusRef: React.RefObject<HTMLInputElement | null>;
  startdateRef: React.RefObject<HTMLInputElement | null>;
  enddateRef: React.RefObject<HTMLInputElement | null>;
  minOrderValueRef: React.RefObject<HTMLInputElement | null>;
  maxDiscountRef: React.RefObject<HTMLInputElement | null>;
  usageLimitRef: React.RefObject<HTMLInputElement | null>;
  descriptionRef: React.RefObject<HTMLInputElement | null>;
  perUserLimitRef: React.RefObject<HTMLInputElement | null>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>, statusUpdateOrAdd: "add" | "update") => void;
  handleCategoryChange: (categories: OptionType[]) => void;

}

const templatePromotion = async (title: string, onSuccess: () => void) => {
  try {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BACKEND}/promotion/template`,
      title,
      {
        headers: {
          'Content-Type': 'text/plain'
        }
      });
    console.log("Activate response:", res.data);
    toast.success("Dùng khuyến mãi mẫu thành công!.\nChú ý khuyến mãi chỉ có thời hạn 1 ngày.\nHãy bấm cập nhật để cập nhật chi tiết");
    setTimeout(() => {
      onSuccess();
    }, 3000);
  } catch (error) {
    toast.error("Dùng thất bại")
    console.error("Error activating promotion:", error);
  }
};
type OptionType = {
  value: number;
  label: string;

};

export function PromotionManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [expandedPromoId, setExpandedPromoId] = useState<number | null>(null);
  const [actionType, setActionType] = useState<"view" | "edit" | null>(null);
  const [isViewOrEditActive, setIsViewOrEditActive] = useState(false);
  const [typePromotion, setTypePromotion] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  //Data Overview
  const [overviewData, setOverviewData] = useState({
    revenue: 0,
    revenuePercentage: 0,
    order: 0,
    orderPercentage: 0,
    conversionRate: 0,
    conversionRatePercentage: 0,
    newUser: 0,
    newUserPercentage: 0,
    promotionEffectivenessData: [
      { month: "01/2025", revenue: 180000000, orders: 1850, discount: 25000000 },
      { month: "02/2025", revenue: 165000000, orders: 1650, discount: 22000000 },
      { month: "03/2025", revenue: 210000000, orders: 2100, discount: 28000000 },
      { month: "04/2025", revenue: 195000000, orders: 1950, discount: 26000000 },
      { month: "05/2025", revenue: 225000000, orders: 2250, discount: 30000000 },
      { month: "06/2025", revenue: 240000000, orders: 2400, discount: 32000000 },
      { month: "07/2025", revenue: 280000000, orders: 2800, discount: 39000000 },
    ],
    promotionTypeData: [
      { name: "Giảm giá %", value: 45, color: "#001F54" },
      { name: "Giảm giá cố định", value: 25, color: "#4DD0E1" },
      { name: "Miễn phí vận chuyển", value: 20, color: "#81C784" },
      { name: "Mua 1 tặng 1", value: 10, color: "#FFB74D" },
    ],
    topPromotionsData: [
      { name: "SUMMER20", orders: 245, revenue: 125000000, conversion: 8.5, roi : 0.976 },
      { name: "FREESHIP", orders: 1250, revenue: 85000000, conversion: 12.3 ,roi: 0.6},
      { name: "BIRTHDAY15", orders: 1850, revenue: 180000000, conversion: 15.2,roi : 0 },
      { name: "NEWUSER10", orders: 890, revenue: 95000000, conversion: 9.8 ,roi: 0},
    ]
  })


  const [promotions, setPromotionList] = useState(
    [
      {
        id: 1,
        name: "Giảm giá mùa hè",
        type: "PERCENTAGE",
        value: 20,
        code: "SUMMER20",
        status: "ACTIVE",
        startdate: "2024-06-01",
        enddate: "2024-08-31",
        usageLimit: 1000,
        usageCount: 245,
        minOrderValue: 500000,
        maxDiscount: 200000,
        perUserLimit: 2,
        categories: [
          {
            value: 23,
            label: "Điện Thoại & Phụ Kiện"

          },
          {
            value: 1,
            label: "Thời trang nam"

          }
        ],


        revenue: 125000000,
        orders: 245,
        description: "Demo"

      },
      // {
      //   id: "PROMO002",
      //   name: "Miễn phí vận chuyển",
      //   type: "shipping",
      //   value: 0,
      //   code: "FREESHIP",
      //   status: "active",
      //   startdate: "2024-03-01",
      //   enddate: "2024-12-31",
      //   usageLimit: 5000,
      //   usageCount: 1250,
      //   minOrderValue: 300000,
      //   maxDiscount: 50000,
      //   perUserLimit: 1,
      //   categories: [ {categoryid: 23,
      //     categoryname: "Điện Thoại & Phụ Kiện"

      //   },],
      //   revenue: 85000000,
      //   orders: 1250,
      //   description: "Demo"
      // },
      // {
      //   id: "PROMO003",
      //   name: "Flash Sale cuối tuần",
      //   type: "fixed",
      //   value: 100000,
      //   code: "FLASH100",
      //   status: "scheduled",
      //   startdate: "2024-04-06",
      //   enddate: "2024-04-07",
      //   usageLimit: 500,
      //   usageCount: 0,
      //   minOrderValue: 200000,
      //   maxDiscount: 100000,
      //   perUserLimit: 3,
      //   categories: [ {categoryid: 35,
      //     categoryname: "Thiết Bị Điện Tử"

      //   },],
      //   revenue: 0,
      //   orders: 0,
      //   description: "Demo"
      // },
      // {
      //   id: "PROMO004",
      //   name: "Khuyến mãi sinh nhật",
      //   type: "percentage",
      //   value: 15,
      //   code: "BIRTHDAY15",
      //   status: "expired",
      //   startdate: "2024-01-01",
      //   enddate: "2024-02-29",
      //   usageLimit: 2000,
      //   usageCount: 1850,
      //   minOrderValue: 400000,
      //   maxDiscount: 150000,
      //   perUserLimit: 4,
      //   categories: [ {categoryid: 35,
      //     categoryname: "Thiết Bị Điện Tử"

      //   },],
      //   revenue: 180000000,
      //   orders: 1850,
      //   description: "Demo"
      // },
    ]

  )
  const totalROI = overviewData.topPromotionsData.reduce(
  (sum, promo) => sum + promo.roi, 0
);
const averageROI = totalROI / overviewData.topPromotionsData.length;


  const fetchData = async () => {
    setIsLoading(true)
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BACKEND}/promotion/data`);
      if (res.data != null) {
        setOverviewData(res.data.overview);
        const processedPromotions = res.data.promotions.map((promo: any) => ({
          ...promo,
          startdate: promo.startdate.slice(0, 16),
          enddate: promo.enddate.slice(0, 16),
          orders: promo.orders ?? 0,
          usageCount: promo.usageCount ?? 0,
          revenue: promo.revenue ?? 0,
        }));
        setPromotionList(processedPromotions);
        console.log(res.data.overview)
      } else {
        console.error("ERROR: Not information get");
      }
    } catch (err) {
      console.error("API error:", err);
    } finally {
      setIsLoading(false)
    }
  };
  useEffect(() => {
    fetchData();
  }, []);





  // Dùng ref để lấy input mà không cần state cho từng cái
  const nameRef = useRef<HTMLInputElement>(null);
  const codeRef = useRef<HTMLInputElement>(null);
  const typeRef = useRef<HTMLSelectElement>(null);
  const valueRef = useRef<HTMLInputElement>(null);
  const statusRef = useRef<HTMLInputElement>(null);
  const startdateRef = useRef<HTMLInputElement>(null);
  const enddateRef = useRef<HTMLInputElement>(null);
  const minOrderValueRef = useRef<HTMLInputElement>(null);
  const maxDiscountRef = useRef<HTMLInputElement>(null);
  const usageLimitRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);
  const perUserLimitRef = useRef<HTMLInputElement>(null);

  const [selectedCategories, setSelectedCategories] = useState<OptionType[]>();
  const handleCategoryChange = (categories: OptionType[]) => {
    setSelectedCategories(categories);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, statusUpdateOrAdd: "add" | "update") => {
    e.preventDefault();
    if (
      !nameRef.current ||
      !codeRef.current ||
      !typeRef.current ||
      !valueRef.current ||
      !statusRef.current ||
      !startdateRef.current ||
      !enddateRef.current ||
      !minOrderValueRef.current ||
      !maxDiscountRef.current ||
      !usageLimitRef.current ||
      !descriptionRef.current ||
      !perUserLimitRef.current
    ) {
      console.error("Missing input values");
      return;
    }
    const payload = {
      id: expandedPromoId,
      name: nameRef.current.value,
      code: codeRef.current.value,
      type: typeRef.current.value,
      value: parseFloat(valueRef.current.value),
      status: statusRef.current.value,
      startdate: startdateRef.current.value,
      enddate: enddateRef.current.value,
      minOrderValue: parseInt(minOrderValueRef.current.value),
      maxDiscount: parseInt(maxDiscountRef.current.value),
      usageLimit: parseInt(usageLimitRef.current.value),
      description: descriptionRef.current.value,
      perUserLimit: perUserLimitRef.current.value,
      categories: selectedCategories,
    };
    if (statusUpdateOrAdd == "update") {
      try {
        console.log(payload)
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BACKEND}/promotion/update`, payload);

        toast.success("Cập nhật khuyến mãi thành công!");
        setTimeout(() => {
          fetchData();
        }, 1000);
      } catch (error: any) {
        const errorMsg = error?.response?.data?.message || "Đã có lỗi xảy ra.";
        toast.error(errorMsg);
      }
    } else {
      try {
        console.log(payload)
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BACKEND}/promotion/add`, payload);

        toast.success("Tạo khuyến mãi thành công!");
        setTimeout(() => {
          fetchData();
        }, 1000);
      } catch (error: any) {
        const errorMsg = error?.response?.data?.message || "Đã có lỗi xảy ra.";
        toast.error(errorMsg);
      }
    }

  };

  const handlePausePromotion = async (id: number) => {

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BACKEND}/promotion/setStatusPaused`, {
        id,
        status: "PAUSED",
      });
      console.log("Pause response:", res.data);
      toast.success("Dừng khuyến mãi thành công!");
      setTimeout(() => {
        fetchData();
      }, 1000);
    } catch (error) {
      toast.error("Dừng thất bại")
      console.error("Error pausing promotion:", error);
    }
  };
  const handleActivatePromotion = async (id: number) => {
    const promotion = promotions.find(p => p.id === id);
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BACKEND}/promotion/setStatusActive`, {
        id,
        status: promotion?.status,
      });
      console.log("Activate response:", res.data);
      if (promotion?.status === "SCHEDULED") {
        toast.success("Kích hoạt khuyến mãi thành công!");

      } else if (promotion?.status === "PAUSED") {
        toast.success("Tiếp tục khuyến mãi thành công!");
      } else if (promotion?.status === "EXPIRED") {
        toast.success("Kích hoạt khuyến mãi thành công! Khuyễn mãi thêm thời hạn 1 ngày\nHãy bấm cập nhật để cập nhật chi tiết hơn");
      }

      // Reset the form and close the dialog
      setTimeout(() => {
        fetchData();
      }, 1000);
    } catch (error) {
      toast.error("Tiếp tục thất bại")
      console.error("Error activating promotion:", error);
    }
  };
  const deletePromotion = async (id: number) => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BACKEND}/promotion/delete`, {
        id,
        status: "DELETE",
      });
      console.log("Activate response:", res.data);
      toast.success("Xóa khuyến mãi thành công!");
      setTimeout(() => {
        fetchData();
      }, 1000);
    } catch (error) {
      toast.error("Xóa thất bại")
      console.error("Error activating promotion:", error);
    }
  };


  const filteredPromotions = (promotions || []).filter((promo) => {
    const matchesSearch =
      promo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promo.code.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || promo.status === filterStatus
    const matchesType = filterType === "all" || promo.type === filterType

    return matchesSearch && matchesStatus && matchesType
  })

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v);



  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#001F54] to-[#4DD0E1] bg-clip-text text-transparent">
            Quản lý Khuyến mãi
          </h1>
          <p className="text-gray-500 mt-1">Tạo, quản lý và theo dõi hiệu quả các chương trình khuyến mãi</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-[#81C784] text-white">
            {promotions.filter((p) => p.status === "active").length} đang hoạt động
          </Badge>
          <Badge className="bg-[#4DD0E1] text-white">
            {promotions.filter((p) => p.status === "scheduled").length} đã lên lịch
          </Badge>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setIsViewOrEditActive(false);
                  setExpandedPromoId(null);
                  setActionType(null);
                }}
                className="bg-[#001F54] hover:bg-[#001F54]/90">
                <Plus className="mr-2 h-4 w-4" />
                Tạo khuyến mãi mới

              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Tạo khuyến mãi mới</DialogTitle>
                <DialogDescription>Tạo chương trình khuyến mãi mới cho khách hàng</DialogDescription>
              </DialogHeader>
              <CreatePromotionForm
                nameRef={nameRef}
                codeRef={codeRef}
                typeRef={typeRef}
                valueRef={valueRef}
                statusRef={statusRef}
                startdateRef={startdateRef}
                enddateRef={enddateRef}
                minOrderValueRef={minOrderValueRef}
                maxDiscountRef={maxDiscountRef}
                usageLimitRef={usageLimitRef}
                descriptionRef={descriptionRef}
                perUserLimitRef={perUserLimitRef}
                handleSubmit={handleSubmit}

                handleCategoryChange={handleCategoryChange}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white shadow-lg">
          <TabsTrigger value="overview" className="data-[state=active]:bg-[#001F54] data-[state=active]:text-white">
            <TrendingUp className="w-4 h-4 mr-2" />
            Tổng quan
          </TabsTrigger>
          <TabsTrigger value="promotions" className="data-[state=active]:bg-[#4DD0E1] data-[state=active]:text-white">
            <Tag className="w-4 h-4 mr-2" />
            Danh sách
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-[#81C784] data-[state=active]:text-white">
            <Target className="w-4 h-4 mr-2" />
            Phân tích
          </TabsTrigger>
          <TabsTrigger value="templates" className="data-[state=active]:bg-[#FFB74D] data-[state=active]:text-white">
            <Gift className="w-4 h-4 mr-2" />
            Mẫu có sẵn
          </TabsTrigger>
        </TabsList>
{!isLoading ? (<TabsContent value="overview" className="space-y-6">
          
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          <Card className="relative overflow-hidden bg-gradient-to-br from-white to-blue-50/30 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#001F54]/5 to-[#4DD0E1]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-gray-600">Tổng doanh thu từ khuyến mãi</CardTitle>
              <div className="p-2 bg-gradient-to-r from-[#001F54] to-[#4DD0E1] rounded-lg">
                <DollarSign className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold bg-gradient-to-r from-[#001F54] to-[#4DD0E1] bg-clip-text text-transparent">
                {overviewData.revenue.toLocaleString("vi-VN")}
              </div>
              <div className="flex items-center mt-2">
                <div className="flex items-center text-emerald-600 text-sm font-medium">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +{overviewData.revenuePercentage}%
                </div>
                <span className="text-gray-500 text-sm ml-2">so so với tháng trước</span>
              </div>
              <Progress value={overviewData.revenuePercentage} className="mt-3 h-2" />
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-white to-cyan-50/30 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#4DD0E1]/5 to-[#81C784]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-gray-600">Đơn hàng có khuyến mãi</CardTitle>
              <div className="p-2 bg-gradient-to-r from-[#4DD0E1] to-[#81C784] rounded-lg">
                <ShoppingCart className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold bg-gradient-to-r from-[#4DD0E1] to-[#81C784] bg-clip-text text-transparent">
                {overviewData.order}
              </div>
              <div className="flex items-center mt-2">
                <div className="flex items-center text-emerald-600 text-sm font-medium">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +{overviewData.orderPercentage}%
                </div>
                <span className="text-gray-500 text-sm ml-2">so với tháng trước</span>
              </div>
              <Progress value={overviewData.orderPercentage} className="mt-3 h-2" />
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-white to-green-50/30 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#81C784]/5 to-[#4DD0E1]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-gray-600">Tỷ lệ chuyển đổi</CardTitle>
              <div className="p-2 bg-gradient-to-r from-[#81C784] to-[#4DD0E1] rounded-lg">
                <Target className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold bg-gradient-to-r from-[#81C784] to-[#4DD0E1] bg-clip-text text-transparent">
                {(overviewData.conversionRate  * 100).toFixed(2)}
              </div>
              <div className="flex items-center mt-2">
                <div className="flex items-center text-emerald-600 text-sm font-medium">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +{overviewData.conversionRatePercentage}%
                </div>
                <span className="text-gray-500 text-sm ml-2">so với tháng trước</span>
              </div>
              <Progress value={overviewData.conversionRatePercentage} className="mt-3 h-2" />
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-white to-red-50/30 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-gray-600">Khách hàng mới</CardTitle>
              <div className="p-2 bg-gradient-to-r from-[#4DD0E1] to-[#001F54] rounded-lg">
                <Users className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold bg-gradient-to-r from-[#4DD0E1] to-[#001F54] bg-clip-text text-transparent">{overviewData.newUser}</div>
              <div className="flex items-center mt-2">
                <div className="flex items-center text-cyan-500 text-sm font-medium">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +{overviewData.newUserPercentage}
                </div>
                <span className="text-gray-500 text-sm ml-2">Khách hàng mới</span>
              </div>
              <Progress value={overviewData.newUserPercentage} className="mt-3 h-2" />
            </CardContent>
          </Card>
        </div>




        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 bg-gradient-to-br from-white to-blue-50/50 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-[#001F54]" />
                <span>Hiệu quả Khuyến mãi theo Tháng</span>
              </CardTitle>
              <CardDescription>Doanh thu và đơn hàng từ các chương trình khuyến mãi</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={overviewData.promotionEffectivenessData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#666" />
                  <YAxis stroke="#666" tickFormatter={(value) => `₫${value / 1000000}M`} />
                  <Tooltip
                    formatter={(value: any, name: string) => {
                      if (name === "revenue") return [`₫${(value / 1000000).toFixed(0)}M`, "Doanh thu"]
                      if (name === "discount") return [`₫${(value / 1000000).toFixed(0)}M`, "Giảm giá"]
                      if (name === "orders") return [`₫${value}`, "Order"]
                      return [value, name]
                    }}
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Legend />
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#001F54" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#001F54" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="colorDiscount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4DD0E1" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#4DD0E1" stopOpacity={0.1} />
                      
                    </linearGradient>
                     <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
    <stop offset="5%" stopColor="#FF9800" stopOpacity={0.8} />
    <stop offset="95%" stopColor="#FF9800" stopOpacity={0.1} />
  </linearGradient>
                  </defs>
                 
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#001F54"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    name="Doanh thu"
                  />
                  <Area
                    type="monotone"
                    dataKey="discount"
                    stroke="#4DD0E1"
                    fillOpacity={1}
                    fill="url(#colorDiscount)"
                    name="Giảm giá"
                  />
               <Area
  type="monotone"
  dataKey="orders"
  stroke="#FF9800"
  fillOpacity={1}
  fill="url(#colorOrders)"
  name="Đơn hàng"
/>

                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-green-50/50 border-0 shadow-xl">
            <CardHeader>
              <CardTitle>Phân bố Loại Khuyến mãi</CardTitle>
              <CardDescription>Tỷ lệ sử dụng các loại khuyến mãi</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={overviewData.promotionTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {overviewData.promotionTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => [`${value}%`, "Tỷ lệ"]}
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {overviewData.promotionTypeData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-br from-white to-purple-50/50 border-0 shadow-xl">
          <CardHeader>
            <CardTitle>Top Khuyến mãi Hiệu quả</CardTitle>
            <CardDescription>Các chương trình khuyến mãi có hiệu quả cao nhất</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
  <BarChart data={overviewData.topPromotionsData}>
    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
    <XAxis dataKey="name" stroke="#666" />
    <YAxis stroke="#666" />
    <Tooltip
      formatter={(value: any, name: string) => {
        if (name === "orders") return [value, "Đơn hàng"];
        if (name === "revenue") return [`₫${(Number(value) / 1000000).toFixed(2)}M`, "Doanh thu"];
        if (name === "conversion") return [`${(Number(value) * 100).toFixed(2)}%`, "Tỷ lệ chuyển đổi"];
        return [value, name];
      }}
      contentStyle={{
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        border: "none",
        borderRadius: "12px",
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
      }}
    />
    <Legend />
    <Bar dataKey="orders" fill="#001F54" name="Đơn hàng" />
    <Bar dataKey="revenue" fill="#81C784" name="Doanh thu" />
    <Bar dataKey="conversion" fill="#4DD0E1" name="Tỷ lệ chuyển đổi" />
  </BarChart>
</ResponsiveContainer>

          </CardContent>
        </Card>
      </TabsContent>): (
            <div className = "fixed inset-0 bg-white/70 flex items-center justify-center z-50">
          <ScaleLoader color = "#001F54"  speedMultiplier = { 1.2 } />
        </div>
        )}
        {/* Tab Tổng quan */}
        

      {/* Tab Danh sách khuyến mãi */}
      <TabsContent value="promotions" className="space-y-6">
        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Tìm kiếm & Lọc Khuyến mãi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm theo tên hoặc mã khuyến mãi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="ACTIVE">Đang hoạt động</SelectItem>
                  <SelectItem value="SCHEDULED">Đã lên lịch</SelectItem>
                  <SelectItem value="EXPIRED">Đã hết hạn</SelectItem>
                  <SelectItem value="PAUSED">Tạm dừng</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Loại khuyến mãi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả loại</SelectItem>
                  <SelectItem value="PERCENTAGE">Giảm giá %</SelectItem>
                  <SelectItem value="FIXED">Giảm giá cố định</SelectItem>
                  <SelectItem value="SHIPPING">Miễn phí vận chuyển</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Promotions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách Khuyến mãi</CardTitle>
            <CardDescription>Tổng cộng {filteredPromotions.length} chương trình khuyến mãi</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên & Mã</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Giá trị</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Thời gian</TableHead>
                  <TableHead>Sử dụng</TableHead>
                  <TableHead>Hiệu quả</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPromotions.map((promo) => (
                  <React.Fragment key={promo.id}>
                    <TableRow>
                      {/* Dòng chính: thông tin khuyến mãi */}
                      <TableCell>
                        <div>
                          <div className="font-medium">{promo.name}</div>
                          <div className="text-sm text-gray-500 font-mono">{promo.code}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {promo.type === "PERCENTAGE" ? "Giảm %" : promo.type === "FIXED" ? "Cố định" : "Vận chuyển"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {promo.type === "PERCENTAGE"
                            ? `${promo.value}%`
                            : promo.type === "FIXED"
                              ? `₫${promo.value.toLocaleString()}`
                              : "Miễn phí"}
                        </div>
                        {promo.maxDiscount > 0 && (
                          <div className="text-xs text-gray-500">Tối đa ₫{promo.maxDiscount.toLocaleString()}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            promo.status === "ACTIVE"
                              ? "default"
                              : promo.status === "EXPIRED"
                                ? "destructive"
                                : "secondary"
                          }
                          className={
                            promo.status === "ACTIVE"
                              ? "bg-[#81C784] text-white"
                              : promo.status === "SCHEDULED"
                                ? "bg-[#4DD0E1] text-white"
                                : ""
                          }
                        >
                          {promo.status === "ACTIVE"
                            ? "Hoạt động"
                            : promo.status === "SCHEDULED"
                              ? "Đã lên lịch"
                              : promo.status === "EXPIRED"
                                ? "Hết hạn"
                                : "Tạm dừng"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{promo.startdate}</div>
                          <div className="text-gray-500">đến {promo.enddate}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">
                            {promo.usageCount}/{promo.usageLimit}
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                            <div
                              className="bg-[#4DD0E1] h-1.5 rounded-full"
                              style={{ width: `${(promo.usageCount / promo.usageLimit) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">₫{(promo.revenue / 1000000).toFixed(0)}M</div>
                          <div className="text-gray-500">{promo.orders} đơn hàng</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">

                            <DropdownMenuItem
                              onClick={() => {
                                setExpandedPromoId((prev) => (prev === promo.id ? null : promo.id));
                                setActionType("view");
                                if (isViewOrEditActive) return; // chặn bấm lại
                                setIsViewOrEditActive(true);
                              }}
                              disabled={isViewOrEditActive}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Xem chi tiết
                            </DropdownMenuItem>


                            <DropdownMenuItem
                              onClick={() => {
                                setExpandedPromoId((prev) => (prev === promo.id ? null : promo.id));
                                setActionType("edit");
                                if (isViewOrEditActive) return; // chặn bấm lại
                                setIsViewOrEditActive(true);
                                setTypePromotion((prev) => (prev === promo.type ? null : promo.type));
                              }}
                              disabled={isViewOrEditActive}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Chỉnh sửa
                            </DropdownMenuItem>

                            {isViewOrEditActive && (
                              <DropdownMenuItem className="text-red-600"
                                onClick={() => {
                                  setIsViewOrEditActive(false);
                                  setExpandedPromoId(null);
                                  setActionType(null);
                                }}

                              >
                                <X className="mr-2 h-4 w-4" />
                                Hủy
                              </DropdownMenuItem>
                            )}


                            <DropdownMenuSeparator />
                            {promo.status === "ACTIVE" ? (
                              <DropdownMenuItem className="text-orange-600"
                                onClick={() => handlePausePromotion(promo.id)}
                              >
                                <Pause className="mr-2 h-4 w-4" />
                                Tạm dừng
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem className="text-green-600"
                                onClick={() => handleActivatePromotion(promo.id)}
                              >
                                <Play className="mr-2 h-4 w-4" />
                                Kích hoạt
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="text-red-600"
                              onClick={() => deletePromotion(promo.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>

                    {expandedPromoId === promo.id && (
                      <TableRow>
                        <TableCell colSpan={8} className="bg-gray-50">
                          {actionType === "view" ? (
                            <div className="grid grid-cols-3 gap-6 text-sm bg-white p-6 rounded-lg border shadow-sm">
                              {[
                                { label: "ID", value: promo.id },
                                { label: "Code", value: promo.code },
                                { label: "Loại", value: promo.type === "PERCENTAGE" ? "Giảm %" : promo.type === "FIXED" ? "Cố định" : "Khác" },
                                { label: "Giá trị", value: promo.value + (promo.type === "PERCENTAGE" ? "%" : ` ₫`) },
                                { label: "Trạng thái", value: promo.status },
                                { label: "Ngày bắt đầu", value: promo.startdate },
                                { label: "Ngày kết thúc", value: promo.enddate },
                                { label: "Sử dụng", value: `${promo.usageCount} / ${promo.usageLimit}` },
                                { label: "Đơn tối thiểu", value: `₫${promo.minOrderValue.toLocaleString()}` },
                                { label: "Giảm tối đa", value: `₫${promo.maxDiscount.toLocaleString()}` },
                                { label: "Doanh thu", value: `₫${promo.revenue}` },
                                { label: "Đơn hàng", value: promo.orders },
                                { label: "Danh mục", value: promo.categories.map((c) => c.label).join(", ") || "Không có" },
                                { label: "Mô tả", value: promo.description || "Không có mô tả" },
                              ].map((item, index) => (
                                <div key={index}>
                                  <p className="text-gray-500 font-medium">{item.label}</p>
                                  <p className="text-gray-800 break-words whitespace-pre-wrap overflow-auto">
                                    {item.value}
                                  </p>
                                </div>
                              ))}
                            </div>
                          ) : (

                            <form onSubmit={(e) => handleSubmit(e, "update")} className="grid grid-cols-3 gap-6 text-sm bg-white p-6 rounded-lg border shadow-sm">
                              <div className="col-span-3">
                                <label className="block text-gray-600 mb-1 font-medium">Tên chương trình</label>
                                <input
                                  ref={nameRef}
                                  defaultValue={promo.name}
                                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                              </div>

                              <div>
                                <label className="block text-gray-600 mb-1 font-medium">Mã khuyến mãi</label>
                                <input
                                  ref={codeRef}
                                  defaultValue={promo.code}
                                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                              </div>

                              <div>
                                <label className="block text-gray-600 mb-1 font-medium">Loại</label>
                                <select
                                  ref={typeRef}
                                  defaultValue={promo.type}
                                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                  onChange={(e) => setTypePromotion(e.target.value as "FIXED" | "PERCENTAGE" | "SHIPPING")}

                                >
                                  <option value="PERCENTAGE">Giảm %</option>
                                  <option value="FIXED">Cố định</option>
                                  <option value="SHIPPING">Miễn phí vận chuyển</option>
                                </select>
                              </div>
                              {typePromotion === "PERCENTAGE" ? (
                                <div>
                                  <label className="block text-gray-600 mb-1 font-medium">
                                    Giá trị{" "}
                                    <span className="text-sm text-gray-400 font-normal">(%)</span>
                                  </label>
                                  <input
                                    ref={valueRef}
                                    type="number"
                                    defaultValue={promo.value}
                                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"

                                  />
                                </div>
                              ) : (
                                <div>
                                  <label className="block text-gray-600 mb-1 font-medium">
                                    Giá trị{" "}
                                    <span className="text-sm text-gray-400 font-normal">(Cố định )</span>
                                  </label>
                                  <input
                                    ref={valueRef}
                                    type="number"
                                    defaultValue={promo.value}
                                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"

                                  />
                                </div>
                              )}

                              <div>
                                <label className="block text-gray-600 mb-1 font-medium">Trạng thái</label>
                                <input
                                  ref={statusRef}
                                  defaultValue={promo.status}
                                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                  readOnly
                                />

                              </div>
                              <div>
                                <label className="block text-gray-600 mb-1 font-medium">Ngày bắt đầu</label>
                                <input
                                  ref={startdateRef}
                                  type="datetime-local"
                                  defaultValue={promo.startdate}
                                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"

                                />
                              </div>
                              <div>
                                <label className="block text-gray-600 mb-1 font-medium">Ngày kết thúc</label>
                                <input
                                  ref={enddateRef}
                                  type="datetime-local"
                                  defaultValue={promo.enddate}
                                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                              </div>
                              <div>
                                <label className="block text-gray-600 mb-1 font-medium">Đơn tối thiểu</label>
                                <input
                                  ref={minOrderValueRef}
                                  type="number"
                                  defaultValue={promo.minOrderValue}
                                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                              </div>
                              {
                                typePromotion === "PERCENTAGE" ? (
                                  <div>
                                    <label className="block text-gray-600 mb-1 font-medium">Giảm tối đa</label>
                                    <input
                                      ref={maxDiscountRef}
                                      type="number"
                                      placeholder="Chỉ dành cho loại khuyến mãi theo %"
                                      defaultValue={promo.maxDiscount}
                                      className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                  </div>
                                ) : (
                                  <div>
                                    <label className="block text-gray-600 mb-1 font-medium">
                                      Giảm tối đa{" "}
                                      <span className="text-sm text-gray-400 font-normal">(Chỉ dành cho loại giảm giá %.)</span>
                                    </label>

                                    <input
                                      ref={maxDiscountRef}
                                      type="number"
                                      placeholder="Chỉ dành cho loại khuyến mãi theo %"
                                      defaultValue={promo.maxDiscount}
                                      className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                      readOnly
                                    />
                                  </div>
                                )
                              }


                              <div>
                                <label className="block text-gray-600 mb-1 font-medium">Danh mục</label>




                                <CategoryMultiSelect

                                  defaultCategories={promo.categories}

                                  //                                     onChange={(selected) => {
                                  //   if (!selected || selected.length === 0) {
                                  //     handleCategoryChange(promo.categories || []);
                                  //   } else {
                                  //     handleCategoryChange(selected);
                                  //   }
                                  // }}
                                  onChange={(selected) => {
                                    handleCategoryChange(selected || []);
                                  }}
                                />




                              </div>
                              <div>
                                <label className="block text-gray-600 mb-1 font-medium">Giới hạn sử dụng</label>
                                <input
                                  ref={usageLimitRef}
                                  type="number"
                                  defaultValue={promo.usageLimit}
                                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                              </div>
                              <div>
                                <label className="block text-gray-600 mb-1 font-medium">Giới hạn sử dụng khuyến mãi / 1 người </label>
                                <input
                                  ref={perUserLimitRef}
                                  type="number"
                                  defaultValue={promo.perUserLimit}
                                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                              </div>
                              <div>
                                <label className="block text-gray-600 mb-1 font-medium">Mô tả</label>
                                <input
                                  ref={descriptionRef}
                                  defaultValue={promo.description}
                                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                              </div>


                              <div className="col-span-3">
                                <button
                                  type="submit"
                                  className="bg-gradient-to-r from-[#001F54] to-[#4DD0E1] text-white  py-2 px-6 rounded-lg hover:shadow-md transition-all"
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

              </TableBody>
            </Table>
          </CardContent>


        </Card>
      </TabsContent>

      {/* Tab Phân tích */}
      <TabsContent value="analytics" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-white to-blue-50/50 border-0 shadow-xl">
            <CardHeader>
              <CardTitle>Xu hướng Sử dụng Khuyến mãi</CardTitle>
              <CardDescription>Số lượng đơn hàng sử dụng khuyến mãi theo tháng</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={overviewData.promotionEffectivenessData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip
                    formatter={(value: any) => [value, "Đơn hàng"]}
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke="#001F54"
                    strokeWidth={3}
                    dot={{ fill: "#001F54", r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-green-50/50 border-0 shadow-xl">
            <CardHeader>
              <CardTitle>ROI Khuyến mãi</CardTitle>
              <CardDescription>Tỷ suất sinh lời từ các chương trình khuyến mãi</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#001F54]/10 to-[#4DD0E1]/10 rounded-lg">
                  <div>
                    <div className="text-sm text-gray-600">ROI trung bình</div>
                    <div className="text-2xl font-bold text-[#001F54]"> {(averageROI * 100).toFixed(0)}%</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Tháng này</div>
                    <div className="text-lg font-medium text-[#81C784]">+12.5%</div>
                  </div>
                </div>
                <div className="space-y-3">
                  {overviewData.topPromotionsData.map((promo, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{promo.name}</div>
                        <div className="text-sm text-gray-500">
                          {promo.orders} đơn hàng • ₫{(promo.revenue / 1000000)}M
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-[#001F54]">{(promo.roi * 100).toFixed(0)}%</div>
                        <div className="text-xs text-gray-500">ROI</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* Tab Mẫu có sẵn */}
      <TabsContent value="templates" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <PromotionTemplate
            title="Flash Sale"
            description="Giảm giá sâu trong thời gian ngắn"
            icon={<Tag className="w-6 h-6" />}
            color="bg-red-500"
            fetchData={fetchData}
          />
          <PromotionTemplate
            title="Miễn phí vận chuyển"
            description="Khuyến khích mua hàng với vận chuyển miễn phí"
            icon={<Truck className="w-6 h-6" />}
            color="bg-blue-500"
            fetchData={fetchData}
          />
          <PromotionTemplate
            title="Mua 1 tặng 1"
            description="Tăng số lượng sản phẩm bán ra"
            icon={<Gift className="w-6 h-6" />}
            color="bg-green-500"
            fetchData={fetchData}
          />
          <PromotionTemplate
            title="Giảm giá sinh nhật"
            description="Chương trình đặc biệt cho khách hàng"
            icon={<Calendar className="w-6 h-6" />}
            color="bg-purple-500"
            fetchData={fetchData}
          />
          <PromotionTemplate
            title="Khuyến mãi khách hàng mới"
            description="Thu hút khách hàng lần đầu mua hàng"
            icon={<Users className="w-6 h-6" />}
            color="bg-orange-500"
            fetchData={fetchData}
          />
          <PromotionTemplate
            title="Combo giảm giá"
            description="Giảm giá khi mua nhiều sản phẩm"
            icon={<Package className="w-6 h-6" />}
            color="bg-indigo-500"
            fetchData={fetchData}
          />
        </div>
      </TabsContent>
    </Tabs>
    </div >
  )
}


function CreatePromotionForm({
  nameRef,
  codeRef,
  typeRef,
  valueRef,
  statusRef,
  startdateRef,
  enddateRef,
  minOrderValueRef,
  maxDiscountRef,
  usageLimitRef,
  descriptionRef,
  perUserLimitRef,
  handleSubmit,
  handleCategoryChange,

}: CreatePromotionFormProps) {
  return (
    <form onSubmit={(e) => handleSubmit(e, "add")}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Tên khuyến mãi
          </Label>
          <Input id="name" ref={nameRef} placeholder="Nhập tên khuyến mãi" className="col-span-3" />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="code" className="text-right">
            Mã khuyến mãi
          </Label>
          <Input id="code" ref={codeRef} placeholder="VD: SUMMER2024" className="col-span-3" />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="type" className="text-right whitespace-nowrap">
            Loại khuyến mãi
          </Label>
          <select ref={typeRef} id="type" className="col-span-3 border rounded-md px-4 py-2">
            <option value="PERCENTAGE">Giảm giá theo phần trăm</option>
            <option value="FIXED">Giảm giá cố định</option>
            <option value="SHIPPING">Miễn phí vận chuyển</option>
          </select>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="value" className="text-right">
            Giá trị
          </Label>
          <Input id="value" ref={valueRef} type="number" placeholder="VD: 20 (%) hoặc 100000" className="col-span-3" />
        </div>

        {/* <div className="grid grid-cols-4 items-center gap-4"> */}
        <Label htmlFor="status" className="text-right" hidden>
          Trạng thái
        </Label>
        <Input id="status" value={"SCHEDULED"} ref={statusRef} placeholder="active | inactive | draft..." className="col-span-3" hidden />
        {/* </div> */}

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="startdate" className="text-right">
            Ngày bắt đầu
          </Label>
          <Input id="startdate" ref={startdateRef} type="datetime-local" className="col-span-3" />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="enddate" className="text-right">
            Ngày kết thúc
          </Label>
          <Input id="enddate" ref={enddateRef} type="datetime-local" className="col-span-3" />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="usageLimit" className="text-right whitespace-nowrap">
            Giới hạn sử dụng
          </Label>
          <Input id="usageLimit" ref={usageLimitRef} type="number" placeholder="VD: 1000" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="perUserLimit" className="text-right whitespace-nowrap">
            Giới hạn KM/1 người
          </Label>
          <Input id="perUserLimit" ref={perUserLimitRef} type="number" placeholder="VD: 1" className="col-span-3" />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="minOrderValue" className="text-right whitespace-nowrap">
            Đơn hàng tối thiểu
          </Label>
          <Input id="minOrderValue" ref={minOrderValueRef} type="number" placeholder="VD: 500000" className="col-span-3" />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="maxDiscount" className="text-right">
            Giảm giá tối đa
          </Label>
          <Input id="maxDiscount" ref={maxDiscountRef} type="number" placeholder="VD: 200000" className="col-span-3" />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="categories" className="text-right whitespace-nowrap">
            Danh mục áp dụng
          </Label>
          <div className="col-span-3">

            <CategoryMultiSelect
              //  value={selectedCategories} onChange={handleCategoryChange} 

              onChange={(selected) => handleCategoryChange(selected)}
            />
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="description" className="text-right">
            Mô tả
          </Label>
          <Input id="description" ref={descriptionRef} placeholder="Mô tả chi tiết về khuyến mãi" className="col-span-3" />
        </div>

        <DialogFooter>
          <Button type="submit" className="bg-[#001F54] hover:bg-[#001F54]/90">
            Tạo khuyến mãi
          </Button>
        </DialogFooter>
      </div>
    </form>
  );
}

function PromotionTemplate({
  title,
  description,
  icon,
  color,
  fetchData
}: {
  title: string
  description: string
  icon: React.ReactNode
  color: string
  fetchData: () => void
}) {
  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${color} text-white`}>{icon}</div>
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Button
          onClick={() => templatePromotion(title, fetchData)}
          variant="outline" className="w-full">
          Sử dụng mẫu này
        </Button>
      </CardContent>
    </Card>
  )
}
