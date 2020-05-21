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
    }

    this.nodes = {
      wrapper: null,
      container: null,
      progress: null,
      input: null,
      inputHolder: null,
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
    this.settings = [
      {
        name: 'Recipe',
        icon: `<svg width="20" height="20" viewBox="0 0 416 512" xmlns="http://www.w3.org/2000/svg"><path d="M207.9 15.2c.8 4.7 16.1 94.5 16.1 128.8 0 52.3-27.8 89.6-68.9 104.6L168 486.7c.7 13.7-10.2 25.3-24 25.3H80c-13.7 0-24.7-11.5-24-25.3l12.9-238.1C27.7 233.6 0 196.2 0 144 0 109.6 15.3 19.9 16.1 15.2 19.3-5.1 61.4-5.4 64 16.3v141.2c1.3 3.4 15.1 3.2 16 0 1.4-25.3 7.9-139.2 8-141.8 3.3-20.8 44.7-20.8 47.9 0 .2 2.7 6.6 116.5 8 141.8.9 3.2 14.8 3.4 16 0V16.3c2.6-21.6 44.8-21.4 48-1.1zm119.2 285.7l-15 185.1c-1.2 14 9.9 26 23.9 26h56c13.3 0 24-10.7 24-24V24c0-13.2-10.7-24-24-24-82.5 0-221.4 178.5-64.9 300.9z"/></svg>`,
      },
      {
        name: 'イベント',
        icon: `<svg width="20" height="20" viewBox="0 0 640 512" xmlns="http://www.w3.org/2000/svg"><path d="M148 288h-40c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12zm108-12v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm96 0v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm-96 96v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm-96 0v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm192 0v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm96-260v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V112c0-26.5 21.5-48 48-48h48V12c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v52h128V12c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v52h48c26.5 0 48 21.5 48 48zm-48 346V160H48v298c0 3.3 2.7 6 6 6h340c3.3 0 6-2.7 6-6z"/></svg>`,
      },
      {
        name: 'ハウツー',
        icon: `<svg width="20" height="20" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M501.1 395.7L384 278.6c-23.1-23.1-57.6-27.6-85.4-13.9L192 158.1V96L64 0 0 64l96 128h62.1l106.6 106.6c-13.6 27.8-9.2 62.3 13.9 85.4l117.1 117.1c14.6 14.6 38.2 14.6 52.7 0l52.7-52.7c14.5-14.6 14.5-38.2 0-52.7zM331.7 225c28.3 0 54.9 11 74.9 31l19.4 19.4c15.8-6.9 30.8-16.5 43.8-29.5 37.1-37.1 49.7-89.3 37.9-136.7-2.2-9-13.5-12.1-20.1-5.5l-74.4 74.4-67.9-11.3L334 98.9l74.4-74.4c6.6-6.6 3.4-17.9-5.7-20.2-47.4-11.7-99.6.9-136.6 37.9-28.5 28.5-41.9 66.1-41.2 103.6l82.1 82.1c8.1-1.9 16.5-2.9 24.7-2.9zm-103.9 82l-56.7-56.7L18.7 402.8c-25 25-25 65.5 0 90.5s65.5 25 90.5 0l123.6-123.6c-7.6-19.9-9.9-41.6-5-62.7zM64 472c-13.2 0-24-10.8-24-24 0-13.3 10.7-24 24-24s24 10.7 24 24c0 13.2-10.7 24-24 24z"/></svg>`,
      },
    ]
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
    }

    this.nodes.wrapper.appendChild(this.nodes.container)

    return this.nodes.wrapper
  }

  /**
   * Renders Block setting
   * @public
   *
   * @return {HTMLDivElement}
   */
  renderSettings() {
    const wrapper = document.createElement('div')

    this.settings.forEach(tune => {
      const button = document.createElement('div')

      button.classList.add('cdx-settings-button')
      button.innerHTML = tune.icon
      wrapper.appendChild(button)
    })

    return wrapper
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

    this.nodes.input.dataset.placeholder = 'Episode ID'

    this.nodes.input.addEventListener('paste', event => {
      this.startFetching(event)
    })

    this.nodes.input.addEventListener('keydown', event => {
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
   * Activates link data fetching by url
   */
  startFetching(event) {
    let url = this.nodes.input.textContent

    if (event.type === 'paste') {
      url = (event.clipboardData || window.clipboardData).getData('text')
    }

    this.removeErrorStyle()
    this.fetchLinkData(url)
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
    console.log(eyecatch)
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
    return new Promise(resolve => {
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
      console.log(episode)
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
