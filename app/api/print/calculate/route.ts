import { NextRequest, NextResponse } from "next/server"
import { calculatePrintPrice } from "@/lib/utils"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      volume,
      material,
      quality,
      includeSupports,
      includePostProcessing,
      shipping,
      quantity = 1,
    } = body

    // Mock material prices (per cm³)
    const materialPrices: Record<string, number> = {
      pla: 0.05,
      abs: 0.08,
      petg: 0.07,
      tpu: 0.12,
      resin: 0.15,
    }

    // Mock quality multipliers
    const qualityMultipliers: Record<string, number> = {
      draft: 0.8,
      standard: 1.0,
      high: 1.3,
      ultra: 1.8,
    }

    const materialPrice = materialPrices[material] || 0.05
    const qualityMultiplier = qualityMultipliers[quality] || 1.0
    
    // Estimate print time based on volume (4 hours per 100 cm³)
    const basePrintTime = (volume / 100) * 4
    const adjustedPrintTime = basePrintTime * qualityMultiplier

    const calculation = calculatePrintPrice({
      volume,
      materialPricePerCm3: materialPrice,
      printTimeHours: adjustedPrintTime,
      printCostPerHour: 5,
      complexityMultiplier: 1.2,
      supportMultiplier: includeSupports ? 1.15 : 1.0,
      postProcessingFee: includePostProcessing ? 15 : 0,
      platformFeePercentage: 10,
      partnerMarginPercentage: 20,
      shippingCost: shipping === "express" ? 25 : shipping === "priority" ? 50 : 10,
    })

    return NextResponse.json({
      success: true,
      data: {
        ...calculation,
        printTime: adjustedPrintTime,
        material: {
          type: material,
          pricePerCm3: materialPrice,
        },
        quality: {
          level: quality,
          multiplier: qualityMultiplier,
        },
      },
    })
  } catch (error) {
    console.error("Calculation error:", error)
    return NextResponse.json(
      { success: false, error: "Ошибка при расчёте стоимости" },
      { status: 500 }
    )
  }
}