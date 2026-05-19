import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Сидим базу...")

  // Чистим в порядке внешних ключей
  await prisma.printCalculation.deleteMany()
  await prisma.orderAssignment.deleteMany()
  await prisma.royalty.deleteMany()
  await prisma.transaction.deleteMany()
  await prisma.order.deleteMany()
  await prisma.uploadedFile.deleteMany()
  await prisma.modelFile.deleteMany()
  await prisma.review.deleteMany()
  await prisma.favorite.deleteMany()
  await prisma.cartItem.deleteMany()
  await prisma.model3D.deleteMany()
  await prisma.modelCategory.deleteMany()
  await prisma.filament.deleteMany()
  await prisma.printerProfile.deleteMany()
  await prisma.partnerPricing.deleteMany()
  await prisma.partner.deleteMany()
  await prisma.author.deleteMany()
  await prisma.shippingAddress.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.user.deleteMany()
  await prisma.platformConfig.deleteMany()

  const passwordHash = await hash("demo123", 12)

  const [customer, authorUser, partnerUser1, partnerUser2, admin] = await Promise.all([
    prisma.user.create({
      data: { email: "customer@demo.com", name: "Иван Иванов", role: "CUSTOMER", passwordHash },
    }),
    prisma.user.create({
      data: { email: "author@demo.com", name: "ДизайнСтудия", role: "AUTHOR", passwordHash },
    }),
    prisma.user.create({
      data: { email: "partner@demo.com", name: "3DPrintPro", role: "PARTNER", passwordHash },
    }),
    prisma.user.create({
      data: { email: "partner2@demo.com", name: "MakersHub", role: "PARTNER", passwordHash },
    }),
    prisma.user.create({
      data: { email: "admin@demo.com", name: "Администратор", role: "ADMIN", passwordHash },
    }),
  ])

  const author = await prisma.author.create({
    data: {
      userId: authorUser.id,
      bio: "Студия 3D-дизайна, 10 лет опыта",
      website: "https://designstudio.example.com",
      rating: 4.8,
    },
  })

  // Партнёр 1 — Москва, FDM, тарифы по Москве
  const p1 = await prisma.partner.create({
    data: {
      userId: partnerUser1.id,
      companyName: "3DPrintPro",
      description: "Печать FDM и SLA в центре Москвы",
      address: "ул. Тверская, д. 15",
      city: "Москва",
      region: "Москва",
      country: "RU",
      postalCode: "125009",
      phone: "+7 495 000-00-00",
      rating: 4.8,
      isActive: true,
      isVerified: true,
    },
  })
  await prisma.partnerPricing.create({
    data: {
      partnerId: p1.id,
      electricityRate: 8.5,
      laborRate: 700,
      consumablesPerHour: 6,
      marginPct: 30,
      minOrderPrice: 500,
      setupMinutes: 15,
      postProcessMinutes: 10,
      wastePct: 7,
      defaultShipping: 400,
    },
  })
  const p1Printer = await prisma.printerProfile.create({
    data: {
      partnerId: p1.id,
      name: "Bambu Lab P1S",
      tech: "FDM",
      buildX: 256,
      buildY: 256,
      buildZ: 256,
      powerWatts: 130,
      purchasePrice: 55000,
      lifetimeHours: 5000,
      volumetricSpeed: 18,
      supportedMaterials: ["PLA", "PLA_PLUS", "PETG", "ABS", "ASA", "TPU"],
    },
  })
  await prisma.printerProfile.create({
    data: {
      partnerId: p1.id,
      name: "Anycubic Photon Mono X",
      tech: "SLA",
      buildX: 192,
      buildY: 120,
      buildZ: 245,
      powerWatts: 100,
      purchasePrice: 35000,
      lifetimeHours: 3000,
      volumetricSpeed: 5,
      supportedMaterials: ["RESIN"],
    },
  })
  await prisma.filament.createMany({
    data: [
      {
        partnerId: p1.id,
        type: "PLA",
        brand: "Bestfilament",
        colorName: "Чёрный",
        colorHex: "#111111",
        spoolPrice: 1490,
        spoolWeight: 1000,
        density: 1.24,
        stockGrams: 4000,
      },
      {
        partnerId: p1.id,
        type: "PETG",
        brand: "Bestfilament",
        colorName: "Прозрачный",
        colorHex: "#cfeefb",
        spoolPrice: 1990,
        spoolWeight: 1000,
        density: 1.27,
        stockGrams: 3000,
      },
      {
        partnerId: p1.id,
        type: "TPU",
        brand: "REC",
        colorName: "Белый",
        colorHex: "#ffffff",
        spoolPrice: 2890,
        spoolWeight: 1000,
        density: 1.21,
        stockGrams: 1000,
      },
    ],
  })

  // Партнёр 2 — Екатеринбург, дешевле электричество, ниже наценка
  const p2 = await prisma.partner.create({
    data: {
      userId: partnerUser2.id,
      companyName: "MakersHub Екатеринбург",
      description: "FDM-печать в регионе, низкие цены",
      address: "ул. Малышева, 12",
      city: "Екатеринбург",
      region: "Свердловская область",
      country: "RU",
      postalCode: "620014",
      phone: "+7 343 000-00-00",
      rating: 4.6,
      isActive: true,
      isVerified: true,
    },
  })
  await prisma.partnerPricing.create({
    data: {
      partnerId: p2.id,
      electricityRate: 4.5,
      laborRate: 450,
      consumablesPerHour: 4,
      marginPct: 25,
      minOrderPrice: 300,
      setupMinutes: 10,
      postProcessMinutes: 5,
      wastePct: 5,
      defaultShipping: 250,
    },
  })
  await prisma.printerProfile.create({
    data: {
      partnerId: p2.id,
      name: "Creality Ender 3 V3",
      tech: "FDM",
      buildX: 220,
      buildY: 220,
      buildZ: 250,
      powerWatts: 110,
      purchasePrice: 22000,
      lifetimeHours: 5000,
      volumetricSpeed: 14,
      supportedMaterials: ["PLA", "PLA_PLUS", "PETG"],
    },
  })
  await prisma.filament.createMany({
    data: [
      {
        partnerId: p2.id,
        type: "PLA",
        brand: "FDplast",
        colorName: "Синий",
        colorHex: "#1d4ed8",
        spoolPrice: 1100,
        spoolWeight: 1000,
        density: 1.24,
        stockGrams: 5000,
      },
      {
        partnerId: p2.id,
        type: "PETG",
        brand: "FDplast",
        colorName: "Чёрный",
        colorHex: "#111111",
        spoolPrice: 1550,
        spoolWeight: 1000,
        density: 1.27,
        stockGrams: 2000,
      },
    ],
  })

  // Категории
  const cats = await Promise.all(
    [
      ["Украшения", "jewelry"],
      ["Аксессуары", "accessories"],
      ["Игрушки", "toys"],
      ["Дом и интерьер", "home"],
      ["Инженерные детали", "engineering"],
      ["Арт-объекты", "art"],
    ].map(([name, slug]) =>
      prisma.modelCategory.create({ data: { name, slug, description: name } }),
    ),
  )

  // Модели
  await prisma.model3D.create({
    data: {
      title: "Кольцо с геометрией",
      description: "Современное кольцо с геометрическим узором",
      shortDescription: "Геометрическое кольцо",
      categoryId: cats[0].id,
      authorId: author.id,
      price: 290,
      isFree: false,
      fileFormat: "STL",
      fileSize: 12.5,
      dimWidth: 25, dimHeight: 25, dimDepth: 8,
      volume: 4,
      tags: ["ювелирка", "геометрия"],
      isFeatured: true,
    },
  })
  await prisma.model3D.create({
    data: {
      title: "Декоративная ваза",
      description: "Современная декоративная ваза для интерьера",
      shortDescription: "Ваза",
      categoryId: cats[3].id,
      authorId: author.id,
      price: 0,
      isFree: true,
      fileFormat: "STL",
      fileSize: 45.2,
      dimWidth: 120, dimHeight: 180, dimDepth: 120,
      volume: 320,
      tags: ["декор", "ваза"],
    },
  })

  await prisma.shippingAddress.create({
    data: {
      userId: customer.id,
      fullName: "Иван Иванов",
      addressLine1: "ул. Тверская, д. 15",
      city: "Москва",
      region: "Москва",
      postalCode: "125009",
      country: "RU",
      phone: "+7 999 123-45-67",
      isDefault: true,
    },
  })

  await prisma.platformConfig.create({
    data: {
      key: "platform_fee_pct",
      value: 10,
      description: "Комиссия маркетплейса в процентах",
    },
  })

  console.log("✅ Готово.")
  console.log("\nАккаунты (пароль demo123):")
  console.log("  customer@demo.com  — клиент")
  console.log("  author@demo.com    — автор")
  console.log("  partner@demo.com   — партнёр (Москва)")
  console.log("  partner2@demo.com  — партнёр (Екатеринбург)")
  console.log("  admin@demo.com     — администратор")
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
