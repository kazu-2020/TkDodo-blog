# frozen_string_literal: true

class EditorDataToMarkdown
  attr_accessor :blocks

  def initialize(editor_data:)
    @blocks = editor_data['blocks']
  end

  def call
    return if blocks.blank?

    markdown = blocks.map { |block| to_markdown(block) }.join("\n\n")
    "#{markdown}\n"
  end

  # rubocop:disable Metrics/CyclomaticComplexity, Metrics/MethodLength
  def to_markdown(block)
    case block['type']
    when 'header'
      to_header_markdown(block)
    when 'paragraph'
      to_text_markdown(block)
    when 'image'
      to_image_markdown(block)
    when 'linkTool'
      to_link_markdown(block)
    when 'list'
      to_list_markdown(block)
    when 'embed'
      to_embed_markdown(block)
    when 'multiTypeEpisode'
      to_episode_markdown(block)
    end
  end
  # rubocop:enable Metrics/CyclomaticComplexity, Metrics/MethodLength

  def to_header_markdown(block)
    "## #{convert_inline_html_tags(block['data']['text'])}"
  end

  def to_text_markdown(block)
    convert_inline_html_tags(block['data']['text'])
  end

  def convert_inline_html_tags(text)
    text.gsub(%r{</?br></b>}) { '**' }
        .gsub(%r{</?br></i>}) { '*' }
        .gsub(%r{</?b>}) { '**' }
        .gsub(%r{</?i>}) { '*' }
        .gsub(%r{</?br>}) { "  \n" }
  end

  def to_image_markdown(block)
    url = block.dig('data', 'file', 'url')
    caption = block.dig('data', 'caption')

    return nil unless url.present?

    if caption.present?
      "![](#{url} \"#{caption}\")"
    else
      "![](#{url})"
    end
  end

  def to_link_markdown(block)
    description = block.dig('data', 'meta', 'description')
    url = block.dig('data', 'link')

    return nil unless url.present?

    "[#{description.presence || url}](#{url})"
  end

  def to_list_markdown(block)
    items = block.dig('data', 'items')
    prefix = block.dig('data', 'style') == 'ordered' ? '1.' : '-'

    items.map { |item| "#{prefix} #{convert_inline_html_tags(item)}" }.join("\n")
  end

  def to_embed_markdown(block)
    url = block.dig('data', 'source')
    caption = block.dig('data', 'caption')

    return nil unless url.present?

    "[#{caption.presence || url}](#{url})"
  end

  # FIXME: 変換方法について決める
  def to_episode_markdown(block)
    link = block.dig('data', 'link')
    episode_name = block.dig('data', 'episode', 'name')

    "[#{episode_name}](#{link})"
  end
end
