import Hypher from "hypher"
import spanish from "hyphenation.es"
import { diccionarioSimplificacion, obtenerDiccionarioPalabrasDificiles } from "./diccionarios"

// Instancia de Hypher para silabear
const hypher = new Hypher(spanish)

function normalizarPalabra(palabra: string): string {
  return palabra
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
}

function obtenerAlternativaSencilla(palabra: string): string | null {
  const normalizada = normalizarPalabra(palabra)
  return diccionarioSimplificacion[normalizada] || null
}

export function procesarTextoParaDislexia(
  texto: string,
  opciones: {
    resaltarSilabas?: boolean
    resaltarPalabrasDificiles?: boolean
    sustituirPalabrasDificiles?: boolean
    resaltarIdeasPrincipales?: boolean
  } = {}
): string {
  if (!texto) return ""

  const parrafos = texto.split(/\n\s*\n/)
  const parrafosProcesados = parrafos.map((parrafo) => {
    const oraciones = parrafo.split(/([.!?]+)/)
    const oracionesProcesadas: string[] = []

    for (let i = 0; i < oraciones.length; i += 2) {
      let oracion = oraciones[i]
      const puntuacion = i + 1 < oraciones.length ? oraciones[i + 1] : ""

      if (!oracion.trim()) {
        if (puntuacion) oracionesProcesadas.push(puntuacion)
        continue
      }

      let oracionProcesada = procesarPalabrasEnOracion(
        oracion,
        opciones.resaltarPalabrasDificiles,
        opciones.sustituirPalabrasDificiles,
        opciones.resaltarSilabas
      )

      if (
        opciones.resaltarIdeasPrincipales &&
        (i === 0 || contieneIndicadorDeIdeaPrincipal(oracion))
      ) {
        oracionProcesada = `<span class="idea-principal">${oracionProcesada}</span>`
      }

      oracionesProcesadas.push(oracionProcesada + puntuacion)
    }

    return oracionesProcesadas.join("")
  })

  return parrafosProcesados.join("\n\n")
}

function procesarPalabrasEnOracion(
  oracion: string,
  resaltarDificiles = false,
  sustituirDificiles = false,
  dividirSilabas = false
): string {
  return oracion.replace(/\b(\w+)\b/g, (palabra) => {
    const esDificil =
      esPalabraDificilPorDiccionario(palabra) || esPalabraDificilPorEstructura(palabra)

    if (esDificil) {
      if (sustituirDificiles) {
        const alternativa = obtenerAlternativaSencilla(palabra)
        if (alternativa) {
          return `<span class="palabra-sustituida" title="${palabra}">${alternativa}</span>`
        }
      }
      if (resaltarDificiles) {
        return `<span class="palabra-dificil" title="${obtenerAlternativaSencilla(palabra) || ""}">${palabra}</span>`
      }
    }

    if (dividirSilabas) {
      const silabas = dividirEnSilabas(palabra)
      return silabas
        .map((silaba, i) =>
          i % 2 === 0
            ? `<span class="silaba-par">${silaba}</span>`
            : `<span class="silaba-impar">${silaba}</span>`
        )
        .join("")
    }

    return palabra
  })
}

function contieneIndicadorDeIdeaPrincipal(oracion: string): boolean {
  const indicadores = [
    "importante",
    "destacar",
    "principal",
    "fundamental",
    "esencial",
    "clave",
    "relevante",
    "significativo",
    "crucial",
    "vital",
    "en resumen",
    "en conclusión",
    "por lo tanto",
    "en síntesis",
    "finalmente",
    "en definitiva",
    "por consiguiente"
  ]
  const texto = oracion.toLowerCase()
  return indicadores.some((ind) => texto.includes(ind))
}

function esPalabraDificilPorDiccionario(palabra: string): boolean {
  const dic = obtenerDiccionarioPalabrasDificiles()
  return !!dic[palabra.toLowerCase()]
}

function esPalabraDificilPorEstructura(palabra: string): boolean {
  return (
    palabra.length > 8 ||
    (palabra.length > 6 && contieneDiptongo(palabra)) ||
    contieneGrupoConsonanticoComplejo(palabra)
  )
}

function contieneDiptongo(palabra: string): boolean {
  const diptongos = ["ai", "au", "ei", "eu", "io", "iu", "oi", "ou", "ui", "ue", "ua"]
  const texto = palabra.toLowerCase()
  return diptongos.some((dip) => texto.includes(dip))
}

function contieneGrupoConsonanticoComplejo(palabra: string): boolean {
  const grupos = ["bstr", "nstr", "mpl", "mpr", "nscr", "pstr", "rstr", "scr", "spr", "squ", "str", "xpl", "xpr", "xtr"]
  const texto = palabra.toLowerCase()
  return grupos.some((g) => texto.includes(g))
}

function dividirEnSilabas(palabra: string): string[] {
  return hypher.hyphenate(palabra)
}
