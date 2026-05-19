"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MessageSquare, Package, CreditCard, Download, User, Printer, HelpCircle } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqCategories = [
  {
    id: "general",
    title: "Общие вопросы",
    icon: HelpCircle,
    questions: [
      {
        q: "Что такое СтильФормы?",
        a: "СтильФормы — это платформа для автоматического расчёта стоимости 3D-печати, маркетплейс 3D-моделей и сеть производственных партнёров. Мы объединяем дизайнеров, клиентов и производителей в одной экосистеме."
      },
      {
        q: "Как работает платформа?",
        a: "1. Загрузите 3D-модель → 2. Получите мгновенный расчёт стоимости → 3. Выберите параметры печати → 4. Оформите заказ → 5. Получите готовое изделие от партнёра."
      },
      {
        q: "Какие форматы файлов поддерживаются?",
        a: "Мы поддерживаем STL, OBJ, 3MF, STEP, FBX, GLB и GLTF форматы. Максимальный размер файла — 500 МБ."
      },
      {
        q: "Нужно ли устанавливать специальное ПО?",
        a: "Нет, весь процесс происходит через веб-браузер. Для загрузки моделей не требуется специальное программное обеспечение."
      }
    ]
  },
  {
    id: "printing",
    title: "Печать и расчёт",
    icon: Printer,
    questions: [
      {
        q: "Как рассчитывается стоимость печати?",
        a: "Стоимость рассчитывается на основе: объёма материала, времени печати, сложности модели, необходимости поддержек, постобработки, доставки и комиссий платформы."
      },
      {
        q: "Какие материалы доступны для печати?",
        a: "PLA, ABS, PETG, TPU, фотополимерные смолы и специальные материалы. Каждый материал имеет разные характеристики и цены."
      },
      {
        q: "Как определяется время печати?",
        a: "Система автоматически анализирует геометрию модели и рассчитывает ориентировочное время печати на основе выбранных параметров."
      },
      {
        q: "Что такое поддержки и нужны ли они?",
        a: "Поддержки — временные структуры, которые печатаются вместе с моделью для поддержки нависающих элементов. Система определяет необходимость поддержек автоматически."
      }
    ]
  },
  {
    id: "marketplace",
    title: "Маркетплейс",
    icon: Package,
    questions: [
      {
        q: "Как купить модель в маркетплейсе?",
        a: "Найдите нужную модель, нажмите 'Купить', оплатите через безопасную систему и скачайте файл сразу после оплаты."
      },
      {
        q: "Можно ли продавать свои модели?",
        a: "Да, зарегистрируйтесь как автор, загрузите свои модели и начните зарабатывать на роялти с каждой продажи."
      },
      {
        q: "Какая комиссия у платформы?",
        a: "Комиссия платформы составляет 10% от стоимости продажи модели. Авторы получают 70%, партнёры — 20% от заказов на печать."
      },
      {
        q: "Как защищены авторские права?",
        a: "Все модели защищены цифровыми водяными знаками и лицензионными соглашениями. Мы строго соблюдаем авторские права."
      }
    ]
  },
  {
    id: "orders",
    title: "Заказы и доставка",
    icon: CreditCard,
    questions: [
      {
        q: "Как отслеживать статус заказа?",
        a: "Статус заказа отображается в личном кабинете. Вы будете получать уведомления на каждом этапе: от печати до доставки."
      },
      {
        q: "Какие сроки доставки?",
        a: "Стандартная доставка: 7-14 дней, экспресс: 3-5 дней, приоритетная: 1-2 дня. Сроки зависят от региона и сложности заказа."
      },
      {
        q: "Что делать, если изделие повреждено?",
        a: "Сфотографируйте повреждение и свяжитесь с нашей поддержкой в течение 7 дней после получения. Мы заменим изделие бесплатно."
      },
      {
        q: "Как осуществляется возврат?",
        a: "Возврат возможен в течение 14 дней при сохранении товарного вида. Средства возвращаются на исходный способ оплаты."
      }
    ]
  },
  {
    id: "accounts",
    title: "Аккаунты и безопасность",
    icon: User,
    questions: [
      {
        q: "Как зарегистрироваться как партнёр?",
        a: "Выберите 'Партнёр' при регистрации, заполните информацию об оборудовании и материалах, пройдите верификацию."
      },
      {
        q: "Как авторы получают выплаты?",
        a: "Выплаты осуществляются раз в месяц при достижении минимальной суммы в $50 на балансе. Доступны банковские переводы и электронные кошельки."
      },
      {
        q: "Как защищены мои данные?",
        a: "Мы используем шифрование SSL, двухфакторную аутентификацию и строго соблюдаем политику конфиденциальности GDPR."
      },
      {
        q: "Можно ли иметь несколько ролей?",
        a: "Да, один пользователь может быть одновременно клиентом, автором и партнёром. Для каждой роли создаётся отдельный профиль."
      }
    ]
  }
]

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<string>("general")

  const filteredQuestions = faqCategories
    .find(cat => cat.id === activeCategory)
    ?.questions.filter(q => 
      q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.a.toLowerCase().includes(searchQuery.toLowerCase())
    ) || []

  return (
    <div className="container py-12">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-5xl font-bold mb-6">
          Центр помощи
          <span className="text-sf-red"> СтильФормы</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Ответы на часто задаваемые вопросы и руководства по использованию платформы
        </p>
        
        {/* Search */}
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Поиск по вопросам..."
            className="pl-12 h-12 text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Категории</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {faqCategories.map((category) => {
                const Icon = category.icon
                return (
                  <Button
                    key={category.id}
                    variant={activeCategory === category.id ? "default" : "ghost"}
                    className="w-full justify-start gap-3"
                    onClick={() => setActiveCategory(category.id)}
                  >
                    <Icon className="h-4 w-4" />
                    {category.title}
                  </Button>
                )
              })}
            </CardContent>
          </Card>

          {/* Contact Support */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Нужна помощь?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4 text-sm">
                Не нашли ответ на свой вопрос? Наша команда поддержки всегда готова помочь.
              </p>
              <Button className="w-full" asChild>
                <a href="/contact">Связаться с поддержкой</a>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Content */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">
                    {faqCategories.find(c => c.id === activeCategory)?.title}
                  </CardTitle>
                  <CardDescription>
                    {filteredQuestions.length} вопросов в категории
                  </CardDescription>
                </div>
                {searchQuery && (
                  <div className="text-sm text-gray-500">
                    Найдено: {filteredQuestions.length}
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {filteredQuestions.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {filteredQuestions.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left font-medium hover:no-underline">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Вопросы не найдены</h3>
                  <p className="text-gray-600">
                    Попробуйте изменить поисковый запрос или выберите другую категорию
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Popular Guides */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-6">Популярные руководства</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    Как подготовить модель
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Пошаговое руководство по подготовке 3D-модели для успешной печати
                  </p>
                  <Button variant="outline" className="w-full">Читать руководство</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Стать партнёром
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Полное руководство по подключению к сети производственных партнёров
                  </p>
                  <Button variant="outline" className="w-full">Читать руководство</Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Still Need Help */}
          <Card className="mt-8 bg-gradient-to-br from-gray-50 to-white">
            <CardContent className="p-8 text-center">
              <MessageSquare className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-3">Остались вопросы?</h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Наша команда поддержки работает 24/7 и готова помочь с любыми вопросами
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <a href="/contact">Написать в поддержку</a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="mailto:support@styleforms.com">support@styleforms.com</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}