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
import BlockState from './blockState.js'
import HTMLElementBuilder from './htmlElementBuilder'
import TypeSelectBuilder from './typeSelectBuilder.js'
import EpisodeSelectBuilder from './episodeSelectBuilder.js'
import PreviewBlockBuilder from './previewBlockBuilder.js'

/**
 * @typedef {object} UploadResponseFormat
 * @description This format expected from backend on link data fetching
 * @property {number} success  - 1 for successful uploading, 0 for failure
 * @property {metaData} meta - Object with link data.
 *
 * Tool may have any data provided by backend, currently are supported by design:
 * title, description, image, url
 */
export default class MulitTypeEpisode {
  /**
   * Get Tool toolbox settings
   * icon - Tool icon's SVG
   * title - title to show in toolbox
   *
   * @return {{icon: string, title: string}}
   */
  static get toolbox() {
    return {
      title: 'MulitTypeEpisode',
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
    }

    this.data = {
      link: data.link || '',
      episodeId: data.episodeId || '',
      episode: data.episode || {},
      series: data.series || {},
      recipe: data.recipe || {},
      howTo: data.howTo || {},
      selectedType: data.selectedType || 'none',
    }

    const initialState =
      this.data.selectedType === 'none' ? 'input' : 'selected'
    this.blockState = new BlockState(this.api, initialState)

    this.episodeBundle = {}

    this.settings = [
      {
        displayName: 'タイプ切り替え',
        icon:
          '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1em" height="1em" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M14 4l2.29 2.29l-2.88 2.88l1.42 1.42l2.88-2.88L20 10V4M10 4H4v6l2.29-2.29l4.71 4.7V20h2v-8.41l-5.29-5.3"/><rect x="0" y="0" width="24" height="24" fill="rgba(0, 0, 0, 0)" /></svg>',
      },
    ]
  }

  /**
   * 関連するCSSクラス群
   */
  get CSS() {
    return {
      container: 'multi_type_episode',
      baseClass: this.api.styles.block,
    }
  }

  /**
   * ブロックの表示領域をリセット
   */
  resetContainerElement() {
    this.nodes.container.remove()
    this.nodes.container = new HTMLElementBuilder(
      'div',
      this.CSS.container
    ).build()
    this.nodes.wrapper.appendChild(this.nodes.container)
  }

  /**
   * Renders Block content
   * @public
   *
   * @return {HTMLDivElement}
   */
  render() {
    this.nodes.wrapper = new HTMLElementBuilder(
      'div',
      this.CSS.baseClass
    ).build()
    this.nodes.container = new HTMLElementBuilder(
      'div',
      this.CSS.container
    ).build()

    /**
     * If Tool already has data, render link preview, otherwise insert input
     */
    if (Object.keys(this.data.episode).length) {
      switch (this.data.selectedType) {
        case 'episode':
          this.showEpisodeHowToLinkPreview()
          break
        case 'recipe':
          this.showEpisodeRecipeLinkPreview()
          break
        case 'howTo':
          this.showEpisodeHowToLinkPreview()
          break
      }
    } else {
      const inputHolder = new EpisodeSelectBuilder(
        this,
        this.api,
        this.config
      ).build(this.onSuccessFetchingEpisode)

      this.nodes.container.appendChild(inputHolder)
    }

    this.nodes.wrapper.appendChild(this.nodes.container)

    return this.nodes.wrapper
  }

  /**
   * Renders Block Settings
   * @public
   *
   * @return {HTMLDivElement}
   */
  renderSettings() {
    const wrapper = document.createElement('div')

    this.settings.forEach((tune) => {
      const button = document.createElement('div')

      button.classList.add('cdx-settings-button')

      button.innerHTML = tune.icon
      wrapper.appendChild(button)

      this.api.tooltip.onHover(button, tune.displayName, { placement: 'top' })

      button.addEventListener('click', () => {
        this._switchToSelectView()
      })
    })

    return wrapper
  }

  /**
   * @private
   * Click on the Settings Button
   * @param {string} tune — tune name from this.settings
   */
  async _switchToSelectView() {
    if (!this.blockState.canTrasitToState('select')) {
      return
    }
    this.blockState.transitToState('select')

    if (Object.keys(this.episodeBundle).length === 0) {
      try {
        const response = await ajax.get({
          url:
            this.config.endpoint +
            '/episodes/' +
            this.data.episodeId +
            '/bundle',
        })

        this.episodeBundle = response.body
        this._renderSelectType()
      } catch (error) {
        this.api.notifier.show({
          message: '必要なデータを取得できませんでした',
          style: 'error',
        })
        this.blockState.transitToState('selected')
        console.log(error)
      }
    } else {
      this._renderSelectType()
    }
  }

  /**
   * タイプ変更状態を表示するための切り替え処理
   */
  _renderSelectType() {
    this.resetContainerElement()

    const builder = new TypeSelectBuilder(this, this.episodeBundle)
    const node = builder.build(
      this._switchToEpisodeBlock,
      this._switchToRecipeBlock,
      this._switchToHowToBlock
    )

    this.nodes.container.appendChild(node)
  }

  /**
   * エピソードブロックへの切り替え処理
   */
  _switchToEpisodeBlock(that, episode) {
    that.data = Object.assign(that.data, {
      link: episode.url,
      episode: {
        eyecatch: episode.eyecatch,
        name: episode.name,
        description: episode.description,
      },
      recipe: {},
      howTo: {},
      episodeId: episode.id,
      selectedType: 'episode',
    })
    that.showEpisodeLinkPreview()
  }

  /**
   * レシピブロックへの切り替え処理
   */
  _switchToRecipeBlock(that, recipe) {
    that.data = Object.assign(that.data, {
      link: recipe.url,
      howTo: {},
      recipe,
      selectedType: 'recipe',
    })

    that.showEpisodeRecipeLinkPreview()
  }

  /**
   * ハウツーブロックへの切り替え処理
   */
  _switchToHowToBlock(that, howTo) {
    that.data = Object.assign(that.data, {
      link: howTo.url,
      recipe: {},
      howTo,
      selectedType: 'howTo',
    })
    that.showEpisodeHowToLinkPreview()
  }

  /**
   * エピソード取得成功したときの処理
   */
  onSuccessFetchingEpisode(that, response) {
    that.data.selectedType = 'episode'
    that.blockState.transitToState('selected')

    that.episodeBundle = response
    const episode = response.tvEpisode

    that.data = Object.assign(that.data, {
      link: episode.url,
      episode: {
        eyecatch: episode.eyecatch,
        name: episode.name,
        description: episode.description,
        firstBroadcastDate: episode.releasedEvent.startDate,
      },
      series: {
        name: response.tvSeries.name,
      },
      episodeId: episode.id,
    })
    that.showEpisodeLinkPreview()
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
   * Compose link preview from fetched data
   * @param {metaData} meta - link meta data
   */
  showEpisodeLinkPreview() {
    const previewBlockHolder = new PreviewBlockBuilder(this, this.data)

    this.nodes.container.appendChild(previewBlockHolder.buildEpisodeBlock())
  }

  /**
   * レシピブロックを表示
   */
  showEpisodeRecipeLinkPreview() {
    const previewBlockHolder = new PreviewBlockBuilder(this, this.data)

    this.nodes.container.appendChild(previewBlockHolder.buildRecipeBlock())
  }

  /**
   * ハウツーブロックを表示
   */
  showEpisodeHowToLinkPreview() {
    const previewBlockHolder = new PreviewBlockBuilder(this, this.data)

    this.nodes.container.appendChild(previewBlockHolder.buildHowToBlock())
  }
}
