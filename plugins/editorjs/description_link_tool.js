import LinkTool from '@editorjs/link'
import ajax from '@codexteam/ajax'

export default class DescriptionLinkTool extends LinkTool {
  render() {
    const wrapper = super.render()

    if (this.data.link) {
      this.makeDescriptionTextBox()
      this.nodes.inputDescription.textContent = this.data.meta.description
    }

    return wrapper
  }

  async fetchLinkData(url) {
    this.showProgress()
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
      // 存在しないURLが入力されてエラーが起きた状態のまま保存された場合にblockを保存させたくないのでlinkを空にする
      this.data.link = ''
      this.fetchingFailed(this.api.i18n.t("Couldn't fetch the link data"))
    }
  }

  onFetch(response) {
    const metaData = this._onFetch(response)
    if (!metaData) {
      // 無効なURLでエラーが起きた状態のまま保存された場合にblockを保存させたくないのでlinkを空にする
      this.data.link = ''
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
      this.fetchingFailed(
        this.api.i18n.t("Couldn't get this link data, try the other one")
      )

      return
    }

    const metaData = response.meta

    this.data = { meta: metaData }

    if (!metaData) {
      this.fetchingFailed(
        this.api.i18n.t('Wrong response format from the server')
      )

      return
    }

    return metaData
  }

  makeDescriptionTextBox() {
    const descriptionClass = 'link-tool__input-description'

    this.nodes.inputDescription = this.make(
      'div',
      [this.CSS.input, descriptionClass],
      {
        contentEditable: !this.readOnly,
      }
    )

    this.nodes.inputDescription.dataset.placeholder =
      'リンク先を説明するテキストを入力してください'

    if (!this.allowDomain(this.data.link)) {
      this.nodes.linkContent.appendChild(this.makeWarningMessage())
    }

    this.nodes.wrapper.appendChild(this.nodes.inputDescription)
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

  allowDomain(link) {
    const domains = ['nhk.jp', 'nhk.or.jp', 'www.nhk-ondemand.jp']
    const url = new URL(link)

    return domains.some((domain) => url.hostname.includes(domain))
  }
}
