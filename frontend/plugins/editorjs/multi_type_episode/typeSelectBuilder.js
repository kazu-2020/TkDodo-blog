import HTMLElementBuilder from './htmlElementBuilder'

/**
 * タイプ変更させるためのDOMを生成するビルダークラス
 */
class TypeSelectBuilder {
  /**
   * @param {object} context - builder を作ったクラスのインスタンス
   * @param {object} data - plugin save data
   */
  constructor(context, data) {
    this.context = context
    this.data = data
    this.nodes = {
      typeSelectHolder: null,
    }
  }

  /**
   * 関連するCSSクラス群
   */
  get CSS() {
    return {
      playlistTitle: 'multi_type_episode__playlist-title',
      playlistItems: 'multi_type_episode__playlist-items',
      playlistItem: 'multi_type_episode__playlist-item',
      playlistItemThumbnail: 'multi_type_episode__playlist-item-thumbnail',
      playlistItemTitle: 'multi_type_episode__playlist-item-title',
      playlistItemButton: 'multi_type_episode__playlist-item-button',
      playlistItemButtonMin: 'multi_type_episode__playlist-item-button-min',
    }
  }

  /**
   * マークアップを生成するメソッド
   */
  build(
    selectEpisodeButtonFn,
    selectRecipeButtonFn,
    selectHowToButtonFn,
    selectEventButtonFn,
    selectFaqPageButtonFn
  ) {
    this._showTypeSelectorHeader()
    this._showEpisodeItem(selectEpisodeButtonFn)
    this._showRecipeItems(selectRecipeButtonFn)
    this._showHowToItems(selectHowToButtonFn)
    this._showEventItems(selectEventButtonFn)
    this._showFaqPageItems(selectFaqPageButtonFn)

    return this.nodes.typeSelectHolder
  }

  /**
   * タイプ変更状態のヘッダーDOMを構築
   */
  _showTypeSelectorHeader() {
    this.nodes.typeSelectHolder = new HTMLElementBuilder(
      'div',
      this.CSS.playlistItems
    ).build()
    const selectTitle = new HTMLElementBuilder(
      'div',
      this.CSS.playlistTitle
    ).build()

    selectTitle.textContent = 'タイプを変更する'
    this.nodes.typeSelectHolder.appendChild(selectTitle)
  }

  /**
   * エピソードへタイプ変更するDOMを構築
   */
  _showEpisodeItem(selectEpisodeButtonFn) {
    const episodeItem = new HTMLElementBuilder(
      'div',
      this.CSS.playlistItem
    ).build()
    const episode = this.data.tvEpisode
    let eyecatch =
      episode.eyecatch === undefined
        ? this._keyvisualToEyecatchConverter(episode)
        : episode.eyecatch
    if (eyecatch === undefined) {
      eyecatch = episode.partOfSeries.eyecatch
    }

    const episodeThumbnail = new HTMLElementBuilder(
      'div',
      this.CSS.playlistItemThumbnail
    ).build()
    const imageUrl =
      eyecatch && eyecatch.medium
        ? eyecatch.medium.url
        : 'https://via.placeholder.com/160x90'

    episodeThumbnail.style.backgroundImage = 'url(' + imageUrl + ')'

    const episodeTitle = new HTMLElementBuilder(
      'div',
      this.CSS.playlistItemTitle
    ).build()

    episodeTitle.textContent = '[エピソード]' + episode.name
    const selectEpisodeButton = new HTMLElementBuilder(
      'button',
      this.CSS.playlistItemButton
    ).build()

    selectEpisodeButton.textContent = '選択'

    episodeItem.addEventListener('click', (_event) => {
      this.nodes.typeSelectHolder.remove()
      selectEpisodeButtonFn(this.context, episode)
    })

    episodeItem.appendChild(episodeThumbnail)
    episodeItem.appendChild(episodeTitle)
    episodeItem.appendChild(selectEpisodeButton)

    this.nodes.typeSelectHolder.appendChild(episodeItem)
  }

  /**
   * レシピへタイプ変更するDOM群を構築
   */
  _showRecipeItems(selectRecipeButtonFn) {
    const recipes = this.data.recipes

    if (recipes.length === 0) return

    for (const recipe of recipes) {
      const recipeItem = new HTMLElementBuilder(
        'div',
        this.CSS.playlistItem
      ).build()
      const recipeThumbnail = new HTMLElementBuilder(
        'div',
        this.CSS.playlistItemThumbnail
      ).build()
      const imageUrl =
        recipe.image && recipe.image.length >= 1
          ? recipe.image[0]
          : 'https://via.placeholder.com/160x90'

      recipeThumbnail.style.backgroundImage = 'url(' + imageUrl + ')'

      const recipeTitle = new HTMLElementBuilder(
        'div',
        this.CSS.playlistItemTitle
      ).build()

      recipeTitle.textContent = '[レシピ]' + recipe.name

      const selectRecipeButton = new HTMLElementBuilder(
        'button',
        this.CSS.playlistItemButton
      ).build()

      selectRecipeButton.textContent = '選択'

      recipeItem.addEventListener('click', (_event) => {
        this.nodes.typeSelectHolder.remove()
        selectRecipeButtonFn(this.context, recipe)
      })

      recipeItem.appendChild(recipeThumbnail)
      recipeItem.appendChild(recipeTitle)
      recipeItem.appendChild(selectRecipeButton)

      this.nodes.typeSelectHolder.appendChild(recipeItem)
    }
  }

