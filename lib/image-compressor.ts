/**
 * Comprime una imagen en el lado del cliente y la convierte al formato WebP.
 * @param file Archivo de imagen de entrada.
 * @param maxWidth Ancho máximo permitido (por defecto 1200px).
 * @param quality Calidad de compresión (0.0 a 1.0, por defecto 0.82).
 */
export async function compressImage(
  file: File,
  maxWidth = 1200,
  quality = 0.82
): Promise<File> {
  if (!file.type.startsWith('image/')) {
    return file
  }

  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target?.result as string

      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        // Redimensionamiento proporcional
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width)
          width = maxWidth
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          resolve(file)
          return
        }

        ctx.drawImage(img, 0, 0, width, height)

        // Convertir a WebP comprimido
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file)
              return
            }

            const cleanName = file.name.replace(/\.[^/.]+$/, '') + '.webp'
            const compressedFile = new File([blob], cleanName, {
              type: 'image/webp',
              lastModified: Date.now(),
            })

            resolve(compressedFile)
          },
          'image/webp',
          quality
        )
      }

      img.onerror = () => resolve(file)
    }

    reader.onerror = () => resolve(file)
  })
}
