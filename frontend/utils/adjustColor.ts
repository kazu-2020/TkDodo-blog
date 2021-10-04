import chroma from 'chroma-js'

export const PALETTE_BASE_COLORS: Array<String> = [
  '#faf100',
  '#f6aa00',
  '#ff2800',
  '#990099',
  '#005aff',
  '#03af7a',
  '#ff8082',
  '#4dc4ff',
  '#804000',
  '#84919e',
]

function adjustColor(
  baseColor: string,
  bgColor: string,
  contrastRatio: number
) {
  let adjustedColor: string
  const baseCL = chroma(baseColor).luminance()
  const bgCL = chroma(bgColor).luminance()

  // 背景色が明度（輝度）0.5以上の場合（Light Modeの場合）
  if (chroma(bgColor).get('hsl.l') > 0.5) {
    // コントラスト比の計算から調整すべき色のLuminanceを求める
    const adjustedCL = (bgCL + 0.05) / contrastRatio - 0.05

    // 調整すべき色のLuminanceよりもベース色のLuminanceが明るい場合（背景色に比べ色が明るすぎる場合）
    if (baseCL > adjustedCL) {
      adjustedColor = chroma(baseColor).luminance(adjustedCL).hex()
    } else {
      adjustedColor = chroma(baseColor).hex()
    }

    // 背景色が明度（輝度）0.5以下の場合（Dark Modeの場合）
  } else {
    // コントラスト比の計算から調整すべき色のLuminanceを求める
    const adjustedCL = contrastRatio * (bgCL + 0.05) - 0.05

    // 調整すべき色のLuminanceよりもベース色のLuminanceが暗い場合（背景色に比べ色が暗すぎる場合）
    if (baseCL < adjustedCL) {
      adjustedColor = chroma(baseColor).luminance(adjustedCL).hex()
    } else {
      adjustedColor = chroma(baseColor).hex()
    }
  }

  return adjustedColor
}

export function adjustPrimaryDarkColor(baseColor: string): string {
  return adjustColor(baseColor, '#1f1f20', 3)
}
export function adjustPrimaryLightColor(baseColor: string): string {
  return adjustColor(baseColor, '#FAFAFA', 3)
}
export function adjustLinkLightColor(baseColor: string): string {
  return adjustColor(baseColor, '#FAFAFA', 4.5)
}
export function adjustLinkDarkColor(baseColor: string): string {
  return adjustColor(baseColor, '#1f1f20', 4.5)
}
