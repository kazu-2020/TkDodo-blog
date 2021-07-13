/**
 * @typedef {object} TvEventData
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
export default class TvEvent {
  /**
   * Get Tool toolbox settings
   * icon - Tool icon's SVG
   * title - title to show in toolbox
   *
   * @return {{icon: string, title: string}}
   */
  static get toolbox() {
    return {
      title: 'TvEvent',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="17" height="15" viewBox="0 0 640 512"><path d="M148 288h-40c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12zm108-12v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm96 0v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm-96 96v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm-96 0v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm192 0v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm96-260v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V112c0-26.5 21.5-48 48-48h48V12c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v52h128V12c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v52h48c26.5 0 48 21.5 48 48zm-48 346V160H48v298c0 3.3 2.7 6 6 6h340c3.3 0 6-2.7 6-6z"/></svg>',
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
   * @param {TvEventData} data - previously saved data
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
      linkSeriesName: null,
      linkTitle: null,
      linkDescription: null,
      linkText: null,
      linkPlace: null,
      linkRibon: null,
    }

    this._data = {
      link: '',
      tvEvent: {},
      tvSeries: {},
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
    if (Object.keys(this.data.tvEvent).length) {
      this.nodes.container.appendChild(this.nodes.linkContent)
      this.showLinkPreview(this.data.tvEvent, this.data.tvSeries)
    } else {
      this.nodes.container.appendChild(this.nodes.inputHolder)
    }

    this.nodes.wrapper.appendChild(this.nodes.container)

    return this.nodes.wrapper
  }

  /**
   * Return Block data
   * @public
   *
   * @return {TvEventData}
   */
  save() {
    return this.data
  }

  /**
   * Stores all Tool's data
   * @param {TvEventData} data
   */
  set data(data) {
    this._data = Object.assign(
      {},
      {
        link: data.link || this._data.link,
        tvEvent: data.tvEvent || this._data.tvEvent,
        tvSeries: data.tvSeries || this._data.tvSeries,
      }
    )
  }

  /**
   * Return Tool data
   * @return {TvEventData} data
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
      container: 'tv_event',
      inputEl: 'tv_event__input',
      inputHolder: 'tv_event__input-holder',
      inputError: 'tv_event__input-holder--error',
      linkContent: 'tv_event__content',
      linkContentRendered: 'tv_event__content--rendered',
      linkImage: 'tv_event__image',
      linkTitle: 'tv_event__title',
      linkSeriesName: 'tv_event__series_name',
      linkDescription: 'tv_event__description',
      linkText: 'tv_event__anchor',
      linkPlace: 'tv_event__place',
      linkRibon: 'tv_event__ribon',
      progress: 'tv_event__progress',
      progressLoading: 'tv_event__progress--loading',
      progressLoaded: 'tv_event__progress--loaded',
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
    this.nodes.linkSeriesName = this.make('div', this.CSS.linkSeriesName)
    this.nodes.linkDescription = this.make('p', this.CSS.linkDescription)
    this.nodes.linkPlace = this.make('div', this.CSS.linkPlace)
    this.nodes.linkRibon = this.make('div', this.CSS.linkRibon)
    this.nodes.linkText = this.make('span', this.CSS.linkText)

    return holder
  }

  /**
   * Compose link preview from fetched data
   * @param {metaData} meta - link meta data
   */
  showLinkPreview(tvEvent, tvSeries) {
    this.nodes.container.appendChild(this.nodes.linkContent)

    if (tvEvent.image && tvEvent.image.medium && tvEvent.image.medium.url) {
      const imageTag = this.make('img')

      imageTag.src = tvEvent.image.medium.url
      this.nodes.linkImage.appendChild(imageTag)

      if (tvEvent.startDate && tvEvent.endDate) {
        const dateRangeTag = this.make('div')

        dateRangeTag.textContent =
          '期間: ' +
          tvEvent.startDate.substr(0, 10) +
          ' ~ \n' +
          tvEvent.endDate.substr(0, 10)
        this.nodes.linkImage.appendChild(dateRangeTag)
      }
      this.nodes.linkContent.appendChild(this.nodes.linkImage)
    }

    if (tvSeries.name) {
      this.nodes.linkSeriesName.textContent = tvSeries.name
      this.nodes.linkContent.appendChild(this.nodes.linkSeriesName)
    }

    if (tvEvent.name) {
      this.nodes.linkTitle.textContent = tvEvent.name
      this.nodes.linkContent.appendChild(this.nodes.linkTitle)
    }

    if (tvEvent.description) {
      this.nodes.linkDescription.textContent = tvEvent.description
      this.nodes.linkContent.appendChild(this.nodes.linkDescription)
    }

    if (tvEvent.location && tvEvent.address) {
      this.nodes.linkPlace.textContent =
        tvEvent.location + '（' + tvEvent.address + '）'
      this.nodes.linkContent.appendChild(this.nodes.linkPlace)
    }

    const ribonSpan = this.make('span')

    ribonSpan.textContent = 'イベント'
    this.nodes.linkRibon.appendChild(ribonSpan)
    this.nodes.linkContent.appendChild(this.nodes.linkRibon)

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
      console.log(error)
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

    const tvEvent = _response.tvEvent
    const tvSeries = _response.tvSeries

    this.data = { link: tvEvent.url, tvEvent, tvSeries }

    if (!tvEvent || !tvSeries) {
      this.fetchingFailed('Wrong response format from server')
      return
    }

    this.hideProgress().then(() => {
      this.nodes.inputHolder.remove()
      this.showLinkPreview(tvEvent, tvSeries)
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
