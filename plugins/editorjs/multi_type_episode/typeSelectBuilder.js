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
    }
  }

  /**
   * マークアップを生成するメソッド
   */
  build(selectEpisodeButtonFn, selectRecipeButtonFn, selectHowToButtonFn) {
    this._showTypeSelectorHeader()
    this._showEpisodeItem(selectEpisodeButtonFn)
    this._showRecipeItems(selectRecipeButtonFn)
    this._showHowToItems(selectHowToButtonFn)

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

    const episodeThumbnail = new HTMLElementBuilder(
      'div',
      this.CSS.playlistItemThumbnail
    ).build()
    const imageUrl =
      episode.eyecatch && episode.eyecatch.medium
        ? episode.eyecatch.medium.url
        : 'https://via.placeholder.com/32'

    episodeThumbnail.style.backgroundImage = 'url(' + imageUrl + ')'

    const episodeTitle = new HTMLElementBuilder(
      'div',
      this.CSS.playlistItemTitle
    ).build()

    episodeTitle.textContent = '[Ep]' + episode.name
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
          : 'https://via.placeholder.com/32'

      recipeThumbnail.style.backgroundImage = 'url(' + imageUrl + ')'

      const recipeTitle = new HTMLElementBuilder(
        'div',
        this.CSS.playlistItemTitle
      ).build()

      recipeTitle.textContent = '[Rc]' + recipe.name

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
      // this.nodes.container.appendChild(this.nodes.typeSelectHolder);
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
      const imageUrl =
        howTo.image && howTo.image.length >= 1
          ? howTo.image[0].thumbnail[0].url
          : 'https://via.placeholder.com/32'

      howToThumbnail.style.backgroundImage = 'url(' + imageUrl + ')'

      const howToTitle = new HTMLElementBuilder(
        'div',
        this.CSS.playlistItemTitle
      ).build()

      howToTitle.textContent = '[Ht]' + howTo.name

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
      // this.nodes.container.appendChild(this.nodes.typeSelectHolder);
    }
  }
}

export default TypeSelectBuilder
