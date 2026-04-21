"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Package, Truck, CheckCircle, Clock, AlertCircle, Printer, MessageSquare, Download, MapPin, CreditCard } from "lucide-react"

// Mock order data
const orderData = {
  id: "VF-123456",
  status: "printing",
  createdAt: "2024-04-15",
  updatedAt: "2024-04-17",
  customer: {
    name: "Иван Иванов",
    email: "ivan@example.com",
    phone: "+7 (999) 123-45-67",
  },
  model: {
    name: "Декоративная ваза",
    dimensions: "100×80×60 мм",
    volume: "480 см³",
    material: "PLA",
    color: "Белый",
    quality: "Стандартный",
  },
  calculation: {
    materialCost: 24.00,
    printCost: 36.00,
    postProcessing: 15.00,
    shipping: 10.00,
    platformFee: 8.50,
    total: 89.99,
  },
  partner: {
    name: "3DPrintPro",
    location: "Москва",
    rating: 4.8,
    contact: "info@3dprintpro.ru",
  },
  timeline: [
    { step: "Заказ создан", date: "2024-04-15 10:30", status: "completed" },
    { step: "Оплата подтверждена", date: "2024-04-15 11:15", status: "completed" },
    { step: "Назначен партнёру", date: "2024-04-16 09:20", status: "completed" },
    { step: "В печати", date: "2024-04-17 14:00", status: "current" },
    { step: "Постобработка", date: "Ожидается", status: "pending" },
    { step: "Отправка", date: "Ожидается", status: "pending" },
    { step: "Доставка", date: "Ожидается", status: "pending" },
  ],
  shipping: {
    address: "г. Москва, ул. Тверская, д. 15, кв. 42",
    method: "Стандартная",
    estimatedDelivery: "2024-04-25",
    trackingNumber: "TRK-789456123",
  },
}

const statusConfig = {
  pending: { label: "Ожидает оплаты", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  confirmed: { label: "Подтверждён", color: "bg-blue-100 text-blue-800", icon: CheckCircle },
  printing: { label: "В печати", color: "bg-purple-100 text-purple-800", icon: Printer },
  post_processing: { label: "Постобработка", color: "bg-indigo-100 text-indigo-800", icon: Package },
  shipping: { label: "Отправлен", color: "bg-orange-100 text-orange-800", icon: Truck },
  delivered: { label: "Доставлен", color: "bg-green-100 text-green-800", icon: CheckCircle },
  cancelled: { label: "Отменён", color: "bg-red-100 text-red-800", icon: AlertCircle },
}

export default function OrderPage() {
  const params = useParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  
  const orderId = params.id as string || orderData.id
  const status = statusConfig[orderData.status as keyof typeof statusConfig]
  const StatusIcon = status?.icon || Clock

  const handleContactSupport = () => {
    // In real app, open support chat
    console.log("Contact support for order:", orderId)
  }

  const handleDownloadInvoice = () => {
    setIsLoading(true)
    // Simulate download
    setTimeout(() => {
      setIsLoading(false)
      console.log("Download invoice for order:", orderId)
    }, 1000)
  }

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Заказ #{orderId}</h1>
            <div className="flex items-center gap-3">
              <Badge className={`${status.color} gap-1`}>
                <StatusIcon className="h-3 w-3" />
                {status.label}
              </Badge>
              <span className="text-gray-600">
                Создан {orderData.createdAt}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDownloadInvoice} disabled={isLoading}>
              {isLoading ? "Загрузка..." : "Скачать счёт"}
            </Button>
            <Button onClick={handleContactSupport}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Поддержка
            </Button>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span>Прогресс выполнения</span>
            <span>60%</span>
          </div>
          <Progress value={60} className="h-2" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Model Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Детали модели
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-4">{orderData.model.name}</h4>
                  <div className="h-48 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-2">3D</div>
                      <div className="text-gray-600">Предпросмотр модели</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">Размеры</div>
                      <div className="font-medium">{orderData.model.dimensions}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Объём</div>
                      <div className="font-medium">{orderData.model.volume}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Материал</div>
                      <div className="font-medium">{orderData.model.material}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Цвет</div>
                      <div className="font-medium">{orderData.model.color}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Качество</div>
                      <div className="font-medium">{orderData.model.quality}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Количество</div>
                      <div className="font-medium">1 шт</div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Скачать файл модели
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Статус заказа</CardTitle>
              <CardDescription>
                История выполнения вашего заказа
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orderData.timeline.map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      item.status === "completed" 
                        ? "bg-green-100 text-green-600" 
                        : item.status === "current"
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-400"
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{item.step}</div>
                          <div className="text-sm text-gray-500">{item.date}</div>
                        </div>
                        {item.status === "completed" && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                        {item.status === "current" && (
                          <div className="animate-pulse">
                            <div className="h-3 w-3 rounded-full bg-primary"></div>
                          </div>
                        )}
                      </div>
                      {index < orderData.timeline.length - 1 && (
                        <div className="h-6 w-0.5 bg-gray-200 ml-4 mt-2"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Summary */}
        <div className="space-y-6">
          {/* Cost Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Детализация стоимости
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Материал</span>
                  <span>${orderData.calculation.materialCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Печать</span>
                  <span>${orderData.calculation.printCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Постобработка</span>
                  <span>${orderData.calculation.postProcessing.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Доставка</span>
                  <span>${orderData.calculation.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Комиссия платформы</span>
                  <span>${orderData.calculation.platformFee.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Итого</span>
                  <span>${orderData.calculation.total.toFixed(2)}</span>
                </div>
                <div className="text-sm text-gray-500">
                  Оплачено банковской картой • {orderData.createdAt}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Partner Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Printer className="h-5 w-5" />
                Исполнитель
              </CardTitle>
              <CardDescription>
                Партнёр, выполняющий ваш заказ
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <Avatar>
                  <AvatarFallback>3D</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{orderData.partner.name}</div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <MapPin className="h-3 w-3" />
                    {orderData.partner.location}
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Рейтинг</span>
                  <div className="flex items-center">
                    <div className="text-yellow-500">★</div>
                    <span className="ml-1 font-medium">{orderData.partner.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Контакт</span>
                  <span className="font-medium">{orderData.partner.contact}</span>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                Написать исполнителю
              </Button>
            </CardContent>
          </Card>

          {/* Shipping Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Доставка
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-500">Адрес доставки</div>
                  <div className="font-medium">{orderData.shipping.address}</div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Способ доставки</span>
                  <span className="font-medium">{orderData.shipping.method}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Ориентировочная доставка</span>
                  <span className="font-medium">{orderData.shipping.estimatedDelivery}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Трек-номер</span>
                  <code className="font-mono bg-gray-100 px-2 py-1 rounded">
                    {orderData.shipping.trackingNumber}
                  </code>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                Отследить посылку
              </Button>
            </CardContent>
          </Card>

          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle>Информация о клиенте</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <div className="text-sm text-gray-500">Имя</div>
                  <div className="font-medium">{orderData.customer.name}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Email</div>
                  <div className="font-medium">{orderData.customer.email}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Телефон</div>
                  <div className="font-medium">{orderData.customer.phone}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}