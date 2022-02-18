import ImageTool from '@editorjs/image'

export default class ExtendImageTool extends ImageTool {
  /**
   * @override 相対パスで入ってる画像のURLを環境に合わせて補完する
   * @see https://github.com/editor-js/image/blob/master/src/index.js#L339
   * @param {object} file - uploaded file data
   */
  // eslint-disable-next-line accessor-pairs
  set image(file) {
    this._data.file = file || {}

    if (file && file.url) {
      this.ui.fillImage(`${process.env.imageBaseUrl}${file.url}`)
    }
  }
}
