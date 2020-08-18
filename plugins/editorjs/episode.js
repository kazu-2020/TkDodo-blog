/**
 * @typedef {object} EpisodeData
 * @description Link Tool's input and output data format
 * @property {string} link — data url
 * @property {metaData} meta — fetched link data
 */

/**
 * @typedef {Object} metaData
 * @description Fetched link meta data
 * @property {string} image - link's meta image
 * @property {string} title - link's meta title
 * @property {string} description - link's description
 */

import ajax from '@codexteam/ajax'

/**
 * @typedef {object} UploadResponseFormat
 * @description This format expected from backend on link data fetching
 * @property {number} success  - 1 for successful uploading, 0 for failure
 * @property {metaData} meta - Object with link data.
 *
 * Tool may have any data provided by backend, currently are supported by design:
 * title, description, image, url
 */
export default class Episode {
  /**
   * Get Tool toolbox settings
   * icon - Tool icon's SVG
   * title - title to show in toolbox
   *
   * @return {{icon: string, title: string}}
   */
  static get toolbox() {
    return {
      title: 'Episode',
      icon:
        '<svg xmlns="http://www.w3.org/2000/svg" width="17" height="15" viewBox="0 0 640 512"><path d="M592 0H48A48 48 0 0 0 0 48v320a48 48 0 0 0 48 48h240v32H112a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16H352v-32h240a48 48 0 0 0 48-48V48a48 48 0 0 0-48-48zm-16 352H64V64h512z"/></svg>',
    }
  }

  /**
   * Allow to press Enter inside the Episode input
   * @returns {boolean}
   * @public
   */
  static get enableLineBreaks() {
    return true
  }

  /**
   * @param {EpisodeData} data - previously saved data
   * @param {config} config - user config for Tool
   * @param {object} api - Editor.js API
   */
  constructor({ data, config, api }) {
    this.api = api

    /**
     * Tool's initial config
     */
    this.config = {
      endpoint: config.endpoint || '',
      playlistId: config.playlistId || '',
    }

    this.nodes = {
      wrapper: null,
      container: null,
      progress: null,
      input: null,
      inputHolder: null,
      playlistTitle: null,
      playlistItemsHolder: null,
      linkContent: null,
      linkImage: null,
      linkTitle: null,
      linkDescription: null,
      linkText: null,
    }

    this._data = {
      link: '',
      episode: {},
    }

    this.data = data
    this.wrapper = undefined
  }

  /**
   * Renders Block content
   * @public
   *
   * @return {HTMLDivElement}
   */
  render() {
    this.nodes.wrapper = this.make('div', this.CSS.baseClass)
    this.nodes.container = this.make('div', this.CSS.container)

    this.nodes.inputHolder = this.makeInputHolder()
    this.nodes.linkContent = this.prepareLinkPreview()

    /**
     * If Tool already has data, render link preview, otherwise insert input
     */
    if (Object.keys(this.data.episode).length) {
      this.nodes.container.appendChild(this.nodes.linkContent)
      this.showLinkPreview(this.data.episode)
    } else {
      this.nodes.container.appendChild(this.nodes.inputHolder)
      this.fetchPlaylist()
    }

    this.nodes.wrapper.appendChild(this.nodes.container)

    return this.nodes.wrapper
  }

  /**
   * Return Block data
   * @public
   *
   * @return {EpisodeData}
   */
  save() {
    return this.data
  }

  /**
   * Stores all Tool's data
   * @param {EpisodeData} data
   */
  set data(data) {
    this._data = Object.assign(
      {},
      {
        link: data.link || this._data.link,
        episode: data.episode || this._data.episode,
      }
    )
  }

  /**
   * Return Tool data
   * @return {EpisodeData} data
   */
  get data() {
    return this._data
  }

  /**
   * @return {object} - Link Tool styles
   * @constructor
   */
  get CSS() {
    return {
      baseClass: this.api.styles.block,
      input: this.api.styles.input,

      /**
       * Tool's classes
       */
      container: 'episode',
      inputEl: 'episode__input',
      inputHolder: 'episode__input-holder',
      inputError: 'episode__input-holder--error',
      linkContent: 'episode__content',
      linkContentRendered: 'episode__content--rendered',
      linkImage: 'episode__image',
      linkTitle: 'episode__title',
      linkDescription: 'episode__description',
      linkText: 'episode__anchor',
      progress: 'episode__progress',
      progressLoading: 'episode__progress--loading',
      progressLoaded: 'episode__progress--loaded',
      playlistTitle: 'episode__playlist-title',
      playlistItems: 'episode__playlist-items',
      playlistItem: 'episode__playlist-item',
      playlistItemThumbnail: 'episode__playlist-item-thumbnail',
      playlistItemTitle: 'episode__playlist-item-title',
      playlistItemButton: 'episode__playlist-item-button',
    }
  }

  /**
   * Prepare input holder
   * @return {HTMLElement} - url input
   */
  makeInputHolder() {
    const inputHolder = this.make('div', this.CSS.inputHolder)

    this.nodes.progress = this.make('label', this.CSS.progress)
    this.nodes.input = this.make('div', [this.CSS.input, this.CSS.inputEl], {
      contentEditable: true,
    })
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

    inputHolder.appendChild(this.nodes.progress)
    inputHolder.appendChild(this.nodes.input)

    return inputHolder
  }

  /**
   * Get the specified playlist
   */
  async fetchPlaylist() {
    if (this.config.playlistId === '') return
    try {
      const response = await ajax.get({
        url: this.config.endpoint + '/playlists/' + this.config.playlistId,
      })

      this.onFetchPlaylist(response.body)
    } catch (error) {
      this.fetchingFailed('プレイリストの取得に失敗しました')
      console.log(error)
    }
  }

