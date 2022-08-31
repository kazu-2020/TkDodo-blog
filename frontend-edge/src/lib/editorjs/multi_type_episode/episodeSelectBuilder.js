import ajax from '@codexteam/ajax'

import HTMLElementBuilder from './htmlElementBuilder'

/**
 * エピソードIDをしているDOMを生成するビルダークラス
 */
class EpisodeSelectBuilder {
  /**
   * @param {object} context - builder を作ったクラスのインスタンス
   * @param {object} api - Editor.js API
   * @param {config} config - user config for Tool
   */
  constructor(context, api, config) {
    this.context = context
    this.api = api
    this.config = config
    this.nodes = {
      inputHolder: null,
      input: null,
      progress: null
    }
    this.callbackOnSuccessFn = null
  }

  /**
   * 関連するCSSクラス群
   */
  get CSS() {
    return {
      inputHolder: 'multi_type_episode__input-holder',
      input: this.api.styles.input,
      inputEl: 'multi_type_episode__input',
      inputError: 'multi_type_episode__input-holder--error',
      progress: 'multi_type_episode__progress',
      progressLoading: 'multi_type_episode__progress--loading',
      progressLoaded: 'multi_type_episode__progress--loaded',
      playlistItems: 'multi_type_episode__playlist-items',
      playlistTitle: 'multi_type_episode__playlist-title',
      playlistItem: 'multi_type_episode__playlist-item',
      playlistItemThumbnail: 'multi_type_episode__playlist-item-thumbnail',
      playlistItemTitle: 'multi_type_episode__playlist-item-title',
      playlistItemSeriesName: 'multi_type_episode__playlist-item-series-name',
      playlistItemButton: 'multi_type_episode__playlist-item-button'
    }
  }

  /**
   * マークアップを生成するメソッド
   */
  build(callbackOnSuccessFn) {
    this.callbackOnSuccessFn = callbackOnSuccessFn
    this.nodes.inputHolder = new HTMLElementBuilder(
      'div',
      this.CSS.inputHolder
    ).build()

    this.nodes.progress = new HTMLElementBuilder(
      'label',
      this.CSS.progress
    ).build()
    this.nodes.input = new HTMLElementBuilder(
      'div',
      [this.CSS.input, this.CSS.inputEl],
      { contentEditable: true }
    ).build()
    this.nodes.input.dataset.placeholder =
      'https://www.nhk.jp/p/ts/XXXXXXXXXX/episode/te/XXXXXXXXXX/'

    this.nodes.input.addEventListener('paste', (event) => {
      this.startFetching(event)
    })

    this.nodes.input.addEventListener('keydown', (event) => {
      const [ENTER, A] = [13, 65]
      const cmdPressed = event.ctrlKey || event.metaKey

      switch (event.keyCode) {
        case ENTER:
          event.preventDefault()
          event.stopPropagation()

          this.startFetching(event)
          break
        case A:
          if (cmdPressed) {
            this.selectLinkUrl(event)
          }
          break
      }
    })

    this.nodes.inputHolder.appendChild(this.nodes.progress)
    this.nodes.inputHolder.appendChild(this.nodes.input)

    this.fetchPlaylist()

    return this.nodes.inputHolder
  }

  /**
   * Activates link data fetching by url
   */
  startFetching(event) {
    let url = this.nodes.input.textContent

    if (event.type === 'paste') {
      url = (event.clipboardData || window.clipboardData).getData('text')
    }

    this.removeErrorStyle()

    const pattern = /\/episode\/te\//
    const episodeId = url.split(pattern)[1].slice(0, -1)

    this.fetchLinkData(episodeId)
  }

  /**
   * Sends to backend pasted url and receives link data
   * @param {string} url - link source url
   */
  async fetchLinkData(episodeId) {
    this.showProgress()

    try {
      const response = await ajax.get({
        url: `${this.config.endpoint}/episodes/${episodeId}/bundle`
      })

      this.onFetchSuccess(response.body)
    } catch (error) {
      this.fetchingFailed("Haven't received data from server")
      console.log(error)
    }
  }

  /**
   * Link data fetching callback
   * @param {UploadResponseFormat} response
   */
  onFetchSuccess(response) {
    if (!response || !response.success) {
      this.fetchingFailed('Can not get this link data, try another')
      return
    }

    const episode = response.tvEpisode

    if (!episode) {
      this.fetchingFailed('Wrong response format from server')
      return
    }

    if (!episode) {
      this.fetchingFailed('Wrong response format from server')
      return
    }

    this.hideProgress().then(() => {
      this.nodes.inputHolder.remove()

      this.callbackOnSuccessFn(this.context, response)
    })
  }

