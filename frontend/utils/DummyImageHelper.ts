export default class {
  static getPath(dateTimeString: string, imageType: string) {
    const num = Number(new Date(dateTimeString).getDate() % 10) + 1 || 1
    return `/dummy/default${num}/default${num}-${imageType}.png`
  }
}
