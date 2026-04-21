"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Package, Clock, CheckCircle, AlertCircle, DollarSign, Printer, Settings, TrendingUp, CalendarDays } from "lucide-react"

// Mock data
const pendingOrders = [
  { id: "VF-123456", customer: "Иван Иванов", material: "PLA", volume: 480, estimatedTime: 18, proposedPrice: 89.99 },
  { id: "VF-123455", customer: "Мария Петрова", material: "RESIN", volume: 320, estimatedTime: 12, proposedPrice: 124.50 },
  { id: "VF-123454", customer: "Алексей Смирнов", material: "PETG", volume: 210, estimatedTime: 8, proposedPrice: 45.99 },
]

const activeOrders = [
  { id: "VF-123453", customer: "Елена Козлова", material: "PLA", progress: 75, deadline: "2024-04-18" },
  { id: "VF-123452", customer: "Дмитрий Новиков", material: "ABS", progress: 40, deadline: "2024-04-20" },
  { id: "VF-123451", customer: "Анна Сидорова", material: "TPU", progress: 90, deadline: "2024-04-17" },
]

const completedOrders = [
  { id: "VF-123450", customer: "Павел Иванов", material: "PLA", completed: "2024-04-15", revenue: 67.25 },
  { id: "VF-123449", customer: "Ольга Петрова", material: "RESIN", completed: "2024-04-14", revenue: 89.99 },
  { id: "VF-123448", customer: "Сергей Смирнов", material: "PETG", completed: "2024-04-13", revenue: 45.50 },
]

const equipment = [
  { id: 1, name: "Prusa i3 MK3S+", type: "FDM", status: "active", buildVolume: "250×210×210" },
  { id: 2, name: "Anycubic Photon Mono X", type: "SLA", status: "active", buildVolume: "192×120×245" },
  { id: 3, name: "Creality CR-10", type: "FDM", status: "maintenance", buildVolume: "300×300×400" },
]

const revenueData = [
  { month: "Янв", revenue: 3200 },
  { month: "Фев", revenue: 3800 },
  { month: "Мар", revenue: 4200 },
  { month: "Апр", revenue: 4800 },
  { month: "Май", revenue: 4500 },
  { month: "Июн", revenue: 5200 },
]

export default function PartnerPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)

  const handleAcceptOrder = (orderId: string) => {
    console.log("Accept order:", orderId)
    // In real implementation, update order status via API
  }

  const handleRejectOrder = (orderId: string) => {
    console.log("Reject order:", orderId)
    // In real implementation, update order status via API
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Кабинет партнёра</h1>
        <p className="text-gray-600">
          Управление заказами, оборудованием и статистикой
        </p>
      </div>

      {/* Partner Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Текущие заказы</p>
                <p className="text-2xl font-bold mt-1">3</p>
                <p className="text-sm text-gray-500 mt-1">в работе</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Доход за месяц</p>
                <p className="text-2xl font-bold mt-1">$4,800</p>
                <p className="text-sm text-green-600 mt-1">+15%</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Загрузка оборудования</p>
                <p className="text-2xl font-bold mt-1">68%</p>
                <p className="text-sm text-gray-500 mt-1">2 из 3 принтеров</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-amber-100 flex items-center justify-center">
                <Printer className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Рейтинг</p>
                <p className="text-2xl font-bold mt-1">4.8</p>
                <p className="text-sm text-gray-500 mt-1">из 5.0</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Orders Management */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="pending" className="gap-2">
                <Clock className="h-4 w-4" />
                Входящие
              </TabsTrigger>
              <TabsTrigger value="active" className="gap-2">
                <Package className="h-4 w-4" />
                В работе
              </TabsTrigger>
              <TabsTrigger value="completed" className="gap-2">
                <CheckCircle className="h-4 w-4" />
                Завершённые
              </TabsTrigger>
            </TabsList>
            
            {/* Pending Orders */}
            <TabsContent value="pending" className="space-y-4">
              {pendingOrders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold">{order.id}</h4>
                          <Badge variant="outline">{order.material}</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-gray-500">Клиент</div>
                            <div className="font-medium">{order.customer}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Объём</div>
                            <div className="font-medium">{order.volume} см³</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Время печати</div>
                            <div className="font-medium">{order.estimatedTime} ч</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Предложенная цена</div>
                            <div className="font-medium">${order.proposedPrice}</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRejectOrder(order.id)}
                        >
                          Отклонить
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleAcceptOrder(order.id)}
                        >
                          Принять
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            
            {/* Active Orders */}
            <TabsContent value="active" className="space-y-4">
              {activeOrders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-3">
                            <h4 className="font-semibold">{order.id}</h4>
                            <Badge variant="default">{order.material}</Badge>
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            Клиент: {order.customer} • Срок: {order.deadline}
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Обновить статус
                        </Button>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Прогресс печати</span>
                          <span>{order.progress}%</span>
                        </div>
                        <Progress value={order.progress} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            
            {/* Completed Orders */}
            <TabsContent value="completed" className="space-y-4">
              {completedOrders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold">{order.id}</h4>
                          <Badge variant="outline">{order.material}</Badge>
                        </div>
                        <div className="text-sm text-gray-500">
                          Клиент: {order.customer} • Завершён: {order.completed}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold mb-1">${order.revenue}</div>
                        <Button variant="ghost" size="sm">
                          Детали
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Equipment Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Printer className="h-5 w-5" />
                Оборудование
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {equipment.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-gray-500">
                      {item.type} • {item.buildVolume}мм
                    </div>
                  </div>
                  <Badge
                    variant={item.status === "active" ? "default" : "secondary"}
                  >
                    {item.status === "active" ? "Активен" : "Обслуживание"}
                  </Badge>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-2 gap-2">
                <Settings className="h-4 w-4" />
                Управление оборудованием
              </Button>
            </CardContent>
          </Card>

          {/* Calendar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                Календарь загрузки
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Доход по месяцам</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Settings */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Настройки партнёра</CardTitle>
          <CardDescription>Управление профилем и параметрами работы</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-4">
              <div>
                <div className="font-medium mb-2">Доступные материалы</div>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите материалы" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все материалы</SelectItem>
                    <SelectItem value="pla">Только PLA</SelectItem>
                    <SelectItem value="abs">ABS и PLA</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" className="w-full">
                Обновить материалы
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="font-medium mb-2">Максимальная загрузка</div>
                <Select defaultValue="80">
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите загрузку" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="60">60%</SelectItem>
                    <SelectItem value="80">80%</SelectItem>
                    <SelectItem value="100">100%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" className="w-full">
                Обновить настройки
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="font-medium mb-2">Статус партнёра</div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span>Активен и принимает заказы</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  Пауза
                </Button>
                <Button variant="destructive" className="flex-1">
                  Неактивен
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}