  /**
   * Get the specified playlist
   */
  async fetchPlaylist() {
    if (this.config.playlistId === '') return
    try {
      const response = await ajax.get({
        url: `${this.config.endpoint}/playlists/${this.config.playlistId}`
      })

      this.onSuccessFetchingPlaylist(response.body)
    } catch (error) {
      this.fetchingFailed('プレイリストの取得に失敗しました')
      console.log(error)
    }
  }

  /**
   * Link data fetching callback
   * @param {UploadResponseFormat} response
   */
  onSuccessFetchingPlaylist(response) {
    const playlistItemsHolder = new HTMLElementBuilder(
      'div',
      this.CSS.playlistItems
    ).build()

    const playlistTitle = new HTMLElementBuilder(
      'div',
      this.CSS.playlistTitle
    ).build()

    playlistTitle.textContent = `${response.playlist.name}から選択`
    playlistItemsHolder.appendChild(playlistTitle)

    for (const item of response.playlist.items) {
      const playlistItemHolder = new HTMLElementBuilder(
        'div',
        this.CSS.playlistItem
      ).build()

      const episodeTumbnail = new HTMLElementBuilder(
        'div',
        this.CSS.playlistItemThumbnail
      ).build()
      const imageUrl =
        item.eyecatch && item.eyecatch.medium
          ? item.eyecatch.medium.url
          : 'https://via.placeholder.com/78x44'

      episodeTumbnail.style.backgroundImage = `url(${imageUrl})`

      const episodeTitle = new HTMLElementBuilder(
        'div',
        this.CSS.playlistItemTitle
      ).build()

      episodeTitle.textContent = item.name

      const seriesName = new HTMLElementBuilder(
        'div',
        this.CSS.playlistItemSeriesName
      ).build()

      seriesName.textContent = item.partOfSeries.name
      episodeTitle.appendChild(seriesName)

      const selectEpisodeButton = new HTMLElementBuilder(
        'button',
        this.CSS.playlistItemButton
      ).build()

      selectEpisodeButton.textContent = '+'
      playlistItemHolder.addEventListener('click', (event) => {
        this.nodes.input.textContent = item.url
        this.startFetching(event)
      })

      playlistItemHolder.appendChild(episodeTumbnail)
      playlistItemHolder.appendChild(episodeTitle)
      playlistItemHolder.appendChild(selectEpisodeButton)

      playlistItemsHolder.appendChild(playlistItemHolder)
    }

    this.nodes.inputHolder.appendChild(playlistItemsHolder)
  }

  /**
   * Select Episode input content by CMD+A
   * @param {KeyboardEvent} event
   */
  selectLinkUrl(event) {
    event.preventDefault()
    event.stopPropagation()

    const selection = window.getSelection()
    const range = new Range()

    const currentNode = selection.anchorNode.parentNode
    const currentItem = currentNode.closest(`.${this.CSS.inputHolder}`)
    const inputElement = currentItem.querySelector(`.${this.CSS.inputEl}`)

    range.selectNodeContents(inputElement)

    selection.removeAllRanges()
    selection.addRange(range)
  }

  /**
   * If previous link data fetching failed, remove error styles
   */
  removeErrorStyle() {
    this.nodes.inputHolder.classList.remove(this.CSS.inputError)
    this.nodes.inputHolder.insertBefore(this.nodes.progress, this.nodes.input)
  }

  /**
   * Show loading progressbar
   */
  showProgress() {
    this.nodes.progress.classList.add(this.CSS.progressLoading)
  }

  /**
   * Hide loading progressbar
   */
  hideProgress() {
    return new Promise((resolve) => {
      this.nodes.progress.classList.remove(this.CSS.progressLoading)
      this.nodes.progress.classList.add(this.CSS.progressLoaded)

      setTimeout(resolve, 500)
    })
  }

  /**
   * Handle link fetching errors
   * @private
   *
   * @param {string} errorMessage
   */
  fetchingFailed(errorMessage) {
    this.api.notifier.show({
      message: errorMessage,
      style: 'error'
    })

    this.applyErrorStyle()
  }

  /**
   * If data fetching failed, set input error style
   */
  applyErrorStyle() {
    this.nodes.inputHolder.classList.add(this.CSS.inputError)
    this.nodes.progress.remove()
  }
}

export default EpisodeSelectBuilder
