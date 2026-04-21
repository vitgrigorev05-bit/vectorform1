import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search, Upload, ShoppingCart, User } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-vector-blue to-vector-purple" />
            <span className="text-xl font-bold tracking-tight">ВекторФорм</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/marketplace" className="text-sm font-medium hover:text-primary transition-colors">
              Маркетплейс
            </Link>
            <Link href="/print/upload" className="text-sm font-medium hover:text-primary transition-colors">
              Печать
            </Link>
            <Link href="/print/calculate" className="text-sm font-medium hover:text-primary transition-colors">
              Материалы
            </Link>
            <Link href="/partner" className="text-sm font-medium hover:text-primary transition-colors">
              Партнёрам
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
              О проекте
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Поиск моделей..."
              className="pl-9 w-[300px]"
            />
          </div>
          
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard">
              <ShoppingCart className="h-5 w-5" />
            </Link>
          </Button>
          
          <Button variant="outline" className="gap-2" asChild>
            <Link href="/print/upload">
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Загрузить модель</span>
            </Link>
          </Button>
          
          <Button variant="ghost" size="icon" asChild>
            <Link href="/auth/login">
              <User className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}