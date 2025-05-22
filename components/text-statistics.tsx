"use client"

import { useMemo } from "react"
import { Progress } from "@/components/ui/progress"

interface TextStatisticsProps {
  text: string
  adaptedText: string
}

export default function TextStatistics({ text, adaptedText }: TextStatisticsProps) {
  const stats = useMemo(() => {
    if (!text.trim()) {
      return {
        characterCount: 0,
        wordCount: 0,
        sentenceCount: 0,
        paragraphCount: 0,
        averageWordLength: 0,
        averageSentenceLength: 0,
        readingTime: 0,
        complexWords: 0,
        complexWordsPercentage: 0,
        readabilityScore: 0,
        modifiedCount: 0,
        modifiedWords: [] as string[],
      }
    }

    const characterCount = text.length
    const wordCount = text.split(/\s+/).filter((word) => word.length > 0).length
    const sentenceCount = text.split(/[.!?]+/).filter((sentence) => sentence.trim().length > 0).length
    const paragraphCount = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length

    const averageWordLength =
      wordCount > 0
        ? text
            .split(/\s+/)
            .filter((word) => word.length > 0)
            .reduce((sum, word) => sum + word.length, 0) / wordCount
        : 0

    const averageSentenceLength = sentenceCount > 0 ? wordCount / sentenceCount : 0
    const readingTime = wordCount / 200

    const words = text.split(/\s+/).filter((word) => word.length > 0)
    const complexWords = words.filter((word) => word.length > 6).length
    const complexWordsPercentage = wordCount > 0 ? (complexWords / wordCount) * 100 : 0

    const readabilityScore = 100 - (0.39 * averageSentenceLength + 11.8 * (complexWords / wordCount))

    // Normaliza y limpia las palabras para comparar sin HTML ni puntuación
    const clean = (str: string) =>
      str
        .toLowerCase()
        .replace(/<[^>]+>/g, "")
        .replace(/[.,;!?¿¡()"]/g, "")
        .trim()

    const originalWords = text.split(/\s+/).map(clean)
    const adaptedWords = adaptedText ? adaptedText.split(/\s+/).map(clean) : []

    const modifiedWordsSet = new Set<string>()
    originalWords.forEach((word) => {
      if (word && !adaptedWords.includes(word)) {
        modifiedWordsSet.add(word)
      }
    })

    const modifiedCount = modifiedWordsSet.size
    const modifiedWords = Array.from(modifiedWordsSet)

    return {
      characterCount,
      wordCount,
      sentenceCount,
      paragraphCount,
      averageWordLength: Number.parseFloat(averageWordLength.toFixed(1)),
      averageSentenceLength: Number.parseFloat(averageSentenceLength.toFixed(1)),
      readingTime: Number.parseFloat(readingTime.toFixed(1)),
      complexWords,
      complexWordsPercentage: Number.parseFloat(complexWordsPercentage.toFixed(1)),
      readabilityScore: Math.max(0, Math.min(100, Number.parseFloat(readabilityScore.toFixed(1)))),
      modifiedCount,
      modifiedWords,
    }
  }, [text, adaptedText])

  const getReadabilityLevel = (score: number) => {
    if (score >= 80) return "Muy fácil"
    if (score >= 60) return "Fácil"
    if (score >= 40) return "Moderado"
    if (score >= 20) return "Difícil"
    return "Muy difícil"
  }

  const getReadabilityColor = (score: number) => {
    if (score >= 80) return "bg-green-500"
    if (score >= 60) return "bg-emerald-500"
    if (score >= 40) return "bg-yellow-500"
    if (score >= 20) return "bg-orange-500"
    return "bg-red-500"
  }

  if (!text.trim()) {
    return <div className="text-center py-8 text-muted-foreground">Introduce texto para ver estadísticas</div>
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-sm font-medium">Caracteres</p>
          <p className="text-2xl font-bold">{stats.characterCount}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">Palabras</p>
          <p className="text-2xl font-bold">{stats.wordCount}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">Oraciones</p>
          <p className="text-2xl font-bold">{stats.sentenceCount}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">Párrafos</p>
          <p className="text-2xl font-bold">{stats.paragraphCount}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <p className="text-sm font-medium">Longitud media de palabra</p>
            <p className="text-sm">{stats.averageWordLength} caracteres</p>
          </div>
          <Progress value={stats.averageWordLength * 20} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <p className="text-sm font-medium">Longitud media de oración</p>
            <p className="text-sm">{stats.averageSentenceLength} palabras</p>
          </div>
          <Progress value={Math.min(100, stats.averageSentenceLength * 5)} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <p className="text-sm font-medium">Palabras complejas</p>
            <p className="text-sm">{stats.complexWordsPercentage}%</p>
          </div>
          <Progress value={stats.complexWordsPercentage} className="h-2" />
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Tiempo estimado de lectura</p>
        <p className="text-2xl font-bold">
          {stats.readingTime < 1 ? `${Math.round(stats.readingTime * 60)} segundos` : `${stats.readingTime} minutos`}
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <p className="text-sm font-medium">Facilidad de lectura</p>
          <p className="text-sm">{getReadabilityLevel(stats.readabilityScore)}</p>
        </div>
        <Progress value={stats.readabilityScore} className={`h-3 ${getReadabilityColor(stats.readabilityScore)}`} />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Palabras modificadas</p>
        <p className="text-sm">
          {stats.modifiedCount} palabra{stats.modifiedCount !== 1 ? "s" : ""} modificada{stats.modifiedCount !== 1 ? "s" : ""}: {stats.modifiedWords.join(", ")}
        </p>
      </div>
    </div>
  )
}
