# frozen_string_literal: true

require 'ostruct'

module Editor
  class OpenGraph
    attr_accessor :title, :description, :image, :error

    def initialize(url)
      unless valid?(url)
        self.title = ''
        self.description = ''
        self.image = ''
        return
      end

      @html = get_html(url)

      parse_title
      parse_description
      parse_image(url)
    rescue => e
      self.error = e.message
    end

    private

    def valid?(url)
      uri = URI.parse(url)
      if uri.instance_of? URI::Generic
        self.error = 'http もしくは https を指定してください。'
        return false
      end

      self.error = ''
      true
    rescue URI::InvalidComponentError, URI::InvalidURIError
      self.error = '指定されたURLが不正です。'
      false
    end

    def get_html(url)
      html = Faraday.get(url)
      Nokogiri::HTML.parse(html.body.to_s)
    end

    def parse_title
      og_title = @html.css('//head/meta[property="og:title"]/@content')
      og_site_name = @html.css('//head/meta[property="og:site_name"]/@content')
      self.title = og_title&.to_s.presence || og_site_name&.to_s.presence || @html.title.to_s
    end

    def parse_description
      og_description = @html.css('//head/meta[property="og:description"]/@content')
      description = @html.css('//head/meta[name="description"]/@content')
      self.description = og_description&.to_s.presence || description&.to_s.presence || ''
    end

    def parse_image(content_url)
      og_image = @html.css('//head/meta[property="og:image"]/@content')
      image_url = if og_image.empty?
                    ''
                  else
                    convert_image_url(content_url, og_image.to_s)
                  end
      self.image = OpenStruct.new(url: image_url)
    end

    def convert_image_url(content_url, image_url)
      return image_url unless image_url.start_with?('/')

      uri = URI.parse(content_url)
      "#{uri.scheme}://#{uri.host}#{image_url}"
    end
  end
end
