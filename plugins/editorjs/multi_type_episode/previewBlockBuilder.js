import moment from 'moment'
import HTMLElementBuilder from './htmlElementBuilder'

/**
 * プレビューブロックの生成クラス
 */
class PreviewBlockBuilder {
  /**
   * @param {object} context - builder を作ったクラスのインスタンス
   * @param {object} data - plugin save data
   */
  constructor(context, data) {
    this.context = context
    this.data = data
  }

  /**
   * 関連するCSSクラス群
   */
  get CSS() {
    return {
      linkContent: 'multi_type_episode__content',
      linkContentInner: 'multi_type_episode__content_inner',
      linkContentLeftColumn: 'multi_type_episode__left_column',
      linkContentThumbnail: 'multi_type_episode__thumbnail',
      linkContentThumbnailImage: 'multi_type_episode__thumbnail_image',
      linkContentRightColumn: 'multi_type_episode__right_column',
      linkContentSeriesName: 'multi_type_episode__series_name',
      linkContentEpisodeName: 'multi_type_episode__episode_name',
      linkContentFirstBroadcastDate: 'multi_type_episode__first_broadcast_date',
      linkContentCalendarIcon: 'multi_type_episode__calendar_icon',
      linkContentDateText: 'multi_type_episode__date_text',
      linkContentEpisodeDescription: 'multi_type_episode__episode_description',
      linkContentSeeMoreInfo: 'multi_type_episode__see_more_info',
      linkContentDetailButton: 'multi_type_episode__detail_button',
      // recipe
      linkContentSeriesEpisodeName: 'multi_type_episode__series_episode_name',
      linkContentRecipeName: 'multi_type_episode__recipe_name',
      linkContentCookingTime: 'multi_type_episode__cooking_time',
      linkContentAlarmIcon: 'multi_type_episode__alarm_icon',
      linkContentCookingTimeText: 'multi_type_episode__cooking_time_text',
      linkContentRecipeDescription: 'multi_type_episode__recipe_description',
      // howTo
      linkContentHowToName: 'multi_type_episode__how_to_name',
      linkContentHowToSectionName: 'multi_type_episode__how_to_section_name',
      linkContentHowToStepIcon: 'multi_type_episode__how_to_step_icon',
      linkContentHowToSectionNameText:
        'multi_type_episode__how_to_section_name_text',
      linkContentHowToSteps: 'multi_type_episode__how_to_steps',
      linkContentHowToStep: 'multi_type_episode__how_to_step',
      linkContentHowToStepIconBackground:
        'multi_type_episode__how_to_step_icon_background',
      linkContentHowToStepNumber: 'multi_type_episode__how_to_step_number',
      linkContentHowToStepName: 'multi_type_episode__how_to_step_name',
    }
  }

