import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"

interface PDFOptions {
  fontFamily: string
  fontSize: number
  letterSpacing: number
  wordSpacing: number
  lineHeight: number
  textColor: string
  backgroundColor: string
}

export async function generarPDF(contenido: string, opciones: PDFOptions): Promise<void> {
  // Crear un elemento temporal para renderizar el contenido HTML
  const tempDiv = document.createElement("div")
  tempDiv.innerHTML = contenido
  tempDiv.style.fontFamily =
    opciones.fontFamily === "Lexend"
      ? "'Lexend', sans-serif"
      : opciones.fontFamily === "Arial"
        ? "Arial, sans-serif"
        : opciones.fontFamily === "ComicSans"
          ? "'Comic Sans MS', cursive"
          : "'Verdana', sans-serif"
  tempDiv.style.fontSize = `${opciones.fontSize}px`
  tempDiv.style.letterSpacing = `${opciones.letterSpacing}em`
  tempDiv.style.wordSpacing = `${opciones.wordSpacing}em`
  tempDiv.style.lineHeight = `${opciones.lineHeight}`
  tempDiv.style.color = opciones.textColor
  tempDiv.style.backgroundColor = opciones.backgroundColor
  tempDiv.style.padding = "20px"
  tempDiv.style.width = "800px" // Ancho fijo para el PDF
  tempDiv.style.position = "absolute"
  tempDiv.style.left = "-9999px"

  // Aplicar estilos para palabras difíciles, sílabas e ideas principales
  const style = document.createElement("style")
  style.textContent = `
    .palabra-dificil {
      background-color: #ffecb3;
      border-bottom: 1px dashed #ff9800;
    }
    
    .palabra-sustituida {
      background-color: #e3f2fd;
      border-bottom: 1px solid #2196f3;
    }
    
    .silaba-par {
      color: ${opciones.textColor};
    }
    
    .silaba-impar {
      color: #666666;
    }
    
    .idea-principal {
      font-weight: bold;
      color: #d32f2f;
    }
  `

  document.head.appendChild(style)
  document.body.appendChild(tempDiv)

  try {
    // Convertir el HTML a canvas
    const canvas = await html2canvas(tempDiv, {
      scale: 2, // Mayor calidad
      useCORS: true,
      logging: false,
      backgroundColor: opciones.backgroundColor,
    })

    // Crear PDF
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })

    // Calcular dimensiones para ajustar al PDF
    const imgWidth = 210 // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    // Dividir en páginas si es necesario
    let heightLeft = imgHeight
    let position = 0
    const pageHeight = 295 // A4 height in mm

    // Primera página
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    // Páginas adicionales si el contenido es largo
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    // Descargar PDF
    pdf.save("texto-adaptado.pdf")
  } finally {
    // Limpiar
    document.body.removeChild(tempDiv)
    document.head.removeChild(style)
  }
}
