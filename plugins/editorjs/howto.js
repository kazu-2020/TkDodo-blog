import ajax from '@codexteam/ajax'

export default class HowTo {
  static get toolbox() {
    return {
      title: 'HowTo',
      icon:
        '<svg width="20" height="20" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M501.1 395.7L384 278.6c-23.1-23.1-57.6-27.6-85.4-13.9L192 158.1V96L64 0 0 64l96 128h62.1l106.6 106.6c-13.6 27.8-9.2 62.3 13.9 85.4l117.1 117.1c14.6 14.6 38.2 14.6 52.7 0l52.7-52.7c14.5-14.6 14.5-38.2 0-52.7zM331.7 225c28.3 0 54.9 11 74.9 31l19.4 19.4c15.8-6.9 30.8-16.5 43.8-29.5 37.1-37.1 49.7-89.3 37.9-136.7-2.2-9-13.5-12.1-20.1-5.5l-74.4 74.4-67.9-11.3L334 98.9l74.4-74.4c6.6-6.6 3.4-17.9-5.7-20.2-47.4-11.7-99.6.9-136.6 37.9-28.5 28.5-41.9 66.1-41.2 103.6l82.1 82.1c8.1-1.9 16.5-2.9 24.7-2.9zm-103.9 82l-56.7-56.7L18.7 402.8c-25 25-25 65.5 0 90.5s65.5 25 90.5 0l123.6-123.6c-7.6-19.9-9.9-41.6-5-62.7zM64 472c-13.2 0-24-10.8-24-24 0-13.3 10.7-24 24-24s24 10.7 24 24c0 13.2-10.7 24-24 24z"/></svg>',
    }
  }

  static get enableLineBreaks() {
    return true
  }

  constructor({ data, config, api }) {
    this.api = api

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
      linkEpisodeInfo: null,
      linkText: null,
    }

    this._data = {
      link: '',
      howTo: {},
      tvEpisode: {},
      tvSeries: {},
    }

