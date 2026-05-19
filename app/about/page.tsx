import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Users, Target, Zap, Globe, Shield } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  const team = [
    { name: "Алексей Петров", role: "CEO & Основатель", bio: "15 лет в индустрии 3D-печати", image: "/api/placeholder/100/100" },
    { name: "Мария Сидорова", role: "CTO", bio: "Эксперт в CAD и машинном обучении", image: "/api/placeholder/100/100" },
    { name: "Дмитрий Иванов", role: "Head of Partnerships", bio: "Бывший операционный директор FabLab", image: "/api/placeholder/100/100" },
    { name: "Елена Козлова", role: "Lead Designer", bio: "Промышленный дизайнер с фокусом на fashion", image: "/api/placeholder/100/100" },
  ]

  const milestones = [
    { year: "2023", title: "Основание компании", description: "Начало разработки платформы" },
    { year: "2024", title: "Запуск MVP", description: "Первый рабочий прототип с базовым функционалом" },
    { year: "2024", title: "Первые партнёры", description: "Подключение 50+ производственных партнёров" },
    { year: "2025", title: "Международная экспансия", description: "Выход на рынки Европы и США" },
  ]

  return (
    <div className="container py-12">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-5xl font-bold mb-6">
          Мы создаём будущее
          <span className="text-sf-red"> 3D-печати</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          СтильФормы — это технологическая платформа, объединяющая дизайнеров, 
          производителей и клиентов в экосистеме распределённого производства.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/print/upload">Начать работу</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/contact">Связаться с нами</Link>
          </Button>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <Card>
          <CardHeader>
            <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle>Наша миссия</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Сделать 3D-печать доступной, простой и быстрой для каждого. 
              Мы устраняем барьеры между идеей и физическим воплощением.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Автоматизация сложных процессов</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Демократизация доступа к технологиям</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Создание устойчивой экосистемы</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
              <Globe className="h-6 w-6 text-purple-600" />
            </div>
            <CardTitle>Наше видение</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Стать ведущей платформой для распределённого цифрового производства 
              с глобальной сетью партнёров и миллионами пользователей по всему миру.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Глобальная сеть производства</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Искусственный интеллект для оптимизации</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Экосистема для креативной экономики</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Values */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Наши ценности</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Zap,
              title: "Инновации",
              description: "Постоянное совершенствование технологий и процессов"
            },
            {
              icon: Users,
              title: "Сообщество",
              description: "Сила платформы в сотрудничестве всех участников"
            },
            {
              icon: Shield,
              title: "Надёжность",
              description: "Гарантия качества и выполнение обязательств"
            },
            {
              icon: Target,
              title: "Прозрачность",
              description: "Честные цены и открытые процессы"
            },
            {
              icon: Globe,
              title: "Устойчивость",
              description: "Эффективное использование ресурсов и материалов"
            },
            {
              icon: CheckCircle,
              title: "Качество",
              description: "Высокие стандарты во всём, что мы делаем"
            },
          ].map((value, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Team */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Команда</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member) => (
            <Card key={member.name} className="text-center">
              <CardContent className="p-6">
                <div className="h-24 w-24 rounded-full bg-gray-200 mx-auto mb-4 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-1">{member.name}</h3>
                <p className="text-primary font-medium mb-2">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Наш путь</h2>
        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-200"></div>
          <div className="space-y-12">
            {milestones.map((milestone, index) => (
              <div key={index} className={`relative flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                <div className={`w-1/2 ${index % 2 === 0 ? 'pr-12 text-right' : 'pl-12'}`}>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                          {milestone.year}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{milestone.title}</h3>
                          <p className="text-gray-600">{milestone.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 h-4 w-4 rounded-full bg-primary border-4 border-white"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <Card className="bg-gradient-to-br from-gray-50 to-white border-2">
          <CardContent className="py-12">
            <h2 className="text-3xl font-bold mb-4">Присоединяйтесь к нам</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Станьте частью революции в цифровом производстве. Вместе мы создаём будущее.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/auth/register">Начать бесплатно</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">Связаться с командой</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}