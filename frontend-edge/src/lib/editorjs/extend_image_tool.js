import ImageTool from '@editorjs/image'

import { IMAGE_BASE_URL } from '@/config'

export default class ExtendImageTool extends ImageTool {
  /**
   * @override 相対パスで入ってる画像のURLを環境に合わせて補完する
   * @see https://github.com/editor-js/image/blob/master/src/index.js#L339
   * @param {object} file - uploaded file data
   */
  set image(file) {
    // eslint-disable-next-line no-underscore-dangle
    this._data.file = file || {}

    if (file && file.url) {
      this.ui.fillImage(`${IMAGE_BASE_URL}/${file.url}`)
    }
  }
}
