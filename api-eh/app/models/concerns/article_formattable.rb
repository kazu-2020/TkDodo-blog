# frozen_string_literal: true

module ArticleFormattable
  extend ActiveSupport::Concern

  included do
    before_save :set_bodies

    def set_bodies
      trim_empty_image_block
      set_marked_body
      set_article_body
    end

    def trim_empty_image_block
      return if editor_data.blank? || editor_data['blocks'].blank?

      trimmed_editor_blocks = editor_data['blocks'].delete_if do |block|
        block['type'] == 'image' && block['data']['file'].empty?
      end
      editor_data['blocks'] = trimmed_editor_blocks
    end

    def set_marked_body
      return if editor_data.blank?

      self.marked_body = EditorDataToMarkdown.new(editor_data: editor_data).call
    end

    def set_article_body
      return if editor_data.blank?

      self.article_body = EditorDataToPlainText.new(editor_data: editor_data).call
    end

    def touch_playlist
      playlist.touch
    end
  end
end
