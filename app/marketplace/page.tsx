import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Filter, Search, Star, Download, ShoppingCart, Eye } from "lucide-react"

// Mock data for marketplace
const categories = [
  { id: 1, name: "Украшения", count: 245 },
  { id: 2, name: "Аксессуары", count: 189 },
  { id: 3, name: "Fashion-дизайн", count: 156 },
  { id: 4, name: "Игрушки", count: 312 },
  { id: 5, name: "Домашние предметы", count: 278 },
  { id: 6, name: "Инженерные детали", count: 134 },
  { id: 7, name: "Арт-объекты", count: 98 },
  { id: 8, name: "Подарки", count: 210 },
]

const models = [
  {
    id: 1,
    title: "Кольцо с геометрическим узором",
    author: "ДизайнСтудия",
    price: 24.99,
    rating: 4.8,
    downloads: 1245,
    category: "Украшения",
    tags: ["ювелирка", "мода", "геометрия"],
    image: "/api/placeholder/400/300",
    isFree: false,
  },
  {
    id: 2,
    title: "Декоративная ваза",
    author: "ArtPrint3D",
    price: 0,
    rating: 4.5,
    downloads: 2890,
    category: "Домашние предметы",
    tags: ["интерьер", "декор", "ваза"],
    image: "/api/placeholder/400/300",
    isFree: true,
  },
  {
    id: 3,
    title: "Кастомизированный чехол для телефона",
    author: "TechDesign",
    price: 14.99,
    rating: 4.9,
    downloads: 876,
    category: "Аксессуары",
    tags: ["чехол", "гаджеты", "персонализация"],
    image: "/api/placeholder/400/300",
    isFree: false,
  },
  {
    id: 4,
    title: "Архитектурный макет здания",
    author: "АрхитекторПро",
    price: 39.99,
    rating: 4.7,
    downloads: 543,
    category: "Арт-объекты",
    tags: ["архитектура", "макет", "дизайн"],
    image: "/api/placeholder/400/300",
    isFree: false,
  },
  {
    id: 5,
    title: "Образец для 3D-печати",
    author: "PrintLab",
    price: 0,
    rating: 4.3,
    downloads: 4321,
    category: "Инженерные детали",
    tags: ["тест", "образец", "калибровка"],
    image: "/api/placeholder/400/300",
    isFree: true,
  },
  {
    id: 6,
    title: "Модные серёжки",
    author: "Fashion3D",
    price: 19.99,
    rating: 4.6,
    downloads: 987,
    category: "Fashion-дизайн",
    tags: ["серьги", "бижутерия", "мода"],
    image: "/api/placeholder/400/300",
    isFree: false,
  },
  {
    id: 7,
    title: "Детская игрушка-конструктор",
    author: "KidsDesign",
    price: 9.99,
    rating: 4.8,
    downloads: 2100,
    category: "Игрушки",
    tags: ["игрушки", "дети", "конструктор"],
    image: "/api/placeholder/400/300",
    isFree: false,
  },
  {
    id: 8,
    title: "Декоративная подставка",
    author: "HomeDecor3D",
    price: 0,
    rating: 4.4,
    downloads: 1567,
    category: "Домашние предметы",
    tags: ["подставка", "организация", "декор"],
    image: "/api/placeholder/400/300",
    isFree: true,
  },
]

export default function MarketplacePage() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Маркетплейс 3D-моделей</h1>
        <p className="text-gray-600">
          Откройте для себя тысячи готовых 3D-моделей для печати
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Поиск моделей, авторов, тегов..."
              className="pl-10"
            />
          </div>
          <Button className="gap-2">
            <Filter className="h-4 w-4" />
            Фильтры
          </Button>
          <Button variant="outline">Сортировка: Популярные</Button>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Badge variant="default" className="cursor-pointer">
            Все категории
          </Badge>
          {categories.map((category) => (
            <Badge key={category.id} variant="outline" className="cursor-pointer">
              {category.name} ({category.count})
            </Badge>
          ))}
        </div>
      </div>

      {/* Models Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {models.map((model) => (
          <Card key={model.id} className="card-hover overflow-hidden">
            <div className="aspect-square bg-gray-100 relative overflow-hidden">
              {/* Mock image */}
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <div className="text-gray-400 text-4xl">3D</div>
              </div>
              {model.isFree && (
                <div className="absolute top-2 left-2">
                  <Badge className="bg-green-500 hover:bg-green-600">Бесплатно</Badge>
                </div>
              )}
              <div className="absolute top-2 right-2">
                <Button size="icon" variant="ghost" className="bg-white/80 hover:bg-white">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{model.title}</CardTitle>
                  <CardDescription>от {model.author}</CardDescription>
                </div>
                {!model.isFree && (
                  <div className="text-xl font-bold">${model.price}</div>
                )}
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1 text-sm font-medium">{model.rating}</span>
                </div>
                <span className="text-gray-400 text-sm">•</span>
                <span className="text-sm text-gray-600">{model.downloads.toLocaleString()} скачиваний</span>
              </div>
              <div className="flex flex-wrap gap-1">
                <Badge variant="secondary" className="text-xs">
                  {model.category}
                </Badge>
                {model.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <div className="flex gap-2 w-full">
                <Button variant="outline" size="sm" className="flex-1 gap-1">
                  <ShoppingCart className="h-4 w-4" />
                  В корзину
                </Button>
                <Button size="sm" className="flex-1 gap-1">
                  <Download className="h-4 w-4" />
                  {model.isFree ? "Скачать" : "Купить"}
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-12">
        <Button variant="outline" size="sm">
          Назад
        </Button>
        <Button variant="outline" size="sm" className="w-10">
          1
        </Button>
        <Button variant="outline" size="sm" className="w-10">
          2
        </Button>
        <Button variant="outline" size="sm" className="w-10">
          3
        </Button>
        <span className="mx-2">...</span>
        <Button variant="outline" size="sm" className="w-10">
          10
        </Button>
        <Button variant="outline" size="sm">
          Вперёд
        </Button>
      </div>
    </div>
  )
}