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
    text = trim_space(block['data']['text'])
    level = block['data']['level']

    "#{'#' * level} #{convert_inline_html_tags(text)}"
  end

  def to_text_markdown(block)
    text = trim_space(block['data']['text'])
    convert_inline_html_tags(text)
  end

  def to_image_markdown(block)
    url = block.dig('data', 'file', 'url')
    caption = trim_space(block.dig('data', 'caption'))

    return nil unless url.present?

    if caption.present?
      "![](#{url} \"#{caption}\")"
    else
      "![](#{url})"
    end
  end

  def to_link_markdown(block)
    description = trim_space(block.dig('data', 'meta', 'description'))
    url = block.dig('data', 'link')

    return nil unless url.present?

    "[#{description.presence || url}](#{url})"
  end

  def to_list_markdown(block)
    items = block.dig('data', 'items')
    prefix = block.dig('data', 'style') == 'ordered' ? '1.' : '-'

    items.map { |item| "#{prefix} #{convert_inline_html_tags(trim_space(item))}" }.join("\n")
  end

  def to_embed_markdown(block)
    url = block.dig('data', 'source')
    caption = trim_space(block.dig('data', 'caption'))

    return nil unless url.present?

    "[#{caption.presence || url}](#{url})"
  end

  # FIXME: 変換方法について決める
  # NOTE: 社会実証では利用しない
  def to_episode_markdown(block)
    link = block.dig('data', 'link')
    episode_name = block.dig('data', 'episode', 'name')

    "[#{episode_name}](#{link})"
  end

  def convert_inline_html_tags(text)
    cleanup_inner_inline_html_tag(text)
      .gsub(%r{<[b|i]></[b|i]>}, '') # 空タグの削除
      .gsub(%r{</?b>}, '**')
      .gsub(%r{</?i>}, '*')
      .gsub(/<br>/, "  \n") # NOTE: shift+enterキーで<br>が入力できる
  end

  # b, iタグ内の先頭、末尾のtrimと<br>タグを削除
  # @param [String] text
  # @return [String]
  def cleanup_inner_inline_html_tag(text)
    text
      .gsub(%r{(?<=<b>).*?(?=</b>)}) { |s| trim_inner_tag(s) }
      .gsub(%r{(?<=<i>).*?(?=</i>)}) { |s| trim_inner_tag(s) }
  end

  def trim_inner_tag(text)
    trimmed = trim_space(text)
    trimmed.gsub(/<br.*?>/, '<br>').delete_prefix('<br>').delete_suffix('<br>')
  end

  # 全角スペース、&nbsp;を含むスペースのtrim
  def trim_space(text)
    text&.gsub(/&nbsp;/, ' ')&.gsub(/(^[[:space:]]+)|([[:space:]]+$)/, '')&.strip
  end
end