  /**
   * エピソードのプレビューブロックを生成
   */
  buildEpisodeBlock() {
    const holder = new HTMLElementBuilder('div', this.CSS.linkContent).build()

    holder.classList.add(this.CSS.linkContentInner)

    const leftColumn = new HTMLElementBuilder(
      'div',
      this.CSS.linkContentLeftColumn
    ).build()

    holder.appendChild(leftColumn)

    const thumbnailBlock = new HTMLElementBuilder(
      'div',
      this.CSS.linkContentThumbnail
    ).build()

    leftColumn.appendChild(thumbnailBlock)

    const eyecatch = this.data.episode.eyecatch
    const thumbnailImageUrl =
      eyecatch && eyecatch.medium && eyecatch.medium.url
        ? eyecatch.medium.url
        : 'https://via.placeholder.com/150'
    const thumbnailImage = new HTMLElementBuilder(
      'img',
      this.CSS.linkContentThumbnailImage,
      {
        src: thumbnailImageUrl,
        width: 155,
        height: 123,
      }
    ).build()

    thumbnailBlock.appendChild(thumbnailImage)

    const nhkLogoBlock = new HTMLElementBuilder('div').build()
    const nhkLogoImage = new HTMLElementBuilder('img', null, {
      src:
        'https://aw-editorialhands-prod-s3bucket-1p11j035iddh1.s3.ap-northeast-1.amazonaws.com/shrine/development/assets/images/NHK_logo%402x.jpg',
      width: 68,
      height: 19,
    }).build()

    nhkLogoBlock.appendChild(nhkLogoImage)
    leftColumn.appendChild(nhkLogoBlock)

    const rightColumn = new HTMLElementBuilder(
      'div',
      this.CSS.linkContentRightColumn
    ).build()

    holder.appendChild(rightColumn)

    const seriesName = new HTMLElementBuilder(
      'div',
      this.CSS.linkContentSeriesName
    ).build()

    seriesName.textContent = this.data.series.name

    rightColumn.appendChild(seriesName)

    const episodeName = new HTMLElementBuilder(
      'div',
      this.CSS.linkContentEpisodeName
    ).build()

    episodeName.textContent = this.data.episode.name

    rightColumn.appendChild(episodeName)

    const firstBroadcastDateBlock = new HTMLElementBuilder(
      'div',
      this.CSS.linkContentFirstBroadcastDate
    ).build()

    rightColumn.appendChild(firstBroadcastDateBlock)

    const calendarIcon = new HTMLElementBuilder(
      'img',
      this.CSS.linkContentCalendarIcon,
      {
        src:
          'https://aw-editorialhands-prod-s3bucket-1p11j035iddh1.s3.ap-northeast-1.amazonaws.com/shrine/development/assets/images/calendar_icon%402x.jpg',
        width: 15,
        height: 17,
      }
    ).build()

    firstBroadcastDateBlock.appendChild(calendarIcon)

    const dateText = new HTMLElementBuilder(
      'div',
      this.CSS.linkContentDateText
    ).build()

    const date = moment(this.data.episode.firstBroadcastData).locale('ja', {
      weekdays: [
        '日曜日',
        '月曜日',
        '火曜日',
        '水曜日',
        '木曜日',
        '金曜日',
        '土曜日',
      ],
      weekdaysShort: ['日', '月', '火', '水', '木', '金', '土'],
    })

    dateText.textContent = '初回放送日：' + date.format('YYYY年MM月DD日(ddd)')

    firstBroadcastDateBlock.appendChild(dateText)

    const descriptionBlock = new HTMLElementBuilder(
      'div',
      this.CSS.linkContentEpisodeDescription
    ).build()

    descriptionBlock.textContent = this.data.episode.description

    rightColumn.appendChild(descriptionBlock)

    const seeMoreInfoBlock = new HTMLElementBuilder(
      'div',
      this.CSS.linkContentSeeMoreInfo
    ).build()

    rightColumn.appendChild(seeMoreInfoBlock)

    const detailButton = new HTMLElementBuilder(
      'a',
      this.CSS.linkContentDetailButton,
      {
        target: '_blank',
        href: this.data.link,
      }
    ).build()

    detailButton.textContent = '詳しく見る'

    seeMoreInfoBlock.appendChild(detailButton)

    return holder
  }

