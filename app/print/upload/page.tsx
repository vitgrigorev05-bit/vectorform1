"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CloudUpload, File, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { calculatePrintPrice, analyze3DModel } from "@/lib/utils"

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [analysis, setAnalysis] = useState<any>(null)
  const { toast } = useToast()
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    // Check file type
    const validExtensions = ['.stl', '.obj', '.3mf', '.step', '.fbx', '.glb', '.gltf']
    const fileExtension = selectedFile.name.toLowerCase().substring(selectedFile.name.lastIndexOf('.'))
    
    if (!validExtensions.includes(fileExtension)) {
      toast({
        title: "Неподдерживаемый формат",
        description: "Пожалуйста, загрузите файл в формате STL, OBJ, 3MF, STEP, FBX, GLB или GLTF",
        variant: "destructive",
      })
      return
    }

    // Check file size (max 500MB)
    if (selectedFile.size > 500 * 1024 * 1024) {
      toast({
        title: "Файл слишком большой",
        description: "Максимальный размер файла — 500 МБ",
        variant: "destructive",
      })
      return
    }

    setFile(selectedFile)
    setAnalysis(null)
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval)
          return 90
        }
        return prev + 10
      })
    }, 200)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Analyze the model
      const analysisResult = analyze3DModel(file)
      setAnalysis(analysisResult)
      
      setUploadProgress(100)
      
      toast({
        title: "Модель успешно загружена",
        description: "Анализ геометрии завершён",
      })
    } catch (error) {
      toast({
        title: "Ошибка загрузки",
        description: "Не удалось загрузить файл. Попробуйте снова.",
        variant: "destructive",
      })
    } finally {
      clearInterval(interval)
      setIsUploading(false)
    }
  }

  const handleContinue = () => {
    if (analysis) {
      // Store analysis in session storage
      sessionStorage.setItem('modelAnalysis', JSON.stringify(analysis))
      sessionStorage.setItem('uploadedFile', JSON.stringify({
        name: file?.name,
        size: file?.size,
      }))
      router.push('/print/calculate')
    }
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">Загрузите 3D-модель для расчёта</h1>
          <p className="text-gray-600">
            Загрузите файл модели, и система автоматически проанализирует геометрию и рассчитает стоимость печати
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle>Загрузка модели</CardTitle>
              <CardDescription>
                Поддерживаемые форматы: STL, OBJ, 3MF, STEP, FBX, GLB, GLTF
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                  file
                    ? "border-primary bg-primary/5"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept=".stl,.obj,.3mf,.step,.fbx,.glb,.gltf"
                  onChange={handleFileChange}
                />
                {file ? (
                  <>
                    <File className="h-12 w-12 text-primary mx-auto mb-4" />
                    <div className="font-medium">{file.name}</div>
                    <div className="text-sm text-gray-500">
                      {(file.size / (1024 * 1024)).toFixed(2)} МБ
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mt-4"
                      onClick={(e) => {
                        e.stopPropagation()
                        setFile(null)
                        setAnalysis(null)
                      }}
                    >
                      Удалить
                    </Button>
                  </>
                ) : (
                  <>
                    <CloudUpload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <div className="font-medium">Перетащите файл сюда</div>
                    <div className="text-sm text-gray-500">
                      или нажмите для выбора файла
                    </div>
                  </>
                )}
              </div>

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Загрузка и анализ...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} />
                </div>
              )}

              <Button
                className="w-full gap-2"
                onClick={handleUpload}
                disabled={!file || isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Обработка...
                  </>
                ) : (
                  <>
                    <CloudUpload className="h-4 w-4" />
                    Загрузить и проанализировать
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Analysis Results */}
          <Card>
            <CardHeader>
              <CardTitle>Результаты анализа</CardTitle>
              <CardDescription>
                {analysis
                  ? "Модель проанализирована успешно"
                  : "Здесь отобразится результат анализа"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {analysis ? (
                <>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">Модель готова к печати</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="text-sm text-gray-500">Размеры</div>
                        <div className="font-medium">
                          {analysis.dimensions.width} × {analysis.dimensions.height} × {analysis.dimensions.depth} мм
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-gray-500">Объём</div>
                        <div className="font-medium">{analysis.volume} см³</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-gray-500">Время печати</div>
                        <div className="font-medium">{analysis.estimatedPrintTime} часов</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-gray-500">Материал</div>
                        <div className="font-medium">{analysis.estimatedMaterialUsage} см³</div>
                      </div>
                    </div>

                    {analysis.needsSupports && (
                      <div className="flex items-start gap-2 text-amber-600">
                        <AlertCircle className="h-5 w-5 mt-0.5" />
                        <div className="text-sm">
                          <div className="font-medium">Требуются поддержки</div>
                          <div>Объём поддержек: {analysis.supportVolume} см³</div>
                        </div>
                      </div>
                    )}

                    {analysis.issues.length > 0 && (
                      <div className="space-y-2">
                        <div className="font-medium text-sm">Потенциальные проблемы:</div>
                        <ul className="space-y-1 text-sm text-gray-600">
                          {analysis.issues.map((issue: any, index: number) => (
                            <li key={index} className="flex items-center gap-2">
                              <AlertCircle className="h-4 w-4 text-amber-500" />
                              {issue.message}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <Button className="w-full gap-2" onClick={handleContinue}>
                    Перейти к расчёту стоимости
                  </Button>
                </>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <File className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Загрузите модель для анализа</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tips */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Советы по подготовке модели</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Убедитесь, что модель водонепроницаема (без отверстий в оболочке)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Толщина стенок должна быть не менее 1-2 мм в зависимости от материала</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Удалите ненужные внутренние геометрии для экономии материала</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Проверьте, что все нормали направлены наружу</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}