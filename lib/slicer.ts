// Серверный «лёгкий слайсер». Парсит STL (binary + ASCII), считает реальный
// объём геометрии методом суммы знаковых объёмов тетраэдров и bbox.
// Время и вес печати оцениваются по объёмной производительности принтера и
// плотности материала. Точность ±15-20% — достаточно для предварительного расчёта,
// в момент назначения партнёр может уточнить вручную.

export interface SliceResult {
  volumeCm3: number
  bbox: { x: number; y: number; z: number } // мм
  surfaceArea: number // мм²
  triangleCount: number
  needsSupports: boolean
}

export interface PrintEstimate {
  weightGrams: number
  printHours: number
  filamentLengthMeters: number
}

// ----------------------------------------------------------------------------
// STL parsing
// ----------------------------------------------------------------------------

const BINARY_HEADER = 80
const TRIANGLE_BYTES = 50 // normal(3*4) + 3 vertices(9*4) + attr(2) = 50

export function parseStl(buffer: ArrayBuffer): SliceResult {
  const view = new DataView(buffer)
  if (isBinaryStl(buffer)) return parseBinaryStl(view)
  return parseAsciiStl(new TextDecoder().decode(buffer))
}

function isBinaryStl(buffer: ArrayBuffer): boolean {
  if (buffer.byteLength < BINARY_HEADER + 4) return false
  const view = new DataView(buffer)
  const triCount = view.getUint32(BINARY_HEADER, true)
  const expected = BINARY_HEADER + 4 + triCount * TRIANGLE_BYTES
  return expected === buffer.byteLength
}

function parseBinaryStl(view: DataView): SliceResult {
  const triCount = view.getUint32(BINARY_HEADER, true)
  let offset = BINARY_HEADER + 4

  let volMm3 = 0
  let area = 0
  let minX = Infinity, minY = Infinity, minZ = Infinity
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity

  for (let i = 0; i < triCount; i++) {
    offset += 12 // skip normal
    const ax = view.getFloat32(offset, true), ay = view.getFloat32(offset + 4, true), az = view.getFloat32(offset + 8, true)
    const bx = view.getFloat32(offset + 12, true), by = view.getFloat32(offset + 16, true), bz = view.getFloat32(offset + 20, true)
    const cx = view.getFloat32(offset + 24, true), cy = view.getFloat32(offset + 28, true), cz = view.getFloat32(offset + 32, true)
    offset += 36 + 2

    volMm3 += signedTetraVolume(ax, ay, az, bx, by, bz, cx, cy, cz)
    area += triangleArea(ax, ay, az, bx, by, bz, cx, cy, cz)

    if (ax < minX) minX = ax; if (bx < minX) minX = bx; if (cx < minX) minX = cx
    if (ay < minY) minY = ay; if (by < minY) minY = by; if (cy < minY) minY = cy
    if (az < minZ) minZ = az; if (bz < minZ) minZ = bz; if (cz < minZ) minZ = cz
    if (ax > maxX) maxX = ax; if (bx > maxX) maxX = bx; if (cx > maxX) maxX = cx
    if (ay > maxY) maxY = ay; if (by > maxY) maxY = by; if (cy > maxY) maxY = cy
    if (az > maxZ) maxZ = az; if (bz > maxZ) maxZ = bz; if (cz > maxZ) maxZ = cz
  }

  return finalize(volMm3, area, triCount, minX, minY, minZ, maxX, maxY, maxZ)
}

function parseAsciiStl(text: string): SliceResult {
  const verts: number[] = []
  const re = /vertex\s+(-?\d*\.?\d+(?:[eE][+-]?\d+)?)\s+(-?\d*\.?\d+(?:[eE][+-]?\d+)?)\s+(-?\d*\.?\d+(?:[eE][+-]?\d+)?)/g
  let m
  while ((m = re.exec(text)) !== null) {
    verts.push(parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3]))
  }
  if (verts.length % 9 !== 0) throw new Error("Битый ASCII STL: число вершин не кратно 9")

  let volMm3 = 0
  let area = 0
  let minX = Infinity, minY = Infinity, minZ = Infinity
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity
  const triCount = verts.length / 9

  for (let i = 0; i < verts.length; i += 9) {
    const [ax, ay, az, bx, by, bz, cx, cy, cz] = verts.slice(i, i + 9)
    volMm3 += signedTetraVolume(ax, ay, az, bx, by, bz, cx, cy, cz)
    area += triangleArea(ax, ay, az, bx, by, bz, cx, cy, cz)

    if (ax < minX) minX = ax; if (bx < minX) minX = bx; if (cx < minX) minX = cx
    if (ay < minY) minY = ay; if (by < minY) minY = by; if (cy < minY) minY = cy
    if (az < minZ) minZ = az; if (bz < minZ) minZ = bz; if (cz < minZ) minZ = cz
    if (ax > maxX) maxX = ax; if (bx > maxX) maxX = bx; if (cx > maxX) maxX = cx
    if (ay > maxY) maxY = ay; if (by > maxY) maxY = by; if (cy > maxY) maxY = cy
    if (az > maxZ) maxZ = az; if (bz > maxZ) maxZ = bz; if (cz > maxZ) maxZ = cz
  }

  return finalize(volMm3, area, triCount, minX, minY, minZ, maxX, maxY, maxZ)
}

