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
