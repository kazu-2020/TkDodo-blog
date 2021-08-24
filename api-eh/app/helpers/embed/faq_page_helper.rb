# frozen_string_literal: true

module Embed::FaqPageHelper
  def faq_page_url
    "https://www.nhk.jp/p/ts/#{@episode_data.dig(:identifierGroup, :seriesId)}/faqpage/#{@faq_page_data[:id]}"
  end
end
