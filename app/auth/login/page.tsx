"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { LogIn, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast({
        title: "Заполните все поля",
        description: "Пожалуйста, введите email и пароль",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const res = await signIn("credentials", { email, password, redirect: false })
      if (res?.error) {
        toast({
          title: "Ошибка входа",
          description: "Неверный email или пароль",
          variant: "destructive",
        })
      } else {
        toast({ title: "Вход выполнен успешно" })
        router.push("/dashboard")
        router.refresh()
      }
    } catch {
      toast({
        title: "Ошибка входа",
        description: "Сервер недоступен",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = (role: "customer" | "author" | "partner" | "admin") => {
    setIsLoading(true)
    
    // Set demo credentials based on role
    const demoCredentials = {
      customer: { email: "customer@demo.com", password: "demo123" },
      author: { email: "author@demo.com", password: "demo123" },
      partner: { email: "partner@demo.com", password: "demo123" },
      admin: { email: "admin@demo.com", password: "demo123" },
    }
    
    setEmail(demoCredentials[role].email)
    setPassword(demoCredentials[role].password)
    
    setTimeout(() => {
      toast({
        title: `Демо-вход как ${role === "customer" ? "Клиент" : role === "author" ? "Автор" : role === "partner" ? "Партнёр" : "Админ"}`,
        description: "Используются демо-данные",
      })
      
      setTimeout(() => {
        router.push(
          role === "customer" ? "/dashboard" :
          role === "author" ? "/author" :
          role === "partner" ? "/partner" :
          "/admin"
        )
      }, 1000)
      
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-vector-blue to-vector-purple" />
            <span className="text-2xl font-bold">ВекторФорм</span>
          </Link>
          <p className="text-gray-600 mt-2">
            Платформа для 3D-печати и маркетплейса моделей
          </p>
        </div>

        {/* Login Card */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Вход в аккаунт</CardTitle>
            <CardDescription>
              Введите свои данные для входа в систему
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Пароль</Label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    Забыли пароль?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Введите пароль"
                    className="pl-10 pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label
                  htmlFor="remember"
                  className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Запомнить меня
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  "Вход..."
                ) : (
                  <>
                    <LogIn className="h-4 w-4" />
                    Войти в аккаунт
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6">
              <Separator className="my-4" />
              <div className="text-center text-sm text-gray-500 mb-4">
                Или войдите с помощью
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
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              Нет аккаунта?{" "}
              <Link href="/auth/register" className="text-primary hover:underline">
                Зарегистрироваться
              </Link>
            </div>
          </CardFooter>
        </Card>

        {/* Demo Accounts */}
        <Card className="mt-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-center">Демо-аккаунты</CardTitle>
            <CardDescription className="text-center">
              Для быстрого ознакомления с платформой
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => handleDemoLogin("customer")}
                disabled={isLoading}
              >
                Клиент
              </Button>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => handleDemoLogin("author")}
                disabled={isLoading}
              >
                Автор
              </Button>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => handleDemoLogin("partner")}
                disabled={isLoading}
              >
                Партнёр
              </Button>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => handleDemoLogin("admin")}
                disabled={isLoading}
              >
                Админ
              </Button>
            </div>
          </CardContent>
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