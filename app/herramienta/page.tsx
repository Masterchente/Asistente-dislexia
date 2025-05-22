"use client"

import type React from "react"

import { useState, useRef, type ChangeEvent } from "react"
import Link from "next/link"
import { BookOpen, FileUp, BarChart2, Edit2, Download, Settings2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import TextStatistics from "@/components/text-statistics"
import { procesarTextoParaDislexia } from "@/lib/text-processor"
import { generarPDF } from "@/lib/pdf-generator"

export default function Herramienta() {
  const [inputText, setInputText] = useState("")
  const [processedText, setProcessedText] = useState("")
  const [editedText, setEditedText] = useState("")
  const [activeTab, setActiveTab] = useState("input")
  const [fontFamily, setFontFamily] = useState("Lexend")
  const [fontSize, setFontSize] = useState(16)
  const [letterSpacing, setLetterSpacing] = useState(0.1)
  const [wordSpacing, setWordSpacing] = useState(0.2)
  const [lineHeight, setLineHeight] = useState(1.5)
  const [textColor, setTextColor] = useState("#000000")
  const [backgroundColor, setBackgroundColor] = useState("#ffffff")
  const [highlightSyllables, setHighlightSyllables] = useState(false)
  const [highlightDifficultWords, setHighlightDifficultWords] = useState(false)
  const [replaceDifficultWords, setReplaceDifficultWords] = useState(false)
  const [highlightMainIdeas, setHighlightMainIdeas] = useState(false)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleTextInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value)
  }

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      setInputText(text)
    }
    reader.readAsText(file)
  }

  const handleProcessText = () => {
    if (!inputText.trim()) return

    const processed = procesarTextoParaDislexia(inputText, {
      resaltarSilabas: highlightSyllables,
      resaltarPalabrasDificiles: highlightDifficultWords,
      sustituirPalabrasDificiles: replaceDifficultWords,
      resaltarIdeasPrincipales: highlightMainIdeas,
    })
    setProcessedText(processed)
    setEditedText(processed)
    setActiveTab("output")
  }

  const handleEditedTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedText(e.target.value)
  }

  const handleDownloadPDF = async () => {
    if (!editedText.trim()) return

    setIsGeneratingPDF(true)
    try {
      await generarPDF(editedText, {
        fontFamily,
        fontSize,
        letterSpacing,
        wordSpacing,
        lineHeight,
        textColor,
        backgroundColor,
      })
    } catch (error) {
      console.error("Error al generar PDF:", error)
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const textStyle = {
    fontFamily:
      fontFamily === "Lexend"
        ? "'Lexend', sans-serif"
        : fontFamily === "Arial"
          ? "Arial, sans-serif"
          : fontFamily === "ComicSans"
            ? "'Comic Sans MS', cursive"
            : "'Verdana', sans-serif",
    fontSize: `${fontSize}px`,
    letterSpacing: `${letterSpacing}em`,
    wordSpacing: `${wordSpacing}em`,
    lineHeight: lineHeight,
    color: textColor,
    backgroundColor: backgroundColor,
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
            <BookOpen className="h-6 w-6" />
            <span>DisLectura</span>
          </Link>
          <nav className="flex gap-4 sm:gap-6">
            <Link href="/" className="text-sm font-medium underline-offset-4 hover:underline">
              Inicio
            </Link>
            <Link href="/herramienta" className="text-sm font-medium underline-offset-4 hover:underline">
              Herramienta
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 container py-6 px-4 md:px-6">
        <h1 className="text-2xl font-bold mb-6">Herramienta de Asistencia para Lectura</h1>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="input">Texto Original</TabsTrigger>
                <TabsTrigger value="output">Texto Adaptado</TabsTrigger>
                <TabsTrigger value="stats">Estadísticas</TabsTrigger>
              </TabsList>

              <TabsContent value="input" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Introduce tu texto</CardTitle>
                    <CardDescription>Escribe o sube un archivo de texto para adaptarlo</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      placeholder="Escribe o pega tu texto aquí..."
                      className="min-h-[300px]"
                      value={inputText}
                      onChange={handleTextInput}
                    />
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="flex gap-2">
                        <FileUp className="h-4 w-4" />
                        Subir archivo
                      </Button>
                      <input
                        type="file"
                        accept=".txt"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <Button onClick={handleProcessText} disabled={!inputText.trim()}>
                        Procesar Texto
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="output" className="space-y-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Edit2 className="h-5 w-5" />
                        Texto Adaptado
                      </CardTitle>
                      <CardDescription>Puedes editar el texto resultante según tus necesidades</CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      onClick={handleDownloadPDF}
                      disabled={!editedText.trim() || isGeneratingPDF}
                      className="flex gap-2"
                    >
                      <Download className="h-4 w-4" />
                      {isGeneratingPDF ? "Generando..." : "Descargar PDF"}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div
                      className="min-h-[300px] p-4 border rounded-md overflow-auto"
                      style={textStyle}
                      dangerouslySetInnerHTML={{ __html: editedText }}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="stats" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart2 className="h-5 w-5" />
                      Estadísticas del Texto
                    </CardTitle>
                    <CardDescription>Análisis de complejidad y legibilidad</CardDescription>
                  </CardHeader>
                  <CardContent>
                  <TextStatistics
  text={inputText}
  adaptedText={processedText}
/>

                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings2 className="h-5 w-5" />
                  Configuración
                </CardTitle>
                <CardDescription>Personaliza la presentación del texto</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Tipo de Letra</Label>
                  <RadioGroup value={fontFamily} onValueChange={setFontFamily} className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Lexend" id="Lexend" />
                      <Label htmlFor="Lexend">Lexend (Dislexia)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Arial" id="Arial" />
                      <Label htmlFor="Arial">Arial</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ComicSans" id="ComicSans" />
                      <Label htmlFor="ComicSans">Comic Sans</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Verdana" id="Verdana" />
                      <Label htmlFor="Verdana">Verdana</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Tamaño de Letra</Label>
                    <span className="text-sm text-muted-foreground">{fontSize}px</span>
                  </div>
                  <Slider
                    value={[fontSize]}
                    min={12}
                    max={24}
                    step={1}
                    onValueChange={(value) => setFontSize(value[0])}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Espaciado entre Letras</Label>
                    <span className="text-sm text-muted-foreground">{letterSpacing.toFixed(1)}</span>
                  </div>
                  <Slider
                    value={[letterSpacing]}
                    min={0}
                    max={0.5}
                    step={0.1}
                    onValueChange={(value) => setLetterSpacing(value[0])}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Espaciado entre Palabras</Label>
                    <span className="text-sm text-muted-foreground">{wordSpacing.toFixed(1)}</span>
                  </div>
                  <Slider
                    value={[wordSpacing]}
                    min={0}
                    max={1}
                    step={0.1}
                    onValueChange={(value) => setWordSpacing(value[0])}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Altura de Línea</Label>
                    <span className="text-sm text-muted-foreground">{lineHeight.toFixed(1)}</span>
                  </div>
                  <Slider
                    value={[lineHeight]}
                    min={1}
                    max={3}
                    step={0.1}
                    onValueChange={(value) => setLineHeight(value[0])}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Color de Texto</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer"
                      />
                      <span className="text-sm">{textColor}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Color de Fondo</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer"
                      />
                      <span className="text-sm">{backgroundColor}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Opciones de Procesamiento</CardTitle>
                <CardDescription>Personaliza cómo se procesa el texto</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="highlight-syllables"
                    checked={highlightSyllables}
                    onCheckedChange={setHighlightSyllables}
                  />
                  <Label htmlFor="highlight-syllables">Dividir palabras difíciles en sílabas</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="highlight-difficult-words"
                    checked={highlightDifficultWords}
                    onCheckedChange={(checked) => {
                      setHighlightDifficultWords(checked)
                      if (checked && replaceDifficultWords) {
                        setReplaceDifficultWords(false)
                      }
                    }}
                  />
                  <Label htmlFor="highlight-difficult-words">Resaltar palabras difíciles</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="replace-difficult-words"
                    checked={replaceDifficultWords}
                    onCheckedChange={(checked) => {
                      setReplaceDifficultWords(checked)
                      if (checked && highlightDifficultWords) {
                        setHighlightDifficultWords(false)
                      }
                    }}
                  />
                  <Label htmlFor="replace-difficult-words">Sustituir palabras difíciles</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="highlight-main-ideas"
                    checked={highlightMainIdeas}
                    onCheckedChange={setHighlightMainIdeas}
                  />
                  <Label htmlFor="highlight-main-ideas">Resaltar ideas principales</Label>
                </div>

                <Button onClick={handleProcessText} className="w-full" disabled={!inputText.trim()}>
                  Aplicar Cambios
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <footer className="border-t">
        <div className="container flex flex-col gap-2 py-4 md:h-16 md:flex-row md:items-center md:py-0">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} DisLectura. Todos los derechos reservados.
          </p>
        </div>
      </footer>

      <style jsx global>{`
        .palabra-dificil {
          background-color: #ffecb3;
          border-bottom: 1px dashed #ff9800;
          cursor: help;
        }
        
        .palabra-sustituida {
          background-color: #e3f2fd;
          border-bottom: 1px solid #2196f3;
          cursor: help;
        }
        
        .silaba-par {
          color: ${textColor};
        }
        
        .silaba-impar {
          color: #666666;
        }
        
        .idea-principal {
          font-weight: bold;
          color: #d32f2f;
        }
      `}</style>
    </div>
  )
}