  /**
   * Link data fetching callback
   * @param {UploadResponseFormat} response
   */
  onFetchPlaylist(data) {
    this.nodes.playlistItemsHolder = this.make('div', this.CSS.playlistItems)
    const playlistTitle = this.make('div', this.CSS.playlistTitle)

    playlistTitle.textContent = data.playlist.name + 'のプレイリストから選択'
    this.nodes.playlistItemsHolder.appendChild(playlistTitle)

    for (const item of data.playlist.items) {
      const playlistItemHolder = this.make('div', this.CSS.playlistItem)

      const episodeTumbnail = this.make('div', this.CSS.playlistItemThumbnail)
      const imageUrl =
        item.eyecatch && item.eyecatch.medium
          ? item.eyecatch.medium.url
          : 'https://via.placeholder.com/32'

      episodeTumbnail.style.backgroundImage = 'url(' + imageUrl + ')'

      const episodeTitle = this.make('div', this.CSS.playlistItemTitle)

      episodeTitle.textContent = item.name

      const selectEpisodeButton = this.make(
        'button',
        this.CSS.playlistItemButton
      )

      selectEpisodeButton.textContent = '+'
      playlistItemHolder.addEventListener('click', (event) => {
        this.nodes.input.textContent = item.url
        this.startFetching(event)
      })

      playlistItemHolder.appendChild(episodeTumbnail)
      playlistItemHolder.appendChild(episodeTitle)
      playlistItemHolder.appendChild(selectEpisodeButton)

      this.nodes.playlistItemsHolder.appendChild(playlistItemHolder)
    }

    this.nodes.inputHolder.appendChild(this.nodes.playlistItemsHolder)
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
   * If previous link data fetching failed, remove error styles
   */
  removeErrorStyle() {
    this.nodes.inputHolder.classList.remove(this.CSS.inputError)
    this.nodes.inputHolder.insertBefore(this.nodes.progress, this.nodes.input)
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
   * Prepare link preview holder
   * @return {HTMLElement}
   */
  prepareLinkPreview() {
    const holder = this.make('a', this.CSS.linkContent, {
      target: '_blank',
      rel: 'nofollow noindex noreferrer',
    })

    this.nodes.linkImage = this.make('div', this.CSS.linkImage)
    this.nodes.linkTitle = this.make('div', this.CSS.linkTitle)
    this.nodes.linkDescription = this.make('p', this.CSS.linkDescription)
    this.nodes.linkText = this.make('span', this.CSS.linkText)

    return holder
  }

  /**
   * Compose link preview from fetched data
   * @param {metaData} meta - link meta data
   */
  showLinkPreview({ eyecatch, name, description }) {
    this.nodes.container.appendChild(this.nodes.linkContent)

    if (eyecatch && eyecatch.medium && eyecatch.medium.url) {
      this.nodes.linkImage.style.backgroundImage =
        'url(' + eyecatch.medium.url + ')'
      this.nodes.linkContent.appendChild(this.nodes.linkImage)
    }

    if (name) {
      this.nodes.linkTitle.textContent = name
      this.nodes.linkContent.appendChild(this.nodes.linkTitle)
    }

    if (description) {
      this.nodes.linkDescription.textContent = description
      this.nodes.linkContent.appendChild(this.nodes.linkDescription)
    }

    this.nodes.linkContent.classList.add(this.CSS.linkContentRendered)
    this.nodes.linkContent.setAttribute('href', this.data.link)
    this.nodes.linkContent.appendChild(this.nodes.linkText)

    try {
      this.nodes.linkText.textContent = new URL(this.data.link).hostname
    } catch (e) {
      this.nodes.linkText.textContent = this.data.link
    }
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
   * If data fetching failed, set input error style
   */
  applyErrorStyle() {
    this.nodes.inputHolder.classList.add(this.CSS.inputError)
    this.nodes.progress.remove()
  }

  /**
   * Sends to backend pasted url and receives link data
   * @param {string} url - link source url
   */
  async fetchLinkData(episodeId) {
    this.showProgress()

    try {
      const response = await ajax.get({
        url: `${this.config.endpoint}/episodes/${episodeId}/bundle`,
      })

      this.onFetch(response)
    } catch (error) {
      this.fetchingFailed("Haven't received data from server")
    }
  }

  /**
   * Link data fetching callback
   * @param {UploadResponseFormat} response
   */
  onFetch(response) {
    const _response = response.body

    if (!_response || !_response.success) {
      this.fetchingFailed('Can not get this link data, try another')
      return
    }

    const episode = _response.tvEpisode

    this.data = { link: episode.url, episode }

    if (!episode) {
      this.fetchingFailed('Wrong response format from server')
      return
    }

    this.hideProgress().then(() => {
      this.nodes.inputHolder.remove()
      this.showLinkPreview(episode)
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
      style: 'error',
    })

    this.applyErrorStyle()
  }

  /**
   * Helper method for elements creation
   * @param tagName
   * @param classNames
   * @param attributes
   * @return {HTMLElement}
   */
  make(tagName, classNames = null, attributes = {}) {
    const el = document.createElement(tagName)

    if (Array.isArray(classNames)) {
      el.classList.add(...classNames)
    } else if (classNames) {
      el.classList.add(classNames)
    }

    for (const attrName in attributes) {
      el[attrName] = attributes[attrName]
    }

    return el
  }
}
