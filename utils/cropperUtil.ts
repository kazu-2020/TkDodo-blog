export default class {
  /**
   * 引数で受け取った高さと幅から画面サイズにあわせた高さと幅を返す
   * 高さは 400px を基本として幅を計算するが、
   * 計算後の幅が 1,120px 以上の場合は幅を 1,120px として高さを計算する
   * @param {Number} height 高さ
   * @param {Number} width 幅
   * @return {Array} 縦・横 のサイズ
   */
  static getAdjustedSize(height: number, width: number): Array<number> {
    let adjustedHeight = 400 // 基本の高さ
    const maxWidth = 1120 // 最大画像幅
    let evenWidth: number = width // 偶数にした幅を代入するための変数

    // NOTE: copper.jsは幅が奇数の場合に右に黒線が入ってしまうバグがあるため、奇数の場合は1px減らす
    if (width % 2 !== 0) {
      evenWidth = width - 1
    }

    let adjustedWidth = (adjustedHeight * evenWidth) / height

    // 画像幅が1120px以上の場合、幅を1120pxに縮小
    if (adjustedWidth > maxWidth) {
      adjustedWidth = maxWidth
      adjustedHeight = (adjustedWidth * height) / evenWidth
    }

    return [adjustedHeight, adjustedWidth]
  }

  /**
   * 圧縮した Blob を返す
   * @param {Blob} file 圧縮対象の画像 File/Blob
   * @param {string | undefined} mimeType
   * @param {Number} maxImageSize 3Kの最大値2880pxをデフォルトとする
   * @return {Promise}
   */
  static compress(
    file: Blob,
    mimeType: string | undefined,
    maxImageSize = 2880
  ) {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    const image = new Image()
    // const mimeType = this.getFileMimeType();

    if (!context) return file

    return new Promise((resolve) => {
      image.onload = () => {
        let w = image.width
        let h = image.height

        if (maxImageSize < Math.max(image.width, image.height)) {
          if (image.width >= image.height) {
            w = maxImageSize
            h = image.height * (maxImageSize / image.width)
          } else {
            w = image.width * (maxImageSize / image.height)
            h = maxImageSize
          }
        }

        canvas.width = w
        canvas.height = h
        context.drawImage(image, 0, 0, w, h)
        canvas.toBlob((blob) => resolve(blob), mimeType, 1)
      }
      image.src = URL.createObjectURL(file)
    })
  }

  static toBlob(base64: string, mimeType: string | undefined) {
    const bin = atob(base64.replace(/^.*,/, ''))
    const buffer = new Uint8Array(bin.length)
    for (let i = 0; i < bin.length; i += 1) {
      buffer[i] = bin.charCodeAt(i)
    }
    return new Blob([buffer.buffer], { type: mimeType })
  }
}
