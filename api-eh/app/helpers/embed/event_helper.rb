# frozen_string_literal: true

module Embed::EventHelper
  def event_image_src
    @event_data.dig(:image, :medium, :url) || episode_image_src
  end

  # Eventの開催日時
  #
  # @return [String]
  #   2021年7月1日(木) 00:00〜01:00
  #   2021年7月1日(木) 00:00〜12月31日(金) 23:59
  #   2021年7月1日(木) 00:00〜2022年01月01日(金) 00:00
  def event_datetime_label
    start_date = Time.parse(@event_data[:startDate])
    parsed_start_date = I18n.l(start_date, format: :long_date)
    end_date = Time.parse(@event_data[:endDate])
    # 同日なら時分のみ、同年なら月日のみ
    end_date_format = if start_date.day == end_date.day
                        :only_hm
                      elsif start_date.year == end_date.year
                        :short_date
                      else
                        :long_date
                      end

    parsed_end_date = I18n.l(end_date, format: end_date_format)

    "#{parsed_start_date}〜#{parsed_end_date}"
  end

  # Eventの募集日
  #
  # @return [String]
  #   2021年7月1日〜12月31日
  #   2021年7月1日〜2022年1月1日
  def event_offer_date_label
    return if blank_event_offers?

    parsed_from = offers_valid_from_date && I18n.l(offers_valid_from_date, format: :default_ja)
    "#{parsed_from}〜#{parsed_valid_through}"
  end

  def blank_event_offers?
    @event_data[:offersValidFrom].blank? && @event_data[:offersValidThrough].blank?
  end

  def event_offer_status_label(time = Time.current)
    return if blank_event_offers?

    check_valid_from = @event_data[:offersValidFrom].blank? ? time.yesterday : Time.parse(@event_data[:offersValidFrom])
    check_valid_through = if @event_data[:offersValidThrough].blank?
                            time.tomorrow
                          else
                            Time.parse(@event_data[:offersValidThrough])
                          end
    time.between?(check_valid_from, check_valid_through) ? '参加者募集中' : '募集期間外'
  end

  def event_date_status_label(time = Time.current)
    return '開催前' if time < Time.parse(@event_data[:startDate])
    return '開催終了' if time > Time.parse(@event_data[:endDate])

    '開催中'
  end

  private

  # @return [Date]
  def offers_valid_from_date
    return nil if @event_data[:offersValidFrom].blank?

    Time.parse(@event_data[:offersValidFrom]).to_date
  end

  # @return [Date]
  def offers_valid_through_date
    return nil if @event_data[:offersValidThrough].blank?

    Time.parse(@event_data[:offersValidThrough]).to_date
  end

  def parsed_valid_through
    return nil if offers_valid_through_date.blank?

    # valid_fromが設定されていて同年なら月日のみ
    format = if offers_valid_from_date.present? && offers_valid_from_date&.year == offers_valid_through_date&.year
               :short_ja
             else
               :default_ja
             end

    offers_valid_through_date && I18n.l(offers_valid_through_date, format: format)
  end
end
