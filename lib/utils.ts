import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount)
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(new Date(date))
}

export function generateOrderNumber() {
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0")
  return `VF-${timestamp}-${random}`
}

export function calculatePrintPrice({
  volume,
  materialPricePerCm3,
  printTimeHours,
  printCostPerHour,
  complexityMultiplier = 1.0,
  supportMultiplier = 1.0,
  postProcessingFee = 0,
  platformFeePercentage = 10,
  partnerMarginPercentage = 20,
  shippingCost = 0,
}: {
  volume: number
  materialPricePerCm3: number
  printTimeHours: number
  printCostPerHour: number
  complexityMultiplier?: number
  supportMultiplier?: number
  postProcessingFee?: number
  platformFeePercentage?: number
  partnerMarginPercentage?: number
  shippingCost?: number
}) {
  // Material cost
  const materialCost = volume * materialPricePerCm3
  
  // Print time cost
  const printCost = printTimeHours * printCostPerHour
  
  // Base cost with complexity and support multipliers
  const baseCost = (materialCost + printCost) * complexityMultiplier * supportMultiplier
  
  // Add post-processing
  const costWithPostProcessing = baseCost + postProcessingFee
  
  // Partner margin
  const partnerMargin = costWithPostProcessing * (partnerMarginPercentage / 100)
  const costWithPartnerMargin = costWithPostProcessing + partnerMargin
  
  // Platform fee
  const platformFee = costWithPartnerMargin * (platformFeePercentage / 100)
  const subtotal = costWithPartnerMargin + platformFee
  
  // Shipping
  const total = subtotal + shippingCost
  
  return {
    materialCost,
    printCost,
    baseCost,
    postProcessingFee,
    partnerMargin,
    platformFee,
    shippingCost,
    subtotal,
    total,
    breakdown: [
      { label: "Material", value: materialCost },
      { label: "Print Time", value: printCost },
      { label: "Complexity", value: baseCost - (materialCost + printCost) },
      { label: "Post-Processing", value: postProcessingFee },
      { label: "Partner Margin", value: partnerMargin },
      { label: "Platform Fee", value: platformFee },
      { label: "Shipping", value: shippingCost },
    ]
  }
}

export function analyze3DModel(file: File) {
  // Mock analysis for prototype
  // In a real implementation, this would use Three.js or a backend service
  // to analyze the 3D model geometry
  
  const mockAnalysis = {
    dimensions: { width: 100, height: 80, depth: 60 }, // mm
    volume: 480, // cm³
    surfaceArea: 25600, // mm²
    boundingBox: { min: [0, 0, 0], max: [100, 80, 60] },
    wallThickness: { min: 2.5, avg: 3.2, max: 5.1 }, // mm
    needsSupports: true,
    supportVolume: 24, // cm³
    estimatedPrintTime: 18, // hours
    estimatedMaterialUsage: 504, // cm³ (including supports)
    printOrientation: { x: 0, y: 0, z: 90 },
    issues: [] as Array<{ type: string; severity: "low" | "medium" | "high"; message: string }>,
    isValid: true,
  }
  
  // Add some mock issues based on file size
  if (file.size > 100 * 1024 * 1024) { // > 100MB
    mockAnalysis.issues.push({
      type: "FILE_SIZE",
      severity: "medium",
      message: "File is very large, may take longer to process",
    })
  }
  
  return mockAnalysis
}

export function findBestPartner(
  order: {
    material: string
    volume: number
    dimensions: { width: number; height: number; depth: number }
    shippingAddress: any
  },
  partners: Array<{
    id: string
    location: { city: string; country: string }
    availableMaterials: string[]
    maxPrintVolume: number
    equipment: Array<{ buildVolume: { x: number; y: number; z: number } }>
    rating: number
    currentLoad: number
    pricing: number
  }>
) {
  const suitablePartners = partners.filter(partner => {
    // Check material availability
    if (!partner.availableMaterials.includes(order.material)) return false
    
    // Check print volume capacity
    if (partner.maxPrintVolume < order.volume) return false
    
    // Check equipment build volume
    const canFit = partner.equipment.some(equipment => {
      const buildVolume = equipment.buildVolume
      return (
        buildVolume.x >= order.dimensions.width &&
        buildVolume.y >= order.dimensions.height &&
        buildVolume.z >= order.dimensions.depth
      )
    })
    
    if (!canFit) return false
    
    return true
  })
  
  if (suitablePartners.length === 0) return null
  
  // Score partners based on multiple factors
  const scoredPartners = suitablePartners.map(partner => {
    let score = partner.rating * 20 // Rating out of 5 -> 0-100
    
    // Lower current load is better
    score += (100 - partner.currentLoad)
    
    // Lower pricing is better (normalized)
    const priceScore = Math.max(0, 100 - (partner.pricing * 10))
    score += priceScore
    
    // TODO: Add distance calculation based on shipping address
    
    return {
      ...partner,
      score,
    }
  })
  
  // Sort by score descending
  scoredPartners.sort((a, b) => b.score - a.score)
  
  return scoredPartners[0]
}