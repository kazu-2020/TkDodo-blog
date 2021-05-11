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
      linkContentNhkLogoImage: 'multi_type_episode__nhk_logo_image',
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
      // event
      linkContentEventCalendar: 'multi_type_episode__event_calendar',
      linkContentEventCalendarInner: 'multi_type_episode__event_calendar_inner',
      linkContentEventCalendarYearMonth:
        'multi_type_episode__event_calendar_year_month',
      linkContentEventCalendarDate: 'multi_type_episode__event_calenar_date',
      linkContentEventDayOfTheWeek: 'multi_type_episode__event_day_of_the_week',
      linkContentEventCalendarSunday: 'sunday',
      linkContentEventCalendarSaturday: 'saturday',
      linkContentEventName: 'multi_type_episode__event_name',
      linkContentEventDate: 'multi_type_episode__event_date',
      linkContentEventDateText: 'multi_type_episode__event_date_text',
      linkContentEventLocation: 'multi_type_episode__event_location',
      linkContentEventPinIcon: 'multi_type_episode__event_pin_icon',
      linkContentEventLocationText: 'multi_type_episode__event_location_text',
      // faq page
      linkContentFaqEpisodeName: 'multi_type_episode__faqpage_episode_name',
      linkContentFaqQuestion: 'multi_type_episode__faqpage_question',
      linkContentFaqSeeMoreInfo: 'multi_type_episode__faq_page_see_more_info',
      linkContentFaqNhkLogoImage: 'multi_type_episode__faqpage_nhk_logo_image',
      linkContentFaqDetailButton: 'multi_type_episode__faqpage_detail_button',
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
        : 'https://via.placeholder.com/160x90'
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
    const nhkLogoImage = new HTMLElementBuilder(
      'img',
      this.CSS.linkContentNhkLogoImage,
      {
        src: '/NHK_logo%402x.jpg',
        width: 68,
        height: 19,
      }
    ).build()

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
        src: '/calendar_icon%402x.jpg',
        width: 15,
        height: 17,
      }
    ).build()

    firstBroadcastDateBlock.appendChild(calendarIcon)

    const dateText = new HTMLElementBuilder(
      'div',
      this.CSS.linkContentDateText
    ).build()

    const date = this.momentWrapper(this.data.episode.firstBroadcastData)
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
        : 'https://via.placeholder.com/160x90'
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
      src: '/NHK_logo%402x.jpg',
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
        src: '/alarm_icon%402x.jpg',
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
      images &&
      images.length > 0 &&
      images[0] &&
      images[0].thumbnail &&
      images[0].thumbnail.length > 0 &&
      images[0].thumbnail[0].url
        ? images[0].thumbnail[0].url
        : 'https://via.placeholder.com/160x90'
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
      src: '/NHK_logo%402x.jpg',
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
        src: '/step_icon%402x.jpg',
        width: 15,
        height: 17,
      }
    ).build()

    sectionNameBlock.appendChild(stepIcon)

    if (this.data.howTo.section && this.data.howTo.section.length > 0) {
      const sectionNameText = new HTMLElementBuilder(
        'div',
        this.CSS.linkContentHowToSectionNameText
      ).build()

      sectionNameText.textContent = this.data.howTo.section[0].step[0].name

      sectionNameBlock.appendChild(sectionNameText)

      const stepsBlock = new HTMLElementBuilder(
        'div',
        this.CSS.linkContentHowToSteps
      ).build()

      rightColumn.appendChild(stepsBlock)

      this.data.howTo.section[0].step.slice(0, 3).forEach((step, index) => {
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

        stepNumber.textContent = index + 1
        stepIconBackground.appendChild(stepNumber)

        const stepName = new HTMLElementBuilder(
          'div',
          this.CSS.linkContentHowToStepName
        ).build()

        stepName.textContent = step.name
        stepBlock.appendChild(stepName)

        stepsBlock.appendChild(stepBlock)
      })
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
        href: `https://dev-www.nhk.jp/p/${this.data.series.aliasId}/ts/${this.data.howTo.identifierGroup.seriesId}/howto/${this.data.howTo.id}/`,
      }
    ).build()

    detailButton.textContent = '詳しく見る'

    seeMoreInfoBlock.appendChild(detailButton)

    return holder
  }

  /**
   * イベントのプレビューブロックを生成
   */
  buildEventBlock() {
    const holder = new HTMLElementBuilder('div', this.CSS.linkContent).build()

    holder.classList.add(this.CSS.linkContentInner)

    const leftColumn = new HTMLElementBuilder(
      'div',
      this.CSS.linkContentLeftColumn
    ).build()

    holder.appendChild(leftColumn)

    const calendarBlock = new HTMLElementBuilder(
      'div',
      this.CSS.linkContentEventCalendar
    ).build()

    leftColumn.appendChild(calendarBlock)

    const calendarInnerBlock = new HTMLElementBuilder(
      'div',
      this.CSS.linkContentEventCalendarInner
    ).build()

    calendarBlock.appendChild(calendarInnerBlock)

    const calendarYearMonthBlock = new HTMLElementBuilder(
      'div',
      this.CSS.linkContentEventCalendarYearMonth
    ).build()

    const startDate = this.momentWrapper(this.data.event.startDate)
    const endDate = this.momentWrapper(this.data.event.endDate)
    calendarYearMonthBlock.textContent = startDate.format('YYYY年MM月')

    calendarInnerBlock.appendChild(calendarYearMonthBlock)

    const calendarDate = new HTMLElementBuilder(
      'div',
      this.CSS.linkContentEventCalendarDate
    ).build()
    calendarDate.textContent = startDate.format('DD')

    calendarInnerBlock.appendChild(calendarDate)

    const calendarDayOfTheWeek = new HTMLElementBuilder(
      'div',
      this.CSS.linkContentEventDayOfTheWeek
    ).build()
    calendarDayOfTheWeek.textContent = startDate.format('dddd')
    switch (startDate.weekday()) {
      case 0: // Sunday
        calendarDayOfTheWeek.classList.add(
          this.CSS.linkContentEventCalendarSunday
        )
        break
      case 6: // Saturday
        calendarDayOfTheWeek.classList.add(
          this.CSS.linkContentEventCalendarSaturday
        )
        break
    }
    calendarInnerBlock.appendChild(calendarDayOfTheWeek)

    const nhkLogoBlock = new HTMLElementBuilder('div').build()
    const nhkLogoImage = new HTMLElementBuilder('img', null, {
      src: '/NHK_logo%402x.jpg',
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

    const eventName = new HTMLElementBuilder(
      'div',
      this.CSS.linkContentEventName
    ).build()

    eventName.textContent = this.data.event.name

    rightColumn.appendChild(eventName)

    const eventDateBlock = new HTMLElementBuilder(
      'div',
      this.CSS.linkContentEventDate
    ).build()
    rightColumn.appendChild(eventDateBlock)

    const calendarIcon = new HTMLElementBuilder(
      'img',
      this.CSS.linkContentCalendarIcon,
      {
        src: '/calendar_icon%402x.jpg',
        width: 15,
        height: 17,
      }
    ).build()

    eventDateBlock.appendChild(calendarIcon)

    const eventDateText = new HTMLElementBuilder(
      'div',
      this.CSS.linkContentEventDateText
    ).build()

    const displayEndDate =
      startDate.dayOfYear() === endDate.dayOfYear()
        ? endDate.format('H:mm')
        : endDate.format('M/D(ddd) H:mm')
    eventDateText.textContent =
      startDate.format('YYYY/M/D(ddd) H:mm') + ' ~ ' + displayEndDate

    eventDateBlock.appendChild(eventDateText)

    const locationBlock = new HTMLElementBuilder(
      'div',
      this.CSS.linkContentEventLocation
    ).build()

    rightColumn.appendChild(locationBlock)

    const pinIcon = new HTMLElementBuilder(
      'img',
      this.CSS.linkContentEventPinIcon,
      {
        src: '/pin_icon%402x.jpg',
        width: 13,
        height: 20,
      }
    ).build()

    locationBlock.appendChild(pinIcon)

    const locationText = new HTMLElementBuilder(
      'div',
      this.CSS.linkContentEventLocationText
    ).build()

    locationText.textContent =
      this.data.event.place + ' (' + this.data.event.postalAddress + ')'

    locationBlock.appendChild(locationText)

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
   * FAQのプレビューブロックを生成
   */
  buildFaqPageBlock() {
    const holder = new HTMLElementBuilder('div', this.CSS.linkContent).build()

    holder.classList.add(this.CSS.linkContentInner)

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
      this.CSS.linkContentFaqEpisodeName
    ).build()
    episodeName.textContent = this.data.episode.name
    rightColumn.appendChild(episodeName)

    const faqPageName = new HTMLElementBuilder(
      'div',
      this.CSS.linkContentEpisodeName
    ).build()

    faqPageName.textContent = this.data.faqPage.name

    rightColumn.appendChild(faqPageName)

    const descriptionBlock = new HTMLElementBuilder(
      'div',
      this.CSS.linkContentEpisodeDescription
    ).build()

    this.data.faqPage.questions.slice(0, 3).forEach((question) => {
      const questionBlock = new HTMLElementBuilder(
        'div',
        this.CSS.linkContentFaqQuestion
      ).build()
      questionBlock.textContent = 'Q. ' + question.name
      descriptionBlock.appendChild(questionBlock)
    })

    rightColumn.appendChild(descriptionBlock)

    const seeMoreInfoBlock = new HTMLElementBuilder(
      'div',
      this.CSS.linkContentFaqSeeMoreInfo
    ).build()

    rightColumn.appendChild(seeMoreInfoBlock)

    const nhkLogoBlock = new HTMLElementBuilder('div').build()
    const nhkLogoImage = new HTMLElementBuilder(
      'img',
      this.CSS.linkContentFaqNhkLogoImage,
      {
        src: '/NHK_logo%402x.jpg',
        width: 68,
        height: 19,
      }
    ).build()

    nhkLogoBlock.appendChild(nhkLogoImage)
    seeMoreInfoBlock.appendChild(nhkLogoBlock)

    const detailButton = new HTMLElementBuilder(
      'a',
      this.CSS.linkContentFaqDetailButton,
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

  /**
   * 日時を扱う moment のインスタンスを作るメソッド
   */
  momentWrapper(date) {
    return moment(date).locale('ja', {
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
  }
}

export default PreviewBlockBuilder
