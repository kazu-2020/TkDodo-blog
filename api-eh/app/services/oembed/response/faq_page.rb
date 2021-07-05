# frozen_string_literal: true

class Oembed::Response::FaqPage
  include Oembed::Response::Respondable

  # rubocop:disable Metrics/MethodLength
  def response
    res = DlabApiClient.new(api_endpoint: 'https://api.nr.nhk.jp').faq_page(faq_page_id: extract_faq_page_id)
    episode_id = res.dig(:identifierGroup, :episodeId)

    raise DlabApiClient::NotFound if episode_id.blank?

    src = "#{src_host}/embed/te/#{episode_id}/faqpage/#{extract_faq_page_id}"
    height ||= 340
    {
      version: '1.0',
      width: 620,
      height: height,
      type: 'rich',
      provider_name: 'NHK',
      provider_url: 'https://www.nhk.jp',
      url: url,
      title: res[:name] || 'Dummy',
      thumbnail_width: res.dig(:image, :medium, :width) || 640,
      thumbnail_height: res.dig(:image, :medium, :height) || 360,
      thumbnail_url: res.dig(:image, :medium, :url) || 'http://placehold.jp/640x360.png',
      html: "<iframe width=\"100%\" height=\"#{height}\" src=\"#{src}\" frameborder=\"0\"></iframe>"
    }
  end
  # rubocop:enable Metrics/MethodLength

  private

  def extract_faq_page_id
    url[%r{https?://.*nhk.jp.*/p/.*/faqpage/([0-9]+)}, 1]
  end
end
