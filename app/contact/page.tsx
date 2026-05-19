"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    department: "support"
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Заполните обязательные поля",
        description: "Пожалуйста, заполните все необходимые поля",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast({
        title: "Сообщение отправлено!",
        description: "Мы свяжемся с вами в ближайшее время",
      })
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        department: "support"
      })
      
    } catch (error) {
      toast({
        title: "Ошибка отправки",
        description: "Пожалуйста, попробуйте снова",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: MapPin,
      title: "Адрес",
      details: "г. Москва, ул. Тверская, д. 7\nБизнес-центр 'Тверской'",
      link: "https://maps.google.com/?q=Москва+Тверская+7"
    },
    {
      icon: Phone,
      title: "Телефон",
      details: "+7 (495) 123-45-67\n+7 (800) 123-45-67",
      link: "tel:+74951234567"
    },
    {
      icon: Mail,
      title: "Email",
      details: "info@styleforms.com\nsupport@styleforms.com",
      link: "mailto:info@styleforms.com"
    },
    {
      icon: Clock,
      title: "Часы работы",
      details: "Пн-Пт: 9:00-18:00\nСб-Вс: 10:00-16:00",
      link: null
    }
  ]

  const departments = [
    { value: "support", label: "Техническая поддержка" },
    { value: "sales", label: "Отдел продаж" },
    { value: "partnership", label: "Партнёрство" },
    { value: "authors", label: "Для авторов" },
    { value: "press", label: "Для прессы" },
    { value: "other", label: "Другое" },
  ]

  return (
    <div className="container py-12">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-5xl font-bold mb-6">
          Свяжитесь с
          <span className="text-sf-red"> нами</span>
        </h1>
        <p className="text-xl text-gray-600">
          Мы всегда рады помочь и ответить на ваши вопросы
        </p>
      </div>

      {/* Contact Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {contactInfo.map((info) => {
          const Icon = info.icon
          return (
            <Card key={info.title} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">{info.title}</h3>
                <p className="text-gray-600 whitespace-pre-line">
                  {info.details}
                </p>
                {info.link && (
                  <Button variant="link" className="mt-2" asChild>
                    <a href={info.link}>Перейти</a>
                  </Button>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Напишите нам</CardTitle>
              <CardDescription>
                Заполните форму, и мы ответим в течение 24 часов
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Имя *</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Ваше имя"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Отдел</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) => handleSelectChange("department", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите отдел" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.value} value={dept.value}>
                          {dept.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Тема</Label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="Тема сообщения"
                    value={formData.subject}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Сообщение *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Опишите ваш вопрос или предложение..."
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-600">
                    Отправляя форму, вы соглашаетесь с обработкой персональных данных 
                    в соответствии с нашей политикой конфиденциальности
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full gap-2"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Отправка..."
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Отправить сообщение
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* FAQ and Additional Info */}
        <div className="space-y-8">
          {/* Common Questions */}
          <Card>
            <CardHeader>
              <CardTitle>Частые вопросы</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-1">Как стать партнёром?</h4>
                <p className="text-gray-600 text-sm">
                  Зарегистрируйтесь как партнёр и предоставьте информацию об оборудовании. 
                  После верификации вы начнёте получать заказы.
                </p>
                <Button variant="link" className="p-0 h-auto" asChild>
                  <a href="/auth/register">Зарегистрироваться как партнёр →</a>
                </Button>
              </div>
              
              <div>
                <h4 className="font-semibold mb-1">Как продавать модели?</h4>
                <p className="text-gray-600 text-sm">
                  Зарегистрируйтесь как автор, загрузите свои модели и настройте цены. 
                  Получайте роялти с каждой продажи.
                </p>
                <Button variant="link" className="p-0 h-auto" asChild>
                  <a href="/auth/register">Стать автором →</a>
                </Button>
              </div>
              
              <div>
                <h4 className="font-semibold mb-1">Нужна техническая помощь?</h4>
                <p className="text-gray-600 text-sm">
                  Посетите наш Центр помощи с подробными руководствами 
                  и часто задаваемыми вопросами.
                </p>
                <Button variant="link" className="p-0 h-auto" asChild>
                  <a href="/faq">Перейти в Центр помощи →</a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Social Media */}
          <Card>
            <CardHeader>
              <CardTitle>Мы в соцсетях</CardTitle>
              <CardDescription>
                Следите за новостями и обновлениями
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="gap-2">
                  <div className="h-5 w-5 bg-blue-500 rounded flex items-center justify-center text-white">
                    f
                  </div>
                  Facebook
                </Button>
                <Button variant="outline" className="gap-2">
                  <div className="h-5 w-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded flex items-center justify-center text-white">
                    IG
                  </div>
                  Instagram
                </Button>
                <Button variant="outline" className="gap-2">
                  <div className="h-5 w-5 bg-blue-400 rounded flex items-center justify-center text-white">
                    t
                  </div>
                  Twitter
                </Button>
                <Button variant="outline" className="gap-2">
                  <div className="h-5 w-5 bg-blue-700 rounded flex items-center justify-center text-white">
                    in
                  </div>
                  LinkedIn
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Support */}
          <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-700">Срочная поддержка</CardTitle>
              <CardDescription>
                Для критических проблем с заказами
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium">Горячая линия</div>
                    <div className="text-blue-700 font-bold">+7 (800) 123-45-67</div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Доступно 24/7 для экстренных случаев с текущими заказами
                </p>
                <Button variant="default" className="w-full bg-blue-600 hover:bg-blue-700">
                  <Phone className="h-4 w-4 mr-2" />
                  Позвонить сейчас
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Map */}
      <Card className="mt-12">
        <CardHeader>
          <CardTitle>Наше местоположение</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 rounded-lg overflow-hidden bg-gray-100 relative">
            {/* Mock Map */}
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <div className="font-medium">г. Москва, ул. Тверская, д. 7</div>
                <div className="text-gray-500">Бизнес-центр 'Тверской'</div>
              </div>
            </div>
            <div className="absolute top-4 right-4">
              <Button variant="outline" size="sm">
                Открыть в Google Maps
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}