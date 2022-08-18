import EditorJS, { API, BlockAPI } from '@editorjs/editorjs'

export const notifyError = (editor: EditorJS, message: string) =>
  // @ts-ignore
  (editor.notifier as API.Notifier).show({
    message,
    style: 'error'
  })

export const destroyCurrentBlock = (editor: EditorJS) => {
  const i = editor.blocks.getCurrentBlockIndex()
  editor.blocks.delete(i)
}

export const isFirstBlockEmpty = (editor: EditorJS | null): boolean => {
  if (editor === null) return false

  const firstBlock = editor.blocks.getBlockByIndex(0)
  return (firstBlock as BlockAPI).isEmpty
}

// Editorの先頭に空のブロックを追加する
export const unshiftEmptyBlock = (editor: EditorJS | null) => {
  editor?.blocks.insert('paragraph', {}, {}, 0, false)
  editor?.caret.setToFirstBlock('end', 0)
}