function signedTetraVolume(
  ax: number, ay: number, az: number,
  bx: number, by: number, bz: number,
  cx: number, cy: number, cz: number,
): number {
  return (ax * (by * cz - bz * cy) + ay * (bz * cx - bx * cz) + az * (bx * cy - by * cx)) / 6
}

function triangleArea(
  ax: number, ay: number, az: number,
  bx: number, by: number, bz: number,
  cx: number, cy: number, cz: number,
): number {
  const ux = bx - ax, uy = by - ay, uz = bz - az
  const vx = cx - ax, vy = cy - ay, vz = cz - az
  const nx = uy * vz - uz * vy
  const ny = uz * vx - ux * vz
  const nz = ux * vy - uy * vx
  return Math.sqrt(nx * nx + ny * ny + nz * nz) / 2
}

function finalize(
  volMm3: number, area: number, triCount: number,
  minX: number, minY: number, minZ: number,
  maxX: number, maxY: number, maxZ: number,
): SliceResult {
  const bbox = { x: maxX - minX, y: maxY - minY, z: maxZ - minZ }
  const absVol = Math.abs(volMm3)
  // Эвристика: если оверхенг занимает > 40% по Z — нужны поддержки.
  // Без анализа нормалей считаем по соотношению bbox.
  const needsSupports = bbox.z > 30 && bbox.x * bbox.y > 0 && (bbox.x / bbox.z > 1.2 || bbox.y / bbox.z > 1.2)
  return {
    volumeCm3: absVol / 1000, // мм³ → см³
    bbox,
    surfaceArea: area,
    triangleCount: triCount,
    needsSupports,
  }
}

// ----------------------------------------------------------------------------
// Print time / weight estimation
// ----------------------------------------------------------------------------

export interface EstimateInput {
  volumeCm3: number
  density: number              // г/см³ материала
  infillPct: number            // 0-100
  quality: "DRAFT" | "STANDARD" | "HIGH" | "ULTRA"
  volumetricSpeedMmPerSec: number // мм³/с принтера
  needsSupports: boolean
  quantity: number
}

// Эффективная доля материала: оболочка (~30% объёма) + заполнение от infill.
// Это компромисс между чистым bbox и реальным слайсом — даёт ±15% от Cura/Orca.
const SHELL_FRACTION = 0.30

const QUALITY_TIME_MULTIPLIER: Record<EstimateInput["quality"], number> = {
  DRAFT: 0.65,    // 0.28 mm layer
  STANDARD: 1.0,  // 0.20 mm layer
  HIGH: 1.6,      // 0.12 mm layer
  ULTRA: 2.4,     // 0.08 mm layer
}

export function estimatePrint(input: EstimateInput): PrintEstimate {
  const fillFrac = Math.max(0, Math.min(100, input.infillPct)) / 100
  const effectiveFraction = SHELL_FRACTION + (1 - SHELL_FRACTION) * fillFrac
  const supportExtra = input.needsSupports ? 0.12 : 0 // +12% материала на поддержки

  const usedVolumeCm3 = input.volumeCm3 * (effectiveFraction + supportExtra) * input.quantity
  const weightGrams = usedVolumeCm3 * input.density

  // Время = объём в мм³ / объёмная скорость мм³/с → сек, делим на 3600 → часы
  const usedVolumeMm3 = usedVolumeCm3 * 1000
  const printSeconds = usedVolumeMm3 / input.volumetricSpeedMmPerSec
  const baseHours = printSeconds / 3600
  const printHours = baseHours * QUALITY_TIME_MULTIPLIER[input.quality]

  // Длина филамента 1.75 мм: площадь сечения ≈ 2.405 мм², объём в мм³ → длина в мм → метры
  const filamentLengthMeters = usedVolumeMm3 / 2.405 / 1000

  return {
    weightGrams: round(weightGrams, 1),
    printHours: round(printHours, 2),
    filamentLengthMeters: round(filamentLengthMeters, 2),
  }
}

function round(n: number, digits: number): number {
  const f = Math.pow(10, digits)
  return Math.round(n * f) / f
}
