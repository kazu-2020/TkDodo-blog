export const aspectRatio = (
  imageType: 'logo' | 'eyecatch' | 'hero'
): number => {
  switch (imageType) {
    case 'logo':
      return 1
    case 'eyecatch':
      return 16 / 9
    case 'hero':
      return 3
    default:
      return 0
  }
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest
  describe('aspectRatio', () => {
    it('logoの場合', () => {
      expect(aspectRatio('logo')).toEqual(1)
    })

    it('eyecatchの場合', () => {
      expect(aspectRatio('eyecatch')).toEqual(16 / 9)
    })

    it('heroの場合', () => {
      expect(aspectRatio('hero')).toEqual(3)
    })
  })
}