    this.data = data
    this.wrapper = undefined
  }

  render() {
    this.nodes.wrapper = this.make('div', this.CSS.baseClass)
    this.nodes.container = this.make('div', this.CSS.container)

    this.nodes.inputHolder = this.makeInputHolder()
    this.nodes.linkContent = this.prepareLinkPreview()

    if (Object.keys(this.data.howTo).length) {
      this.nodes.container.appendChild(this.nodes.linkContent)
      this.showLinkPreview(
        this.data.howTo,
        this.data.tvSeries,
        this.data.tvEpisode
      )
    } else {
      this.nodes.container.appendChild(this.nodes.inputHolder)
    }

    this.nodes.wrapper.appendChild(this.nodes.container)

    return this.nodes.wrapper
  }

  save() {
    return this.data
  }

  set data(data) {
    this._data = Object.assign(
      {},
      {
        link: data.link || this._data.link,
        howTo: data.howTo || this._data.howTo,
        tvEpisode: data.tvEpisode || this._data.tvEpisode,
        tvSeries: data.tvSeries || this._data.tvSeries,
      }
    )
  }

  get data() {
    return this._data
  }

  get CSS() {
    return {
      baseClass: this.api.styles.block,
      input: this.api.styles.input,

      container: 'how_to',
      inputEl: 'how_to__input',
      inputHolder: 'how_to__input-holder',
      inputError: 'how_to__input-holder--error',
      linkContent: 'how_to__content',
      linkContentRendered: 'how_to__content--rendered',
      linkImage: 'how_to__image',
      linkTitle: 'how_to__title',
      linkDescription: 'how_to__description',
      linkEpisodeInfo: 'how_to__episode_info',
      progress: 'how_to__progress',
      progressLoading: 'how_to__progress--loading',
      progressLoaded: 'how_to__progress--loaded',
    }
  }

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

  startFetching(event) {
    let url = this.nodes.input.textContent

    if (event.type === 'paste') {
      url = (event.clipboardData || window.clipboardData).getData('text')
    }

    this.removeErrorStyle()
    this.fetchLinkData(url)
  }

  removeErrorStyle() {
    this.nodes.inputHolder.classList.remove(this.CSS.inputError)
    this.nodes.inputHolder.insertBefore(this.nodes.progress, this.nodes.input)
  }

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

  prepareLinkPreview() {
    const holder = this.make('a', this.CSS.linkContent, {
      target: '_blank',
      rel: 'nofollow noindex noreferrer',
    })

    this.nodes.linkImage = this.make('div', this.CSS.linkImage)
    this.nodes.linkTitle = this.make('div', this.CSS.linkTitle)
    this.nodes.linkDescription = this.make('p', this.CSS.linkDescription)
    this.nodes.linkEpisodeInfo = this.make('div', this.CSS.linkEpisodeInfo)
    this.nodes.linkText = this.make('span', this.CSS.linkText)

    return holder
  }

  showLinkPreview(howTo, tvSeries, tvEpisode) {
    this.nodes.container.appendChild(this.nodes.linkContent)

    if (howTo.image[0] && howTo.image[0].url) {
      const imageTag = this.make('img')

      imageTag.src = howTo.image[0].url
      this.nodes.linkImage.appendChild(imageTag)

      this.nodes.linkContent.appendChild(this.nodes.linkImage)
    }

    if (howTo.name) {
      this.nodes.linkTitle.textContent = howTo.name

      const imgTag = this.make('img')
      imgTag.src =
        'https://www.nhk.jp/static/assets/images/broadcastservice/bs/e1/e1-badge.png'
      this.nodes.linkTitle.appendChild(imgTag)

      this.nodes.linkContent.appendChild(this.nodes.linkTitle)
    }

    if (howTo.description) {
      this.nodes.linkDescription.textContent = howTo.description
      this.nodes.linkContent.appendChild(this.nodes.linkDescription)
    }

    if (tvSeries.name) {
      const pTag = this.make('p')
      pTag.textContent = tvSeries.name
      this.nodes.linkEpisodeInfo.appendChild(pTag)
    }

    if (tvEpisode.name) {
      const pTag = this.make('p')
      pTag.textContent = tvEpisode.name
      this.nodes.linkEpisodeInfo.appendChild(pTag)
    }

    this.nodes.linkContent.appendChild(this.nodes.linkEpisodeInfo)

    this.nodes.linkContent.classList.add(this.CSS.linkContentRendered)
    this.nodes.linkContent.setAttribute('href', this.data.link)

    try {
      this.nodes.linkText.textContent = new URL(this.data.link).hostname
    } catch (e) {
      this.nodes.linkText.textContent = this.data.link
    }
  }

  showProgress() {
    this.nodes.progress.classList.add(this.CSS.progressLoading)
  }

  hideProgress() {
    return new Promise(resolve => {
      this.nodes.progress.classList.remove(this.CSS.progressLoading)
      this.nodes.progress.classList.add(this.CSS.progressLoaded)

      setTimeout(resolve, 500)
    })
  }

  applyErrorStyle() {
    this.nodes.inputHolder.classList.add(this.CSS.inputError)
    this.nodes.progress.remove()
  }

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

  onFetch(response) {
    const _response = response.body

    if (!_response || !_response.success) {
      this.fetchingFailed('Can not get this link data, try another')
      return
    }

    const howTo = _response.howTo
    const tvEpisode = _response.tvEpisode
    const tvSeries = _response.tvSeries

    this.data = { link: howTo.url, howTo, tvSeries, tvEpisode }

    if (!howTo || !tvEpisode || !tvSeries) {
      this.fetchingFailed('Wrong response format from server')
      return
    }

    this.hideProgress().then(() => {
      this.nodes.inputHolder.remove()
      this.showLinkPreview(howTo, tvSeries, tvEpisode)
    })
  }

  fetchingFailed(errorMessage) {
    this.api.notifier.show({
      message: errorMessage,
      style: 'error',
    })

    this.applyErrorStyle()
  }

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
