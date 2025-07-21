"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useEffect, useState } from "react"
import axios from "axios"


export function RecentActivity() {
  const [activities,setactivities] = useState([
  {
    id: 1,
    type: "user_register",
    name: "Nguyễn Văn A",
    action: "đăng ký tài khoản mới",
    time: "2 phút trước",
    status: "success",
  },
  // {
  //   id: 2,
  //   type: "product_report",
  //   user: "Trần Thị B",
  //   action: "báo cáo sản phẩm vi phạm",
  //   time: "5 phút trước",
  //   status: "warning",
  // },
  // {
  //   id: 3,
  //   type: "order_complete",
  //   user: "Lê Văn C",
  //   action: "hoàn thành đơn hàng #12345",
  //   time: "10 phút trước",
  //   status: "success",
  // },
  // {
  //   id: 4,
  //   type: "complaint",
  //   user: "Phạm Thị D",
  //   action: "gửi khiếu nại về đơn hàng",
  //   time: "15 phút trước",
  //   status: "error",
  // },
  // {
  //   id: 5,
  //   type: "seller_register",
  //   user: "Shop ABC",
  //   action: "đăng ký bán hàng",
  //   time: "20 phút trước",
  //   status: "info",
  // },
])

 const fetchData = async() =>{
    try{

      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BACKEND}/activity/data`);
      if(response.data != null){
        setactivities(response.data)
        console.log('Data-------',response.data)
      }else{
        console.log("No data")
      }

    }catch(error){
      console.error(error)
    }
  }

  useEffect(()=>{
    fetchData();
  },[])


  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[#001F54]">Hoạt động Gần đây</CardTitle>
        <CardDescription>Các sự kiện mới nhất trên hệ thống</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="text-xs bg-[#4DD0E1] text-white">{activity.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 truncate">{activity.name}</p>
                  <Badge
                    variant={
                      activity.status === "SUCCESS"
                        ? "default"
                        : activity.status === "WARNING"
                          ? "secondary"
                          : activity.status === "ERROR"
                            ? "destructive"
                            : "outline"
                    }
                    className={
                      activity.status === "SUCCESS"
                        ? "bg-[#81C784] text-white"
                        : activity.status === "INFO"
                          ? "bg-[#4DD0E1] text-white"
                          : ""
                    }
                  >
                    {activity.status === "SUCCESS"
                      ? "Thành công"
                      : activity.status === "WARNING"
                        ? "Cảnh báo"
                        : activity.status === "ERROR"
                          ? "Lỗi"
                          : "Thông tin"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{activity.action}</p>
                <p className="text-xs text-gray-400">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
