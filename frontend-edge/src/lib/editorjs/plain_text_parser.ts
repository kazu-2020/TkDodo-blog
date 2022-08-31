import { OutputData } from '@editorjs/editorjs'

interface EditorDataBlockBase {
  type: string
}

interface HeaderEditorData extends EditorDataBlockBase {
  data: { text: string }
}

interface ParagraphEditorData extends EditorDataBlockBase {
  data: { text: string }
}

interface LinkToolEditorData extends EditorDataBlockBase {
  data: { meta: { description: string } }
}

interface ImageEditorData extends EditorDataBlockBase {
  data: { caption: string }
}

interface ListEditorData extends EditorDataBlockBase {
  data: { style: string; items: string[] }
}

interface EmbedEditorData extends EditorDataBlockBase {
  data: { caption: string }
}

class PlainTextParser {
  static parse(editorData: OutputData): string {
    if (editorData?.blocks == null || editorData.blocks.length < 1) return ''

    const plainText = editorData.blocks
      .map((block) => this.toPlainText(block))
      .join('\n\n')

    return `${plainText}\n`
  }

  static toPlainText(block: EditorDataBlockBase): string {
    switch (block.type) {
      case 'header':
        return this.headerParser(block as HeaderEditorData)
      case 'paragraph':
        return this.paragraphParser(block as ParagraphEditorData)
      case 'linkTool':
        return this.linkToolParser(block as LinkToolEditorData)
      case 'image':
        return this.imageParser(block as ImageEditorData)
      case 'list':
        return this.listParser(block as ListEditorData)
      case 'embed':
        return this.embedParser(block as EmbedEditorData)
      default:
        return ''
    }
  }

  static headerParser(block: HeaderEditorData): string {
    return this.stripHtml(this.convertInlineBr(block.data.text))
  }

  static paragraphParser(block: ParagraphEditorData): string {
    return this.stripHtml(this.convertInlineBr(block.data.text))
  }

  static linkToolParser(block: LinkToolEditorData): string {
    return block.data.meta.description
  }

  static imageParser(block: ImageEditorData): string {
    return block.data.caption
  }

  static listParser(block: ListEditorData): string {
    const prefix = block.data.style === 'ordered' ? '1.' : '･'
    return block.data.items
      .map((item) => `${prefix} ${this.stripHtml(this.convertInlineBr(item))}`)
      .join('\n')
  }

  static embedParser(block: EmbedEditorData): string {
    return block.data.caption
  }

  static stripHtml(text: string): string {
    const d = document.createElement('div')
    d.innerHTML = text
    return d.textContent || d.textContent || ''
  }

  static convertInlineBr(text: string): string {
    return text
      .replace(/<\/?br><\/b>/gi, '')
      .replace(/<\/?br><\/i>/gi, '')
      .replace(/<\/?br>/gi, '\n')
  }
}

export default PlainTextParser
