"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, CreditCard, Lock, Package, Truck, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export default function CheckoutPage() {
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Россия",
  })

  useEffect(() => {
    // Get order details from session storage
    const storedOrder = sessionStorage.getItem('orderDetails')
    if (storedOrder) {
      setOrderDetails(JSON.parse(storedOrder))
    } else {
      // Redirect if no order details
      router.push('/print/calculate')
    }
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.address || !formData.city) {
      toast({
        title: "Заполните все обязательные поля",
        description: "Пожалуйста, проверьте данные формы",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Generate order number
      const orderNumber = `VF-${Date.now().toString().slice(-6)}`
      
      toast({
        title: "Заказ оформлен успешно!",
        description: `Номер вашего заказа: ${orderNumber}`,
      })
      
      // Clear session storage
      sessionStorage.removeItem('modelAnalysis')
      sessionStorage.removeItem('orderDetails')
      
      // Redirect to order confirmation
      setTimeout(() => {
        router.push(`/orders/${orderNumber}`)
      }, 2000)
      
    } catch (error) {
      toast({
        title: "Ошибка оформления заказа",
        description: "Пожалуйста, попробуйте снова",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!orderDetails) {
    return (
      <div className="container py-8">
        <div className="text-center py-12">
          <p className="text-gray-500">Загрузка деталей заказа...</p>
        </div>
      </div>
    )
  }

  const { priceBreakdown, analysis, selectedMaterial, selectedColor, selectedQuality, selectedShipping, quantity } = orderDetails

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Оформление заказа</h1>
        <p className="text-gray-600">
          Проверьте детали заказа и заполните данные для доставки
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details and Shipping */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Контактная информация
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Имя *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Фамилия *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Телефон</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Адрес доставки
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Адрес *</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Улица, дом, квартира"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Город *</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Почтовый индекс</Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Страна</Label>
                    <Input
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Способ оплаты
                </CardTitle>
                <CardDescription>
                  Оплата производится после подтверждения заказа
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="cursor-pointer flex-1">
                      <div className="font-medium">Банковская карта</div>
                      <div className="text-sm text-gray-500">
                        Visa, Mastercard, МИР
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="transfer" id="transfer" />
                    <Label htmlFor="transfer" className="cursor-pointer flex-1">
                      <div className="font-medium">Банковский перевод</div>
                      <div className="text-sm text-gray-500">
                        Реквизиты будут отправлены на email
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="online" id="online" />
                    <Label htmlFor="online" className="cursor-pointer flex-1">
                      <div className="font-medium">Онлайн-кошелёк</div>
                      <div className="text-sm text-gray-500">
                        ЮMoney, Qiwi, WebMoney
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Детали заказа</CardTitle>
                <CardDescription>
                  {quantity} × 3D-печать
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <div>
                      <div className="font-medium">3D-печать</div>
                      <div className="text-sm text-gray-500">
                        {selectedMaterial.name}, {selectedColor}, {selectedQuality.name}
                      </div>
                    </div>
                    <div className="font-medium">
                      ${(priceBreakdown?.total || 0).toFixed(2)}
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Доставка ({selectedShipping.name})</span>
                    <span>${selectedShipping.price}</span>
                  </div>
                </div>

                <Separator />

                {/* Total */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Стоимость товаров</span>
                    <span>${(priceBreakdown?.total || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Доставка</span>
                    <span>${selectedShipping.price}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Итого</span>
                    <span>
                      ${((priceBreakdown?.total || 0) + selectedShipping.price).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Model Details */}
                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 mb-3">
                    <Package className="h-5 w-5 text-gray-400" />
                    <span className="font-medium">Параметры модели</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Размеры</span>
                      <span>{analysis.dimensions.width}×{analysis.dimensions.height}×{analysis.dimensions.depth}мм</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Объём</span>
                      <span>{analysis.volume} см³</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Материал</span>
                      <Badge variant="outline">{selectedMaterial.name}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Качество</span>
                      <Badge variant="outline">{selectedQuality.name}</Badge>
                    </div>
                  </div>
                </div>

                {/* Security and Guarantees */}
                <div className="space-y-2 pt-4">
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <Lock className="h-4 w-4" />
                    <span>Безопасная оплата</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>Гарантия возврата</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>Конфиденциальность данных</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full mt-6 gap-2"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Оформление..."
                  ) : (
                    <>
                      <Lock className="h-5 w-5" />
                      Подтвердить заказ
                    </>
                  )}
                </Button>

                <div className="text-center text-xs text-gray-500 mt-4">
                  Нажимая кнопку, вы соглашаетесь с условиями использования
                  и политикой конфиденциальности
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}