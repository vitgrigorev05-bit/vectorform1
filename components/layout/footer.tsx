import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Facebook, Instagram, Twitter, Linkedin, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t bg-gray-50 dark:bg-gray-900">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-vector-blue to-vector-purple" />
              <span className="text-2xl font-bold tracking-tight">ВекторФорм</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
              Платформа для автоматического расчёта стоимости 3D-печати, маркетплейса 3D-моделей 
              и распределённого производства через сеть партнёров.
            </p>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Linkedin className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Платформа</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/marketplace" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                  Маркетплейс моделей
                </Link>
              </li>
              <li>
                <Link href="/print" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                  Авторасчёт печати
                </Link>
              </li>
              <li>
                <Link href="/materials" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                  Материалы
                </Link>
              </li>
              <li>
                <Link href="/partners" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                  Для партнёров
                </Link>
              </li>
              <li>
                <Link href="/authors" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                  Для авторов
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Ресурсы</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/blog" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                  Блог
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/docs" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                  Документация
                </Link>
              </li>
              <li>
                <Link href="/tutorials" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                  Видеоуроки
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                  Сообщество
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Компания</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                  О нас
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                  Карьера
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                  Контакты
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                  Политика конфиденциальности
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                  Условия использования
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 dark:text-gray-500 text-sm">
            © {new Date().getFullYear()} ВекторФорм. Все права защищены.
          </p>
          <div className="mt-4 md:mt-0 flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
            <Mail className="h-4 w-4" />
            <span>support@vectorforms.com</span>
          </div>
        </div>
      </div>
    </footer>
  )
}