export const dummyImageUrl = (dateTime: string, imageType: string) => {
  const num = Number(new Date(dateTime).getUTCDate() % 10) + 1 || 1
  return `/dummy/default${num}/default${num}-${imageType}.png`
}