  /**
   * ハウツーへタイプ変更するDOM群を構築
   */
  _showHowToItems(selectHowToButtonFn) {
    const howTos = this.data.howTos

    if (howTos.length === 0) return

    for (const howTo of howTos) {
      const howToItem = new HTMLElementBuilder(
        'div',
        this.CSS.playlistItem
      ).build()
      const howToThumbnail = new HTMLElementBuilder(
        'div',
        this.CSS.playlistItemThumbnail
      ).build()

      const howtoImage = howTo.image
      const episode = this.data.tvEpisode
      let eyecatch =
        episode.eyecatch === undefined
          ? this._keyvisualToEyecatchConverter(episode)
          : episode.eyecatch
      if (eyecatch === undefined) {
        eyecatch = episode.partOfSeries.eyecatch
      }

      let thumbnailImageUrl = 'https://via.placeholder.com/160x90'
      if (howtoImage && howtoImage.medium && howtoImage.medium.url) {
        thumbnailImageUrl = howtoImage.medium.url
      } else if (eyecatch && eyecatch.medium && eyecatch.medium.url) {
        thumbnailImageUrl = eyecatch.medium.url
      }

      howToThumbnail.style.backgroundImage = 'url(' + thumbnailImageUrl + ')'

      const howToTitle = new HTMLElementBuilder(
        'div',
        this.CSS.playlistItemTitle
      ).build()

      howToTitle.textContent = '[ハウツー]' + howTo.name

      const selectHowToButton = new HTMLElementBuilder(
        'button',
        this.CSS.playlistItemButton
      ).build()

      selectHowToButton.textContent = '選択'

      howToItem.addEventListener('click', (_event) => {
        this.nodes.typeSelectHolder.remove()
        selectHowToButtonFn(this.context, howTo)
      })

      howToItem.appendChild(howToThumbnail)
      howToItem.appendChild(howToTitle)
      howToItem.appendChild(selectHowToButton)

      this.nodes.typeSelectHolder.appendChild(howToItem)
    }
  }

  /**
   * イベントへタイプ変更するDOM群を構築
   */
  _showEventItems(selectEventButtonFn) {
    const events = this.data.events

    if (events.length === 0) return

    for (const event of events) {
      const eventItem = new HTMLElementBuilder(
        'div',
        this.CSS.playlistItem
      ).build()
      const eventThumbnail = new HTMLElementBuilder(
        'div',
        this.CSS.playlistItemThumbnail
      ).build()

      const eventImage = event.image
      const episode = this.data.tvEpisode
      let eyecatch =
        episode.eyecatch === undefined
          ? this._keyvisualToEyecatchConverter(episode)
          : episode.eyecatch
      if (eyecatch === undefined) {
        eyecatch = episode.partOfSeries.eyecatch
      }

      let thumbnailImageUrl = 'https://via.placeholder.com/160x90'
      if (eventImage && eventImage.medium && eventImage.medium.url) {
        thumbnailImageUrl = eventImage.medium.url
      } else if (eyecatch && eyecatch.medium && eyecatch.medium.url) {
        thumbnailImageUrl = eyecatch.medium.url
      }

      eventThumbnail.style.backgroundImage = 'url(' + thumbnailImageUrl + ')'

      const eventTitle = new HTMLElementBuilder(
        'div',
        this.CSS.playlistItemTitle
      ).build()

      eventTitle.textContent = '[イベント]' + event.name

      const selectEventButton = new HTMLElementBuilder(
        'button',
        this.CSS.playlistItemButton
      ).build()

      selectEventButton.textContent = '選択'

      eventItem.addEventListener('click', (_event) => {
        this.nodes.typeSelectHolder.remove()
        selectEventButtonFn(this.context, event)
      })

      eventItem.appendChild(eventThumbnail)
      eventItem.appendChild(eventTitle)
      eventItem.appendChild(selectEventButton)

      this.nodes.typeSelectHolder.appendChild(eventItem)
    }
  }

  /**
   * FAQPageへタイプ変更するDOM群を構築
   */
  _showFaqPageItems(selectFaqPageButtonFn) {
    const faqPages = this.data.faqpage

    if (faqPages.length === 0) return

    for (const faqPage of faqPages) {
      const faqPageItem = new HTMLElementBuilder(
        'div',
        this.CSS.playlistItem
      ).build()
      const faqPageTitle = new HTMLElementBuilder(
        'div',
        this.CSS.playlistItemTitle
      ).build()

      faqPageTitle.textContent = '[FAQ]' + faqPage.name

      const selectFaqPageButton = new HTMLElementBuilder(
        'button',
        this.CSS.playlistItemButtonMin
      ).build()

      selectFaqPageButton.textContent = '選択'

      faqPageItem.addEventListener('click', (_event) => {
        this.nodes.typeSelectHolder.remove()
        selectFaqPageButtonFn(this.context, faqPage)
      })

      faqPageItem.appendChild(faqPageTitle)
      faqPageItem.appendChild(selectFaqPageButton)

      this.nodes.typeSelectHolder.appendChild(faqPageItem)
    }
  }

  /**
   * keyvisual と eyecatch のデータ構造をあわせる
   */
  _keyvisualToEyecatchConverter(episode) {
    if (episode.keyvisuals[0] === undefined) {
      return undefined
    } else {
      return {
        medium: {
          url: episode.keyvisuals[0].small.url,
          width: episode.keyvisuals[0].small.width,
          height: episode.keyvisuals[0].small.height,
        },
      }
    }
  }
}

export default TypeSelectBuilder
