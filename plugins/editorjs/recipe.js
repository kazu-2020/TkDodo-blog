import ajax from '@codexteam/ajax'

export default class Recipe {
  static get toolbox() {
    return {
      title: 'Recipe',
      icon:
        '<svg width="20" height="20" viewBox="0 0 416 512" xmlns="http://www.w3.org/2000/svg"><path d="M207.9 15.2c.8 4.7 16.1 94.5 16.1 128.8 0 52.3-27.8 89.6-68.9 104.6L168 486.7c.7 13.7-10.2 25.3-24 25.3H80c-13.7 0-24.7-11.5-24-25.3l12.9-238.1C27.7 233.6 0 196.2 0 144 0 109.6 15.3 19.9 16.1 15.2 19.3-5.1 61.4-5.4 64 16.3v141.2c1.3 3.4 15.1 3.2 16 0 1.4-25.3 7.9-139.2 8-141.8 3.3-20.8 44.7-20.8 47.9 0 .2 2.7 6.6 116.5 8 141.8.9 3.2 14.8 3.4 16 0V16.3c2.6-21.6 44.8-21.4 48-1.1zm119.2 285.7l-15 185.1c-1.2 14 9.9 26 23.9 26h56c13.3 0 24-10.7 24-24V24c0-13.2-10.7-24-24-24-82.5 0-221.4 178.5-64.9 300.9z"/></svg>',
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
      recipe: {},
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

    if (Object.keys(this.data.recipe).length) {
      this.nodes.container.appendChild(this.nodes.linkContent)
      this.showLinkPreview(
        this.data.recipe,
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
        recipe: data.recipe || this._data.recipe,
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

      container: 'recipe',
      inputEl: 'recipe__input',
      inputHolder: 'recipe__input-holder',
      inputError: 'recipe__input-holder--error',
      linkContent: 'recipe__content',
      linkContentRendered: 'recipe__content--rendered',
      linkImage: 'recipe__image',
      linkTitle: 'recipe__title',
      linkCookTime: 'recipe__cook_time',
      linkDescription: 'recipe__description',
      linkEpisodeInfo: 'recipe__episode_info',
      progress: 'recipe__progress',
      progressLoading: 'recipe__progress--loading',
      progressLoaded: 'recipe__progress--loaded',
    }
  }

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
    this.nodes.linkCookTime = this.make('div', this.CSS.linkCookTime)
    this.nodes.linkDescription = this.make('p', this.CSS.linkDescription)
    this.nodes.linkEpisodeInfo = this.make('div', this.CSS.linkEpisodeInfo)
    this.nodes.linkText = this.make('span', this.CSS.linkText)

    return holder
  }

  showLinkPreview(recipe, tvSeries, tvEpisode) {
    this.nodes.container.appendChild(this.nodes.linkContent)

    if (recipe.image[0]) {
      const imageTag = this.make('img')

      imageTag.src = recipe.image[0]
      this.nodes.linkImage.appendChild(imageTag)

      this.nodes.linkContent.appendChild(this.nodes.linkImage)
    }

    if (recipe.name) {
      this.nodes.linkTitle.textContent = recipe.name

      const imgTag = this.make('img')
      imgTag.src =
        'https://www.nhk.jp/static/assets/images/broadcastservice/bs/e1/e1-badge.png'
      this.nodes.linkTitle.appendChild(imgTag)

      this.nodes.linkContent.appendChild(this.nodes.linkTitle)
    }

    if (recipe.cookTime) {
      this.nodes.linkCookTime.textContent =
        '調理時間: ' + this.convertReadableTime(recipe.cookTime)
      this.nodes.linkContent.appendChild(this.nodes.linkCookTime)
    }

    if (recipe.description) {
      this.nodes.linkDescription.textContent = recipe.description
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
    return new Promise((resolve) => {
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

    const recipe = _response.recipe
    const tvEpisode = _response.tvEpisode
    const tvSeries = _response.tvSeries

    this.data = { link: recipe.url, recipe, tvSeries, tvEpisode }

    if (!recipe || !tvEpisode || !tvSeries) {
      this.fetchingFailed('Wrong response format from server')
      return
    }

    this.hideProgress().then(() => {
      this.nodes.inputHolder.remove()
      this.showLinkPreview(recipe, tvSeries, tvEpisode)
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

  convertReadableTime(cookTime) {
    return cookTime.replace('PT', '').replace('M', '分')
  }
}
