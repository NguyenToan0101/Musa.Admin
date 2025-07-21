"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  PieChart,
  Pie,
  Cell,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts"
import { TrendingUp, DollarSign, Users, Package, Target, Calendar, PieChartIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import axios from "axios"
import { useEffect, useState } from "react"

import ScaleLoader from 'react-spinners/ScaleLoader'



export function AnalyticsDashboard() {
  // Dữ liệu doanh thu theo năm
const [yearlyRevenueData, setyearlyRevenueData]  = useState([
  { year: "2020", revenue: 1250000000, profit: 320000000, cost: 930000000 },
  // { year: "2021", revenue: 1850000000, profit: 480000000, cost: 1370000000 },
  // { year: "2022", revenue: 2450000000, profit: 680000000, cost: 1770000000 },
  // { year: "2023", revenue: 3200000000, profit: 950000000, cost: 2250000000 },
  // { year: "2024", revenue: 4100000000, profit: 1250000000, cost: 2850000000 },
])

// Dữ liệu doanh thu theo tháng
const [monthlyRevenueData, setmonthlyRevenueData] = useState( [
  { month: "01/2024", revenue: 320000000, profit: 95000000, cost: 225000000 },
  // { month: "02/2024", revenue: 340000000, profit: 102000000, cost: 238000000 },
  // { month: "03/2024", revenue: 380000000, profit: 115000000, cost: 265000000 },
  // { month: "04/2024", revenue: 360000000, profit: 108000000, cost: 252000000 },
  // { month: "05/2024", revenue: 410000000, profit: 125000000, cost: 285000000 },
  // { month: "06/2024", revenue: 450000000, profit: 135000000, cost: 315000000 },
])

// Dữ liệu phân tích người dùng theo khu vực
const [userRegionData,setuserRegionData] =useState( [
  { region: "Miền Bắc", users: 12500, percentage: 35 },
  // { region: "Miền Trung", users: 8200, percentage: 23 },
  // { region: "Miền Nam", users: 15000, percentage: 42 },
])

// Dữ liệu phân tích người dùng theo thiết bị
const [userDeviceData,setuserDeviceData] =useState( [
  { name: "Mobile", value: 65, color: "#4DD0E1" },
  // { name: "Desktop", value: 25, color: "#001F54" },
  // { name: "Tablet", value: 10, color: "#81C784" },
])

// Dữ liệu phân tích người dùng theo độ tuổi và giới tính
const [userDemographicsData, setuserDemographicsData] = useState ([
  { ageGroup: "18-25", male: 2400, female: 2800, total: 5200 },
  { ageGroup: "26-35", male: 3200, female: 3600, total: 6800 },
  { ageGroup: "36-45", male: 2800, female: 2400, total: 5200 },
  { ageGroup: "46-55", male: 1800, female: 1600, total: 3400 },
  { ageGroup: "55+", male: 1200, female: 1000, total: 2200 },
])

// Dữ liệu phân tích sản phẩm theo danh mục
const [productCategoryData,setproductCategoryData] =useState( [
  { category: "Điện tử", products: 1250, sales: 45000, revenue: 1350000000 },
  // { category: "Thời trang", products: 2800, sales: 38000, revenue: 950000000 },
  // { category: "Gia dụng", products: 1500, sales: 25000, revenue: 750000000 },
  // { category: "Mỹ phẩm", products: 950, sales: 18000, revenue: 650000000 },
  // { category: "Thực phẩm", products: 1200, sales: 22000, revenue: 550000000 },
  // { category: "Sách", products: 3500, sales: 15000, revenue: 450000000 },
])

// Dữ liệu phân tích sản phẩm theo đánh giá
const [productRatingData,setproductRatingData] = useState([
  { rating: "5 sao", count: 12500, percentage: 45 },
  // { rating: "4 sao", count: 8200, percentage: 30 },
  // { rating: "3 sao", count: 4100, percentage: 15 },
  // { rating: "2 sao", count: 1650, percentage: 6 },
  // { rating: "1 sao", count: 1100, percentage: 4 },
])

// Dữ liệu phân tích đơn hàng theo trạng thái
const [orderStatusData,setorderStatusData] =useState( [
  { status: "Hoàn thành", value: 68, color: "#81C784" },
  // { status: "Đang xử lý", value: 18, color: "#4DD0E1" },
  // { status: "Đang giao", value: 10, color: "#FFB74D" },
  // { status: "Đã hủy", value: 4, color: "#E57373" },
])

// Dữ liệu phân tích đơn hàng theo phương thức thanh toán
const [paymentMethodData,setpaymentMethodData] =useState( [
  { method: "Thẻ tín dụng", value: 45, color: "#001F54" },
  // { method: "Ví điện tử", value: 30, color: "#4DD0E1" },
  // { method: "COD", value: 20, color: "#81C784" },
  // { method: "Chuyển khoản", value: 5, color: "#FFB74D" },
])

// Dữ liệu phân tích đơn hàng theo thời gian trong ngày
const [orderTimeData,setorderTimeData] = useState([
  { time: "00:00 - 04:00", orders: 850 },
  // { time: "04:00 - 08:00", orders: 1200 },
  // { time: "08:00 - 12:00", orders: 3500 },
  // { time: "12:00 - 16:00", orders: 4200 },
  // { time: "16:00 - 20:00", orders: 3800 },
  // { time: "20:00 - 24:00", orders: 2500 },
])

// Dữ liệu phân tích chất lượng dịch vụ
const [serviceQualityData,setserviceQualityData] =useState( [
  { metric: "Độ tin cậy", score: 92 },
  // { metric: "Khả năng đáp ứng", score: 85 },
  // { metric: "Sự đảm bảo", score: 88 },
  // { metric: "Sự đồng cảm", score: 90 },
  // { metric: "Tính hữu hình", score: 82 },
])
  const [isLoading, setIsLoading] = useState(false);
const fetchData = async() =>{
  setIsLoading(true)
  try{
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BACKEND}/statistics/data`);
    if(response.data != null){
        setserviceQualityData(response.data.serviceQualityDTOS)
        setorderTimeData(response.data.orderTimeDTOS)
        setpaymentMethodData(response.data.paymentMethodDTOS)
        setorderStatusData(response.data.orderStatusDTOS)
        setproductRatingData(response.data.productRatingDTOS)
        setproductCategoryData(response.data.productCategoryDTOS)
        setuserDeviceData(response.data.userDeviceDTOS)
        setuserRegionData(response.data.userRegionDTOS)
        setmonthlyRevenueData(response.data.monthlyRevenueDTOS)
        setyearlyRevenueData(response.data.yearlyRevenueDTOS)
        console.log(response.data)
    }else{
      console.log('Data is null')
    }
  }catch(error){
    console.log('API: Error', error)
  }finally {
      setIsLoading(false)
    }
}

useEffect(()=>{
  fetchData()
},[])
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#001F54] to-[#4DD0E1] bg-clip-text text-transparent">
            Thống kê & Báo cáo Chi tiết
          </h1>
          <p className="text-gray-500 mt-1">Phân tích dữ liệu chi tiết và báo cáo toàn diện</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Select defaultValue="month">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Chọn thời gian" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Hôm nay</SelectItem>
              <SelectItem value="week">Tuần này</SelectItem>
              <SelectItem value="month">Tháng này</SelectItem>
              <SelectItem value="quarter">Quý này</SelectItem>
              <SelectItem value="year">Năm nay</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-[#001F54] hover:bg-[#001F54]/90">
            <Calendar className="mr-2 h-4 w-4" /> Tùy chỉnh
          </Button>
          <Button variant="outline">
            <PieChartIcon className="mr-2 h-4 w-4" /> Xuất báo cáo
          </Button>
        </div>
      </div>

      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white shadow-lg">
          <TabsTrigger value="revenue" className="data-[state=active]:bg-[#001F54] data-[state=active]:text-white">
            <DollarSign className="w-4 h-4 mr-2" />
            Doanh thu
          </TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:bg-[#4DD0E1] data-[state=active]:text-white">
            <Users className="w-4 h-4 mr-2" />
            Người dùng
          </TabsTrigger>
          <TabsTrigger value="products" className="data-[state=active]:bg-[#81C784] data-[state=active]:text-white">
            <Package className="w-4 h-4 mr-2" />
            Sản phẩm
          </TabsTrigger>
          <TabsTrigger value="orders" className="data-[state=active]:bg-[#FFB74D] data-[state=active]:text-white">
            <Target className="w-4 h-4 mr-2" />
            Đơn hàng
          </TabsTrigger>
        </TabsList>

        {/* Tab Doanh thu */}
        {!isLoading ? (<TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-white to-blue-50/50 border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-[#001F54]" />
                  <span>Doanh thu theo Năm</span>
                </CardTitle>
                <CardDescription>Phân tích doanh thu, lợi nhuận và chi phí theo năm</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <ComposedChart data={yearlyRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="year" stroke="#666" />
                    <YAxis stroke="#666" tickFormatter={(value) => `₫${value / 1000000000}B`} />
                    <Tooltip
                      formatter={(value: any, name: string) => {
                        if (name === "revenue") return [`₫${(value / 1000000000).toFixed(2)}B`, "Doanh thu"]
                        if (name === "profit") return [`₫${(value / 1000000000).toFixed(2)}B`, "Lợi nhuận"]
                        if (name === "cost") return [`₫${(value / 1000000000).toFixed(2)}B`, "Chi phí"]
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
                    <Bar dataKey="revenue" fill="url(#revenueGradient)" radius={[4, 4, 0, 0]} name="Doanh thu" />
                    <Line
                      type="monotone"
                      dataKey="profit"
                      stroke="#81C784"
                      strokeWidth={3}
                      dot={{ fill: "#81C784", r: 6 }}
                      name="Lợi nhuận"
                    />
                    <Line
                      type="monotone"
                      dataKey="cost"
                      stroke="#E57373"
                      strokeWidth={3}
                      dot={{ fill: "#E57373", r: 6 }}
                      name="Chi phí"
                    />
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#001F54" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#4DD0E1" stopOpacity={0.3} />
                      </linearGradient>
                    </defs>
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white to-green-50/50 border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Doanh thu theo Tháng (2024)</CardTitle>
                <CardDescription>Phân tích chi tiết doanh thu, lợi nhuận và chi phí theo tháng</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={monthlyRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#666" />
                    <YAxis stroke="#666" tickFormatter={(value) => `₫${value / 1000000}M`} />
                    <Tooltip
                      formatter={(value: any, name: string) => {
                        if (name === "revenue") return [`₫${(value / 1000000).toFixed(0)}M`, "Doanh thu"]
                        if (name === "profit") return [`₫${(value / 1000000).toFixed(0)}M`, "Lợi nhuận"]
                        if (name === "cost") return [`₫${(value / 1000000).toFixed(0)}M`, "Chi phí"]
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
                      <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#81C784" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#81C784" stopOpacity={0.1} />
                      </linearGradient>
                      <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#E57373" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#E57373" stopOpacity={0.1} />
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
                      dataKey="profit"
                      stroke="#81C784"
                      fillOpacity={1}
                      fill="url(#colorProfit)"
                      name="Lợi nhuận"
                    />
                    <Area
                      type="monotone"
                      dataKey="cost"
                      stroke="#E57373"
                      fillOpacity={1}
                      fill="url(#colorCost)"
                      name="Chi phí"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-br from-white to-purple-50/50 border-0 shadow-xl">
            <CardHeader>
              <CardTitle>Phân tích Doanh thu theo Khu vực</CardTitle>
              <CardDescription>So sánh doanh thu theo vùng miền và tỉnh thành</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={userRegionData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" stroke="#666" />
                    <YAxis dataKey="region" type="category" stroke="#666" />
                    <Tooltip
                      formatter={(value: any) => [`${value.toLocaleString()} người dùng`, "Số lượng"]}
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        border: "none",
                        borderRadius: "12px",
                        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="users" name="Người dùng">
                      {userRegionData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={index === 0 ? "#001F54" : index === 1 ? "#4DD0E1" : "#81C784"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1">
                <div className="h-[400px] flex items-center justify-center">
                  <div className="w-full max-w-md">
                    <h3 className="text-lg font-medium mb-4 text-center">Phân bố theo khu vực</h3>
                    <div className="space-y-4">
                      {userRegionData.map((item, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="font-medium">{item.region}</span>
                            <span>{item.percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="h-2.5 rounded-full"
                              style={{
                                width: `${item.percentage}%`,
                                backgroundColor: index === 0 ? "#001F54" : index === 1 ? "#4DD0E1" : "#81C784",
                              }}
                            ></div>
                          </div>
                          <div className="text-sm text-gray-500">{item.users.toLocaleString()} người dùng</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>) : ( <div className = "fixed inset-0 bg-white/70 flex items-center justify-center z-50">
          <ScaleLoader color = "#001F54"  speedMultiplier = { 1.2 } />
        </div>)}
        

        {/* Tab Người dùng */}
        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-white to-cyan-50/50 border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Phân bố Thiết bị</CardTitle>
                <CardDescription>Người dùng theo loại thiết bị truy cập</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={userDeviceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {userDeviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: any) => [`${value.toFixed(2)}%`, "Tỷ lệ"]}
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
                  {userDeviceData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <span className="text-sm font-medium">{item.value.toFixed(2)}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 bg-gradient-to-br from-white to-blue-50/50 border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Phân tích Nhân khẩu học</CardTitle>
                <CardDescription>Phân bố người dùng theo độ tuổi và giới tính</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={userDemographicsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="ageGroup" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        border: "none",
                        borderRadius: "12px",
                        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="male" stackId="a" fill="#001F54" name="Nam" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="female" stackId="a" fill="#4DD0E1" name="Nữ" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-br from-white to-purple-50/50 border-0 shadow-xl">
            <CardHeader>
              <CardTitle>Chất lượng Dịch vụ & Trải nghiệm Người dùng</CardTitle>
              <CardDescription>Đánh giá đa chiều về chất lượng dịch vụ</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <ResponsiveContainer width="100%" height={350}>
                    <RadarChart data={serviceQualityData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metric" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar
                        name="Điểm số"
                        dataKey="score"
                        stroke="#001F54"
                        fill="#4DD0E1"
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                      <Tooltip
                        formatter={(value: any) => [`${value}/100`, "Điểm số"]}
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          border: "none",
                          borderRadius: "12px",
                          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col justify-center">
                  <h3 className="text-lg font-medium mb-4">Điểm số chi tiết</h3>
                  <div className="space-y-4">
                    {serviceQualityData.map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">{item.metric}</span>
                          <span>{item.score}/100</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="h-2.5 rounded-full"
                            style={{
                              width: `${item.score}%`,
                              backgroundColor: item.score > 90 ? "#81C784" : item.score > 80 ? "#4DD0E1" : "#001F54",
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Sản phẩm */}
        <TabsContent value="products" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-white to-green-50/50 border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Phân tích theo Danh mục</CardTitle>
                <CardDescription>So sánh số lượng sản phẩm và doanh thu theo danh mục</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <ComposedChart data={productCategoryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="category" stroke="#666" />
                    <YAxis yAxisId="left" stroke="#666" />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="#666"
                      tickFormatter={(value) => `₫${value / 1000000}M`}
                    />
                    <Tooltip
                      formatter={(value: any, name: string) => {
                        if (name === "products") return [value.toLocaleString(), "Sản phẩm"]
                        if (name === "sales") return [value.toLocaleString(), "Lượt bán"]
                        if (name === "revenue") return [`₫${(value / 1000000).toFixed(0)}M`, "Doanh thu"]
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
                    <Bar yAxisId="left" dataKey="products" fill="#001F54" name="Sản phẩm" />
                    <Bar yAxisId="left" dataKey="sales" fill="#4DD0E1" name="Lượt bán" />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="revenue"
                      stroke="#81C784"
                      strokeWidth={3}
                      dot={{ fill: "#81C784", r: 6 }}
                      name="Doanh thu"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white to-orange-50/50 border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Phân tích Đánh giá Sản phẩm</CardTitle>
                <CardDescription>Phân bố đánh giá sản phẩm theo số sao</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={productRatingData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="rating" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip
                      formatter={(value: any, name: string) => {
                        if (name === "count") return [value.toLocaleString(), "Số lượng"]
                        if (name === "percentage") return [`${value.toFixed(2)}%`, "Tỷ lệ"]

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
                    <Bar dataKey="count" fill="url(#ratingGradient)" name="Số lượng" />
                    <defs>
                      <linearGradient id="ratingGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FFB74D" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#FFB74D" stopOpacity={0.3} />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {productRatingData.map((item, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between">
                        <span className="font-medium">{item.rating}</span>
                        <span>{item.percentage.toFixed(2)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${item.percentage.toFixed(2)}%`,
                            backgroundColor:
                              index === 0
                                ? "#81C784"
                                : index === 1
                                  ? "#4DD0E1"
                                  : index === 2
                                    ? "#FFB74D"
                                    : index === 3
                                      ? "#FFB74D"
                                      : "#E57373",
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab Đơn hàng */}
        <TabsContent value="orders" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-white to-blue-50/50 border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Trạng thái Đơn hàng</CardTitle>
                <CardDescription>Phân bố đơn hàng theo trạng thái xử lý</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={orderStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {orderStatusData.map((entry, index) => (
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
                  {orderStatusData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm">{item.status}</span>
                      </div>
                      <span className="text-sm font-medium">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white to-purple-50/50 border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Phương thức Thanh toán</CardTitle>
                <CardDescription>Phân bố đơn hàng theo phương thức thanh toán</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={paymentMethodData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {paymentMethodData.map((entry, index) => (
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
                  {paymentMethodData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm">{item.method}</span>
                      </div>
                      <span className="text-sm font-medium">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-br from-white to-green-50/50 border-0 shadow-xl">
            <CardHeader>
              <CardTitle>Phân bố Đơn hàng theo Thời gian</CardTitle>
              <CardDescription>Số lượng đơn hàng theo khung giờ trong ngày</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={orderTimeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="time" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip
                    formatter={(value: any) => [`${value.toLocaleString()} đơn hàng`, "Số lượng"]}
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="orders" name="Đơn hàng">
                    {orderTimeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(${200 + index * 10}, 70%, ${50 + index * 5}%)`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