  /**
   * レシピのプレビューブロックを生成
   */
  buildRecipeBlock() {
    const holder = new HTMLElementBuilder('div', this.CSS.linkContent).build()

    holder.classList.add(this.CSS.linkContentInner)

    const leftColumn = new HTMLElementBuilder(
      'div',
      this.CSS.linkContentLeftColumn
    ).build()

    holder.appendChild(leftColumn)

    const thumbnailBlock = new HTMLElementBuilder(
      'div',
      this.CSS.linkContentThumbnail
    ).build()

    leftColumn.appendChild(thumbnailBlock)

    const images = this.data.recipe.image
    const thumbnailImageUrl =
      images.length > 0 && images[0]
        ? images[0]
        : 'https://via.placeholder.com/150'
    const thumbnailImage = new HTMLElementBuilder(
      'img',
      this.CSS.linkContentThumbnailImage,
      {
        src: thumbnailImageUrl,
        width: 155,
        height: 123,
      }
    ).build()

    thumbnailBlock.appendChild(thumbnailImage)

    const nhkLogoBlock = new HTMLElementBuilder('div').build()
    const nhkLogoImage = new HTMLElementBuilder('img', null, {
      src:
        'https://aw-editorialhands-prod-s3bucket-1p11j035iddh1.s3.ap-northeast-1.amazonaws.com/shrine/development/assets/images/NHK_logo%402x.jpg',
      width: 68,
      height: 19,
    }).build()

    nhkLogoBlock.appendChild(nhkLogoImage)
    leftColumn.appendChild(nhkLogoBlock)

    const rightColumn = new HTMLElementBuilder(
      'div',
      this.CSS.linkContentRightColumn
    ).build()

    holder.appendChild(rightColumn)

    const seriesEpisodeName = new HTMLElementBuilder(
      'div',
      this.CSS.linkContentSeriesEpisodeName
    ).build()

    seriesEpisodeName.textContent =
      this.data.series.name + '「' + this.data.episode.name + '」'

    rightColumn.appendChild(seriesEpisodeName)

    const recipeName = new HTMLElementBuilder(
      'div',
      this.CSS.linkContentRecipeName
    ).build()

    recipeName.textContent = this.data.recipe.name

    rightColumn.appendChild(recipeName)

    const cookingTimeBlock = new HTMLElementBuilder(
      'div',
      this.CSS.linkContentCookingTime
    ).build()

    rightColumn.appendChild(cookingTimeBlock)

    const alarmIcon = new HTMLElementBuilder(
      'img',
      this.CSS.linkContentAlarmIcon,
      {
        src:
          'https://aw-editorialhands-prod-s3bucket-1p11j035iddh1.s3.ap-northeast-1.amazonaws.com/shrine/development/assets/images/alarm_icon%402x.jpg',
        width: 15,
        height: 17,
      }
    ).build()

    cookingTimeBlock.appendChild(alarmIcon)

    const cookingTimeText = new HTMLElementBuilder(
      'div',
      this.CSS.linkContentCookingTimeText
    ).build()

    cookingTimeText.textContent =
      '調理時間：' + this.convertCookingTime(this.data.recipe.cookTime)

    cookingTimeBlock.appendChild(cookingTimeText)

    const descriptionBlock = new HTMLElementBuilder(
      'div',
      this.CSS.linkContentRecipeDescription
    ).build()

    descriptionBlock.textContent = this.data.recipe.description

    rightColumn.appendChild(descriptionBlock)

    const seeMoreInfoBlock = new HTMLElementBuilder(
      'div',
      this.CSS.linkContentSeeMoreInfo
    ).build()

    rightColumn.appendChild(seeMoreInfoBlock)

    const detailButton = new HTMLElementBuilder(
      'a',
      this.CSS.linkContentDetailButton,
      {
        target: '_blank',
        href: this.data.link,
      }
    ).build()

    detailButton.textContent = '詳しく見る'

    seeMoreInfoBlock.appendChild(detailButton)

    return holder
  }

