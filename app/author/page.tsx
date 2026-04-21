"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { Upload, Eye, Download, DollarSign, TrendingUp, Package, Users, Edit, Trash2, Share2 } from "lucide-react"

// Mock data
const authorStats = [
  { label: "Всего моделей", value: "24", change: "+3", icon: Package },
  { label: "Всего загрузок", value: "4,892", change: "+12%", icon: Download },
  { label: "Общий доход", value: "$2,845", change: "+18%", icon: DollarSign },
  { label: "Рейтинг", value: "4.7", change: "+0.2", icon: TrendingUp },
]

const authorModels = [
  { id: 1, name: "Кольцо с геометрическим узором", price: 24.99, downloads: 1245, earnings: 872, status: "published" },
  { id: 2, name: "Модные серёжки", price: 19.99, downloads: 876, earnings: 420, status: "published" },
  { id: 3, name: "Архитектурный макет", price: 39.99, downloads: 543, earnings: 650, status: "published" },
  { id: 4, name: "Декоративная ваза", price: 0, downloads: 2890, earnings: 0, status: "published" },
  { id: 5, name: "Кастомизированный чехол", price: 14.99, downloads: 432, earnings: 195, status: "draft" },
  { id: 6, name: "Детский конструктор", price: 9.99, downloads: 2100, earnings: 708, status: "published" },
]

const earningsData = [
  { month: "Янв", earnings: 320, downloads: 450 },
  { month: "Фев", earnings: 380, downloads: 520 },
  { month: "Мар", earnings: 420, downloads: 580 },
  { month: "Апр", earnings: 480, downloads: 620 },
  { month: "Май", earnings: 450, downloads: 590 },
  { month: "Июн", earnings: 520, downloads: 680 },
]

const recentTransactions = [
  { id: "TRX-001", date: "2024-04-15", model: "Кольцо с узором", amount: 42.50, status: "paid" },
  { id: "TRX-002", date: "2024-04-10", model: "Серёжки", amount: 28.75, status: "paid" },
  { id: "TRX-003", date: "2024-04-05", model: "Архитектурный макет", amount: 65.25, status: "pending" },
  { id: "TRX-004", date: "2024-03-28", model: "Детский конструктор", status: "paid" },
]

export default function AuthorPage() {
  const [selectedModel, setSelectedModel] = useState<string | null>(null)

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Кабинет автора</h1>
        <p className="text-gray-600">
          Управляйте своими 3D-моделями, статистикой и доходами
        </p>
      </div>

      {/* Author Profile */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="/api/placeholder/80/80" />
              <AvatarFallback>ДС</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                <div>
                  <h2 className="text-2xl font-bold">ДизайнСтудия</h2>
                  <p className="text-gray-600">Профессиональный дизайнер 3D-моделей</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Автор</Badge>
                  <Badge>Проверенный</Badge>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <div>
                  <div className="text-sm text-gray-500">На платформе</div>
                  <div className="font-medium">2 года</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Роялти</div>
                  <div className="font-medium">30%</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Доступно для вывода</div>
                  <div className="font-medium">$245.75</div>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Edit className="h-4 w-4" />
                Редактировать профиль
              </Button>
              <Button className="gap-2">
                <Upload className="h-4 w-4" />
                Загрузить модель
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Author Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {authorStats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    <p className="text-sm text-green-600 mt-1">{stat.change} за месяц</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Models and Statistics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Models List */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Мои модели</CardTitle>
                  <CardDescription>Управление 3D-моделями в маркетплейсе</CardDescription>
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Фильтр по статусу" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все модели</SelectItem>
                    <SelectItem value="published">Опубликованные</SelectItem>
                    <SelectItem value="draft">Черновики</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {authorModels.map((model) => (
                  <div key={model.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold">{model.name}</h4>
                        {model.price === 0 ? (
                          <Badge variant="outline" className="bg-green-50">Бесплатно</Badge>
                        ) : (
                          <Badge variant="secondary">${model.price}</Badge>
                        )}
                        {model.status === "draft" && (
                          <Badge variant="outline">Черновик</Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-gray-500">Загрузки</div>
                          <div className="font-medium">{model.downloads}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Доход</div>
                          <div className="font-medium">${model.earnings}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Рейтинг</div>
                          <div className="font-medium">4.8 ★</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button size="icon" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost">
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4 gap-2">
                <Upload className="h-4 w-4" />
                Загрузить новую модель
              </Button>
            </CardContent>
          </Card>

          {/* Earnings Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Статистика доходов</CardTitle>
              <CardDescription>Динамика за последние 6 месяцев</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={earningsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="earnings" stroke="#8884d8" strokeWidth={2} name="Доход ($)" />
                    <Line type="monotone" dataKey="downloads" stroke="#82ca9d" strokeWidth={2} name="Загрузки" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Быстрая загрузка
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="model-name">Название модели</Label>
                <Input id="model-name" placeholder="Введите название" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="model-price">Цена ($)</Label>
                <div className="flex gap-2">
                  <Input id="model-price" type="number" placeholder="0.00" />
                  <Select defaultValue="paid">
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Тип" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paid">Платная</SelectItem>
                      <SelectItem value="free">Бесплатная</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="model-category">Категория</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jewelry">Украшения</SelectItem>
                    <SelectItem value="accessories">Аксессуары</SelectItem>
                    <SelectItem value="fashion">Fashion</SelectItem>
                    <SelectItem value="toys">Игрушки</SelectItem>
                    <SelectItem value="home">Дом</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <div className="text-sm">Перетащите файл сюда</div>
                <div className="text-xs text-gray-500 mt-1">STL, OBJ, 3MF до 500MB</div>
                <Button variant="outline" size="sm" className="mt-4">
                  Выбрать файл
                </Button>
              </div>
              
              <Button className="w-full">Начать загрузку</Button>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>Последние транзакции</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{transaction.id}</div>
                      <div className="text-sm text-gray-500">{transaction.model}</div>
                    </div>
                    <div className="text-right">
                      {transaction.amount && (
                        <div className="font-bold">${transaction.amount}</div>
                      )}
                      <Badge
                        variant={transaction.status === "paid" ? "default" : "outline"}
                        className="mt-1"
                      >
                        {transaction.status === "paid" ? "Оплачено" : "Ожидает"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                Все транзакции
              </Button>
            </CardContent>
          </Card>

          {/* Royalty Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Настройки роялти</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <Label>Процент роялти</Label>
                  <span className="font-bold">30%</span>
                </div>
                <Progress value={30} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <Label>Минимальный вывод</Label>
                  <span className="font-bold">$50</span>
                </div>
                <Progress value={70} className="h-2" />
                <div className="text-sm text-gray-500 mt-1">$245.75 доступно</div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  Изменить настройки
                </Button>
                <Button className="flex-1">Вывести средства</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}