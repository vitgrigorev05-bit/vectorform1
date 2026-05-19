// Калькулятор стоимости 3D-печати.
//
// Формула (₽):
//   Себестоимость = Материал + Электричество + Амортизация + Расходники + Труд + Брак
//   Цена партнёра = Себестоимость × (1 + margin%)
//   Сумма к оплате = max(Цена партнёра, минЦена) × (1 + platformFee%) + Доставка
//
// Все коэффициенты берутся из таблицы PartnerPricing — каждый партнёр задаёт
// свои значения при регистрации и в личном кабинете.

export interface PricingInput {
  // От слайсера
  weightGrams: number
  printHours: number

  // Из филамента партнёра
  pricePerGram: number    // ₽/г = spoolPrice / spoolWeight

  // Из принтера партнёра
  powerWatts: number      // Вт во время печати
  purchasePrice: number   // ₽
  lifetimeHours: number   // ресурс в часах

  // Из тарифов партнёра
  electricityRate: number // ₽/кВт·ч
  laborRate: number       // ₽/ч
  consumablesPerHour: number // ₽/ч (сопло, ремни и т.п.)
  marginPct: number       // %
  wastePct: number        // % к материалу — бюджет на брак
  setupMinutes: number    // минут ручной работы на старт
  postProcessMinutes: number
  minOrderPrice: number   // ₽
  defaultShipping: number // ₽

  // Из настроек платформы / выбора пользователя
  platformFeePct: number  // %, комиссия ВекторФорм
  shippingCost?: number   // если не задано — берём defaultShipping
}

export interface PricingBreakdown {
  materialCost: number
  electricityCost: number
  amortizationCost: number
  laborCost: number
  consumablesCost: number
  wasteCost: number
  costBase: number          // сумма всего выше

  partnerMargin: number     // ₽ — наценка партнёра
  partnerPrice: number      // costBase + partnerMargin (или min)
  platformFee: number       // комиссия маркетплейса
  shippingCost: number

  subtotal: number          // partnerPrice + platformFee
  total: number             // subtotal + shipping

  amortizationPerHour: number
  laborHours: number
  currency: "RUB"
}

export function calculatePrice(input: PricingInput): PricingBreakdown {
  // 1. Материал — вес × цена за грамм
  const baseMaterial = input.weightGrams * input.pricePerGram

  // 2. Электричество — мощность(кВт) × часы × тариф
  const electricityCost = (input.powerWatts / 1000) * input.printHours * input.electricityRate

  // 3. Амортизация — стоимость принтера / ресурс × часы
  const amortizationPerHour = input.purchasePrice / Math.max(1, input.lifetimeHours)
  const amortizationCost = amortizationPerHour * input.printHours

  // 4. Расходники — фиксированная ставка ₽/ч × часы
  const consumablesCost = input.consumablesPerHour * input.printHours

  // 5. Труд — setup + postProcess в часах × ставка
  const laborHours = (input.setupMinutes + input.postProcessMinutes) / 60
  const laborCost = laborHours * input.laborRate

  // 6. Брак — % к материалу (страхует от неудачных печатей)
  const wasteCost = baseMaterial * (input.wastePct / 100)
  const materialCost = baseMaterial + wasteCost - wasteCost // оставляем «чистый материал» отдельно для прозрачности
  // Чтобы breakdown был наглядным:
  const materialClean = baseMaterial

  const costBase =
    materialClean + electricityCost + amortizationCost + consumablesCost + laborCost + wasteCost

  // 7. Наценка партнёра
  const partnerMargin = costBase * (input.marginPct / 100)
  let partnerPrice = costBase + partnerMargin

  // 8. Минимальный заказ — страхует от микропечатей
  if (partnerPrice < input.minOrderPrice) {
    partnerPrice = input.minOrderPrice
  }

  // 9. Комиссия платформы
  const platformFee = partnerPrice * (input.platformFeePct / 100)

  // 10. Доставка
  const shippingCost = input.shippingCost ?? input.defaultShipping

  const subtotal = partnerPrice + platformFee
  const total = subtotal + shippingCost

  return {
    materialCost: round(materialClean),
    electricityCost: round(electricityCost),
    amortizationCost: round(amortizationCost),
    laborCost: round(laborCost),
    consumablesCost: round(consumablesCost),
    wasteCost: round(wasteCost),
    costBase: round(costBase),
    partnerMargin: round(partnerMargin),
    partnerPrice: round(partnerPrice),
    platformFee: round(platformFee),
    shippingCost: round(shippingCost),
    subtotal: round(subtotal),
    total: round(total),
    amortizationPerHour: round(amortizationPerHour, 2),
    laborHours: round(laborHours, 2),
    currency: "RUB",
  }
}

function round(n: number, digits = 2): number {
  const f = Math.pow(10, digits)
  return Math.round(n * f) / f
}

// Форматирование для UI
export function formatRub(amount: number): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}
