"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { calculatePrintPrice } from "@/lib/utils"
import { CheckCircle, Package, Truck, CreditCard, Printer } from "lucide-react"
import { useRouter } from "next/navigation"

// Mock data
const materials = [
  { id: "pla", name: "PLA", price: 0.05, colors: ["Белый", "Чёрный", "Серый", "Синий", "Красный"] },
  { id: "abs", name: "ABS", price: 0.08, colors: ["Белый", "Чёрный", "Серый", "Красный"] },
  { id: "petg", name: "PETG", price: 0.07, colors: ["Прозрачный", "Синий", "Чёрный", "Белый"] },
  { id: "tpu", name: "TPU", price: 0.12, colors: ["Чёрный", "Белый", "Прозрачный"] },
  { id: "resin", name: "Фотополимер", price: 0.15, colors: ["Прозрачный", "Белый", "Серый"] },
]

const printQualities = [
  { id: "draft", name: "Черновой", multiplier: 0.8, timeMultiplier: 0.7 },
  { id: "standard", name: "Стандартный", multiplier: 1.0, timeMultiplier: 1.0 },
  { id: "high", name: "Высокий", multiplier: 1.3, timeMultiplier: 1.5 },
  { id: "ultra", name: "Ультра", multiplier: 1.8, timeMultiplier: 2.0 },
]

const shippingOptions = [
  { id: "standard", name: "Стандартная", price: 10, days: "7-14 дней" },
  { id: "express", name: "Экспресс", price: 25, days: "3-5 дней" },
  { id: "priority", name: "Приоритет", price: 50, days: "1-2 дня" },
]

