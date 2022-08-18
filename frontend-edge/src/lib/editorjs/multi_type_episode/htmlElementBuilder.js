/**
 * HTMLDOM生成のビルダークラス
 */
class HTMLElementBuilder {
  /**
   * Helper method for elements creation
   * @param tagName
   * @param classNames
   * @param attributes
   * @return {HTMLElement}
   */
  constructor(tagName, classNames = null, attributes = {}) {
    this.tagName = tagName
    this.classNames = classNames
    this.attributes = attributes
  }

  /**
   * DOM生成のビルド処理
   */
  build() {
    const el = document.createElement(this.tagName)

    if (Array.isArray(this.classNames)) {
      el.classList.add(...this.classNames)
    } else if (this.classNames) {
      el.classList.add(this.classNames)
    }

    for (const attrName in this.attributes) {
      el[attrName] = this.attributes[attrName]
    }

    return el
  }
}

export default HTMLElementBuilder
