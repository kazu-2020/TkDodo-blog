class PlainTextParser {
  static parse(editorData: any): string {
    if (editorData?.blocks == null || editorData.blocks.length < 1) return ''

    const plainText = editorData.blocks
      .map((block: any) => this.toPlainText(block))
      .join('\n\n')

    return `${plainText}\n`
  }

  static toPlainText(block: any): string {
    switch (block.type) {
      case 'header':
        return this.headerParser(block)
      case 'paragraph':
        return this.paragraphParser(block)
      case 'linkTool':
        return this.linkToolParser(block)
      case 'image':
        return this.imageParser(block)
      case 'list':
        return this.listParser(block)
      case 'embed':
        return this.embedParser(block)
      default:
        return ''
    }
  }

  static headerParser(block: any): string {
    return this.stripTags(this.convertInlineBr(block.data.text))
  }

  static paragraphParser(block: any): string {
    return this.stripTags(this.convertInlineBr(block.data.text))
  }

  static linkToolParser(block: any): string {
    return block.data.meta.description
  }

  static imageParser(block: any): string {
    return block.data.caption
  }

  static listParser(block: any): string {
    const prefix = block.data.style === 'ordered' ? '1.' : '･'
    return block.data.items
      .map(
        (item: any) => `${prefix} ${this.stripTags(this.convertInlineBr(item))}`
      )
      .join('\n')
  }

  static embedParser(block: any): string {
    return block.data.caption
  }

  static stripTags(text: string): string {
    return text.replace(/(<([^>]+)>)/gi, '')
  }

  static convertInlineBr(text: string): string {
    return text
      .replace(/<\/?br><\/b>/gi, '')
      .replace(/<\/?br><\/i>/gi, '')
      .replace(/<\/?br>/gi, '\n')
  }
}

export default PlainTextParser