export default function CalculatePage() {
  const router = useRouter()
  const [analysis, setAnalysis] = useState<any>(null)
  const [selectedMaterial, setSelectedMaterial] = useState(materials[0])
  const [selectedColor, setSelectedColor] = useState("Белый")
  const [selectedQuality, setSelectedQuality] = useState(printQualities[1])
  const [selectedShipping, setSelectedShipping] = useState(shippingOptions[0])
  const [includeSupports, setIncludeSupports] = useState(true)
  const [includePostProcessing, setIncludePostProcessing] = useState(false)
  const [quantity, setQuantity] = useState(1)
  
  const [priceBreakdown, setPriceBreakdown] = useState<any>(null)

  useEffect(() => {
    // Get analysis from session storage
    const storedAnalysis = sessionStorage.getItem('modelAnalysis')
    if (storedAnalysis) {
      setAnalysis(JSON.parse(storedAnalysis))
    } else {
      // Redirect if no analysis
      router.push('/print/upload')
    }
  }, [router])

  useEffect(() => {
    if (!analysis) return

    const calculation = calculatePrintPrice({
      volume: analysis.volume,
      materialPricePerCm3: selectedMaterial.price,
      printTimeHours: analysis.estimatedPrintTime * selectedQuality.timeMultiplier,
      printCostPerHour: 5, // Base print cost per hour
      complexityMultiplier: 1.2, // Based on analysis complexity
      supportMultiplier: includeSupports ? 1.15 : 1.0,
      postProcessingFee: includePostProcessing ? 15 : 0,
      platformFeePercentage: 10,
      partnerMarginPercentage: 20,
      shippingCost: selectedShipping.price,
    })

    setPriceBreakdown(calculation)
  }, [analysis, selectedMaterial, selectedQuality, includeSupports, includePostProcessing, selectedShipping, quantity])

  if (!analysis) {
    return (
      <div className="container py-8">
        <div className="text-center py-12">
          <p className="text-gray-500">Загрузка анализа модели...</p>
        </div>
      </div>
    )
  }

  const handleOrder = () => {
    // Store order details
    const orderDetails = {
      analysis,
      selectedMaterial,
      selectedColor,
      selectedQuality,
      selectedShipping,
      includeSupports,
      includePostProcessing,
      quantity,
      priceBreakdown,
    }
    sessionStorage.setItem('orderDetails', JSON.stringify(orderDetails))
    router.push('/print/checkout')
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Расчёт стоимости печати</h1>
        <p className="text-gray-600">
          Настройте параметры печати и получите точную стоимость
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Configuration Panel */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Материал и цвет
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="mb-3 block">Выберите материал</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {materials.map((material) => (
                    <button
                      key={material.id}
                      onClick={() => setSelectedMaterial(material)}
                      className={`flex flex-col items-center justify-between rounded-md border-2 p-4 transition-all ${
                        selectedMaterial.id === material.id
                          ? "border-primary bg-primary/5"
                          : "border-muted hover:border-gray-300"
                      }`}
                    >
                      <div className="font-medium">{material.name}</div>
                      <div className="text-sm text-gray-500">
                        ${material.price}/см³
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="mb-3 block">Цвет</Label>
                <Select value={selectedColor} onValueChange={setSelectedColor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите цвет" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedMaterial.colors.map((color) => (
                      <SelectItem key={color} value={color}>
                        {color}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Printer className="h-5 w-5" />
                Настройки печати
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="mb-3 block">Качество печати</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {printQualities.map((quality) => (
                    <button
                      key={quality.id}
                      onClick={() => setSelectedQuality(quality)}
                      className={`flex flex-col items-center justify-between rounded-md border-2 p-4 transition-all ${
                        selectedQuality.id === quality.id
                          ? "border-primary bg-primary/5"
                          : "border-muted hover:border-gray-300"
                      }`}
                    >
                      <div className="font-medium">{quality.name}</div>
                      <div className="text-xs text-gray-500">
                        {quality.multiplier}x
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="supports" className="cursor-pointer">
                    <div className="font-medium">Поддержки</div>
                    <div className="text-sm text-gray-500">
                      {analysis.needsSupports ? "Рекомендуется" : "Опционально"}
                    </div>
                  </Label>
                  <Switch
                    id="supports"
                    checked={includeSupports}
                    onCheckedChange={setIncludeSupports}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="post-processing" className="cursor-pointer">
                    <div className="font-medium">Постобработка</div>
                    <div className="text-sm text-gray-500">
                      Шлифовка, покраска, полировка
                    </div>
                  </Label>
                  <Switch
                    id="post-processing"
                    checked={includePostProcessing}
                    onCheckedChange={setIncludePostProcessing}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <Label>Количество</Label>
                  <span className="font-medium">{quantity} шт.</span>
                </div>
                <Slider
                  value={[quantity]}
                  onValueChange={([value]) => setQuantity(value)}
                  min={1}
                  max={10}
                  step={1}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Доставка
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {shippingOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedShipping(option)}
                    className={`w-full flex items-center justify-between p-3 rounded-md border-2 transition-all ${
                      selectedShipping.id === option.id
                        ? "border-primary bg-primary/5"
                        : "border-muted hover:border-gray-300"
                    }`}
                  >
                    <div className="text-left">
                      <div className="font-medium">{option.name}</div>
                      <div className="text-sm text-gray-500">
                        Доставка: {option.days}
                      </div>
                    </div>
                    <div className="font-medium">${option.price}</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Price Summary */}
        <div className="space-y-6">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Стоимость заказа</CardTitle>
              <CardDescription>
                {quantity} × {analysis.dimensions.width}×{analysis.dimensions.height}×{analysis.dimensions.depth}мм
              </CardDescription>
            </CardHeader>
            <CardContent>
              {priceBreakdown && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    {priceBreakdown.breakdown.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600">{item.label}</span>
                        <span>${(item.value * quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Итого</span>
                      <span>${(priceBreakdown.total * quantity).toFixed(2)}</span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Включая НДС и все сборы
                    </div>
                  </div>

                  <div className="space-y-2 pt-4">
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span>Гарантия качества</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span>Бесплатный перерасчёт при ошибке</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span>Поддержка 24/7</span>
                    </div>
                  </div>

                  <Button
                    className="w-full mt-6 gap-2"
                    size="lg"
                    onClick={handleOrder}
                  >
                    <CreditCard className="h-5 w-5" />
                    Перейти к оформлению
                  </Button>

                  <div className="text-center text-sm text-gray-500 mt-4">
                    Оплата после подтверждения заказа
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Model Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Детали модели</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Размеры</span>
                <span className="font-medium">
                  {analysis.dimensions.width}×{analysis.dimensions.height}×{analysis.dimensions.depth}мм
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Объём</span>
                <span className="font-medium">{analysis.volume} см³</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Время печати</span>
                <span className="font-medium">
                  {(analysis.estimatedPrintTime * selectedQuality.timeMultiplier).toFixed(1)} часов
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Материал</span>
                <span className="font-medium">{selectedMaterial.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Качество</span>
                <Badge variant="outline">{selectedQuality.name}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}