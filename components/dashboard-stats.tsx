"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState, useRef } from "react"
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
  Scatter,
  ScatterChart,
  FunnelChart,
  Funnel,
  LabelList,
  PieChart,
  Pie,
  Cell,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts"
import { TrendingUp, DollarSign, Users, Package, Target, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import axios from "axios"
import ScaleLoader from 'react-spinners/ScaleLoader'





export function DashboardStats() {
// Dữ liệu cho biểu đồ doanh thu chi tiết theo quý
const [quarterlyRevenueData, setquarterlyRevenueData] =  useState([
  { quarter: "Q1 2023", revenue: 450000000, growth: 12, orders: 15420, avgOrder: 29200 },
  // { quarter: "Q2 2023", revenue: 520000000, growth: 15.5, orders: 17800, avgOrder: 29200 },
  // { quarter: "Q3 2023", revenue: 580000000, growth: 11.5, orders: 19200, avgOrder: 30200 },
  // { quarter: "Q4 2023", revenue: 680000000, growth: 17.2, orders: 22100, avgOrder: 30800 },
  // { quarter: "Q1 2024", revenue: 750000000, growth: 66.7, orders: 24300, avgOrder: 30900 },
  // { quarter: "Q2 2024", revenue: 820000000, growth: 57.7, orders: 26500, avgOrder: 31000 },
])

// Dữ liệu phân tích người dùng theo độ tuổi và giới tính
const [userDemographicsData,setuserDemographicsData] = useState([
  { ageGroup: "18-25", male: 2400, female: 2800, total: 5200 },
  { ageGroup: "26-35", male: 3200, female: 3600, total: 6800 },
  { ageGroup: "36-45", male: 2800, female: 2400, total: 5200 },
  { ageGroup: "46-55", male: 1800, female: 1600, total: 3400 },
  { ageGroup: "55+", male: 1200, female: 1000, total: 2200 },
])

// Dữ liệu conversion funnel
const [conversionFunnelData, setconversionFunnelData] = useState ([
  { name: "Lượt truy cập", value: 100000, fill: "#001F54" },
  // { name: "Xem sản phẩm", value: 45000, fill: "#1E3A8A" },
  // { name: "Thêm vào giỏ", value: 18000, fill: "#3B82F6" },
  // { name: "Bắt đầu thanh toán", value: 12000, fill: "#60A5FA" },
  // { name: "Hoàn thành đơn hàng", value: 8500, fill: "#93C5FD" },
])

// Dữ liệu hiệu suất bán hàng theo khu vực
const [regionPerformanceData, setregionPerformanceData] = useState([
  { region: "Hà Nội", revenue: 180000000,orders : 8500 },
  // { region: "TP.HCM", revenue: 250000000, orders: 11200, customers: 15800 },
  // { region: "Đà Nẵng", revenue: 95000000, orders: 4200, customers: 6500 },
  // { region: "Cần Thơ", revenue: 75000000, orders: 3800, customers: 5200 },
  // { region: "Hải Phòng", revenue: 85000000, orders: 4100, customers: 5800 },
  // { region: "Khác", revenue: 65000000, orders: 3200, customers: 4700 },
])

// Dữ liệu TreeMap cho sản phẩm bán chạy
const [topProductsData, settopProductsData] = useState([
  { name: "iPhone 15", value: 45000000, category: "Điện tử" },
  // { name: "Samsung Galaxy", value: 38000000, category: "Điện tử" },
  // { name: "Áo thun nam", value: 25000000, category: "Thời trang" },
  // { name: "Giày sneaker", value: 32000000, category: "Giày dép" },
  // { name: "Laptop Dell", value: 28000000, category: "Máy tính" },
  // { name: "Túi xách nữ", value: 22000000, category: "Thời trang" },
  // { name: "Đồng hồ thông minh", value: 18000000, category: "Điện tử" },
  // { name: "Quần jeans", value: 15000000, category: "Thời trang" },
])

// Dữ liệu Radar Chart cho đánh giá chất lượng dịch vụ
const [serviceQualityData,setserviceQualityData] = useState([
  { metric: "Giao hàng", score: 85, fullMark: 100 },
  // { metric: "Chất lượng SP", score: 92, fullMark: 100 },
  // { metric: "Hỗ trợ KH", score: 78, fullMark: 100 },
  // { metric: "Giá cả", score: 88, fullMark: 100 },
  // { metric: "Giao diện", score: 95, fullMark: 100 },
  // { metric: "Bảo mật", score: 90, fullMark: 100 },
])

// Dữ liệu thời gian thực cho hoạt động hệ thống
const [realTimeActivityData, setrealTimeActivityData]= useState([
  { time: "00:00", users: 1200, orders: 45, revenue: 2500000 },
  { time: "04:00", users: 800, orders: 28, revenue: 1800000 },
  // { time: "08:00", users: 3500, orders: 125, revenue: 6200000 },
  // { time: "12:00", users: 5200, orders: 180, revenue: 8900000 },
  // { time: "16:00", users: 4800, orders: 165, revenue: 7800000 },
  // { time: "20:00", users: 6200, orders: 220, revenue: 11200000 },
])

   const [isLoading, setIsLoading] = useState(false);
 
const fetchData = async() =>{
  setIsLoading(true)
  try{
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BACKEND}/dashboard/data`);
    if(response.data != null){
        setquarterlyRevenueData(response.data.quarterlyRevenueDTOList);
        setuserDemographicsData(response.data.userDemographicsDTOList)
        setconversionFunnelData(response.data.conversionFunnelDTOList)
        setregionPerformanceData(response.data.regionPerformanceDTOList)
        settopProductsData(response.data.topProductDTOList);
        setserviceQualityData(response.data.serviceQualityDTOList);
        setrealTimeActivityData(response.data.realTimeActivityDTOList)
        console.log(response.data)
    }else{

    }
  }catch (err){
    console.error("Api error" , err)
  } finally {
    setIsLoading(false)
  }
}

useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#001F54] to-[#4DD0E1] bg-clip-text text-transparent">
          Thống kê & Báo cáo Chi tiết
        </h1>
        <div className="flex space-x-2">
          <Badge className="bg-[#001F54] text-white">Cập nhật real-time</Badge>
          <Badge className="bg-[#81C784] text-white">Dữ liệu đã xác thực</Badge>
        </div>
      </div>

      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-white shadow-lg">
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
          <TabsTrigger value="conversion" className="data-[state=active]:bg-[#FFB74D] data-[state=active]:text-white">
            <Target className="w-4 h-4 mr-2" />
            Chuyển đổi
          </TabsTrigger>
          <TabsTrigger value="realtime" className="data-[state=active]:bg-[#E57373] data-[state=active]:text-white">
            <Zap className="w-4 h-4 mr-2" />
            Thời gian thực
          </TabsTrigger>
        </TabsList>
        {/* Tab Doanh thu */}
        {!isLoading ? (<TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-white to-blue-50/50 border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-[#001F54]" />
                  <span>Doanh thu theo Quý</span>
                </CardTitle>
                <CardDescription>Phân tích tăng trưởng doanh thu 6 quý gần đây</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <ComposedChart data={quarterlyRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="quarter" stroke="#666" />
                    <YAxis yAxisId="left" stroke="#666" tickFormatter={(value) => `₫${value / 1000000}M`} />
                    <YAxis yAxisId="right" orientation="right" stroke="#666" tickFormatter={(value) => `${value}%`} />
                    <Tooltip
                      formatter={(value: any, name: string) => {
                        if (name === "revenue") return [`₫${(value / 1000000).toFixed(0)}M`, "Doanh thu"]
                        if (name === "growth") return [`${value}%`, "Tăng trưởng"]
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
                    <Bar yAxisId="left" dataKey="revenue" fill="url(#revenueGradient)" radius={[4, 4, 0, 0]} />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="growth"
                      stroke="#E57373"
                      strokeWidth={3}
                      dot={{ fill: "#E57373", r: 6 }}
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
                <CardTitle>Hiệu suất theo Khu vực</CardTitle>
                <CardDescription>Doanh thu và đơn hàng theo địa lý</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <ScatterChart data={regionPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="orders" name="Đơn hàng" stroke="#666" />
                    <YAxis
                      dataKey="revenue"
                      name="Doanh thu"
                      stroke="#666"
                      tickFormatter={(value) => `₫${value / 1000000}M`}
                    />
                    
                    <Tooltip
                      formatter={(value: any, name: string) => {
                        if (name === "revenue") return [`₫${(value / 1000000).toFixed(0)}M`, "Doanh thu"];
                        return [value, name];
                      }}
                      labelFormatter={(_, payload: any[]) => {
                        const region = payload?.[0]?.payload?.region;
                        return region ? `Khu vực: ${region}` : '';
                      }}
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        border: "none",
                        borderRadius: "12px",
                        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Scatter dataKey="revenue" fill="#81C784" shape="circle" />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>) : (
          <div className = "fixed inset-0 bg-white/70 flex items-center justify-center z-50">
          <ScaleLoader color = "#001F54"  speedMultiplier = { 1.2 } />
        </div>
        )}
        
        

        {/* Tab Người dùng */}
        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-white to-cyan-50/50 border-0 shadow-xl">
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
                    formatter={(value, name, props) => {
    if (name === "Nam") return [value, "Nam"];
    if (name === "Nữ") return [value, "Nữ"];
    return [value, name];
  }}
 labelFormatter={(label) => {
  const item = userDemographicsData.find(d => d.ageGroup === label);
  return `${label} (Tổng: ${item?.total ?? "?"})`;
}}
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        border: "none",
                        borderRadius: "12px",
                        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="male" stackId="a" fill="#4DD0E1" name="Nam" radius={[0, 0, 4, 4]} />
                    <Bar dataKey="female" stackId="a" fill="#81C784" name="Nữ" radius={[4, 4, 0, 0]} />
                    
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white to-purple-50/50 border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Chất lượng Dịch vụ</CardTitle>
                <CardDescription>Đánh giá đa chiều về chất lượng dịch vụ</CardDescription>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab Sản phẩm */}
        <TabsContent value="products" className="space-y-6">
          <Card className="bg-gradient-to-br from-white to-orange-50/50 border-0 shadow-xl">
            <CardHeader>
              <CardTitle>Sản phẩm Bán chạy</CardTitle>
              <CardDescription>TreeMap hiển thị doanh thu theo sản phẩm</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={topProductsData}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ₫${(value / 1000000).toFixed(1)}M`}
                  >
                    {topProductsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 60%)`} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => [`₫${(value / 1000000).toFixed(1)}M`, "Doanh thu"]}
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Chuyển đổi */}
        <TabsContent value="conversion" className="space-y-6">
          <Card className="bg-gradient-to-br from-white to-yellow-50/50 border-0 shadow-xl">
            <CardHeader>
              <CardTitle>Phễu Chuyển đổi</CardTitle>
              <CardDescription>Theo dõi hành trình khách hàng từ truy cập đến mua hàng</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <FunnelChart>
                  <Tooltip
                    formatter={(value: any) => [value.toLocaleString(), "Số lượng"]}
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Funnel dataKey="value" data={conversionFunnelData} isAnimationActive>
                    <LabelList position="center" fill="#fff" stroke="none" />
                  </Funnel>
                </FunnelChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-5 gap-4">
                {conversionFunnelData.map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="text-sm font-medium">{item.name}</div>
                    <div className="text-lg font-bold text-[#001F54]">{item.value.toLocaleString()}</div>
                    {index > 0 && (
                      <div className="text-xs text-gray-500">
                        {((item.value / conversionFunnelData[index - 1].value) * 100).toFixed(1)}%
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Thời gian thực */}
        <TabsContent value="realtime" className="space-y-6">
          <Card className="bg-gradient-to-br from-white to-red-50/50 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-[#E57373]" />
                <span>Hoạt động Thời gian thực</span>
                <Badge className="bg-red-500 text-white animate-pulse">LIVE</Badge>
              </CardTitle>
              <CardDescription>Dữ liệu cập nhật mỗi 30 giây</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={realTimeActivityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="time" stroke="#666" />
                  <YAxis yAxisId="left" stroke="#666" />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#666"
                    tickFormatter={(value) => `₫${value / 1000000}M`}
                  />
                  <Tooltip
                    formatter={(value: any, name: string) => {
                      if (name === "revenue") return [`₫${(value / 1000000).toFixed(1)}M`, "Doanh thu"]
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
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="users"
                    stackId="1"
                    stroke="#4DD0E1"
                    fill="#4DD0E1"
                    fillOpacity={0.6}
                  />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="orders"
                    stackId="1"
                    stroke="#81C784"
                    fill="#81C784"
                    fillOpacity={0.6}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#E57373"
                    strokeWidth={3}
                    dot={{ fill: "#E57373", r: 4 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