  /**
   * ハウツーのプレビューブロックを生成
   */
  buildHowToBlock() {
    const holder = new HTMLElementBuilder('div', this.CSS.linkContent).build()

    holder.classList.add(this.CSS.linkContentInner)

    const leftColumn = new HTMLElementBuilder(
      'div',
      this.CSS.linkContentLeftColumn
    ).build()

    holder.appendChild(leftColumn)

    const thumbnailBlock = new HTMLElementBuilder(
      'div',
      this.CSS.linkContentThumbnail
    ).build()

    leftColumn.appendChild(thumbnailBlock)

    const images = this.data.howTo.image

    const thumbnailImageUrl =
      images.length > 0 &&
      images[0] &&
      images[0].thumbnail.length > 0 &&
      images[0].thumbnail[0].url
        ? images[0].thumbnail[0].url
        : 'https://via.placeholder.com/150'
    const thumbnailImage = new HTMLElementBuilder(
      'img',
      this.CSS.linkContentThumbnailImage,
      {
        src: thumbnailImageUrl,
        width: 155,
        height: 123,
      }
    ).build()

    thumbnailBlock.appendChild(thumbnailImage)

    const nhkLogoBlock = new HTMLElementBuilder('div').build()
    const nhkLogoImage = new HTMLElementBuilder('img', null, {
      src:
        'https://aw-editorialhands-prod-s3bucket-1p11j035iddh1.s3.ap-northeast-1.amazonaws.com/shrine/development/assets/images/NHK_logo%402x.jpg',
      width: 68,
      height: 19,
    }).build()

    nhkLogoBlock.appendChild(nhkLogoImage)
    leftColumn.appendChild(nhkLogoBlock)

    const rightColumn = new HTMLElementBuilder(
      'div',
      this.CSS.linkContentRightColumn
    ).build()

    holder.appendChild(rightColumn)

    const seriesEpisodeName = new HTMLElementBuilder(
      'div',
      this.CSS.linkContentSeriesEpisodeName
    ).build()

    seriesEpisodeName.textContent =
      this.data.series.name + '「' + this.data.episode.name + '」'

    rightColumn.appendChild(seriesEpisodeName)

    const howToName = new HTMLElementBuilder(
      'div',
      this.CSS.linkContentHowToName
    ).build()

    howToName.textContent = this.data.howTo.name

    rightColumn.appendChild(howToName)

    const sectionNameBlock = new HTMLElementBuilder(
      'div',
      this.CSS.linkContentHowToSectionName
    ).build()

    rightColumn.appendChild(sectionNameBlock)

    const stepIcon = new HTMLElementBuilder(
      'img',
      this.CSS.linkContentHowToStepIcon,
      {
        src:
          'https://aw-editorialhands-prod-s3bucket-1p11j035iddh1.s3.ap-northeast-1.amazonaws.com/shrine/development/assets/images/step_icon%402x.jpg',
        width: 15,
        height: 17,
      }
    ).build()

    sectionNameBlock.appendChild(stepIcon)

    const sectionNameText = new HTMLElementBuilder(
      'div',
      this.CSS.linkContentHowToSectionNameText
    ).build()

    sectionNameText.textContent = this.data.howTo.step[0].name

    sectionNameBlock.appendChild(sectionNameText)

    const stepsBlock = new HTMLElementBuilder(
      'div',
      this.CSS.linkContentHowToSteps
    ).build()

    rightColumn.appendChild(stepsBlock)

    for (const step of this.data.howTo.step[0].itemListElement) {
      const stepBlock = new HTMLElementBuilder(
        'div',
        this.CSS.linkContentHowToStep
      ).build()
      const stepIconBackground = new HTMLElementBuilder(
        'div',
        this.CSS.linkContentHowToStepIconBackground
      ).build()

      stepBlock.appendChild(stepIconBackground)

      const stepNumber = new HTMLElementBuilder(
        'div',
        this.CSS.linkContentHowToStepNumber
      ).build()

      stepNumber.textContent = step.position
      stepIconBackground.appendChild(stepNumber)

      const stepName = new HTMLElementBuilder(
        'div',
        this.CSS.linkContentHowToStepName
      ).build()

      stepName.textContent = step.name
      stepBlock.appendChild(stepName)

      stepsBlock.appendChild(stepBlock)
    }

    const seeMoreInfoBlock = new HTMLElementBuilder(
      'div',
      this.CSS.linkContentSeeMoreInfo
    ).build()

    rightColumn.appendChild(seeMoreInfoBlock)

    const detailButton = new HTMLElementBuilder(
      'a',
      this.CSS.linkContentDetailButton,
      {
        target: '_blank',
        href: this.data.link,
      }
    ).build()

    detailButton.textContent = '詳しく見る'

    seeMoreInfoBlock.appendChild(detailButton)

    return holder
  }

  /**
   * 調理時間を読める形に変換
   */
  convertCookingTime(cookingTime) {
    return cookingTime.replace('PT', '').replace('M', '分')
  }
}

export default PreviewBlockBuilder
