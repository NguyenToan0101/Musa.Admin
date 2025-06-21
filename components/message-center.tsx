"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Send,
  Paperclip,
  Phone,
  Video,
  MoreHorizontal,
  Star,
  Archive,
  Trash2,
  MessageSquare,
  Users,
  Clock,
  CheckCircle,
  Filter,
  Plus,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Dữ liệu mẫu cho cuộc trò chuyện
const conversations = [
  {
    id: "CONV001",
    participant: {
      name: "Shop ABC Electronics",
      email: "shop@abc-electronics.vn",
      avatar: "/placeholder.svg",
      type: "seller",
      status: "online",
    },
    lastMessage: {
      content: "Xin chào admin, tôi cần hỗ trợ về việc cập nhật thông tin sản phẩm",
      timestamp: "2024-03-20 14:30",
      sender: "seller",
      isRead: false,
    },
    unreadCount: 3,
    priority: "high",
    category: "support",
  },
  {
    id: "CONV002",
    participant: {
      name: "Fashion Store XYZ",
      email: "contact@fashionxyz.vn",
      avatar: "/placeholder.svg",
      type: "seller",
      status: "offline",
    },
    lastMessage: {
      content: "Cảm ơn admin đã hỗ trợ. Vấn đề đã được giải quyết.",
      timestamp: "2024-03-20 10:15",
      sender: "admin",
      isRead: true,
    },
    unreadCount: 0,
    priority: "medium",
    category: "resolved",
  },
  {
    id: "CONV003",
    participant: {
      name: "Tech Gadgets Pro",
      email: "info@techgadgets.vn",
      avatar: "/placeholder.svg",
      type: "seller",
      status: "online",
    },
    lastMessage: {
      content: "Tôi muốn tham gia chương trình khuyến mãi mới",
      timestamp: "2024-03-19 16:45",
      sender: "seller",
      isRead: false,
    },
    unreadCount: 1,
    priority: "medium",
    category: "promotion",
  },
  {
    id: "CONV004",
    participant: {
      name: "Home & Garden Store",
      email: "support@homegarden.vn",
      avatar: "/placeholder.svg",
      type: "seller",
      status: "away",
    },
    lastMessage: {
      content: "Làm thế nào để tôi có thể cập nhật chính sách đổi trả?",
      timestamp: "2024-03-19 09:20",
      sender: "seller",
      isRead: true,
    },
    unreadCount: 0,
    priority: "low",
    category: "policy",
  },
]

// Dữ liệu mẫu cho tin nhắn
const messages = [
  {
    id: "MSG001",
    conversationId: "CONV001",
    sender: "seller",
    content: "Xin chào admin, tôi cần hỗ trợ về việc cập nhật thông tin sản phẩm",
    timestamp: "2024-03-20 14:30",
    type: "text",
    isRead: true,
  },
  {
    id: "MSG002",
    conversationId: "CONV001",
    sender: "admin",
    content: "Chào bạn! Tôi có thể giúp bạn cập nhật thông tin sản phẩm. Bạn cần hỗ trợ gì cụ thể?",
    timestamp: "2024-03-20 14:32",
    type: "text",
    isRead: true,
  },
  {
    id: "MSG003",
    conversationId: "CONV001",
    sender: "seller",
    content: "Tôi muốn thay đổi mô tả và hình ảnh cho sản phẩm iPhone 15 Pro Max",
    timestamp: "2024-03-20 14:35",
    type: "text",
    isRead: true,
  },
  {
    id: "MSG004",
    conversationId: "CONV001",
    sender: "seller",
    content: "Đây là hình ảnh mới tôi muốn cập nhật",
    timestamp: "2024-03-20 14:36",
    type: "image",
    attachment: "/placeholder.svg",
    isRead: false,
  },
]

// Dữ liệu mẫu cho template tin nhắn
const messageTemplates = [
  {
    id: "TEMP001",
    title: "Chào mừng người bán mới",
    content: "Chào mừng bạn đến với nền tảng của chúng tôi! Chúng tôi sẽ hỗ trợ bạn trong quá trình bán hàng.",
    category: "welcome",
  },
  {
    id: "TEMP002",
    title: "Hướng dẫn cập nhật sản phẩm",
    content: "Để cập nhật thông tin sản phẩm, bạn vào Quản lý sản phẩm > Chọn sản phẩm > Chỉnh sửa.",
    category: "support",
  },
  {
    id: "TEMP003",
    title: "Thông báo vi phạm chính sách",
    content: "Sản phẩm của bạn vi phạm chính sách. Vui lòng cập nhật theo hướng dẫn đính kèm.",
    category: "warning",
  },
]

