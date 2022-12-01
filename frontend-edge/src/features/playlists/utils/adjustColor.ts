import chroma from 'chroma-js'

export const PALETTE_BASE_COLORS: Array<string> = [
  '#faf100',
  '#f6aa00',
  '#ff2800',
  '#990099',
  '#005aff',
  '#03af7a',
  '#ff8082',
  '#4dc4ff',
  '#804000',
  '#84919e'
]

// eslint-disable-next-line max-statements
const adjustColor = (
  baseColor: string,
  bgColor: string,
  contrastRatio: number
) => {
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

export const adjustPrimaryDarkColor = (baseColor: string): string =>
  adjustColor(baseColor, '#1f1f20', 3)
export const adjustPrimaryLightColor = (baseColor: string): string =>
  adjustColor(baseColor, '#FAFAFA', 3)
export const adjustLinkLightColor = (baseColor: string): string =>
  adjustColor(baseColor, '#FAFAFA', 4.5)
export const adjustLinkDarkColor = (baseColor: string): string =>
  adjustColor(baseColor, '#1f1f20', 4.5)

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest
  describe('adjustColor', () => {
    it('ライトモードの場合', () => {
      expect(adjustColor('#faf100', '#ffffff', 3)).toEqual('#9e9900')
      expect(adjustColor('#f6aa00', '#ffffff', 3)).toEqual('#c68900')
      expect(adjustColor('#ff2800', '#ffffff', 3)).toEqual('#ff2800')
      expect(adjustColor('#990099', '#ffffff', 3)).toEqual('#990099')
      expect(adjustColor('#005aff', '#ffffff', 3)).toEqual('#005aff')
      expect(adjustColor('#03af7a', '#ffffff', 3)).toEqual('#03aa76')
      expect(adjustColor('#ff8082', '#ffffff', 3)).toEqual('#e47374')
      expect(adjustColor('#4dc4ff', '#ffffff', 3)).toEqual('#3e9ece')
      expect(adjustColor('#804000', '#ffffff', 3)).toEqual('#804000')
      expect(adjustColor('#84919e', '#ffffff', 3)).toEqual('#84919e')
    })

    it('ダークモードの場合', () => {
      expect(adjustColor('#faf100', '#000000', 3)).toEqual('#faf100')
      expect(adjustColor('#f6aa00', '#000000', 3)).toEqual('#f6aa00')
      expect(adjustColor('#ff2800', '#000000', 3)).toEqual('#ff2800')
      expect(adjustColor('#990099', '#000000', 3)).toEqual('#9e0c9e')
      expect(adjustColor('#005aff', '#000000', 3)).toEqual('#005aff')
      expect(adjustColor('#03af7a', '#000000', 3)).toEqual('#03af7a')
      expect(adjustColor('#ff8082', '#000000', 3)).toEqual('#ff8082')
      expect(adjustColor('#4dc4ff', '#000000', 3)).toEqual('#4dc4ff')
      expect(adjustColor('#804000', '#000000', 3)).toEqual('#864a0d')
      expect(adjustColor('#84919e', '#000000', 3)).toEqual('#84919e')
    })
  })

  describe('adjustPrimaryLightColor', () => {
    it('色が変換されること', () => {
      expect(adjustPrimaryLightColor('#faf100')).toEqual('#9b9500')
    })
  })

  describe('adjustPrimaryDarkColor', () => {
    it('色が変換されること', () => {
      expect(adjustPrimaryDarkColor('#804000')).toEqual('#935d26')
    })
  })

  describe('adjustLinkLightColor', () => {
    it('色が変換されること', () => {
      expect(adjustLinkLightColor('#faf100')).toEqual('#7b7700')
    })
  })

  describe('adjustLinkDarkColor', () => {
    it('色が変換されること', () => {
      expect(adjustLinkDarkColor('#804000')).toEqual('#a97d52')
    })
  })
}
