import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts"
import { Users, Package, CreditCard, ShoppingBag, TrendingUp, AlertCircle, CheckCircle, Clock } from "lucide-react"

// Mock data for charts
const revenueData = [
  { month: "Янв", revenue: 4500, orders: 120 },
  { month: "Фев", revenue: 5200, orders: 145 },
  { month: "Мар", revenue: 4800, orders: 132 },
  { month: "Апр", revenue: 6200, orders: 168 },
  { month: "Май", revenue: 5800, orders: 155 },
  { month: "Июн", revenue: 7100, orders: 190 },
]

const categoryData = [
  { name: "Украшения", value: 35, color: "#8884d8" },
  { name: "Аксессуары", value: 25, color: "#82ca9d" },
  { name: "Fashion", value: 20, color: "#ffc658" },
  { name: "Игрушки", value: 15, color: "#ff8042" },
  { name: "Другое", value: 5, color: "#0088fe" },
]

const recentOrders = [
  { id: "VF-123456", customer: "Иван Иванов", amount: 89.99, status: "В печати", date: "2024-04-15" },
  { id: "VF-123455", customer: "Мария Петрова", amount: 124.50, status: "Отправлен", date: "2024-04-14" },
  { id: "VF-123454", customer: "Алексей Смирнов", amount: 45.99, status: "Ожидает оплаты", date: "2024-04-14" },
  { id: "VF-123453", customer: "Елена Козлова", amount: 67.25, status: "Доставлен", date: "2024-04-13" },
  { id: "VF-123452", customer: "Дмитрий Новиков", amount: 189.99, status: "В печати", date: "2024-04-13" },
]

const stats = [
  { label: "Всего пользователей", value: "1,234", change: "+12%", icon: Users },
  { label: "Всего заказов", value: "456", change: "+8%", icon: Package },
  { label: "Выручка", value: "$24,580", change: "+15%", icon: CreditCard },
  { label: "Моделей в маркетплейсе", value: "2,890", change: "+5%", icon: ShoppingBag },
]

export default function AdminPage() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Админ-панель</h1>
        <p className="text-gray-600">
          Управление платформой, аналитика и мониторинг
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
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

      {/* Charts and Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Статистика выручки</CardTitle>
            <CardDescription>Динамика за последние 6 месяцев</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
                  <Line type="monotone" dataKey="orders" stroke="#82ca9d" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Categories Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Распределение по категориям</CardTitle>
            <CardDescription>Популярность категорий моделей</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Recent Orders */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Последние заказы</CardTitle>
            <CardDescription>Требуют внимания или обработки</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="font-medium">{order.id}</div>
                      <Badge
                        variant={
                          order.status === "В печати"
                            ? "default"
                            : order.status === "Доставлен"
                            ? "outline"
                            : "secondary"
                        }
                      >
                        {order.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {order.customer} • {order.date}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">${order.amount}</div>
                    <Button variant="ghost" size="sm" className="mt-2">
                      Подробнее
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Быстрые действия</CardTitle>
            <CardDescription>Управление платформой</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full justify-start gap-2">
                <Users className="h-4 w-4" />
                Управление пользователями
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Package className="h-4 w-4" />
                Управление заказами
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <ShoppingBag className="h-4 w-4" />
                Модерация моделей
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <CreditCard className="h-4 w-4" />
                Настройки комиссий
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <AlertCircle className="h-4 w-4" />
                Просмотр жалоб
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <TrendingUp className="h-4 w-4" />
                Аналитика платформы
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Статус системы</CardTitle>
          <CardDescription>Мониторинг работы платформы</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="font-medium">База данных</div>
                <div className="text-sm text-gray-500">Работает стабильно</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="font-medium">API сервисы</div>
                <div className="text-sm text-gray-500">Все системы онлайн</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <div className="font-medium">Очередь заказов</div>
                <div className="text-sm text-gray-500">12 заказов в обработке</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}