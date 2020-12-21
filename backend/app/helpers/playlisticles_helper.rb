# frozen_string_literal: true

module PlaylisticlesHelper
  def build_editable_sections(playlist)
    result = []

    # Header section を作る
    result << build_header_section(playlist)
    # Episode section を作る
    result << build_episode_sections(playlist)
    # Footer section を作る
    result << build_footer_section

    result.flatten
  end

  def build_header_section(playlist)
    {
      id: 'header_editor',
      type: 'header',
      icon: 'mdi-page-layout-header',
      text: 'Header',
      data: {
        time: Time.current.to_i,
        blocks: [
          build_h_block(level: 2, text: "Header - ex. #{playlist[:name]}"),
          build_paragraph_block(text: 'これから書いていくプレイリスティクルを楽しく読んでもらうため、できるだけ説明を加えましょう！'),
          build_paragraph_block(text: "ex. #{playlist[:description]}")
        ]
      }
    }
  end

  def build_footer_section
    {
      id: 'footer_editor',
      type: 'footer',
      icon: 'mdi-page-layout-footer',
      text: 'Footer',
      data: {
        time: Time.current.to_i,
        blocks: [
          build_h_block(level: 2, text: 'Footer - まとめ'),
          build_paragraph_block(text: 'Footer のテキストです。\nここは記事のまとめ等を書くエリアであり、表示場所の変更はできません。'),
          build_paragraph_block(text: '最後まで読んでいただき、ありがとうございました。この記事で紹介した様々なことが、お役に立ちますように。')
        ]
      }
    }
  end

  # rubocop:disable Metrics/MethodLength
  def build_episode_sections(playlist)
    playlist[:items].map do |episode|
      {
        id: episode[:id],
        type: 'body',
        icon: 'mdi-drag',
        text: episode[:name],
        data: {
          time: Time.current.to_i,
          blocks: [
            build_h_block(level: 3, text: episode[:name]),
            build_episode_block(episode: episode),
            build_paragraph_block(text: episode[:description])
          ]
        }
      }
    end
  end
  # rubocop:enable Metrics/MethodLength

  private

  def build_h_block(level:, text:)
    {
      type: 'header',
      data: {
        text: text,
        level: level
      }
    }
  end

  def build_paragraph_block(text:)
    {
      type: 'paragraph',
      data: {
        text: text
      }
    }
  end

  def build_episode_block(episode:)
    {
      type: 'episode',
      data: {
        url: episode[:url],
        episode: episode
      }
    }
  end
end
