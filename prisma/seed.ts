import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Начало заполнения базы данных демо-данными...')

  // Очистка существующих данных
  await prisma.transaction.deleteMany()
  await prisma.royalty.deleteMany()
  await prisma.review.deleteMany()
  await prisma.favorite.deleteMany()
  await prisma.cartItem.deleteMany()
  await prisma.shippingAddress.deleteMany()
  await prisma.orderAssignment.deleteMany()
  await prisma.printCalculation.deleteMany()
  await prisma.order.deleteMany()
  await prisma.modelFile.deleteMany()
  await prisma.similarModel.deleteMany()
  await prisma.model3D.deleteMany()
  await prisma.modelCategory.deleteMany()
  await prisma.equipment.deleteMany()
  await prisma.partner.deleteMany()
  await prisma.author.deleteMany()
  await prisma.user.deleteMany()
  await prisma.pricingCoefficient.deleteMany()
  await prisma.platformConfig.deleteMany()

  console.log('🗑️ Существующие данные очищены')

  // Создание пользователей
  const demoPassword = await hash('demo123', 10)

  const users = await prisma.user.createManyAndReturn({
    data: [
      {
        email: 'customer@demo.com',
        name: 'Иван Иванов',
        role: 'CUSTOMER',
      },
      {
        email: 'author@demo.com',
        name: 'ДизайнСтудия',
        role: 'AUTHOR',
      },
      {
        email: 'partner@demo.com',
        name: '3DPrintPro',
        role: 'PARTNER',
      },
      {
        email: 'admin@demo.com',
        name: 'Администратор',
        role: 'ADMIN',
      },
    ],
  })

  console.log(`👥 Создано ${users.length} пользователей`)

  // Создание автора
  const authorUser = users.find(u => u.email === 'author@demo.com')
  if (authorUser) {
    await prisma.author.create({
      data: {
        userId: authorUser.id,
        bio: 'Профессиональный дизайнер 3D-моделей с 10-летним опытом',
        website: 'https://designstudio.example.com',
        socialLinks: {
          instagram: '@designstudio',
          behance: 'designstudio',
        },
        rating: 4.8,
        totalEarnings: 2845,
      },
    })
    console.log('🎨 Создан автор')
  }

  // Создание партнёра
  const partnerUser = users.find(u => u.email === 'partner@demo.com')
  if (partnerUser) {
    await prisma.partner.create({
      data: {
        userId: partnerUser.id,
        companyName: '3DPrintPro',
        description: 'Профессиональная студия 3D-печати с современным оборудованием',
        address: 'г. Москва, ул. Тверская, д. 15',
        city: 'Москва',
        country: 'Россия',
        postalCode: '125009',
        rating: 4.8,
        isActive: true,
        maxPrintVolume: 5000,
        availableMaterials: ['PLA', 'ABS', 'PETG', 'RESIN'],
        pricingRules: {
          basePrice: 5,
          materialMultipliers: {
            PLA: 1.0,
            ABS: 1.2,
            PETG: 1.3,
            RESIN: 1.5,
          },
        },
      },
    })
    console.log('🏭 Создан партнёр')

    // Оборудование партнёра
    const partner = await prisma.partner.findFirst({
      where: { userId: partnerUser.id },
    })

    if (partner) {
      await prisma.equipment.create({
        data: {
          partnerId: partner.id,
          name: 'Prusa i3 MK3S+',
          type: 'FDM',
          buildVolume: { x: 250, y: 210, z: 210 },
          materials: ['PLA', 'ABS', 'PETG'],
          isActive: true,
        },
      })
      await prisma.equipment.create({
        data: {
          partnerId: partner.id,
          name: 'Anycubic Photon Mono X',
          type: 'SLA',
          buildVolume: { x: 192, y: 120, z: 245 },
          materials: ['RESIN'],
          isActive: true,
        },
      })
      console.log('🖨️ Создано оборудование партнёра')
    }
  }

  // Создание категорий
  const categories = await prisma.modelCategory.createManyAndReturn({
    data: [
      { name: 'Украшения', slug: 'jewelry', description: 'Ювелирные изделия и бижутерия' },
      { name: 'Аксессуары', slug: 'accessories', description: 'Чехлы, брелоки, аксессуары' },
      { name: 'Fashion-дизайн', slug: 'fashion', description: 'Модные изделия и одежда' },
      { name: 'Игрушки', slug: 'toys', description: 'Игрушки и развлечения' },
      { name: 'Домашние предметы', slug: 'home', description: 'Предметы для дома и интерьера' },
      { name: 'Инженерные детали', slug: 'engineering', description: 'Технические детали и прототипы' },
      { name: 'Арт-объекты', slug: 'art', description: 'Художественные объекты и скульптуры' },
      { name: 'Подарки', slug: 'gifts', description: 'Подарки и сувениры' },
    ],
  })

  console.log(`📂 Создано ${categories.length} категорий`)

  // Создание моделей (только если есть автор)
  const author = await prisma.author.findFirst({
    where: { user: { email: 'author@demo.com' } },
  })

  if (author && categories.length > 0) {
    const models = await prisma.model3D.createManyAndReturn({
      data: [
        {
          title: 'Кольцо с геометрическим узором',
          description: 'Современное кольцо с уникальным геометрическим узором, идеально для 3D-печати из различных материалов.',
          shortDescription: 'Геометрическое кольцо для 3D-печати',
          categoryId: categories.find(c => c.slug === 'jewelry')!.id,
          authorId: author.id,
          price: 24.99,
          isFree: false,
          licenseType: 'Standard',
          fileFormat: 'STL',
          fileSize: 12.5,
          dimensions: { width: 25, height: 25, depth: 8 },
          volume: 15,
          thumbnailUrl: 'https://storage.vectorforms.com/ring.jpg',
          previewImages: [
            'https://storage.vectorforms.com/ring-1.jpg',
            'https://storage.vectorforms.com/ring-2.jpg',
            'https://storage.vectorforms.com/ring-3.jpg',
          ],
          tags: ['ювелирка', 'мода', 'геометрия', 'кольцо'],
          downloadCount: 1245,
          printCount: 89,
          rating: 4.8,
          isPublished: true,
          isFeatured: true,
        },
        {
          title: 'Декоративная ваза',
          description: 'Современная декоративная ваза с уникальным дизайном, отлично подходит для 3D-печати в качестве предмета интерьера.',
          shortDescription: 'Декоративная ваза для интерьера',
          categoryId: categories.find(c => c.slug === 'home')!.id,
          authorId: author.id,
          price: 0,
          isFree: true,
          licenseType: 'Creative Commons',
          fileFormat: 'OBJ',
          fileSize: 45.2,
          dimensions: { width: 120, height: 180, depth: 120 },
          volume: 320,
          thumbnailUrl: 'https://storage.vectorforms.com/vase.jpg',
          previewImages: [
            'https://storage.vectorforms.com/vase-1.jpg',
            'https://storage.vectorforms.com/vase-2.jpg',
          ],
          tags: ['интерьер', 'декор', 'ваза', 'дом'],
          downloadCount: 2890,
          printCount: 156,
          rating: 4.5,
          isPublished: true,
          isFeatured: false,
        },
        {
          title: 'Кастомизированный чехол для телефона',
          description: 'Уникальный чехол для телефона с возможностью кастомизации под разные модели.',
          shortDescription: 'Чехол для телефона с кастомизацией',
          categoryId: categories.find(c => c.slug === 'accessories')!.id,
          authorId: author.id,
          price: 14.99,
          isFree: false,
          licenseType: 'Standard',
          fileFormat: 'STL',
          fileSize: 8.7,
          dimensions: { width: 80, height: 160, depth: 15 },
          volume: 45,
          thumbnailUrl: 'https://storage.vectorforms.com/phonecase.jpg',
          previewImages: [
            'https://storage.vectorforms.com/phonecase-1.jpg',
            'https://storage.vectorforms.com/phonecase-2.jpg',
          ],
          tags: ['чехол', 'гаджеты', 'персонализация', 'аксессуар'],
          downloadCount: 876,
          printCount: 42,
          rating: 4.9,
          isPublished: true,
          isFeatured: true,
        },
      ],
    })

    console.log(`📦 Создано ${models.length} 3D-моделей`)

    // Создание файлов для моделей
    for (const model of models) {
      await prisma.modelFile.create({
        data: {
          modelId: model.id,
          fileName: `${model.title.toLowerCase().replace(/\s+/g, '-')}.stl`,
          fileUrl: `https://storage.vectorforms.com/models/${model.id}/file.stl`,
          fileType: 'STL',
          fileSize: model.fileSize,
          isPrimary: true,
        },
      })
    }
    console.log('📄 Созданы файлы моделей')
  }

  // Создание коэффициентов ценообразования
  await prisma.pricingCoefficient.createMany({
    data: [
      {
        name: 'base_material_pla',
        description: 'Базовая цена материала PLA за см³',
        value: 0.05,
        appliesTo: 'MATERIAL',
        materialType: 'PLA',
        isActive: true,
      },
      {
        name: 'base_material_abs',
        description: 'Базовая цена материала ABS за см³',
        value: 0.08,
        appliesTo: 'MATERIAL',
        materialType: 'ABS',
        isActive: true,
      },
      {
        name: 'print_time_hourly',
        description: 'Стоимость часа печати',
        value: 5.0,
        appliesTo: 'PRINT_TIME',
        isActive: true,
      },
      {
        name: 'platform_fee_percentage',
        description: 'Комиссия платформы',
        value: 10.0,
        appliesTo: 'PLATFORM_FEE',
        isActive: true,
      },
      {
        name: 'partner_margin_percentage',
        description: 'Наценка партнёра',
        value: 20.0,
        appliesTo: 'PARTNER_MARGIN',
        isActive: true,
      },
    ],
  })

  console.log('💰 Созданы ценовые коэффициенты')

  // Создание конфигурации платформы
  await prisma.platformConfig.create({
    data: {
      key: 'general_settings',
      value: {
        currency: 'USD',
        defaultLanguage: 'ru',
        maintenanceMode: false,
        minWithdrawalAmount: 50,
        authorRoyaltyPercentage: 70,
      },
      description: 'Основные настройки платформы',
    },
  })

  console.log('⚙️ Создана конфигурация платформы')

  // Создание адреса доставки для клиента
  const customerUser = users.find(u => u.email === 'customer@demo.com')
  if (customerUser) {
    await prisma.shippingAddress.create({
      data: {
        userId: customerUser.id,
        fullName: 'Иван Иванов',
        addressLine1: 'ул. Тверская, д. 15',
        city: 'Москва',
        country: 'Россия',
        postalCode: '125009',
        phone: '+7 (999) 123-45-67',
        isDefault: true,
      },
    })
    console.log('🏠 Создан адрес доставки клиента')
  }

  console.log('✅ Демо-данные успешно созданы!')
  console.log('\n📊 Сводка:')
  console.log(`   👥 Пользователи: ${users.length}`)
  console.log(`   📂 Категории: ${categories.length}`)
  console.log(`   📦 3D-модели: ${author ? '3' : '0'}`)
  console.log(`   🏭 Партнёры: ${partnerUser ? '1' : '0'}`)
  console.log(`   🎨 Авторы: ${author ? '1' : '0'}`)
  console.log('\n🔑 Демо-аккаунты:')
  console.log('   📧 customer@demo.com / demo123 - Клиент')
  console.log('   📧 author@demo.com / demo123 - Автор')
  console.log('   📧 partner@demo.com / demo123 - Партнёр')
  console.log('   📧 admin@demo.com / demo123 - Администратор')
}

main()
  .catch((e) => {
    console.error('❌ Ошибка при создании демо-данных:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })