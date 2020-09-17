// @ts-ignore
import ColorThief from 'colorthief'

function getDominantColor(imageElement: HTMLImageElement, colorSpec: string) {
  if (colorSpec === 'white') return [255, 255, 255] // 白
  if (colorSpec === 'black') return [0, 0, 0] // 黒

  const colorThief = new ColorThief()
  return colorThief.getColor(imageElement)
}

export async function createFilledBgImage(
  imageElement: HTMLImageElement,
  mimeType: string,
  aspectRatio: number[],
  colorSpec = 'black'
): Promise<any> {
  const canvasHeight = 1080
  const canvasWidth = (canvasHeight * aspectRatio[0]) / aspectRatio[1]

  // Canvasの準備
  const canvas = document.createElement('canvas')
  canvas.width = canvasWidth
  canvas.height = canvasHeight
  const context = <CanvasRenderingContext2D>canvas.getContext('2d')

  // background-colorのセット
  context.fillStyle = `rgb(${getDominantColor(imageElement, colorSpec)})`
  context.fillRect(0, 0, canvasWidth, canvasHeight)

  const image = new Image()
  image.src = imageElement.src

  await new Promise((resolve) => {
    image.onload = () => resolve(image)
  })

  const imageWidth = image.width
  const imageHeight = image.height

  // 小さい値を取得することで、フィッティングさせるスケールを得る
  const scale = Math.min(canvasWidth / imageWidth, canvasHeight / imageHeight)

  const dx = canvasWidth / 2 - (imageWidth / 2) * scale // 描画イメージを配置する場所のx座標
  const dy = canvasHeight / 2 - (imageHeight / 2) * scale // 描画イメージを配置する場所のy座標
  const dw = imageWidth * scale // 描画イメージの横幅
  const dh = imageHeight * scale // 描画イメージの縦幅

  context.drawImage(image, dx, dy, dw, dh)
  // canvas.toBlob((blob) => resolve(blob), mimeType, 1)
  return canvas.toDataURL(mimeType)
}
