"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { signIn } from "next-auth/react"
import { UserPlus, Mail, Lock, User, Eye, EyeOff, ArrowRight, Building, Palette } from "lucide-react"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "customer",
    acceptTerms: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast({
        title: "Заполните все поля",
        description: "Пожалуйста, заполните все обязательные поля",
        variant: "destructive",
      })
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Пароли не совпадают",
        description: "Пожалуйста, убедитесь, что пароли совпадают",
        variant: "destructive",
      })
      return
    }

    if (!formData.acceptTerms) {
      toast({
        title: "Примите условия",
        description: "Пожалуйста, примите условия использования",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const role =
        formData.userType === "author" ? "AUTHOR" : formData.userType === "partner" ? "PARTNER" : "CUSTOMER"
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role,
        }),
      })
      const body = await res.json()
      if (!res.ok) {
        toast({
          title: "Ошибка регистрации",
          description: body?.error ?? "Не удалось создать аккаунт",
          variant: "destructive",
        })
        return
      }
      await signIn("credentials", { email: formData.email, password: formData.password, redirect: false })
      toast({ title: "Регистрация успешна", description: "Добро пожаловать в СтильФормы!" })
      if (role === "PARTNER") router.push("/partner/onboarding")
      else if (role === "AUTHOR") router.push("/author")
      else router.push("/dashboard")
      router.refresh()
    } catch {
      toast({
        title: "Ошибка регистрации",
        description: "Сервер недоступен",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white py-12 px-4">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-sf-red" />
            <span className="text-2xl font-bold">СтильФормы</span>
          </Link>
          <p className="text-gray-600 mt-2">
            Присоединяйтесь к платформе для 3D-печати и маркетплейса моделей
          </p>
        </div>

        {/* Registration Card */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Создание аккаунта</CardTitle>
            <CardDescription>
              Заполните форму для регистрации на платформе
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* User Type Selection */}
              <div className="space-y-3">
                <Label>Выберите тип аккаунта</Label>
                <RadioGroup
                  value={formData.userType}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, userType: value }))}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  <div>
                    <RadioGroupItem
                      value="customer"
                      id="customer"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="customer"
                      className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                    >
                      <User className="h-6 w-6 mb-2" />
                      <div className="font-medium">Клиент</div>
                      <div className="text-sm text-gray-500 text-center">
                        Покупайте модели и заказывайте печать
                      </div>
                    </Label>
                  </div>
                  
                  <div>
                    <RadioGroupItem
                      value="author"
                      id="author"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="author"
                      className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                    >
                      <Palette className="h-6 w-6 mb-2" />
                      <div className="font-medium">Автор</div>
                      <div className="text-sm text-gray-500 text-center">
                        Продавайте свои 3D-модели
                      </div>
                    </Label>
                  </div>
                  
                  <div>
                    <RadioGroupItem
                      value="partner"
                      id="partner"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="partner"
                      className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                    >
                      <Building className="h-6 w-6 mb-2" />
                      <div className="font-medium">Партнёр</div>
                      <div className="text-sm text-gray-500 text-center">
                        Выполняйте заказы на 3D-печать
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Имя и фамилия *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="name"
                      name="name"
                      placeholder="Иван Иванов"
                      className="pl-10"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="email@example.com"
                      className="pl-10"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Пароль *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Минимум 8 символов"
                      className="pl-10 pr-10"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Подтверждение пароля *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Повторите пароль"
                      className="pl-10 pr-10"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Password Requirements */}
              <div className="rounded-lg border p-4 bg-gray-50">
                <Label className="mb-2 block">Требования к паролю:</Label>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${formData.password.length >= 8 ? "bg-green-500" : "bg-gray-300"}`} />
                    Минимум 8 символов
                  </li>
                  <li className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${/[A-Z]/.test(formData.password) ? "bg-green-500" : "bg-gray-300"}`} />
                    Хотя бы одна заглавная буква
                  </li>
                  <li className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${/\d/.test(formData.password) ? "bg-green-500" : "bg-gray-300"}`} />
                    Хотя бы одна цифра
                  </li>
                </ul>
              </div>

              {/* Terms and Conditions */}
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.acceptTerms}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, acceptTerms: checked as boolean }))}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor="terms"
                      className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Я принимаю{" "}
                      <Link href="/terms" className="text-primary hover:underline">
                        Условия использования
                      </Link>{" "}
                      и{" "}
                      <Link href="/privacy" className="text-primary hover:underline">
                        Политику конфиденциальности
                      </Link>
                    </Label>
                  </div>
                </div>

                {formData.userType === "partner" && (
                  <div className="flex items-start space-x-2">
                    <Checkbox id="partner-agreement" />
                    <div className="grid gap-1.5 leading-none">
                      <Label
                        htmlFor="partner-agreement"
                        className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Я подтверждаю, что имею необходимое оборудование для 3D-печати
                        и согласен с условиями партнёрского соглашения
                      </Label>
                    </div>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  "Регистрация..."
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" />
                    Создать аккаунт
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6">
              <Separator className="my-4" />
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-2">
                  Или зарегистрируйтесь с помощью
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="w-full">
                    Google
                  </Button>
                  <Button variant="outline" className="w-full">
                    GitHub
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              Уже есть аккаунт?{" "}
              <Link href="/auth/login" className="text-primary hover:underline">
                Войти
              </Link>
            </div>
          </CardFooter>
        </Card>

        {/* Back to home */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            Вернуться на главную
          </Link>
        </div>
      </div>
    </div>
  )
}