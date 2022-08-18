import List from '@editorjs/list'

export default class DefaultUnorderedList extends List {
  constructor(params) {
    // eslint-disable-next-line no-param-reassign
    params.data.style = 'unordered'
    super(params)
  }
}
