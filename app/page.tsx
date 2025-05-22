import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, FileText, Info, Users } from "lucide-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
            <BookOpen className="h-6 w-6" />
            <span>DisLectura</span>
          </Link>
         <nav className="flex gap-4 sm:gap-6 items-center">
  <Link href="/" className="text-sm font-medium underline-offset-4 hover:underline">
    Inicio
  </Link>
  <Link href="/herramienta" className="text-sm font-medium underline-offset-4 hover:underline">
    Herramienta
  </Link>
  <ThemeToggle />Modo Oscuro
</nav> 
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Asistente de Lectura para Personas con Dislexia
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                      Facilitamos la lectura adaptando textos a las necesidades específicas de personas con dislexia.
                </p>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                    Proyecto de Tecnología de Lenguaje Natural por Jimenez Hernandez Vicente David
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/herramienta">
                  <Button>Usar Herramienta</Button>
                </Link>
                <Link href="#info">
                  <Button variant="outline">Más Información</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="info" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-4">
                <div className="inline-flex items-center justify-center rounded-md bg-muted p-2">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Quiénes Somos</h3>
                <p className="text-muted-foreground">
                  Soy un estudiante de el Instituto Politécnico Nacional, en la carrera de Ingeniería en Inteligencia Aritificial.
                  Somos un equipo comprometido con la accesibilidad y la inclusión. Mi objetivo es crear
                  herramientas que faciliten la lectura y el aprendizaje para personas con dislexia.
                </p>
              </div>
              <div className="space-y-4">
                <div className="inline-flex items-center justify-center rounded-md bg-muted p-2">
                  <Info className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Qué es la Dislexia</h3>
                <p className="text-muted-foreground">
                  La dislexia es un trastorno de aprendizaje que afecta la capacidad de leer, escribir y procesar
                  información. Afecta aproximadamente al 10% de la población mundial y no está relacionada con la
                  inteligencia.
                </p>
                <ul className="list-disc pl-5 text-muted-foreground">
                  <li>Dificultad para reconocer palabras</li>
                  <li>Problemas con la decodificación de letras</li>
                  <li>Dificultad para mantener la concentración al leer</li>
                  <li>Confusión con ciertas letras o símbolos</li>
                </ul>
              </div>
              <div className="space-y-4">
                <div className="inline-flex items-center justify-center rounded-md bg-muted p-2">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Qué Esperamos Lograr</h3>
                <p className="text-muted-foreground">Nuestra misión es crear una herramienta que:</p>
                <ul className="list-disc pl-5 text-muted-foreground">
                  <li>Adapte textos para hacerlos más accesibles</li>
                  <li>Permita personalizar la presentación del texto</li>
                  <li>Ofrezca estadísticas útiles sobre la complejidad del texto</li>
                  <li>Ayude a mejorar la experiencia de lectura</li>
                  <li>Sea gratuita y accesible para todos</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Comienza a Usar Nuestra Herramienta</h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Sube un archivo de texto o escribe directamente para obtener una versión adaptada para dislexia.
                </p>
              </div>
              <Link href="/herramienta">
                <Button size="lg" className="mt-4">
                  Ir a la Herramienta
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t">
        <div className="container flex flex-col gap-2 py-4 md:h-16 md:flex-row md:items-center md:py-0">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} DisLectura. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
