# Plan de Acción: Creación de un Sitio Web Automatizado con Astro y GitHub Pages

**Autor:** Gemini (Tu Tutor de FCE)
**Fecha:** 25 de Agosto de 2025
**Objetivo:** Crear una interfaz web moderna, atractiva y de bajo mantenimiento para visualizar los materiales de estudio del curso. El sitio se actualizará automáticamente cuando se añadan nuevos archivos a las carpetas de `sesiones`.

---

## Tecnologías a Utilizar

- **Node.js y NPM:** Entorno de ejecución y gestor de paquetes para JavaScript.
- **Astro:** Generador de Sitios Estáticos (SSG) para construir el sitio web.
- **GitHub Pages:** Servicio de hosting gratuito para sitios estáticos directamente desde un repositorio de GitHub.
- **GitHub Actions:** Herramienta de automatización para construir y desplegar el sitio automáticamente.

---

## Fases del Proyecto

El proyecto se divide en tres fases principales:

1.  **Fase 1: Preparación y Configuración del Entorno.**
2.  **Fase 2: Desarrollo del Sitio Web con Astro.**
3.  **Fase 3: Despliegue Automatizado con GitHub Pages.**

---

## Paso a Paso Detallado

### Fase 1: Preparación y Configuración

**1.1. Requisito Previo: Instalar Node.js**
- Asegúrate de tener Node.js (versión 18 o superior) instalado. Puedes descargarlo desde [nodejs.org](https://nodejs.org/).
- Para verificar tu versión, abre una terminal y ejecuta: `node -v`

**1.2. Crear el Directorio para el Sitio Web**
- Dentro de tu proyecto `igep`, crearemos una carpeta `web` que contendrá todo el código de nuestro sitio.
- **Comando:** `mkdir web`

**1.3. Inicializar el Proyecto Astro**
- Navega al nuevo directorio y usa `npm` (el gestor de paquetes de Node.js) para crear un nuevo proyecto de Astro.
- **Comandos:**
  ```bash
  cd web
  npm create astro@latest .
  ```
- Durante la instalación, Astro te hará algunas preguntas. Responde de la siguiente manera:
  - `Where would you like to create your new project?`: Presiona `Enter` (para usar el directorio actual `.`).
  - `Which app template would you like to use?`: Selecciona `Empty`.
  - `Would you like to install dependencies?`: Escribe `y` y presiona `Enter`.
  - `Would you like to initialize a new git repository?`: Escribe `n` y presiona `Enter` (porque ya estamos dentro de un repositorio git).

### Fase 2: Desarrollo del Sitio Web con Astro

**2.1. Organizar el Contenido Público (¡Paso Crítico!)**
- **Concepto Clave:** Para que Astro pueda "ver" y copiar los archivos de tus sesiones (PDFs, audios, etc.) al sitio web final, estos deben residir dentro de la carpeta `web/public`.
- **Acción:** Mueve o copia tu directorio `sesiones` (o cualquier otra carpeta con materiales) dentro de `web/public`. La estructura final debería ser `web/public/sesiones`.

**2.2. Limpiar el Proyecto Inicial**
- Astro crea un archivo de ejemplo. Bórralo para empezar desde cero.
- **Comando:** `rm web/src/pages/index.astro`

**2.2. Crear la Lógica de Lectura de Sesiones**
- Crearemos una nueva página principal que leerá dinámicamente tus directorios.
- **Acción:** Crea el archivo `src/pages/index.astro` y pega el siguiente código. Este código importa un componente que crearemos en el siguiente paso y busca todas las carpetas de resúmenes.

  ```astro
  ---
  import Layout from '../layouts/Layout.astro';
  import SessionCard from '../components/SessionCard.astro';

  // Buscamos todos los archivos de resumen DENTRO de la carpeta 'public'
  // Astro los servirá automáticamente en la raíz del sitio.
  const allSummaries = await Astro.glob('../../public/sesiones/sesion*/**/resumenes/*');

  // Agrupamos los resúmenes por sesión
  const sessions = allSummaries.reduce((acc, summary) => {
    // Extrae 'sesion1', 'sesion2', etc.
    const sessionPath = summary.file.split('/').find(part => part.startsWith('sesion'));
    if (!sessionPath) return acc;
    
    const sessionNumber = sessionPath.replace('sesion', '');
    
    if (!acc[sessionNumber]) {
      acc[sessionNumber] = {
        number: sessionNumber,
        files: []
      };
    }

    // Construimos la URL. Astro.glob nos da la ruta del sistema de archivos.
    // Necesitamos una ruta relativa a la carpeta 'public'.
    // Ejemplo: de '/path/to/project/web/public/sesiones/s1/resumen.pdf'
    // a '/sesiones/s1/resumen.pdf'
    const urlPath = '/' + summary.file.split('/public/')[1];
    const fileName = summary.file.split('/').pop();

    acc[sessionNumber].files.push({
      path: urlPath,
      name: fileName
    });
    return acc;
  }, {});

  const sessionList = Object.values(sessions).sort((a, b) => a.number - b.number);
  ---

  <Layout title="IGEP - Material de Estudio">
    <main>
      <h1>Material de Estudio de IGEP</h1>
      <p>Recopilación de resúmenes, audios y videos de cada sesión.</p>
      <div class="card-grid">
        {sessionList.map(session => (
          <SessionCard 
            sessionNumber={session.number}
            files={session.files}
          />
        ))}
      </div>
    </main>
  </Layout>
  ```

**2.3. Crear el Componente de Tarjeta de Sesión (`SessionCard`)**
- Este componente será la "caja" visual para cada sesión.
- **Acción:** Crea la carpeta `src/components` y dentro de ella, el archivo `SessionCard.astro` con el siguiente contenido:

  ```astro
  ---
  const { sessionNumber, files } = Astro.props;

  function getFileType(fileName) {
    if (fileName.endsWith('.pdf')) return '📄 PDF';
    if (fileName.endsWith('.mp3')) return '🎵 Audio';
    if (fileName.endsWith('.mp4')) return '🎬 Video';
    return '🔗 Archivo';
  }
  ---
  <div class="card">
    <h2>Sesión {sessionNumber}</h2>
    <ul>
      {files.map(file => (
        <li>
          <a href={file.path} target="_blank" rel="noopener noreferrer">
            {getFileType(file.name)} - {file.name.split('_').join(' ').replace('.pdf','').replace('.mp3','').replace('.mp4','')}
          </a>
        </li>
      ))}
    </ul>
  </div>
  ```

**2.4. Crear un Layout Básico y Añadir Estilos**
- El `Layout` es una plantilla general para nuestras páginas.
- **Acción 1:** Crea la carpeta `src/layouts` y dentro el archivo `Layout.astro` con:
  ```astro
  ---
  interface Props {
    title: string;
  }
  const { title } = Astro.props;
  ---
  <!doctype html>
  <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <meta name="description" content="Material de estudio de IGEP" />
      <meta name="viewport" content="width=device-width" />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <title>{title}</title>
      <link rel="stylesheet" href="/styles/global.css">
    </head>
    <body>
      <slot />
    </body>
  </html>
  ```
- **Acción 2:** Crea la carpeta `public/styles` y dentro el archivo `global.css` para los estilos.
  ```css
  /* Estilos Generales */
  body { font-family: sans-serif; background-color: #f4f4f9; color: #333; margin: 0; padding: 2rem; }
  main { max-width: 1200px; margin: auto; }
  h1 { color: #2c3e50; }
  
  /* Grid de Tarjetas */
  .card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
  
  /* Estilos de Tarjeta */
  .card { background: white; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); padding: 1.5rem; transition: transform 0.2s; }
  .card:hover { transform: translateY(-5px); }
  .card h2 { margin-top: 0; border-bottom: 2px solid #e0e0e0; padding-bottom: 0.5rem; }
  .card ul { list-style: none; padding: 0; }
  .card ul li a { text-decoration: none; color: #3498db; display: block; padding: 0.5rem 0; border-radius: 4px; }
  .card ul li a:hover { background-color: #ecf0f1; }
  ```
- **Acción 3:** Crea la carpeta `public` y dentro de ella `favicon.svg` (puedes copiar uno genérico o crearlo).

### Fase 3: Despliegue Automatizado con GitHub Pages

**3.1. Configurar Astro para el Despliegue**
- Debemos decirle a Astro cuál será la URL final del sitio.
- **Acción:** Edita el archivo `astro.config.mjs` y modifícalo para que se vea así, **reemplazando los valores de ejemplo** con tu usuario y nombre de repositorio de GitHub.

  ```javascript
  import { defineConfig } from 'astro/config';

  // Reemplaza con tu usuario y nombre de repo
  const GITHUB_USER = 'alexballera'; 
  const REPO_NAME = 'igep';

  export default defineConfig({
    site: `https://${GITHUB_USER}.github.io`,
    base: `/${REPO_NAME}/`,
  });
  ```

**3.2. Crear el Workflow de GitHub Actions (Método Moderno)**
- Esto automatizará el despliegue usando el método recomendado por Astro y GitHub.
- **Acción:** Crea (o reemplaza) el archivo `.github/workflows/deploy.yml` con el siguiente contenido:

  ```yaml
  name: Deploy to GitHub Pages

  on:
    push:
      branches:
        - main

  # Permisos para que la Action pueda crear un despliegue en Pages
  permissions:
    contents: read
    pages: write
    id-token: write

  jobs:
    build:
      runs-on: ubuntu-latest
      steps:
        - name: Checkout your repository using git
          uses: actions/checkout@v4
        - name: Install, build, and upload your site
          uses: withastro/action@v2
          with:
            path: ./web # Ruta a tu proyecto Astro

    deploy:
      needs: build
      runs-on: ubuntu-latest
      environment:
        name: github-pages
        url: ${{ steps.deployment.outputs.page_url }}
      steps:
        - name: Deploy to GitHub Pages
          id: deployment
          uses: actions/deploy-pages@v4
  ```

**3.3. Activar GitHub Pages en el Repositorio**
- El último paso es decirle a GitHub que use las Actions para desplegar.
- **Acción:**
  1. Ve a tu repositorio en GitHub.
  2. Haz clic en `Settings` (Configuración).
  3. En el menú de la izquierda, ve a `Pages`.
  4. En la sección `Build and deployment`, bajo `Source`, selecciona **`GitHub Actions`**.
  5. GitHub detectará automáticamente el workflow que hemos creado.

---

Una vez completados estos pasos, cada vez que hagas un `git push` a tu rama principal, la Action se ejecutará, construirá el sitio con los últimos materiales que hayas añadido y lo publicará.
