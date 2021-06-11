# frozen_string_literal: true

class EditorDataToPlainText
  attr_accessor :blocks

  def initialize(editor_data:)
    @blocks = editor_data['blocks']
  end

  def call
    return if blocks.blank?

    plain_text = blocks.map { |block| to_plain_text(block) }.join("\n\n")
    "#{plain_text}\n"
  end

  private

  def strip_html(block)
    Nokogiri::HTML.parse(block).text
  end

  # rubocop:disable Metrics/CyclomaticComplexity, Metrics/MethodLength
  def to_plain_text(block)
    case block['type']
    when 'header'
      to_header_text(block)
    when 'paragraph'
      to_paragraph_text(block)
    when 'linkTool'
      to_link_text(block)
    when 'image'
      to_image_text(block)
    when 'list'
      to_list_text(block)
    when 'embed'
      to_embed_text(block)
    when 'multiTypeEpisode'
      to_episode_text(block)
    end
  end
  # rubocop:enable Metrics/CyclomaticComplexity, Metrics/MethodLength

  def to_header_text(block)
    text = block['data']['text']

    strip_html(convert_inline_br(text))
  end

  def to_paragraph_text(block)
    text = block['data']['text']

    strip_html(convert_inline_br(text))
  end

  def to_link_text(block)
    block.dig('data', 'meta', 'description')
  end

  def to_image_text(block)
    block.dig('data', 'caption')
  end

  def to_list_text(block)
    items = block.dig('data', 'items')
    prefix = block.dig('data', 'style') == 'ordered' ? '1.' : '･'

    items.map { |item| "#{prefix} #{strip_html(convert_inline_br(item))}" }.join("\n")
  end

  def to_embed_text(block)
    block.dig('data', 'caption')
  end

  def to_episode_text(block)
    block.dig('data', 'episode', 'name')
  end

  def convert_inline_br(text)
    text.gsub(%r{</?br></b>}) { '' }
        .gsub(%r{</?br></i>}) { '' }
        .gsub(%r{</?br>}) { "\n" }
  end
end
