import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Calculator, CloudUpload, Package, ShoppingBag, Users, Zap } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white py-20 md:py-32">
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Zap className="h-4 w-4" />
              Технологичная платформа для 3D-печати
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              <span className="gradient-text">Мгновенный расчёт</span>
              <br />
              стоимости 3D-печати
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Загрузите 3D-модель и получите автоматический расчёт цены печати, 
              выберите материал и оформите заказ у проверенных партнёров.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gap-2" asChild>
                <Link href="/print/upload">
                  <CloudUpload className="h-5 w-5" />
                  Загрузить модель
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/marketplace">
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Смотреть маркетплейс
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Три направления в одной платформе</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              ВекторФорм объединяет маркетплейс 3D-моделей, автоматический расчёт печати 
              и сеть производственных партнёров
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="card-hover">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                  <ShoppingBag className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Маркетплейс моделей</CardTitle>
                <CardDescription>
                  Покупайте и продавайте 3D-модели для печати
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    Тысячи готовых моделей
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    Бесплатные и платные файлы
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    Авторские роялти
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    Мгновенная загрузка
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="card-hover">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                  <Calculator className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Автоматический расчёт</CardTitle>
                <CardDescription>
                  Мгновенный расчёт стоимости печати вашей модели
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                    Анализ геометрии модели
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                    Расчёт материала и времени
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                    Выбор материалов и цветов
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                    Прозрачная детализация цены
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="card-hover">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Сеть партнёров</CardTitle>
                <CardDescription>
                  Распределённое производство по всему миру
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    Автоматическое распределение заказов
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    Проверенные печатники
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    Контроль качества
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    Доставка до двери
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Как это работает</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Простой процесс от загрузки модели до получения готового изделия
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Загрузите модель",
                description: "Загрузите файл в формате STL, OBJ или 3MF",
                icon: "📤",
              },
              {
                step: "02",
                title: "Получите расчёт",
                description: "Система автоматически проанализирует модель и рассчитает стоимость",
                icon: "🧮",
              },
              {
                step: "03",
                title: "Выберите параметры",
                description: "Материал, цвет, качество и способ доставки",
                icon: "🎨",
              },
              {
                step: "04",
                title: "Получите изделие",
                description: "Заказ отправляется партнёру и доставляется вам",
                icon: "🚚",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-vector-blue to-vector-purple text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Начните прямо сейчас</h2>
            <p className="text-xl text-gray-600 mb-10">
              Присоединяйтесь к платформе, где дизайнеры, инженеры и производители 
              создают будущее 3D-печати вместе
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gap-2" asChild>
                <Link href="/print/upload">
                  <CloudUpload className="h-5 w-5" />
                  Бесплатный расчёт
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/about">
                  Узнать больше
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