export function MessageCenter() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [newMessage, setNewMessage] = useState("")

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch = conv.participant.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || conv.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const conversationMessages = messages.filter((msg) => msg.conversationId === selectedConversation?.id)

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Logic gửi tin nhắn
      setNewMessage("")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#001F54] to-[#4DD0E1] bg-clip-text text-transparent">
            Trung tâm Tin nhắn
          </h1>
          <p className="text-gray-500 mt-1">Giao tiếp và hỗ trợ người bán trên sàn</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-red-100 text-red-800">
            {conversations.filter((c) => c.unreadCount > 0).length} chưa đọc
          </Badge>
          <Badge className="bg-green-100 text-green-800">
            {conversations.filter((c) => c.participant.status === "online").length} online
          </Badge>
          <Button className="bg-[#001F54] hover:bg-[#001F54]/90">
            <Plus className="mr-2 h-4 w-4" />
            Tin nhắn mới
          </Button>
        </div>
      </div>

      <Tabs defaultValue="conversations" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-white shadow-lg">
          <TabsTrigger
            value="conversations"
            className="data-[state=active]:bg-[#001F54] data-[state=active]:text-white"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Cuộc trò chuyện
          </TabsTrigger>
          <TabsTrigger value="templates" className="data-[state=active]:bg-[#4DD0E1] data-[state=active]:text-white">
            <Star className="w-4 h-4 mr-2" />
            Mẫu tin nhắn
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-[#81C784] data-[state=active]:text-white">
            <Users className="w-4 h-4 mr-2" />
            Thống kê
          </TabsTrigger>
        </TabsList>

        {/* Tab Cuộc trò chuyện */}
        <TabsContent value="conversations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
            {/* Danh sách cuộc trò chuyện */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Cuộc trò chuyện</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Filter className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Lọc theo</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setFilterCategory("all")}>Tất cả</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterCategory("support")}>Hỗ trợ</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterCategory("promotion")}>Khuyến mãi</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterCategory("policy")}>Chính sách</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterCategory("resolved")}>Đã giải quyết</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Tìm kiếm cuộc trò chuyện..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[480px]">
                  <div className="space-y-1 p-4">
                    {filteredConversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        onClick={() => setSelectedConversation(conversation)}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedConversation?.id === conversation.id ? "bg-[#001F54] text-white" : "hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={conversation.participant.avatar || "/placeholder.svg"} />
                              <AvatarFallback className="bg-[#4DD0E1] text-white">
                                {conversation.participant.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div
                              className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                                conversation.participant.status === "online"
                                  ? "bg-green-500"
                                  : conversation.participant.status === "away"
                                    ? "bg-yellow-500"
                                    : "bg-gray-400"
                              }`}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-medium truncate">{conversation.participant.name}</p>
                              {conversation.unreadCount > 0 && (
                                <Badge className="bg-red-500 text-white text-xs">{conversation.unreadCount}</Badge>
                              )}
                            </div>
                            <p
                              className={`text-sm truncate ${
                                selectedConversation?.id === conversation.id ? "text-gray-200" : "text-gray-500"
                              }`}
                            >
                              {conversation.lastMessage.content}
                            </p>
                            <div className="flex items-center justify-between mt-1">
                              <span
                                className={`text-xs ${
                                  selectedConversation?.id === conversation.id ? "text-gray-300" : "text-gray-400"
                                }`}
                              >
                                {conversation.lastMessage.timestamp}
                              </span>
                              <Badge
                                variant="outline"
                                className={`text-xs ${
                                  conversation.priority === "high"
                                    ? "border-red-500 text-red-600"
                                    : conversation.priority === "medium"
                                      ? "border-yellow-500 text-yellow-600"
                                      : "border-gray-500 text-gray-600"
                                }`}
                              >
                                {conversation.priority === "high"
                                  ? "Cao"
                                  : conversation.priority === "medium"
                                    ? "Trung bình"
                                    : "Thấp"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Khu vực chat */}
            <Card className="lg:col-span-2">
              {selectedConversation ? (
                <>
                  <CardHeader className="border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={selectedConversation.participant.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="bg-[#4DD0E1] text-white">
                            {selectedConversation.participant.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{selectedConversation.participant.name}</h3>
                          <p className="text-sm text-gray-500">{selectedConversation.participant.email}</p>
                        </div>
                        <div
                          className={`w-2 h-2 rounded-full ${
                            selectedConversation.participant.status === "online"
                              ? "bg-green-500"
                              : selectedConversation.participant.status === "away"
                                ? "bg-yellow-500"
                                : "bg-gray-400"
                          }`}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="icon">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Video className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Star className="mr-2 h-4 w-4" />
                              Đánh dấu quan trọng
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Archive className="mr-2 h-4 w-4" />
                              Lưu trữ
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Xóa cuộc trò chuyện
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="h-[400px] p-4">
                      <div className="space-y-4">
                        {conversationMessages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.sender === "admin" ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[70%] p-3 rounded-lg ${
                                message.sender === "admin" ? "bg-[#001F54] text-white" : "bg-gray-100 text-gray-900"
                              }`}
                            >
                              {message.type === "text" ? (
                                <p className="text-sm">{message.content}</p>
                              ) : (
                                <div className="space-y-2">
                                  <p className="text-sm">{message.content}</p>
                                  <img
                                    src={message.attachment || "/placeholder.svg"}
                                    alt="Attachment"
                                    className="max-w-full h-auto rounded"
                                  />
                                </div>
                              )}
                              <div className="flex items-center justify-between mt-2">
                                <span
                                  className={`text-xs ${
                                    message.sender === "admin" ? "text-gray-200" : "text-gray-500"
                                  }`}
                                >
                                  {message.timestamp}
                                </span>
                                {message.sender === "admin" && (
                                  <div className="flex items-center space-x-1">
                                    {message.isRead ? (
                                      <CheckCircle className="w-3 h-3 text-green-400" />
                                    ) : (
                                      <Clock className="w-3 h-3 text-gray-400" />
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    <div className="border-t p-4">
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="icon">
                          <Paperclip className="h-4 w-4" />
                        </Button>
                        <Textarea
                          placeholder="Nhập tin nhắn..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          className="flex-1 min-h-[40px] max-h-[120px]"
                          onKeyPress={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault()
                              handleSendMessage()
                            }
                          }}
                        />
                        <Button onClick={handleSendMessage} className="bg-[#001F54] hover:bg-[#001F54]/90">
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </>
              ) : (
                <CardContent className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Chọn một cuộc trò chuyện để bắt đầu</p>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </TabsContent>

        {/* Tab Mẫu tin nhắn */}
        <TabsContent value="templates" className="space-y-6">
          <div className="flex justify-end">
            <Button className="bg-[#4DD0E1] hover:bg-[#4DD0E1]/90">
              <Plus className="mr-2 h-4 w-4" />
              Tạo mẫu mới
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {messageTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{template.title}</CardTitle>
                    <Badge variant="outline">
                      {template.category === "welcome"
                        ? "Chào mừng"
                        : template.category === "support"
                          ? "Hỗ trợ"
                          : "Cảnh báo"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{template.content}</p>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Sử dụng
                    </Button>
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab Thống kê */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-l-4 border-l-[#001F54]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Tổng tin nhắn</CardTitle>
                <MessageSquare className="h-4 w-4 text-[#001F54]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#001F54]">1,234</div>
                <p className="text-xs text-[#81C784] flex items-center mt-1">
                  <span className="mr-1">↗</span>
                  +12% so với tháng trước
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#4DD0E1]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Cuộc trò chuyện hoạt động</CardTitle>
                <Users className="h-4 w-4 text-[#4DD0E1]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#001F54]">89</div>
                <p className="text-xs text-[#81C784] flex items-center mt-1">
                  <span className="mr-1">↗</span>
                  +5 cuộc trò chuyện mới
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#81C784]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Thời gian phản hồi TB</CardTitle>
                <Clock className="h-4 w-4 text-[#81C784]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#001F54]">15m</div>
                <p className="text-xs text-[#81C784] flex items-center mt-1">
                  <span className="mr-1">↘</span>
                  -3m so với tuần trước
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#FFB74D]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Độ hài lòng</CardTitle>
                <Star className="h-4 w-4 text-[#FFB74D]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#001F54]">4.8/5</div>
                <p className="text-xs text-[#81C784] flex items-center mt-1">
                  <span className="mr-1">↗</span>
                  +0.2 điểm
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Hoạt động Tin nhắn theo Giờ</CardTitle>
                <CardDescription>Phân bố tin nhắn trong ngày</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { time: "00:00 - 06:00", count: 45, percentage: 15 },
                    { time: "06:00 - 12:00", count: 120, percentage: 40 },
                    { time: "12:00 - 18:00", count: 95, percentage: 32 },
                    { time: "18:00 - 24:00", count: 38, percentage: 13 },
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{item.time}</span>
                        <span className="text-sm">{item.count} tin nhắn</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-[#001F54] to-[#4DD0E1]"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Loại Hỗ trợ Phổ biến</CardTitle>
                <CardDescription>Phân loại theo chủ đề</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { category: "Hỗ trợ kỹ thuật", count: 45, color: "bg-blue-500" },
                    { category: "Chính sách bán hàng", count: 32, color: "bg-green-500" },
                    { category: "Khuyến mãi", count: 28, color: "bg-orange-500" },
                    { category: "Thanh toán", count: 18, color: "bg-purple-500" },
                    { category: "Khác", count: 12, color: "bg-gray-500" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${item.color}`} />
                        <span className="font-medium">{item.category}</span>
                      </div>
                      <span className="text-sm text-gray-600">{item.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
