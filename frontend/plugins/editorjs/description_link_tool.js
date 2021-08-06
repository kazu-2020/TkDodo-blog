import LinkTool from '@editorjs/link'
import ajax from '@codexteam/ajax'

export default class DescriptionLinkTool extends LinkTool {
  static get enableLineBreaks() {
    return false
  }

  render() {
    const wrapper = super.render()

    if (this.data.link) {
      this.makeDescriptionTextBox()
      this.nodes.inputDescription.value = this.data.meta.description
    }

    return wrapper
  }

  // @override
  async startFetching(event) {
    if (this.fetching) return
    this.fetching = true

    let url = this.nodes.input.textContent

    if (event.type === 'paste') {
      url = (event.clipboardData || window.clipboardData).getData('text')
    }

    this.removeErrorStyle()
    await this.fetchLinkData(url)
  }

  // @override
  async fetchLinkData(url) {
    this.showProgress()

    if (!/^(http|https):\/\/[^ "]+$/.test(url)) {
      this.data.link = ''
      this.fetchingFailed('http または https から始まるURLを入力してください')
      return
    }

    this.data = { link: url }

    try {
      const { body } = await ajax.get({
        url: this.config.endpoint,
        data: {
          url,
        },
      })

      this.onFetch(body)
    } catch (error) {
      this.fetchingFailed('無効なリンクが入力されています')
    }
  }

  onFetch(response) {
    const metaData = this._onFetch(response)
    if (!metaData) {
      return
    }

    this.hideProgress().then(() => {
      this.nodes.inputHolder.remove()
      this.showLinkPreview(metaData)
      this.makeDescriptionTextBox()
    })
  }

  _onFetch(response) {
    if (!response || !response.success) {
      this.fetchingFailed('無効なリンクが入力されています')

      return { meta: { description: '' } }
    }

    const metaData = response.meta

    this.data = { meta: metaData }

    if (!metaData) {
      this.fetchingFailed('無効なリンクが入力されています')

      return { meta: { description: '' } }
    }

    return metaData
  }

  // @override
  fetchingFailed(errorMessage) {
    this.fetching = false
    super.fetchingFailed(errorMessage)
  }

  makeDescriptionTextBox() {
    const descriptionClass = 'link-tool__input-description'

    this.nodes.inputDescription = this.make(
      'input',
      [this.CSS.input, descriptionClass],
      {
        contentEditable: !this.readOnly,
        maxLength: 80,
      }
    )

    this.nodes.inputDescription.placeholder =
      'リンク先を説明するテキストを入力してください（最大80文字）'

    if (!this.readOnly) {
      this.nodes.inputDescription.addEventListener('paste', (event) => {
        const description = (
          event.clipboardData || window.clipboardData
        ).getData('text')
        this.setDescription(description)
      })

      this.nodes.inputDescription.addEventListener('input', (event) => {
        this.setDescription(event.target.value)
      })
    }

    if (!this.allowDomain(this.data.link)) {
      this.nodes.linkContent.appendChild(this.makeWarningMessage())
    }

    this.nodes.wrapper.appendChild(this.nodes.inputDescription)
  }

  setDescription(description) {
    this.data.meta.description = description

    if (this.data.meta.description) {
      this.nodes.linkContent.insertBefore(
        this.nodes.linkDescription,
        this.nodes.linkText
      )
    } else {
      this.nodes.linkContent.removeChild(this.nodes.linkDescription)
    }

    this.nodes.linkContent.classList.add(this.CSS.linkContentRendered)
  }

  makeWarningMessage() {
    this.nodes.warningWrapper = this.make('div', 'link-tool__warning__wrapper')
    this.nodes.warningMessage = this.make('span', 'link-tool__warning__message')
    this.nodes.warningMessage.textContent = '※NHKサイトを離れます'
    this.nodes.warningWrapper.appendChild(this.nodes.warningMessage)

    return this.nodes.warningWrapper
  }

  showLinkPreview({ image, title, description }) {
    super.showLinkPreview({ image, title, description })
    this.nodes.linkText.textContent = this.data.link
  }

  /**
   * @override
   */
  prepareLinkPreview() {
    const holder = super.prepareLinkPreview()
    holder.addEventListener('click', this.onClick)

    return holder
  }

  onClick(e) {
    if (!confirm(`${this.href} を別タブで開きます。よろしいですか？`)) {
      e.preventDefault()
    }
    return false
  }

  allowDomain(link) {
    const domains = ['nhk.jp', 'nhk.or.jp', 'www.nhk-ondemand.jp']
    const url = new URL(link)

    return domains.some((domain) => url.hostname.includes(domain))
  }
}
