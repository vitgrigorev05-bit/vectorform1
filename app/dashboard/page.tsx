import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Package, Download, Heart, CreditCard, Settings, Upload } from "lucide-react"

// Mock data
const orders = [
  { id: "VF-123456", date: "2024-04-15", status: "В печати", total: 89.99, items: 1 },
  { id: "VF-123455", date: "2024-04-10", status: "Отправлен", total: 124.50, items: 2 },
  { id: "VF-123454", date: "2024-04-05", status: "Доставлен", total: 45.99, items: 1 },
  { id: "VF-123453", date: "2024-03-28", status: "Доставлен", total: 67.25, items: 1 },
]

const downloads = [
  { id: 1, name: "Декоративная ваза", date: "2024-04-12", type: "Бесплатно" },
  { id: 2, name: "Тестовый куб", date: "2024-04-10", type: "Бесплатно" },
  { id: 3, name: "Кольцо с узором", date: "2024-04-05", type: "Куплено", price: 24.99 },
  { id: 4, name: "Арт-объект", date: "2024-03-20", type: "Куплено", price: 39.99 },
]

const favorites = [
  { id: 1, name: "Современная лампа", author: "ДизайнСтудия", price: 34.99 },
  { id: 2, name: "Органайзер для стола", author: "HomeDesign", price: 19.99 },
  { id: 3, name: "Брелок с логотипом", author: "BrandArt", price: 9.99 },
  { id: 4, name: "Декоративная скульптура", author: "ArtPrint3D", price: 49.99 },
]

export default function DashboardPage() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Личный кабинет</h1>
        <p className="text-gray-600">
          Управляйте заказами, загрузками и настройками аккаунта
        </p>
      </div>

      {/* User Profile Header */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="/api/placeholder/80/80" />
              <AvatarFallback>ИИ</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">Иван Иванов</h2>
              <p className="text-gray-600 mb-2">ivan@example.com</p>
              <div className="flex flex-wrap gap-2">
                <Badge>Клиент</Badge>
                <Badge variant="outline">С нами с апреля 2024</Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Settings className="h-4 w-4" />
                Настройки
              </Button>
              <Button className="gap-2">
                <Upload className="h-4 w-4" />
                Загрузить модель
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dashboard Tabs */}
      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList className="grid grid-cols-4 md:w-auto">
          <TabsTrigger value="orders" className="gap-2">
            <Package className="h-4 w-4" />
            Заказы
          </TabsTrigger>
          <TabsTrigger value="downloads" className="gap-2">
            <Download className="h-4 w-4" />
            Загрузки
          </TabsTrigger>
          <TabsTrigger value="favorites" className="gap-2">
            <Heart className="h-4 w-4" />
            Избранное
          </TabsTrigger>
          <TabsTrigger value="billing" className="gap-2">
            <CreditCard className="h-4 w-4" />
            Платежи
          </TabsTrigger>
        </TabsList>

        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">История заказов</h3>
            <Button variant="outline">Все заказы</Button>
          </div>
          
          <div className="grid gap-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold">{order.id}</h4>
                        <Badge
                          className={
                            order.status === "Доставлен"
                              ? "bg-green-500"
                              : order.status === "В печати"
                              ? "bg-blue-500"
                              : "bg-amber-500"
                          }
                        >
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm">
                        Заказ от {order.date} • {order.items} товар(ов)
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold mb-1">${order.total}</div>
                      <Button variant="outline" size="sm">
                        Подробнее
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Downloads Tab */}
        <TabsContent value="downloads" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">История загрузок</h3>
            <Button variant="outline">Все файлы</Button>
          </div>
          
          <div className="grid gap-4">
            {downloads.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-semibold mb-1">{item.name}</h4>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-600 text-sm">
                          Загружено {item.date}
                        </span>
                        <Badge variant="outline">{item.type}</Badge>
                        {item.price && (
                          <span className="text-sm font-medium">${item.price}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Скачать снова
                      </Button>
                      <Button size="sm">Заказать печать</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Favorites Tab */}
        <TabsContent value="favorites" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Избранные модели</h3>
            <Button variant="outline">Все избранное</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {favorites.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="h-16 w-16 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <div className="text-gray-400">3D</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold truncate">{item.name}</h4>
                      <p className="text-gray-600 text-sm truncate">
                        от {item.author}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="text-lg font-bold">${item.price}</div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost">
                            <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                          </Button>
                          <Button size="sm">В корзину</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Баланс</CardTitle>
                <CardDescription>Текущий баланс и история транзакций</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="text-4xl font-bold mb-2">$0.00</div>
                  <p className="text-gray-600 mb-4">Текущий баланс</p>
                  <Button>Пополнить баланс</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Способы оплаты</CardTitle>
                <CardDescription>Управление привязанными картами</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-12 bg-blue-500 rounded"></div>
                      <div>
                        <div className="font-medium">•••• 4242</div>
                        <div className="text-sm text-gray-600">Visa</div>
                      </div>
                    </div>
                    <Badge variant="outline">Основная</Badge>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    Добавить карту
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Последние транзакции</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Нет транзакций за последний месяц</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}